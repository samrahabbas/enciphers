import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MainNavigator from './MainNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import {useDispatch, useSelector} from 'react-redux';
import {getContacts, saveContacts} from '../redux/actions/contactsAction';
import {getData, initiateApp} from '../local_db/SQLite';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contact.contacts);

  useEffect(() => {
    initiateApp();
    dispatch(getContacts());
  }, []);

  useEffect(() => {
    if (contacts) {
      getData('user').then(res => {
        if (res.length === 1) {
          dispatch(saveContacts()).then(() => {
            getData('user').then(res => console.log(res));
          });
        }
      });
    }
  }, [contacts]);

  return (
    <Drawer.Navigator
      id="MainNavigator"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}>
      <Drawer.Screen name="MainNavigator" component={MainNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
