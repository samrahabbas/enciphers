import {
  AUTHENTICATE,
  LOGIN,
  LOGOUT,
  RETRIEVE_TOKEN,
} from '../actions/authAction';

const initialState = {
  token: null,
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        token: action.token,
        user: action.user,
      };
    case AUTHENTICATE:
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    case RETRIEVE_TOKEN:
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
