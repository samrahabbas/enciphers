import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {
  Arrow,
  ArrowBlack,
  SearchBig,
  SettingBlack,
  SettingWhite,
  TimeBig,
  TimeBigBlack,
} from '../../assets/icons/icons';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import InputTextContainer from '../../components/InputTextContainer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RowComponent from '../../components/RowComponent';
import {newGroupChat} from '../../redux/actions/chatAction';
import {socket} from '../../redux/reducers/socket';

const NewGroupSubject = ({route, navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  const currentUser = useSelector(state => state.auth.user);
  //const socket = useSelector(state => state.socket.socket);
  const {selected} = route.params;
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const createGroup = () => {
    var arr = selected;
    arr.push(currentUser);
    dispatch(
      newGroupChat(
        arr,
        groupName,
        true,
        currentUser._id,
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      ),
    ).then(res => {
      if (res === 'Group name already exists') {
        setError(res);
      } else {
        var otherUsers = [];
        for (let i = 0; i < res.users.length; i++) {
          if (res.users[i].userId !== currentUser._id) {
            otherUsers.push(res.users[i]);
          }
        }
        const socketInfo = res;
        socketInfo.otherUsers = otherUsers;
        socket.emit('group chat created', socketInfo);
        const result = {...res};
        delete result.otherUsers;
        delete result.users;
        navigation.navigate('GroupChat', {
          users: res.users,
          chatId: res.id,
          chatInfo: result,
        });
      }
    });
  };
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'New Group'}
        right={
          <TouchableOpacity>
            <SearchBig />
          </TouchableOpacity>
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
        <View style={styles.row}>
          <View>
            <Image
              source={require('../../assets/images/Groupchat/NoImage.png')}
            />
            <View style={common.indicator_square}>
              <MaterialCommunityIcons
                name="pencil"
                color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
                size={12.5}
              />
            </View>
          </View>
          <InputTextContainer
            noLeft
            value={groupName}
            onChangeText={setGroupName}
            width={'80%'}
            placeholder="Type group subject here.."
            textInputStyle={{width: '88%'}}
            right={<Feather name="smile" size={20} color={colors.GRAY} />}
          />
        </View>
        <View style={colorMode === 'Dark' ? common.line : common.line_light} />
        <RowComponent
          icon={colorMode === 'Dark' ? <TimeBig /> : <TimeBigBlack />}
          text={'Disappearing Messages'}
          number={'Off'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <View style={{marginTop: 10}} />
        <RowComponent
          icon={colorMode === 'Dark' ? <SettingWhite /> : <SettingBlack />}
          text={'Groups Settings'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          onPress={() => navigation.navigate('GroupSettings')}
        />
        <View style={{marginTop: 10}} />
        <View style={colorMode === 'Dark' ? common.line : common.line_light} />
        <View style={{marginTop: 10}}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_18
                : common.black_Medium_18
            }>
            Participants: {selected.length}
          </Text>
          <View style={{marginTop: 20}}>
            <FlatList
              data={selected}
              numColumns={4}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <Image style={styles.image} source={{uri: item.avatar}} />
              )}
            />
            {/* <View style={[common.row, {justifyContent: 'space-around'}]}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(1).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(2).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(3).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(4).png')}
                style={styles.image}
              />
            </View>
            <View
              style={[
                common.row,
                {justifyContent: 'space-around', marginTop: 10},
              ]}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(1).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(2).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(3).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(4).png')}
                style={styles.image}
              />
            </View>
            <View
              style={[
                common.row,
                {justifyContent: 'space-around', marginTop: 10},
              ]}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(1).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(2).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(3).png')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(4).png')}
                style={styles.image}
              />
            </View> */}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageContainer} onPress={createGroup}>
          <Feather name="check" color={colors.WHITE} size={22} />
        </TouchableOpacity>
      </View>
      {error && (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => setError()}
          style={styles.error}>
          <View style={styles.card}>
            <Text style={common.p500_Bold_20}>Error!</Text>
            <View style={{marginTop: 10}}>
              <Text style={common.white_Regular_16}>{error}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewGroupSubject;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  footer: {
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 200,
    marginRight: 10,
    marginBottom: 10,
  },
  error: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blurBG,
  },
  card: {
    backgroundColor: colors.DARK_2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    paddingVertical: 100,
    borderRadius: 48,
  },
});
