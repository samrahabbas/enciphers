import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('test.db', '1.0', '', 20000);

//starter
export const initiateApp = () => {
  //createUserTable();
  createChatTable();
  createCallTable();
  createMessageTable();
  createParticipantsTable();
  createPendingChatTable();
  createPendingCallTable();
  createPendingMessageTable();
  createPendingParticipantsTable();
};

// create Tables
// export const createUserTable = async (id, username, avatar) => {
//   try {
//     db.transaction(function (txn) {
//       txn.executeSql(
//         `SELECT name FROM sqlite_master WHERE type='table' AND name='user';`,
//         [],
//         (tx, results) => {
//           if (results.rows.length !== 0) {
//             txn.executeSql(
//               'INSERT INTO user (id, username, avatar) VALUES (?,?,?)',
//               [id, username, avatar],
//               (tx, results) => {
//                 console.log('Results', results.rowsAffected);
//                 if (results.rowsAffected > 0) {
//                   console.log('Success');
//                 } else console.log('Insertion Failed');
//               },
//               (tx, error) => console.log(error),
//             );
//           } else {
//             txn.executeSql(
//               'CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, username TEXT, avatar BLOB)',
//               [],
//               (tx, results) => {
//                 console.log('User Table created');
//               },
//               (tx, error) => console.log(error),
//             );
//             txn.executeSql(
//               'INSERT INTO user (id, username, avatar) VALUES (?,?,?)',
//               [id, username, avatar],
//               (tx, results) => {
//                 console.log('Results', results.rowsAffected);
//                 if (results.rowsAffected > 0) {
//                   console.log('Success');
//                 } else console.log('Insertion Failed');
//               },
//               (tx, error) => console.log(error),
//             );
//           }
//         },
//         (tx, error) => console.log(error),
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
export const createUserTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, username TEXT, avatar BLOB)',
        [],
        (tx, results) => {
          console.log('User Table created');
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};
export const createParticipantsTable = async () => {
  try {
    checkIfTableExists('participants').then(res => {
      if (res === true) {
        // insert values
      } else if (res === false) {
        db.transaction(function (txn) {
          txn.executeSql(
            `CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT, username TEXT, avatar BLOB, chat_id INTEGER, unique_id TEXT, FOREIGN KEY(userId) REFERENCES user(id), FOREIGN KEY(chat_id) REFERENCES chat(id))`,
            [],
            (tx, results) => {
              console.log('Participants Table Created');
            },
            (tx, error) => {
              console.log(error, tx);
            },
          );
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// can make sender and createdAt both unique or not UNIQUE(sender, createdAt)
export const createMessageTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS message (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, chat INTEGER, sender TEXT, status TEXT DEFAULT 'sent', createdAt DEFAULT (datetime('now','localtime')) UNIQUE, FOREIGN KEY(chat) REFERENCES chat(id), FOREIGN KEY(sender) REFERENCES user(id))`,
        [],
        (tx, results) => {
          console.log('Message Table Created');
        },
        (tx, error) => {
          console.log(error, tx);
        },
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};
export const createChatTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY AUTOINCREMENT, chatName TEXT, participants TEXT, isGroupChat BOOLEAN, latestMessage INTEGER, groupAdmin TEXT, groupAvatar BLOB DEFAULT 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', user_db TEXT, createdAt DEFAULT (datetime('now','localtime')), FOREIGN KEY(groupAdmin) REFERENCES user(id), FOREIGN KEY(latestMessage) REFERENCES message(id), UNIQUE(chatName, user_db))`,
        [],
        (tx, results) => {
          console.log('Chat Table Created');
        },
        (tx, error) => {
          console.log(error, tx);
        },
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};
//pending
export const createPendingChatTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS pending_chat (id INTEGER PRIMARY KEY AUTOINCREMENT, chatName TEXT, participants TEXT, isGroupChat BOOLEAN, latestMessage INTEGER, groupAdmin TEXT, groupAvatar BLOB DEFAULT 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', user_db TEXT, createdAt DEFAULT (datetime('now','localtime')), FOREIGN KEY(groupAdmin) REFERENCES user(id), FOREIGN KEY(latestMessage) REFERENCES pending_message(id), UNIQUE(chatName, user_db))`,
        [],
        (tx, results) => {
          console.log('Pending Chat Table Created');
        },
        (tx, error) => {
          console.log(error, tx);
        },
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};
export const createPendingParticipantsTable = async () => {
  try {
    checkIfTableExists('pending_participants').then(res => {
      if (res === true) {
        // insert values
      } else if (res === false) {
        db.transaction(function (txn) {
          txn.executeSql(
            `CREATE TABLE IF NOT EXISTS pending_participants (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT, username TEXT, avatar BLOB, chat_id INTEGER, unique_id TEXT, pending BOOLEAN, FOREIGN KEY(userId) REFERENCES user(id), FOREIGN KEY(chat_id) REFERENCES pending_chat(id))`,
            [],
            (tx, results) => {
              console.log('Pending Participants Table Created');
            },
            (tx, error) => {
              console.log(error, tx);
            },
          );
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export const createPendingMessageTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS pending_message (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, sender TEXT, pending BOOLEAN, chatName TEXT, pending_user TEXT, createdAt DEFAULT (datetime('now','localtime')), FOREIGN KEY(sender) REFERENCES user(id), UNIQUE(pending_user, createdAt))`,
        [],
        (tx, results) => {
          console.log('Pending Message Table Created');
        },
        (tx, error) => {
          console.log(error, tx);
        },
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};
export const createLatestMessageTable = async () => {
  try {
    checkIfTableExists('latestMessage').then(res => {
      if (res === true) {
        // insert values
        console.log('Table already Exists');
      } else if (res === false) {
        db.transaction(function (txn) {
          txn.executeSql(
            `CREATE TABLE IF NOT EXISTS latestMessage (id INTEGER PRIMARY KEY AUTOINCREMENT, senderId TEXT, chatId INTEGER UNIQUE, content TEXT, createdAt DATETIME, FOREIGN KEY(senderId) REFERENCES user(id), FOREIGN KEY(chatId) REFERENCES chat(id))`,
            [],
            (tx, results) => {
              console.log('Table Created');
            },
            (tx, error) => {
              console.log(error, tx);
            },
          );
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// call table
export const createCallTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS call (id INTEGER PRIMARY KEY AUTOINCREMENT, chatName TEXT, type TEXT, status TEXT, avatar BLOB, user_db TEXT, createdAt DEFAULT (datetime('now','localtime')), UNIQUE(chatName, createdAt))`,
        [],
        (tx, results) => {
          console.log('Call Table Created');
        },
        (tx, error) => {
          console.log(error, tx);
        },
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};
export const createPendingCallTable = async () => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS pending_call (id INTEGER PRIMARY KEY AUTOINCREMENT, chatName TEXT, type TEXT, status TEXT, avatar BLOB, user_db TEXT, pending_user TEXT, createdAt DEFAULT (datetime('now','localtime')), UNIQUE(chatName, createdAt))`,
        [],
        (tx, results) => {
          console.log('Pending Call Table Created');
        },
        (tx, error) => {
          console.log(error, tx);
        },
      );
    });
  } catch (error) {
    console.log('Error is', error);
  }
};

//helper
export const checkIfTableExists = async tableName => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM ${tableName}`,
          [],
          (tx, results) => {
            if (results.rows.length > 0) resolve(true);
          },
          (tx, error) => {
            if (error.toString().startsWith('Error: no such table')) {
              resolve(false);
            } else reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const userExists = async (id, username, avatar) => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `SELECT * FROM user WHERE id=?`,
        [id],
        (tx, results) => {
          if (results.rows.length > 0) {
            console.log('User Exists');
          } else {
            insertIntoUser(id, username, avatar);
          }
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const checkFieldFromTable = async (tableName, fieldName, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM ${tableName} WHERE ${fieldName}='${value}'`,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log('Error making new chat', error);
    }
  });
};

//setters
export const insertIntoUser = async (id, username, avatar) => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO user (id, username, avatar) VALUES (?,?,?)',
        [id, username, avatar],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Success');
          } else console.log('Insertion Failed');
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const initiateSingleChat = (
  currentUser,
  user,
  chatName,
  isGroupChat,
  groupAdmin,
  groupAvatar,
  user_db,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const arr = [user, currentUser];
      // check if already present
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            // console.log('Results', results.rows._array, results.rows.length);
            if (results.rows.length > 0) {
              const obj = {
                message: 'Already in Chat',
                res: results.rows._array[0],
              };
              resolve(obj);
            } else {
              try {
                // make new chat
                db.transaction(function (txn) {
                  txn.executeSql(
                    'INSERT INTO chat (chatName, isGroupChat, participants, latestMessage, groupAdmin, groupAvatar, user_db) VALUES (?,?,?,?,?,?,?)',
                    [
                      chatName,
                      isGroupChat,
                      null,
                      null,
                      groupAdmin,
                      groupAvatar,
                      user_db,
                    ],
                    (tx, results) => {
                      console.log('Chat added', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        var unique_id = Math.random()
                          .toString(36)
                          .substr(2, 12)
                          .toUpperCase();
                        checkFieldFromTable(
                          'participants',
                          'unique_id',
                          unique_id,
                        ).then(res => {
                          if (res === false) {
                          } else {
                            unique_id = Math.random()
                              .toString(36)
                              .substr(2, 12)
                              .toUpperCase();
                          }
                        });
                        let chat_id;
                        getChat(chatName, user_db).then(res => {
                          chat_id = res[0].id;
                          for (let i = 0; i < arr.length; i++) {
                            insertIntoParticipants(
                              arr[i]._id,
                              arr[i].username,
                              arr[i].avatar,
                              res[0].id,
                              unique_id,
                            );
                          }
                          console.log(arr.length + ' Participants added');
                          updateFieldFromTable(
                            'chat',
                            'participants',
                            unique_id,
                            'id',
                            res[0].id,
                          ).then(() => resolve(chat_id));
                        });
                      } else console.log('Insertion Failed');
                    },
                    (tx, error) => console.log(error),
                  );
                });
              } catch (error) {
                console.log('Error making new chat', error);
              }
            }
          },
          (tx, error) => console.log(error),
        );
      });
    } catch (error) {
      console.log('Error is', error);
    }
  });
};
export const createGroupChat = async (
  users,
  chatName,
  isGroupChat,
  groupAdmin,
  groupAvatar,
  user_db,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check if already present
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            // console.log('Results', results.rows._array, results.rows.length);
            if (results.rows.length > 0) {
              resolve('Group name already exists');
            } else {
              try {
                // make new chat
                db.transaction(function (txn) {
                  txn.executeSql(
                    'INSERT INTO chat (chatName, isGroupChat, participants, latestMessage, groupAdmin, groupAvatar, user_db) VALUES (?,?,?,?,?,?,?)',
                    [
                      chatName,
                      isGroupChat,
                      null,
                      null,
                      groupAdmin,
                      groupAvatar,
                      user_db,
                    ],
                    (tx, results) => {
                      console.log('Chat added', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        var unique_id = Math.random()
                          .toString(36)
                          .substr(2, 12)
                          .toUpperCase();
                        checkFieldFromTable(
                          'participants',
                          'unique_id',
                          unique_id,
                        ).then(res => {
                          if (res === false) {
                          } else {
                            unique_id = Math.random()
                              .toString(36)
                              .substr(2, 12)
                              .toUpperCase();
                          }
                        });
                        let chat_id;
                        getChat(chatName, user_db).then(res => {
                          chat_id = res[0].id;
                          for (let i = 0; i < users.length; i++) {
                            insertIntoParticipants(
                              users[i]._id,
                              users[i].username,
                              users[i].avatar,
                              res[0].id,
                              unique_id,
                            );
                          }
                          console.log(users.length + ' Participants added');
                          updateFieldFromTable(
                            'chat',
                            'participants',
                            unique_id,
                            'id',
                            res[0].id,
                          ).then(() => {
                            resolve(chat_id);
                          });
                        });
                      } else {
                        console.log('Insertion Failed');
                        reject('No rows Affected');
                      }
                    },
                    (tx, error) => {
                      console.log(error);
                    },
                  );
                });
              } catch (error) {
                console.log('Error making new chat', error);
              }
            }
          },
          (tx, error) => console.log(error),
        );
      });
    } catch (error) {
      console.log('Error is', error);
    }
  });
};
export const insertIntoParticipants = async (
  userId,
  username,
  avatar,
  chat,
  unique_id,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // make new chat
      db.transaction(function (txn) {
        txn.executeSql(
          'INSERT INTO participants (userId, username, avatar, chat_id, unique_id) VALUES (?,?,?,?,?)',
          [userId, username, avatar, chat, unique_id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve('Participant added');
            } else reject('Insertion Failed');
          },
          (tx, error) => reject(error),
        );
      });
    } catch (error) {
      console.log('Error making new chat', error);
    }
  });
};
export const insertIntoCall = (
  chatName,
  type,
  status,
  avatar,
  user_db,
  createdAt,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // make new call record
      if (createdAt) {
        db.transaction(function (txn) {
          txn.executeSql(
            'INSERT INTO call (chatName, type, status, avatar, user_db, createdAt) VALUES (?,?,?,?,?,?)',
            [chatName, type, status, avatar, user_db, createdAt],
            (tx, results) => {
              console.log('Call record added createdAt', results.rowsAffected);
              resolve('added');
            },
            (tx, error) => console.log(error),
          );
        });
      } else {
        db.transaction(function (txn) {
          txn.executeSql(
            'INSERT INTO call (chatName, type, status, avatar, user_db) VALUES (?,?,?,?,?)',
            [chatName, type, status, avatar, user_db],
            (tx, results) => {
              console.log('Call record added', results.rowsAffected);
              resolve('added');
            },
            (tx, error) => console.log(error),
          );
        });
      }
    } catch (error) {
      console.log('Error making new call record', error);
    }
  });
};
//pending
export const insertIntoPendingParticipants = async (
  userId,
  username,
  avatar,
  chat,
  unique_id,
  find,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // make new chat
      db.transaction(function (txn) {
        txn.executeSql(
          'INSERT INTO pending_participants (userId, username, avatar, chat_id, unique_id, pending) VALUES (?,?,?,?,?,?)',
          [userId, username, avatar, chat, unique_id, find],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve('Participant added');
            } else reject('Insertion Failed');
          },
          (tx, error) => reject(error),
        );
      });
    } catch (error) {
      console.log('Error making new chat', error);
    }
  });
};
export const initiatePendingSingleChat = (
  currentUser,
  user,
  chatName,
  isGroupChat,
  groupAdmin,
  groupAvatar,
  user_db,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const arr = [user, currentUser];
      // check if already present
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            // console.log('Results', results.rows._array, results.rows.length);
            if (results.rows.length > 0) {
              console.log('Already in Pending Chat');
            } else {
              try {
                // make new chat
                db.transaction(function (txn) {
                  txn.executeSql(
                    'INSERT INTO pending_chat (chatName, isGroupChat, participants, latestMessage, groupAdmin, groupAvatar, user_db) VALUES (?,?,?,?,?,?,?)',
                    [
                      chatName,
                      isGroupChat,
                      null,
                      null,
                      groupAdmin,
                      groupAvatar,
                      user_db,
                    ],
                    (tx, results) => {
                      console.log('Chat added', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        var unique_id = Math.random()
                          .toString(36)
                          .substr(2, 12)
                          .toUpperCase();
                        checkFieldFromTable(
                          'pending_participants',
                          'unique_id',
                          unique_id,
                        ).then(res => {
                          if (res === false) {
                          } else {
                            unique_id = Math.random()
                              .toString(36)
                              .substr(2, 12)
                              .toUpperCase();
                          }
                        });
                        let chat_id;
                        getPendingChat(chatName, user_db).then(res => {
                          chat_id = res[0].id;
                          for (let i = 0; i < arr.length; i++) {
                            insertIntoPendingParticipants(
                              arr[i]._id,
                              arr[i].username,
                              arr[i].avatar,
                              res[0].id,
                              unique_id,
                              true,
                            );
                          }
                          console.log(arr.length + ' Participants added');
                          updateFieldFromTable(
                            'pending_chat',
                            'participants',
                            unique_id,
                            'id',
                            res[0].id,
                          ).then(() => resolve(chat_id));
                        });
                      } else console.log('Insertion Failed');
                    },
                    (tx, error) => reject(error),
                  );
                });
              } catch (error) {
                console.log('Error making new chat', error);
              }
            }
          },
          (tx, error) => console.log(error),
        );
      });
    } catch (error) {
      console.log('Error is', error);
    }
  });
};
export const insertIntoPendingCall = (
  chatName,
  type,
  status,
  avatar,
  user_db,
  pending_user,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      try {
        // make new call record
        db.transaction(function (txn) {
          txn.executeSql(
            'INSERT INTO pending_call (chatName, type, status, avatar, user_db, pending_user) VALUES (?,?,?,?,?,?)',
            [chatName, type, status, avatar, user_db, pending_user],
            (tx, results) => {
              console.log('Pending Call record added', results.rowsAffected);
              resolve('added');
            },
            (tx, error) => console.log(error),
          );
        });
      } catch (error) {
        console.log('Error making pending call record', error);
      }
    } catch (error) {
      console.log('Error is', error);
    }
  });
};
export const checkPendingChats = async (chatName, currentUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_chat WHERE chatName=? AND groupAdmin=?`,
          [chatName, currentUser._id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            } else console.log('Insertion Failed');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const getPendingParticipantsOfChat = async chat_id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_participants WHERE chat_id=?`,
          [chat_id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else console.log('Search Failed');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const createPendingGroupChat = async (
  users,
  chatName,
  isGroupChat,
  groupAdmin,
  groupAvatar,
  pending,
  user_db,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check if already present
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            // console.log('Results', results.rows._array, results.rows.length);
            if (results.rows.length > 0) {
              console.log('Success');
            } else {
              try {
                // make new chat
                db.transaction(function (txn) {
                  txn.executeSql(
                    'INSERT INTO pending_chat (chatName, isGroupChat, participants, latestMessage, groupAdmin, groupAvatar, user_db) VALUES (?,?,?,?,?,?,?)',
                    [
                      chatName,
                      isGroupChat,
                      null,
                      null,
                      groupAdmin,
                      groupAvatar,
                      user_db,
                    ],
                    (tx, results) => {
                      console.log('Chat added', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        var unique_id = Math.random()
                          .toString(36)
                          .substr(2, 12)
                          .toUpperCase();
                        checkFieldFromTable(
                          'pending_participants',
                          'unique_id',
                          unique_id,
                        ).then(res => {
                          if (res === false) {
                          } else {
                            unique_id = Math.random()
                              .toString(36)
                              .substr(2, 12)
                              .toUpperCase();
                          }
                        });
                        let chat_id;
                        getPendingChat(chatName, user_db).then(res => {
                          chat_id = res[0].id;
                          for (let i = 0; i < users.length; i++) {
                            const find = pending.some(
                              p => p.userId === users[i]._id,
                            );
                            insertIntoPendingParticipants(
                              users[i]._id,
                              users[i].username,
                              users[i].avatar,
                              res[0].id,
                              unique_id,
                              find,
                            );
                          }
                          console.log(users.length + ' Participants added');
                          updateFieldFromTable(
                            'pending_chat',
                            'participants',
                            unique_id,
                            'id',
                            res[0].id,
                          ).then(() => {
                            resolve(chat_id);
                          });
                        });
                      } else {
                        console.log('Insertion Failed');
                        reject('No rows Affected');
                      }
                    },
                    (tx, error) => {
                      console.log(error);
                      reject(error);
                    },
                  );
                });
              } catch (error) {
                console.log('Error making new chat', error);
              }
            }
          },
          (tx, error) => console.log(error),
        );
      });
    } catch (error) {
      console.log('Error is', error);
    }
  });
};
export const checkPendingParticipants = async user => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_participants WHERE userId=? AND pending=?`,
          [user._id, 1],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else console.log('Search Failed From Pending Participants');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const checkPendingCall = async (userId, pending_user) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_call WHERE user_db=? AND pending_user=?`,
          [userId, pending_user],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else console.log('Search Failed From Pending Calls');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const checkPendingParticipantsOfChat = async chat_id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_participants WHERE chat_id=?`,
          [chat_id],
          (tx, results) => {
            if (results.rows.length > 0) {
              const arr = results.rows._array;
              //check if every participant has pending false
              let pending = false;
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].pending === 0) {
                  //false
                } else pending = true;
              }
              resolve(pending);
            } else console.log('Failed checkPendingParticipantsOfChat');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const checkPendingMessage = async user => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_message WHERE pending_user=?`,
          [user._id],
          (tx, results) => {
            if (results.rows.length > 0) {
              const arr = results.rows._array;
              resolve(arr);
            } else console.log('Failed checkPendingMessage');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

//getters
export const getChats = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM participants WHERE userId=?`,
          [userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              //const chats = [];
              const user_chats = results.rows._array;
              // for (let i = 0; i < user_chats.length; i++) {
              //   getChatsById(user_chats[i].chat_id).then(res => {
              //     chats.push(res);
              //     console.log(chats);
              //   });
              // }
              // console.log(chats);
              resolve(user_chats);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getCalls = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM call WHERE user_db=?`,
          [userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              const user_calls = results.rows._array;
              resolve(user_calls);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getChatsById = (chatId, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM chat WHERE id=? AND user_db=?`,
          [chatId, user._id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getChatsByName = (chatName, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM chat WHERE chatName=? AND user_db=?`,
          [chatName, user._id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getGroupChatsByName = (chatName, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM chat WHERE chatName=? AND user_db=?`,
          [chatName, user._id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            } else {
              resolve('Chat does not exist');
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getChat = async (chatName, user_db) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getPendingChat = async (chatName, user_db) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getPendingChatById = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_chat WHERE id=?`,
          [id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getData = async tableName => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM ${tableName}`,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getPendingChatByName = async (chatName, user_db) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM pending_chat WHERE chatName=? AND user_db=?`,
          [chatName, user_db],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else resolve([]);
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getParticipants = async (tableName, fieldName, unique_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM ${tableName} WHERE ${fieldName}='${unique_id}'`,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else {
              console.log('No results');
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getDataFromTable = async (tableName, fieldName, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM ${tableName} WHERE ${fieldName}=${value}`,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getDataById = async (tableName, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM ${tableName} WHERE id=${id}`,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            } else console.log('Insertion Failed');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const getSenderById = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM user WHERE id=?`,
          [id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            } else console.log('No Results');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const getChatMessages = async chatId => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM message WHERE chat=?`,
          [chatId],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getParticipantsByChatId = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM participants WHERE chat_id=?`,
          [id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array);
            } else {
              console.log('No results');
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};

//delete & drop
export const deleteRow = rowId => {
  try {
    db.transaction(txn => {
      txn.executeSql(
        `Delete from chat where rowid=${rowId}`,
        [],
        (tx, results) => {
          console.log('Query completed');
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const dropTable = tableName => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `DROP TABLE ${tableName}`,
        [],
        (tx, results) => {
          console.log('Dropped');
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const truncateTable = tableName => {
  try {
    db.transaction(function (txn) {
      txn.executeSql(
        `DELETE FROM ${tableName}`,
        [],
        (tx, results) => {
          console.log('truncated');
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteRows = (table_name, field, value) => {
  try {
    db.transaction(txn => {
      txn.executeSql(
        `Delete from ${table_name} where ${field}=${value}`,
        [],
        (tx, results) => {
          console.log('Query completed');
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const deletePendingMessages = user => {
  try {
    db.transaction(txn => {
      txn.executeSql(
        `Delete from pending_message WHERE pending_user=?`,
        [user._id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('pending messages deleted', results.rowsAffected);
          }
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const deletePendingCalls = (userId, pending_user) => {
  try {
    db.transaction(txn => {
      txn.executeSql(
        `Delete from pending_call WHERE user_db=? AND pending_user=?`,
        [userId, pending_user],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('pending call deleted', results.rowsAffected);
          }
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
export const delete5daysAgoMessages = () => {
  try {
    db.transaction(txn => {
      txn.executeSql(
        `Delete from message where createdAt < date('now','-5 days')`,
        [],
        (tx, results) => {
          console.log('Deletion of 5 days ago messages completed');
        },
        (tx, error) => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};

//update
export const updateFieldFromTable = async (
  tableName,
  fieldName,
  value,
  whereField,
  whereValue,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `UPDATE ${tableName} SET '${fieldName}'='${value}' WHERE ${whereField}=${whereValue}`,
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve('Updated');
            } else {
              resolve('Not update');
            }
          },
          (tx, error) => reject(error),
        );
      });
    } catch (error) {
      console.log('Error', error);
    }
  });
};
export const updatePendingParticipants = async (user, chat_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `UPDATE pending_participants SET pending=? WHERE userId=? AND chat_id=?`,
          [false, user._id, chat_id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve('Updated');
            } else console.log('Not Updated');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const updatePendingUserMessages = async user => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `UPDATE pending_message SET pending=? WHERE pending_user=?`,
          [false, user._id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve('Updated');
            } else console.log('Not Updated');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

//GroupChat Functions
export const addToGroupChat = async (chatId, unique_id, users) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < users.length; i++) {
        insertIntoParticipants(
          users[i].userId,
          users[i].username,
          users[i].avatar,
          chatId,
          unique_id,
        );
      }
      console.log(users.length + ' Participants added');
      resolve(users.length + ' Participants added');
    } catch (error) {
      reject(error);
    }
  });
};
export const removeFromGroupChat = async (chatId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `DELETE FROM participants WHERE chat_id='${chatId}' AND userId='${userId}'`,
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve(results.rowsAffected + ' Row Deleted');
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

//chat
export const sendMessage = async (content, chatId, senderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `INSERT INTO message (content, chat, sender) VALUES (?,?,?)`,
          [content, chatId, senderId],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              getDataById('message', results.insertId).then(res =>
                resolve(res),
              );
            } else console.log('Insertion Failed');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const sendPending = async (content, chatId, senderId, createdAt) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `INSERT INTO message (content, chat, sender, createdAt) VALUES (?,?,?,?)`,
          [content, chatId, senderId, createdAt],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              getDataById('message', results.insertId).then(res =>
                resolve(res),
              );
            } else console.log('Insertion Failed');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const savePendingMessages = async (
  content,
  senderId,
  pending,
  chatName,
  createdAt,
  pending_user,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `INSERT INTO pending_message (content, sender, pending, chatName, pending_user, createdAt) VALUES (?,?,?,?,?,?)`,
          [content, senderId, pending, chatName, pending_user, createdAt],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              getDataById('pending_message', results.insertId).then(res =>
                resolve(res),
              );
            } else console.log('Insertion Pending Message Failed');
          },
          (tx, error) => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

//extras
export const addLatestMessage = async (
  senderId,
  chatId,
  content,
  createdAt,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check if chat id already exists in this table
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM latestMessage WHERE chatId=?`,
          [chatId],
          (tx, results) => {
            if (results.rows.length > 0) {
              const id = results.rows._array[0].id;
              db.transaction(function (txn) {
                txn.executeSql(
                  `UPDATE latestMessage SET senderId=?, chatId=?, content=?, createdAt=?  WHERE id=${id}`,
                  [senderId, chatId, content, createdAt],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      resolve('Updated');
                    } else {
                      resolve('Not update');
                    }
                  },
                  (tx, error) => reject(error),
                );
              });
            } else {
              db.transaction(function (txn) {
                txn.executeSql(
                  'INSERT INTO latestMessage (senderId, chatId, content, createdAt) VALUES (?,?,?,?)',
                  [senderId, chatId, content, createdAt],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      resolve('latest message added');
                    } else reject('Insertion Failed');
                  },
                  (tx, error) => reject(error),
                );
              });
            }
          },
          (tx, error) => reject(error),
        );
      });
    } catch (error) {
      console.log('Error', error);
    }
  });
};
export const getLatestMessageId = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM latestMessage WHERE chatId=?`,
          [id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
export const getLatestMessage = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT * FROM message WHERE id=?`,
          [id],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows._array[0]);
            } else {
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
};
