import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
    token: localStorage.getItem('token') || null,
    userId: null,
    fullName: null,
    role: null,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            const token = action.payload;
            state.token = token;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            state.userId = decoded.sub;
            state.fullName = decoded.name;
            state.role = decoded.role;
            state.loading = false;
        },
        logout: (state) => {
            state.token = null;
            state.userId = null;
            state.fullName = null;
            state.role = null;
            localStorage.removeItem('token');
            state.loading = false;
        },
        initializeAuth: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                state.token = token;
                state.userId = decoded.sub;
                state.fullName = decoded.name;
                state.role = decoded.role;
            }
            state.loading = false;
        },
    }
});


export const { setToken, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
