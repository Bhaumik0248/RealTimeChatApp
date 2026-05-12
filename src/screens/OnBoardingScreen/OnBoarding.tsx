//React Imports
import React, { useMemo } from 'react';
//React Native Imports
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
//Third Party Imports
import FeatherIcon from 'react-native-vector-icons/Feather';
//Component or Local Imports
import { Loader, SafeView, CustomTextInput, CustomSubmitButton } from '@components';
import getOnBoardingStyles from './onBoardingStyles';
import { useOnBoardingHooks } from './onBoarding.hooks';

export const OnBoarding = ({ route, navigation }: { route: any; navigation: any }) => {
  const {
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
  } = useOnBoardingHooks(navigation, route);

  const onBoardingStyles = useMemo(() => getOnBoardingStyles(theme, isDark), [theme, isDark]);

  return (
    <SafeView
      enableKeyboard={true}
      backgroundColor={theme.background}
      edges={['top', 'bottom']}
    >
      <View style={onBoardingStyles.contentWrapper}>
        {isLoading && <Loader />}

        <View style={onBoardingStyles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={onBoardingStyles.imageBox}
            onPress={handlePickImage}
          >
            {finalImage ? (
              <Image
                source={{ uri: finalImage }}
                style={onBoardingStyles.image}
              />
            ) : (
              <View style={onBoardingStyles.imagePlaceholder}>
                <FeatherIcon name="user" size={40} color={theme.subText} />
              </View>
            )}
            <View style={onBoardingStyles.cameraIconContainer}>
              <FeatherIcon name="camera" size={18} color="#ffffff" />
            </View>
          </TouchableOpacity>

          <Text style={onBoardingStyles.headingText}>
            {forEditProfile ? 'Edit Profile' : 'Setup Profile'}
          </Text>
          <Text style={onBoardingStyles.subText}>
            {forEditProfile
              ? 'Update your personal details below'
              : 'Share a few details so friends can find you'}
          </Text>
        </View>

        <CustomTextInput
          label="First Name"
          placeholder="Enter first name"
          value={firstName}
          onChangeText={text => {
            setFirstName(text);
            if (firstNameError) setFirstNameError('');
          }}
          error={firstNameError}
          leftIcon={<FeatherIcon name="user" size={20} color={theme.subText} />}
        />

        <CustomTextInput
          label="Last Name"
          placeholder="Enter last name"
          value={lastName}
          onChangeText={text => {
            setLastName(text);
            if (lastNameError) setLastNameError('');
          }}
          error={lastNameError}
          leftIcon={<FeatherIcon name="user" size={20} color={theme.subText} />}
        />

        <CustomSubmitButton
          onPress={handleSubmit}
          label={forEditProfile ? 'Update Profile' : 'Save & Continue'}
        />
      </View>
    </SafeView>
  );
};
