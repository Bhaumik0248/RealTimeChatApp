import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Layout Constants
 */
export const Layout = {
  window: {
    width,
    height,
  },
  screen: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  isSmallDevice: width < 375,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
};

/**
 * Safe Area Hooks
 */
export const useBottomInsets = () => {
  const insets = useSafeAreaInsets();
  return insets.bottom;
};

/**
 * Theme Definitions
 */
export const ThemeColors = {
  light: {
    ...DefaultTheme.colors,
    primary: '#007aff',
    background: '#e5ddd5',
    card: '#ffffff',
    text: '#000000',
    inputText: '#000000',
    subText: '#535b60',
    border: '#a0a0a0',
    notification: '#ff3b30',
    error: '#ff3b30',
    success: '#25d366',
    inputBg: '#ffffff',
    primaryBtnBg: '#007aff',
    primaryBtnText: '#ffffff',
    // Chat & Nav Specifics
    bubbleMine: '#dcf8c6',
    bubbleOther: '#ffffff',
    textMine: '#000000',
    textOther: '#000000',
    timeText: '#8696a0',
    headerBg: '#ffffff',
    headerText: '#000000',
    chatBg: '#e5ddd5',
    noMsgText: '#8696a0',
  },
  dark: {
    ...DarkTheme.colors,
    primary: '#0a84ff',
    background: '#0b141a',
    card: '#202c33',
    text: '#ffffff',
    subText: '#e9edef',
    border: '#2c3943',
    notification: '#ff453a',
    error: '#ff453a',
    success: '#00a884',
    inputBg: '#2a3942',
    primaryBtnBg: '#0a84ff',
    primaryBtnText: '#ffffff',
    // Chat & Nav Specifics
    bubbleMine: '#005c4b',
    bubbleOther: '#202c33',
    textMine: '#ffffff',
    textOther: '#ffffff',
    timeText: '#e9edef',
    headerBg: '#202c33',
    headerText: '#ffffff',
    chatBg: '#0b141a',
    noMsgText: '#e9edef',
  },
};

/**
 * Base Colors
 */
export const Colors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  ...ThemeColors.light,
};

/**
 * Navigation Helpers
 */
export const getNavigationTheme = (isDark: boolean) => ({
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: isDark ? ThemeColors.dark : ThemeColors.light,
});

export const getTheme = (isDark: boolean) =>
  isDark ? ThemeColors.dark : ThemeColors.light;
