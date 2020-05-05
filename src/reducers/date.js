import { today, monthCurr, yearCurr } from '../services/Dates';

const INITIAL_STATE = {
  day: today,
  month: monthCurr,
  year: yearCurr,
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'selectedDate') {
    return {
      ...state,
      day: action.day,
      month: action.month,
      year: action.year,
    };
  }
  if (action.type === 'yearMonth') {
    return {
      ...state,
      month: action.month,
      year: action.year,
    };
  }
  return state;
};
