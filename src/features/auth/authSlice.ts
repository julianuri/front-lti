import {createSlice} from "@reduxjs/toolkit";

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
        isLoggedIn: false,
    },
    reducers: {
        incrementByAmount: (state: authState, action: any) => {
            state.count += action.payload.amount;
            localStorage.lolo = true;
            state.isLoggedIn = action.payload.isLoggedIn;
        }
    }
}
);

export type authState = {
    count: number;
    isLoggedIn: boolean;
};

export const { incrementByAmount } = authSlice.actions

export default authSlice.reducer