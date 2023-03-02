import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Bell,
  Close,
  CloseBlack,
  Danger,
  DangerBlack,
  DeleteBlack,
  DeleteIcon,
  Discovery,
  DiscoveryBlack,
  Download,
  DownloadBlack,
  Mic,
  NotificationBlack,
  Phone,
  Search,
  SearchBlack,
  SendWhite,
  Time,
  TimeBlack,
  Video,
  Wallpaper,
  WallpaperBlack,
} from '../../assets/icons/icons';
import {useDispatch, useSelector} from 'react-redux';
import InputTextContainer from '../../components/InputTextContainer';
import MessageContainer1 from '../../components/MessageContainer1';
import MessageContainer2 from '../../components/MessageContainer2';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioContainer from '../../components/AudioContainer';
import GroupMessageReceiver from '../../components/GroupMessageReceiver';
import {
  getMessages,
  OPEN_MESSAGE,
  receiveMessages,
  sendMessages,
} from '../../redux/actions/messageAction';
import {
  getChatsByName,
  getGroupChatsByName,
  savePendingMessages,
} from '../../local_db/SQLite';
import {socket} from '../../redux/reducers/socket';
import {StackActions} from '@react-navigation/native';
import {addCall} from '../../redux/actions/callAction';
import {newGroupChat} from '../../redux/actions/chatAction';
var selectedChatCompare;

const GroupChat = ({navigation, route}) => {
  const {users, chatId, chatInfo} = route.params;
  const [accessory, setAccessory] = useState(false);
  const [options, setOptions] = useState(false);
  const [textReply, setTextReply] = useState('');
  const [messages, setMessages] = useState([]);
  const colorMode = useSelector(state => state.color.color);
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [chatUsers, setChatUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [userTyping, setUserTyping] = useState();
  const newMessages = useSelector(state => state.message.newMessages);
  //const socket = useSelector(state => state.socket.socket);

  useEffect(() => {
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing group', () => setIsTyping(true));
    socket.on('stop typing group', () => setIsTyping(false));
    socket.on('pending message', (newMessage, pending) => {
      //send the messages that has status of pending by chat id
      for (let i = 0; i < pending.length; i++) {
        if (newMessage.isGroupChat === 0) {
          savePendingMessages(
            newMessage.message.content,
            newMessage.message.sender,
            true,
            currentUser.username,
            newMessage.message.createdAt,
            pending[i].userId,
          );
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
  }, []);

  useEffect(() => {
    setSelectedChat(chatInfo);
    socket.emit('join chat', chatId);
  }, []);

  useEffect(() => {
    dispatch(getMessages(chatId)).then(res => {
      if (res) setMessages(res);
    });
    if (newMessages.length !== 0) {
      let arr = [];
      for (let m of newMessages) {
        if (m.chat_id === chatId) {
        } else arr.push(m);
      }
      dispatch({type: OPEN_MESSAGE, newMessages: arr});
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId === currentUser._id) {
      } else chatUsers.push(users[i]);
    }
  }, []);

  useEffect(() => {
    socket
      .off('message received')
      .on('message received', newMessageReceived => {
        //console.log(newMessageReceived);
        if (newMessageReceived.isGroupChat === 1) {
          console.log(newMessageReceived);
          getGroupChatsByName(newMessageReceived.chatName, currentUser).then(
            res => {
              if (res === 'false') {
                console.log(res);
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
                );
              } else {
                dispatch(
                  receiveMessages(
                    newMessageReceived.message.content,
                    res.id,
                    newMessageReceived.message.sender,
                  ),
                ).then(res => {
                  setMessages([...messages, res]);
                  console.log('received');
                });
              }
            },
          );
        }
        // if (
        //   !selectedChatCompare || // if chat is not selected or doesn't match current chat
        //   selectedChatCompare._id !== newMessageReceived.chat._id
        // ) {
        //   // if (!notification.includes(newMessageReceived)) {
        //   //   setNotification([newMessageReceived, ...notification]);
        //   //   //setFetchAgain(!fetchAgain);
        //   // } //give notification
        // } else {
        //   setMessages([...messages, newMessageReceived]);
        // }
      });
  });

  const send = () => {
    socket.emit('stop typing group', chatId, currentUser);
    dispatch(sendMessages(textReply, chatId)).then(res => {
      const chat_obj = chatInfo;
      chatInfo.message = res;
      socket.emit('new message', chat_obj);
      setMessages([...messages, res]);
      console.log('sent');
    });
    setTextReply('');
  };

  useEffect(() => {
    socket.on('typing group', function (data) {
      setUserTyping(data);
      console.log(userTyping, ' userTyping');
    });
  });

  const typingHandler = e => {
    //console.log(e.nativeEvent.text);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing group', chatId, currentUser);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing group', chatId, currentUser);
        setTyping(false);
      }
    }, timerLength);
  };

  const getSenderName = id => {
    for (let i = 0; i < users.length; i++) {
      if (id === users[i].userId) return users[i].username;
    }
  };

  return (
    // <Pressable
    //   style={{flex: 1}}
    //   onPress={() => {
    //     setAccessory(false);
    //     setOptions(false);
    //   }}>
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={chatInfo.chatName}
        onPressTitle={() =>
          navigation.navigate('GroupDetails', {
            GroupInfo: chatInfo,
            AllParticipants: users,
            Participants: chatUsers,
          })
        }
        right={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => {
                dispatch(
                  addCall(
                    chatInfo.chatName,
                    'audio',
                    'Outgoing',
                    chatInfo.groupAvatar,
                  ),
                );
                navigation.navigate('GroupVoiceCall', {
                  participants: chatUsers,
                  info: chatInfo,
                });
              }}>
              <Phone />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => {
                dispatch(
                  addCall(
                    chatInfo.chatName,
                    'video',
                    'Outgoing',
                    chatInfo.groupAvatar,
                  ),
                );
                navigation.navigate('GroupVideoCall', {
                  participants: chatUsers,
                  info: chatInfo,
                });
              }}>
              <Video />
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
        onPressLeft={() => {
          if (
            navigation.getState()?.routes[
              navigation.getState()?.routes.length - 2
            ].name === 'NewGroupSubject'
          ) {
            const popAction = StackActions.pop(3);
            navigation.dispatch(popAction);
          } else navigation.goBack();
        }}
      />
      <FlatList
        style={{flex: 1, paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <View style={{marginTop: 15, alignSelf: 'center'}}>
            <View
              style={
                colorMode === 'Dark'
                  ? styles.todayContainer
                  : styles.todayContainer_light
              }>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.gray_Medium_14
                    : common.gray2_Medium_14
                }>
                Today
              </Text>
            </View>
          </View>
        )}
        ListHeaderComponent={() => <View style={{height: 40}} />}
        data={[...messages].reverse()}
        inverted
        keyExtractor={item => item.id}
        renderItem={
          ({item}) =>
            item.sender !== currentUser._id ? (
              <GroupMessageReceiver
                name={getSenderName(item.sender)}
                message={item.content}
                time={item.createdAt}
              />
            ) : (
              <MessageContainer1 message={item.content} time={item.createdAt} />
            )

          // <View style={{marginBottom: 30}}>
          //   <MessageContainer1 message={'Hi, good morning Jenny... 😁😁'} />
          //   <MessageContainer1
          //     message={
          //       "Haven't seen you in a long time since we were in college 😂"
          //     }
          //   />
          //   <GroupMessageReceiver message={'Hello, morning to Andrew'} />
          //   <GroupMessageReceiver
          //     message={
          //       "Haha, yes it's been about 5 years we haven't seen each other 🤣🤣"
          //     }
          //   />
          //   <AudioContainer
          //     style={
          //       {alignSelf: 'flex-start', backgroundColor: colors.primary_500_8}
          //       //   colorMode === 'Light' && {
          //       //     backgroundColor: colors.primary_500_8,
          //       //     alignSelf: 'flex-start',
          //       //   },
          //     }
          //   />
          // </View>
        }
      />
      {options && (
        <Pressable
          style={
            colorMode === 'Dark'
              ? styles.optionContainer
              : styles.optionContainer_light
          }>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Search /> : <SearchBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Search
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Bell /> : <NotificationBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Mute Notification
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Time /> : <TimeBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Disappearing Messages
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Wallpaper /> : <WallpaperBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Wallpaper
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Danger /> : <DangerBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Report
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Close /> : <CloseBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Block
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <DeleteIcon /> : <DeleteBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Clear Chat
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <Download /> : <DownloadBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Export Chat
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rowContainer, {borderBottomWidth: 0}]}>
            {colorMode === 'Dark' ? <Discovery /> : <DiscoveryBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Add Shortcut
              </Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      )}
      <View style={styles.footer}>
        {accessory && (
          <Pressable
            style={
              colorMode === 'Dark'
                ? styles.accessoryContainer
                : styles.accessoryContainer_light
            }>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={[styles.circle, {backgroundColor: colors.purple}]}>
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      color={colors.WHITE}
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Medium_16
                        : common.black_Medium_16
                    }>
                    Document
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity style={styles.circle}>
                    <MaterialCommunityIcons
                      name="camera"
                      color={colors.WHITE}
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Medium_16
                        : common.black_Medium_16
                    }>
                    Camera
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={[
                      styles.circle,
                      {backgroundColor: colors.purple_500},
                    ]}>
                    <FontAwesome
                      name="picture-o"
                      color={colors.WHITE}
                      size={20}
                    />
                  </TouchableOpacity>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Medium_16
                        : common.black_Medium_16
                    }>
                    Gallery
                  </Text>
                </View>
              </View>
              <View style={[styles.row, {marginTop: 20}]}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={[styles.circle, {backgroundColor: 'orange'}]}>
                    <MaterialCommunityIcons
                      name="headphones"
                      color={colors.WHITE}
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Medium_16
                        : common.black_Medium_16
                    }>
                    Audio
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={[styles.circle, {backgroundColor: 'green'}]}>
                    <Ionicons
                      name="md-location-sharp"
                      color={colors.WHITE}
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Medium_16
                        : common.black_Medium_16
                    }>
                    Location
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={[styles.circle, {backgroundColor: colors.blue}]}>
                    <MaterialCommunityIcons
                      name="account"
                      color={colors.WHITE}
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Medium_16
                        : common.black_Medium_16
                    }>
                    Contacts
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        {/* {isTyping && userTyping !== currentUser.username && (
          <View style={{marginBottom: 5, marginLeft: 5}}>
            <Text style={common.white_Bold_16}>
              {userTyping + ' is typing...'}
            </Text>
          </View>
        )} */}
        <View style={[common.row, {justifyContent: 'space-between'}]}>
          <InputTextContainer
            width={'80%'}
            value={textReply}
            onChange={typingHandler}
            onChangeText={setTextReply}
            onPressAttach={() => setAccessory(prev => !prev)}
          />
          {textReply.length.toString() !== 0 ? (
            <TouchableOpacity style={common.iconContainer} onPress={send}>
              <SendWhite />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={common.iconContainer}>
              <Mic />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
    // </Pressable>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    bottom: 20,
  },
  todayContainer: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 5,
    borderColor: colors.DARK_3,
    backgroundColor: colors.DARK_2,
    alignSelf: 'flex-start',
  },
  todayContainer_light: {
    padding: 15,
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: colors.GRAY_2_12,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
  },
  iconContainer: {
    alignItems: 'center',
    width: '20%',
  },
  accessoryContainer: {
    backgroundColor: colors.DARK_2,
    borderWidth: 1,
    borderColor: colors.DARK_3,
    borderRadius: 16,
    marginBottom: 20,
    height: 230,
  },
  accessoryContainer_light: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.Gray_100,
    borderRadius: 16,
    marginBottom: 20,
    height: 230,
  },
  optionContainer: {
    width: 237,
    height: 476,
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
    width: 237,
    height: 476,
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
