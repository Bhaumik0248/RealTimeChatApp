import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Colors } from './colors';

export const getNavigationTheme = (isDark: boolean) => ({
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: isDark ? Colors.dark : Colors.light,
});

export const getTheme = (isDark: boolean) =>
  isDark ? Colors.dark : Colors.light;
