import { createSlice } from '@reduxjs/toolkit';
import {
  getFromSessionStorage,
  saveInSessionStorage,
} from '../../utils/SessionStorage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: getFromSessionStorage('isLoggedIn', false),
    userId: getFromSessionStorage('userId', '0'),
    role: getFromSessionStorage('role', ''),
    contextId: getFromSessionStorage('contextId', '0'),
    launchId: getFromSessionStorage('launchId', ''),
  },
  reducers: {
    saveLoginInfo: (state: AuthState, action) => {
      basicLogin(state, action);
    },
    ltiLogin: (state: any, action) => {
      basicLogin(state, action);
      saveInSessionStorage(
        { key: 'role', value: action.payload.role },
        { key: 'contextId', value: action.payload.contextId },
        { key: 'launchId', value: action.payload.launchId },
      );

      state.role = action.payload.role;
      state.contextId = action.payload.contextId;
      state.launchId = action.payload.launchId;
    },
    logout: (state: AuthState) => {
      state.isLoggedIn = false;
      state.userId = '0';
    },
  },
});

function basicLogin(state: AuthState, action: any) {
  saveInSessionStorage(
    { key: 'isLoggedIn', value: action.payload.isLoggedIn },
    { key: 'userId', value: action.payload.userId },
  );

  state.isLoggedIn = action.payload.isLoggedIn;
  state.userId = action.payload.userId;
}

export interface AuthState {
  isLoggedIn: boolean;
  userId: string;
}

export default authSlice;
