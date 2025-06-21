import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import searchReducer from './SearchSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
    },
});
