import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import DrawerNavigator from './DrawerNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {AUTHENTICATE, logout} from '../redux/actions/authAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authenticateConnect,
  CONNECT,
  connect,
} from '../redux/actions/socketAction';
import {io} from 'socket.io-client';

const Authentication = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  // useEffect(() => {
  //   getColor().then(res => dispatch({type: COLOR, color: res.toString()}));
  // }, []);

  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data !== null) {
        const parseData = JSON.parse(data);
        // console.log(parseData.token);
        return parseData;
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  const getSocket = async () => {
    try {
      const data = await AsyncStorage.getItem('socket');
      if (data !== null) {
        const parseData = JSON.parse(data);
        return parseData;
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  //dispatch(logout());

  useEffect(() => {
    //dispatch(connect()); //old
    // getSocket().then(result => {
    //   if (result) {
    //     const socket = io(result);
    //     dispatch(authenticateConnect(socket)).then(() => {
    getData().then(res => {
      if (res) {
        // console.log(res, 'res');
        // console.log(res.socket);
        // if (res.socket === undefined) {
        //   dispatch(connect()).then(() => {
        //     console.log('abc');
        //     dispatch({type: AUTHENTICATE, token: res.token, user: res.user});
        //   });
        // } else {
        //   dispatch({type: CONNECT, socket: res.socket});
        dispatch({
          type: AUTHENTICATE,
          token: res.token,
          user: res.user,
        });
        //}
      }
    });
    //     });
    //   }
    // });
  }, []);

  // const getColor = async () => {
  //   try {
  //     const color = await AsyncStorage.getItem('color');
  //     if (color !== null) {
  //       return color;
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log(error);
  //   }
  // };

  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar translucent backgroundColor={'transparent'} />
        {token ? <DrawerNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Authentication;
