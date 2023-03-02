import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainHeader from '../../components/MainHeader';
import {useSelector} from 'react-redux';

const LinkADevice = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Link a Device'}
        right={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle"
                color={colors.WHITE}
                size={26}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <ImageBackground
        source={require('../../assets/images/linked/LinkDeviceBG.png')}
        style={{flex: 1}}>
        <ImageBackground
          source={require('../../assets/images/linked/ShadowBG.png')}
          style={{flex: 1}}>
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Image
              source={require('../../assets/images/linked/QR.png')}
              style={{width: 370, height: 370}}
            />
          </View>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

export default LinkADevice;

const styles = StyleSheet.create({});
