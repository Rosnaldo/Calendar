import React, { useState, useEffect } from 'react';

import { dateFormat, monthsName, contTypes } from '../../services/Dates';
import './style.css'

const changeHandle = (e, setEnd, setNum, sunCb, start) => {
  let i = 0;
  const arr = start.split('/');
  let day = Number(arr[0]);
  let month = monthsName[arr[1]];
  let year = Number(arr[2]);
  const { value } = e.target;
  while (i < Number(value)) {
    const obj = sunCb({ day, month, year });
    day = obj.day;
    month = obj.month;
    year = obj.year;
    i++;
  }
  setEnd(dateFormat(day, month, year));
  setNum(value);
};

const Input = (props) => {
  const { related, display, id, sunCb, type, refi } = props;
  const [num, setNum] = useState(0);
  const [start, setStart] = useState('3/May/2020');
  const [end, setEnd] = useState('4/May/2020');
  
  useEffect(() => {
    if (related[type][id]) {
      setStart(related[type][id][0]);
      setEnd(related[type][id][3]);
    }
  }, [id, display]);
  
  useEffect(() => {
    if (end) { setNum(contTypes(start, end, sunCb)); }
    else { setNum(0); }
  }, [start, end]);

  return (
    <div className="input" name={end} ref={refi}>
      <span>{start} ~ {end}</span>
      <div className="campo">
        <p>Nº de {type}: {num}</p>
        <input type="text" value={num} onChange={(e) => changeHandle(e, setEnd, setNum, sunCb, start)} />
      </div>
    </div>
  );
};

export default Input;
