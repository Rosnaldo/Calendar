import React, { Component } from 'react';
import { connect } from 'react-redux';

import Elems from '../../services/Elems';
import {
  months,
  monthString,
  today,
  yearCurr,
  monthCurr,
  dateFormat,
  matchDateType,
  sunSemana,
  sunQuinzena,
  sunMes,
  dateBigerThan,
} from '../../services/Dates';
import './style.css';

function arquivoAction(json) {
  return {
    type: 'load',
    json,
  }
}

function dateAction(day, month, year) {
  return {
    type: 'selectedDate',
    day,
    month,
    year,
  };
}

function yearMonthAction(month, year) {
  return {
    type: 'yearMonth',
    month,
    year
  };
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

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.daysEl = React.createRef();
    this.monthLeft = React.createRef();
    this.monthRight = React.createRef();
  }

  componentDidMount() {
    //Fill daysEl
    for (let i = 0; i < 42; i++) {
      const day = document.createElement('span');
      this.daysEl.current.appendChild(day);
    }

    this.renderDays(yearCurr, monthCurr);
    this.initListenerRightLeft();
    this.initListenerDays();
    this.selectCurrentDay();
  }

  initListenerDays() {
    const allDays = this.daysEl.current.querySelectorAll('span');
    allDays.forEach((dayEl) => {
      dayEl.addEventListener('click', (e) => this.dayClick(e));
    });
  }

  dayClick(e) {
    const { dispatch, day, month, year, arquivo, related } = this.props;
    const day2 = e.target.outerText;
    const arr = e.target.getAttribute('name').split(',');
    const [month2, year2] = arr;
    this.createArquivoDate(day2, month2, year2);
    const json = Elems.json({ ...arquivo }, dateFormat(day, month, year));
    dispatch(actionRelated(Elems.updateRelateds(related)));
    dispatch(arquivoAction(this.delRelatedServs(json)));
    dispatch(dateAction(Number(day2), Number(month2), Number(year2)));
    dispatch(actionElemsRender(this.initRelatedServ(json)));
    this.selectCurrentDay();
  }

  initRelatedServ(json) {
    let { day, month, year, elems } = this.props;
    elems = json[dateFormat(day, month, year)];
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
      };
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

  delRelatedServs(json) {
    const { related, day, month, year } = this.props;
    return Elems.discardRelated(json, related, dateFormat(day, month, year));
  }

  createArquivoDate(day, month, year) {
    const { dispatch, arquivo } = this.props;
    if (arquivo[dateFormat(day, month, year)] === undefined) {
      arquivo[dateFormat(day, month, year)] = [{}, {}, {}, {}, {}];
      dispatch(arquivoAction(arquivo));
    }
  }

  renderDays(year, month) {
    let lastDay = (month !== 0) ? months[month - 1].lastDay : months[11].lastDay;
    let lastDay2 = months[month].lastDay;
    let firstDayWeek2 = (new Date(year, month, 1)).getDay() + 1;
    
    // before month
    for (let i = firstDayWeek2, j = -1; i > 0; i -= 1, j += 1) {
      this.daysEl.current.querySelector(`span:nth-child(${i})`)
        .innerText = lastDay - j;
      this.daysEl.current.querySelector(`span:nth-child(${i})`)
        .setAttribute('name', `${month - 1},${year}`);
      if (month - 1 === -1) {
        this.daysEl.current.querySelector(`span:nth-child(${i})`)
          .setAttribute('name', `11,${year - 1}`);
      }
    }
  
    // current month
    for (let i = firstDayWeek2; i < lastDay2 + firstDayWeek2; i += 1) {
      this.daysEl.current.querySelector(`span:nth-child(${i})`)
        .innerText = i - firstDayWeek2 + 1;
      this.daysEl.current.querySelector(`span:nth-child(${i})`)
        .setAttribute('name', `${month},${year}`);
    }
  
    // after month
    for (let i = lastDay2 + firstDayWeek2, j = 1; i <= 42; i += 1, j += 1) {
      this.daysEl.current.querySelector(`span:nth-child(${i})`)
        .innerText = j;
      this.daysEl.current.querySelector(`span:nth-child(${i})`)
        .setAttribute('name', `${month + 1},${year}`);
      if (month + 1 === 11) {
        this.daysEl.current.querySelector(`span:nth-child(${i})`)
          .setAttribute('name', `0,${year + 1}`);
      }
    }
  }

  initListenerRightLeft() {
    this.monthRight.current.addEventListener('click', () => {
      const { day, month, year, dispatch } = this.props;
      let month2;
      let year2;
      if (month === 11) {
        this.createArquivoDate(day, 0, year + 1);
        dispatch(yearMonthAction(0, year + 1));
        month2 = 0;
        year2 = year + 1;
      } else {
        this.createArquivoDate(day, month + 1, year);
        dispatch(yearMonthAction(month + 1, year));
        month2 = month + 1;
        year2 = year;
      }
      this.renderDays(year2, month2);
      this.selectCurrentDay();
    });
    
    this.monthLeft.current.addEventListener('click', () => {
      const { day, month, year, dispatch } = this.props;
      let month2;
      let year2;
      if (month === 0) {
        this.createArquivoDate(day, 11, year - 1);
        dispatch(yearMonthAction(11, year - 1));
        month2 = 11;
        year2 = year - 1;
      } else {
        this.createArquivoDate(day, month - 1, year);
        dispatch(yearMonthAction(month - 1, year));
        month2 = month - 1;
        year2 = year;
      }
      this.renderDays(year2, month2);
      this.selectCurrentDay();
    });
  }

  selectCurrentDay() {
    const { day, month, year } = this.props;
    const spans = this.daysEl.current.querySelectorAll('span');
    spans.forEach((item) => {
      const [month2, year2] = item.getAttribute('name').split(',');
      item.style.backgroundColor = '#282828';
      if (day === Number(item.outerText) && Number(month2) === month && year === Number(year2)) {
        item.style.backgroundColor = '#4a4a4a';
      }
      if (today === Number(item.outerText) && Number(month2) === monthCurr && yearCurr === Number(year2)) {
        item.style.backgroundColor = '#cddc39';
      }
    });
  }

  render() {
    const { month, year } = this.props;
    return (
      <div className="calendar">
        <div className='calendar-header'>
          <i className="material-icons" ref={this.monthLeft}>
            navigate_before
          </i>
          <div className='header-data'>
            <span className='calendar-month'>{monthString(month)}</span>
            <span className='calendar-year'>{year}</span>
          </div>
          <i className="material-icons" ref={this.monthRight}>
            navigate_next
          </i>
        </div>
        <div className='calendar-body'>
          <div className='weeks'>
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>
          <div className='days' ref={this.daysEl}>
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
  arquivo:state.arquivo.json,
  related: state.arquivo.related,
});


export default connect(mapStateToProps)(Calendar);
