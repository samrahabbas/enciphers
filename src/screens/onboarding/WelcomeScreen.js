import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {common} from '../../styles/styles';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import {useSelector} from 'react-redux';

const WelcomeScreen = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
        <Image
          source={require('../../assets/images/avatars/Avatar-8.png')}
          style={{width: 100, height: 100}}
        />
        <Image
          source={require('../../assets/images/avatars/Avatar-7.png')}
          style={{width: 110, height: 110, marginLeft: 30}}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Image source={require('../../assets/images/avatars/Avatar-6.png')} />
        <Image source={require('../../assets/images/avatars/Avatar-5.png')} />
        <Image
          source={require('../../assets/images/avatars/Avatar-4.png')}
          style={{marginTop: 20, marginLeft: 15}}
        />
        <Image
          source={require('../../assets/images/avatars/Avatar-3.png')}
          style={{marginLeft: 25, marginTop: 50}}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../../assets/images/avatars/Avatar-2.png')}
          style={{marginTop: -20}}
        />
        <Image
          source={require('../../assets/images/avatars/Avatar.png')}
          style={{marginLeft: 50, marginTop: 40}}
        />
        <Image
          source={require('../../assets/images/avatars/Avatar-1.png')}
          style={{marginLeft: 40, marginTop: -20}}
        />
      </View>
      <View style={common.subContainer}>
        <Text style={common.p500_Bold_36}>Welcome to Enciphers!</Text>
        <View style={{paddingHorizontal: 20, marginTop: 20}}>
          <Text
            style={[
              colorMode === 'Dark'
                ? common.white_Regular_18
                : common.black_Regular_18,
              {textAlign: 'center'},
            ]}>
            The best messenger and chat app of the century to make your day
            great!
          </Text>
        </View>
        <Image
          source={require('../../assets/images/onboarding/AutoLayoutHorizontal.png')}
          style={{marginVertical: 30}}
        />
        <View style={{width: '100%'}}>
          <Button
            title={'Get Started'}
            onPress={() => navigation.navigate('LetsYouIn')}
          />
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
