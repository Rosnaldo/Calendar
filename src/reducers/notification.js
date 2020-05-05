const INITIAL_STATE = {
  intersections: {

  }
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'notification') {
    const intersections = { ...action.intersections };
    return {
      ...state, intersections,
    };
  }
  return state;
};
