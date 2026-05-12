//React Imports
import React from 'react';
//React Native Imports
import { View, Text, TouchableOpacity, Image } from 'react-native';
//Third Party Imports
import FeatherIcon from 'react-native-vector-icons/Feather';
//Component or Local Imports
import { Loader, SafeView, CustomTextInput, CustomSubmitButton } from '@components';
import { Images } from '@assets';
import { Constant } from '@utils';
import loginScreenStyles from './loginScreenStyles';
import { useLoginHooks } from './loginScreen.hooks';

export const LoginScreen = ({ navigation }: { navigation: any }) => {
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
    <SafeView
      enableKeyboard={true}
      backgroundColor={theme.background}
      edges={['top', 'bottom']}
    >
      <View style={loginScreenStyles.contentWrapper}>
        {isLoading && <Loader />}

        <View style={loginScreenStyles.headerContainer}>
          <Image
            source={Images.logo}
            style={loginScreenStyles.image}
            resizeMode="contain"
          />
          <Text style={[loginScreenStyles.headingText, { color: theme.text }]}>
            {Constant.APP_NAME || 'Chat App'}
          </Text>
          <Text style={[loginScreenStyles.subText, { color: theme.subText }]}>
            Real-time chat with your friends
          </Text>
        </View>

        <CustomTextInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          leftIcon={<FeatherIcon name="mail" size={20} color={theme.subText} />}
        />

        <CustomTextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          error={passwordError}
          leftIcon={<FeatherIcon name="lock" size={20} color={theme.subText} />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FeatherIcon
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color={theme.subText}
              />
            </TouchableOpacity>
          }
        />

        <CustomSubmitButton label="Continue" onPress={checkUserExists} />
      </View>
    </SafeView>
  );
};
