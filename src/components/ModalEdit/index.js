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
import Input from './Input';
import './style.css'

function action(json) {
  return {
    type: 'load',
    json,
  }
}

function displayAction(display) {
  return {
    type: 'modalEditDisplay',
    display,
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

const switchType = (related, display, type, id, refi) => {
  switch (type) {
    case 'semanal':
      return <Input related={related} display={display} type={type} id={id} sunCb={sunSemana} refi={refi} />;
    case 'quinzenal':
      return <Input related={related} display={display} type={type} id={id} sunCb={sunQuinzena} refi={refi} />;
    case 'mensal':
      return <Input related={related} display={display} type={type} id={id} sunCb={sunMes} refi={refi} />;
    default:
      return;
  }
};

class ModalEdit extends Component {
  constructor(props) {
    super(props);
    this.refi = React.createRef();
  }

  handleClose() {
    const { dispatch } = this.props;
    dispatch(displayAction('none'));
  }

  handleOk(type) {
    const {  modal: { id }, related, dispatch } = this.props;
    const dateFormat2 = this.refi.current.getAttribute('name');
    const [start, elem, obj] = related[type][id];
    related[type][id] = [start, elem, obj, dateFormat2];
    dispatch(actionRelated(related));
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

  createArquivoDate(day, month, year) {
    const { dispatch, arquivo } = this.props;
    if (arquivo[dateFormat(day, month, year)] === undefined) {
      arquivo[dateFormat(day, month, year)] = [{}, {}, {}, {}, {}];
      dispatch(action(arquivo));
    }
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

  switchType2(color) {
    switch(color) {
      case 'rgb(40, 145, 55)':
        return 'semanal';
      case 'rgb(51, 69, 98)':
        return 'quinzenal';
      case 'rgb(192, 36, 98)':
        return 'mensal';
      default:
        return;
    }
  }

  render() {
    const { modal: { top, left, display, color, id }, related } = this.props;
    const type = this.switchType2(color);
    return (
      <div className="modal_edit" style={{top: `${top}vh`, left: `${left}vh`, display: `${display}`}}>
        <span className="material-icons" onClick={() => this.handleClose()}>
          close
        </span>
        {switchType(related, display, type, id, this.refi)}
        <button type="button" onClick={() => this.handleOk(type)}>Ok</button>
      </div>
    );
  }
};


const mapStateToProps = (state) => ({
  arquivo: state.arquivo.json,
  modal: state.modalEdit,
  day: state.date.day,
  month: state.date.month,
  year: state.date.year,
  related: state.arquivo.related,
  elems: state.elemsRender.elems,
});

export default connect(mapStateToProps)(ModalEdit);
