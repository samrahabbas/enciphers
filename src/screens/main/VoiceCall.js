import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import colors from '../../constants/colors';
import Header from '../../components/Header';
import {common} from '../../styles/styles';
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
import {useSelector} from 'react-redux';
import InCallManager from 'react-native-incall-manager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'uuid';

const VoiceCall = ({navigation, route}) => {
  const {item} = route.params;
  const [micActive, setMicActive] = useState(true);
  const userStreamRef = useRef();
  const [picked, setPicked] = useState(false);
  const hostRef = useRef(false);
  const pcRef = useRef(null);
  const RoomName = useRef(null);
  const roomName = genRandomString(12);
  const user = useSelector(state => state.auth.user);
  const [connectedCallId, setConnectedCallId] = useState(null);
  const [connection, setConnection] = useState('connecting...');
  //const socket = useSelector(state => state.socket.socket);
  let peerConnection;

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

  useEffect(() => {
    socket.emit('join voice call', roomName, user, item);
    socket.off('created').on('created', handleRoomCreated);
    // If the room didn't exist, the server would emit the room was 'created'

    // Whenever the next person joins, the server emits 'ready'
    socket.off('ready voice call').on('ready voice call', initiateCall); // host

    socket.on('ice-candidate', handlerNewIceCandidateMsg);

    socket.off('answer').on('answer', handleAnswer); // host receiving the answer back from the offer given to other user
    // Emitted when a peer leaves the room
    socket.off('end call').on('end call', onPeerLeave);

    socket.off('rejected').on('rejected', callRejected);
    // If the room is full, we show an alert
    socket.on('full', () => {
      console.log('on another call');
    });

    // return () => {
    //   peerConnection.close();
    //   peerConnection = null;
    //   userStreamRef.current = null;
    //   socket.emit('end call', roomName);
    // };
  }, []);

  const callRejected = () => {
    InCallManager.stop();
    hostRef.current = false;
    userStreamRef.current = null;
    navigation.goBack();
  };

  const handleRoomCreated = () => {
    console.log('handleRoomCreated (host)');
    InCallManager.start({media: 'video', auto: true, ringback: ''});
    //InCallManager.startRingback('DEFAULT');
    hostRef.current = true;
    try {
      mediaDevices.getUserMedia(mediaConstraints).then(mediaStream => {
        userStreamRef.current = mediaStream;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const createPeerConnection = async roomName => {
    try {
      console.log('createPeerConnection (host)');
      peerConnection = new RTCPeerConnection(peerConstraints);
      pcRef.current = peerConnection;
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
          case 'connected':
            setConnection('connected');
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

  const initiateCall = async roomName => {
    InCallManager.stopRingback();
    setPicked(true);
    //InCallManager.start({media: 'audio', auto: true});
    if (!peerConnection) {
      if (hostRef.current) {
        console.log('initiateCall (host)');
        RoomName.current = roomName;
        peerConnection = await createPeerConnection(roomName);
        peerConnection
          .createOffer(sessionConstraints)
          .then(offer => {
            peerConnection
              .setLocalDescription(offer)
              .then(() => {
                socket.emit('offer voice call', offer, roomName);
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

  const handleAnswer = (answer, roomName) => {
    if (hostRef.current) {
      console.log('handleAnswer (host)');
      const answerDescription = new RTCSessionDescription(answer);
      peerConnection
        .setRemoteDescription(answerDescription)
        .then(() => {})
        .catch(err => console.log(err, 'handle answer'));
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
    } catch (err) {
      console.log(err);
    }
  };

  const onPeerLeave = () => {
    console.log('onPeerLeave (host)');
    //InCallManager.stopRingback();
    if (pcRef.current) {
      pcRef.current.close();
    }
    setPicked(false);
    //hostRef.current = true;
    peerConnection = null;
    pcRef.current = null;
    RoomName.current = null;
    userStreamRef.current = null;
    setConnection('connecting...');
    InCallManager.stop();
    navigation.goBack();
  };

  const leaveRoom = () => {
    console.log('leaveRoom');
    //InCallManager.stopRingback();
    socket.emit('end call', RoomName.current); // Let's the server know that user has left the room.
    //or blur on unmount
    if (pcRef.current) {
      pcRef.current.close();
    }
    setPicked(false);
    peerConnection = null;
    pcRef.current = null;
    RoomName.current = null;
    userStreamRef.current = null;
    setConnection('connecting...');
    InCallManager.stop();
    navigation.goBack();
  };

  const terminateCall = () => {
    InCallManager.stop();
    hostRef.current = false;
    userStreamRef.current = null;
    socket.emit('terminate call', item);
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/avatars/GirlBackground.png')}
      style={{flex: 1}}
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
      <View style={styles.body}>
        <Image
          source={{uri: item.avatar}}
          style={{width: 200, height: 200, borderRadius: 500}}
        />
        <View style={{marginTop: 10}}>
          <Text style={common.white_Bold_32}>{item.username}</Text>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={common.white_Regular_18}>{connection}</Text>
        </View>
        {/* <View style={{marginTop: 20}}>
          <Text style={common.white_Regular_18}>05:08 minutes</Text>
        </View> */}
      </View>
      {picked ? (
        <View style={styles.footer}>
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
        <View style={styles.footer}>
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

export default VoiceCall;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
