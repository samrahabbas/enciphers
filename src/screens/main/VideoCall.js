import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import colors from '../../constants/colors';
import Header from '../../components/Header';
import {common} from '../../styles/styles';
import {
  AddUser,
  Mic,
  MissedCall,
  Speaker,
  Video,
} from '../../assets/icons/icons';
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
import {useSelector} from 'react-redux';
import moment from 'moment';
import InCallManager from 'react-native-incall-manager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const VideoCall = ({route, navigation}) => {
  const {item} = route.params;
  const [picked, setPicked] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  // const userVideoRef = useRef();
  // const peerVideoRef = useRef();
  // const rtcConnectionRef = useRef(null);
  const userStreamRef = useRef();
  const hostRef = useRef(false);
  const roomName = genRandomString(12);
  const user = useSelector(state => state.auth.user);
  //const socket = useSelector(state => state.socket.socket);
  let peerConnection;
  const pcRef = useRef(null);
  const RoomName = useRef(null);

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
      width: {
        min: Dimensions.get('screen').width,
        max: Dimensions.get('screen').width,
      },
      height: {
        min: Dimensions.get('screen').height,
        max: Dimensions.get('screen').height,
      },
      // mandatory: {
      //   minWidth: Dimensions.get('screen').width, // Provide your own width, height and frame rate here
      //   minHeight: Dimensions.get('screen').height,
      //   minFrameRate: 30,
      // },
      facingMode: isFront ? 'user' : 'environment',
    },
  };

  const handleRoomCreated = () => {
    console.log('handleRoomCreated (host)');
    InCallManager.start({media: 'video', auto: true, ringback: ''});
    //InCallManager.startRingback('DEFAULT');
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
        // peerConnection is not imported
        // mediaStream.getTracks().forEach(track => {
        //   peerConnection.addTrack(track, mediaStream);
        // });
        //console.log(mediaStream);
        for (let s of mediaStream._tracks) {
          if (s.kind === 'video') {
            setLocalStream(mediaStream);
            setLocalMediaStream(localMediaStream.toURL());
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  //other user emitting ready to host
  const handleRoomJoined = roomName => {
    console.log('handleRoomJoined');
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
        // mediaStream.getTracks().forEach(track => {
        //   peerConnection.addTrack(track, mediaStream);
        // });
        setLocalStream(localMediaStream);
        setLocalMediaStream(localMediaStream.toURL());
        // socket.emit('join video call', roomName, user);
        socket.emit('ready', roomName);
      });
    } catch (err) {
      console.log(err);
    }
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

  const createPeerConnection = async roomName => {
    try {
      console.log('createPeerConnection (host)');
      peerConnection = new RTCPeerConnection(peerConstraints);
      peerConnection.addEventListener('connectionstatechange', event => {
        console.log(
          'connectionstatechange',
          event,
          peerConnection.connectionState,
        );
        switch (peerConnection.connectionState) {
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
        socket.emit('ice-candidate', event.candidate, roomName);
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
            case 'connected':
              break;
            case 'completed':
              // You can handle the call being connected here.
              // Like setting the video streams to visible.

              break;
          }
        }
      });
      peerConnection.addEventListener('icegatheringstatechange', event => {
        console.log(
          'icegatheringstatechange',
          event,
          peerConnection.iceGatheringState,
        );
      });
      peerConnection.addEventListener('negotiationneeded', event => {
        console.log('negotiationneeded', event);
        // You can start the offer stages here.
        // Be careful as this event can be called multiple times.
      });
      peerConnection.addEventListener('signalingstatechange', event => {
        console.log(
          'signalingstatechange',
          event,
          peerConnection.signalingState,
        );
        switch (peerConnection.signalingState) {
          case 'closed':
            // You can handle the call being disconnected here.

            break;
        }
      });
      peerConnection.addEventListener('track', handleTrackEvent);
      peerConnection.addEventListener('removetrack', event => {
        console.log('removestream', event);
      });
      try {
        userStreamRef.current.getTracks().forEach(track => {
          //if (Object.keys(track._constraints).length !== 0) {
          //console.log(track, '(host)');
          peerConnection.addTrack(track, userStreamRef.current);
          //}
        });
      } catch (err) {
        console.log(err);
      }
      return peerConnection;
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   //peerConnection.addEventListener('icecandidate', handleICECandidateEvent);
  //   if (peerConnection) {
  //     peerConnection.addEventListener('track', handleTrackEvent);
  //     peerConnection.addEventListener('connectionstatechange', event => {
  //       console.log('connectionstatechange', event);
  //       switch (peerConnection.connectionState) {
  //         case 'closed':
  //           // You can handle the call being disconnected here.
  //           break;
  //       }
  //     });
  //     peerConnection.addEventListener('icecandidate', event => {
  //       // console.log('icecandidate', event);
  //       // When you find a null candidate then there are no more candidates.
  //       // Gathering of candidates has finished.
  //       if (!event.candidate) {
  //         return;
  //       }

  //       // Send the event.candidate onto the person you're calling.
  //       // Keeping to Trickle ICE Standards, you should send the candidates immediately.
  //       socket.emit('ice-candidate', event.candidate, roomName);
  //     });
  //     peerConnection.addEventListener('icecandidateerror', event => {
  //       console.log('icecandidateerror', event);
  //       // You can ignore some candidate errors.
  //       // Connections can still be made even when errors occur.
  //     });
  //     peerConnection.addEventListener('iceconnectionstatechange', event => {
  //       console.log('iceconnectionstatechange', event);
  //       switch (peerConnection.iceConnectionState) {
  //         case 'connected':
  //         case 'completed':
  //           // You can handle the call being connected here.
  //           // Like setting the video streams to visible.

  //           break;
  //       }
  //     });
  //     peerConnection.addEventListener('icegatheringstatechange', event => {
  //       console.log('icegatheringstatechange', event);
  //     });
  //     peerConnection.addEventListener('negotiationneeded', event => {
  //       console.log('negotiationneeded', event);
  //       // You can start the offer stages here.
  //       // Be careful as this event can be called multiple times.
  //     });
  //     peerConnection.addEventListener('signalingstatechange', event => {
  //       console.log('signalingstatechange', event);
  //       switch (peerConnection.signalingState) {
  //         case 'closed':
  //           // You can handle the call being disconnected here.

  //           break;
  //       }
  //     });
  //     peerConnection.addEventListener('addstream', event => {
  //       console.log('addstream', event);
  //       // Grab the remote stream from the connected participant.
  //       // setRemoteStream(event.stream);
  //     });
  //     peerConnection.addEventListener('removestream', event => {
  //       console.log('removestream', event);
  //     });
  //   }
  // }, [peerConnection]);

  // host
  const initiateCall = async roomName => {
    InCallManager.stopRingback();
    setPicked(true);
    //InCallManager.start({media: 'video', auto: true});
    if (!peerConnection) {
      if (hostRef.current) {
        console.log('initiateCall (host)');
        RoomName.current = roomName;
        peerConnection = await createPeerConnection(roomName);
        pcRef.current = peerConnection;
        peerConnection
          .createOffer(sessionConstraints)
          .then(offer => {
            peerConnection
              .setLocalDescription(offer)
              .then(() => {
                socket.emit('offer', offer, roomName);
              })
              .catch(error => {
                console.log(error, 'setLocalDescription');
              });
          })
          .catch(error => {
            console.log(error, 'initiate call');
          });
      }
    }
  };

  // not host
  const handleReceivedOffer = offer => {
    if (!hostRef.current) {
      console.log('handleReceivedOffer', user.username);
      peerConnection = createPeerConnection();
      //rtcConnectionRef.current = createPeerConnection();
      // rtcConnectionRef.current.addTrack(
      //   userStreamRef.current.getTracks()[0],
      //   userStreamRef.current,
      // );
      // rtcConnectionRef.current.addTrack(
      //   userStreamRef.current.getTracks()[1],
      //   userStreamRef.current,
      // );
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
                  socket.emit('answer', answer, roomName);
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
    }
  };

  // host getting the answer from other user
  const handleAnswer = (answer, roomName) => {
    if (hostRef.current) {
      console.log('handleAnswer (host)', moment(new Date()).format('hh:mm:ss'));
      const answerDescription = new RTCSessionDescription(answer);
      peerConnection
        .setRemoteDescription(answerDescription)
        .then(() => {
          // console.log(peerConnection._pcId, user.username);
          // console.log(peerConnection._remoteStreams, 'remote');
        })
        .catch(err => console.log(err, 'handle answer'));
    }
  };

  const handleICECandidateEvent = event => {
    console.log('handleICECandidateEvent', user.username);
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate, roomName);
    }
  };

  const handlerNewIceCandidateMsg = incoming => {
    console.log('handlerNewIceCandidateMsg', user.username);
    // We cast the incoming candidate to RTCIceCandidate
    try {
      const candidate = new RTCIceCandidate(incoming);
      peerConnection.addIceCandidate(candidate).catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  const handleTrackEvent = event => {
    console.log('handle track event (host)');
    try {
      for (let s of event.streams[0]._tracks) {
        if (s.kind === 'video') {
          setRemoteStream(event.streams[0]);
          setRemoteMediaStream(event.streams[0].toURL());
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //roomName should be a new one every time the user tries to call someone
  const leaveRoom = () => {
    console.log('leaveRoom');
    //InCallManager.stopRingback();
    socket.emit('end call', RoomName.current); // Let's the server know that user has left the room.
    if (pcRef.current) {
      pcRef.current.close();
    }
    setPicked(false);
    RoomName.current = null;
    peerConnection = null;
    setRemoteMediaStream(null);
    setRemoteStream(null);
    setLocalStream(null);
    setLocalMediaStream(null);
    userStreamRef.current = null;
    InCallManager.stop();
    navigation.goBack();
  };

  const onPeerLeave = () => {
    console.log('onPeerLeave');
    //InCallManager.stopRingback();
    if (pcRef.current) {
      pcRef.current.close();
    }
    setPicked(false);
    RoomName.current = null;
    hostRef.current = true;
    peerConnection = null;
    setRemoteMediaStream(null);
    setRemoteStream(null);
    setLocalStream(null);
    setLocalMediaStream(null);
    userStreamRef.current = null;
    InCallManager.stop();
    navigation.goBack();
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
  };

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive);
    setCameraActive(prev => !prev);
  };

  const terminateCall = () => {
    InCallManager.stop();
    hostRef.current = false;
    userStreamRef.current = null;
    socket.emit('terminate call', item);
    navigation.goBack();
  };

  const callRejected = () => {
    InCallManager.stop();
    hostRef.current = false;
    userStreamRef.current = null;
    navigation.goBack();
  };

  // useEffect(() => {
  //   let localMediaStream;
  //   let isVoiceOnly = false;
  //   try {
  //     mediaDevices.getUserMedia(mediaConstraints).then(mediaStream => {
  //       if (isVoiceOnly) {
  //         let videoTrack = mediaStream.getVideoTracks()[0];
  //         videoTrack.enabled = false;
  //       }
  //       localMediaStream = mediaStream;
  //       mediaStream.getTracks().forEach(track => {
  //         peerConnection.addTrack(track, mediaStream);
  //       });
  //       setLocalStream(localMediaStream);
  //       setLocalMediaStream(localMediaStream.toURL());
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  // let remoteCandidates = [];

  // function handleRemoteCandidate(iceCandidate) {
  //   iceCandidate = new RTCIceCandidate(iceCandidate);

  //   if (peerConnection.remoteDescription == null) {
  //     return remoteCandidates.push(iceCandidate);
  //   }

  //   return peerConnection.addIceCandidate(iceCandidate);
  // }

  // function processCandidates() {
  //   if (remoteCandidates.length < 1) {
  //     return;
  //   }

  //   remoteCandidates.map(candidate =>
  //     peerConnection.addIceCandidate(candidate),
  //   );
  //   remoteCandidates = [];
  // }

  useEffect(() => {
    socket.emit('join video call', roomName, user, item);
    socket.off('created').on('created', handleRoomCreated);
    // If the room didn't exist, the server would emit the room was 'created'

    // Whenever the next person joins, the server emits 'ready'
    socket.off('ready').on('ready', initiateCall); // host

    socket.on('ice-candidate', handlerNewIceCandidateMsg);

    socket.off('answer').on('answer', handleAnswer); // host receiving the answer back from the offer given to other user
    // Emitted when a peer leaves the room
    // socket.off('rejected').on('rejected', onPeerLeave);

    socket.off('end call').on('end call', onPeerLeave);

    socket.off('rejected').on('rejected', callRejected);

    // If the room is full, we show an alert
    socket.on('full', () => {
      console.log('on another call');
    });

    // return () => {
    //   peerConnection = null;
    //   setRemoteMediaStream(null);
    //   setRemoteStream(null);
    //   setLocalStream(null);
    //   setLocalMediaStream(null);
    //   userStreamRef.current = null;
    //   socket.emit('end call', roomName);
    // };
  }, []);

  // useEffect(() => {
  //   socket.on('incoming call', incomingCall);
  //   socket.on('joined', handleRoomJoined);
  //   // Events that are webRTC specific
  //   socket.on('offer', handleReceivedOffer); //other user

  //   socket.on('ice-candidate', handlerNewIceCandidateMsg);
  // });

  // useEffect(() => {
  //   socket.emit('join video call', roomName, user);
  //   socket.on('answer', (answer, roomName) => {
  //     if (roomName === roomName) {
  //       handleRemoteDescription(answer);
  //     }
  //   });
  //   // peerConnection.addEventListener('connectionstatechange', event => {
  //   //   console.log('connectionstatechange', event);
  //   //   switch (peerConnection.connectionState) {
  //   //     case 'closed':
  //   //       // You can handle the call being disconnected here.

  //   //       break;
  //   //   }
  //   // });
  //   // peerConnection.addEventListener('icecandidate', event => {
  //   //   // console.log('icecandidate', event);
  //   //   // When you find a null candidate then there are no more candidates.
  //   //   // Gathering of candidates has finished.
  //   //   if (!event.candidate) {
  //   //     return;
  //   //   }

  //   //   // Send the event.candidate onto the person you're calling.
  //   //   // Keeping to Trickle ICE Standards, you should send the candidates immediately.
  //   //   socket.emit('ice-candidate', event.candidate, roomName);
  //   // });
  //   // peerConnection.addEventListener('icecandidateerror', event => {
  //   //   console.log('icecandidateerror', event);
  //   //   // You can ignore some candidate errors.
  //   //   // Connections can still be made even when errors occur.
  //   // });
  //   // peerConnection.addEventListener('iceconnectionstatechange', event => {
  //   //   console.log('iceconnectionstatechange', event);
  //   //   switch (peerConnection.iceConnectionState) {
  //   //     case 'connected':
  //   //     case 'completed':
  //   //       // You can handle the call being connected here.
  //   //       // Like setting the video streams to visible.

  //   //       break;
  //   //   }
  //   // });
  //   // peerConnection.addEventListener('icegatheringstatechange', event => {
  //   //   console.log('icegatheringstatechange', event);
  //   // });
  //   // peerConnection.addEventListener('negotiationneeded', event => {
  //   //   console.log('negotiationneeded', event);
  //   //   // You can start the offer stages here.
  //   //   // Be careful as this event can be called multiple times.
  //   //   createOffer();
  //   // });
  //   // peerConnection.addEventListener('signalingstatechange', event => {
  //   //   console.log('signalingstatechange', event);
  //   //   switch (peerConnection.signalingState) {
  //   //     case 'closed':
  //   //       // You can handle the call being disconnected here.

  //   //       break;
  //   //   }
  //   // });
  //   // peerConnection.addEventListener('addstream', event => {
  //   //   console.log('addstream', event);
  //   //   // Grab the remote stream from the connected participant.
  //   //   setRemoteStream(event.stream);
  //   // });
  //   // peerConnection.addEventListener('removestream', event => {
  //   //   console.log('removestream', event);
  //   // });

  //   //peerConnection._remoteStreams.forEach(s => console.log(s));
  //   return () => socket.emit('end call', roomName);
  // }, []);

  // const getNumberOfCameras = async () => {
  //   let cameraCount = 0;
  //   try {
  //     const devices = await mediaDevices.enumerateDevices();
  //     devices.map(device => {
  //       if (device.kind != 'videoinput') {
  //         return;
  //       }
  //       cameraCount = cameraCount + 1;
  //     });
  //   } catch (err) {
  //     // Handle Error
  //   }
  // };

  // const getMediaStream = async () => {
  //   let localMediaStream;
  //   let isVoiceOnly = false;
  //   try {
  //     const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
  //     if (isVoiceOnly) {
  //       let videoTrack = await mediaStream.getVideoTracks()[0];
  //       videoTrack.enabled = false;
  //     }
  //     localMediaStream = mediaStream;
  //     setLocalMediaStream(localMediaStream);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   //getMediaStreamUsingDisplay
  //   // try {
  //   //   const mediaStream = await mediaDevices.getDisplayMedia();
  //   //   localMediaStream = mediaStream;
  //   // } catch (err) {
  //   //   // Handle Error
  //   // }
  // };

  // const destroyingMediaStream = async localMediaStream => {
  //   localMediaStream.getTracks().map(track => track.stop());
  //   localMediaStream = null;
  // };

  // const destroyPeerConnection = () => {
  //   peerConnection._unregisterEvents();
  //   peerConnection.close();
  //   peerConnection = null;
  // };

  // const createAnswer = async offer => {
  //   try {
  //     // Use the received offerDescription
  //     const offerDescription = new RTCSessionDescription(offer);
  //     await peerConnection.setRemoteDescription(offerDescription);

  //     const answerDescription = await peerConnection.createAnswer(
  //       sessionConstraints,
  //     );
  //     await peerConnection.setLocalDescription(answerDescription);

  //     // Here is a good place to process candidates.
  //     processCandidates();

  //     // Send the answerDescription back as a response to the offerDescription.
  //     socket.emit('answer', answerDescription, roomName);
  //   } catch (err) {
  //     // Handle Errors
  //     console.log(err, 'answer');
  //   }
  // };

  // const createOffer = async () => {
  //   try {
  //     const offerDescription = await peerConnection.createOffer(
  //       sessionConstraints,
  //     );
  //     await peerConnection.setLocalDescription(offerDescription);

  //     // Send the offerDescription to the other participant.
  //     socket.emit('offer', offerDescription, roomName);
  //   } catch (err) {
  //     // Handle Errors
  //     console.log(err, 'offer');
  //   }
  // };

  // const handleRemoteDescription = async answer => {
  //   try {
  //     // Use the received answerDescription
  //     const answerDescription = new RTCSessionDescription(answer);
  //     await peerConnection.setRemoteDescription(answerDescription);
  //     setRemoteStream(answerDescription);
  //   } catch (err) {
  //     // Handle Error
  //     console.log(err, 'remote description');
  //   }
  // };

  // useEffect(() => {
  //   // First we join a room
  //   socket.emit('join video call', roomName);

  //   socket.on('joined', handleRoomJoined);
  //   // If the room didn't exist, the server would emit the room was 'created'
  //   // socket.on('created', handleRoomCreated);
  //   // Whenever the next person joins, the server emits 'ready'
  //   socket.on('ready', initiateCall);

  //   // Emitted when a peer leaves the room
  //   socket.on('end call', onPeerLeave);

  //   // If the room is full, we show an alert
  //   // socketRef.current.on('full', () => {
  //   //   window.location.href = '/';
  //   // });

  //   // Event called when a remote user initiating the connection and
  //   socket.on('offer', handleReceivedOffer);
  //   socket.on('answer', handleAnswer);
  //   socket.on('ice-candidate', handlerNewIceCandidateMsg);

  //   // clear up after
  //   // return () => socket.disconnect();
  // }, [roomName]);

  // const handleRoomJoined = () => {
  //   mediaDevices
  //     .getUserMedia({
  //       audio: true,
  //       video: {width: 500, height: 500},
  //     })
  //     .then(stream => {
  //       /* use the stream */
  //       userStreamRef.current = stream;
  //       userVideoRef.current.srcObject = stream;
  //       userVideoRef.current.onloadedmetadata = () => {
  //         userVideoRef.current.play();
  //       };
  //       socket.emit('ready', roomName);
  //     })
  //     .catch(err => {
  //       /* handle the error */
  //       console.log('error', err);
  //     });
  // };

  // const initiateCall = () => {
  //   if (hostRef.current) {
  //     rtcConnectionRef.current = createPeerConnection();
  //     rtcConnectionRef.current.addTrack(
  //       userStreamRef.current.getTracks()[0],
  //       userStreamRef.current,
  //     );
  //     rtcConnectionRef.current.addTrack(
  //       userStreamRef.current.getTracks()[1],
  //       userStreamRef.current,
  //     );
  //     rtcConnectionRef.current
  //       .createOffer()
  //       .then(offer => {
  //         rtcConnectionRef.current.setLocalDescription(offer);
  //         socket.emit('offer', offer, roomName);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }
  // };

  // const onPeerLeave = () => {
  //   // This person is now the creator because they are the only person in the room.
  //   hostRef.current = true;
  //   if (peerVideoRef.current.srcObject) {
  //     peerVideoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stops receiving all track of Peer.
  //   }

  //   // Safely closes the existing connection established with the peer who left.
  //   if (rtcConnectionRef.current) {
  //     rtcConnectionRef.current.ontrack = null;
  //     rtcConnectionRef.current.onicecandidate = null;
  //     rtcConnectionRef.current.close();
  //     rtcConnectionRef.current = null;
  //   }
  // };

  // const createPeerConnection = () => {
  //   // We create a RTC Peer Connection
  //   const connection = new RTCPeerConnection(ICE_SERVERS);

  //   // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
  //   connection.onicecandidate = handleICECandidateEvent;

  //   // We implement our onTrack method for when we receive tracks
  //   connection.ontrack = handleTrackEvent;
  //   return connection;
  // };

  // const handleReceivedOffer = offer => {
  //   if (!hostRef.current) {
  //     rtcConnectionRef.current = createPeerConnection();
  //     rtcConnectionRef.current.addTrack(
  //       userStreamRef.current.getTracks()[0],
  //       userStreamRef.current,
  //     );
  //     rtcConnectionRef.current.addTrack(
  //       userStreamRef.current.getTracks()[1],
  //       userStreamRef.current,
  //     );
  //     rtcConnectionRef.current.setRemoteDescription(offer);

  //     rtcConnectionRef.current
  //       .createAnswer()
  //       .then(answer => {
  //         rtcConnectionRef.current.setLocalDescription(answer);
  //         socket.emit('answer', answer, roomName);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }
  // };

  // const handleAnswer = answer => {
  //   rtcConnectionRef.current
  //     .setRemoteDescription(answer)
  //     .catch(err => console.log(err));
  // };

  // const handleICECandidateEvent = event => {
  //   if (event.candidate) {
  //     socket.emit('ice-candidate', event.candidate, roomName);
  //   }
  // };

  // const handlerNewIceCandidateMsg = incoming => {
  //   // We cast the incoming candidate to RTCIceCandidate
  //   const candidate = new RTCIceCandidate(incoming);
  //   rtcConnectionRef.current
  //     .addIceCandidate(candidate)
  //     .catch(e => console.log(e));
  // };

  // const handleTrackEvent = event => {
  //   // eslint-disable-next-line prefer-destructuring
  //   peerVideoRef.current.srcObject = event.streams[0];
  // };

  // const toggleMediaStream = (type, state) => {
  //   userStreamRef.current.getTracks().forEach(track => {
  //     if (track.kind === type) {
  //       // eslint-disable-next-line no-param-reassign
  //       track.enabled = !state;
  //     }
  //   });
  // };

  // const leaveRoom = () => {
  //   socket.emit('end call', roomName); // Let's the server know that user has left the room.

  //   if (userVideoRef.current.srcObject) {
  //     userVideoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stops receiving all track of User.
  //   }
  //   if (peerVideoRef.current.srcObject) {
  //     peerVideoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stops receiving audio track of Peer.
  //   }

  //   // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
  //   if (rtcConnectionRef.current) {
  //     rtcConnectionRef.current.ontrack = null;
  //     rtcConnectionRef.current.onicecandidate = null;
  //     rtcConnectionRef.current.close();
  //     rtcConnectionRef.current = null;
  //   }
  //   navigation.goBack();
  // };

  // const toggleMic = async () => {
  //   let isMuted = false;
  //   try {
  //     const audioTrack = await localMediaStream.getAudioTracks()[0];
  //     audioTrack.enabled = !audioTrack.enabled;

  //     isMuted = !isMuted;
  //   } catch (err) {
  //     // Handle Error
  //     console.log(err);
  //   }
  // };

  // const toggleCamera = async () => {
  //   let isFrontCam = true;
  //   try {
  //     // Taken from above, we don't want to flip if we don't have another camera.
  //     if (cameraCount < 2) {
  //       return;
  //     }
  //     const videoTrack = await localMediaStream.getVideoTracks()[0];
  //     videoTrack._switchCamera();
  //     isFrontCam = !isFrontCam;
  //   } catch (err) {
  //     // Handle Error
  //     console.log(err);
  //   }
  // };

  return (
    <View
      source={require('../../assets/images/avatars/GirlBackground.png')}
      style={{flex: 1}}>
      <StatusBar backgroundColor={'green'} />
      {remoteMediaStream ? (
        <RTCView
          style={styles.video}
          mirror={true}
          objectFit={'cover'}
          streamURL={remoteMediaStream}
          zOrder={0}
        />
      ) : (
        <Image
          source={require('../../assets/images/avatars/GirlBackground.png')}
          style={styles.video}
        />
      )}
      {/* <View style={common.headerStyle}>
        <Header
          iconColor={colors.WHITE}
          right={
            <TouchableOpacity>
              <AddUser />
            </TouchableOpacity>
          }
          onPressLeft={() => leaveRoom()}
        />
      </View> */}
      <View style={styles.body}>
        <RTCView
          style={{width: 150, height: 200, borderRadius: 20}}
          mirror={true}
          objectFit={'cover'}
          streamURL={localMediaStream}
          zOrder={1}
        />
        {/* <Image source={require('../../assets/images/avatars/Boy.png')} /> */}
      </View>
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
            onPress={leaveRoom}
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

export default VideoCall;

{
  /* <ImageBackground
      source={require('../../assets/images/avatars/GirlBackground.png')}
      style={{flex: 1}}>
      <View style={common.headerStyle}>
        <Header
          iconColor={colors.WHITE}
          right={
            <TouchableOpacity>
              <AddUser />
            </TouchableOpacity>
          }
        />
      </View>
      <View style={styles.body}>
        <Image source={require('../../assets/images/avatars/Boy.png')} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer}>
          <Speaker />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconContainer, {marginLeft: 20}]}>
          <Video />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, {marginHorizontal: 20}]}>
          <Mic />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
          <MissedCall />
        </TouchableOpacity>
      </View>
    </ImageBackground> */
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
  },
});
