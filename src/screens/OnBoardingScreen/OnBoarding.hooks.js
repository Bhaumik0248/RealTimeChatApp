import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Keyboard, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { saveUser } from '@store';
import { getTheme, showSnackbar, Constant } from '@utils';
import { pickImage, uploadImage } from '@components';

export const useOnBoardingHooks = (navigation, route) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const isDark = useSelector(state => state.theme?.isDark);
  const theme = getTheme(isDark);

  const forEditProfile = route?.params?.forEditProfile ?? false;

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uid = auth().currentUser?.uid;
  const finalImage = imageUri || user?.profileImage;

  useEffect(() => {
    if (forEditProfile && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setImageUri(user.profileImage || null);
    }
  }, [forEditProfile, user]);

  useLayoutEffect(() => {
    const canGoBack = navigation.canGoBack();

    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.headerBg,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: theme.headerText,
      headerTitle: () => (
        <Text
          style={{ color: theme.headerText, fontSize: 18, fontWeight: '800' }}
        >
          {forEditProfile ? 'Edit Profile' : 'Complete Profile'}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={{ marginRight: 10, marginLeft: canGoBack ? 10 : 0 }}
        >
          <FeatherIcon name="arrow-left" size={24} color={theme.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, forEditProfile]);

  const handlePickImage = async () => {
    try {
      const asset = await pickImage();
      if (asset && asset.uri) {
        setImageUri(asset.uri);
      }
    } catch (e) {
      console.log('onBoardingScreen - handlePickImage - Catch : Error', e);
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      return;
    }
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      return;
    }

    try {
      setIsLoading(true);
      if (!uid) {
        setIsLoading(false);
        showSnackbar({
          msg: Constant.VALIDATION_MESSAGES.USER_ID_NOT_FOUND,
          position: Constant.SNACKBAR.BOTTOM,
        });
        return;
      }

      let imageUrl = imageUri;
      if (imageUri && imageUri.startsWith('file://')) {
        imageUrl = await uploadImage(imageUri);
      }

      await database()
        .ref(`/users/${uid}`)
        .update({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          profileImage: imageUrl || '',
        });

      const userSnapshot = await database().ref(`/users/${uid}`).once('value');
      const updatedUser = userSnapshot.val();
      dispatch(saveUser(updatedUser));

      setIsLoading(false);
      showSnackbar({
        msg: forEditProfile
          ? Constant.VALIDATION_MESSAGES.PROFILE_UPDATED
          : Constant.VALIDATION_MESSAGES.PROFILE_SAVED,
        position: Constant.SNACKBAR.BOTTOM,
      });

      if (forEditProfile) {
        navigation.goBack();
      }
    } catch (error) {
      console.log('onBoardingScreen - handleSubmit - Catch : Error', error);
      showSnackbar({
        msg: Constant.VALIDATION_MESSAGES.FAILED_TO_SAVE_PROFILE,
        position: Constant.SNACKBAR.BOTTOM,
      });
      setIsLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    firstNameError,
    setFirstNameError,
    lastName,
    setLastName,
    lastNameError,
    setLastNameError,
    finalImage,
    isLoading,
    isDark,
    theme,
    forEditProfile,
    handlePickImage,
    handleSubmit,
  };
};
