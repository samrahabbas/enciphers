/**
 * @format
 */
import notifee, {EventType} from '@notifee/react-native';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import {socket} from './src/redux/reducers/socket';

AppRegistry.registerComponent(appName, () => App);
notifee.registerForegroundService(notification => {
  return new Promise(() => {});
});
AppRegistry.registerHeadlessTask(
  'RNCallKeepBackgroundMessage',
  () =>
    ({name, callUUID, handle}) => {
      // Make your call here
      console.log('incoming call');
      return Promise.resolve();
    },
);
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  console.log(detail, 'detail');
  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Update external API
    // await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
    //   method: 'POST',
    // });

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});
