//Third-party imports
import database from '@react-native-firebase/database';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
//Local imports
import { navigationRef } from './navigationRef';
let chatListListener: any = null;

export const startLocalMessageListener = (userId: string) => {
  if (chatListListener) return;

  chatListListener = database()
    .ref(`chatList/${userId}`)
    .on('child_changed', async snapshot => {
      const data = snapshot.val();
      const senderId = snapshot.key;

      if (!data || data.unreadCount === 0) return;

      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute?.name === 'ChatScreen') {
          const chatUser = (currentRoute.params as any)?.user;
          if (chatUser?.uid === senderId) return;
        }
      }

      const senderSnapshot = await database()
        .ref(`users/${senderId}`)
        .once('child_changed');
      const senderData = senderSnapshot.val();
      const senderName = senderData
        ? `${senderData.firstName} ${senderData.lastName}`
        : 'New Message';

      // Trigger Notification (Clickable)
      const channelId = await notifee.createChannel({
        id: 'local_chat',
        name: 'Chat Notifications',
      });

      await notifee.displayNotification({
        title: senderName,
        body: data.lastMessage || 'Sent you a message',
        data: {
          user: { ...senderData, uid: senderId },
        },
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    });
};

export const stopLocalMessageListener = (userId: string) => {
  if (chatListListener) {
    database().ref(`chatList/${userId}`).off('child_changed', chatListListener);
    chatListListener = null;
  }
};

const handleNotificationTap = (detail: any) => {
  const user = detail.notification?.data?.user;
  if (user && navigationRef.isReady()) {
    (navigationRef as any).navigate('ChatScreen', { user });
  }
};

notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.PRESS) {
    handleNotificationTap(detail);
  }
});

export const setupInitialNotification = async () => {
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    handleNotificationTap(initialNotification);
  }
};
