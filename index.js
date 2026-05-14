import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { App } from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import notifee, { EventType } from '@notifee/react-native';
import { sendMessage } from './src/utils/chatUtils';

// FOR BG NOTIFICATIONS (FCM)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// FOR BG ACTIONS (TAP TO NAVIGATE)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const userDataStr = detail.notification?.data?.user;
  const currentUser = auth().currentUser;

  if (type === EventType.PRESS) {
    if (userDataStr && currentUser) {
      try {
        const sender = JSON.parse(userDataStr);
        await database()
          .ref(`chatList/${currentUser.uid}/${sender.uid}`)
          .update({ unreadCount: 0 });
      } catch (e) {
        console.error('Error resetting unread count in background:', e);
      }
    }
  } else if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
    const replyText = detail.input;
    if (replyText && userDataStr && currentUser) {
      try {
        const sender = JSON.parse(userDataStr);
      const chatId = [currentUser.uid, sender.uid].sort().join('_');
        await sendMessage({
          chatId,
          senderId: currentUser.uid,
          receiverId: sender.uid,
          message: replyText,
        });

      // Remove the notification after replying
      if (detail.notification?.id) {
        await notifee.cancelNotification(detail.notification.id);
      }
      } catch (e) {
        console.error('Error in background reply:', e);
      }
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
