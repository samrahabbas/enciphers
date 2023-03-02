import {ADD_CALL, GET_CALLS, MISSED_CALL} from '../actions/callAction';

const initialState = {
  calls: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CALLS:
      return {
        ...state,
        calls: action.calls,
      };
    case ADD_CALL:
      return {
        ...state,
        calls: state.calls.concat(action.calls),
      };
    case MISSED_CALL:
      return {
        ...state,
        calls: state.calls.concat(action.calls),
      };
    default:
      return state;
  }
};
