const INITIAL_STATE = {
  display: 'none',
  top: '0',
  left: '0',
  id: '',
  index: '',
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'modalDateType') {
    return {
      ...state,
      ...action.modal,
    };
  }
  if (action.type === 'modalDateTypeDisplay') {
    return {
      ...state,
      display: action.display,
    };
  }
  return state;
};
