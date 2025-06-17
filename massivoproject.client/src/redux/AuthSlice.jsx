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
            const { token, recoveryMode } = action.payload;
            state.token = token;
            state.recoveryMode = recoveryMode || false;
            localStorage.setItem('token', token);
            try {
                const decoded = jwtDecode(token);
                state.userId = decoded.sub;
                state.fullName = decoded.name;
                state.role = decoded.role;
                state.loading = false;}                                                                                     
            catch (error) {
                console.error('Error al decodificar el token:', error);
                localStorage.removeItem('token');
                state.token = null;
                state.userId = null;
                state.fullName = null;
                state.role = null;
                state.recoveryMode = false;
                state.loading = false;
            }
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
            if (token && token.split('.').length === 3) {
        try {
          const decoded = jwtDecode(token);
          state.token = token;
          state.userId = decoded.sub;
          state.fullName = decoded.name;
          state.role = decoded.role;
        } catch (error) {
          console.error('Token inválido en initializeAuth:', error);
          localStorage.removeItem('token');
          state.token = null;
          state.userId = null;
          state.fullName = null;
          state.role = null;
        }
      } else {
        // Token inexistente o malformado
        localStorage.removeItem('token');
        state.token = null;
      }
            state.loading = false;
        },
    }
});


export const { setToken, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
