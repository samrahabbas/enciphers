import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  AddContact,
  ContactsBlack,
  GroupChatIcon,
  GroupWhite,
  HelpBlack,
  InfoWhite,
  RefreshBlack,
  RefreshWhite,
  Scan,
  SearchBig,
  UserPlusBlack,
  UserPlusWhite,
} from '../../assets/icons/icons';
import CallContainer from '../../components/CallContainer';
import {getContacts} from '../../redux/actions/contactsAction';
import {accessChats, SingleChat} from '../../redux/actions/chatAction';
import {socket} from '../../redux/reducers/socket';
import {getParticipantsByChatId} from '../../local_db/SQLite';
import InCallManager from 'react-native-incall-manager';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import {addCall} from '../../redux/actions/callAction';

const SelectContacts = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  const [options, setOptions] = useState(false);
  const contacts = useSelector(state => state.contact.contacts);
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  //const socket = useSelector(state => state.socket.socket);

  // const [remoteStream, setRemoteStream] = useState(null);
  // const [localStream, setLocalStream] = useState(null);
  // const [webcamStarted, setWebcamStarted] = useState(false);
  // const [channelId, setChannelId] = useState(null);
  // const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  // const startWebcam = async () => {
  //   pc.current = new RTCPeerConnection(servers);
  //   const local = await mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   pc.current.addStream(local);
  //   setLocalStream(local);

  //   const remote = new MediaStream();
  //   setRemoteStream(remote);

  //   // Push tracks from local stream to peer connection
  //   local.getTracks().forEach(track => {
  //     pc.current.getLocalStreams()[0].addTrack(track);
  //   });

  //   // Pull tracks from peer connection, add to remote video stream
  //   pc.current.ontrack = event => {
  //     event.streams[0].getTracks().forEach(track => {
  //       remote.addTrack(track);
  //     });
  //   };

  //   pc.current.onaddstream = event => {
  //     setRemoteStream(event.stream);
  //   };
  // };

  // const startCall = async () => {
  //   const channelDoc = firestore().collection('channels').doc();
  //   const offerCandidates = channelDoc.collection('offerCandidates');
  //   const answerCandidates = channelDoc.collection('answerCandidates');

  //   setChannelId(channelDoc.id);

  //   pc.current.onicecandidate = async event => {
  //     if (event.candidate) {
  //       await offerCandidates.add(event.candidate.toJSON());
  //     }
  //   };

  //   //create offer
  //   const offerDescription = await pc.current.createOffer();
  //   await pc.current.setLocalDescription(offerDescription);

  //   const offer = {
  //     sdp: offerDescription.sdp,
  //     type: offerDescription.type,
  //   };

  //   await channelDoc.set({offer});

  //   // Listen for remote answer
  //   channelDoc.onSnapshot(snapshot => {
  //     const data = snapshot.data();
  //     if (!pc.current.currentRemoteDescription && data?.answer) {
  //       const answerDescription = new RTCSessionDescription(data.answer);
  //       pc.current.setRemoteDescription(answerDescription);
  //     }
  //   });

  //   // When answered, add candidate to peer connection
  //   answerCandidates.onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(change => {
  //       if (change.type === 'added') {
  //         const data = change.doc.data();
  //         pc.current.addIceCandidate(new RTCIceCandidate(data));
  //       }
  //     });
  //   });
  // };
  // let mediaConstraints = {
  //   audio: true,
  //   video: {
  //     frameRate: 30,
  //     facingMode: 'user',
  //   },
  // };
  // let peerConstraints = {
  //   iceServers: [
  //     {
  //       urls: 'stun:stun.l.google.com:19302',
  //     },
  //   ],
  // };
  // const [calling, setCalling] = useState(false);
  // const [localStream, setLocalStream] = useState({toURL: () => null});
  // const [remoteStream, setRemoteStream] = useState({toURL: () => null});
  // const [conn, setConn] = useState(new WebSocket('http://70.62.23.133:9999'));
  // const [yourConn, setYourConn] = useState(
  //   //change the config as you need
  //   new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: 'stun:stun.l.google.com:19302',
  //       },
  //       {
  //         urls: 'stun:stun1.l.google.com:19302',
  //       },
  //       {
  //         urls: 'stun:stun2.l.google.com:19302',
  //       },
  //     ],
  //   }),
  // );
  // const [offer, setOffer] = useState(null);
  // const [callToUsername, setCallToUsername] = useState(null);

  useEffect(() => {
    dispatch(getContacts());
  }, []);

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
  //   } catch (err) {
  //     // Handle Error
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

  // let peerConnection = new RTCPeerConnection(peerConstraints);

  // peerConnection.addEventListener('connectionstatechange', event => {});
  // peerConnection.addEventListener('icecandidate', event => {});
  // peerConnection.addEventListener('icecandidateerror', event => {});
  // peerConnection.addEventListener('iceconnectionstatechange', event => {});
  // peerConnection.addEventListener('icegatheringstatechange', event => {});
  // peerConnection.addEventListener('negotiationneeded', event => {});
  // peerConnection.addEventListener('signalingstatechange', event => {});
  // peerConnection.addEventListener('addstream', event => {});
  // peerConnection.addEventListener('removestream', event => {});

  // const destroyPeerConnection = () => {
  //   peerConnection._unregisterEvents();
  //   peerConnection.close();
  //   peerConnection = null;
  // };

  // useEffect(() => {
  //   /**
  //    *
  //    * Sockets Signalling
  //    */
  //   conn.onopen = () => {
  //     console.log('Connected to the signaling server');
  //     setSocketActive(true);
  //   };
  //   //when we got a message from a signaling server
  //   conn.onmessage = msg => {
  //     let data;
  //     if (msg.data === 'Hello world') {
  //       data = {};
  //     } else {
  //       data = JSON.parse(msg.data);
  //       console.log('Data --------------------->', data);
  //       switch (data.type) {
  //         case 'login':
  //           console.log('Login');
  //           break;
  //         //when somebody wants to call us
  //         case 'offer':
  //           handleOffer(data.offer, data.name);
  //           console.log('Offer');
  //           break;
  //         case 'answer':
  //           handleAnswer(data.answer);
  //           console.log('Answer');
  //           break;
  //         //when a remote peer sends an ice candidate to us
  //         case 'candidate':
  //           handleCandidate(data.candidate);
  //           console.log('Candidate');
  //           break;
  //         case 'leave':
  //           handleLeave();
  //           console.log('Leave');
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   };
  //   conn.onerror = function (err) {
  //     console.log('Got error', err);
  //   };
  //   /**
  //    * Socket Signalling Ends
  //    */

  //   let isFront = false;
  //   mediaDevices.enumerateDevices().then(sourceInfos => {
  //     let videoSourceId;
  //     for (let i = 0; i < sourceInfos.length; i++) {
  //       const sourceInfo = sourceInfos[i];
  //       if (
  //         sourceInfo.kind == 'videoinput' &&
  //         sourceInfo.facing == (isFront ? 'front' : 'environment')
  //       ) {
  //         videoSourceId = sourceInfo.deviceId;
  //       }
  //     }
  //     mediaDevices
  //       .getUserMedia({
  //         audio: true,
  //         video: {
  //           mandatory: {
  //             minWidth: 500, // Provide your own width, height and frame rate here
  //             minHeight: 300,
  //             minFrameRate: 30,
  //           },
  //           facingMode: isFront ? 'user' : 'environment',
  //           optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
  //         },
  //       })
  //       .then(stream => {
  //         // Got stream!
  //         setLocalStream(stream);

  //         // setup stream listening
  //         yourConn.addStream(stream);
  //       })
  //       .catch(error => {
  //         // Log error
  //       });
  //   });

  //   yourConn.onaddstream = event => {
  //     console.log('On Add Stream', event);
  //     setRemoteStream(event.stream);
  //   };

  //   // Setup ice handling
  //   yourConn.onicecandidate = event => {
  //     if (event.candidate) {
  //       send({
  //         type: 'candidate',
  //         candidate: event.candidate,
  //       });
  //     }
  //   };
  // }, []);

  // const send = message => {
  //   //attach the other peer username to our messages
  //   if (connectedUser) {
  //     message.name = connectedUser;
  //     console.log('Connected iser in end----------', message);
  //   }

  //   conn.send(JSON.stringify(message));
  // };

  // const onCall = () => {
  //   setCalling(true);

  //   connectedUser = callToUsername;
  //   console.log('Caling to', callToUsername);
  //   // create an offer

  //   yourConn.createOffer().then(offer => {
  //     yourConn.setLocalDescription(offer).then(() => {
  //       console.log('Sending Ofer');
  //       console.log(offer);
  //       send({
  //         type: 'offer',
  //         offer: offer,
  //       });
  //       // Send pc.localDescription to peer
  //     });
  //   });
  // };

  // //when somebody sends us an offer
  // const handleOffer = async (offer, name) => {
  //   console.log(name + ' is calling you.');

  //   console.log('Accepting Call===========>', offer);
  //   connectedUser = name;

  //   try {
  //     await yourConn.setRemoteDescription(new RTCSessionDescription(offer));

  //     const answer = await yourConn.createAnswer();

  //     await yourConn.setLocalDescription(answer);
  //     send({
  //       type: 'answer',
  //       answer: answer,
  //     });
  //   } catch (err) {
  //     console.log('Offerr Error', err);
  //   }
  // };

  // //when we got an answer from a remote user
  // const handleAnswer = answer => {
  //   yourConn.setRemoteDescription(new RTCSessionDescription(answer));
  // };

  // //when we got an ice candidate from a remote user
  // const handleCandidate = candidate => {
  //   setCalling(false);
  //   console.log('Candidate ----------------->', candidate);
  //   yourConn.addIceCandidate(new RTCIceCandidate(candidate));
  // };

  // const handleLeave = () => {
  //   connectedUser = null;
  //   setRemoteStream({toURL: () => null});

  //   yourConn.close();
  // };

  return (
    <Pressable
      onPress={() => setOptions(false)}
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Select Contact'}
        right={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{marginRight: 20}}>
              <SearchBig />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOptions(prev => !prev)}>
              <Ionicons
                name="ellipsis-horizontal-circle"
                color={colors.WHITE}
                size={26}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <FlatList
        style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}
        ListHeaderComponent={() => (
          <View>
            <TouchableOpacity
              style={common.row}
              onPress={() => navigation.navigate('NewGroup')}>
              <View style={common.iconContainer}>
                <GroupChatIcon />
              </View>
              <View style={{marginLeft: 20}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Bold_18
                      : common.black_Bold_18
                  }>
                  New Group
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={[
                common.row,
                {marginTop: 20, justifyContent: 'space-between'},
              ]}>
              <View style={common.row}>
                <View style={common.iconContainer}>
                  <AddContact />
                </View>
                <View style={{marginLeft: 20}}>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Bold_18
                        : common.black_Bold_18
                    }>
                    New Contact
                  </Text>
                </View>
              </View>
              <Scan />
            </View>
          </View>
        )}
        data={contacts}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <CallContainer
            both
            title={item.username}
            image={item.avatar}
            des={'+1-202-555-0161'}
            onPress={() => {
              dispatch(
                SingleChat(
                  currentUser,
                  item,
                  item.username,
                  false,
                  currentUser._id,
                  item.avatar,
                ),
              ).then(res => {
                if (res.message === 'Already in Chat') {
                  getParticipantsByChatId(res.res.id).then(result => {
                    var otherUser;
                    for (let i = 0; i < result.length; i++) {
                      if (result[i].userId !== currentUser._id) {
                        otherUser = result[i];
                      }
                    }
                    navigation.navigate('Chat', {
                      user: otherUser,
                      chatId: res.res.id,
                      chatInfo: res.res,
                    });
                  });
                } else {
                  var otherUser;
                  for (let i = 0; i < res.users.length; i++) {
                    if (res.users[i].userId !== currentUser._id) {
                      otherUser = res.users[i];
                    }
                  }
                  const socketInfo = res;
                  socketInfo.otherUser = otherUser;
                  socket.emit('chat created', socketInfo, currentUser);
                  navigation.navigate('Chat', {
                    user: item,
                    chatId: res.id,
                    chatInfo: res,
                  });
                }
              }); //navigate
              // dispatch(accessChats(item._id)).then(res => {
              //   navigation.navigate('Chat', {
              //     user: item,
              //     chatId: res._id,
              //     chatInfo: res,
              //   });
              // });
            }}
            onPressCall={
              () => {
                dispatch(
                  addCall(item.username, 'audio', 'Outgoing', item.avatar),
                );
                navigation.navigate('VoiceCall', {item: item});
              }
              // {
              //   try {
              //     InCallManager.start({media: 'audio'});
              //     InCallManager.setForceSpeakerphoneOn(true);
              //     InCallManager.setSpeakerphoneOn(true);
              //   } catch (err) {
              //     console.log('InApp Caller ---------------------->', err);
              //   }
              //   console.log(InCallManager);
              //
              // }
            }
            onPressVideo={() => {
              dispatch(
                addCall(item.username, 'video', 'Outgoing', item.avatar),
              );
              navigation.navigate('VideoCall', {item: item});
            }}
          />
        )}
      />
      {options && (
        <Pressable
          style={
            colorMode === 'Dark'
              ? styles.optionContainer
              : styles.optionContainer_light
          }>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <UserPlusWhite /> : <UserPlusBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Invite a friend
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <GroupWhite /> : <ContactsBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Contacts
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <RefreshWhite /> : <RefreshBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Refresh
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <InfoWhite /> : <HelpBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Help
              </Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      )}
    </Pressable>
  );
};

export default SelectContacts;

const styles = StyleSheet.create({
  optionContainer: {
    width: 171,
    height: 216,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    right: 20,
    top: 80,
    paddingTop: 10,
    backgroundColor: colors.DARK_2,
    position: 'absolute',
  },
  optionContainer_light: {
    width: 171,
    height: 216,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    right: 20,
    top: 80,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: colors.Gray_100,
    backgroundColor: colors.WHITE,
    position: 'absolute',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.GRAY_2,
    paddingVertical: 15,
  },
});
