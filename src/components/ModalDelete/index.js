import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  today,
  monthCurr,
  yearCurr,
  sunDay,
  sunSemana,
  sunQuinzena,
  sunMes,
  matchDateType,
  dateFormat,
  dateBigerThan,
} from '../../services/Dates';
import './style.css'


function displayAction(display) {
  return {
    type: 'modalDeleteDisplay',
    display,
  }
}

function action(json) {
  return {
    type: 'load',
    json,
  }
}

function actionElemsRender(elems) {
  return {
    type: 'elemsRender',
    elems,
  }
}

function actionRelated(related) {
  return {
    type: 'related',
    related,
  }
}

function actionNotifications(intersections) {
  return {
    type: 'notification',
    intersections,
  }
}

class ModalDelete extends Component {
  constructor(props) {
    super(props);
    this.btnDelete = this.btnDelete.bind(this);
  }

  btnDelete() {
    const { modal: { id, index }, arquivo, dispatch, day, month, year, elems, related } = this.props;
    delete arquivo[dateFormat(day, month, year)][index][id];
    delete elems[index][id];
    this.deleteAllRelatedById(id);
    dispatch(actionRelated(related));
    dispatch(action(arquivo));
    dispatch(actionElemsRender(elems));
    dispatch(displayAction('none'));
    dispatch(actionNotifications(this.notification()));
  }

  relatedElems(elems, type, sunCb, color) {
    const { day, month, year, related } = this.props;
    Object.keys(related[type]).forEach((relatedId) => {
      const [startDate, index, serv, endDate] = related[type][relatedId];
      if (matchDateType(startDate, dateFormat(day, month, year), sunCb)
        && this.endDateFunc(endDate, dateFormat(day, month, year))) {
        elems[index][relatedId] = { ...serv, color };
      }
    });
    return elems;
  }

  endDateFunc(endDate, dateFormat) {
    if (endDate) return dateBigerThan(endDate, dateFormat);
    return true;
  }

  switchType(elems, type) {
    switch(type) {
      case 'semanal':
        return this.relatedElems(elems, type, sunSemana, 'rgb(40, 145, 55)');
      case 'quinzenal':
        return this.relatedElems(elems, type, sunQuinzena, 'rgb(51, 69, 98)');
      case 'mensal':
        return this.relatedElems(elems, type, sunMes, 'rgb(192, 36, 98)');
      default:
        return;
    }
  }

  initRelatedServ(day, month, year) {
    let { arquivo, elems } = this.props;
    elems = arquivo[dateFormat(day, month, year)];
    return this.switchType(
            this.switchType(
              this.switchType(elems, 'semanal'),
            'quinzenal'),
          'mensal');
  }

  servIntersection(day, month, year) {
    const elems = this.initRelatedServ(day, month, year);
    const intersections = {};
    elems.forEach((elem, index) => {
      const obj = Object.entries(elem)
        .sort((a, b) => (a[1].top) > b[1].top ? 1 : -1);
      if (obj.length < 2) {
        return;
      }
      for (let i = 1; i < obj.length; i++) {
        const { top: top1, height: height1, input: { name } } = obj[i - 1][1];
        const { top: top2 } = obj[i][1];
        if (top1 + height1 > top2 || top1 === top2) {
          intersections[obj[i][0]] = { index, name };
        }
      }
    });
    return intersections;
  }

  createArquivoDate(day, month, year) {
    const { dispatch, arquivo } = this.props;
    if (arquivo[dateFormat(day, month, year)] === undefined) {
      arquivo[dateFormat(day, month, year)] = [{}, {}, {}, {}, {}];
      dispatch(action(arquivo));
    }
  }

  notification() {
    let obj = { day: today, month: monthCurr, year: yearCurr };
    let res = this.servIntersection(obj.day, obj.month, obj.year);
    Object.keys(res).forEach((id) => {
      res[id] = { ...res[id], date: dateFormat(obj.day, obj.month, obj.year) }
    });
    let res2 = {};
    for (let i = 0; i < 30; i++) {
      obj = { ...sunDay({...obj}) };
      this.createArquivoDate(obj.day, obj.month, obj.year);
      res2 = {
        ...res2,
        ...this.servIntersection(obj.day, obj.month, obj.year),
      }
      Object.keys(res2).forEach((id) => {
        res2[id] = { ...res2[id], date: dateFormat(obj.day, obj.month, obj.year) }
      });
    }
    
    return Object.assign(res, res2);;
  }

  deleteAllRelatedById(id) {
    const { related } = this.props;
    if(related.semanal[id]) { delete related.semanal[id] };
    if(related.quinzenal[id]) { delete related.quinzenal[id] };
    if(related.mensal[id]) { delete related.mensal[id] };
  }

  handleClose() {
    const { dispatch } = this.props;
    dispatch(displayAction('none'));
  }

  render() {
    const { modal: { top, left, display, name } } = this.props;
    return (
      <div className="modal_delete" style={{top: `${top}vh`, left: `${left}vh`, display: `${display}`}}>
        <span className="material-icons" onClick={() => this.handleClose()}>
          close
        </span>
        <p>Dejesa deletar?</p>
        <span>{name}</span>
        <button type="button" onClick={() => this.btnDelete()}>Sim</button>
      </div>
    );
  }
};


const mapStateToProps = (state) => ({
  modal: state.modalDelete,
  day: state.date.day,
  month: state.date.month,
  year: state.date.year,
  arquivo: state.arquivo.json,
  related: state.arquivo.related,
  elems: state.elemsRender.elems,
});

export default connect(mapStateToProps)(ModalDelete);
