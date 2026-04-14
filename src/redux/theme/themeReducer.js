import { SET_THEME } from '../theme/themeAction';

const initialState = {
  isDark: false,
};

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, isDark: action.payload };

    default:
      return state;
  }
};
