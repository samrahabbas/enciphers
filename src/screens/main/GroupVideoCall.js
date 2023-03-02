import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  AddUser,
  Mic,
  MissedCall,
  Speaker,
  Video,
} from '../../assets/icons/icons';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import Header from '../../components/Header';
import {useSelector} from 'react-redux';
import {socket} from '../../redux/reducers/socket';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import moment from 'moment';
import RNSimplePeer from 'react-native-simple-peer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const GroupVideoCall = ({navigation, route}) => {
  const {participants, info} = route.params;
  const [picked, setPicked] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  const userStreamRef = useRef();
  const hostRef = useRef(false);
  const roomName = genRandomString(12);
  const user = useSelector(state => state.auth.user);
  const [streams, setStreams] = useState([]);
  const [peers, setPeers] = useState([]);
  const [peerConnections, setPeerConnections] = useState([]);
  const peersRef = useRef([]);
  const RoomName = useRef(null);
  const streamURLs = useRef([]);
  const [groupCallParticipants, setGroupCallParticipants] = useState([]);
  //const socket = useSelector(state => state.socket.socket);
  //let peerConnection;

  let image = [
    null,
    null,
    null,
    // {image: require('../../assets/images/Groupchat/Image.png')},
    // {image: require('../../assets/images/Groupchat/Image(1).png')},
    // {image: require('../../assets/images/Groupchat/Image(2).png')},
    //{image: require('../../assets/images/Groupchat/Image(3).png')},
  ];

  function genRandomString(length) {
    var chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    var charLength = chars.length;
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

  let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true,
    },
  };

  let isFront = true;
  let mediaConstraints = {
    audio: true,
    video: {
      mandatory: {
        minWidth: 500, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30,
      },
      facingMode: isFront ? 'user' : 'environment',
    },
  };

  let peerConstraints = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  };

  // for (let p of peers) {
  //   console.log(p.streams, user.username);
  // }
  // useEffect(() => {
  //   console.log(streams, user.username);
  // }, [streams]);

  // useEffect(() => {
  //   let localMediaStream;
  //   let isVoiceOnly = false;
  //   try {
  //     mediaDevices.getUserMedia(mediaConstraints).then(mediaStream => {
  //       if (isVoiceOnly) {
  //         let videoTrack = mediaStream.getVideoTracks()[0];
  //         videoTrack.enabled = false;
  //       }
  //       setLocalMediaStream(mediaStream);
  //       socket.emit('join group room');
  //       socket.on('all users', users => {
  //         console.log('all users', user.username);
  //         const peers = [];
  //         // this will not be executed for the person who has initiated the call
  //         users.forEach(userID => {
  //           const peer = createPeer(userID, socket.id, mediaStream);
  //           peersRef.current.push({
  //             peerID: userID,
  //             peer,
  //           });
  //           peers.push(peer);
  //         });
  //         setPeers(peers);
  //         setStreams(streams => [...streams, mediaStream.toURL()]);
  //       });
  //       // localMediaStream = mediaStream;
  //       // userStreamRef.current = mediaStream;
  //       // setLocalStream(mediaStream);
  //       // setLocalMediaStream(localMediaStream.toURL());

  //       //console.log(mediaStream.toURL());
  //       //other user
  //       socket.on('user joined', payload => {
  //         console.log('user joined', user.username);
  //         const peer = addPeer(payload.signal, payload.callerID, mediaStream);
  //         peersRef.current.push({
  //           peerID: payload.callerID,
  //           peer,
  //         });

  //         setPeers(users => [...users, peer]);
  //         setStreams(streams => [...streams, mediaStream.toURL()]);
  //       });

  //       socket.on('receiving returned signal', payload => {
  //         console.log('receiving returned signal', user.username);
  //         const item = peersRef.current.find(p => p.peerID === payload.id);
  //         item.peer.signal(payload.signal);
  //       });
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  // //user 2
  // function createPeer(userToSignal, callerID, stream) {
  //   console.log('create peer', user.username);
  //   const Peer = new RNSimplePeer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //     webRTC: {RTCPeerConnection, RTCIceCandidate, RTCSessionDescription},
  //   });

  //   console.log('signal', user.username);
  //   Peer.on('signal', signal => {
  //     socket.emit('sending signal', {userToSignal, callerID, signal});
  //   });

  //   Peer.on('stream', stream => {
  //     console.log('stream', stream, user.username);
  //     const s = new MediaStream(stream);
  //     setStreams(streams => [...streams, s.toURL()]);
  //   });

  //   Peer.on('connect', () => {
  //     console.log('connected', user.username);
  //   });

  //   return Peer;
  // }

  // //user 1
  // function addPeer(incomingSignal, callerID, stream) {
  //   console.log('add peer', user.username);
  //   const peer = new RNSimplePeer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //     webRTC: {RTCPeerConnection, RTCIceCandidate, RTCSessionDescription},
  //   });

  //   console.log('signal', user.username);
  //   peer.on('signal', signal => {
  //     socket.emit('returning signal', {signal, callerID});
  //   });

  //   peer.on('stream', stream => {
  //     console.log('stream', stream, user.username);
  //     const s = new MediaStream(stream);
  //     setStreams(streams => [...streams, s.toURL()]);
  //   });

  //   peer.signal(incomingSignal);

  //   return peer;
  // }

  useEffect(() => {
    //others array
    socket.emit(
      'join group call',
      roomName,
      user,
      participants,
      info,
      user.username,
    );
    socket
      .off('group call created')
      .on('group call created', handleRoomCreated);

    socket.on('ready group call', initiateOffer);
    socket
      .off('gc participant joined')
      .on('gc participant joined', handleGcParticipantJoined);
    socket
      .off('offer group call')
      .on('offer group call', handleReceivedGroupCallOffer);
    // // If the room didn't exist, the server would emit the room was 'created'
    // // Whenever the next person joins, the server emits 'ready'
    // //socket.off('group call ready').on('group call ready', initiateCall); // host
    socket.on('ice-candidate group call', handlerNewIceCandidateMsg);
    socket.off('answer group call').on('answer group call', handleAnswer); // host receiving the answer back from the offer given to other user
    // // Emitted when a peer leaves the room
    socket.off('leave group call').on('leave group call', onPeerLeave);
    //return () => socket.emit('leave group call', leaveRoom);
  }, []);

  const handleRoomCreated = () => {
    console.log('handleRoomCreated (host)', user.username);
    hostRef.current = true;
    let localMediaStream;
    let isVoiceOnly = false;
    try {
      mediaDevices.getUserMedia(mediaConstraints).then(mediaStream => {
        if (isVoiceOnly) {
          let videoTrack = mediaStream.getVideoTracks()[0];
          videoTrack.enabled = false;
        }
        localMediaStream = mediaStream;
        userStreamRef.current = mediaStream;
        //setLocalStream(mediaStream);
        //setLocalMediaStream(localMediaStream.toURL());
        //console.log(mediaStream);
        for (let s of mediaStream._tracks) {
          if (s.kind === 'video') {
            setStreams(streams => [
              ...streams,
              {stream: mediaStream.toURL(), user: user.username},
            ]);
            streamURLs.current.push({
              stream: mediaStream.toURL(),
              user: user.username,
            });
          }
        }
        //console.log(mediaStream.toURL());
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGcParticipantJoined = users => {
    setGroupCallParticipants(users);
  };

  const createPeerConnection = async (roomName, userThatsReady, readyUser) => {
    console.log('createPeerConnection (host)');
    let peerConnection = new RTCPeerConnection(peerConstraints);
    peerConnection.addEventListener('connectionstatechange', event => {
      console.log(
        'connectionstatechange',
        event,
        peerConnection.connectionState,
        'to',
        userThatsReady,
        `(${user.username})`,
      );
      switch (peerConnection.connectionState) {
        case 'new':
          break;
        case 'connecting':
          break;
        case 'connected':
          break;
        case 'disconnected':
          break;
        case 'failed':
          for (let p of peersRef.current) {
            if (p.user === userThatsReady) {
              console.log('failed', user.username);
            }
          }
          break;
        case 'closed':
          // You can handle the call being disconnected here.
          console.log('call closed', user.username);
          break;
      }
    });
    peerConnection.addEventListener('icecandidate', event => {
      // console.log('icecandidate', event);
      // When you find a null candidate then there are no more candidates.
      // Gathering of candidates has finished.
      if (!event.candidate) {
        return;
      }
      // Send the event.candidate onto the person you're calling.
      // Keeping to Trickle ICE Standards, you should send the candidates immediately.
      //console.log(readyUser, userThatsReady, `(${user.username})`);
      socket.emit(
        'ice-candidate group call',
        event.candidate,
        roomName,
        user.username,
        readyUser,
      );
    });
    peerConnection.addEventListener('icecandidateerror', event => {
      console.log('icecandidateerror', event);
      // You can ignore some candidate errors.
      // Connections can still be made even when errors occur.
    });
    peerConnection.addEventListener('iceconnectionstatechange', event => {
      if (peerConnection?.iceConnectionState) {
        console.log(
          'iceconnectionstatechange',
          event,
          peerConnection.iceConnectionState,
          user.username,
        );
        switch (peerConnection.iceConnectionState) {
          case 'new':
            break;
          case 'checking':
            break;
          case 'connected':
            break;
          case 'completed':
            // You can handle the call being connected here.
            // Like setting the video streams to visible.
            break;
          case 'disconnected':
            break;
          case 'failed':
            break;
          case 'closed':
            // You can handle the call being disconnected here.
            console.log('call closed', user.username);
            break;
        }
      }
    });
    peerConnection.addEventListener('icegatheringstatechange', event => {
      console.log(
        'icegatheringstatechange',
        event,
        peerConnection.iceGatheringState,
        user.username,
      );
      switch (peerConnection.iceGatheringState) {
        case 'new':
          break;
        case 'gathering':
          break;
        case 'complete':
          break;
      }
    });
    peerConnection.addEventListener('negotiationneeded', event => {
      console.log('negotiationneeded', event, user.username);
      // You can start the offer stages here.
      // Be careful as this event can be called multiple times.
    });
    peerConnection.addEventListener('signalingstatechange', event => {
      console.log(
        'signalingstatechange',
        event,
        peerConnection.signalingState,
        'from',
        userThatsReady,
        `(${user.username})`,
      );
      switch (peerConnection.signalingState) {
        case 'stable':
          break;
        case 'have-local-pranswer':
          break;
        case 'have-remote-pranswer':
          break;
        case 'have-local-offer':
          //
          break;
        case 'have-remote-offer':
          break;
        case 'closed':
          // You can handle the call being disconnected here.

          break;
      }
    });
    peerConnection.addEventListener('track', event => {
      console.log('handle track event (host)', `(${user.username})`);
      try {
        for (let s of event.streams[0]._tracks) {
          if (s.kind === 'video') {
            setStreams(streams => [
              ...streams,
              {stream: event.streams[0].toURL(), user: userThatsReady},
            ]);
            streamURLs.current.push({
              stream: event.streams[0].toURL(),
              user: userThatsReady,
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
    peerConnection.addEventListener('removetrack', event => {
      console.log('removestream', event);
    });
    try {
      // userStreamRef.current.getTracks().forEach(track => {
      //   if (Object.keys(track._constraints).length !== 0) {
      //     peerConnection.addTrack(track, userStreamRef.current);
      //   }
      // });
      if (userStreamRef.current === null) {
        peerConnection.close();
      } else {
        userStreamRef.current.getTracks().forEach(track => {
          //if (Object.keys(track._constraints).length !== 0) {
          peerConnection.addTrack(track, userStreamRef.current);
          //}
        });
      }
    } catch (err) {
      console.log(err);
    }
    return peerConnection;
  };

  const initiateOffer = async (roomName, userThatsReady, caller, readyUser) => {
    try {
      //socket.emit('ready group call', roomName, user.username, caller);
      setPicked(true);
      console.log(
        'initiateOffer for',
        userThatsReady,
        `(${user.username}) (host)`,
      );
      RoomName.current = roomName;
      let peerConnection = await createPeerConnection(
        roomName,
        userThatsReady,
        readyUser,
      );
      if (userStreamRef.current) {
        peerConnection
          .createOffer(sessionConstraints)
          .then(offer => {
            peerConnection
              .setLocalDescription(offer)
              .then(() => {
                console.log('LD set for', userThatsReady, `(${user.username})`);
                //send offer from
                socket.emit(
                  'offer group call',
                  offer,
                  roomName,
                  user.username,
                  caller,
                  readyUser,
                  user,
                );
              })
              .catch(error => {
                console.log(error, 'setLocalDescription');
              });
          })
          .catch(error => {
            console.log(error, 'initiate offer');
          });
        setPeerConnections(connections => [
          ...connections,
          {pc: peerConnection, user: userThatsReady},
        ]);
        peersRef.current.push({pc: peerConnection, user: userThatsReady});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReceivedGroupCallOffer = async (
    offer,
    roomName,
    FromUser,
    caller,
    offerTo,
  ) => {
    try {
      console.log(
        `Executing handleReceivedGroupCallOffer for ${FromUser}`,
        `(${user.username}) (host)`,
      );
      // for (let p of peersRef.current) {
      //   if (p.user === FromUser) {
      //     const index = peersRef.current.findIndex(p => p.user === FromUser)
      //     peersRef.current.splice(index,1);
      //   }
      // }
      let present_already = false;
      for (let p of peersRef.current) {
        if (p.user === FromUser) {
          present_already = true;
        }
      }
      if (present_already === false) {
        console.log(
          `handleReceivedGroupCallOffer for ${FromUser}`,
          `(${user.username}) (host)`,
        );
        RoomName.current = roomName;
        let peerConnection = await createPeerConnection(
          roomName,
          FromUser,
          offerTo,
        );
        const offerDescription = new RTCSessionDescription(offer);
        peerConnection
          .setRemoteDescription(offerDescription)
          .then(() => {
            peerConnection
              .createAnswer(sessionConstraints)
              .then(answer => {
                peerConnection
                  .setLocalDescription(answer)
                  .then(() => {
                    console.log(
                      'LD set inside handle Received offer',
                      FromUser,
                      `(${user.username})`,
                    );
                    //console.log(peerConnection._pcId, currentUser.username);
                    socket.emit(
                      'answer group call',
                      answer,
                      roomName,
                      user.username,
                      caller,
                      offerTo,
                    );
                  })
                  .catch(e => {
                    console.log(e, 'setLocalDescription');
                  });
              })
              .catch(error => {
                console.log(error, 'create answer');
              });
          })
          .catch(error => {
            console.log(error, 'setRemoteDescription rco');
          });
        setPeerConnections(connections => [
          ...connections,
          {pc: peerConnection, user: FromUser},
        ]);
        peersRef.current.push({pc: peerConnection, user: FromUser});
      }
      // else {
      //   const pc = peersRef.current.find(p => p.user === FromUser);
      //   console.log(
      //     pc,
      //     'pc',
      //     'handleReceivedOffer from',
      //     FromUser,
      //     user.username,
      //   );
      //   const offerDescription = new RTCSessionDescription(offer);
      //   //if(pc.pc.remoteDescription === null)
      //   pc.pc
      //     .setRemoteDescription(offerDescription)
      //     .then(() => {
      //       pc.pc
      //         .createAnswer(sessionConstraints)
      //         .then(answer => {
      //           pc.pc
      //             .setLocalDescription(answer)
      //             .then(() => {
      //               //console.log(peerConnection._pcId, currentUser.username);
      //               socket.emit(
      //                 'answer group call',
      //                 answer,
      //                 roomName,
      //                 user.username,
      //                 caller,
      //               );
      //             })
      //             .catch(e => {
      //               console.log(
      //                 e,
      //                 `setLocalDescription from ${FromUser}, (${user.username})`,
      //               );
      //             });
      //         })
      //         .catch(error => {
      //           console.log(error, 'create answer');
      //         });
      //     })
      //     .catch(error => {
      //       console.log(error, 'setRemoteDescription rco');
      //     });
      // }
    } catch (error) {
      console.log(error);
    }
  };

  // host getting the answer from other user
  const handleAnswer = (answer, roomName, fromUser, caller) => {
    try {
      console.log(`handleAnswer for ${fromUser} (${user.username}) (host)`);
      const answerDescription = new RTCSessionDescription(answer);
      for (let p of peersRef.current) {
        if (p.user === fromUser) {
          //console.log('inside handle answer if', p.pc);
          p.pc
            .setRemoteDescription(answerDescription)
            .then(() => {
              console.log(peersRef.current, user.username);
              //console.log(peerConnections);
            })
            .catch(err =>
              console.log(err, 'handle answer', fromUser, `(${user.username})`),
            );
        }
      }
      // peerConnection
      //   .setRemoteDescription(answerDescription)
      //   .then(() => {
      //     // console.log(peerConnection._pcId, user.username);
      //     // console.log(peerConnection._remoteStreams, 'remote');
      //   })
      //   .catch(err => console.log(err, 'handle answer'));
    } catch (error) {
      console.log(error);
    }
  };

  const handlerNewIceCandidateMsg = (incoming, roomName, fromUser) => {
    // console.log(
    //   `handlerNewIceCandidateMsg for ${fromUser}`,
    //   `(${user.username})`,
    // );
    // We cast the incoming candidate to RTCIceCandidate
    try {
      const candidate = new RTCIceCandidate(incoming);
      //console.log(peersRef.current, user.username);
      for (let p of peersRef.current) {
        //console.log(p, 'from', fromUser, 'in', user.username);
        if (p.user === fromUser) {
          p.pc
            .addIceCandidate(candidate)
            .then(() => {
              //console.log('candidate added', user.username);
            })
            .catch(e => {
              console.log(
                e,
                'error add ice-candidate',
                fromUser,
                `(${user.username})`,
              );
            });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleTrackEvent = (event, userThatsReady) => {
    console.log('handle track event (host)', `(${user.username})`);
    try {
      // setRemoteStream(event.streams[0]);
      // setRemoteMediaStream(event.streams[0].toURL());
      setStreams(streams => [
        ...streams,
        {stream: event.streams[0].toURL(), user: userThatsReady},
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const leaveCall = () => {
    console.log('leaveRoom');
    socket.emit('leave group call', RoomName.current, user);
    for (let p of peersRef.current) {
      p.pc.close();
    }
    setPicked(false);
    peersRef.current = [];
    setPeerConnections([]);
    setStreams([]);
    streamURLs.current = [];
    hostRef.current = false;
    userStreamRef.current = null;
    navigation.goBack();
  };

  const onPeerLeave = user => {
    try {
      console.log('left room', user.username);
      //hostRef.current = true;
      if (peersRef.current.length === 1) {
        userStreamRef.current = null;
        RoomName.current = null;
        for (let p of peersRef.current) {
          p.pc.close();
        }
        setPicked(false);
        peersRef.current = [];
        setPeerConnections([]);
        setStreams([]);
        streamURLs.current = [];
        navigation.goBack();
      } else {
        for (let p of peersRef.current) {
          if (p.user === user.username) {
            p.pc.close();
            const index = peersRef.current.findIndex(
              p => p.user === user.username,
            );
            if (index !== -1) {
              peersRef.current.splice(index, 1);
            }
          }
        }
        for (let s of streamURLs.current) {
          if (s.user === user.username) {
            const index = streamURLs.current.findIndex(
              a => a.user === user.username,
            );
            if (index !== -1) {
              streamURLs.current.splice(index, 1);
              console.log(streamURLs.current);
            }
          }
        }
        setStreams(streamURLs.current);
      }
      // for (let s of streams) {
      //   if (s.user === user.username) {
      //     const arr = [...streams];
      //     const index = arr.findIndex(a => a.user === user.username);
      //     if (index !== -1) {
      //       arr.splice(index, 1);
      //       setStreams(arr);
      //       console.log(streams);
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMediaStream = (type, state) => {
    userStreamRef.current.getTracks().forEach(track => {
      if (track.kind === type) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = !state;
      }
    });
  };

  const toggleMic = () => {
    toggleMediaStream('audio', micActive);
    setMicActive(prev => !prev);
    //find in stream and update?
  };

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive);
    setCameraActive(prev => !prev);
  };

  const terminateCall = () => {
    setStreams([]);
    streamURLs.current = [];
    hostRef.current = false;
    userStreamRef.current = null;
    socket.emit('terminate group call', participants);
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.BLACK,
        marginTop: StatusBar.currentHeight,
      }}>
      <View style={{position: 'absolute'}}>
        <FlatList
          data={streams}
          keyExtractor={item => item}
          numColumns={2}
          renderItem={({item}) => (
            <RTCView
              style={{
                height: Dimensions.get('screen').height / 2.2,
                width: 200,
              }}
              mirror={true}
              objectFit={'cover'}
              streamURL={item.stream}
              zOrder={0}
            />
          )}
        />
      </View>
      {/* <View style={common.headerStyle}>
        <Header
          iconColor={colors.WHITE}
          right={
            <TouchableOpacity>
              <AddUser />
            </TouchableOpacity>
          }
        />
      </View> */}
      {picked ? (
        <View style={styles.footer}>
          {/* <TouchableOpacity style={styles.iconContainer}>
            <Speaker />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={toggleCamera}
            style={[styles.iconContainer, {marginLeft: 20}]}>
            {cameraActive ? (
              <Video />
            ) : (
              <FontAwesome5 name="video-slash" size={20} color={colors.WHITE} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleMic}
            style={[styles.iconContainer, {marginHorizontal: 20}]}>
            {micActive ? (
              <Mic />
            ) : (
              <Ionicons name="mic-off" color={colors.WHITE} size={28} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={leaveCall}
            style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
            <MissedCall />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={toggleCamera}
            style={[styles.iconContainer, {marginLeft: 20}]}>
            {cameraActive ? (
              <Video />
            ) : (
              <FontAwesome5 name="video-slash" size={20} color={colors.WHITE} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleMic}
            style={[styles.iconContainer, {marginHorizontal: 20}]}>
            {micActive ? (
              <Mic />
            ) : (
              <Ionicons name="mic-off" color={colors.WHITE} size={28} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={terminateCall}
            style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
            <MissedCall />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GroupVideoCall;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  image: {
    height: Dimensions.get('screen').height / 3.2,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparent,
  },
  footer: {
    bottom: 30,
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
