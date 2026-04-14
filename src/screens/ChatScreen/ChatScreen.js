//React Imports
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
//React Native Imports
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  Dimensions,
  StatusBar,
} from 'react-native';
//Third Party Imports
import { useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import database, { set } from '@react-native-firebase/database';
//Component or Local Imports
import SendButton from '../../assets/svg/SendButton';
import { groupMessagesByDate, getTimeFromDb } from '../../utils/CommonFuntions';
import { pickImage, uploadImage, takePhoto } from '../../Component/UploadImage';
import Loader from '../../Component/Loader';
import ImagePreviewModal from '../../Component/ImagePreviewModal';
import { Constant } from '../../utils/Constant';
import chatScreenStyles from './ChatScreenStyles';
import UserProfileView from '../../Component/UserProfileView';
import { getTheme } from '../../utils/ThemeColors';
import { showSnackbar } from '../../utils/CommonSnackBar';

const { width, height } = Dimensions.get('screen');

const ChatScreen = ({ navigation, route }) => {
  const currentUser = useSelector(state => state.user);
  const isDark = useSelector(state => state.theme?.isDark);
  const selectedUser = route.params?.user;
  const theme = getTheme(isDark);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [noChatFound, setNoChatFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // 'profile' OR 'chat'
  const [previewType, setPreviewType] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const sectionListRef = useRef();
  useEffect(() => {
    console.log('IMAGE LIST:', imageList);
  }, [imageList]);

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
  }, []);

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
    console.log('MODAL:', modalVisible);
  }, [modalVisible]);
  useEffect(() => {
    if (!currentUser?.uid || !selectedUser?.uid) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');

    setIsLoading(true);

    // Reset unread count when opening the chat
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
              marginLeft={10}
              marginRight={5}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!selectedUser?.profileImage) {
                showSnackbar({
                  msg: Constant.VALIDATION_MESSAGES.PROFILE_IMGAE_NOT_UPLOADED,
                  position: Constant.SNACKBAR.BOTTOM,
                });
                console.log('No profile image');
                return;
              }

              console.log('PROFILE CLICK:', selectedUser.profileImage);

              setPreviewType('profile'); // ✅ flag
              setPreviewImages([selectedUser.profileImage]); // single image
              setCurrentIndex(0);
              setModalVisible(true);
            }}
          >
            <UserProfileView size={35} user={selectedUser || {}} />
          </TouchableOpacity>
        </>
      ),
    });
  }, [navigation, selectedUser, isDark, theme]);

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
      console.log('ChatScreen: handleMedia called. useCamera:', useCamera);
      const asset = useCamera ? await takePhoto() : await pickImage();

      if (!asset || !asset.uri) {
        console.log('ChatScreen: No image selected or picker cancelled');
        return;
      }

      setIsLoading(true);
      console.log('ChatScreen: Uploading image:', asset.uri);
      const url = await uploadImage(asset);
      if (!url) {
        console.error('ChatScreen: Image upload failed');
        setIsLoading(false);
        return;
      }

      console.log('ChatScreen: Image uploaded successfully. Sending message...');
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
                  setPreviewType('chat'); // ✅ flag

                  // convert to string array
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBg}
        translucent={false}
      />

      {isLoading && <Loader />}
      {noChatFound ? (
        <View style={chatScreenStyles.noChat}>
          <Text style={{ color: theme.noMsgText }}>No messages yet 👋</Text>
        </View>
      ) : (
        <SectionList
          ref={sectionListRef}
          sections={messageHistory}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { date } }) => (
            <View
              style={[
                chatScreenStyles.header,
                { backgroundColor: isDark ? '#202c33' : '#d1d7db' },
              ]}
            >
              <Text
                style={[chatScreenStyles.sectiontext, { color: theme.subText }]}
              >
                {date}
              </Text>
            </View>
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      )}

      <View
        style={[
          chatScreenStyles.bottomRow,
          { paddingBottom: Platform.OS === 'ios' ? 20 : 10 },
        ]}
      >
        <View
          style={[
            chatScreenStyles.inputContainer,
            {
              backgroundColor: isDark ? '#1f2c34' : '#ffffff',
            },
          ]}
        >
          <TextInput
            style={[chatScreenStyles.input, { color: theme.text }]}
            placeholder="Type a message"
            placeholderTextColor={theme.subText}
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity
            style={chatScreenStyles.iconButton}
            onPress={() => handleMedia(false)}
          >
            <IoniconsIcon
              name="images-outline"
              size={22}
              color={theme.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={chatScreenStyles.iconButton}
            onPress={() => handleMedia(true)}
          >
            <IoniconsIcon
              name="camera-outline"
              size={22}
              color={theme.subText}
            />
          </TouchableOpacity>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[chatScreenStyles.sendBtn, { backgroundColor: theme.primary }]}
          onPress={handleSend}
        >
          <IoniconsIcon name="send" size={20} color="#fff" />
        </TouchableOpacity>
        <ImagePreviewModal
          visible={modalVisible}
          imageList={previewImages} // ✅ unified
          currentIndex={currentIndex}
          onClose={() => {
            setModalVisible(false);
            setPreviewType(null);
            setPreviewImages([]);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
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

  // Update chatList for both users
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

export default ChatScreen;
