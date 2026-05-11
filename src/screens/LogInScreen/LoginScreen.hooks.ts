import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { saveUser } from '@store';
import { showSnackbar, Constant, getTheme } from '@utils';
import { RootState } from '@types';
import { Routes } from '@navigation';

export const useLoginHooks = (navigation: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.theme?.isDark);

  const theme = getTheme(isDark);

  const getSafeEmail = (emailStr: string) => {
    return emailStr.replace(/\./g, '_').toLowerCase();
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError('Email is required');
    } else if (!regex.test(text)) {
      setEmailError('Enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text.trim()) {
      setPasswordError('Password is required');
    } else if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
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

  const handleAuthFlow = async (isSignup: boolean) => {
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
        navigation.push(Routes.OnBoarding, { uid });
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
    } catch (error: any) {
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

  return {
    email,
    password,
    emailError,
    passwordError,
    showPassword,
    isLoading,
    isDark,
    theme,
    setEmail,
    setPassword,
    setShowPassword,
    handleEmailChange,
    handlePasswordChange,
    checkUserExists,
  };
};
