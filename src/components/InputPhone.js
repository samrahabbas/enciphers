import React, {useState, useRef, useEffect} from 'react';
import colors from '../constants/colors';
import {StyleSheet, View, Text} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {useSelector} from 'react-redux';

const InputPhone = ({
  IconLeft,
  onChangeText,
  isValid,
  label,
  asterisk,
  style,
}) => {
  const [value, setValue] = useState('');
  const phoneInput = useRef();
  const colorMode = useSelector(state => state.color.color);
  //   useEffect(() => {
  //     const checkValid = phoneInput.current?.isValidNumber(value);
  //     isValid(checkValid);
  //   }, [isValid, value]);

  return (
    <View style={{...style}}>
      {label && (
        <Text style={styles.label}>
          {label} {asterisk && <Text style={{color: colors.RED}}>*</Text>}
        </Text>
      )}
      <View
        style={
          colorMode === 'Dark' ? styles.container : styles.container_light
        }>
        {IconLeft && <View style={styles.iconLeft}>{IconLeft}</View>}
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="US"
          layout="first"
          onChangeFormattedText={text => setValue(text)}
          onChangeText={onChangeText}
          disableArrowIcon
          countryPickerProps={{withAlphaFilter: true}}
          countryPickerButtonStyle={IconLeft && {width: '15%'}}
          codeTextStyle={
            colorMode === 'Dark' ? {color: colors.WHITE} : {color: colors.BLACK}
          }
          //flagButtonStyle={{backgroundColor: 'blue'}}
          placeholder={'000 000 000'}
          textInputProps={{
            placeholderTextColor: colors.GRAY,
            keyboardAppearance: 'default',
          }}
          textInputStyle={
            colorMode === 'Dark'
              ? styles.textInputStyle
              : styles.textInputStyle_light
          }
          containerStyle={
            colorMode === 'Dark'
              ? styles.containerStyle
              : styles.containerStyle_light
          }
          textContainerStyle={
            colorMode === 'Dark'
              ? styles.textContainerStyle
              : styles.textContainerStyle_light
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.DARK_2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.DARK_3,
  },
  container_light: {
    flexDirection: 'row',
    backgroundColor: colors.FILL,
    borderRadius: 16,
  },
  iconLeft: {
    justifyContent: 'center',
    width: '20%',
    alignItems: 'center',
  },
  textContainerStyle: {
    borderRadius: 12,
    backgroundColor: colors.DARK_2,
    //marginRight: 70,
  },
  textContainerStyle_light: {
    borderRadius: 12,
    backgroundColor: colors.FILL,
    //marginRight: 70,
  },
  containerStyle: {
    borderRadius: 16,
    backgroundColor: colors.DARK_2,
    height: 66,
    width: '100%',
  },
  containerStyle_light: {
    borderRadius: 16,
    backgroundColor: colors.FILL,
    height: 66,
    width: '100%',
  },
  textInputStyle: {
    marginBottom: -3,
    fontWeight: '500',
    fontFamily: 'Urbanist-Regular',
    color: colors.WHITE,
  },
  textInputStyle_light: {
    marginBottom: -3,
    fontWeight: '500',
    fontFamily: 'Urbanist-Regular',
    color: colors.BLACK,
  },
  error: {color: colors.RED, fontFamily: 'Urbanist-Regular'},
  label: {
    color: colors.GRAY,
    fontFamily: 'Urbanist-Medium',
    marginLeft: 5,
    fontSize: 16,
    marginBottom: 7,
  },
});

export default InputPhone;
