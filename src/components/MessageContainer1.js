import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {DoubleTick} from '../assets/icons/icons';
import {useState} from 'react';
import moment from 'moment/moment';

const MessageContainer1 = ({style, message, star, time}) => {
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
    <View style={[styles.container, {...style}]}>
      <View style={{width: '75%'}}>
        <Text style={[common.white_Medium_18, {lineHeight: 26}]}>
          {message}
        </Text>
      </View>
      <View style={[{alignSelf: 'flex-end'}, common.row]}>
        <View style={{marginRight: 5}}>
          <Text style={common.white_Medium_12}>
            {moment(time).format('hh:mm')}
          </Text>
        </View>
        {star ? star : <DoubleTick />}
      </View>
    </View>
    // </TouchableOpacity>
  );
};

export default MessageContainer1;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    width: '75%',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 8,
    backgroundColor: colors.primary_500,
  },
});
