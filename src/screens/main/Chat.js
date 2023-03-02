import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
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
import {
  getMessages,
  OPEN_MESSAGE,
  receiveMessages,
  sendMessages,
} from '../../redux/actions/messageAction';
import {socket} from '../../redux/reducers/socket';
var selectedChatCompare;
import {RSA} from 'react-native-rsa-native';
import {
  getChatsByName,
  getSenderById,
  savePendingMessages,
} from '../../local_db/SQLite';
import moment from 'moment';
import {addCall} from '../../redux/actions/callAction';

const Chat = ({navigation, route}) => {
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accessory, setAccessory] = useState(false);
  const [options, setOptions] = useState(false);
  const [textReply, setTextReply] = useState('');
  const [messages, setMessages] = useState([]);
  const colorMode = useSelector(state => state.color.color);
  const currentUser = useSelector(state => state.auth.user);
  const {user, chatId, chatInfo} = route.params;
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const newMessages = useSelector(state => state.message.newMessages);
  //const socket = useSelector(state => state.socket.socket);

  useEffect(() => {
    // socket = io(ENDPOINT);
    // socket.emit('setup', currentUser);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    socket.on('pending message', (newMessage, pending) => {
      //send the messages that has status of pending by chat id
      console.log('saved pending message');
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

  // useEffect(() => {
  //   let message = 'my secret message';

  //   RSA.generateKeys(4096) // set key size
  //     .then(keys => {
  //       console.log('4096 private:', keys.private); // the private key
  //       console.log('4096 public:', keys.public); // the public key
  //       RSA.encrypt(message, keys.public).then(encodedMessage => {
  //         console.log(`the encoded message is ${encodedMessage}`);
  //         RSA.decrypt(encodedMessage, keys.private).then(decryptedMessage => {
  //           console.log(`The original message was ${decryptedMessage}`);
  //         });
  //       });
  //     });
  // }, []);

  // useEffect(() => {
  //   let isMounted = true;
  //   if (isMounted) {
  //     const user1 = crypto.getDiffieHellman('modp15');
  //     const user2 = crypto.getDiffieHellman('modp15');

  //     user1.generateKeys();
  //     user2.generateKeys();

  //     const user1Secret = user1.computeSecret(
  //       user2.getPublicKey(),
  //       null,
  //       'hex',
  //     );
  //     const user2Secret = user2.computeSecret(
  //       user1.getPublicKey(),
  //       null,
  //       'hex',
  //     );
  //     console.log(user1Secret === user2Secret);
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const loadMessages = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(getMessages(chatId)).then(res => {
        if (res) setMessages(res);
      });
    } catch (err) {
      setError(err);
    }
    setIsRefreshing(false);
  }, [dispatch, error]);

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

  // const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  // var a = moment(messages[0].createdAt);
  // var b = moment(fiveDaysAgo);
  // // current date is less than 5 days ago
  // //const from5daysLater = new Date(messages[0].createdAt);
  // console.log(a, b, a.from(b));
  // if (a.from(b) === 'in 5 days') console.log('5 days ago');

  useEffect(() => {}, [messages]);

  useEffect(() => {
    //doesn't get called unless the chat is entered once
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
                setMessages(messages => [...messages, res]);
                console.log('received in chat');
              });
            });
          });
        }
        //setMessages([...messages, newMessageReceived.message]);

        //dispatch(receiveMessages(newMessageReceived.message.content))
        // if (
        //   !selectedChatCompare || // if chat is not selected or doesn't match current chat
        //   selectedChatCompare.id !== newMessageReceived.id
        // ) {
        //   // if (!notification.includes(newMessageReceived)) {
        //   //   setNotification([newMessageReceived, ...notification]);
        //   //   //setFetchAgain(!fetchAgain);
        //   // } //give notification
        // } else {
        //   setMessages([...messages, newMessageReceived.message]);
        // }
      });
  });

  const send = () => {
    socket.emit('stop typing', chatId);
    dispatch(sendMessages(textReply, chatId)).then(res => {
      const chat_obj = chatInfo;
      chatInfo.message = res;
      socket.emit('new message', chat_obj);
      setMessages([...messages, res]);
      console.log('sent');
    });
    setTextReply('');
  };

  const typingHandler = e => {
    // console.log(e.nativeEvent.text);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      console.log(chatId);
      socket.emit('typing', chatId);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', chatId);
        setTyping(false);
      }
    }, timerLength);
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
        title={user.username}
        onPressLeft={() => navigation.pop(1)} //unmounts the component
        onPressTitle={() => navigation.navigate('ContactDetails', {user: user})}
        right={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{marginRight: 20}}
              //maybe user
              onPress={() => {
                dispatch(
                  addCall(user.username, 'audio', 'Outgoing', user.avatar),
                );
                navigation.navigate('VoiceCall', {
                  item: {
                    _id: user.userId,
                    avatar: user.avatar,
                    username: user.username,
                  },
                });
              }}>
              <Phone />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 20}}
              //maybe user
              onPress={() => {
                dispatch(
                  addCall(user.username, 'video', 'Outgoing', user.avatar),
                );
                navigation.navigate('VideoCall', {
                  item: {
                    _id: user.userId,
                    avatar: user.avatar,
                    username: user.username,
                  },
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
      />
      <FlatList
        style={{flex: 1, paddingHorizontal: 20}}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={loadMessages} />
        }
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
        keyExtractor={item => item.id}
        inverted
        renderItem={({item}) =>
          item.sender !== currentUser._id ? (
            <MessageContainer2 message={item.content} time={item.createdAt} />
          ) : (
            <MessageContainer1 message={item.content} time={item.createdAt} />
          )
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
        {isTyping && (
          <View>
            <Text style={common.white_Bold_16}>Typing...</Text>
          </View>
        )}
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

export default Chat;

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
