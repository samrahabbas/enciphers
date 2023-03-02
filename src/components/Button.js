import React from 'react';
import colors from '../constants/colors';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

const Button = ({
  iconLeft,
  title,
  color,
  onPress,
  style,
  children,
  disable,
  icon,
  width,
  height,
  titleColor,
  logo,
}) => {
  disable = disable ? disable : false;
  return (
    <TouchableOpacity
      disabled={disable}
      style={[
        styles.button,
        height ? {height} : {height: 55},
        {...style},
        width && {width: width},
        color && {backgroundColor: color},
        disable && {backgroundColor: colors.GRAY_7},
      ]}
      onPress={onPress}>
      {logo && <View>{logo}</View>}
      <View style={styles.textContainer}>
        {iconLeft}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.text, titleColor && {color: titleColor}]}>
            {title}
          </Text>
          {children && <Text style={styles.text}> {children}</Text>}
        </View>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 58,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.primary_500,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
});
export default Button;
