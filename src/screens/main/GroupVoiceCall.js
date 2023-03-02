import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import colors from '../../constants/colors';
import Header from '../../components/Header';
import {common} from '../../styles/styles';
import {useSelector} from 'react-redux';
import {AddUser, Mic, MissedCall, Speaker} from '../../assets/icons/icons';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const GroupVoiceCall = ({navigation, route}) => {
  const {participants, info} = route.params;
  const [picked, setPicked] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const userStreamRef = useRef(null);
  const hostRef = useRef(false);
  const roomName = genRandomString(12);
  const RoomName = useRef(null);
  const user = useSelector(state => state.auth.user);
  const [streams, setStreams] = useState([]);
  const peersRef = useRef([]);
  const [vcParticipants, setVcParticipants] = useState([]);
  const [peerConnections, setPeerConnections] = useState([]);
  const [connection, setConnection] = useState('connecting...');
  //const socket = useSelector(state => state.socket.socket);

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
      OfferToReceiveVideo: false,
      VoiceActivityDetection: true,
    },
  };

  let mediaConstraints = {
    audio: true,
    video: false,
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

  useEffect(() => {
    //others array
    socket.emit(
      'join group voice call',
      roomName,
      user,
      participants,
      info,
      user.username,
    );
    socket
      .off('participant joined')
      .on('participant joined', handleParticipantJoined);
    socket
      .off('group voice call created')
      .on('group voice call created', handleRoomCreated);

    socket.on('ready group voice call', initiateOffer);
    socket
      .off('offer group voice call')
      .on('offer group voice call', handleReceivedGroupCallOffer);
    // // If the room didn't exist, the server would emit the room was 'created'
    // // Whenever the next person joins, the server emits 'ready'
    // //socket.off('group call ready').on('group call ready', initiateCall); // host
    socket.on('ice-candidate group call', handlerNewIceCandidateMsg);
    socket.off('answer group call').on('answer group call', handleAnswer); // host receiving the answer back from the offer given to other user
    // // Emitted when a peer leaves the room
    socket.off('end group call').on('end group call', onPeerLeave);
  }, []);

  const handleParticipantJoined = users => {
    setVcParticipants(users);
  };

  const createPeerConnection = async (roomName, userThatsReady, readyUser) => {
    try {
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
            setConnection('connected');
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
      peerConnection.addEventListener('track', handleTrackEvent);
      peerConnection.addEventListener('removetrack', event => {
        console.log('removestream', event);
      });
      //error because stream ref is null
      try {
        // console.log(userStreamRef.current);
        if (userStreamRef.current === null) {
          peerConnection.close();
        } else {
          userStreamRef.current.getTracks().forEach(track => {
            //if (Object.keys(track._constraints).length !== 0) {
            peerConnection.addTrack(track, userStreamRef.current);
            //}
          });
        }
        // if (userStreamRef.current) {
        // userStreamRef.current.getTracks().forEach(track => {
        //   //if (Object.keys(track._constraints).length !== 0) {
        //   peerConnection.addTrack(track, userStreamRef.current);
        //   //}
        // });
        //}
        // else {
        //   setTimeout(function () {
        //     if (userStreamRef.current.getTracks()) {
        //       userStreamRef.current.getTracks().forEach(track => {
        //         //if (Object.keys(track._constraints).length !== 0) {
        //         peerConnection.addTrack(track, userStreamRef.current);
        //         //}
        //       });
        //     }
        //   }, 2000);
        // }
      } catch (err) {
        console.log(err);
      }
      return peerConnection;
    } catch (error) {
      console.log(error);
    }
  };

  const initiateOffer = async (roomName, userThatsReady, caller, readyUser) => {
    try {
      //socket.emit('ready group call', roomName, user.username, caller);
      // let present_already;
      // for (let p of peersRef.current) {
      //   if (p.user === userThatsReady) {
      //     present_already = true;
      //   }
      // }
      // if (present_already !== true) {
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
                  'offer group voice call',
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
      //}
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

  const handleTrackEvent = event => {
    console.log('handle track event (host)', `(${user.username})`);
    try {
      // setRemoteStream(event.streams[0]);
      // setRemoteMediaStream(event.streams[0].toURL());
      setStreams(streams => [...streams, event.streams[0].toURL()]);
    } catch (err) {
      console.log(err);
    }
  };

  //roomName should be a new one every time the user tries to call someone
  const leaveRoom = () => {
    console.log('leaveRoom');
    socket.emit('end group call', RoomName.current, user); // Let's the server know that user has left the room.
    //or blur on unmount
    setPeerConnections([]);
    setStreams([]);
    setPicked(false);
    userStreamRef.current = null;
    setConnection('connecting...');
    setVcParticipants([]);
    for (let p of peersRef.current) {
      p.pc.close();
    }
    peersRef.current = [];
    hostRef.current = false;
    //roomName = null; //might cause an issue
    navigation.goBack();
  };

  const onPeerLeave = (user, participants) => {
    try {
      console.log('onPeerLeave');
      if (participants.length === 1) {
        setPeerConnections([]);
        setStreams([]);
        userStreamRef.current = null;
        setVcParticipants([]);
        for (let p of peersRef.current) {
          p.pc.close();
        }
        setPicked(false);
        setConnection('connecting...');
        peersRef.current = [];
        hostRef.current = false;
        navigation.goBack();
      }
      hostRef.current = true;
      console.log(user, 'left Room');
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
      setVcParticipants(participants);
    } catch (err) {
      console.log(err);
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

  const handleRoomCreated = () => {
    console.log('handleRoomCreated (host)', user.username);
    hostRef.current = true;
    try {
      mediaDevices.getUserMedia(mediaConstraints).then(mediaStream => {
        userStreamRef.current = mediaStream;
        setStreams(streams => [...streams, mediaStream.toURL()]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const terminateCall = () => {
    setStreams([]);
    hostRef.current = false;
    userStreamRef.current = null;
    socket.emit('terminate group call', participants);
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/Groupchat/background.png')}
      style={{flex: 1, marginTop: StatusBar.currentHeight}}
      blurRadius={5}>
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
      {/* <View style={styles.body}>
        <View style={styles.row}>
          <Image
            source={require('../../assets/images/Groupchat/Ellipse.png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(1).png')}
            style={styles.image}
          />
        </View>
        <View style={styles.row}>
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(2).png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(3).png')}
            style={styles.image}
          />
        </View>
        <View style={styles.row}>
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(4).png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(5).png')}
            style={styles.image}
          />
        </View>
        <View style={styles.row}>
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(6).png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Groupchat/Ellipse(7).png')}
            style={styles.image}
          />
        </View>
      </View> */}
      <FlatList
        data={vcParticipants}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({item}) => (
          <View style={{padding: 2.5}}>
            <View style={styles.vcContainer}>
              <Image
                source={{uri: item.avatar}}
                style={[styles.image, {borderRadius: 100}]}
              />
              <View style={{marginTop: 10}}>
                <Text style={common.white_Bold_14}>{item.username}</Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={common.white_Regular_12}>{connection}</Text>
              </View>
            </View>
          </View>
        )}
      />
      {picked ? (
        <View
          style={[
            styles.footer,
            {
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}>
          {/* <TouchableOpacity style={styles.iconContainer}>
            <Speaker />
          </TouchableOpacity> */}
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
        <View
          style={[
            styles.footer,
            {
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}>
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
    </ImageBackground>
  );
};

export default GroupVoiceCall;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
  },
  image: {
    width: 100,
    height: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 2,
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
  vcContainer: {
    height: Dimensions.get('screen').height / 2.2,
    width: 200,
    backgroundColor: colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
