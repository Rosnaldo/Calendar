import { combineReducers } from 'redux';

import table from './table';
import date from './date';
import arquivo from './arquivo';
import modalDateType from './modalDateType';
import modalEdit from './modalEdit';
import modalDelete from './modalDelete';
import input from './input';
import elemsRender from './elemsRender';
import enderecoExist from './enderecoExist';
import notification from './notification';

const rootReducer = combineReducers({
  table,
  date,
  arquivo,
  modalDateType,
  modalEdit,
  modalDelete,
  input,
  elemsRender,
  enderecoExist,
  notification,
});

export default rootReducer;
