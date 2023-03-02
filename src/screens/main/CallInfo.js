import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import MainHeader from '../../components/MainHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {common} from '../../styles/styles';
import {useSelector} from 'react-redux';
import colors from '../../constants/colors';
import CallContainer from '../../components/CallContainer';
import {
  BlockBlack,
  BlockWhite,
  ChatWhiteFill,
  DeleteBlack,
  DeleteIcon,
  IncomingBig,
  RedClose,
} from '../../assets/icons/icons';

const CallInfo = ({navigation}) => {
  const [options, setOptions] = useState(false);
  const colorMode = useSelector(state => state.color.color);
  return (
    <Pressable
      onPress={() => setOptions(false)}
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Call Info'}
        right={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => navigation.navigate('Chat')}>
              <ChatWhiteFill />
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
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <CallContainer
          both
          des={'+1-202-555-0161'}
          onPressCall={() => navigation.navigate('VoiceCall')}
          onPressVideo={() => navigation.navigate('VideoCall')}
        />
        <View style={colorMode === 'Dark' ? styles.line : styles.line_light} />
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_16
              : common.gray_8_Medium_16
          }>
          Today, December 22, 2024
        </Text>
        <View style={[common.row, {marginTop: 20}]}>
          <IncomingBig />
          <View style={{marginLeft: 10, width: '100%'}}>
            <View style={styles.row}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_16
                    : common.black_Bold_16
                }>
                Incoming
              </Text>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_16
                    : common.black_Bold_16
                }>
                08:29 mins
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={colorMode === 'Dark' ? styles.des : styles.des_light}>
                16:25
              </Text>
              <Text
                style={colorMode === 'Dark' ? styles.des : styles.des_light}>
                08:25
              </Text>
            </View>
          </View>
        </View>
      </View>
      {options && (
        <View
          style={
            colorMode === 'Dark'
              ? styles.optionContainer
              : styles.optionContainer_light
          }>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <DeleteIcon /> : <DeleteBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Remove from Call Log
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <BlockWhite /> : <BlockBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Remove from Call Log
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

export default CallInfo;

const styles = StyleSheet.create({
  line: {marginVertical: 20, height: 1, backgroundColor: colors.DARK_3},
  line_light: {marginVertical: 20, height: 1, backgroundColor: colors.SHADOW},
  row: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  des: {
    color: colors.GRAY_300,
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
  },
  des_light: {
    color: colors.GRAY_7,
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
  },
  optionContainer: {
    width: 221,
    height: 112,
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
    width: 221,
    height: 112,
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
