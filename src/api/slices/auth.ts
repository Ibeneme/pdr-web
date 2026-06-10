import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// 1. Async thunk for sending OTP
export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            // Use axiosInstance instead of axios
            const response = await axiosInstance.post('/padiman_route/admin/send-otp', { email });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to send OTP');
        }
    }
);

// 2. Async thunk for verifying OTP
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            // Use axiosInstance instead of axios
            const response = await axiosInstance.post('/padiman_route/admin/verify-otp', { email, otp });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Verification failed');
        }
    }
);

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    otpSent: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null,
    otpSent: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.otpSent = false;
            localStorage.removeItem('adminToken');
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle sendOtp
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Handle verifyOtp
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                localStorage.setItem('adminToken', action.payload.token);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;