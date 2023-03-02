import {GET_CONTACTS, SEARCH_CONTACTS} from '../actions/contactsAction';

const initialState = {
  contacts: [],
  search: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        contacts: action.contacts,
      };
    case SEARCH_CONTACTS: {
      return {
        ...state,
        search: action.search,
      };
    }
    default:
      return state;
  }
};
