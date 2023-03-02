import {CONNECT} from '../actions/socketAction';

const initialState = {
  socket: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECT:
      return {
        socket: action.socket,
      };
    default:
      return state;
  }
};
