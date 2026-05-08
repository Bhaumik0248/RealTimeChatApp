//React Imports
import React from 'react';
//React Native Imports
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
//Third Party Imports
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
//Component or Local Imports
import { Loader, ImagePreviewModal, SafeView } from 'src/component';
import chatScreenStyles from './ChatScreenStyles';
import { useChatScreenHooks } from './ChatScreen.hooks';

const ChatScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const {
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
  } = useChatScreenHooks(navigation, route);

  return (
    <SafeView
      backgroundColor={theme.background}
      statusBarStyle={isDark ? 'light-content' : 'dark-content'}
      statusBarColor={theme.headerBg}
      translucent={false}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
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
                  style={[
                    chatScreenStyles.sectiontext,
                    { color: theme.subText },
                  ]}
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
            style={[
              chatScreenStyles.sendBtn,
              { backgroundColor: theme.primary },
            ]}
            onPress={handleSend}
          >
            <IoniconsIcon name="send" size={20} color="#fff" />
          </TouchableOpacity>

          <ImagePreviewModal
            visible={modalVisible}
            imageList={previewImages}
            currentIndex={currentIndex}
            onClose={() => {
              setModalVisible(false);
              setPreviewImages([]);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

export default ChatScreen;
