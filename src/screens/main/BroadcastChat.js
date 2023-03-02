import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  BroadcastBlack,
  BroadcastWhite,
  Close,
  CloseBlack,
  DeleteRed,
  Discovery,
  DiscoveryBlack,
  Download,
  DownloadBlack,
  HelpBlack,
  InfoWhite,
  Mic,
  Search,
  SearchBlack,
  Time,
  TimeBlack,
  Wallpaper,
  WallpaperBlack,
} from '../../assets/icons/icons';
import {useSelector} from 'react-redux';
import InputTextContainer from '../../components/InputTextContainer';
import MessageContainer1 from '../../components/MessageContainer1';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioContainer from '../../components/AudioContainer';
import GroupMessageReceiver from '../../components/GroupMessageReceiver';

const BroadcastChat = ({navigation}) => {
  const [accessory, setAccessory] = useState(false);
  const [options, setOptions] = useState(false);
  const colorMode = useSelector(state => state.color.color);
  return (
    <Pressable
      style={{flex: 1}}
      onPress={() => {
        setAccessory(false);
        setOptions(false);
      }}>
      <View
        style={
          colorMode === 'Dark' ? common.container_dark : common.container_light
        }>
        <MainHeader
          title={'4 Recipients'}
          right={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
        <ScrollView
          style={{flex: 1, paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <View style={[{marginTop: 20, marginBottom: 10}, common.row]}>
            <View style={[{marginRight: 15}, common.iconContainer]}>
              <FontAwesome5 name="user-plus" color={colors.WHITE} size={20} />
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse.png')}
                style={styles.image}
              />
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(1).png')}
                style={styles.image}
              />
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(2).png')}
                style={styles.image}
              />
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(3).png')}
                style={styles.image}
              />
            </View>
          </View>
          <View
            style={colorMode === 'Dark' ? common.line : common.line_light}
          />
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
          <View>
            <MessageContainer1 message={'Hi, good morning Jenny... 😁😁'} />
            <MessageContainer1
              message={
                "Haven't seen you in a long time since we were in college 😂"
              }
            />
            <GroupMessageReceiver message={'Hello, morning to Andrew'} />
            <GroupMessageReceiver
              message={
                "Haha, yes it's been about 5 years we haven't seen each other 🤣🤣"
              }
            />
            <AudioContainer
              style={{
                alignSelf: 'flex-start',
                backgroundColor: colors.primary_500_8,
              }}
            />
          </View>
          <View style={{height: 30}}></View>
        </ScrollView>
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
              {colorMode === 'Dark' ? <InfoWhite /> : <HelpBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  Broadcast List Info
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowContainer}>
              {colorMode === 'Dark' ? <BroadcastWhite /> : <BroadcastBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  Broadcast List Media
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
              {colorMode === 'Dark' ? <Close /> : <CloseBlack />}
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
            <TouchableOpacity style={styles.rowContainer}>
              <DeleteRed />
              <View style={{marginLeft: 10}}>
                <Text style={common.red_Medium_14}>Delete Broadcast</Text>
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
          <View style={[common.row, {justifyContent: 'space-between'}]}>
            <InputTextContainer
              width={'80%'}
              onPressAttach={() => setAccessory(prev => !prev)}
            />
            <View style={common.iconContainer}>
              <Mic />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default BroadcastChat;

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
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
});
