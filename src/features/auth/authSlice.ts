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
		launchId: getFromSessionStorage('launchId', '')
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
				{ key: 'launchId', value: action.payload.launchId });

			state.isStudent = action.payload.isStudent;
			state.isInstructor = action.payload.isInstructor;
			state.contextId = action.payload.contextId;
			state.launchId = action.payload.launchId;
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
