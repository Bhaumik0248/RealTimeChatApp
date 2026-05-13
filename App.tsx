import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from '@store';
import { AppNavigator } from '@navigation';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { getNavigationTheme, navigationRef, startLocalMessageListener, stopLocalMessageListener, setupInitialNotification } from '@utils';
import Toast from 'react-native-toast-message';
import { RootState } from '@types';

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <AppRoot />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const AppRoot = () => {
  const isDark = useSelector((state: any) => state.theme?.isDark);
  const user = useSelector((state: RootState) => state.user);
  const theme = getNavigationTheme(isDark);

  useEffect(() => {
    setupInitialNotification();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      startLocalMessageListener(user.uid);
    }
    return () => {
      if (user?.uid) {
        stopLocalMessageListener(user.uid);
      }
    };
  }, [user?.uid]);

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
};
