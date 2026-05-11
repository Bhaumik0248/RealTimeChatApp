//React Imports
import React from 'react';
//React Native Imports
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
//Third Party Imports
import FeatherIcon from 'react-native-vector-icons/Feather';
//Component or Local Imports
import { Loader, SafeView, CustomTextInput } from '@components';
import onBoardingStyles from './OnBoardingStyles';
import { useOnBoardingHooks } from './OnBoarding.hooks';

const OnBoarding = ({ route, navigation }: { route: any; navigation: any }) => {
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
                <FeatherIcon name="user" size={40} color={theme.subText} />
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

          <Text style={[onBoardingStyles.headingText, { color: theme.text }]}>
            {forEditProfile ? 'Edit Profile' : 'Setup Profile'}
          </Text>
          <Text style={[onBoardingStyles.subText, { color: theme.subText }]}>
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

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          style={[onBoardingStyles.button, { backgroundColor: theme.primary }]}
        >
          <Text style={[onBoardingStyles.buttonText, { color: '#ffffff' }]}>
            {forEditProfile ? 'Update Profile' : 'Save & Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeView>
  );
};

export default OnBoarding;
