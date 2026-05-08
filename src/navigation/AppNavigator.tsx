import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { LoginScreen, OnBoardingScreen as OnBoarding, ChatScreen } from '@screens';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const isLoggedIn = useSelector((state: any) => !!state.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppNavigator;
