import {
  GET_CHATS,
  ACCESS_CHATS,
  NEW_CHAT,
  GET_PARTICIPANTS,
  UPDATE_CHATS,
} from '../actions/chatAction';

const initialState = {
  chats: [],
  participants: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CHATS:
      return {
        ...state,
        chats: action.chats,
      };
    case GET_PARTICIPANTS:
      return {
        ...state,
        participants: action.participants,
      };
    case NEW_CHAT:
      return {
        ...state,
        chats: state.chats.concat(action.chats),
      };
    case ACCESS_CHATS:
      return {
        ...state,
        chats: state.chats.concat(action.chats),
      };
    case UPDATE_CHATS:
      return {
        ...state,
        chats: action.chats,
      };
    default:
      return state;
  }
};
