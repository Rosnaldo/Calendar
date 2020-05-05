const INITIAL_STATE = {
  top: '',
  bottom: '',
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'tableDimensions') {
    return {
      ...state,
      top: action.top,
      bottom: action.bottom,
    };
  }
  return state;
};
