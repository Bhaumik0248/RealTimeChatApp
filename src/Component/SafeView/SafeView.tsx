import React from 'react';
import {
  View,
  StatusBar,
  ViewStyle,
  StatusBarStyle,
  StyleSheet,
  Platform,
  StyleProp,
} from 'react-native';

import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useSelector } from 'react-redux';
import { Colors, useBottomInsets, getTheme } from '@resources';
import { RootState } from '@types';

interface SafeViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  statusBarColor?: string;
  statusBarStyle?: StatusBarStyle;
  edges?: Edge[];
  backgroundColor?: string;
  topColor?: string;
  bottomColor?: string;
  translucent?: boolean;
  enableKeyboard?: boolean;
  extraScrollHeight?: number;
}

export const SafeView = ({
  children,
  style,
  statusBarColor,
  statusBarStyle,
  edges = [],
  backgroundColor,
  topColor,
  bottomColor,
  translucent = true,
  enableKeyboard = false,
  extraScrollHeight = 0,
}: SafeViewProps) => {
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const theme = getTheme(isDark);

  const finalStatusBarStyle: StatusBarStyle =
    statusBarStyle || (isDark ? 'light-content' : 'dark-content');
  const finalStatusBarColor = statusBarColor || Colors.transparent;
  const finalBackgroundColor = backgroundColor || theme.background;

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(translucent);
      StatusBar.setBackgroundColor(finalStatusBarColor);
    }
    StatusBar.setBarStyle(finalStatusBarStyle, true);
  }, [finalStatusBarStyle, finalStatusBarColor, translucent]);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(translucent);
        StatusBar.setBackgroundColor(finalStatusBarColor);
      }
      StatusBar.setBarStyle(finalStatusBarStyle, true);
    }, [finalStatusBarStyle, finalStatusBarColor, translucent]),
  );

  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInsets();

  const isEdgeSelected = (edge: Edge): boolean => edges.includes(edge);

  const renderContent = () => {
    if (enableKeyboard) {
      return (
        <KeyboardAwareScrollView
          style={styles.keyboardAware}
          contentContainerStyle={styles.keyboardAwareContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={extraScrollHeight}
          bounces={false}
        >
          {children}
        </KeyboardAwareScrollView>
      );
    }
    return children;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={finalStatusBarColor}
        barStyle={finalStatusBarStyle}
        translucent={translucent}
      />
      {isEdgeSelected('top') && (
        <View
          style={{
            height: insets.top,
            backgroundColor: topColor || finalBackgroundColor,
          }}
        />
      )}
      <View
        style={[
          styles.container,
          { backgroundColor: finalBackgroundColor },
          style,
        ]}
      >
        {renderContent()}
      </View>
      {isEdgeSelected('bottom') && (
        <View
          style={{
            height: bottomInset,
            backgroundColor: bottomColor || finalBackgroundColor,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAware: {
    flex: 1,
  },
  keyboardAwareContent: {
    flexGrow: 1,
  },
});


