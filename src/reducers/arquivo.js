import { today, monthCurr, yearCurr, dateFormat } from '../services/Dates';

const INITIAL_STATE = {
  json: {
    [dateFormat(today, monthCurr, yearCurr)]: [
      {},
      {},
      {},
      {},
      {},
    ],
  },
  related: {
    semanal: {},
    quinzenal: {},
    mensal: {},
  }
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'load') {
    const json = { ...action.json } ;
    return {
      ...state, json,
    }
  }
  if (action.type === 'related') {
    const related = { ...action.related } ;
    return {
      ...state, related,
    }
  }
  return state;
};
