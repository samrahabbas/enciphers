import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {common} from '../../styles/styles';
import colors from '../../constants/colors';
import MainHeader from '../../components/MainHeader';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import ChatCard from '../../components/ChatCard';
import CallContainer from '../../components/CallContainer';

const LinkedDevices = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Linked Devices'}
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
      <View style={{paddingHorizontal: 20}}>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          {colorMode === 'Dark' ? (
            <Image
              source={require('../../assets/images/linked/LinkedBGDark.png')}
            />
          ) : (
            <Image
              source={require('../../assets/images/linked/LinkedBGLight.png')}
            />
          )}
        </View>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_18
                : common.gray_8_Medium_18
            }>
            Use Enciphers on other devices
          </Text>
        </View>
        <View style={{marginTop: 20, width: '100%'}}>
          <Button
            title={'Link a Device'}
            onPress={() => navigation.navigate('LinkADevice')}
          />
        </View>
        <View
          style={[
            colorMode === 'Dark' ? common.line : common.line_light,
            {marginVertical: 20},
          ]}
        />
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray_8_Medium_18
          }>
          Tap a device to log out.
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CallContainer
            image={require('../../assets/images/linked/GoogleChrome.png')}
            title={'Google Chrome (Mac OS)'}
            desc={'Last active today at 16:40'}
          />
          <CallContainer
            image={require('../../assets/images/linked/Xiaomi.png')}
            title={'Xiaomi Redmi Note 9 Pro Max'}
            desc={'Last active on Dec 16, 2024 | 13:56'}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default LinkedDevices;

const styles = StyleSheet.create({});
