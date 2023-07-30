import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import assignmentsSlice from '../features/assigment/assignmentsSlice';
import avatarSlice from '../features/avatar/avatarSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    assignment: assignmentsSlice.reducer,
    avatarConfig: avatarSlice.reducer,
  },
});

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  assignment: assignmentsSlice.reducer,
  avatarConfig: avatarSlice.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
};


export const authSliceActions = authSlice.actions;
export const assignmentSliceActions = assignmentsSlice.actions;
export const avatarSliceActions = avatarSlice.actions;
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>
