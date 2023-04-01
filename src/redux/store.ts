import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import assignmentsSlice from '../features/assigment/assignmentsSlice';

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		assignment: assignmentsSlice.reducer
	}
});

export const authSliceActions = authSlice.actions;
export const assignmentSliceActions = assignmentsSlice.actions;
export default store;
