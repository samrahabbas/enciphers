import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDrawerStatus} from '@react-navigation/drawer';
import {common} from '../styles/styles';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import colors from '../constants/colors';
import {COLOR} from '../redux/actions/colorAction';

const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const colorMode = useSelector(state => state.color.color);
  const user = useSelector(state => state.auth.user);

  const themeChange = () => {
    if (colorMode === 'Dark') {
      dispatch({type: COLOR, color: 'light'});
      //AsyncStorage.setItem('color', 'light');
    }
    if (colorMode === 'light') {
      dispatch({type: COLOR, color: 'Dark'});
      //AsyncStorage.setItem('color', 'Dark');
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={
        colorMode === 'Dark' ? styles.container : styles.container_light
      }>
      <View style={colorMode === 'Dark' ? styles.header : styles.header_light}>
        {/* <StatusBar
          backgroundColor={
            colorMode === 'Dark' ? colors.DARK_2 : colors.primary_300
          }
        /> */}
        <View style={styles.row}>
          <View style={common.iconContainer}>
            <Text style={common.white_Bold_20}>E</Text>
          </View>
          <TouchableOpacity onPress={themeChange}>
            {colorMode === 'Dark' ? (
              <MaterialCommunityIcons
                name="white-balance-sunny"
                color={colors.WHITE}
                size={25}
              />
            ) : (
              <Entypo name="moon" color={colors.WHITE} size={25} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={common.white_Medium_18}>{user?.username}</Text>
          <Text style={common.gray2_Medium_16}>+1 123 456 789</Text>
        </View>
      </View>
      <View style={{marginTop: 20, paddingHorizontal: 20}}>
        <View style={common.row}>
          <Feather name="users" color={colors.GRAY_2} size={20} />
          <View style={{marginLeft: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              New Group
            </Text>
          </View>
        </View>
        <View style={[common.row, {marginTop: 20}]}>
          <Feather name="user" color={colors.GRAY_2} size={20} />
          <View style={{marginLeft: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              Contacts
            </Text>
          </View>
        </View>
        <View style={[common.row, {marginTop: 20}]}>
          <Ionicons name="call-outline" color={colors.GRAY_2} size={20} />
          <View style={{marginLeft: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              Calls
            </Text>
          </View>
        </View>
        <View style={[common.row, {marginTop: 20}]}>
          <MaterialCommunityIcons
            name="nature-people"
            color={colors.GRAY_2}
            size={20}
          />
          <View style={{marginLeft: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              People Nearby
            </Text>
          </View>
        </View>
        <View style={[common.row, {marginTop: 20}]}>
          <Ionicons name="bookmark-outline" color={colors.GRAY_2} size={20} />
          <View style={{marginLeft: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              Saved Messages
            </Text>
          </View>
        </View>
        <View style={[common.row, {marginTop: 20}]}>
          <Ionicons name="settings-outline" color={colors.GRAY_2} size={20} />
          <View style={{marginLeft: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.black_Medium_18
              }>
              Settings
            </Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DARK_1,
    flex: 1,
  },
  container_light: {
    backgroundColor: colors.WHITE,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: -4,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.DARK_2,
  },
  header_light: {
    marginTop: -4,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.primary_300,
  },
});

export default CustomDrawerContent;
