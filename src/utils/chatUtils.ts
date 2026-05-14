//Third-party imports
import database from '@react-native-firebase/database';

export const sendMessage = async ({
  chatId,
  senderId,
  receiverId,
  message,
  msgType = 'text',
}: {
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  msgType?: 'text' | 'image';
}) => {
  try {
    const timestamp = database.ServerValue.TIMESTAMP;
    const updates: any = {};
    const newMessageRef = database().ref(`chats/${chatId}/messages`).push();

    // 1. Add Message to Chat
    updates[`chats/${chatId}/messages/${newMessageRef.key}`] = {
      senderId,
      receiverId,
      message: msgType === 'text' ? message : '',
      image: msgType === 'image' ? message : '',
      msgType,
      isSeen: false,
      timestamp,
    };

    // 2. Prepare Last Message Preview
    const lastMsgPreview = msgType === 'image' ? '📷 Image' : message;

    // 3. Update Sender's Chat List (Only specific fields)
    const senderPath = `chatList/${senderId}/${receiverId}`;
    updates[`${senderPath}/lastMessage`] = lastMsgPreview;
    updates[`${senderPath}/timestamp`] = timestamp;
    updates[`${senderPath}/unreadCount`] = 0;

    // 4. Update Receiver's Chat List (Only specific fields)
    // IMPORTANT: This preserves existing fields like 'isMuted'
    const receiverPath = `chatList/${receiverId}/${senderId}`;
    updates[`${receiverPath}/lastMessage`] = lastMsgPreview;
    updates[`${receiverPath}/timestamp`] = timestamp;
    updates[`${receiverPath}/unreadCount`] = database.ServerValue.increment(1);

    console.log('ChatUtils - Sending message, updates:', Object.keys(updates));
    return await database().ref().update(updates);
  } catch (error) {
    console.error('ChatUtils - sendMessage - Error:', error);
    throw error;
  }
};
