import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// ==========================================
// 1. ASYNC THUNKS (API REQUESTS)
// ==========================================

// Helper interface for paginated API responses
interface PaginatedResponse<T> {
    success: boolean;
    count: number;
    total: number;
    page: number;
    data: T[];
}

// Fetch all collections with optional pagination parameters
export const fetchAdminData = createAsyncThunk(
    'adminData/fetchAll',
    async ({ collection, page = 1, limit = 10 }: { collection: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            // collection corresponds to: 'users', 'parcel-requests', 'parcels', 'payments', 'ride-offers', 'negotiations', 'driver-applications', 'withdrawals', and 'commissions'
            const response = await axiosInstance.get<PaginatedResponse<any>>(
                `/padiman_route/admin/data/${collection}?page=${page}&limit=${limit}`
            );
            return { collection, responseData: response.data };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || `Failed to fetch ${collection}`);
        }
    }
);

// Update Driver Application Status (Approve / Reject / Suspend)
export const updateDriverStatus = createAsyncThunk(
    'adminData/updateDriverStatus',
    async (
        { id, status, rejectionReason }: { id: string; status: 'approved' | 'rejected' | 'suspended'; rejectionReason?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.put(
                `/padiman_route/admin/data/driver-applications/${id}/status`,
                { status, rejectionReason }
            );
            return response.data.data; // Returns updated application object
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update driver status');
        }
    }
);

// Update Withdrawal Status (Approve / Reject)
export const updateWithdrawalStatus = createAsyncThunk(
    'adminData/updateWithdrawalStatus',
    async (
        { id, status }: { id: string; status: 'success' | 'failed' },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.put(
                `/padiman_route/admin/data/withdrawals/${id}/status`,
                { status }
            );
            return response.data.data; // Returns updated sub-document withdrawal entry
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update withdrawal status');
        }
    }
);

// Fetch Admin Dashboard Comprehensive Statistics Matrices
export const fetchDashboardStats = createAsyncThunk(
    'adminData/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                '/padiman_route/admin/data/dashboard-statistics'
            );
            return response.data.data; // Returns aggregated statistical payloads 
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard metrics');
        }
    }
);

// ==========================================
// 2. STATE INTERFACES & INITIAL STATE
// ==========================================

export interface DashboardStats {
    systemCounters: {
        users: number;
        activeDrivers: number;
        pendingDriverApplications: number;
        parcelRequests: number;
        activeShipmentsInTransit: number;
        rideOffers: number;
        negotiations: number;
    };
    financialSummaries: {
        grossVolumeInvoiced: number;
        liquidRevenueEarned: number;
        totalPaymentsProcessed: number;
        driverWalletBalancesEscrow: number;
        successfulPayoutsSettled: number;
        pendingPayoutsInQueue: number;
        adminCommissionEarned: number; // --- ADDED FIELD FOR 15% PLATFORM REVENUE ---
        paymentBreakdownDistribution: any[];
    };
    charts: {
        historicalThirtyDayRevenue: Array<{ date: string; revenue: number; volume: number }>;
        parcelDistributionPieChart: Array<{ status: string; count: number }>;
        negotiationComparisonMetrics: {
            successRatePercentage: number;
            totalNegotiationsCount: number;
            statusBreakdown: any[];
        };
    };
}

interface AdminDataState {
    users: any[];
    parcelRequests: any[];
    parcels: any[];
    payments: any[];
    rideOffers: any[];
    negotiations: any[];
    driverApplications: any[];
    withdrawals: any[];
    commissions: any[]; // --- ADDED FIELD FOR PERSISTED COMMISSIONS ---
    stats: DashboardStats | null;
    pagination: {
        [key: string]: { total: number; page: number; count: number };
    };
    loading: boolean;
    statsLoading: boolean;
    error: string | null;
    actionLoading: boolean;
}

const initialState: AdminDataState = {
    users: [],
    parcelRequests: [],
    parcels: [],
    payments: [],
    rideOffers: [],
    negotiations: [],
    driverApplications: [],
    withdrawals: [],
    commissions: [], // --- ADDED INITIAL STATE FIELD ---
    stats: null,
    pagination: {},
    loading: false,
    statsLoading: false,
    error: null,
    actionLoading: false,
};

// ==========================================
// 3. SLICE CONFIGURATION
// ==========================================

const adminDataSlice = createSlice({
    name: 'adminData',
    initialState,
    reducers: {
        clearAdminErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetching Pipeline Handles ---
            .addCase(fetchAdminData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminData.fulfilled, (state, action) => {
                state.loading = false;
                const { collection, responseData } = action.payload;

                // Dynamically store data records directly inside their assigned collections
                if (collection === 'users') state.users = responseData.data;
                else if (collection === 'parcel-requests') state.parcelRequests = responseData.data;
                else if (collection === 'parcels') state.parcels = responseData.data;
                else if (collection === 'payments') state.payments = responseData.data;
                else if (collection === 'ride-offers') state.rideOffers = responseData.data;
                else if (collection === 'negotiations') state.negotiations = responseData.data;
                else if (collection === 'driver-applications') state.driverApplications = responseData.data;
                else if (collection === 'withdrawals') state.withdrawals = responseData.data;
                else if (collection === 'commissions') state.commissions = responseData.data; // --- ADDED DIRECT DYNAMIC ASSET ROUTING ---

                // Capture and update corresponding metadata pagination fields
                state.pagination[collection] = {
                    total: responseData.total,
                    page: responseData.page,
                    count: responseData.count,
                };
            })
            .addCase(fetchAdminData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // --- Driver Application Action Handling Pipeline ---
            .addCase(updateDriverStatus.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateDriverStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                const updatedApp = action.payload;

                // Find and update the record right within your existing driver applications array instantly 
                const index = state.driverApplications.findIndex((app) => app._id === updatedApp._id);
                if (index !== -1) {
                    state.driverApplications[index] = updatedApp;
                }
            })
            .addCase(updateDriverStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            })

            // --- Withdrawal Status Handling Pipeline ---
            .addCase(updateWithdrawalStatus.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateWithdrawalStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                const resultData = action.payload;

                // Unpack the compound return payload if structured as { withdrawal, adminCommission }
                const updatedWithdrawal = resultData?.withdrawal ? resultData.withdrawal : resultData;

                // Locate and swap modified subdocument references on layout index map
                const index = state.withdrawals.findIndex((w) => w._id === updatedWithdrawal._id);
                if (index !== -1) {
                    state.withdrawals[index] = {
                        ...state.withdrawals[index],
                        ...updatedWithdrawal
                    };
                }
            })
            .addCase(updateWithdrawalStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            })

            // --- Dashboard Analytics Handling Pipeline ---
            .addCase(fetchDashboardStats.pending, (state) => {
                state.statsLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAdminErrors } = adminDataSlice.actions;
export default adminDataSlice.reducer;