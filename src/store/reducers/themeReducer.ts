import { SET_THEME } from '../types';

const initialState = {
  isDark: false,
};

//Actions
export const setTheme = (isDark: boolean) => ({
  type: SET_THEME,
  payload: isDark,
});

//Reducer
export const themeReducer = (
  state = initialState,
  action: { type: string; payload: boolean },
) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, isDark: action.payload };

    default:
      return state;
  }
};
