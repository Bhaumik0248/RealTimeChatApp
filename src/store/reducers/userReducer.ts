import { SAVE_USER, CLEAR_USER } from '../types';
import { User } from '@types';

interface UserAction {
  type: string;
  payload?: User | null;
  [key: string]: any;
}

const initialState: User | null = null;

//Actions
export const saveUser = (user: User | null) => ({
  type: SAVE_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

//Reducer
export const userReducer = (state = initialState, action: UserAction): User | null => {
  switch (action.type) {
    case SAVE_USER:
      return action.payload || null;
    case CLEAR_USER:
      return null;
    default:
      return state;
  }
};
