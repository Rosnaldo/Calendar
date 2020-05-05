const INITIAL_STATE = {
  elems: [
    {},
    {},
    {},
    {},
    {},
  ],
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'elemsRender') {
    const elems = [...action.elems] ;
    return {
      ...state, elems,
    }
  }
  return state;
};
