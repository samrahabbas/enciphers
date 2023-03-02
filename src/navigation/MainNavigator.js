import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/main/Home';
import SelectContacts from '../screens/main/SelectContacts';
import Chat from '../screens/main/Chat';
import VideoCall from '../screens/main/VideoCall';
import CameraScreen from '../screens/main/CameraScreen';
import VoiceCall from '../screens/main/VoiceCall';
import ContactDetails from '../screens/main/ContactDetails';
import MediaLinksDocs from '../screens/main/MediaLinksDocs';
import StarredMessages from '../screens/main/StarredMessages';
import CommonGroups from '../screens/main/CommonGroups';
import GroupChat from '../screens/main/GroupChat';
import GroupVoiceCall from '../screens/main/GroupVoiceCall';
import GroupVideoCall from '../screens/main/GroupVideoCall';
import GroupDetails from '../screens/main/GroupDetails';
import GroupSettings from '../screens/main/GroupSettings';
import GroupParticipants from '../screens/main/GroupParticipants';
import AddParticipants from '../screens/main/AddParticipants';
import InviteViaLink from '../screens/main/InviteViaLink';
import Search from '../screens/main/Search';
import ViewStatus from '../screens/main/ViewStatus';
import AddStatus from '../screens/main/AddStatus';
import CallInfo from '../screens/main/CallInfo';
import NewGroup from '../screens/main/NewGroup';
import NewGroupSubject from '../screens/main/NewGroupSubject';
import NewBroadcast from '../screens/main/NewBroadcast';
import BroadcastChat from '../screens/main/BroadcastChat';
import LinkedDevices from '../screens/main/LinkedDevices';
import LinkADevice from '../screens/main/LinkADevice';
import Settings from '../screens/main/Settings';
import Profile from '../screens/main/Profile';
import QRCode from '../screens/main/QRCode';
import AccountSettings from '../screens/settings/AccountSettings';
import ChatSettings from '../screens/settings/ChatSettings';
import NotificationSettings from '../screens/settings/NotificationSettings';
import StorageAndData from '../screens/settings/StorageAndData';
import Security from '../screens/settings/Security';
import Language from '../screens/settings/Language';
import HelpCenter from '../screens/settings/HelpCenter';
import InviteFriends from '../screens/settings/InviteFriends';
import Archived from '../screens/main/Archived';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="SelectContacts"
        component={SelectContacts}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="VoiceCall"
        component={VoiceCall}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCall}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ContactDetails"
        component={ContactDetails}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="MediaLinks"
        component={MediaLinksDocs}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="StarredMessages"
        component={StarredMessages}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CommonGroups"
        component={CommonGroups}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="GroupChat"
        component={GroupChat}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="GroupDetails"
        component={GroupDetails}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="GroupVoiceCall"
        component={GroupVoiceCall}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="GroupVideoCall"
        component={GroupVideoCall}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="GroupSettings"
        component={GroupSettings}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="GroupParticipants"
        component={GroupParticipants}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AddParticipants"
        component={AddParticipants}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="InviteViaLink"
        component={InviteViaLink}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ViewStatus"
        component={ViewStatus}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AddStatus"
        component={AddStatus}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CallInfo"
        component={CallInfo}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="NewGroup"
        component={NewGroup}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="NewGroupSubject"
        component={NewGroupSubject}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="NewBroadcast"
        component={NewBroadcast}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="BroadcastChat"
        component={BroadcastChat}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="LinkedDevices"
        component={LinkedDevices}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="LinkADevice"
        component={LinkADevice}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCode}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ChatSettings"
        component={ChatSettings}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="StorageAndData"
        component={StorageAndData}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Security"
        component={Security}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Language"
        component={Language}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenter}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="InviteFriends"
        component={InviteFriends}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Archived"
        component={Archived}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
