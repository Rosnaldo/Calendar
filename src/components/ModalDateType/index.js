import React, { Component } from 'react';
import { connect } from 'react-redux';

import Elems from '../../services/Elems';
import {
  dateFormat,
  matchDateType,
  sunSemana,
  sunQuinzena,
  sunMes,
  dateBigerThan,
  today,
  monthCurr,
  yearCurr,
  sunDay,
} from '../../services/Dates';
import './style.css';

function action(json) {
  return {
    type: 'load',
    json,
  }
}

function displayAction(display) {
  return {
    type: 'modalDateTypeDisplay',
    display,
  }
}

function actionRelated(related) {
  return {
    type: 'related',
    related,
  }
}

function actionElemsRender(elems) {
  return {
    type: 'elemsRender',
    elems,
  }
}

function actionNotifications(intersections) {
  return {
    type: 'notification',
    intersections,
  }
}

class ModalDateType extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.closeClick = this.closeClick.bind(this);
  }

  closeClick() {
    const { dispatch } = this.props;
    dispatch(displayAction('none'));
  }

  handleClick(e) {
    const { dispatch, modal: { id, index } } = this.props;
    const color = e.target.getAttribute('name');
    this.selectColor(color, id, index);
    // dispatch(actionNotifications(this.notification()));
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

  notification() {
    let obj = { day: today, month: monthCurr, year: yearCurr };
    let res = {
      [dateFormat(obj.day, obj.month, obj.year)]: [],
    };
    this.servIntersection(obj.day, obj.month, obj.year)
    .forEach((item) => {
      const { index, name, id} = item;
      res[dateFormat(obj.day, obj.month, obj.year)] = [ 
        ...res[dateFormat(obj.day, obj.month, obj.year)],
        { index, name, id } 
      ]
    });
    for (let i = 0; i < 30; i++) {
      obj = { ...sunDay({...obj}) };
      this.createArquivoDate(obj.day, obj.month, obj.year);
      res[dateFormat(obj.day, obj.month, obj.year)] = [];
      this.servIntersection(obj.day, obj.month, obj.year)
        .forEach((item) => {
      const { index, name, id} = item;
      res[dateFormat(obj.day, obj.month, obj.year)] = [ 
        ...res[dateFormat(obj.day, obj.month, obj.year)],
        { index, name, id } 
      ]
      });
    }
    return res;
  }

  servIntersection(day, month, year) {
    const elems = this.initRelatedServ(day, month, year);
    const intersections = [];
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
          intersections.push({ id: obj[i][0], index, name });
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

  selectColor(color, id, index) {
    switch(color) {
      case 'rgb(63, 113, 252)':
        return this.diario(id, index, color);
      case 'rgb(40, 145, 55)':
        return this.changeSer(id, index, 'semanal', color);
      case 'rgb(51, 69, 98)':
        return this.changeSer(id, index, 'quinzenal', color);
      case 'rgb(192, 36, 98)':
        return this.changeSer(id, index, 'mensal', color);
      default:
        return;
    }
  }

  diario(id, index, color) {
    const { arquivo, day, month, year, dispatch } = this.props;
    const { input, top, height } = Elems.findById(id);
    this.deleteAllRelatedById(id);
    arquivo[dateFormat(day, month, year)][index][id] = { input, top, height, color };
    dispatch(action(arquivo));
    dispatch(actionElemsRender(this.initRelatedServ(day, month, year)));
  }

  changeSer(id, index, type, color) {
    const { arquivo, day, month, year, related, dispatch } = this.props;
    if (arquivo[dateFormat(day, month, year)][index][id]) {
      delete arquivo[dateFormat(day, month, year)][index][id];
    }
    const { input, top, height } = Elems.findById(id);
    this.deleteAllRelatedById(id);
    related[type] = { 
      ...related[type],
      [id]: [dateFormat(day, month, year), index, { input, top, height, color }],
    };
    dispatch(action(arquivo));
    dispatch(actionRelated(related));
    dispatch(actionElemsRender(this.initRelatedServ(day, month, year)));
  }

  deleteAllRelatedById(id) {
    const { related } = this.props;
    if(related.semanal[id]) { delete related.semanal[id] };
    if(related.quinzenal[id]) { delete related.quinzenal[id] };
    if(related.mensal[id]) { delete related.mensal[id] };
  }

  selectType(elems, type) {
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


  relatedElems(elems, type, sunCb, color) {
    const { day, month, year, related } = this.props;
    console.log(elems)
    Object.keys(related[type]).forEach((relatedId) => {
      const [startDate, index, serv, endDate] = related[type][relatedId];
      if (matchDateType(startDate, dateFormat(day, month, year), sunCb)
        && this.endDateFunc(endDate, dateFormat(day, month, year))) {
        elems[index][relatedId] = { ...serv, color };
      };
    });
    return elems;
  }

  endDateFunc(endDate, dateFormat) {
    if (endDate) return dateBigerThan(endDate, dateFormat);
    return true;
  }

  render() {
    const { modal: { top, left, display } } = this.props;
    return (
      <div 
        className="modal_date_type" 
        style={{top: `${top}vh`, left: `${left}vh`, display: `${display}`}}
      >
        <i className="material-icons" onClick={this.closeClick}>
          close
        </i>
        <div className="setting">
          <div>
            <p>diário</p>
            <i className="material-icons" name="rgb(63, 113, 252)" onClick={this.handleClick}>
              lens
            </i>
          </div>
          <div>
            <p>semanal</p>
            <i className="material-icons" name="rgb(40, 145, 55)" onClick={this.handleClick}>
              lens
            </i>
          </div>
          <div>
            <p>quinzena</p>
            <i className="material-icons" name="rgb(51, 69, 98)" onClick={this.handleClick}>
              lens
            </i>
          </div>
          <div>
            <p>mensal</p>
            <i className="material-icons" name="rgb(192, 36, 98)" onClick={this.handleClick}>
              lens
            </i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modal: state.modalDateType,
  day: state.date.day,
  month: state.date.month,
  year: state.date.year,
  arquivo: state.arquivo.json,
  related: state.arquivo.related,
});

export default connect(mapStateToProps)(ModalDateType);
