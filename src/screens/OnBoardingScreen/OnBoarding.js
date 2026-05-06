//React Imports
import React, { useState, useEffect, useLayoutEffect } from 'react';
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
  Dimensions,
  StatusBar,
} from 'react-native';
//Third Party Imports
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
//Component or Local Imports
import { Loader, pickImage, uploadImage } from '@components';
import { saveUser } from '@store';
import onBoardingStyles from './OnBoardingStyles';
import { getTheme, showSnackbar, Constant } from '@utils';

const OnBoarding = ({ route, navigation }) => {
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

  useEffect(() => {
    if (forEditProfile && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setImageUri(user.profileImage || null);
    }
  }, [forEditProfile, user]);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        onBoardingStyles.container,
        { backgroundColor: theme.background },
      ]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={onBoardingStyles.contentWrapper}>
          <ScrollView
            contentContainerStyle={[
              onBoardingStyles.scrollContent,
              { backgroundColor: theme.background },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {isLoading && <Loader />}

            <View style={onBoardingStyles.headerContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  onBoardingStyles.imageBox,
                  { backgroundColor: isDark ? '#2a3942' : '#f0f0f0' },
                ]}
                onPress={handlePickImage}
              >
                {finalImage ? (
                  <Image
                    source={{ uri: finalImage }}
                    style={onBoardingStyles.image}
                  />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <FeatherIcon name="user" color={theme.subText} />
                  </View>
                )}
                <View
                  style={[
                    onBoardingStyles.cameraIconContainer,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <FeatherIcon name="camera" size={18} color="#ffffff" />
                </View>
              </TouchableOpacity>

              <Text
                style={[onBoardingStyles.headingText, { color: theme.text }]}
              >
                {forEditProfile ? 'Edit Profile' : 'Setup Profile'}
              </Text>
              <Text
                style={[onBoardingStyles.subText, { color: theme.subText }]}
              >
                {forEditProfile
                  ? 'Update your personal details below'
                  : 'Share a few details so friends can find you'}
              </Text>
            </View>

            <View style={onBoardingStyles.inputWrapper}>
              <Text
                style={[onBoardingStyles.inputLabel, { color: theme.text }]}
              >
                First Name
              </Text>
              <View
                style={[
                  onBoardingStyles.inputContainer,
                  {
                    borderColor: firstNameError ? '#ff5252' : theme.border,
                    backgroundColor: isDark ? '#2a3942' : '#ffffff',
                  },
                ]}
              >
                <FeatherIcon
                  name="user"
                  size={20}
                  color={theme.subText}
                  style={onBoardingStyles.inputIcon}
                />
                <TextInput
                  placeholder="Enter first name"
                  placeholderTextColor={theme.subText}
                  value={firstName}
                  onChangeText={text => {
                    setFirstName(text);
                    if (firstNameError) setFirstNameError('');
                  }}
                  style={[onBoardingStyles.input, { color: theme.text }]}
                />
              </View>
              {firstNameError ? (
                <Text style={onBoardingStyles.errorText}>{firstNameError}</Text>
              ) : null}
            </View>

            <View style={onBoardingStyles.inputWrapper}>
              <Text
                style={[onBoardingStyles.inputLabel, { color: theme.text }]}
              >
                Last Name
              </Text>
              <View
                style={[
                  onBoardingStyles.inputContainer,
                  {
                    borderColor: lastNameError ? '#ff5252' : theme.border,
                    backgroundColor: isDark ? '#2a3942' : '#ffffff',
                  },
                ]}
              >
                <FeatherIcon
                  name="user"
                  size={20}
                  color={theme.subText}
                  style={onBoardingStyles.inputIcon}
                />
                <TextInput
                  placeholder="Enter last name"
                  placeholderTextColor={theme.subText}
                  value={lastName}
                  onChangeText={text => {
                    setLastName(text);
                    if (lastNameError) setLastNameError('');
                  }}
                  style={[onBoardingStyles.input, { color: theme.text }]}
                />
              </View>
              {lastNameError ? (
                <Text style={onBoardingStyles.errorText}>{lastNameError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              style={[
                onBoardingStyles.button,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={[onBoardingStyles.buttonText, { color: '#ffffff' }]}>
                {forEditProfile ? 'Update Profile' : 'Save & Continue'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OnBoarding;
