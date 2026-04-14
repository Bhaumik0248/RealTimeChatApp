export const SET_THEME = 'SET_THEME';

export const setTheme = isDark => ({
  type: SET_THEME,
  payload: isDark,
});
