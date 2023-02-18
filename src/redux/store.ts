import {configureStore} from "@reduxjs/toolkit";
import authSlice from '../features/auth/authSlice'

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})

export const authSliceActions = authSlice.actions;
export default store;
