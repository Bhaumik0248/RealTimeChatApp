import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { App } from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// FOR BG NOTIFICATIONS (FCM)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// FOR BG ACTIONS (TAP TO NAVIGATE)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    // Navigation will be handled when the app comes to foreground
    // or by the initial notification check in App.tsx
    console.log('Notification pressed in background');
  }
});

AppRegistry.registerComponent(appName, () => App);
