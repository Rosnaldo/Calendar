const INITIAL_STATE = {
    display: 'none',
    top: '0',
    left: '0',
    id: '',
    index: '',
    color: 'rgb(40, 145, 55)',
  };
  
  export default (state = INITIAL_STATE, action) => {
    if (action.type === 'modalEdit') {
      return {
        ...state,
        ...action.modal,
      };
    }
    if (action.type === 'modalEditDisplay') {
      return {
        ...state,
        display: action.display,
      };
    }
    return state;
  };
  