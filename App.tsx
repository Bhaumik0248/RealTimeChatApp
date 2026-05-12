import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from '@store';
import { AppNavigator } from '@navigation';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { getNavigationTheme } from '@utils';
import Toast from 'react-native-toast-message';

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
  const theme = getNavigationTheme(isDark);

  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
};


