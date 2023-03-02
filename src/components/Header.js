import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {common} from '../styles/styles';
import colors from '../constants/colors';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

const Header = ({
  title,
  right,
  left,
  headerStyle,
  customTitle,
  titleColor,
  iconColor,
  noLeft,
  style,
  onPressLeft,
}) => {
  const navigation = useNavigation();
  const colorMode = useSelector(state => state.color.color);
  return (
    <View style={[styles.container, style && {...style}]}>
      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}> */}
      {left ? (
        left
      ) : noLeft ? null : (
        <AntDesign
          name="arrowleft"
          color={
            iconColor
              ? iconColor
              : colorMode === 'Dark'
              ? colors.WHITE
              : colors.BLACK
          }
          size={26}
          onPress={onPressLeft ? onPressLeft : () => navigation.goBack()}
        />
      )}
      <View style={{marginLeft: 20}} />
      {customTitle ? (
        customTitle
      ) : (
        <View style={headerStyle}>
          <Text
            style={[
              colorMode === 'Dark'
                ? common.headerText
                : common.headerText_light,
              titleColor && {color: titleColor},
            ]}>
            {title}
          </Text>
        </View>
      )}
      {/* </View> */}
      {right && <View style={{flex: 1, alignItems: 'flex-end'}}>{right}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    //paddingTop: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});

export default Header;
