import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import InputTextContainer from '../../components/InputTextContainer';
import {
  CallBlack,
  CallWhite,
  ChatBlack,
  ChatWhite,
  Mic,
  ProfileBlack,
  ProfileWhite,
  SendWhite,
  VideoBlack,
  VideoWhite,
  VolumeOffBlack,
  VolumeOffWhite,
} from '../../assets/icons/icons';
import {useSelector} from 'react-redux';

const ViewStatus = ({navigation}) => {
  const [reply, setReply] = useState(false);
  const [options, setOptions] = useState(false);
  const [textReply, setTextReply] = useState('');
  const colorMode = useSelector(state => state.color.color);
  return (
    <Pressable style={{flex: 1}} onPress={() => setOptions(false)}>
      <ImageBackground
        source={require('../../assets/images/status/StatusBackground.png')}
        style={{flex: 1, paddingHorizontal: 20}}>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.line}>
              <View style={{backgroundColor: colors.WHITE, flex: 1}}></View>
            </View>
            <View style={styles.line}>
              <View style={{backgroundColor: colors.WHITE, flex: 1}}></View>
            </View>
            <View style={styles.line}>
              <View style={styles.fill}></View>
            </View>
            <View style={styles.line} />
          </View>
          <View style={{marginTop: 20}}>
            <View style={[common.row, {justifyContent: 'space-between'}]}>
              <View style={common.row}>
                <AntDesign
                  name="arrowleft"
                  color={colors.WHITE}
                  size={26}
                  onPress={() => navigation.goBack()}
                />
                <View style={[{marginLeft: 20}, common.row]}>
                  <Image
                    source={require('../../assets/images/chat/Girl.png')}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={common.white_Bold_18}>Marielle Wigington</Text>
                    <Text style={common.white_Medium_14}>10 minutes ago</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setOptions(prev => !prev)}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  color={colors.WHITE}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {options && (
          <Pressable
            style={
              colorMode === 'Dark'
                ? styles.optionContainer
                : styles.optionContainer_light
            }>
            <TouchableOpacity
              style={
                colorMode === 'Dark'
                  ? styles.rowContainer
                  : styles.rowContainer_light
              }>
              {colorMode === 'Dark' ? <VolumeOffWhite /> : <VolumeOffBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  Mute
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                colorMode === 'Dark'
                  ? styles.rowContainer
                  : styles.rowContainer_light
              }>
              {colorMode === 'Dark' ? <ChatWhite /> : <ChatBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  Message
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                colorMode === 'Dark'
                  ? styles.rowContainer
                  : styles.rowContainer_light
              }>
              {colorMode === 'Dark' ? <CallWhite /> : <CallBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  Voice Call
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                colorMode === 'Dark'
                  ? styles.rowContainer
                  : styles.rowContainer_light
              }>
              {colorMode === 'Dark' ? <VideoWhite /> : <VideoBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  Video Call
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                colorMode === 'Dark'
                  ? styles.rowContainer
                  : styles.rowContainer_light
              }>
              {colorMode === 'Dark' ? <ProfileWhite /> : <ProfileBlack />}
              <View style={{marginLeft: 10}}>
                <Text
                  style={
                    colorMode === 'Dark'
                      ? common.white_Medium_14
                      : common.black_Medium_14
                  }>
                  View Contact
                </Text>
              </View>
            </TouchableOpacity>
          </Pressable>
        )}
        <View style={styles.footer}>
          {reply ? (
            <View
              style={[
                common.row,
                {justifyContent: 'space-between', width: '100%'},
              ]}>
              <InputTextContainer
                width={'80%'}
                autoFocus
                value={textReply}
                onChangeText={setTextReply}
                onPressAttach={() => setAccessory(prev => !prev)}
              />
              <View style={common.iconContainer}>
                {textReply.length.toString() !== 0 ? <SendWhite /> : <Mic />}
              </View>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Text style={common.white_Medium_18}>
                Havana Coffee Shop ☕️☕️☕️
              </Text>
              <View style={{marginVertical: 10}}>
                <Entypo name="chevron-thin-up" color={colors.WHITE} size={20} />
              </View>
              <TouchableOpacity onPress={() => setReply(true)}>
                <Text style={common.white_Bold_16}>Reply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ViewStatus;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight + 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    width: 85,
    height: 4,
    borderRadius: 10,
    backgroundColor: colors.GRAY_4,
  },
  footer: {
    flex: 1,
    bottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fill: {
    backgroundColor: colors.WHITE,
    width: '70%',
    height: '100%',
  },
  optionContainer: {
    width: 168,
    height: 268,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    right: 20,
    top: 115,
    paddingTop: 10,
    backgroundColor: colors.DARK_2,
    position: 'absolute',
  },
  optionContainer_light: {
    width: 168,
    height: 268,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    right: 20,
    top: 115,
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
  rowContainer_light: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SHADOW,
    paddingVertical: 15,
  },
});
