import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

const ContactCard = ({
  onPress,
  title,
  description,
  image,
  admin,
  indicator,
  button,
}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={common.row}>
        <View style={styles.image}>
          {image ? (
            <Image source={{uri: image}} style={common.image} />
          ) : (
            <Image source={require('../assets/images/chat/Ellipse.png')} />
          )}
          {indicator && (
            <View style={styles.indicator_tick}>
              <Feather
                size={10}
                name="check"
                color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
              />
            </View>
          )}
        </View>
        <View style={{marginLeft: 20}}>
          <View style={styles.textContainer}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Bold_18
                  : common.black_Bold_18
              }>
              {title ? title : 'Jenny Wilson'}
            </Text>
          </View>
          <View style={[styles.textContainer, {marginTop: 5}]}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_14
                  : common.black_Medium_14
              }>
              {description ? description : '+1-300-555-0136'}
            </Text>
          </View>
        </View>
      </View>
      {admin && (
        <View style={styles.admin}>
          <Text style={common.p500_Bold_10}>Admin</Text>
        </View>
      )}
      {button && button}
    </TouchableOpacity>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    backgroundColor: colors.GRAY,
    borderRadius: 100,
  },
  textContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  admin: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary_500,
  },
  indicator_tick: {
    top: 45,
    left: 45,
    width: 15,
    height: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
});
