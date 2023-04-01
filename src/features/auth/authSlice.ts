import { createSlice } from '@reduxjs/toolkit';
import { getFromLocalStorage, saveInLocalStorage } from '../../utils/LocalStorage';
import { stat } from 'fs';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: getFromLocalStorage('isLoggedIn', false),
		userId: getFromLocalStorage('userId', '0'),
		isStudent: getFromLocalStorage('isStudent', false),
		isInstructor: getFromLocalStorage('isInstructor', false),
		contextId: getFromLocalStorage('contextId', '0'),
		launchId: getFromLocalStorage('launchId', '')
	},
	reducers: {
		saveLoginInfo: (state: authState, action) => {
			basicLogin(state, action);
		},
		ltiLogin: (state: any, action) => {
			basicLogin(state, action);
			saveInLocalStorage({ key: 'isStudent', value: action.payload.isStudent },
				{ key: 'isInstructor', value: action.payload.isInstructor },
				{ key: 'contextId', value: action.payload.contextId },
				{ key: 'launchId', value: action.payload.launchId });

			state.isStudent = action.payload.isStudent;
			state.isInstructor = action.payload.isInstructor;
			state.contextId = action.payload.contextId;
			state.launchId = action.payload.launchId;
		},
		logout: (state: authState) => {
			state.isLoggedIn = false;
			state.userId = '0';
		}
	}
}
);

function basicLogin (state: authState, action) {
	saveInLocalStorage({ key: 'isLoggedIn', value: action.payload.isLoggedIn },
		{ key: 'userId', value: action.payload.userId });

	state.isLoggedIn = action.payload.isLoggedIn;
	state.userId = action.payload.userId;
}

export interface authState {
  isLoggedIn: boolean
  userId: string
}

export default authSlice;
