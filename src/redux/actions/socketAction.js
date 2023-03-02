export const CONNECT = 'CONNECT';
import {socket} from '../reducers/socket';
import {io} from 'socket.io-client';
//const ENDPOINT = 'http://192.168.18.39:3000';
//const ENDPOINT = 'http://192.168.18.76:3000'; //router ip
//const ENDPOINT = 'http://70.62.23.133:9999'; //development

// export const socket = io(ENDPOINT);

export const connect = () => {
  //const socket = io(ENDPOINT); // if we use this way it take a little bit time for being connected to true
  return async dispatch => {
    // not connecting
    //setTimeout(() => {
    //console.log(socket.connected);
    dispatch({type: CONNECT, socket: socket});
    //}, 30000);
  };
};

export const authenticateConnect = socket => {
  return async (dispatch, getState) => {
    await dispatch({type: CONNECT, socket: socket});
  };
};
