const INITIAL_STATE = {
  input: {
    "faf5ba3e-c47b-4806-9163-64c2367ca5da": "coisa",
  }
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'comp_input') {
    const input = { ...action.input } ;
    return {
      ...state, input,
    }
  }
  return state;
};
