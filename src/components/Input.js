import React from 'react';
import colors from '../constants/colors';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';

const Input = ({
  check,
  error,
  errorText,
  IconLeft,
  IconRight,
  label,
  labelStyle,
  height,
  color,
  placeholder,
  asterisk,
  children,
  containerStyle,
  style,
  ...otherProps
}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <>
      <View style={[styles.outerContainer, {...containerStyle}]}>
        <View
          style={[
            colorMode === 'Dark' ? styles.container : styles.container_light,
            color && {backgroundColor: colors.WHITE},
            height && {height: height},
          ]}>
          {IconLeft && <View style={styles.iconLeft}>{IconLeft}</View>}
          <View
            style={[
              styles.textInputContainer,
              !IconRight ? {width: '100%'} : {width: '85%'},
            ]}>
            <TextInput
              style={[
                style && {...style},
                colorMode === 'Dark'
                  ? styles.textInput
                  : styles.textInput_light,
              ]}
              placeholder={placeholder}
              {...otherProps}
              placeholderTextColor={colors.GRAY}
              keyboardAppearance="dark"
            />
          </View>
          {IconRight && <View style={styles.iconRight}>{IconRight}</View>}
        </View>
      </View>
      {error && errorText && (
        <View style={{marginTop: 5, width: '100%', marginLeft: 15}}>
          <Text style={[styles.label, {color: colors.red}]}>{errorText}</Text>
        </View>
      )}
    </>
  );
};

export const Red = props => (
  <Text style={{color: colors.red}}>{props.children}</Text>
);

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    borderColor: colors.DARK_3,
    backgroundColor: colors.DARK_2,
  },
  container_light: {
    height: 60,
    width: '100%',
    borderRadius: 16,
    flexDirection: 'row',
    backgroundColor: colors.FILL,
  },
  iconLeft: {
    justifyContent: 'center',
    width: '20%',
    alignItems: 'center',
  },
  textInputContainer: {
    width: '60%',
    justifyContent: 'center',
  },
  textInput: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    padding: 20,
  },
  textInput_light: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    padding: 20,
  },
  textInput_light: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    padding: 20,
  },
  iconRight: {
    justifyContent: 'center',
    width: '15%',
    alignItems: 'center',
  },
  label: {
    color: colors.gray_500,
    fontFamily: 'Urbanist-Bold',
    fontSize: 14,
  },
  label_light: {
    color: colors.gray_700,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
  },
});

export default Input;
