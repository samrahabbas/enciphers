import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import {
  CallBlue,
  Incoming,
  Missed,
  Outgoing,
  VideoBigBlue,
  VideoBlue,
} from '../assets/icons/icons';

const CallContainer = ({
  type,
  onPressCall,
  onPressVideo,
  status,
  onPress,
  image,
  title,
  des,
  both,
}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={common.row}>
        {image ? (
          <Image source={{uri: image}} style={common.image} />
        ) : (
          <Image source={require('../assets/images/chat/Girl.png')} />
        )}

        <View style={{marginLeft: 20}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_18 : common.black_Bold_18
            }>
            {title ? title : 'Marielle Wigington'}
          </Text>
          <View style={common.row}>
            {status === 'Incoming' && (
              <View style={{marginRight: 10}}>
                <Incoming />
              </View>
            )}
            {status === 'Outgoing' && (
              <View style={{marginRight: 10}}>
                <Outgoing />
              </View>
            )}
            {status === 'Missed' && (
              <View style={{marginRight: 10}}>
                <Missed />
              </View>
            )}
            <Text style={colorMode === 'Dark' ? styles.des : styles.des_light}>
              {des ? des : 'Incoming | Today, 16:25'}
            </Text>
          </View>
        </View>
      </View>
      {type === 'audio' && (
        <TouchableOpacity onPress={onPressCall}>
          <CallBlue />
        </TouchableOpacity>
      )}
      {type === 'video' && (
        <TouchableOpacity onPress={onPressVideo}>
          <VideoBigBlue />
        </TouchableOpacity>
      )}
      {both && (
        <View style={common.row}>
          <TouchableOpacity onPress={onPressCall}>
            <CallBlue />
          </TouchableOpacity>
          <View style={{marginRight: 25}} />
          <TouchableOpacity onPress={onPressVideo}>
            <VideoBigBlue />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CallContainer;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  des: {
    color: colors.GRAY_300,
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
  },
  des_light: {
    color: colors.GRAY_7,
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
});
