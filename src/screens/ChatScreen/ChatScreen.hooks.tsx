//React Imports
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
//React Native Imports
import { Keyboard, TouchableOpacity, Text, View, Image } from 'react-native';
//Third Party Imports
import { useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
//Component or Local Imports
import { User, Message, ChatSection, RootState } from '@types';
import {
  groupMessagesByDate,
  getTimeFromDb,
  Constant,
  getTheme,
  showSnackbar,
  sendMessage,
} from '@utils';
import {
  pickImage,
  uploadImage,
  takePhoto,
  UserProfileView,
} from '@components';
import chatScreenStyles from './chatScreenStyles';

export const useChatScreenHooks = (navigation: any, route: any) => {
  const currentUser = useSelector((state: RootState) => state.user);
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const selectedUser = route.params?.user as User;
  const theme = getTheme(isDark);

  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<ChatSection[]>([]);
  const [noChatFound, setNoChatFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [imageList, setImageList] = useState<{ id: string; url: string }[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const sectionListRef = useRef<any>(null);

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
    let images: { id: string; url: string }[] = [];
    messageHistory.forEach((section: ChatSection) => {
      section.data.forEach((item: Message) => {
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

    const muteRef = database().ref(
      `users/${currentUser.uid}/mutedChats/${selectedUser.uid}`,
    );
    muteRef.on('value', snapshot => {
      const val = !!snapshot.val();
      console.log('ChatScreen - Mute status updated from Private Settings:', val);
      setIsMuted(val);
    });

    ref.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        // Reset unread count since we are actively viewing the chat
        database()
          .ref(`chatList/${currentUser.uid}/${selectedUser.uid}`)
          .update({ unreadCount: 0 });

        const list = Object.entries(data).map(([id, msg]: [string, any]) => {
          const messageData = msg as Message;
          if (
            messageData.receiverId === currentUser?.uid &&
            !messageData.isSeen
          ) {
            database()
              .ref(`chats/${chatId}/messages/${id}`)
              .update({ isSeen: true });
          }
          return { ...messageData, id };
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

    return () => {
      ref.off('value');
      muteRef.off('value');
    };
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
      headerRight: () => (
        <TouchableOpacity onPress={toggleMute} style={{ marginRight: 15 }}>
          <IoniconsIcon
            name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
            size={24}
            color={theme.headerText}
          />
        </TouchableOpacity>
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
                  msg: Constant.VALIDATION_MESSAGES.PROFILE_IMAGE_NOT_UPLOADED,
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
  }, [navigation, selectedUser, theme, isMuted]);

  const toggleMute = async () => {
    try {
      if (!currentUser?.uid || !selectedUser?.uid) return;
      const newMuteStatus = !isMuted;
      console.log('ChatScreen - Toggling mute in Private Settings to:', newMuteStatus);
      await database()
        .ref(`users/${currentUser.uid}/mutedChats/${selectedUser.uid}`)
        .set(newMuteStatus ? true : null); // true or remove it
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !currentUser?.uid) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');

    await sendMessage({
      chatId,
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      message: message.trim(),
      msgType: 'text',
    });

    setMessage('');
  };

  const scrollToBottom = () => {
    if (!sectionListRef.current || messageHistory.length === 0) return;

    const lastSectionIndex = messageHistory.length - 1;
    const lastSection = messageHistory[lastSectionIndex];

    if (!lastSection?.data?.length) return;

    const lastItemIndex = lastSection.data.length - 1;

    requestAnimationFrame(() => {
      try {
        sectionListRef.current?.scrollToLocation({
          sectionIndex: lastSectionIndex,
          itemIndex: lastItemIndex,
          animated: true,
          viewOffset: 20,
        });
      } catch (e) {
        console.log('Scroll error:', e);
      }
    });
  };

  const handleMedia = async (useCamera = false) => {
    try {
      if (!currentUser?.uid) return;
      const asset = useCamera ? await takePhoto() : await pickImage();

      if (!asset || !asset.uri) return;

      setIsLoading(true);
      const url = await uploadImage(asset);
      if (!url) {
        setIsLoading(false);
        return;
      }

      const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');

      await sendMessage({
        chatId,
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

  const renderItem = ({ item }: { item: Message }) => {
    if (!item || !currentUser?.uid) return null;
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
    scrollToBottom,
  };
};
