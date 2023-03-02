import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import React, {useRef, useState} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import Header from '../../components/Header';
import Button from '../../components/Button';
import {useSelector} from 'react-redux';

const OtpVerification = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  const number1 = useRef();
  const number2 = useRef();
  const number3 = useRef();
  const number4 = useRef();
  const [code1, setCode1] = useState();
  const [code2, setCode2] = useState();
  const [code3, setCode3] = useState();
  const [code4, setCode4] = useState();
  return (
    <View
      style={[
        colorMode === 'Dark' ? common.container_dark : common.container_light,
        {paddingTop: StatusBar.currentHeight},
      ]}>
      <Header title={'OTP Code Verification'} />
      <View style={common.subContainer}>
        <View style={{marginTop: 50}}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Regular_18
                : common.black_Regular_18
            }>
            Code has been send to +1 111 ******99
          </Text>
        </View>
        <View style={styles.codeContainer}>
          <View
            style={
              colorMode === 'Dark' ? styles.textInput : styles.textInput_light
            }>
            <TextInput
              style={
                colorMode === 'Dark'
                  ? common.headerText
                  : common.headerText_light
              }
              maxLength={1}
              autoFocus
              value={code1}
              ref={number1}
              keyboardType="phone-pad"
              onChangeText={text => {
                //setCode1(text);
                number2.current.focus();
              }}
            />
          </View>
          <View
            style={
              colorMode === 'Dark' ? styles.textInput : styles.textInput_light
            }>
            <TextInput
              style={
                colorMode === 'Dark'
                  ? common.headerText
                  : common.headerText_light
              }
              maxLength={1}
              ref={number2}
              value={code2}
              keyboardType="phone-pad"
              onChangeText={text => {
                //setCode2(text);
                number3.current.focus();
              }}
              onKeyPress={({nativeEvent}) => {
                console.log(nativeEvent.key);
                if (nativeEvent.key === 'Backspace') {
                  number1.current.focus();
                }
              }}
            />
          </View>
          <View
            style={
              colorMode === 'Dark' ? styles.textInput : styles.textInput_light
            }>
            <TextInput
              style={
                colorMode === 'Dark'
                  ? common.headerText
                  : common.headerText_light
              }
              maxLength={1}
              ref={number3}
              value={code3}
              keyboardType="phone-pad"
              onChangeText={text => {
                //setCode3(text);
                number4.current.focus();
              }}
              onKeyPress={({nativeEvent}) => {
                console.log(nativeEvent.key);
                if (nativeEvent.key === 'Backspace') {
                  number2.current.focus();
                }
              }}
            />
          </View>
          <View
            style={
              colorMode === 'Dark' ? styles.textInput : styles.textInput_light
            }>
            <TextInput
              style={
                colorMode === 'Dark'
                  ? common.headerText
                  : common.headerText_light
              }
              maxLength={1}
              ref={number4}
              value={code4}
              keyboardType="phone-pad"
              onChangeText={text => {
                //setCode4(text);
                number4.current.blur();
              }}
              onKeyPress={({nativeEvent}) => {
                console.log(nativeEvent.key);
                if (nativeEvent.key === 'Backspace') {
                  number3.current.focus();
                }
              }}
            />
          </View>
        </View>
        {code1 && code2 && code3 && code4 && (
          <View>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Regular_18
                  : common.black_Regular_18
              }>
              Resend code in <Text style={{color: colors.primary_500}}>55</Text>
              s
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={'Verify'}
          onPress={() => navigation.navigate('FillProfile')}
        />
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  codeContainer: {
    marginVertical: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //paddingHorizontal: 20,
  },
  textInput: {
    width: 83,
    height: 61,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.DARK_3,
    backgroundColor: colors.DARK_2,
  },
  textInput_light: {
    width: 83,
    height: 61,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.FILL,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    bottom: 30,
    paddingHorizontal: 20,
    height: 55,
  },
});
