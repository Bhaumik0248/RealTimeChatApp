import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LoginScreen from '../screens/LogInScreen/LoginScreen';
import OnBoarding from '../screens/OnBoardingScreen/OnBoarding';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isLoggedIn = useSelector(state => !!state.user);

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
