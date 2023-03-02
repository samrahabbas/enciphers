export const GET_MESSAGES = 'GET_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const NEW_MESSAGES = 'NEW_MESSAGES';
export const OPEN_MESSAGE = 'OPEN_MESSAGE';
import client from '../../api/client';
import {
  addLatestMessage,
  createLatestMessageTable,
  getChatMessages,
  getData,
  getDataFromTable,
  getLatestMessageId,
  sendMessage,
  sendPending,
  updateFieldFromTable,
} from '../../local_db/SQLite';
import {fetchChats, updateChat} from './chatAction';

//sqlite
export const getMessages = chatId => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        getChatMessages(chatId).then(res => {
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const sendMessages = (content, chatId) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const currentUser = getState().auth.user;
      try {
        sendMessage(content, chatId, currentUser._id)
          .then(res => {
            updateFieldFromTable('chat', 'latestMessage', res.id, 'id', chatId);
            //change latest message
            // addLatestMessage(currentUser._id, chatId, content, res.createdAt)
            //   .then(res => {
            //     console.log(
            //       res.startsWith('latest message added'),
            //       typeof res,
            //       res,
            //     );
            //     // if (res === 'latest message added') {
            //     getLatestMessageId(chatId).then(res => {
            //       console.log(res);
            //       getData('chat').then(res => console.log(res));
            //       //updateFieldFromTable('chat', 'latestMessage', res.id, 'id', chatId);
            //     });
            //     //}
            //   })
            //   .catch(error => {
            //     console.log(error);
            //   });
            // dispatch(fetchChats());
            dispatch(updateChat(chatId, res.id));
            dispatch({type: SEND_MESSAGE, messages: res});
            resolve(res);
          })
          .catch(error => console.log(error));
      } catch (error) {
        reject(error);
      }
    });
  };
};
// export const getMessages = chatId => {
//   return async (dispatch, getState) => {
//     return new Promise(async (resolve, reject) => {
//       const token = getState().auth.token;
//       try {
//         const result = await client.get(`/${chatId}`, {
//           headers: {
//             Authorization: `Basic ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (result.status === 200) {
//           //   dispatch({
//           //     type: GET_MESSAGES,
//           //     messages: result.data,
//           //   });
//           resolve(result.data);
//         }
//       } catch (error) {
//         console.log(error.message);
//         reject(error.message);
//       }
//     });
//   };
// };

// export const sendMessages = (content, chatId) => {
//   return async (dispatch, getState) => {
//     return new Promise(async (resolve, reject) => {
//       const token = getState().auth.token;
//       try {
//         const result = await client.post(
//           '/message',
//           {
//             content: content,
//             chatId: chatId,
//           },
//           {
//             headers: {
//               Authorization: `Basic ${token}`,
//               'Content-Type': 'application/json',
//             },
//           },
//         );
//         if (result.status === 200) {
//           //   dispatch({
//           //     type: GET_MESSAGES,
//           //     messages: result.data,
//           //   });
//           resolve(result.data);
//         }
//       } catch (error) {
//         console.log(error.message);
//         reject(error.message);
//       }
//     });
//   };
// };

export const receiveMessages = (content, chatId, sender) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      //const currentUser = getState().auth.user;
      const newMessages = getState().message.newMessages;
      try {
        sendMessage(content, chatId, sender)
          .then(res => {
            updateFieldFromTable('chat', 'latestMessage', res.id, 'id', chatId);
            dispatch(updateChat(chatId, res.id));
            dispatch({type: SEND_MESSAGE, messages: res});
            if (newMessages.length === 0) {
              let array = [...newMessages];
              let obj = {
                chat_id: chatId,
                newMsgs: 1,
              };
              array.push(obj);
              dispatch({type: NEW_MESSAGES, newMessages: array});
            }
            const find = newMessages.find(m => m.chat_id === chatId);
            if (find) {
              let array = [...newMessages];
              let index = array.indexOf(find);
              array[index].newMsgs = array[index].newMsgs + 1;
              dispatch({type: NEW_MESSAGES, newMessages: array});
            } else {
              let array = [...newMessages];
              let obj = {
                chat_id: chatId,
                newMsgs: 1,
              };
              array.push(obj);
              dispatch({type: NEW_MESSAGES, newMessages: array});
            }
            resolve(res);
          })
          .catch(error => console.log(error));
      } catch (error) {
        reject(error);
      }
    });
  };
};

export const getAllMessages = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        getData('message').then(res => {
          dispatch({type: GET_MESSAGES, messages: res});
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

export const receivePendingMessages = (content, chatId, sender, createdAt) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      //const currentUser = getState().auth.user;
      const newMessages = getState().message.newMessages;
      try {
        sendPending(content, chatId, sender, createdAt)
          .then(res => {
            updateFieldFromTable('chat', 'latestMessage', res.id, 'id', chatId);
            dispatch(updateChat(chatId, res.id));
            dispatch({type: SEND_MESSAGE, messages: res});
            if (newMessages.length === 0) {
              let array = [...newMessages];
              let obj = {
                chat_id: chatId,
                newMsgs: 1,
              };
              array.push(obj);
              dispatch({type: NEW_MESSAGES, newMessages: array});
            }
            const find = newMessages.find(m => m.chat_id === chatId);
            if (find) {
              let array = [...newMessages];
              let index = array.indexOf(find);
              array[index].newMsgs = array[index].newMsgs + 1;
              dispatch({type: NEW_MESSAGES, newMessages: array});
            } else {
              let array = [...newMessages];
              let obj = {
                chat_id: chatId,
                newMsgs: 1,
              };
              array.push(obj);
              dispatch({type: NEW_MESSAGES, newMessages: array});
            }
            resolve(res);
          })
          .catch(error => console.log(error));
      } catch (error) {
        reject(error);
      }
    });
  };
};
