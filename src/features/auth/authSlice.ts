import { createSlice } from '@reduxjs/toolkit';
import { getFromSessionStorage, saveInSessionStorage } from '../../utils/SessionStorage';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: getFromSessionStorage('isLoggedIn', false),
		userId: getFromSessionStorage('userId', '0'),
		isStudent: getFromSessionStorage('isStudent', false),
		isInstructor: getFromSessionStorage('isInstructor', false),
		contextId: getFromSessionStorage('contextId', '0'),
		launchId: getFromSessionStorage('launchId', ''),
		sessionId: getFromSessionStorage('sessionId', ''),
		resourceId: getFromSessionStorage('resourceId', ''),
		lineitemUrl: getFromSessionStorage('lineitemUrl', '')
	},
	reducers: {
		saveLoginInfo: (state: AuthState, action) => {
			basicLogin(state, action);
		},
		ltiLogin: (state: any, action) => {
			basicLogin(state, action);
			saveInSessionStorage({ key: 'isStudent', value: action.payload.isStudent },
				{ key: 'isInstructor', value: action.payload.isInstructor },
				{ key: 'contextId', value: action.payload.contextId },
				{ key: 'launchId', value: action.payload.launchId },
				{ key: 'sessionId', value: action.payload.sessionId },
				{ key: 'resourceId', value: action.payload.resourceId },
				{ key: 'lineitemUrl', value: action.payload.lineitemUrl });

			state.isStudent = action.payload.isStudent;
			state.isInstructor = action.payload.isInstructor;
			state.contextId = action.payload.contextId;
			state.launchId = action.payload.launchId;
			state.sessionId = action.payload.sessionId;
			state.resourceId = action.payload.resourceId;
			state.lineitemUrl = action.payload.lineitemUrl;
		},
		logout: (state: AuthState) => {
			state.isLoggedIn = false;
			state.userId = '0';
		}
	}
}
);

function basicLogin (state: AuthState, action) {
	saveInSessionStorage({ key: 'isLoggedIn', value: action.payload.isLoggedIn },
		{ key: 'userId', value: action.payload.userId });

	state.isLoggedIn = action.payload.isLoggedIn;
	state.userId = action.payload.userId;
}

export interface AuthState {
  isLoggedIn: boolean
  userId: string
}

export default authSlice;
