import { combineReducers } from 'redux';
import { userReducer } from './userInfo/userReducer';
import { themeReducer } from './theme/themeReducer';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

export default rootReducer;
