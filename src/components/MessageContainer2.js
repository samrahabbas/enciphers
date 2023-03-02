import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import {DoubleTick} from '../assets/icons/icons';
import moment from 'moment';

const MessageContainer2 = ({style, message, star, time}) => {
  const colorMode = useSelector(state => state.color.color);
  const [selected, setSelected] = useState([]);
  return (
    // <TouchableOpacity
    //   onPress={() => setSelected(false)}
    //   onLongPress={() => setSelected(true)}
    //   style={[
    //     selected && {
    //       backgroundColor: colors.primary_500_8,
    //     },
    //     {paddingBottom: 10, paddingHorizontal: 20},
    //   ]}>
    <View
      style={[
        colorMode === 'Dark' ? styles.container : styles.container_light,
        {...style},
      ]}>
      <View style={{width: '75%'}}>
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
        {star ? star : <DoubleTick />}
      </View>
    </View>
    // </TouchableOpacity>
  );
};

export default MessageContainer2;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    width: '75%',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignSelf: 'flex-start',
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: colors.DARK_3,
    backgroundColor: colors.DARK_2,
  },
  container_light: {
    marginTop: 10,
    padding: 15,
    width: '75%',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignSelf: 'flex-start',
    borderTopLeftRadius: 8,
    backgroundColor: colors.Gray_100,
  },
});
