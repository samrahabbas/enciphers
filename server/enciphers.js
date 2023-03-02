const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./models/db');
const userRouter = require('./routes/user');
const chatRoomRouter = require('./routes/chatRoom');
const chatRouter = require('./routes/chat');
const messageRouter = require('./routes/message');
const User = require('./models/user');
const {createServer} = require('http');
const {Server} = require('socket.io');
const WebSockets = require('./utils/WebSockets.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use('/api', userRouter);

// app.use(chatRoomRouter);
// app.use('/api',chatRouter);
// app.use('/api',messageRouter);

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: [
      //'http://localhost:3000',
      'https://api.enciphers.io', //development
      //'http://192.168.18.39:3000', //remove for development
      //'http://192.168.18.76:3000',
    ],
  },
});

//development change port 9999
httpServer.listen(9999, () => {
  console.log('server running');
});

const users = {};
const conference = {};

io.on('connection', socket => {
  console.log('connected to socket.io', socket.id);
  const {rooms} = io.sockets.adapter;
  // console.log(rooms, 'rooms');

  socket.on('pending call record', (info, pendingUserId) => {
    socket.to(pendingUserId).emit('pending call record', info);
  });

  socket.on('chat created', (socketInfo, currentUser) => {
    let online;
    for (let u of Object.values(users)) {
      if (u === socketInfo.otherUser.userId) {
        socket.in(socketInfo.otherUser.userId).emit('chat', socketInfo);
        online = true;
      }
    }
    if (online === undefined) {
      socket.emit('pending chat', socketInfo);
    }
  });

  socket.on('group chat created', socketInfo => {
    let pending = socketInfo.otherUsers;
    socketInfo.users.forEach(user => {
      if (user.userId == socketInfo.groupAdmin) return; //remove admin

      for (let u of Object.values(users)) {
        if (u === user.userId) {
          socket.in(user.userId).emit('group chat', socketInfo);
          const find = pending.find(el => el.userId === user.userId);
          if (find) {
            let array = [...pending];
            let index = array.indexOf(find);
            if (index !== -1) {
              array.splice(index, 1);
              pending = array;
            }
          }
        }
      }
    });
    if (pending.length !== 0) {
      socket.emit('pending group chat', socketInfo, pending);
    }
  });

  socket.on('setup', userData => {
    // let arr = Object.values(users);
    // let find = false;
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i] === userData._id) {
    //     find = true;
    //   }
    // }
    // if (!find) {
    socket.join(userData._id);
    console.log(userData._id + ' joined with', socket.id);
    if (Object.values) users[socket.id] = userData._id;
    socket.emit('connected');
    console.log(users, 'users');
    setTimeout(function () {
      socket.broadcast.emit('got connected', userData);
    }, 3000);
    //}
  });

  socket.on('connect_error', err => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on('join chat', room => {
    socket.join(room);
    console.log('User joined room ' + room);
  });

  socket.on('terminate call', otherUser => {
    socket.to(otherUser._id).emit('call terminated');
  });

  socket.on('rejected', roomName => {
    socket.broadcast.to(roomName).emit('rejected');
  });

  socket.on('join voice call', (roomName, user, otherUser) => {
    const {rooms} = io.sockets.adapter;
    const room = rooms.get(roomName);
    if (room === undefined) {
      //your socket.id is in room named by roomName
      socket.join(roomName);
      socket.emit('created');
      // see if the user is online and then send him
      // socket.to(otherUser._id).emit()
      let online;
      for (let u of Object.values(users)) {
        if (u === otherUser._id) {
          socket.to(otherUser._id).emit('incoming voice call', roomName, user);
          online = true;
        }
      }
      if (online === undefined) {
        socket.emit('pending missed voice call', user, otherUser._id);
      }
    } else if (room.size === 1) {
      // room.size == 1 when one person is inside the room.
      // console.log(room.size, 'size');
      socket.join(roomName);
      socket.emit('joined voice call', roomName);
    } else {
      // when there are already two people inside the room.
      socket.emit('full');
    }
  });

  socket.on('ready voice call', roomName => {
    socket.broadcast.to(roomName).emit('ready voice call', roomName); // Informs the other peer in the room.
  });

  socket.on('offer voice call', (offer, roomName) => {
    socket.broadcast.to(roomName).emit('offer voice call', offer, roomName);
    // Sends Offer to the other peer in the room.
  });

  socket.on('video call', (roomName, user, otherUser) => {
    socket.join(roomName);
    socket.to(roomName).emit('joined', roomName);
  });

  socket.on('join video call', (roomName, user, otherUser) => {
    const {rooms} = io.sockets.adapter;
    const room = rooms.get(roomName);
    // room == undefined when no such room exists.
    if (room === undefined) {
      //your socket.id is in room named by roomName
      socket.join(roomName);
      socket.emit('created');
      // see if the user is online and then send him
      // socket.to(otherUser._id).emit()
      let online;
      for (let u of Object.values(users)) {
        if (u === otherUser._id) {
          socket.to(otherUser._id).emit('incoming call', roomName, user);
          online = true;
        }
      }
      if (online === undefined) {
        socket.emit('pending missed video call', user, otherUser._id);
      }
    } else if (room.size === 1) {
      // room.size == 1 when one person is inside the room.
      // console.log(room.size, 'size');
      socket.join(roomName);
      socket.emit('joined', roomName);
    } else {
      // when there are already two people inside the room.
      socket.emit('full');
    }
  });

  // Triggered when the person who joined the room is ready to communicate.
  socket.on('ready', roomName => {
    socket.broadcast.to(roomName).emit('ready', roomName); // Informs the other peer in the room.
  });

  // Triggered when server gets an icecandidate from a peer in the room.
  socket.on('ice-candidate', (candidate, roomName) => {
    socket.broadcast.to(roomName).emit('ice-candidate', candidate, roomName); // Sends Candidate to the other peer in the room.
  });

  // Triggered when server gets an offer from a peer in the room.
  socket.on('offer', (offer, roomName) => {
    socket.broadcast.to(roomName).emit('offer', offer, roomName);
    // Sends Offer to the other peer in the room.
  });

  // Triggered when server gets an answer from a peer in the room.
  socket.on('answer', (answer, roomName) => {
    socket.broadcast.to(roomName).emit('answer', answer, roomName); // Sends Answer to the other peer in the room.
  });

  socket.on('end call', roomName => {
    socket.leave(roomName);
    const room = rooms.get(roomName);
    //console.log(room, roomName);
    socket.broadcast.to(roomName).emit('end call');
  });

  // socket.on('join group room', roomID => {
  //   if (groupUsers[roomID]) {
  //     const length = groupUsers[roomID].length;
  //     if (length === 4) {
  //       socket.emit('room full');
  //       return;
  //     }
  //     groupUsers[roomID].push(socket.id);
  //   } else {
  //     groupUsers[roomID] = [socket.id];
  //   }
  //   socketToRoom[socket.id] = roomID;
  //   const usersInThisRoom = groupUsers[roomID].filter(id => id !== socket.id);
  //   socket.emit('all users', usersInThisRoom);
  // });

  // socket.on('sending signal', payload => {
  //   socket.to(payload.userToSignal).emit('user joined', {
  //     signal: payload.signal,
  //     callerID: payload.callerID,
  //   });
  // });

  // socket.on('returning signal', payload => {
  //   socket.to(payload.callerID).emit('receiving returned signal', {
  //     signal: payload.signal,
  //     id: socket.id,
  //   });
  // });

  // socket.on('disconnect', () => {
  //   const roomID = socketToRoom[socket.id];
  //   let room = groupUsers[roomID];
  //   if (room) {
  //     room = room.filter(id => id !== socket.id);
  //     groupUsers[roomID] = room;
  //   }
  // });

  socket.on('terminate group call', participants => {
    for (let p of participants) {
      socket.to(p.userId).emit('group call terminated');
    }
  });

  socket.on(
    'join group voice call',
    (roomName, user, participants, info, caller) => {
      const {rooms} = io.sockets.adapter;
      const room = rooms.get(roomName);

      if (!room) {
        socket.join(roomName);
        socket.emit('group voice call created');
        //delete conference.roomName in endCall
        conference.roomName = [user];
        socket.emit('participant joined', conference.roomName);
        //user joins and other participants get informed about the call
        for (let p of participants) {
          let online;
          for (let u of Object.values(users)) {
            if (u === p.userId) {
              socket
                .to(p.userId)
                .emit('incoming group voice call', roomName, info, user);
              online = true;
            }
          }
          if (online === undefined) {
            socket.emit('pending missed group voice call', info, p.userId);
          }
        }
      } else {
        socket.join(roomName);
        socket.emit('group voice call joined', roomName, caller);
        //console.log(room, 'room');
        conference.roomName.push(user);
        // for (let p of participants) {
        socket.to(roomName).emit('participant joined', conference.roomName);
        socket.emit('participant joined', conference.roomName);
        //}
        // for (let p of participants) {
        //   // let online;
        //   for (let u of Object.values(users)) {
        //     if (u === p.userId) {
        //       socket
        //         .to(p.userId)
        //         .emit('participant joined', user);
        //       online = true;
        //     }
        //   }
        // }
      }
    },
  );

  socket.on(
    'ready group voice call',
    (roomName, userThatsReady, caller, readyUser) => {
      for (let c of conference.roomName) {
        if (c.username !== userThatsReady) {
          //console.log(c.username, userThatsReady);
          socket
            .to(c._id)
            .emit(
              'ready group voice call',
              roomName,
              userThatsReady,
              caller,
              readyUser,
            );
        }
      }
      // socket.broadcast
      //   .to(roomName)
      //   .emit(
      //     'ready group voice call',
      //     roomName,
      //     userThatsReady,
      //     caller,
      //     readyUser,
      //   );
      // socket.emit('ready initiated');
    },
  );

  socket.on(
    'offer group voice call',
    (offer, roomName, user, caller, readyUser, offerTo) => {
      socket
        .to(readyUser._id)
        .emit('offer group voice call', offer, roomName, user, caller, offerTo);
      // socket.broadcast
      //   .to(roomName)
      //   .emit('offer group call', offer, roomName, user, caller);
    },
  );

  socket.on('join group call', (roomName, user, participants, info, caller) => {
    // const room = Object.keys(conference).find(c => c === roomName);
    // if (!room) {
    //   conference[roomName] = {
    //     participants: [{id: user._id, username: user.username}],
    //     calling: [],
    //   };
    //   socket.emit('group call created');
    //   //user joins and other participants get informed about the call
    //   for (let p of participants) {
    //     let online;
    //     for (let u of Object.values(users)) {
    //       if (u === p.userId) {
    //         socket
    //           .to(p.userId)
    //           .emit('incoming group call', roomName, info, user);
    //         online = true;
    //       }
    //     }
    //     if (online === undefined) {
    //       socket.emit('pending group missed call', info);
    //     }
    //   }
    // } else {
    //   conference[roomName].participants.push({
    //     id: user._id,
    //     username: user.username,
    //   });
    //   socket.emit('group call joined', roomName, caller);
    //   console.log(conference, 'conference');
    // }
    const {rooms} = io.sockets.adapter;
    const room = rooms.get(roomName);
    //console.log('execution');
    if (!room) {
      socket.join(roomName);
      conference.roomName = [user];
      socket.emit('group call created');
      //user joins and other participants get informed about the call
      for (let p of participants) {
        let online;
        for (let u of Object.values(users)) {
          if (u === p.userId) {
            socket
              .to(p.userId)
              .emit('incoming group call', roomName, info, user);
            online = true;
          }
        }
        if (online === undefined) {
          socket.emit('pending missed group video call', info, p.userId);
        }
      }
    } else {
      //room exists (meaning the joining user is not the caller)
      //1) get the already joined participants in the room
      socket.join(roomName);
      socket.emit('group call joined', roomName, caller); //get stream of already present users
      //get already present in the room;
      //console.log(room, 'room');
      conference.roomName.push(user);
      // for (let p of participants) {
      socket.to(roomName).emit('gc participant joined', conference.roomName);
      socket.emit('gc participant joined', conference.roomName);
      // io.in(roomName)
      //   .fetchSockets()
      //   .then(res => {
      //     console.log(res);
      //   });
      // socket.emit('group call joined')
      // socket.broadcast.to(roomName).emit('user joined call', user); //peer handshake;
    }
    //take all the sockets in the room and get from users object the user ids
    //inform the already present participants in the room that user has joined and send stream
    //send user stream to others
  });

  //user2 and user3 returning ready event to user1
  socket.on(
    'ready group call',
    (roomName, userThatsReady, caller, readyUser) => {
      // const room = Object.keys(conference).find(c => c === roomName);
      // const participants = conference[roomName].participants;
      // const calling = conference[roomName].calling;
      // const indexOfReadyUser = participants.findIndex(p => p.username === userThatsReady);
      // if(room){
      //   for(let i=0; i<participants.length; i++){
      //     //not itself, if mid user ?
      //   }
      // }
      // console.log(userThatsReady);
      // const room = rooms.get(roomName);
      // console.log(room);
      for (let c of conference.roomName) {
        if (c.username !== userThatsReady) {
          socket
            .to(c._id)
            .emit(
              'ready group call',
              roomName,
              userThatsReady,
              caller,
              readyUser,
            );
        }
      }
      // socket.broadcast
      //   .to(roomName)
      //   .emit('ready group call', roomName, userThatsReady, caller, readyUser);
      // //jane ready going to eman and hajra
      // socket.emit('ready initiated');
    },
  );

  socket.on(
    'ice-candidate group call',
    (candidate, roomName, fromUser, readyUser) => {
      socket
        .to(readyUser._id)
        .emit('ice-candidate group call', candidate, roomName, fromUser);
      // socket.broadcast
      //   .to(roomName)
      //   .emit('ice-candidate group call', candidate, roomName, fromUser, readyUser);
    },
  );

  socket.on(
    'offer group call',
    (offer, roomName, user, caller, readyUser, offerTo) => {
      socket
        .to(readyUser._id)
        .emit('offer group call', offer, roomName, user, caller, offerTo);
      // socket.broadcast
      //   .to(roomName)
      //   .emit('offer group call', offer, roomName, user, caller);
    },
  );

  socket.on(
    'answer group call',
    (answer, roomName, fromUser, caller, answerTo) => {
      socket
        .to(answerTo._id)
        .emit('answer group call', answer, roomName, fromUser, caller);
      // socket.broadcast
      //   .to(roomName)
      //   .emit('answer group call', answer, roomName, fromUser, caller);
    },
  );

  socket.on('end group call', (roomName, user) => {
    socket.leave(roomName);
    //console.log(roomName);
    const index = conference.roomName.findIndex(p => p._id === user._id);
    conference.roomName.splice(index, 1);
    const room = rooms.get(roomName);
    socket.broadcast
      .to(roomName)
      .emit('end group call', user, conference.roomName);
  });

  socket.on('leave group call', (roomName, user) => {
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit('leave group call', user);
  });

  socket.on('rejected', roomName => {
    socket.broadcast.to(roomName).emit('rejected');
  });

  socket.on('typing', room => socket.in(room).emit('typing'));

  socket.on('stop typing', room => socket.in(room).emit('stop typing'));

  socket.on('typing group', (room, userData) => {
    socket.in(room).emit('typing group', userData);
    socket.emit('typing name', userData.username);
  });

  socket.on('stop typing group', (room, userData) =>
    socket.in(room).emit('stop typing group', userData),
  );

  socket.on('receive messages', messages => {
    socket.in(messages[0].pending_user).emit('get received messages', messages);
  });

  socket.on('new message', newMessageReceived => {
    //var chat = newMessageReceived.chat;

    // if (!chat.users) return console.log('chat.users not defined');
    if (!newMessageReceived.users) return console.log('users not defined');

    let pending = [];
    newMessageReceived.users.forEach(user => {
      if (user.userId == newMessageReceived.message.sender) return; //removed sender._id

      pending.push(user);
      //console.log(user);
      for (let u of Object.values(users)) {
        if (u === user.userId) {
          socket.in(user.userId).emit('message received', newMessageReceived);
          const find = pending.find(el => el.userId === user.userId);
          if (find) {
            let array = [...pending];
            let index = array.indexOf(find);
            if (index !== -1) {
              array.splice(index, 1);
              pending = array;
            }
          }
        }
      }
    });
    if (pending.length !== 0) {
      socket.emit('pending message', newMessageReceived, pending);
    }
  });

  // socket.on('logout', userData => {
  //   console.log('USER DISCONNECTED');
  //   delete users[socket.id];
  //   socket.leave(userData._id);
  // });

  socket.on('disconnect', userData => {
    console.log('USER DISCONNECTED');
    delete users[socket.id];
    socket.leave(userData._id);
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});

app.get('/', (req, res) => {
  res.json({success: true, message: 'Welcome to backend zone!'});
});

// if we don't make the user go away from users variable and on rejoin we check that if the id exits we update the socket it?
