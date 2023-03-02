import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {
  Arrow,
  ArrowBlack,
  BellBig,
  BellBigBlack,
  ChatBigBlack,
  ChatBigWhite,
  FolderBlack,
  FolderWhite,
  GroupBlack,
  InfoBigBlack,
  InfoBigWhite,
  KeyboardBlack,
  KeyboardWhite,
  LogoutRed,
  ProfileBigBlack,
  ProfileWhite,
  Scan,
  SecurityBlack,
  SecurityWhite,
  ThreeUsers,
} from '../../assets/icons/icons';
import RowComponent from '../../components/RowComponent';
import BottomPopup from '../../components/BottomPopup';
import Button from '../../components/Button';
import {logout} from '../../redux/actions/authAction';
import backgroundServer from 'react-native-background-actions';

const Settings = ({navigation}) => {
  const dispatch = useDispatch();
  const colorMode = useSelector(state => state.color.color);
  const [popup, setPopup] = useState(false);
  const currentUser = useSelector(state => state.auth.user);
  const socket = useSelector(state => state.socket.socket);

  return (
    <ScrollView
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <BottomPopup
        enableBackdropDismiss
        show={popup}
        text={'Logout'}
        background={colorMode === 'Dark' ? colors.DARK_2 : colors.WHITE}
        Height={260}
        onDismiss={() => setPopup(false)}>
        <View style={{alignItems: 'center', paddingHorizontal: 20}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_20 : common.black_Bold_20
            }>
            Are you sure you want to log out?
          </Text>
          <View style={[styles.row, {width: '100%', marginTop: 30}]}>
            <Button
              title={'Cancel'}
              style={{width: '48%'}}
              color={colorMode === 'Dark' ? colors.DARK_3 : colors.primary_100}
              titleColor={
                colorMode === 'Dark' ? colors.WHITE : colors.primary_500
              }
              onPress={() => setPopup(false)}
            />
            <Button
              title={'Yes, Logout'}
              style={{width: '48%'}}
              onPress={async () => {
                console.log('logout');
                //await socket.emit('logout', currentUser);
                await backgroundServer.stop();
                dispatch(logout());
              }}
            />
          </View>
        </View>
      </BottomPopup>
      <MainHeader title={'Settings'} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Profile')}>
          <View style={common.row}>
            <Image source={{uri: currentUser?.avatar}} style={styles.image} />
            <View style={{marginLeft: 20}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_24
                    : common.black_Bold_24
                }>
                {currentUser?.username}
              </Text>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Always Available
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('QRCode')}>
            <Scan />
          </TouchableOpacity>
        </TouchableOpacity>
        <View
          style={[
            colorMode === 'Dark'
              ? common.line
              : [common.line_light, {backgroundColor: colors.SHADOW}],
            {marginVertical: 20},
          ]}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <ProfileWhite /> : <ProfileBigBlack />}
          text={'Account'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          onPress={() => navigation.navigate('AccountSettings')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <ChatBigWhite /> : <ChatBigBlack />}
          text={'Chats'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('ChatSettings')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <BellBig /> : <BellBigBlack />}
          text={'Notifications'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('NotificationSettings')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <FolderWhite /> : <FolderBlack />}
          text={'Storage & Data'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('StorageAndData')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <SecurityWhite /> : <SecurityBlack />}
          text={'Security'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('Security')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <KeyboardWhite /> : <KeyboardBlack />}
          text={'Keyboard'}
          number="English (US)"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('Language')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <InfoBigWhite /> : <InfoBigBlack />}
          text={'Help Center'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('HelpCenter')}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <ThreeUsers /> : <GroupBlack />}
          text={'Invite Friends'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('InviteFriends')}
        />
        <RowComponent
          icon={<LogoutRed />}
          text={'Logout'}
          red
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
          onPress={() => setPopup(true)}
        />
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 150,
  },
});
