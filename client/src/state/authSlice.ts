import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: number,
    name: string,
    email: string,
    role: string
}

interface AuthState{
    token: string|null;
    user: User | null;
}

const initialState: AuthState ={
    token: localStorage.getItem('token') || null,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{user: User; token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token')
        },
    },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;