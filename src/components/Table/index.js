import React, { Component } from 'react';
import { connect } from 'react-redux';
import Serv from '../Serv';
import Elems from '../../services/Elems';

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
import { generateUUID } from '../../services/GenerateId';
import './style.css';


function action(json) {
  return {
    type: 'load',
    json,
  }
}

function actionTable(top, bottom) {
  return {
    type: 'tableDimensions',
    top,
    bottom,
  };
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

class Table extends Component {
  constructor(props) {
    super(props);
    this.title = React.createRef();
    this.horas = React.createRef();
    this.board = React.createRef();
    this.table = React.createRef();
    this.addHandle = this.addHandle.bind(this);
  }

  componentDidMount() {
    const { dispatch, day, month, year } = this.props;
    const top = this.convert(this.table.current.getBoundingClientRect().top);
    const bottom = this.convert(this.table.current.getBoundingClientRect().bottom);
    dispatch(actionTable(top, bottom));
    this.initHoras();
    this.initElems();
    Elems.array = [this.board.current];
    dispatch(actionElemsRender(this.initRelatedServ(day, month, year)));
    dispatch(actionNotifications(this.notification()));
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

  convert(px) {
    return (parseFloat(px) * 100) / window.innerHeight;
  };

  initHoras() {
    for (let i = 6; i <= 18; i++) {
      const p = document.createElement('p');
      p.innerText = `${i}.00`;
      this.horas.current.appendChild(p);
    }
  }

  initElems() {
    this.board.current.querySelectorAll('.elem')
      .forEach(elem => {
        for (let i = 0; i < 13; i += 1) {
          const div = document.createElement('div');
          div.setAttribute('class', 'cell');
          elem.appendChild(div);
        }
      });
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

  createServ(top = 20, height = 20, color = 'rgb(63, 113, 252)', input = { name: '', horario: '', endereco: '' }) {
    return { top, height, color, input };
  }

  addHandle(e) {
    const { arquivo, day, month, year, dispatch } = this.props;
    const index = Number(e.target.getAttribute('name'));
    const json = {...arquivo};
    json[dateFormat(day, month, year)][index][generateUUID()] = { ...this.createServ() };
    dispatch(action(json));
  }

  addBtnsRender() {
    return (
      <>
        {[1, 2, 3, 4, 5].map((item, idx) => (
          <div key={item}>
            <span>Equipe {item} </span>
            <button onClick={this.addHandle}>
              <i className="material-icons" name={idx}>
                add_circle
              </i>
            </button>
          </div>
        ))}
      </>
    );
  }

  tableHeaderRender() {
    return (
      <div className='header-table'>
        <div>
        </div>
        {this.addBtnsRender()}
      </div>
    );
  }

  render() {
    const { day, month, year, elems } = this.props;
    return (
      <div className='table'>
        <div className='table-date'>
          <h2 ref={this.title}>{dateFormat(day, month, year)}</h2>
        </div>
        {this.tableHeaderRender()}
        <div className='body-table' ref={this.table}>
          <div className='horas' ref={this.horas}>
          </div>
          <div className='board' ref={this.board}>
            {elems.map((elem, index) => (
              <div className='elem' key={index} name={index}>
                {Object.keys(elem).map((serv_id) => (
                  <Serv serv={elem[serv_id]} key={serv_id} id={serv_id} index={index} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  day: state.date.day,
  month: state.date.month,
  year: state.date.year,
  arquivo: state.arquivo.json,
  related: state.arquivo.related,
  elems: state.elemsRender.elems,
  notification: state.notification.intersections,
});

export default connect(mapStateToProps)(Table);
