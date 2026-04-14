import { DefaultTheme, DarkTheme } from '@react-navigation/native';

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

export const getNavigationTheme = isDark => ({
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: isDark ? ThemeColors.dark : ThemeColors.light,
});

export const getTheme = isDark =>
  isDark ? ThemeColors.dark : ThemeColors.light;
