import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {BlueTicks, Play} from '../assets/icons/icons';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';

const AudioContainer = ({star, style, group}) => {
  const colorMode = useSelector(state => state.color.color);

  return (
    <View
      style={[
        colorMode === 'Dark' ? styles.container : styles.container_light,
        {...style},
      ]}>
      <View style={[{justifyContent: 'space-between'}, common.row]}>
        <View style={[common.row, {width: '70%'}]}>
          <Play />
          <View style={common.row}>
            <View style={styles.circle} />
            <View style={styles.line} />
          </View>
        </View>
        <View style={[common.row]}>
          <Text style={common.p500_Medium_12}>09:41</Text>
          <View style={{marginLeft: 10}}>{star ? star : <BlueTicks />}</View>
        </View>
      </View>
    </View>
  );
};

export default AudioContainer;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderRadius: 100,
    padding: 20,
    paddingVertical: 10,
    alignSelf: 'flex-end',
    width: '75%',
    backgroundColor: colors.DARK_2,
  },
  container_light: {
    marginTop: 20,
    borderRadius: 100,
    padding: 20,
    paddingVertical: 10,
    alignSelf: 'flex-end',
    width: '75%',
    backgroundColor: colors.Gray_100,
  },
  line: {
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary_500,
    width: '80%',
  },
  circle: {
    width: 12,
    height: 12,
    marginLeft: 10,
    borderRadius: 25,
    backgroundColor: colors.primary_500,
  },
});
