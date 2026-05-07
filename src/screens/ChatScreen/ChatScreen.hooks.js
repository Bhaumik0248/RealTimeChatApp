import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Keyboard, TouchableOpacity, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import {
  groupMessagesByDate,
  getTimeFromDb,
  Constant,
  getTheme,
  showSnackbar,
} from '@utils';
import {
  pickImage,
  uploadImage,
  takePhoto,
  UserProfileView,
} from '@components';
import chatScreenStyles from './ChatScreenStyles';

export const useChatScreenHooks = (navigation, route) => {
  const currentUser = useSelector(state => state.user);
  const isDark = useSelector(state => state.theme?.isDark);
  const selectedUser = route.params?.user;
  const theme = getTheme(isDark);

  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [noChatFound, setNoChatFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewType, setPreviewType] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [imageList, setImageList] = useState([]);

  const sectionListRef = useRef();

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      scrollToBottom();
    });

    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, [messageHistory]);

  useEffect(() => {
    let images = [];
    messageHistory.forEach(section => {
      section.data.forEach(item => {
        if (item.msgType === 'image' && item.image) {
          images.push({
            id: item.id,
            url: item.image,
          });
        }
      });
    });
    setImageList(images);
  }, [messageHistory]);

  useEffect(() => {
    if (!currentUser?.uid || !selectedUser?.uid) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    setIsLoading(true);

    database().ref(`chatList/${currentUser.uid}/${selectedUser.uid}`).update({
      unreadCount: 0,
    });

    const ref = database()
      .ref(`chats/${chatId}/messages`)
      .orderByChild('timestamp');

    ref.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, msg]) => {
          if (msg.receiverId === currentUser.uid && !msg.isSeen) {
            database()
              .ref(`chats/${chatId}/messages/${id}`)
              .update({ isSeen: true });
          }
          return { id, ...msg };
        });

        const sorted = list.sort((a, b) => a.timestamp - b.timestamp);
        setMessageHistory(groupMessagesByDate(sorted));
        setNoChatFound(false);
      } else {
        setMessageHistory([]);
        setNoChatFound(true);
      }
      setIsLoading(false);
    });

    return () => ref.off('value');
  }, [currentUser?.uid, selectedUser?.uid]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: theme.headerBg },
      headerTintColor: theme.headerText,
      headerTitle: () => (
        <Text
          style={[chatScreenStyles.headerText, { color: theme.headerText }]}
        >
          {selectedUser?.firstName} {selectedUser?.lastName}
        </Text>
      ),
      headerLeft: () => (
        <>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FeatherIcon
              name="arrow-left"
              size={24}
              color={theme.headerText}
              style={{ marginLeft: 10, marginRight: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!selectedUser?.profileImage) {
                showSnackbar({
                  msg: Constant.VALIDATION_MESSAGES.PROFILE_IMGAE_NOT_UPLOADED,
                  position: Constant.SNACKBAR.BOTTOM,
                });
                return;
              }
              setPreviewType('profile');
              setPreviewImages([selectedUser.profileImage]);
              setCurrentIndex(0);
              setModalVisible(true);
            }}
          >
            <UserProfileView size={35} user={selectedUser || {}} />
          </TouchableOpacity>
        </>
      ),
    });
  }, [navigation, selectedUser, theme]);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      message: message.trim(),
      msgType: 'text',
    });

    setMessage('');
  };

  const scrollToBottom = () => {
    if (!sectionListRef.current || messageHistory.length === 0) return;
    const lastSection = messageHistory[messageHistory.length - 1];
    if (!lastSection?.data?.length) return;
    try {
      sectionListRef.current.scrollToLocation({
        sectionIndex: messageHistory.length - 1,
        itemIndex: lastSection.data.length - 1,
        animated: false,
      });
    } catch (e) {
      console.log('ChatScreen - scrollToBottom - Catch :Error', e);
    }
  };

  const handleMedia = async (useCamera = false) => {
    try {
      const asset = useCamera ? await takePhoto() : await pickImage();

      if (!asset || !asset.uri) return;

      setIsLoading(true);
      const url = await uploadImage(asset);
      if (!url) {
        setIsLoading(false);
        return;
      }

      await sendMessage({
        senderId: currentUser.uid,
        receiverId: selectedUser.uid,
        message: url,
        msgType: 'image',
      });
    } catch (e) {
      console.error('ChatScreen - handleMedia - Catch Error:', e);
      showSnackbar({
        msg: 'Failed to send image message.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async ({ senderId, receiverId, message, msgType }) => {
    const chatId = [senderId, receiverId].sort().join('_');
    const timestamp = database.ServerValue.TIMESTAMP;

    const newMessageRef = database().ref(`chats/${chatId}/messages`).push();
    const lastMsgText = msgType === 'text' ? message : '📷 Image';

    const updates = {};
    updates[`chats/${chatId}/messages/${newMessageRef.key}`] = {
      senderId,
      receiverId,
      message: msgType === 'text' ? message : '',
      image: msgType === 'image' ? message : '',
      msgType,
      isSeen: false,
      timestamp,
    };

    updates[`chatList/${senderId}/${receiverId}`] = {
      lastMessage: lastMsgText,
      timestamp,
      unreadCount: 0,
    };

    updates[`chatList/${receiverId}/${senderId}`] = {
      lastMessage: lastMsgText,
      timestamp,
      unreadCount: database.ServerValue.increment(1),
    };

    return database().ref().update(updates);
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
    const isMine = item.senderId === currentUser.uid;

    return (
      <View style={{ paddingVertical: 4, paddingHorizontal: 12 }}>
        <View
          style={[
            chatScreenStyles.msgContiner,
            {
              alignSelf: isMine ? 'flex-end' : 'flex-start',
              backgroundColor: isMine ? theme.bubbleMine : theme.bubbleOther,
              borderTopRightRadius: isMine ? 0 : 12,
              borderTopLeftRadius: isMine ? 12 : 0,
              padding: 10,
              maxWidth: '80%',
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1,
            },
          ]}
        >
          {item.msgType === 'image' ? (
            <TouchableOpacity
              onPress={() => {
                const index = imageList.findIndex(i => i.id === item.id);
                if (index >= 0) {
                  setPreviewType('chat');
                  const images = imageList.map(i => i.url);
                  setPreviewImages(images);
                  setCurrentIndex(index);
                  setModalVisible(true);
                }
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={[chatScreenStyles.image, { borderRadius: 8 }]}
              />
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                color: isMine ? theme.textMine : theme.textOther,
                fontSize: 16,
              }}
            >
              {item.message}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Text
              style={{ color: theme.timeText, fontSize: 11, marginRight: 2 }}
            >
              {getTimeFromDb(item.timestamp)}
            </Text>
            {isMine && (
              <IoniconsIcon
                name="checkmark-done"
                size={16}
                color={item.isSeen ? '#53bdeb' : theme.timeText}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return {
    message,
    setMessage,
    messageHistory,
    noChatFound,
    isLoading,
    modalVisible,
    setModalVisible,
    previewImages,
    setPreviewImages,
    currentIndex,
    theme,
    isDark,
    sectionListRef,
    handleSend,
    handleMedia,
    renderItem,
  };
};
