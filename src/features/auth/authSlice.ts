import { createSlice } from '@reduxjs/toolkit';

/*const initialState = {
    loading: false,
    userInfo: {},
    userToken: null,
    error: null,
    success: false,
}*/

/*const increment: CaseReducer<State, PayloadAction<number>> = (state, action) =>
    state + action.payload*/

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      count: 12,
      isLoggedIn: false
    },
    reducers: {
      saveLoginInfo: (state: authState, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      }
    }
  }
);

export type authState = {
  isLoggedIn: boolean;
};

export const { saveLoginInfo } = authSlice.actions;

export default authSlice.reducer;