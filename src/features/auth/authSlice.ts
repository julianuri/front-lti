import { createSlice } from '@reduxjs/toolkit';
import { getFromLocalStorage, saveInLocalStorage } from '../../utils/LocalStorage';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      count: 12,
      isLoggedIn: getFromLocalStorage('isLoggedIn', false),
      userId: getFromLocalStorage('userId', 0),
    },
    reducers: {
      saveLoginInfo: (state: authState, action) => {
        saveInLocalStorage({ key: 'isLoggedIn', value: action.payload.isLoggedIn },
          { key: 'userId', value: action.payload.userId });

        state.isLoggedIn = action.payload.isLoggedIn;
        state.userId = action.payload.userId;
      },
      logout: (state: authState) => {
        state.isLoggedIn = false;
        state.userId = 0;
      }
    }
  }
);

export type authState = {
  isLoggedIn: boolean;
  userId: number;
};

export default authSlice;
