import {
  GET_MESSAGES,
  SEND_MESSAGE,
  NEW_MESSAGES,
  OPEN_MESSAGE,
} from '../actions/messageAction';

const initialState = {
  messages: [],
  newMessages: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case SEND_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.messages),
      };
    case NEW_MESSAGES:
      return {
        ...state,
        newMessages: action.newMessages,
      };
    case OPEN_MESSAGE:
      return {
        ...state,
        newMessages: action.newMessages,
      };
    default:
      return state;
  }
};
