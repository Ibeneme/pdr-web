import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth';
import adminDataSlice from './slices/adminDataSlice';

export const store = configureStore({
    reducer: {
        auth: auth,
        adminData: adminDataSlice
    },
});

// Types for TypeScript (Optional, but highly recommended)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;