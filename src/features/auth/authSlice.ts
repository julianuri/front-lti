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
		sessionId: getFromSessionStorage('sessionId', ''),
		resourceId: getFromSessionStorage('resourceId', ''),
		lineitemUrl: getFromSessionStorage('lineitemUrl', ''),
		resourceName: getFromSessionStorage('resourceName', ''),
		attempts: getFromSessionStorage('resourceName', '0'),
	},
	reducers: {
		saveLoginInfo: (state: AuthState, action) => {
			basicLogin(state, action);
			saveInSessionStorage({ key: 'role', value: action.payload.role });
			state.role = action.payload.role;
		},
		ltiLogin: (state: any, action) => {
			basicLogin(state, action);
			saveInSessionStorage(
        { key: 'role', value: action.payload.role },
				{ key: 'contextId', value: action.payload.contextId },
				{ key: 'launchId', value: action.payload.launchId },
				{ key: 'sessionId', value: action.payload.sessionId },
				{ key: 'resourceId', value: action.payload.resourceId },
				{ key: 'lineitemUrl', value: action.payload.lineitemUrl },
				{ key: 'resourceName', value: action.payload.resourceName },
				{ key: 'attempts', value: action.payload.attempts });

			state.role = action.payload.role;
			state.contextId = action.payload.contextId;
			state.launchId = action.payload.launchId;
			state.sessionId = action.payload.sessionId;
			state.resourceId = action.payload.resourceId;
			state.lineitemUrl = action.payload.lineitemUrl;
			state.resourceName = action.payload.resourceName;
			state.attempts = action.payload.attempts;
		},
		logout: (state: AuthState) => {
			state.isLoggedIn = false;
			state.userId = '0';
			state.role = '';
		}
	}
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
	role?: string;
}

export default authSlice;
