import { SAVE_USER, CLEAR_USER } from '../types';

const initialState = null;

//Actions
export const saveUser = (user: any) => ({
  type: SAVE_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

//Reducer
export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SAVE_USER:
      return action.payload;
    case CLEAR_USER:
      return null;
    default:
      return state;
  }
};
