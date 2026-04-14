//React Imports
import React, { useState } from 'react';
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
  StatusBar,
} from 'react-native';
//Third Party Imports
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
//Component or Local Imports
import { saveUser } from '../../redux/userInfo/userAction';
import Loader from '../../Component/Loader';
import loginScreenStyles from './LoginScreenStyles';
import { showSnackbar } from '../../utils/CommonSnackBar';
import { Constant } from '../../utils/Constant';
import { getTheme } from '../../utils/ThemeColors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme?.isDark);

  const theme = getTheme(isDark);

  const getSafeEmail = email => {
    return email.replace(/\./g, '_').toLowerCase();
  };

  const checkUserExists = async () => {
    setIsLoading(true);
    if (!email || !password) {
      setIsLoading(false);
      showSnackbar({
        msg: Constant.VALIDATION_MESSAGES.ENTER_ALL_DETAILS,
        position: Constant.SNACKBAR.BOTTOM,
      });
      return;
    }
    if (emailError || passwordError) {
      setIsLoading(false);
      showSnackbar({
        msg: 'Please fix validation errors',
        position: Constant.SNACKBAR.BOTTOM,
      });
      return;
    }

    try {
      const safeEmail = getSafeEmail(email);
      const snapshot = await database()
        .ref(`/usersByEmail/${safeEmail}`)
        .once('value');
      const exists = snapshot.exists();
      handleAuthFlow(!exists);
    } catch (error) {
      setIsLoading(false);
      console.log('LoginScreen - checkUserExists - Catch :Error', error);
      showSnackbar({
        msg: Constant.VALIDATION_MESSAGES.SOMETHING_WENT_WRONG,
        position: Constant.SNACKBAR.BOTTOM,
      });
    }
  };

  const handleAuthFlow = async isSignup => {
    try {
      let userCredential;
      if (isSignup) {
        userCredential = await auth().createUserWithEmailAndPassword(
          email.trim(),
          password,
        );
        const uid = userCredential.user.uid;
        const safeEmail = getSafeEmail(email);
        await database().ref(`/users/${uid}`).set({
          uid,
          email: email.trim(),
          firstName: '',
          lastName: '',
          profileImage: '',
          isOnline: true,
        });

        await database().ref(`/usersByEmail/${safeEmail}`).set({
          uid,
        });

        setIsLoading(false);
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.ACCOUNT_CREATED,
          position: Constant.SNACKBAR.BOTTOM,
        });
        navigation.push(Constant.NAVIGATION_SCREEN.ONBOARDING, { uid });
      } else {
        userCredential = await auth().signInWithEmailAndPassword(
          email.trim(),
          password,
        );
        const uid = userCredential.user.uid;
        await database().ref(`/users/${uid}`).update({
          isOnline: true,
        });
        const snapshot = await database().ref(`/users/${uid}`).once('value');
        const userData = snapshot.val();

        if (!userData) {
          setIsLoading(false);
          showSnackbar({
            msg: Constant.VALIDATION_MESSAGES.USER_ID_NOT_FOUND,
            position: Constant.SNACKBAR.BOTTOM,
          });
          return;
        }

        dispatch(saveUser(userData));
        setIsLoading(false);
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.LOGGED_IN,
          position: Constant.SNACKBAR.BOTTOM,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('LoginScreen - handleAuthFlow - Catch : Error', error);
      if (error.code === 'auth/invalid-credential') {
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.INVALID_CREDENTIALS,
          position: Constant.SNACKBAR.BOTTOM,
        });
      } else if (error.code === 'auth/wrong-password') {
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.INCORRECT_PASSWORD,
          position: Constant.SNACKBAR.BOTTOM,
        });
      } else if (error.code === 'auth/user-not-found') {
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.USER_NOT_FOUND,
          position: Constant.SNACKBAR.BOTTOM,
        });
      } else {
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.SOMETHING_WENT_WRONG,
          position: Constant.SNACKBAR.BOTTOM,
        });
      }
    }
  };

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
                source={require('../../assets/images/logo.png')}
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
                  onChangeText={text => {
                    setEmail(text);
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!text.trim()) {
                      setEmailError('Email is required');
                    } else if (!regex.test(text)) {
                      setEmailError('Enter a valid email');
                    } else {
                      setEmailError('');
                    }
                  }}
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
                  onChangeText={text => {
                    setPassword(text);
                    if (!text.trim()) {
                      setPasswordError('Password is required');
                    } else if (text.length < 6) {
                      setPasswordError(
                        'Password must be at least 6 characters',
                      );
                    } else {
                      setPasswordError('');
                    }
                  }}
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
