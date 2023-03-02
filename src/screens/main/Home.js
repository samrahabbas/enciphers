import {
  Image,
  StyleSheet,
  StatusBar,
  Text,
  View,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  PermissionsAndroid,
  AppState,
} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import React, {useState, useRef} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Button from '../../components/Button';
import InCallManager from 'react-native-incall-manager';
import ChatCard from '../../components/ChatCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  AcceptCall,
  AddUser,
  Mic,
  MissedCall,
  Speaker,
  Video,
} from '../../assets/icons/icons';
import {
  CallWhite,
  CallWhiteFill,
  Camera,
  ContactsBlack,
  DownloadFill,
  EditWhite,
  GroupWhite,
  Pin,
  RefreshBlack,
  RefreshWhite,
  SearchBig,
  SettingsSmallBlack,
  SettingsSmallWhite,
  SoundOffFill,
  SpeakerSmallBlack,
  SpeakerSmallWhite,
  StarSmallBlack,
  StarSmallWhite,
} from '../../assets/icons/icons';
import CallContainer from '../../components/CallContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useEffect, useCallback} from 'react';
import Header from '../../components/Header';
import {
  fetchChats,
  fetchParticipants,
  newGroupChat,
  PendingGroupChat,
  PendingSingleChat,
  removeFromGroup,
  SingleChat,
} from '../../redux/actions/chatAction';
import {
  checkFieldFromTable,
  checkIfTableExists,
  checkPendingCall,
  checkPendingChats,
  checkPendingMessage,
  checkPendingParticipants,
  checkPendingParticipantsOfChat,
  createChatTable,
  createLatestMessageTable,
  createMessageTable,
  createParticipantsTable,
  createUserTable,
  delete5daysAgoMessages,
  deletePendingCalls,
  deletePendingMessages,
  deleteRow,
  deleteRows,
  dropTable,
  getChats,
  getChatsByName,
  getData,
  getGroupChatsByName,
  getLatestMessage,
  getParticipants,
  getPendingChat,
  getPendingChatById,
  getPendingChatByName,
  getPendingParticipantsOfChat,
  getSenderById,
  initiateApp,
  insertIntoPendingCall,
  savePendingMessages,
  truncateTable,
  updateFieldFromTable,
  updatePendingParticipants,
  userExists,
} from '../../local_db/SQLite';
import {socket} from '../../redux/reducers/socket';
import {
  getAllMessages,
  receiveMessages,
  receivePendingMessages,
} from '../../redux/actions/messageAction';
import moment from 'moment';
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
import {ImageBackground} from 'react-native';
import RNCallKeep, {CONSTANTS as CK_CONSTANTS} from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import invokeApp from 'react-native-invoke-app';
import BackgroundService from 'react-native-background-actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  addCall,
  addMissedCall,
  fetchCalls,
} from '../../redux/actions/callAction';

const Home = ({navigation}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'chats', title: 'Chats'},
    // {key: 'status', title: 'Status'},
    {key: 'calls', title: 'Calls'},
  ]);
  const [error, setError] = useState();
  const colorMode = useSelector(state => state.color.color);
  const [options, setOptions] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //const socket = useSelector(state => state.socket.socket);
  const chats = useSelector(state => state.chat.chats);
  const calls = useSelector(state => state.call.calls);
  const currentUser = useSelector(state => state.auth.user);
  const messages = useSelector(state => state.message.messages);
  const newMessages = useSelector(state => state.message.newMessages);
  const dispatch = useDispatch();

  //webrtc
  const [call, setCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [accept, setAccept] = useState(false);
  const [reject, setReject] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  // const userVideoRef = useRef();
  // const peerVideoRef = useRef();
  // const rtcConnectionRef = useRef(null);
  const userStreamRef = useRef(null);
  const hostRef = useRef(false);
  const CALLER = useRef(null);
  const [connection, setConnection] = useState('connecting...');
  // group call
  const [groupCall, setGroupCall] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [peerConnections, setPeerConnections] = useState([]);
  const [streams, setStreams] = useState([]);
  const peersRef = useRef([]);
  const groupInfoRef = useRef(null);
  const streamURLs = useRef([]);
  const ready = useRef(false);
  let peerConnection;
  const pcRef = useRef(null);
  const RoomName = useRef(null);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [groupCallParticipants, setGroupCallParticipants] = useState([]);
  //vc
  const [voiceCall, setVoiceCall] = useState(false);
  const [groupVoiceCall, setGroupVoiceCall] = useState(false);
  const [vcParticipants, setVcParticipants] = useState([]);

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

  const CONSTANTS = {
    END_CALL_REASONS: {
      FAILED: 1,
      REMOTE_ENDED: 2,
      UNANSWERED: 3,
      ANSWERED_ELSEWHERE: 4,
      DECLINED_ELSEWHERE: 5,
      MISSED: 6,
    },
  };

  //RNCallKeep.endAllCalls();

  const requestReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        'android.permission.READ_PHONE_NUMBERS',
        {
          title: 'Read Phone Numbers Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can Read');
      } else {
        console.log('Read permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const callNotification = async caller => {
    const channelId = await notifee.createChannel({
      id: 'call',
      name: 'Default Channel',
      vibrationPattern: [300, 500],
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: `Incoming Call 📞 from ${caller}`,
      android: {
        vibrationPattern: [300, 500],
        channelId,
        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        // pressAction: {
        //   id: 'default',
        // },
        actions: [
          {
            title: 'Reject',
            pressAction: {id: 'reject'},
          },
          {
            title: 'Answer',
            pressAction: {id: 'answer'},
          },
        ],
        color: colors.primary_500,
        sound: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const messageNotification = async (body, sender) => {
    const channelId = await notifee.createChannel({
      id: 'message',
      name: 'Default Channel',
      vibrationPattern: [300, 500],
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'New Message 💬',
      body: `${sender}: ${body}`,
      android: {
        vibrationPattern: [300, 500],
        channelId,
        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'message',
        },
        color: colors.primary_500,
        sound: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const onDisplayNotification = async caller => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Missed Call 📞',
      body: `Missed a call from ${caller}`,
      android: {
        channelId,
        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
        color: colors.primary_500,
        sound: 'default',
      },
    });
  };

  const setup = () => {
    try {
      RNCallKeep.setup(Options);
      RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
      //RNCallKeep.setReachable();
    } catch (err) {
      console.error('initializeCallKeep error:', err.message);
    }
  };

  const Options = {
    android: {
      // alertTitle: 'Permissions Required',
      // alertDescription:
      //   'This application needs to access your phone calling accounts to make calls',
      // cancelButton: 'Cancel',
      // okButton: 'ok',
      // imageName: 'sim_icon',
      //additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
      selfManaged: true,
      // Required to get audio in background when using Android 11
      foregroundService: {
        channelId: 'com.company.my',
        channelName: 'Foreground service for my app',
        notificationTitle: 'My app is running on background',
        notificationIcon: 'Path to the resource icon of the notification',
      },
    },
  };

  //Background Service
  // const sleep = time =>
  //   new Promise(resolve => setTimeout(() => resolve(), time));

  // const veryIntensiveTask = async taskDataArguments => {
  //   // Example of an infinite loop task
  //   const {delay} = taskDataArguments;
  //   await new Promise(async resolve => {
  //     for (let i = 0; BackgroundService.isRunning(); i++) {
  //       socket.off('incoming call').on('incoming call', incomingCall);
  //       socket
  //         .off('incoming voice call')
  //         .on('incoming voice call', incomingVoiceCall);
  //       socket
  //         .off('incoming group voice call')
  //         .on('incoming group voice call', incomingGroupVCCall);
  //       socket
  //         .off('incoming group call')
  //         .on('incoming group call', incomingGroupCall);
  //       await sleep(delay);
  //     }
  //   });
  // };

  // const Notification = {
  //   taskName: 'Background',
  //   taskTitle: 'Background activity',
  //   taskDesc: 'ExampleTask description',
  //   taskIcon: {
  //     name: 'ic_launcher',
  //     type: 'mipmap',
  //   },
  //   color: colors.primary_500,
  //   linkingURI: 'Enciphers://chat/jane', // See Deep Linking for more info
  //   parameters: {
  //     delay: 1000,
  //   },
  // };

  // useEffect(() => {
  //   if (!BackgroundService.isRunning()) {
  //     BackgroundService.start(veryIntensiveTask, Notification)
  //       .then(() => {
  //         console.log('Successful start!');
  //         // BackgroundService.updateNotification({
  //         //   taskDesc: 'New ExampleTask description',
  //         // }).catch(e => console.log(e));
  //       })
  //       .catch(err => console.log(err));
  //   }
  // }, []);

  useEffect(() => {
    notifee.requestPermission();
    requestReadPermission();
    setup();
    RNCallKeep.registerPhoneAccount(Options);
    // RNCallKeep.addEventListener(
    //   'didReceiveStartCallAction',
    //   didReceiveStartCallAction,
    // );
    // RNCallKeep.addEventListener(
    //   'didDisplayIncomingCall',
    //   onIncomingCallDisplayed,
    // );
    // RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    // RNCallKeep.addEventListener('didToggleHoldCallAction', onToggleHold);
    // RNCallKeep.addEventListener('didPerformDTMFAction', onDTMFAction);
    // RNCallKeep.addEventListener(
    //   'didActivateAudioSession',
    //   audioSessionActivated,
    // );
  }, []);

  //RNCallKeep.endAllCalls();

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', onEndCallAction);
    RNCallKeep.addEventListener(
      'showIncomingCallUi',
      ({handle, callUUID, name}) => {
        console.log('showIncomingCallUi');
        //RNCallKeep.displayIncomingCall(callUUID, handle, name);
        if (AppState.currentState.match(/inactive|background/)) {
          const yourObject = {route: 'Home'};

          invokeApp({
            data: yourObject,
          });
        } else {
          const yourObject = {route: 'Home'};

          invokeApp({
            data: yourObject,
          });
        }
      },
    );
    RNCallKeep.addEventListener(
      'createIncomingConnectionFailed',
      ({handle, callUUID, name}) => {
        console.log('createIncomingConnectionFailed');
      },
    );
    return () => {
      RNCallKeep.removeEventListener('answerCall');
      RNCallKeep.removeEventListener('endCall');
      RNCallKeep.removeEventListener('showIncomingCallUi');
      RNCallKeep.removeEventListener('createIncomingConnectionFailed');
    };
  }, []);

  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
  const startCall = ({handle, localizedCallerName}) => {
    // Your normal start call action
    RNCallKeep.startCall(currentCallId, handle, localizedCallerName);
  };

  // Event Listener Callbacks

  const didReceiveStartCallAction = data => {
    let {handle, callUUID, name} = data;
    console.log('didReceiveStartCallAction');
    // Get this event after the system decides you can start a call
    // You can now start a call from within your app
  };

  const onAnswerCallAction = data => {
    console.log('answer call event');
    //let {callUUID} = data;
    // Called when the user answers an incoming call
    if (voiceCall) {
      if (RoomName.current && CALLER.current) {
        socket.emit(
          'join voice call',
          RoomName.current,
          currentUser,
          CALLER.current,
        );
        setAccept(true);
        try {
          InCallManager.start({media: 'audio', auto: true});
          InCallManager.setForceSpeakerphoneOn(true);
          InCallManager.setSpeakerphoneOn(true);
        } catch (err) {
          console.log('InApp Caller ---------------------->', err);
        }
      }
    } else if (call) {
      if (RoomName.current && CALLER.current) {
        socket.emit(
          'join video call',
          RoomName.current,
          currentUser,
          CALLER.current,
        );
        setAccept(true);
        try {
          InCallManager.start({media: 'video', auto: true});
          InCallManager.setForceSpeakerphoneOn(true);
          InCallManager.setSpeakerphoneOn(true);
        } catch (err) {
          console.log('InApp Caller ---------------------->', err);
        }
      }
    } else if (groupCall) {
      if (RoomName.current && groupInfoRef.current && CALLER.current) {
        let participants = [];
        for (let user of groupInfoRef.current.users) {
          if (user.userId === currentUser._id) {
          }
          participants.push(user);
        }
        socket.emit(
          'join group call',
          RoomName.current,
          currentUser,
          participants,
          groupInfoRef.current,
          CALLER.current.username,
        );
        setAccept(true);
        try {
          InCallManager.start({media: 'video', auto: true});
          InCallManager.setForceSpeakerphoneOn(true);
          InCallManager.setSpeakerphoneOn(true);
        } catch (err) {
          console.log('InApp Caller ---------------------->', err);
        }
      }
    } else if (groupVoiceCall) {
      if (RoomName.current && groupInfoRef.current && CALLER.current) {
        let participants = [];
        for (let user of groupInfoRef.current.users) {
          if (user.userId === currentUser._id) {
          }
          participants.push(user);
        }
        socket.emit(
          'join group voice call',
          RoomName.current,
          currentUser,
          participants,
          groupInfoRef.current,
          CALLER.current.username,
        );
        setAccept(true);
        try {
          InCallManager.start({media: 'audio', auto: true});
          InCallManager.setForceSpeakerphoneOn(true);
          InCallManager.setSpeakerphoneOn(true);
        } catch (err) {
          console.log('InApp Caller ---------------------->', err);
        }
      }
    }
    //maybe try RNCallKeep.answerCall
    //console.log(currentCallId);
    InCallManager.stopRingtone();
    RNCallKeep.reportEndCallWithUUID(
      currentCallId,
      CK_CONSTANTS.END_CALL_REASONS.FAILED,
    );
    if (AppState.currentState.match(/inactive|background/)) {
      const yourObject = {route: 'Home'};

      invokeApp({
        data: yourObject,
      });
    }
  };

  const onEndCallAction = data => {
    console.log('end call event');
    // let {callUUID} = data;
    RNCallKeep.endCall(currentCallId);
    if (call) {
      setCall(false);
      socket.emit('rejected', RoomName.current);
    } else if (voiceCall) {
      setVoiceCall(false);
      socket.emit('rejected', RoomName.current);
    } else if (groupVoiceCall) {
      setGroupVoiceCall(false);
      setGroupInfo(null);
      groupInfoRef.current = null;
    } else if (groupCall) {
      setGroupCall(false);
      setGroupInfo(false);
      groupInfoRef.current = null;
    }
    setReject(true);
    setCaller(null);
    CALLER.current = null;
    RoomName.current = null;
    setCurrentCallId(null);
    InCallManager.stopRingtone();
    InCallManager.stop();
  };

  const createPeerConnection = async roomName => {
    try {
      console.log('createPeerConnection (peer)');
      pcRef.current = new RTCPeerConnection(peerConstraints);
      pcRef.current.addEventListener('connectionstatechange', event => {
        console.log(
          'connectionstatechange',
          event,
          pcRef.current.connectionState,
          currentUser.username,
        );
        switch (pcRef.current.connectionState) {
          case 'closed':
            // You can handle the call being disconnected here.
            break;
          case 'connected':
            setConnection('connected');
            break;
        }
      });
      pcRef.current.addEventListener('icecandidate', event => {
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
      pcRef.current.addEventListener('icecandidateerror', event => {
        console.log('icecandidateerror', event, currentUser.username);
        // You can ignore some candidate errors.
        // Connections can still be made even when errors occur.
      });
      pcRef.current.addEventListener('iceconnectionstatechange', event => {
        if (pcRef.current?.iceConnectionState) {
          console.log(
            'iceconnectionstatechange',
            event,
            pcRef.current.iceConnectionState,
            currentUser.username,
          );
          switch (pcRef.current.iceConnectionState) {
            case 'connected':
              console.log('connected');
              break;
            case 'completed':
              console.log('completed');
              // You can handle the call being connected here.
              // Like setting the video streams to visible.
              break;
          }
        }
      });
      pcRef.current.addEventListener('icegatheringstatechange', event => {
        console.log(
          'icegatheringstatechange',
          event,
          pcRef.current.iceGatheringState,
        );
      });
      pcRef.current.addEventListener('negotiationneeded', event => {
        console.log('negotiationneeded', event, currentUser.username);
        // You can start the offer stages here.
        // Be careful as this event can be called multiple times.
      });
      pcRef.current.addEventListener('signalingstatechange', event => {
        console.log(
          'signalingstatechange',
          event,
          currentUser.username,
          pcRef.current.signalingState,
        );
        switch (pcRef.current.signalingState) {
          case 'closed':
            // You can handle the call being disconnected here.
            console.log('call closed');
            break;
        }
      });
      pcRef.current.addEventListener('track', handleTrackEvent);
      pcRef.current.addEventListener('removetrack', event => {
        console.log('removestream', event, currentUser.username);
      });
      //add all tracks now that the error is resolved
      try {
        userStreamRef.current.getTracks().forEach(track => {
          //if (Object.keys(track._constraints).length !== 0) {
          //console.log(track, '(peer)');
          pcRef.current.addTrack(track, userStreamRef.current);
          //}
        });
      } catch (err) {
        console.log(err);
      }
      return pcRef.current;
    } catch (error) {
      console.log(error);
    }
  };

  //using .off before .on makes it fire only once
  useEffect(() => {
    //if (Object.keys(socket?._callbacks).length === 0) {
    //console.log(socket._callbacks);
    socket.emit('setup', currentUser);
    //}
    //comment this if chat screen is on and msgs are not being loaded
    socket
      .off('message received')
      .on('message received', newMessageReceived => {
        if (newMessageReceived.isGroupChat === 0) {
          getSenderById(newMessageReceived.message.sender).then(sender => {
            getChatsByName(sender.username, currentUser).then(res => {
              dispatch(
                receiveMessages(
                  newMessageReceived.message.content,
                  res.id,
                  newMessageReceived.message.sender,
                ),
              ).then(res => {
                messageNotification(
                  newMessageReceived.message.content,
                  sender.username,
                );
                console.log('received');
              });
            });
          });
        } else {
          getGroupChatsByName(newMessageReceived.chatName, currentUser).then(
            res => {
              if (res === 'Chat does not exist') {
                const users = [];
                for (let i = 0; i < newMessageReceived.users.length; i++) {
                  const u = {
                    _id: newMessageReceived.users[i].userId,
                    avatar: newMessageReceived.users[i].avatar,
                    username: newMessageReceived.users[i].username,
                  };
                  users.push(u);
                }
                dispatch(
                  newGroupChat(
                    users,
                    newMessageReceived.chatName,
                    true,
                    newMessageReceived.groupAdmin,
                    newMessageReceived.groupAvatar,
                  ),
                ).then(() => {
                  //test this again
                  getGroupChatsByName(
                    newMessageReceived.chatName,
                    currentUser,
                  ).then(res => {
                    dispatch(
                      receiveMessages(
                        newMessageReceived.message.content,
                        res.id,
                        newMessageReceived.message.sender,
                      ),
                    ).then(res => {
                      console.log('group message received');
                      messageNotification(
                        newMessageReceived.message.content,
                        newMessageReceived.chatName,
                      );
                    });
                  });
                });
              } else {
                dispatch(
                  receiveMessages(
                    newMessageReceived.message.content,
                    res.id,
                    newMessageReceived.message.sender,
                  ),
                ).then(res => {
                  console.log('group message received');
                });
              }
            },
          );
          // getChatsByName(newMessageReceived.chatName, currentUser).then(res => {
          //   dispatch(
          //     receiveMessages(
          //       newMessageReceived.message.content,
          //       res.id,
          //       newMessageReceived.message.sender,
          //     ),
          //   ).then(res => {
          //     console.log('received');
          //   });
          // });
        }
      });
    socket.off('pending chat').on('pending chat', chat => {
      console.log('pending chat');
      var otherUser = {
        _id: null,
        avatar: null,
        username: null,
      };
      for (let i = 0; i < chat.users.length; i++) {
        if (chat.users[i].userId !== currentUser._id) {
          otherUser._id = chat.users[i].userId;
          otherUser.username = chat.users[i].username;
          otherUser.avatar = chat.users[i].avatar;
        }
      }
      // getData & check pending has that chat already?
      getPendingChatByName(chat.chatName, currentUser._id).then(res => {
        if (res.length === 0) {
          dispatch(
            PendingSingleChat(
              currentUser,
              otherUser,
              otherUser.username,
              false,
              currentUser._id,
              otherUser.avatar,
            ),
          );
        }
      });
    });
    socket
      .off('pending group chat')
      .on('pending group chat', (chat, pending) => {
        console.log('pending group chat');
        //check if chatName is already in pending_chat table
        const users = [];
        for (let i = 0; i < chat.users.length; i++) {
          const u = {
            _id: chat.users[i].userId,
            avatar: chat.users[i].avatar,
            username: chat.users[i].username,
          };
          users.push(u);
        }
        dispatch(
          PendingGroupChat(
            users,
            chat.chatName,
            true,
            chat.groupAdmin,
            'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
            pending,
          ),
        );
      });
    socket.off('pending call record').on('pending call record', info => {
      dispatch(
        addMissedCall(
          info.chatName,
          info.type,
          info.status,
          info.avatar,
          info.createdAt,
        ),
      ).then(() => {
        onDisplayNotification(info.chatName);
      });
    });
    socket.off('got connected').on('got connected', user => {
      console.log(user._id + ' got connected');
      checkPendingCall(currentUser._id, user._id).then(res => {
        if (res.length) {
          for (let i = 0; i < res.length; i++) {
            socket.emit('pending call record', res[i], res[i].pending_user);
          }
          setTimeout(function () {
            deletePendingCalls(currentUser._id, user._id);
          }, 4000);
        }
      }); //delete pending call
      //get the pending chats of this particular user
      checkPendingParticipants(user).then(res => {
        if (res.length) {
          for (let i = 0; i < res.length; i++) {
            getPendingChatById(res[i].chat_id).then(result => {
              if (result.isGroupChat === 1) {
                getPendingParticipantsOfChat(result.id).then(r => {
                  var otherUsers = [];
                  for (let i = 0; i < r.length; i++) {
                    if (r[i].userId !== currentUser._id) {
                      otherUsers.push(r[i]);
                    }
                  }
                  const socketInfo = result;
                  socketInfo.otherUsers = otherUsers;
                  socketInfo.users = r;
                  socket.emit('group chat created', socketInfo);
                  updatePendingParticipants(user, result.id).then(res =>
                    console.log(res),
                  );
                  checkPendingParticipantsOfChat(result.id).then(res => {
                    if (res === false) {
                      deleteRows('pending_participants', 'chat_id', result.id);
                      deleteRows('pending_chat', 'id', result.id);
                    }
                  });
                });
              } else {
                getPendingParticipantsOfChat(result.id).then(r => {
                  var otherUser;
                  for (let i = 0; i < r.length; i++) {
                    if (r[i].userId !== currentUser._id) {
                      otherUser = r[i];
                    }
                  }
                  const socketInfo = result;
                  socketInfo.otherUser = otherUser;
                  socketInfo.users = r;
                  socket.emit('chat created', socketInfo, currentUser);
                  deleteRows('pending_participants', 'chat_id', result.id);
                  deleteRows('pending_chat', 'id', result.id);
                });
              }
            });
          }
        }
      });
      setTimeout(function () {
        //check if pending_message table has a pending_user field equal to the user that got connected
        checkPendingMessage(user)
          .then(res => {
            if (res.length) {
              socket.emit('receive messages', res);
            }
          })
          .then(() => {
            deletePendingMessages(user);
          });
      }, 4000);
    });
    socket
      .off('get received messages')
      .on('get received messages', messages => {
        console.log('get received messages', messages);
        for (let i = 0; i < messages.length; i++) {
          getData('chat').then(res => {
            //for group chat
            for (let j = 0; j < res.length; j++) {
              if (res[j].isGroupChat === 1) {
                if (messages[i].chatName === res[j].chatName) {
                  dispatch(
                    receivePendingMessages(
                      messages[i].content,
                      res[j].id,
                      messages[i].sender,
                      messages[i].createdAt,
                    ),
                  );
                }
              } else {
                if (messages[i].chatName === res[j].chatName) {
                  dispatch(
                    receivePendingMessages(
                      messages[i].content,
                      res[j].id,
                      messages[i].sender,
                      messages[i].createdAt,
                    ),
                  );
                }
              }
            }
          });
        }
      });
    socket.off('chat').on('chat', chat => {
      console.log('chat');
      //check if chat exists already
      if (chats.find(c => c.chatName === chat.chatName)) {
      } else {
        var otherUser = {
          _id: null,
          avatar: null,
          username: null,
        };
        for (let i = 0; i < chat.users.length; i++) {
          if (chat.users[i].userId !== currentUser._id) {
            otherUser._id = chat.users[i].userId;
            otherUser.username = chat.users[i].username;
            otherUser.avatar = chat.users[i].avatar;
          }
        }
        dispatch(
          SingleChat(
            currentUser,
            otherUser,
            otherUser.username,
            false,
            otherUser._id,
            otherUser.avatar,
          ),
        );
      }
    });
    socket.off('group chat').on('group chat', chat => {
      console.log('group chat');
      //check if chat exists already
      if (chats.find(c => c.chatName === chat.chatName)) {
      } else {
        const users = [];
        for (let i = 0; i < chat.users.length; i++) {
          const u = {
            _id: chat.users[i].userId,
            avatar: chat.users[i].avatar,
            username: chat.users[i].username,
          };
          users.push(u);
        }
        // for (let i = 0; i < chat.otherUsers.length; i++) {
        dispatch(
          newGroupChat(
            users,
            chat.chatName,
            true,
            chat.groupAdmin,
            'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
          ),
        );
        // }
      }
    });
    //save to messages with a status of sent, not sent, delivered, seen
    socket
      .off('pending message')
      .on('pending message', (newMessage, pending) => {
        //send the messages that has status of pending by chat id
        console.log('saved pending message');
        for (let i = 0; i < pending.length; i++) {
          if (newMessage.isGroupChat === 0) {
            //console.log(pending[i].username);
            savePendingMessages(
              newMessage.message.content,
              newMessage.message.sender,
              true,
              currentUser.username,
              newMessage.message.createdAt,
              pending[i].userId,
            ).then(() => {
              //getData('pending_message').then(res => console.log(res));
            });
          } else {
            savePendingMessages(
              newMessage.message.content,
              newMessage.message.sender,
              true,
              newMessage.chatName,
              newMessage.message.createdAt,
              pending[i].userId,
            );
          }
        }
      });

    socket.off('call terminated').on('call terminated', handleCallTerminated);

    socket
      .off('group call terminated')
      .on('group call terminated', handleGroupCallTerminated);

    //call
    socket.off('incoming call').on('incoming call', incomingCall);
    socket.off('joined').on('joined', handleRoomJoined);
    // Events that are webRTC specific
    socket.off('offer').on('offer', handleReceivedOffer); //other user

    socket.on('ice-candidate', handlerNewIceCandidateMsg);
    socket.off('end call').on('end call', onHostLeave);
    socket
      .off('pending missed video call')
      .on('pending missed video call', handleMissedVideoCall);

    //voice call
    socket
      .off('incoming voice call')
      .on('incoming voice call', incomingVoiceCall);
    socket.off('joined voice call').on('joined voice call', handleRoomJoinedVC);
    socket
      .off('offer voice call')
      .on('offer voice call', handleReceivedOfferVC); //other user
    socket
      .off('pending missed voice call')
      .on('pending missed voice call', handleMissedVoiceCall);

    //group voice call
    socket
      .off('incoming group voice call')
      .on('incoming group voice call', incomingGroupVCCall);
    socket
      .off('group voice call joined')
      .on('group voice call joined', handleGroupVCCallJoined);
    socket
      .off('ready group voice call')
      .on('ready group voice call', initiateOfferVC);
    socket
      .off('offer group voice call')
      .on('offer group voice call', handleReceivedGroupVCCallOffer);
    socket
      .off('participant joined')
      .on('participant joined', handleParticipantJoined);
    socket.off('end group call').on('end group call', handlePeerLeft);
    socket
      .off('pending missed group voice call')
      .on('pending missed group voice call', handleMissedGroupVoiceCall);

    //group call
    socket
      .off('incoming group call')
      .on('incoming group call', incomingGroupCall);
    socket
      .off('gc participant joined')
      .on('gc participant joined', handleGcParticipantJoined);
    socket
      .off('group call joined')
      .on('group call joined', handleGroupCallJoined);
    socket.off('call initiated').on('ready initiated', handleReadyInitiated);
    socket.off('ready group call').on('ready group call', initiateOffer);
    socket
      .off('offer group call')
      .on('offer group call', handleReceivedGroupCallOffer);
    socket.on('ice-candidate group call', handlerGroupNewIceCandidateMsg);
    socket.off('answer group call').on('answer group call', handleGroupAnswer);
    socket
      .off('leave group call')
      .on('leave group call', handleOnGroupPeerLeave);
    socket
      .off('pending missed group video call')
      .on('pending missed group video call', handleMissedGroupVideoCall);
  }, []);

  //TODO: handle camera and audio permissions

  const handleReadyInitiated = () => {
    ready.current = true;
  };

  const handleParticipantJoined = users => {
    setVcParticipants(users);
  };

  const handleGcParticipantJoined = users => {
    setGroupCallParticipants(users);
  };

  const handleMissedVideoCall = (user, otherUserId) => {
    insertIntoPendingCall(
      user.username,
      'video',
      'Missed',
      user.avatar,
      currentUser._id,
      otherUserId,
    );
  };

  const handleMissedVoiceCall = (user, otherUserId) => {
    insertIntoPendingCall(
      user.username,
      'audio',
      'Missed',
      user.avatar,
      currentUser._id,
      otherUserId,
    );
  };

  const handleMissedGroupVideoCall = (info, otherUserId) => {
    insertIntoPendingCall(
      info.chatName,
      'video',
      'Missed',
      info.groupAvatar,
      currentUser._id,
      otherUserId,
    );
  };

  const handleMissedGroupVoiceCall = (info, otherUserId) => {
    insertIntoPendingCall(
      info.chatName,
      'audio',
      'Missed',
      info.groupAvatar,
      currentUser._id,
      otherUserId,
    );
  };

  const createGroupPeerConnection = async (roomName, FromUser, readyUser) => {
    console.log('createGroupPeerConnection (peer)', currentUser.username);
    let peerConnection = new RTCPeerConnection(peerConstraints);
    peerConnection.addEventListener('connectionstatechange', event => {
      console.log(
        'connectionstatechange',
        event,
        peerConnection.connectionState,
        'to',
        FromUser,
        `(${currentUser.username})`,
      );
      switch (peerConnection.connectionState) {
        case 'closed':
          // You can handle the call being disconnected here.
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
      //console.log(readyUser, FromUser, `(${currentUser.username})`);
      socket.emit(
        'ice-candidate group call',
        event.candidate,
        roomName,
        currentUser.username,
        readyUser,
      );
    });
    peerConnection.addEventListener('icecandidateerror', event => {
      console.log('icecandidateerror', event, currentUser.username);
      // You can ignore some candidate errors.
      // Connections can still be made even when errors occur.
    });
    peerConnection.addEventListener('iceconnectionstatechange', event => {
      if (peerConnection?.iceConnectionState) {
        console.log(
          'iceconnectionstatechange',
          event,
          peerConnection.iceConnectionState,
          currentUser.username,
        );
        switch (peerConnection.iceConnectionState) {
          case 'connected':
            console.log(
              'ice state connected to',
              FromUser,
              `(${currentUser.username})`,
            );
            break;
          case 'completed':
            console.log(
              'ice state completed',
              FromUser,
              `(${currentUser.username})`,
            );
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
        currentUser.username,
      );
    });
    peerConnection.addEventListener('negotiationneeded', event => {
      console.log('negotiationneeded', event, currentUser.username);
      // You can start the offer stages here.
      // Be careful as this event can be called multiple times.
    });
    peerConnection.addEventListener('signalingstatechange', event => {
      console.log(
        'signalingstatechange',
        event,
        peerConnection.signalingState,
        'from',
        FromUser,
        `(${currentUser.username})`,
      );
      switch (peerConnection.signalingState) {
        case 'closed':
          // You can handle the call being disconnected here.
          console.log('call closed');
          break;
      }
    });
    peerConnection.addEventListener('track', event => {
      console.log('handle Group track event', currentUser.username);
      try {
        for (let s of event.streams[0]._tracks) {
          if (s.kind === 'video') {
            setStreams(streams => [
              ...streams,
              {stream: event.streams[0].toURL(), user: FromUser},
            ]);
            streamURLs.current.push({
              stream: event.streams[0].toURL(),
              user: FromUser,
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
    peerConnection.addEventListener('removetrack', event => {
      console.log('removestream', event, currentUser.username);
    });
    //add all tracks now that the error is resolved
    //two tracks are being added
    try {
      userStreamRef.current.getTracks().forEach(track => {
        //if (Object.keys(track._constraints).length !== 0) {
        peerConnection.addTrack(track, userStreamRef.current);
        //}
      });
    } catch (err) {
      console.log(err, currentUser.username);
    }
    return peerConnection;
  };

  const initiateOffer = async (roomName, userThatsReady, caller, readyUser) => {
    try {
      if (currentUser.username !== caller) {
        //if (!ready.current) {
        console.log(
          'initiateOffer for',
          userThatsReady,
          `(${currentUser.username})`,
        );
        let present_already = false;
        for (let p of peersRef.current) {
          if (p.user === userThatsReady) {
            present_already = true;
          }
        }
        if (present_already === false) {
          RoomName.current = roomName;
          let peerConnection = await createGroupPeerConnection(
            roomName,
            userThatsReady,
            readyUser,
          );
          peerConnection
            .createOffer(sessionConstraints)
            .then(offer => {
              peerConnection
                .setLocalDescription(offer)
                .then(() => {
                  //send offer from
                  socket.emit(
                    'offer group call',
                    offer,
                    roomName,
                    currentUser.username,
                    caller,
                    readyUser,
                    currentUser,
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
        } else {
          //if present check LD and if LD is null set LD
        }
        //}
      }
    } catch (error) {
      console.log(error);
    }
  };

  const incomingGroupCall = (roomName, info, caller) => {
    try {
      console.log('incomingGroupCall home (peer)', currentUser.username);
      callNotification(info.chatName);
      if (AppState.currentState !== 'active') {
        const yourObject = {route: 'Home'};

        invokeApp({
          data: yourObject,
        });
      }
      dispatch(addCall(info.chatName, 'video', 'Incoming', info.groupAvatar));
      RoomName.current = roomName;
      setGroupInfo(info);
      groupInfoRef.current = info;
      setCaller(caller);
      CALLER.current = caller;
      const id = uuid.v4();
      setCurrentCallId(id);
      if (RoomName.current && groupInfoRef.current) {
        setGroupCall(true);
        RNCallKeep.displayIncomingCall(id, info.chatName, info.chatName);
        InCallManager.startRingtone('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroupCallJoined = (roomName, caller) => {
    try {
      console.log('handleGroupCallJoined (peer)', currentUser.username);
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
          // console.log(userStreamRef.current, currentUser.username);
          // setLocalStream(mediaStream); //state update error
          // setLocalMediaStream(localMediaStream.toURL());
          // socket.emit('ready', roomName);
          for (let s of mediaStream._tracks) {
            if (s.kind === 'video') {
              setStreams(streams => [
                ...streams,
                {stream: mediaStream.toURL(), user: currentUser.username},
              ]);
              streamURLs.current.push({
                stream: mediaStream.toURL(),
                user: currentUser.username,
              });
            }
          }
          setTimeout(() => {
            socket.emit(
              'ready group call',
              roomName,
              currentUser.username,
              caller,
              currentUser,
            );
          }, 3000);
        });
      } catch (err) {
        console.log(err);
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
      //if (ready.current) {
      let present_already = false;
      for (let p of peersRef.current) {
        if (p.user === FromUser) {
          present_already = true;
        }
      }
      if (present_already === false) {
        console.log(
          `handleReceivedGroupCallOffer for ${FromUser}`,
          `(${currentUser.username})`,
        );
        RoomName.current = roomName;
        let peerConnection = await createGroupPeerConnection(
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
                    //console.log(peerConnection._pcId, currentUser.username);
                    socket.emit(
                      'answer group call',
                      answer,
                      roomName,
                      currentUser.username,
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
      //}
      // else {
      //   const pc = peersRef.current.find(p => p.user === FromUser);
      //   console.log(pc, 'pc');
      //   const offerDescription = new RTCSessionDescription(offer);
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
      //                 currentUser.username,
      //                 caller,
      //               );
      //             })
      //             .catch(e => {
      //               console.log(e, 'setLocalDescription');
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

  const handleGroupCallTerminated = () => {
    notifee.cancelNotification('call');
    InCallManager.stopRingtone();
    RNCallKeep.endAllCalls();
    RoomName.current = null;
    setGroupInfo(null);
    groupInfoRef.current = null;
    setCaller(null);
    CALLER.current = null;
    setCurrentCallId(null);
    setGroupVoiceCall(false);
    setGroupCall(false);
  };

  const incomingGroupVCCall = (roomName, info, caller) => {
    try {
      console.log('incomingGroupVCCall home (peer)', currentUser.username);
      callNotification(info.chatName);
      if (AppState.currentState !== 'active') {
        const yourObject = {route: 'Home'};

        invokeApp({
          data: yourObject,
        });
      }
      dispatch(addCall(info.chatName, 'audio', 'Incoming', info.groupAvatar));
      RoomName.current = roomName;
      setGroupInfo(info);
      groupInfoRef.current = info;
      setCaller(caller);
      CALLER.current = caller;
      const id = uuid.v4();
      setCurrentCallId(id);
      if (RoomName.current && groupInfoRef.current) {
        setGroupVoiceCall(true);
        RNCallKeep.displayIncomingCall(id, info.chatName, info.chatName);
        InCallManager.startRingtone('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroupVCCallJoined = (roomName, caller) => {
    try {
      console.log('handleGroupVCCallJoined (peer)', currentUser.username);
      try {
        mediaDevices
          .getUserMedia({
            audio: true,
            video: false,
          })
          .then(mediaStream => {
            userStreamRef.current = mediaStream;
            setStreams(streams => [
              ...streams,
              {stream: mediaStream.toURL(), user: currentUser.username},
            ]);
            setTimeout(() => {
              socket.emit(
                'ready group voice call',
                roomName,
                currentUser.username,
                caller,
                currentUser,
              );
            }, 3000);
          });
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initiateOfferVC = async (
    roomName,
    userThatsReady,
    caller,
    readyUser,
  ) => {
    try {
      if (currentUser.username !== caller) {
        //if (!ready.current) {
        console.log(
          'initiateOfferVC for',
          userThatsReady,
          `(${currentUser.username})`,
        );
        let present_already = false;
        for (let p of peersRef.current) {
          if (p.user === userThatsReady) {
            present_already = true;
          }
        }
        if (present_already === false) {
          let peerConnection = await createGroupPeerConnection(
            roomName,
            userThatsReady,
            readyUser,
          );
          peerConnection
            .createOffer({
              mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: false,
                VoiceActivityDetection: true,
              },
            })
            .then(offer => {
              peerConnection
                .setLocalDescription(offer)
                .then(() => {
                  //send offer from
                  socket.emit(
                    'offer group voice call',
                    offer,
                    roomName,
                    currentUser.username,
                    caller,
                    readyUser,
                    currentUser,
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
        } else {
          //if present check LD and if LD is null set LD
        }
        //}
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReceivedGroupVCCallOffer = async (
    offer,
    roomName,
    FromUser,
    caller,
    offerTo,
  ) => {
    try {
      //if (ready.current) {
      let present_already = false;
      for (let p of peersRef.current) {
        if (p.user === FromUser) {
          present_already = true;
        }
      }
      if (present_already === false) {
        console.log(
          `handleReceivedGroupVCCallOffer for ${FromUser}`,
          `(${currentUser.username})`,
        );
        let peerConnection = await createGroupPeerConnection(
          roomName,
          FromUser,
          offerTo,
        );
        const offerDescription = new RTCSessionDescription(offer);
        peerConnection
          .setRemoteDescription(offerDescription)
          .then(() => {
            peerConnection
              .createAnswer({
                mandatory: {
                  OfferToReceiveAudio: true,
                  OfferToReceiveVideo: false,
                  VoiceActivityDetection: true,
                },
              })
              .then(answer => {
                peerConnection
                  .setLocalDescription(answer)
                  .then(() => {
                    //console.log(peerConnection._pcId, currentUser.username);
                    socket.emit(
                      'answer group call',
                      answer,
                      roomName,
                      currentUser.username,
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
      //}
    } catch (error) {
      console.log(error);
    }
  };

  const handleCallTerminated = () => {
    notifee.cancelNotification('call'); // need to set id in state variable
    RNCallKeep.endAllCalls();
    InCallManager.stopRingtone();
    CALLER.current = null;
    RoomName.current = null;
    setCall(false);
    setVoiceCall(false);
    setCaller(null);
    setCurrentCallId(null);
  };

  const incomingCall = (roomName, caller) => {
    console.log('incomingCall home (peer)');
    callNotification(caller.username);
    if (AppState.currentState !== 'active') {
      const yourObject = {route: 'Home'};

      invokeApp({
        data: yourObject,
      });
    }
    dispatch(addCall(caller.username, 'video', 'Incoming', caller.avatar));
    CALLER.current = caller;
    RoomName.current = roomName; //
    const id = uuid.v4();
    setCurrentCallId(id);
    if (RoomName.current && CALLER.current) {
      try {
        setCall(true); //
        setCaller(CALLER.current);
        RNCallKeep.displayIncomingCall(id, caller.username, caller.username);
        InCallManager.startRingtone('');
      } catch (error) {
        console.log(error);
      }
    }
    //setAccept(true);
    //socket.emit('join video call', roomName, currentUser, caller);
  };

  const incomingVoiceCall = (roomName, caller) => {
    console.log('incomingVoiceCall home (peer)');
    callNotification(caller.username);
    if (AppState.currentState !== 'active') {
      const yourObject = {route: 'Home'};

      invokeApp({
        data: yourObject,
      });
    }
    dispatch(addCall(caller.username, 'audio', 'Incoming', caller.avatar));
    RoomName.current = roomName;
    CALLER.current = caller;
    const id = uuid.v4();
    setCurrentCallId(id);
    if (RoomName.current && CALLER.current) {
      try {
        setCaller(CALLER.current);
        setVoiceCall(true);
        RNCallKeep.displayIncomingCall(id, caller.username, caller.username);
        InCallManager.startRingtone('');
      } catch (error) {
        console.log(error);
      }
    }
    //if accept
    // socket.emit('join voice call', roomName, currentUser, caller);
    // setVoiceCall(true);
    // setAccept(true);
  };

  const handleRoomJoinedVC = roomName => {
    console.log('handleRoomJoinedVC (peer)');
    try {
      mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then(mediaStream => {
          userStreamRef.current = mediaStream;
          socket.emit('ready voice call', roomName);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleReceivedOfferVC = async (offer, roomName) => {
    if (!pcRef.current) {
      console.log('handleReceivedOffer (peer)');
      pcRef.current = await createPeerConnection(roomName);
      //pcRef.current = peerConnection;
      const offerDescription = new RTCSessionDescription(offer);
      pcRef.current
        .setRemoteDescription(offerDescription)
        .then(() => {
          pcRef.current
            .createAnswer({
              mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: false,
                VoiceActivityDetection: true,
              },
            })
            .then(answer => {
              pcRef.current
                .setLocalDescription(answer)
                .then(() => {
                  //console.log(peerConnection._pcId, currentUser.username);
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
    //}
  };

  const handleRoomJoined = roomName => {
    console.log('handleRoomJoined (peer)');
    let localMediaStream;
    let isVoiceOnly = false;
    try {
      mediaDevices
        .getUserMedia({
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
        })
        .then(mediaStream => {
          if (isVoiceOnly) {
            let videoTrack = mediaStream.getVideoTracks()[0];
            videoTrack.enabled = false;
          }
          localMediaStream = mediaStream;
          userStreamRef.current = mediaStream;
          // mediaStream.getTracks().forEach(track => {
          //   peerConnection.addTrack(track, mediaStream);
          // });
          for (let s of mediaStream._tracks) {
            if (s.kind === 'video') {
              setLocalStream(mediaStream); //state update error
              setLocalMediaStream(localMediaStream.toURL());
            }
          }
          // socket.emit('join video call', roomName, user);
          socket.emit('ready', roomName);
        });
    } catch (err) {
      console.log(err);
    }
  };

  //socket.id changes after ontrack
  const handleReceivedOffer = async (offer, roomName) => {
    // if (!hostRef.current) {
    if (!pcRef.current) {
      console.log('handleReceivedOffer (peer)');
      pcRef.current = await createPeerConnection(roomName);
      //pcRef.current = peerConnection;
      const offerDescription = new RTCSessionDescription(offer);
      pcRef.current
        .setRemoteDescription(offerDescription)
        .then(() => {
          pcRef.current
            .createAnswer(sessionConstraints)
            .then(answer => {
              pcRef.current
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
    //}
  };

  const handleICECandidateEvent = (event, roomName) => {
    console.log(
      'handleICECandidateEvent',
      currentUser.username,
      roomName,
      socket.id,
    );
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate, roomName);
    }
  };

  const handlerGroupNewIceCandidateMsg = (incoming, roomName, fromUser) => {
    // console.log(
    //   `handlerGroupNewIceCandidateMsg for ${fromUser}`,
    //   `(${currentUser.username})`,
    // );
    // We cast the incoming candidate to RTCIceCandidate
    try {
      const candidate = new RTCIceCandidate(incoming);
      //console.log(peersRef.current, currentUser.username);
      for (let p of peersRef.current) {
        //console.log(p, 'from', fromUser, 'in', currentUser.username);
        if (p.user === fromUser) {
          p.pc
            .addIceCandidate(candidate)
            .then(() => {
              //console.log('candidate added', currentUser.username);
            })
            .catch(e => {
              console.log(
                e,
                'error add ice-candidate',
                //p.pc,
                fromUser,
                `(${currentUser.username})`,
              );
            });
          //p.peerConnection.addIceCandidate(candidate);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleGroupAnswer = (answer, roomName, fromUser, caller) => {
    try {
      //other peers will have set the callee info by incoming call
      if (currentUser.username !== caller) {
        const answerDescription = new RTCSessionDescription(answer);
        for (let p of peersRef.current) {
          if (p.user === fromUser) {
            console.log(
              `handleAnswer for ${fromUser}`,
              `(${currentUser.username})`,
            );
            //console.log('inside handle answer if', p.pc);
            p.pc
              .setRemoteDescription(answerDescription)
              .then(() => {
                console.log(peersRef.current, currentUser.username);
                //console.log(peerConnections);
              })
              .catch(err =>
                console.log(
                  err,
                  'handle answer',
                  fromUser,
                  `(${currentUser.username})`,
                ),
              );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerNewIceCandidateMsg = incoming => {
    console.log('handlerNewIceCandidateMsg', currentUser.username);
    // We cast the incoming candidate to RTCIceCandidate
    try {
      const candidate = new RTCIceCandidate(incoming);
      pcRef.current.addIceCandidate(candidate).catch(e => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleGroupTrackEvent = event => {
    console.log('handle Group track event', currentUser.username);
    try {
      setStreams(streams => [...streams, event.streams[0].toURL()]);
    } catch (err) {
      console.log(err);
    }
    //console.log(peerConnection);
  };

  const handleTrackEvent = event => {
    console.log('handle track event (peer)');
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
    //console.log(peerConnection);
  };

  const onHostLeave = () => {
    console.log('onPeerLeave home');
    // This person is now the creator because they are the only person in the room.
    hostRef.current = true; //doubt
    //peerConnection.close();
    //peerConnection = null;
    setCall(false);
    setCaller(null);
    setAccept(false);
    setVoiceCall(false);
    pcRef.current.close();
    pcRef.current = null;
    RoomName.current = null;
    setRemoteMediaStream(null);
    setRemoteStream(null);
    setLocalStream(null);
    setLocalMediaStream(null);
    userStreamRef.current = null;
    setConnection('connecting...');
  };

  const handleOnGroupPeerLeave = user => {
    console.log(user.username, 'left Room');
    if (peersRef.current.length === 1) {
      userStreamRef.current = null;
      setAccept(false);
      RoomName.current = null;
      setGroupCall(false);
      setGroupInfo(null);
      groupInfoRef.current = null;
      setCaller(null);
      CALLER.current = null;
      for (let p of peersRef.current) {
        p.pc.close();
      }
      peersRef.current = [];
      setPeerConnections([]);
      setConnection('connecting...');
      ready.current = false;
      setStreams([]);
      streamURLs.current = [];
    }
    for (let p of peersRef.current) {
      if (p.user === user.username) {
        p.pc.close();
        const index = peersRef.current.findIndex(p => p.user === user.username);
        if (index !== -1) {
          peersRef.current.splice(index, 1);
          console.log(peersRef.current, currentUser.username);
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
  };

  //group voice call
  const handlePeerLeft = (user, participants) => {
    try {
      console.log(user.username, 'left Room');
      //for last person the peer connections are not disconnecting
      if (participants.length === 1) {
        userStreamRef.current = null;
        setAccept(false);
        RoomName.current = null;
        setCaller(null);
        CALLER.current = null;
        setGroupCall(false);
        setGroupInfo(null);
        groupInfoRef.current = null;
        setGroupVoiceCall(false);
        peersRef.current = [];
        setConnection('connecting...');
        setPeerConnections([]);
        ready.current = false;
        setStreams([]);
        setVcParticipants([]);
      }
      for (let p of peersRef.current) {
        if (p.user === user.username) {
          p.pc.close();
          const index = peersRef.current.findIndex(
            p => p.user === user.username,
          );
          if (index !== -1) {
            peersRef.current.splice(index, 1);
            console.log(peersRef.current, currentUser.username);
          }
        }
      }
      setVcParticipants(participants);
    } catch (err) {
      console.log(err);
    }
  };

  //end p2p video call
  const endCall = () => {
    console.log('leaveRoom');
    socket.emit('end call', RoomName.current); // Let's the server know that user has left the room.
    pcRef.current.close();
    pcRef.current = null;
    setCall(false);
    //setVoiceCall(false);
    setCaller(null);
    setAccept(false);
    RoomName.current = null;
    //peerConnection = null;
    setRemoteMediaStream(null);
    setRemoteStream(null);
    setLocalStream(null);
    setLocalMediaStream(null);
    userStreamRef.current = null;
    setConnection('connecting...');
  };

  //group voice call
  const endGroupCall = () => {
    socket.emit('end group call', RoomName.current, currentUser);
    userStreamRef.current = null;
    setAccept(false);
    RoomName.current = null;
    setCaller(null);
    CALLER.current = null;
    setGroupInfo(null);
    groupInfoRef.current = null;
    setGroupVoiceCall(false);
    for (let p of peersRef.current) {
      p.pc.close();
    }
    peersRef.current = [];
    setPeerConnections([]);
    setConnection('connecting...');
    ready.current = false;
    setStreams([]);
    setVcParticipants([]);
  };

  const endGroupVideoCall = () => {
    try {
      socket.emit('leave group call', RoomName.current, currentUser);
      userStreamRef.current = null;
      setAccept(false);
      RoomName.current = null;
      setCaller(null);
      CALLER.current = null;
      setGroupInfo(null);
      groupInfoRef.current = null;
      setGroupCall(false);
      setConnection('connecting...');
      for (let p of peersRef.current) {
        p.pc.close();
      }
      peersRef.current = [];
      setPeerConnections([]);
      ready.current = false;
      setStreams([]);
      streamURLs.current = [];
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfTableExists('call').then(res => {
      if (res === true) {
        dispatch(fetchCalls());
      }
    });

    dispatch(fetchParticipants())
      .then(() => {
        dispatch(fetchChats()).then(() => {
          // const sevenDaysAgo = new Date(
          //   Date.now() - 5 * 24 * 60 * 60 * 1000,
          // );
          delete5daysAgoMessages();
          dispatch(getAllMessages());
        });
      })
      .catch(err => console.log(err));
  }, []);

  //dropTable('call');

  // useEffect(() => {
  //   // getData('user').then(res => console.log(res));
  //   // getData('chat').then(res => console.log(res));
  //   // getData('participants').then(res => console.log(res));
  //   // dropTable('participants');
  //   // truncateTable('chat');
  //   // truncateTable('message');
  //   // dropTable('chat');
  //   // dropTable('message');
  //   // createUserTable();
  //   // createChatTable();
  //   // createParticipantsTable();
  //   // createMessageTable();
  // }, []);

  const loadChats = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(fetchChats());
    } catch (err) {
      setError(err);
    }
    setIsRefreshing(false);
  }, [dispatch, error]);

  const loadCalls = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(fetchCalls());
    } catch (err) {
      setError(err);
    }
    setIsRefreshing(false);
  }, [dispatch, error]);

  const getUnreadMessagesCount = id => {
    if (newMessages.length !== 0) {
      for (let m of newMessages) {
        if (m.chat_id === id) {
          return m.newMsgs;
        }
      }
    } else return null;
  };

  const getLatestMessageContent = id => {
    for (let m of messages) {
      if (m.id === id) {
        return m.content;
      }
    }
  };

  const getLatestMessageTime = id => {
    for (let m of messages) {
      if (m.id === id) {
        return m.createdAt;
      }
    }
  };

  const totalUnreadCount = () => {
    let total = 0;
    if (newMessages.length !== 0) {
      for (let m of newMessages) {
        total = total + m.newMsgs;
      }
    }
    return total;
  };

  let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true,
    },
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

  const endVC = () => {
    try {
      socket.emit('end call', RoomName.current); // Let's the server know that user has left the room.
      pcRef.current.close();
      pcRef.current = null;
      setVoiceCall(false);
      setCaller(null);
      setAccept(false);
      //peerConnection = null;
      userStreamRef.current = null;
      setReject(true);
      RoomName.current = null;
      CALLER.current = null;
      setCurrentCallId(null);
      setConnection('connecting...');
    } catch (error) {
      console.log(error);
    }
  };

  // p2p voice call
  if (voiceCall && caller) {
    return (
      <ImageBackground
        source={require('../../assets/images/avatars/GirlBackground.png')}
        style={{flex: 1}}
        blurRadius={5}>
        <View style={common.headerStyle}>
          {/* <Header
            iconColor={colors.WHITE}
            right={
              <TouchableOpacity>
                <AddUser />
              </TouchableOpacity>
            }
          /> */}
        </View>
        <View style={styles.body1}>
          <Image
            source={{uri: caller.avatar}}
            style={{width: 200, height: 200, borderRadius: 500}}
          />
          <View style={{marginTop: 10}}>
            <Text style={common.white_Bold_32}>{caller.username}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={common.white_Regular_18}>{connection}</Text>
          </View>
          {/* {accept && (
            <View style={{marginTop: 20}}>
              <Text style={common.white_Regular_18}>05:08 minutes</Text>
            </View>
          )} */}
        </View>
        {accept ? (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer}>
              <Speaker />
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
              onPress={endVC}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.iconContainer,
                {marginHorizontal: 20, backgroundColor: colors.WHITE},
              ]}
              onPress={() => onAnswerCallAction()}>
              <AcceptCall />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEndCallAction()}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }

  //change into flatList
  if (groupVoiceCall && groupInfo) {
    return (
      <ImageBackground
        source={require('../../assets/images/Groupchat/background.png')}
        style={{flex: 1, marginTop: StatusBar.currentHeight}}
        blurRadius={5}>
        {accept ? (
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
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: 200, height: 200, borderRadius: 500}}
              resizeMode="cover"
              source={{uri: groupInfo.groupAvatar}}
            />
            <View style={{marginTop: 10}}>
              <Text style={common.white_Bold_32}>{groupInfo?.chatName}</Text>
            </View>
          </View>
        )}
        {accept ? (
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
              onPress={() => endGroupCall()}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.iconContainer,
                {marginHorizontal: 20, backgroundColor: colors.WHITE},
              ]}
              onPress={() => onAnswerCallAction()}>
              <AcceptCall />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEndCallAction()}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }

  if (groupCall && groupInfo) {
    return (
      <ImageBackground
        source={require('../../assets/images/avatars/GirlBackground.png')}
        style={{flex: 1, marginTop: StatusBar.currentHeight}}
        blurRadius={5}>
        {accept ? (
          <FlatList
            data={streams}
            keyExtractor={item => item}
            numColumns={2}
            renderItem={({item}) => (
              <RTCView
                style={{
                  height: Dimensions.get('screen').height / 2,
                  width: 200,
                }}
                mirror={true}
                objectFit={'cover'}
                streamURL={item.stream}
                zOrder={0}
              />
            )}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginVertical: 20}}>
              <Text style={common.white_Regular_18}>Video Call</Text>
            </View>
            <Image
              style={{width: 200, height: 200, borderRadius: 500}}
              resizeMode="cover"
              source={{uri: groupInfo.groupAvatar}}
            />
            <View style={{marginTop: 10}}>
              <Text style={common.white_Bold_32}>{groupInfo?.chatName}</Text>
            </View>
          </View>
        )}
        {accept ? (
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
              onPress={toggleCamera}
              style={[styles.iconContainer, {marginLeft: 20}]}>
              {cameraActive ? (
                <Video />
              ) : (
                <FontAwesome5
                  name="video-slash"
                  size={20}
                  color={colors.WHITE}
                />
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
              onPress={endGroupVideoCall}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.iconContainer,
                {marginHorizontal: 20, backgroundColor: colors.WHITE},
              ]}
              onPress={() => onAnswerCallAction()}>
              <AcceptCall />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEndCallAction()}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }

  if (call && caller) {
    return (
      <View
        source={require('../../assets/images/avatars/GirlBackground.png')}
        style={{flex: 1}}>
        <StatusBar backgroundColor={'blue'} />
        {remoteMediaStream ? (
          <RTCView
            style={styles.video}
            mirror={true}
            objectFit={'cover'}
            streamURL={remoteMediaStream}
            zOrder={0}
          />
        ) : (
          <ImageBackground
            source={require('../../assets/images/avatars/GirlBackground.png')}
            style={styles.video}
            blurRadius={5}
          />
        )}
        {/* <View style={common.headerStyle}>
          <Header
            iconColor={colors.WHITE}
            noLeft
            right={
              <TouchableOpacity>
                <AddUser />
              </TouchableOpacity>
            }
            onPressLeft={() => leaveRoom()}
          />
        </View> */}
        {accept ? (
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
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginVertical: 20}}>
              <Text style={common.white_Regular_18}>Video Call</Text>
            </View>
            <Image
              source={{uri: caller?.avatar}}
              style={{width: 200, height: 200, borderRadius: 500}}
              resizeMode="cover"
            />
            <View style={{marginTop: 10}}>
              <Text style={common.white_Bold_32}>{caller?.username}</Text>
            </View>
            {/* <View style={{marginTop: 20}}>
              <Text style={common.white_Regular_18}>05:08 minutes</Text>
            </View> */}
          </View>
        )}
        {accept ? (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer}>
              <Speaker />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleCamera}
              style={[styles.iconContainer, {marginLeft: 20}]}>
              {cameraActive ? (
                <Video />
              ) : (
                <FontAwesome5
                  name="video-slash"
                  size={20}
                  color={colors.WHITE}
                />
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
              onPress={() => endCall()}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.iconContainer,
                {marginHorizontal: 20, backgroundColor: colors.WHITE},
              ]}
              onPress={() => onAnswerCallAction()}>
              <AcceptCall />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEndCallAction()}
              style={[styles.iconContainer, {backgroundColor: colors.endCall}]}>
              <MissedCall />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const ChatsRoute = () => (
    <View
      style={
        colorMode === 'Dark' ? styles.container_dark : styles.container_light
      }>
      {chats.length === 0 ? (
        <View style={common.subContainer}>
          <View style={{alignItems: 'center', width: '100%'}}>
            <Image
              source={require('../../assets/images/onboarding/Group.png')}
              style={{width: 250, height: 250}}
            />
            <View style={{marginTop: 30}}>
              <Text style={common.p500_Bold_36}>Welcome! 👋</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text
                style={[
                  colorMode === 'Dark'
                    ? common.white_Medium_18
                    : common.black_Medium_18,
                  {textAlign: 'center'},
                ]}>
                Enciphers connects you with family and friends. Start chatting
                now!
              </Text>
            </View>
            <View style={{marginTop: 30, width: '100%'}}>
              <Button
                title={'Start New Chat'}
                onPress={() => navigation.navigate('SelectContacts')}
              />
            </View>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            style={{marginTop: 10, paddingHorizontal: 20}}
            ListFooterComponent={() => <View style={{height: 20}} />}
            // ListHeaderComponent={() => (
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate('Archived')}
            //     style={styles.archiveContainer}>
            //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
            //       <View style={styles.circle}>
            //         <Ionicons
            //           name="ios-download"
            //           color={colors.WHITE}
            //           size={20}
            //         />
            //       </View>
            //       <View style={{marginLeft: 20}}>
            //         <Text
            //           style={
            //             colorMode === 'Dark'
            //               ? common.white_Bold_18
            //               : common.black_Bold_18
            //           }>
            //           Archived
            //         </Text>
            //       </View>
            //     </View>
            //     <View style={styles.rectangle}>
            //       <Text style={common.white_Bold_10}>278</Text>
            //     </View>
            //   </TouchableOpacity>
            // )}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={loadChats} />
            }
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              var chatName, chatImage, otherUser;
              if (item.isGroupChat === 0) {
                for (let i of item.users) {
                  if (i.username !== currentUser.username) {
                    chatName = i.username;
                    chatImage = i.avatar;
                  }
                }
              } else {
                chatImage = item.groupAvatar;
                chatName = item.chatName;
              }
              // if (item.isGroupChat === false) {
              //   for (let i = 0; i < item.users.length; i++) {
              //     if (item.users[i]._id === currentUser._id) {
              //     } else {
              //       otherUser = item.users[i];
              //       chatName = item.users[i].username;
              //       chatImage = item.users[i].avatar;
              //     }
              //   }
              // } else {
              //   chatName = item.chatName;
              //   chatImage = item.groupAvatar;
              // }
              //chatImage = item.groupAvatar;
              return (
                <ChatCard
                  name={chatName}
                  image={chatImage}
                  noNum={getUnreadMessagesCount(item.id)}
                  desc={getLatestMessageContent(item.latestMessage)}
                  time={getLatestMessageTime(item.latestMessage)}
                  indicator
                  tickIndicator={selected.length !== 0}
                  onPress={() => {
                    setSelected([]);
                    const id = item.participants;
                    if (item.isGroupChat === 1) {
                      getParticipants('participants', 'unique_id', id).then(
                        res => {
                          navigation.navigate('GroupChat', {
                            users: res,
                            chatId: item.id,
                            chatInfo: item,
                          });
                        },
                      );
                    } else {
                      getParticipants('participants', 'unique_id', id).then(
                        res => {
                          for (let i = 0; i < res.length; i++) {
                            if (res[i].userId !== currentUser._id) {
                              otherUser = res[i];
                            }
                          }
                          navigation.navigate('Chat', {
                            user: otherUser,
                            chatId: item.id,
                            chatInfo: item,
                          });
                        },
                      );
                    }
                  }}
                  onLongPress={() =>
                    setSelected(array => setSelected([...array, 1]))
                  }
                />
              );
            }}
          />
          <View style={styles.footer1}>
            {/* <View style={{alignItems: 'flex-end', flex: 1, marginRight: 20}}> */}
            <TouchableOpacity
              style={styles.messageContainer}
              onPress={() => navigation.navigate('SelectContacts')}>
              <Ionicons
                name="chatbubble-ellipses-sharp"
                color={colors.WHITE}
                size={25}
              />
            </TouchableOpacity>
            {/* </View> */}
          </View>
        </>
      )}
    </View>
  );

  // const StatusRoute = () => (
  //   <View
  //     style={
  //       colorMode === 'Dark' ? styles.container_dark : styles.container_light
  //     }>
  //     <View style={{marginTop: 20, paddingHorizontal: 20}}>
  //       <TouchableOpacity
  //         style={common.row}
  //         onPress={() => navigation.navigate('AddStatus')}>
  //         <View>
  //           <Image source={require('../../assets/images/chat/Boy.png')} />
  //           <View style={styles.indicator_tick}>
  //             <Feather
  //               size={10}
  //               name="plus"
  //               color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
  //             />
  //           </View>
  //         </View>
  //         <View style={{marginLeft: 20}}>
  //           <Text
  //             style={
  //               colorMode === 'Dark'
  //                 ? common.white_Bold_18
  //                 : common.black_Bold_18
  //             }>
  //             My Status
  //           </Text>
  //           <Text
  //             style={
  //               colorMode === 'Dark'
  //                 ? common.white_Medium_14
  //                 : common.black_Medium_14
  //             }>
  //             Tap to add status updates
  //           </Text>
  //         </View>
  //       </TouchableOpacity>
  //       <View style={{marginTop: 20}}>
  //         <Text
  //           style={
  //             colorMode === 'Dark'
  //               ? common.white_Medium_16
  //               : common.black_Medium_16
  //           }>
  //           Recent updates
  //         </Text>
  //       </View>
  //       <View style={{marginTop: 20}}>
  //         <TouchableOpacity
  //           style={common.row}
  //           onPress={() => navigation.navigate('ViewStatus')}>
  //           <View style={styles.imageContainer}>
  //             <Image source={require('../../assets/images/chat/Ellipse.png')} />
  //           </View>
  //           <View style={{marginLeft: 20}}>
  //             <Text
  //               style={
  //                 colorMode === 'Dark'
  //                   ? common.white_Bold_18
  //                   : common.black_Bold_18
  //               }>
  //               Marielle Wigington
  //             </Text>
  //             <Text
  //               style={
  //                 colorMode === 'Dark'
  //                   ? common.white_Medium_14
  //                   : common.black_Medium_14
  //               }>
  //               10 minutes ago
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //       <View style={{marginTop: 20}}>
  //         <Text
  //           style={
  //             colorMode === 'Dark'
  //               ? common.white_Medium_16
  //               : common.black_Medium_16
  //           }>
  //           Viewed updates
  //         </Text>
  //       </View>
  //       <View style={{marginTop: 20}}>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate('ViewStatus')}
  //           style={common.row}>
  //           <View
  //             style={[
  //               styles.imageContainer,
  //               {
  //                 borderColor:
  //                   colorMode === 'Dark' ? colors.WHITE : colors.GRAY_300,
  //               },
  //             ]}>
  //             <Image source={require('../../assets/images/chat/Girl.png')} />
  //           </View>
  //           <View style={{marginLeft: 20}}>
  //             <Text
  //               style={
  //                 colorMode === 'Dark'
  //                   ? common.white_Bold_18
  //                   : common.black_Bold_18
  //               }>
  //               Darron Kulikowski
  //             </Text>
  //             <Text
  //               style={
  //                 colorMode === 'Dark'
  //                   ? common.white_Medium_14
  //                   : common.black_Medium_14
  //               }>
  //               Today 16:38
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //       <View style={{marginTop: 20}}>
  //         <Text
  //           style={
  //             colorMode === 'Dark'
  //               ? common.white_Medium_16
  //               : common.black_Medium_16
  //           }>
  //           Muted updates
  //         </Text>
  //       </View>
  //       <View style={{marginTop: 20}}>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate('ViewStatus')}
  //           style={common.row}>
  //           <View>
  //             <Image source={require('../../assets/images/chat/Boy1.png')} />
  //           </View>
  //           <View style={{marginLeft: 20}}>
  //             <Text
  //               style={
  //                 colorMode === 'Dark'
  //                   ? common.white_Bold_18
  //                   : common.black_Bold_18
  //               }>
  //               Benny Spanbauer
  //             </Text>
  //             <Text
  //               style={
  //                 colorMode === 'Dark'
  //                   ? common.white_Medium_14
  //                   : common.black_Medium_14
  //               }>
  //               30 minutes ago
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //     <View style={styles.footer}>
  //       <TouchableOpacity style={styles.messageContainer}>
  //         <EditWhite />
  //       </TouchableOpacity>
  //       <View style={{marginTop: 20}} />
  //       <TouchableOpacity style={styles.messageContainer}>
  //         <Camera fill="#fff" />
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  const CallsRoute = () => (
    <View
      style={
        colorMode === 'Dark' ? styles.container_dark : styles.container_light
      }>
      {calls.length === 0 ? (
        <View style={styles.subContainer}>
          {colorMode === 'Dark' ? (
            <Image
              source={require('../../assets/images/calls/CallBGDark.png')}
            />
          ) : (
            <Image
              source={require('../../assets/images/calls/CallBGLight.png')}
            />
          )}
          <View style={{marginTop: 20}}>
            <Text style={common.p500_Bold_36}>You haven't call yet</Text>
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={[
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18,
                {textAlign: 'center'},
              ]}>
              Call together with your friends and family with Enciphers right
              now!
            </Text>
          </View>
          <View style={{marginTop: 30, width: '100%'}}>
            <Button title={'Start New Call'} />
          </View>
        </View>
      ) : (
        <FlatList
          data={calls}
          style={{marginTop: 10, paddingHorizontal: 20}}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={loadCalls} />
          }
          keyExtractor={item => item.id}
          ListFooterComponent={() => <View style={{height: 20}} />}
          //inverted={true}
          renderItem={({item}) => (
            <CallContainer
              image={item.avatar}
              status={item.status}
              title={item.chatName}
              des={`${item.status} | ${moment(item.createdAt).format(
                'dddd hh:mm a',
              )}`}
              type={item.type}
              // onPressVideo={() => navigation.navigate('VideoCall')}
              // onPress={() => navigation.navigate('CallInfo')}
            />
          )}
        />
      )}
      <View style={styles.footer1}>
        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => navigation.navigate('SelectContacts')}>
          <CallWhiteFill />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    chats: ChatsRoute,
    //status: StatusRoute,
    calls: CallsRoute,
  });
  return (
    <Pressable onPress={() => setOptions(false)} style={common.container_dark}>
      <LinearGradient
        colors={[colors.Gradient1, colors.Gradient2]}
        style={styles.linearGradient}>
        <View style={styles.header}>
          {selected.length !== 0 ? (
            <View style={common.row}>
              <AntDesign
                name="arrowleft"
                color={colors.WHITE}
                size={26}
                style={{marginRight: 20}}
                onPress={() => navigation.goBack()}
              />
              <Text style={common.headerText}>{selected.length}</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Image
                  source={require('../../assets/images/logo/Smiley_White.png')}
                  style={{marginRight: 20}}
                />
              </TouchableOpacity>
              <Text style={common.headerText}>Enciphers</Text>
            </View>
          )}
          {selected.length !== 0 ? (
            <View style={common.row}>
              <TouchableOpacity style={{marginRight: 20}}>
                <Pin />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 20}}>
                <SoundOffFill />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 20}}>
                <DownloadFill />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOptions(prev => !prev)}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  color={colors.WHITE}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={{marginRight: 20}}>
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
          )}
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                height: 2.5,
                borderRadius: 20,
                backgroundColor: colors.WHITE,
              }}
              //   tabStyle={{
              //     width: 'auto',
              //     height: 52.0,
              //   }}
              style={{backgroundColor: colors.primary_500, width: '100%'}}
              renderLabel={({route, focused, color}) =>
                route.title === 'Chats' ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={
                        focused ? common.white_Bold_18 : common.white_Regular_18
                      }>
                      {route.title}
                    </Text>
                    {totalUnreadCount() !== 0 && (
                      <View
                        style={[
                          common.numContainer,
                          {backgroundColor: colors.WHITE, marginLeft: 10},
                        ]}>
                        <Text style={common.p500_Bold_10}>
                          {totalUnreadCount()}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text
                    style={
                      focused ? common.white_Bold_17 : common.white_Regular_18
                    }>
                    {route.title}
                  </Text>
                )
              }
            />
          )}
        />
      </LinearGradient>
      {options && (
        <Pressable
          style={
            colorMode === 'Dark'
              ? styles.optionContainer
              : styles.optionContainer_light
          }>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('NewGroup')}>
            {colorMode === 'Dark' ? <GroupWhite /> : <ContactsBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                New Group
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('NewBroadcast')}>
            {colorMode === 'Dark' ? (
              <SpeakerSmallWhite />
            ) : (
              <SpeakerSmallBlack />
            )}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                New Broadcast
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('LinkedDevices')}>
            {colorMode === 'Dark' ? <RefreshWhite /> : <RefreshBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Linked Devices
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('StarredMessages')}>
            {colorMode === 'Dark' ? <StarSmallWhite /> : <StarSmallBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Starred Messages
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('Settings')}>
            {colorMode === 'Dark' ? (
              <SettingsSmallWhite />
            ) : (
              <SettingsSmallBlack />
            )}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Settings
              </Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      )}
    </Pressable>
  );
};

export default Home;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: colors.primary_500,
  },
  container_dark: {flex: 1, backgroundColor: colors.DARK_1},
  container_light: {flex: 1, backgroundColor: colors.WHITE},
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  vcContainer: {
    height: Dimensions.get('screen').height / 2.2,
    width: 200,
    backgroundColor: colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveContainer: {
    height: 40,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  rectangle: {
    width: 37,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  footer1: {
    flex: 1,
    bottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    right: 20,
  },
  messageContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  indicator_tick: {
    top: 45,
    left: 45,
    width: 15,
    height: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: colors.primary_500,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  optionContainer: {
    width: 197,
    height: 268,
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
    width: 197,
    height: 268,
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
  body: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  body1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body2: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
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
});
