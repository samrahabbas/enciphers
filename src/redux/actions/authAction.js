import axios from 'axios';
import client from '../../api/client';
import {
  checkIfTableExists,
  createUserTable,
  insertIntoUser,
} from '../../local_db/SQLite';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {socket} from '../reducers/socket';
import {connect} from './socketAction';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';
export const RETRIEVE_TOKEN = 'RETRIEVE_TOKEN';

export const signup = (username, password, confirmPassword) => {
  return async dispatch => {
    return new Promise(async (resolve, reject) => {
      try {
        // const res = await axios.get('http://192.168.18.39:3000/');
        await client
          .post('/create-user', {
            username,
            password,
            confirmPassword,
          })
          .then(res => {
            dispatch(signIn(username, password));
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.log(error.message);
      }
    });
  };
};

export const signIn = (username, password) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.post('/sign-in', {
          username,
          password,
        });
        if (result.status === 200) {
          if (result.data.message) {
            reject(result.data.message);
          } else {
            const user = {...result.data.user};
            delete user.password;
            //await dispatch(connect());
            //const socket = getState().socket.socket;
            //console.log(socket);
            //saveSocket(socket);
            dispatch({
              type: LOGIN,
              token: result.data.token,
              user: user,
            });
            createUserTable().then(() => {
              insertIntoUser(
                result.data.user._id,
                result.data.user.username,
                result.data.user.avatar,
              );
            });
            saveToken(result.data.token, user);
            resolve(user);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const saveSocket = socket => {
  try {
    AsyncStorage.setItem(
      'socket',
      JSON.stringify(socket, getCircularReplacer()),
    ).then(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('socket');
        //console.log('async storage socket', jsonValue);
        //return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const saveToken = (token, user) => {
  try {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token,
        user,
      }),
    ).then(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        console.log('async storage', jsonValue);
        //return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const logout = () => {
  AsyncStorage.removeItem('userData');
  //AsyncStorage.removeItem('socket');
  return {type: LOGOUT};
};
