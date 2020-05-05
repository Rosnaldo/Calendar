const INITIAL_STATE = {
    display: 'none',
    top: '0',
    left: '0',
    id: '',
    index: '',
    name: '',
  };
  
  export default (state = INITIAL_STATE, action) => {
    if (action.type === 'modalDelete') {
      return {
        ...state,
        ...action.modal,
      };
    }
    if (action.type === 'modalDeleteDisplay') {
      return {
        ...state,
        display: action.display,
      };
    }
    return state;
  };
  