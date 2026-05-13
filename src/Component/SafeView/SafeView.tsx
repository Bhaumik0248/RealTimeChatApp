//React Imports
import React from 'react';
//React Native Imports
import {
  View,
  StatusBar,
  ViewStyle,
  StatusBarStyle,
  StyleSheet,
  Platform,
  StyleProp,
  KeyboardAvoidingView,
} from 'react-native';
//Third Party Imports
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
//Component or Local Imports
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
  isKeyboardAvoiding?: boolean;
  keyboardOffset?: number;
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
  isKeyboardAvoiding = false,
  keyboardOffset = 0,
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
    let content = children;

    if (enableKeyboard) {
      content = (
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

    if (isKeyboardAvoiding) {
      content = (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardOffset}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
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
