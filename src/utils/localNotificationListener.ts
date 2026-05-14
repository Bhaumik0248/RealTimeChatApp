//Third-party imports
import database from '@react-native-firebase/database';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidStyle,
} from '@notifee/react-native';
import auth from '@react-native-firebase/auth';
//Local imports
import { navigationRef } from './navigationRef';
import { sendMessage } from './chatUtils';
import { Routes } from '@navigation';

let chatListListener: any = null;

const NOTIFICATION_CONSTANTS = {
  CHANNEL_ID: 'local_chat_v3',
  GROUP_ID: 'chat_messages',
  COLOR: '#007aff',
  SMALL_ICON: 'ic_stat_chat',
};

const isChatMuted = async (userId: string, senderId: string) => {
  const snapshot = await database()
    .ref(`users/${userId}/mutedChats/${senderId}`)
    .once('value');
  return !!snapshot.val();
};

const getSenderData = async (senderId: string) => {
  const snapshot = await database().ref(`users/${senderId}`).once('value');
  return snapshot.val();
};

const getFormattedMessages = async (
  chatId: string,
  count: number,
  senderName: string,
  senderImage: string,
) => {
  const snapshot = await database()
    .ref(`chats/${chatId}/messages`)
    .limitToLast(count)
    .once('value');
  const val = snapshot.val();
  if (!val) return [];

  return Object.values(val)
    .sort((a: any, b: any) => a.timestamp - b.timestamp)
    .map((m: any) => ({
      text: m.message || (m.msgType === 'image' ? '📷 Image' : ''),
      timestamp: m.timestamp,
      person: {
        name: senderName,
        icon: senderImage || 'ic_launcher',
      },
    }));
};

export const startLocalMessageListener = (userId: string) => {
  if (chatListListener) return;

  chatListListener = database()
    .ref(`chatList/${userId}`)
    .on('child_changed', async snapshot => {
      const data = snapshot.val();
      const senderId = snapshot.key;

      if (!data || data.unreadCount === 0 || !senderId) return;

      if (await isChatMuted(userId, senderId)) {
        console.log(`Notification skipped: Chat with ${senderId} is muted.`);
        return;
      }

      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute();
        if (
          currentRoute?.name === Routes.ChatScreen &&
          (currentRoute.params as any)?.user?.uid === senderId
        ) {
          return;
        }
      }

      const senderData = await getSenderData(senderId);
      const senderName = senderData
        ? `${senderData.firstName} ${senderData.lastName}`
        : 'New Message';
      const chatId = [userId, senderId].sort().join('_');
      const messagesList = await getFormattedMessages(
        chatId,
        data.unreadCount,
        senderName,
        senderData?.profileImage,
      );

      await notifee.setNotificationCategories([
        {
          id: 'chat_reply',
          actions: [
            {
              id: 'reply',
              title: 'Reply',
              input: true,
            },
          ],
        },
      ]);

      const channelId = await notifee.createChannel({
        id: NOTIFICATION_CONSTANTS.CHANNEL_ID,
        name: 'Chat Notifications',
        importance: AndroidImportance.HIGH,
      });

      const commonAndroidProps: any = {
        channelId,
        smallIcon: NOTIFICATION_CONSTANTS.SMALL_ICON,
        color: NOTIFICATION_CONSTANTS.COLOR,
        groupId: NOTIFICATION_CONSTANTS.GROUP_ID,
        timestamp:
          messagesList[messagesList.length - 1]?.timestamp || Date.now(),
        showTimestamp: true,
      };

      //Single NotifiCation
      await notifee.displayNotification({
        id: `chat_${senderId}`,
        title: senderName,
        body: data.lastMessage || 'Sent you a message',
        data: {
          user: JSON.stringify({
            ...senderData,
            uid: senderId,
          }),
        },
        ios: {
          categoryId: 'chat_reply',
        },
        android: {
          ...commonAndroidProps,
          largeIcon: senderData?.profileImage || 'ic_launcher',
          style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: senderName,
              icon: senderData?.profileImage || 'ic_launcher',
            },
            messages: messagesList,
          },
          pressAction: {
            id: 'default',
          },
          actions: [
            {
              title: 'Reply',
              pressAction: {
                id: 'reply',
              },
              input: {
                allowFreeFormInput: true,
                placeholder: 'Type your reply',
              },
            },
          ],
        },
      });

      //Group NotifiCation
      await notifee.displayNotification({
        id: 'chat_summary',
        android: {
          ...commonAndroidProps,
          groupSummary: true,
          largeIcon: 'ic_launcher',
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

const handleNotificationTap = async (detail: any) => {
  const userDataStr = detail.notification?.data?.user;
  if (!userDataStr) return;

  try {
    const user = JSON.parse(userDataStr);
    const currentUser = auth().currentUser;

    if (currentUser && user?.uid) {
      database()
        .ref(`chatList/${currentUser.uid}/${user.uid}`)
        .update({ unreadCount: 0 });
    }

    if (navigationRef.isReady()) {
      (navigationRef as any).navigate(Routes.ChatScreen, { user });
    }
  } catch (error) {
    console.error('Error handling notification tap:', error);
  }
};

notifee.onForegroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    await handleNotificationTap(detail);
  } else if (
    type === EventType.ACTION_PRESS &&
    detail.pressAction?.id === 'reply'
  ) {
    const replyText = detail.input;
    const userDataStr = detail.notification?.data?.user;
    const currentUser = auth().currentUser;

    if (replyText && userDataStr && currentUser) {
      try {
        const sender = JSON.parse(userDataStr as string);
        const chatId = [currentUser.uid, sender.uid].sort().join('_');

        await sendMessage({
          chatId,
          senderId: currentUser.uid,
          receiverId: sender.uid,
          message: replyText as string,
        });

        if (detail.notification?.id) {
          await notifee.cancelNotification(detail.notification.id);
        }
      } catch (error) {
        console.error('Error handling reply action:', error);
      }
    }
  }
});

export const setupInitialNotification = async () => {
  await notifee.requestPermission();
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    await handleNotificationTap(initialNotification);
  }
};
