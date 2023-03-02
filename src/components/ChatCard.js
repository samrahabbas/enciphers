import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import {TickSquare} from '../assets/icons/icons';
import moment from 'moment';

const ChatCard = ({
  onPress,
  indicator,
  tickIndicator,
  image,
  name,
  noNum,
  desc,
  time,
  messagesNo,
  styleImage,
  onLongPress,
  containerStyle,
}) => {
  const colorMode = useSelector(state => state.color.color);

  return (
    <TouchableOpacity
      style={[styles.container, {...containerStyle}]}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.image}>
        {image ? (
          <Image
            source={{uri: image}}
            style={[common.image, {...styleImage}]}
          />
        ) : (
          <Image
            source={require('../assets/images/chat/Ellipse.png')}
            style={{...styleImage}}
          />
        )}
        {indicator && !tickIndicator && <View style={styles.indicator}></View>}
        {tickIndicator && (
          <View style={{top: 45, left: 45, position: 'absolute'}}>
            <TickSquare />
          </View>
        )}
      </View>
      <View style={{marginLeft: 20, flex: 1}}>
        <View style={styles.textContainer}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_18 : common.black_Bold_18
            }>
            {name ? name : 'Jenny Wilson'}
          </Text>
          {noNum ? (
            <View style={styles.numContainer}>
              <Text style={common.white_Bold_10}>{noNum}</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.textContainer, {marginTop: 5}]}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14
            }>
            {desc ? desc : null}
          </Text>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14
            }>
            {time ? moment(time).format('hh:mm') : null}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    backgroundColor: colors.GRAY,
    borderRadius: 100,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numContainer: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: colors.primary_500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    top: 45,
    left: 45,
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderRadius: 50,
    position: 'absolute',
    borderColor: colors.WHITE,
    backgroundColor: colors.primary_500,
  },
});
