const INITIAL_STATE = {
    enderecoExist: {},
  };
  
  export default (state = INITIAL_STATE, action) => {
    if (action.type === 'enderecoExist') {
      const enderecoExist = { ...action.enderecoExist } ;
      return {
        ...state, enderecoExist,
      }
    }
    return state;
  };
  