import Thunk from 'redux-thunk';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import authReducer from './reducers/authReducer';
import colorReducer from './reducers/colorReducer';
import contactsReducer from './reducers/contactsReducer';
import chatReducer from './reducers/chatReducer';
import callReducer from './reducers/callReducer';
import messageReducer from './reducers/messageReducer';
import socketReducer from './reducers/socketReducer';

const rootReducer = combineReducers({
  call: callReducer,
  chat: chatReducer,
  auth: authReducer,
  color: colorReducer,
  contact: contactsReducer,
  message: messageReducer,
  socket: socketReducer,
});

export const store = createStore(rootReducer, applyMiddleware(Thunk));
