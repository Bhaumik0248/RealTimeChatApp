import { SAVE_USER, CLEAR_USER } from './userAction';

const initialState = null;

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER:
      return action.payload;
    case CLEAR_USER:
      return null;
    default:
      return state;
  }
};
