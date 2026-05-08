import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Colors } from './Colors';

/**
 * Navigation Helpers
 */
export const getNavigationTheme = (isDark: boolean) => ({
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: isDark ? Colors.dark : Colors.light,
});

/**
 * Theme Getters
 */
export const getTheme = (isDark: boolean) =>
  isDark ? Colors.dark : Colors.light;
