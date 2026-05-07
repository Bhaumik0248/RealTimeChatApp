//React Imports
import React from 'react';
//React Native Imports
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
//Third Party Imports
import FeatherIcon from 'react-native-vector-icons/Feather';
//Component or Local Imports
import { Loader } from '@components';
import { Images } from '@assets';
import { Constant } from '@utils';
import loginScreenStyles from './LoginScreenStyles';
import { useLoginHooks } from './LoginScreen.hooks';

const LoginScreen = ({ navigation }) => {
  const {
    email,
    emailError,
    password,
    passwordError,
    showPassword,
    isLoading,
    isDark,
    theme,
    setShowPassword,
    handleEmailChange,
    handlePasswordChange,
    checkUserExists,
  } = useLoginHooks(navigation);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        loginScreenStyles.container,
        { backgroundColor: theme.background },
      ]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={loginScreenStyles.contentWrapper}>
          <ScrollView
            contentContainerStyle={loginScreenStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {isLoading && <Loader />}

            <View style={loginScreenStyles.headerContainer}>
              <Image
                source={Images.logo}
                style={loginScreenStyles.image}
                resizeMode="contain"
              />
              <Text
                style={[loginScreenStyles.headingText, { color: theme.text }]}
              >
                {Constant.APP_NAME || 'Chat App'}
              </Text>
              <Text
                style={[loginScreenStyles.subText, { color: theme.subText }]}
              >
                Real-time chat with your friends
              </Text>
            </View>

            <View style={loginScreenStyles.inputWrapper}>
              <Text
                style={[loginScreenStyles.inputLabel, { color: theme.text }]}
              >
                Email Address
              </Text>
              <View
                style={[
                  loginScreenStyles.inputContainer,
                  {
                    borderColor: emailError ? '#ff5252' : theme.border,
                    backgroundColor: isDark ? '#2a3942' : '#ffffff',
                  },
                ]}
              >
                <FeatherIcon
                  name="mail"
                  size={20}
                  color={theme.subText}
                  style={loginScreenStyles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={!isDark ? '#2a3942' : '#ffffff'}
                  value={email}
                  onChangeText={handleEmailChange}
                  style={[loginScreenStyles.textInput, { color: theme.text }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? (
                <Text style={loginScreenStyles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={loginScreenStyles.inputWrapper}>
              <Text
                style={[loginScreenStyles.inputLabel, { color: theme.text }]}
              >
                Password
              </Text>
              <View
                style={[
                  loginScreenStyles.inputContainer,
                  {
                    borderColor: emailError ? '#ff5252' : theme.border,
                    backgroundColor: isDark ? '#2a3942' : '#ffffff',
                  },
                ]}
              >
                <FeatherIcon
                  name="lock"
                  size={20}
                  color={theme.subText}
                  style={loginScreenStyles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={!isDark ? '#2a3942' : '#ffffff'}
                  value={password}
                  onChangeText={handlePasswordChange}
                  style={[loginScreenStyles.textInput, { color: theme.text }]}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={loginScreenStyles.eyeIcon}
                >
                  <FeatherIcon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={theme.subText}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={loginScreenStyles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={checkUserExists}
              activeOpacity={0.8}
              style={[
                loginScreenStyles.button,
                { backgroundColor: theme.primaryBtnBg },
              ]}
            >
              <Text
                style={[
                  loginScreenStyles.buttonText,
                  { color: theme.primaryBtnText },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
