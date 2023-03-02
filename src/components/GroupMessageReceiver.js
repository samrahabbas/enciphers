import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import {DoubleTick} from '../assets/icons/icons';
import moment from 'moment';

const GroupMessageReceiver = ({style, message, star, time, name}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={[
        colorMode === 'Dark' ? styles.container : styles.container_light,
        {...style},
      ]}>
      <View style={{marginBottom: 10}}>
        <Text style={common.p500_Medium_16}>{name}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '80%'}}>
          <Text
            style={[
              colorMode === 'Dark'
                ? common.white_Medium_18
                : common.black_Medium_18,
              {lineHeight: 26},
            ]}>
            {message}
          </Text>
        </View>
        <View style={[{alignSelf: 'flex-end'}, common.row]}>
          <View style={{marginRight: 5}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_12
                  : common.gray_Medium_12
              }>
              {moment(time).format('hh:mm')}
            </Text>
          </View>
          {/* {star ? star : <DoubleTick />} */}
        </View>
      </View>
    </View>
  );
};

export default GroupMessageReceiver;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    width: '75%',
    borderRadius: 20,
    borderTopLeftRadius: 8,
    backgroundColor: colors.DARK_3,
  },
  container_light: {
    marginTop: 20,
    padding: 15,
    width: '75%',
    borderRadius: 20,
    borderTopLeftRadius: 8,
    backgroundColor: colors.Gray_100,
  },
});
