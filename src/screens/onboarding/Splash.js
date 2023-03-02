import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {common} from '../../styles/styles';
import {useSelector} from 'react-redux';

const Splash = props => {
  const colorMode = useSelector(state => state.color.color);

  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('LetsYouIn');
    }, 2000);
  }, []);

  return (
    <View
      style={[
        colorMode === 'Dark' ? common.container_dark : common.container_light,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <Image
        source={require('../../assets/images/onboarding/Group.png')}
        style={{width: 300, height: 300}}
      />
      <Image
        source={require('../../assets/images/onboarding/Frame.png')}
        style={{width: 40, height: 40, marginTop: 150}}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
