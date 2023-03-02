import {getCalls, insertIntoCall} from '../../local_db/SQLite';

export const GET_CALLS = 'GET_CALLS';
export const ADD_CALL = 'ADD_CALL';
export const MISSED_CALL = 'MISSED_CALL';

export const fetchCalls = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      getCalls(u._id).then(res => {
        resolve(res);
        dispatch({type: GET_CALLS, calls: res.reverse()});
      });
    });
  };
  // dispatch({type: SET_PC, peerConnection: pc});
};

export const addMissedCall = (chatName, type, status, avatar, createdAt) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      try {
        insertIntoCall(chatName, type, status, avatar, u._id, createdAt)
          .then(res => {
            dispatch(fetchCalls());
            resolve(res);
          })
          .catch(err => console.log(err));
      } catch (err) {
        console.log(err);
      }
    });
  };
};

export const addCall = (chatName, type, status, avatar) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      try {
        insertIntoCall(chatName, type, status, avatar, u._id)
          .then(res => {
            dispatch(fetchCalls());
          })
          .catch(err => console.log(err));
      } catch (err) {
        console.log(err);
      }
    });
  };
  // dispatch({type: SET_PC, peerConnection: pc});
};
