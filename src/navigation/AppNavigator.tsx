import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@types';

import {
  LoginScreen,
  OnBoardingScreen as OnBoarding,
  ChatScreen,
} from '@screens';
import DrawerNavigator from './DrawerNavigator';
import { Routes } from './routes';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name={Routes.Login} component={LoginScreen} />
          <Stack.Screen name={Routes.OnBoarding} component={OnBoarding} />
        </>
      ) : (
        <>
          <Stack.Screen name={Routes.Main} component={DrawerNavigator} />
          <Stack.Screen name={Routes.ChatScreen} component={ChatScreen} />
          <Stack.Screen name={Routes.OnBoarding} component={OnBoarding} />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppNavigator;
