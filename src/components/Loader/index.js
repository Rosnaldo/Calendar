import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';
import {
  sunSemana,
  sunQuinzena,
  sunMes,
  matchDateType,
  dateFormat,
} from '../../services/Dates';


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

class Loader extends Component {
  constructor(props) {
    super(props);
    this.preview = this.preview.bind(this);
  }

  preview(e) {
    const { dispatch, day, month, year, related } = this.props;
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(e.target.files[0]);

    function onReaderLoad(e){
      const { arquivo: arq, related: rel } = JSON.parse(e.target.result);
      dispatch(action(arq));
      dispatch(actionRelated(rel));
      dispatch(actionElemsRender(initRelatedServ(arq)));
    }

    function initRelatedServ(json) {
      const elems = json[dateFormat(day, month, year)];
      return switchType(
              switchType(
                switchType(elems, 'semanal'),
              'quinzenal'),
            'mensal');
    }

    function relatedElems(elems, type, sunCb) {
      Object.keys(related[type]).forEach((relatedId) => {
        const [dateFormat2, index, serv] = related[type][relatedId];
        if (matchDateType(dateFormat2, dateFormat(day, month, year), sunCb)) {
          elems[index][relatedId] = { ...serv };
        }
      });
      return elems;
    }

    function switchType(elems, type) {
      switch(type) {
        case 'semanal':
          return relatedElems(elems, type, sunSemana);
        case 'quinzenal':
          return relatedElems(elems, type, sunQuinzena);
        case 'mensal':
          return relatedElems(elems, type, sunMes);
        default:
          return;
      }
    }
  }

  render() {
    return (
      <div className='fileArea'>
        <label className='dropArea' htmlFor='file'>
          <div>
            <i className='material-icons'>image</i>
            <span>carregar json</span>
          </div>
        </label>
        <input type='file' name="files[]" id='file' hidden onChange={this.preview}></input>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  related: state.arquivo.related,
  elems: state.elemsRender.elems,
  day: state.date.day,
  month: state.date.month,
  year: state.date.year,
});


export default connect(mapStateToProps)(Loader);
