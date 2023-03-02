import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import colors from '../constants/colors';

const ImageContainer = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/media/Image.png')} />
      <View style={{marginLeft: 10}}>
        <Image source={require('../assets/images/media/Image.png')} />
      </View>
    </View>
  );
};

export default ImageContainer;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
