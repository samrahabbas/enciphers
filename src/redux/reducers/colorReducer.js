import {COLOR} from '../actions/colorAction';

const initialState = {
  color: 'Dark',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case COLOR:
      return {
        color: action.color,
      };
    default:
      return state;
  }
};
