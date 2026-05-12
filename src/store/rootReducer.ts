//Third Party Imports
import { combineReducers } from 'redux';
//Component or Local Imports
import { userReducer } from './reducers/userReducer';
import { themeReducer } from './reducers/themeReducer';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

export default rootReducer;
