export const NEW_CHAT = 'NEW_CHAT';
export const GET_CHATS = 'GET_CHATS';
export const UPDATE_CHATS = 'UPDATE_CHATS';
export const ACCESS_CHATS = 'ACCESS_CHATS';
export const GET_PARTICIPANTS = 'GET_PARTICIPANTS';
import client from '../../api/client';
import {
  addToGroupChat,
  createGroupChat,
  createPendingGroupChat,
  getChats,
  getChatsById,
  getData,
  getDataFromTable,
  getParticipantsByChatId,
  initiatePendingSingleChat,
  initiateSingleChat,
  removeFromGroupChat,
} from '../../local_db/SQLite';

export const accessChats = userId => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token;
      const chats = getState().chat.chats;
      try {
        const result = await client.post(
          '/chats',
          {
            userId: userId,
          },
          {
            headers: {
              Authorization: `Basic ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (result.status === 200) {
          // for (let i = 0; i < chats.length; i++) {
          //   if (chats[i]._id === result.data._id) {
          //     console.log('Already in chat');
          //   } else
          //     dispatch({
          //       type: ACCESS_CHATS,
          //       chats: result.data,
          //     });
          // }
          resolve(result.data);
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  };
};

//sqlite updated
export const fetchChats = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      // const token = getState().auth.token;
      // try {
      //   const result = await client.get('/chats', {
      //     headers: {
      //       Authorization: `Basic ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   });
      //   if (result.status === 200) {
      //     const chats = [];
      //     for (let i = 0; i < result.data.length; i++) {
      //       if (
      //         result.data[i].isGroupChat === false &&
      //         result.data[i].latestMessage === undefined
      //       ) {
      //       } else chats.push(result.data[i]);
      //     }
      //     dispatch({
      //       type: GET_CHATS,
      //       chats: chats,
      //     });
      //     resolve(result.data);
      //   }
      // } catch (error) {
      //   console.log(error.message);
      //   reject(error.message);
      // }
      const user = getState().auth.user;
      const chats = getState().chat.chats;
      const participants = getState().chat.participants;
      try {
        getChats(user._id).then(res => {
          let arr = [];
          for (let i = 0; i < res.length; i++) {
            getChatsById(res[i].chat_id, user).then(res => {
              // if chats are empty
              if (arr.length === 0) {
                // if participants are not empty
                if (participants.find(p => p.chat_id === res.id)) {
                  const chat_obj = res;
                  res.users = participants.filter(p => p.chat_id === res.id);
                  arr.push(chat_obj);
                } else {
                  // if participants are empty dispatch
                  dispatch(fetchParticipants()).then(() => {
                    if (participants.find(p => p.chat_id === res.id)) {
                      const chat_obj = res;
                      res.users = participants.filter(
                        p => p.chat_id === res.id,
                      );
                      arr.push(chat_obj);
                    }
                  });
                }
              } else {
                // if chats are not empty
                if (
                  arr.some(c => c.chatName !== res.chatName) &&
                  arr.some(c => c.user_db === res.user_db)
                ) {
                  // if participants are not empty find
                  if (participants.find(p => p.chat_id === res.id)) {
                    const chat_obj = res;
                    res.users = participants.filter(p => p.chat_id === res.id);
                    arr.push(chat_obj);
                  } else {
                    // empty participants then dispatch
                    dispatch(fetchParticipants()).then(() => {
                      if (participants.find(p => p.chat_id === res.id)) {
                        const chat_obj = res;
                        res.users = participants.filter(
                          p => p.chat_id === res.id,
                        );
                        arr.push(chat_obj);
                      }
                    });
                  }
                }
              }
              // else {
              //   const find = chats.find(c => c.id === res.id);
              //   if (find) {
              //     let array = [...chats];
              //     let index = array.indexOf(find);
              //     if (index !== -1) {
              //       array.splice(index, 1);
              //     }
              //     if (participants.find(p => p.chat_id === res.id)) {
              //       const chat_obj = res;
              //       res.users = participants.filter(p => p.chat_id === res.id);
              //       dispatch({
              //         type: NEW_CHAT,
              //         chats: chat_obj,
              //       });
              //     }
              //   }
              // }
            });
          }
          dispatch({type: GET_CHATS, chats: arr.reverse()});
          resolve(arr);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const fetchParticipants = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const user = getState().auth.user;
      try {
        getData('participants')
          .then(res => {
            dispatch({type: GET_PARTICIPANTS, participants: res});
            resolve(res);
          })
          .catch(error => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const updateChat = (chatId, latestMessage) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const chats = getState().chat.chats;
      try {
        // find and edit chat object
        if (chats) {
          let chat;
          for (let i = 0; i < chats.length; i++) {
            if (chats[i].id === chatId) {
              chat = {...chats[i], latestMessage: latestMessage};
            }
          }
          const find = chats.find(c => c.id === chatId);
          if (find) {
            let array = [...chats];
            let index = array.indexOf(find);
            if (index !== -1) {
              array.splice(index, 1, chat);
              // assign array to chats
              dispatch({type: UPDATE_CHATS, chats: array});
              resolve(array);
            }
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const newGroupChat = (
  users,
  chatName,
  isGroupChat,
  groupAdmin,
  groupAvatar,
) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      try {
        createGroupChat(
          users,
          chatName,
          isGroupChat,
          groupAdmin,
          groupAvatar,
          u._id,
        ).then(res => {
          if (res === 'Group name already exists') {
            resolve('Group name already exists');
          } else {
            dispatch(fetchParticipants());
            getDataFromTable('chat', 'id', res).then(res => {
              getParticipantsByChatId(res[0].id).then(result => {
                const chat_obj = res[0];
                res[0].users = result;
                dispatch({type: NEW_CHAT, chats: chat_obj});
                resolve(chat_obj);
              });
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const addParticipants = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const SingleChat = (
  currentUser,
  user,
  chatName,
  isGroupChat,
  admin,
  avatar,
) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      try {
        initiateSingleChat(
          currentUser,
          user,
          chatName,
          isGroupChat,
          admin,
          avatar,
          u._id,
        ).then(res => {
          if (res.message === 'Already in Chat') {
            resolve(res);
          } else {
            dispatch(fetchParticipants());
            getDataFromTable('chat', 'id', res).then(r => {
              getParticipantsByChatId(r[0].id).then(result => {
                let chat_obj = r[0];
                r[0].users = result;
                dispatch({type: NEW_CHAT, chats: chat_obj});
                resolve(chat_obj);
              });
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const addToGroup = (chatId, unique_id, users) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        addToGroupChat(chatId, unique_id, users).then(() => {
          dispatch(fetchChats());
          resolve('added');
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const removeFromGroup = (chatId, userId) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        removeFromGroupChat(chatId, userId).then(() => {
          dispatch(fetchChats());
          resolve('removed');
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//pending SingleChat
export const PendingSingleChat = (
  currentUser,
  user,
  chatName,
  isGroupChat,
  admin,
  avatar,
) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      try {
        initiatePendingSingleChat(
          currentUser,
          user,
          chatName,
          isGroupChat,
          admin,
          avatar,
          u._id,
        ).then(res => {
          //dispatch(fetchParticipants());
          getDataFromTable('pending_chat', 'id', res).then(r => {
            // getParticipantsByChatId(r[0].id).then(result => {
            //   let chat_obj = r[0];
            //   r[0].users = result;
            //   dispatch({type: NEW_CHAT, chats: chat_obj});
            //   resolve(chat_obj);
            // });
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

//sqlite
export const PendingGroupChat = (
  users,
  chatName,
  isGroupChat,
  groupAdmin,
  groupAvatar,
  pending,
) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const u = getState().auth.user;
      try {
        createPendingGroupChat(
          users,
          chatName,
          isGroupChat,
          groupAdmin,
          groupAvatar,
          pending,
          u._id,
        ).then(res => {
          getDataFromTable('pending_chat', 'id', res).then(res => {
            // getParticipantsByChatId(res[0].id).then(result => {
            //   const chat_obj = res[0];
            //   res[0].users = result;
            //   dispatch({type: NEW_CHAT, chats: chat_obj});
            //   resolve(chat_obj);
            // });
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  };
};

// export const addToGroup = (chatId, userId) => {
//   return async (dispatch, getState) => {
//     return new Promise(async (resolve, reject) => {
//       const token = getState().auth.token;
//       try {
//         const result = await client.put(
//           '/group-add',
//           {
//             chatId: chatId,
//             userId: userId,
//           },
//           {
//             headers: {
//               Authorization: `Basic ${token}`,
//               'Content-Type': 'application/json',
//             },
//           },
//         );
//         if (result.status === 200) {
//           // const chats = [];
//           // for (let i = 0; i < result.data.length; i++) {
//           //   if (
//           //     result.data[i].isGroupChat === false &&
//           //     result.data[i].latestMessage === undefined
//           //   ) {
//           //   } else chats.push(result.data[i]);
//           // }
//           // dispatch({
//           //   type: GET_CHATS,
//           //   chats: chats,
//           // });
//           dispatch(fetchChats());
//           resolve(result.data);
//         }
//       } catch (error) {
//         console.log(error.message);
//         reject(error.message);
//       }
//     });
//   };
// };

// export const removeFromGroup = (chatId, userId) => {
//   return async (dispatch, getState) => {
//     return new Promise(async (resolve, reject) => {
//       const token = getState().auth.token;
//       try {
//         const result = await client.put(
//           '/group-remove',
//           {
//             chatId: chatId,
//             userId: userId,
//           },
//           {
//             headers: {
//               Authorization: `Basic ${token}`,
//               'Content-Type': 'application/json',
//             },
//           },
//         );
//         if (result.status === 200) {
//           // const chats = [];
//           // for (let i = 0; i < result.data.length; i++) {
//           //   if (
//           //     result.data[i].isGroupChat === false &&
//           //     result.data[i].latestMessage === undefined
//           //   ) {
//           //   } else chats.push(result.data[i]);
//           // }
//           // dispatch({
//           //   type: GET_CHATS,
//           //   chats: chats,
//           // });
//           dispatch(fetchChats());
//           resolve(result.data);
//         }
//       } catch (error) {
//         console.log(error.message);
//         reject(error.message);
//       }
//     });
//   };
// };
