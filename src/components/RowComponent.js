import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import colors from '../constants/colors';

const RowComponent = ({
  icon,
  text,
  number,
  iconRight,
  styleIconRight,
  onPress,
  red,
  style,
}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <TouchableOpacity style={[styles.container, {...style}]} onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {icon && <View style={{width: 20, alignItems: 'center'}}>{icon}</View>}
        <View style={icon && {marginLeft: 20}}>
          <Text
            style={[
              colorMode === 'Dark'
                ? common.white_Medium_18
                : common.black_Medium_18,
              red && common.red_medium_18,
            ]}>
            {text}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {number && (
          <View style={{marginRight: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              {number}
            </Text>
          </View>
        )}
        {iconRight && <View style={styleIconRight}>{iconRight}</View>}
      </View>
    </TouchableOpacity>
  );
};

export default RowComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //backgroundColor: 'yellow',
  },
});
