import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api.js';
import { User } from '../../types/index.js';

interface AuthState {
  user: User | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: !!localStorage.getItem('cc_access_token'),
  isLoading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch current user session');
  }
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      const { user, accessToken, refreshToken } = res.data.data;
      localStorage.setItem('cc_access_token', accessToken);
      localStorage.setItem('cc_refresh_token', refreshToken);
      return { user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed. Please verify credentials.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: any, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/auth/register', formData);
      const { user, accessToken, refreshToken } = res.data.data;
      localStorage.setItem('cc_access_token', accessToken);
      localStorage.setItem('cc_refresh_token', refreshToken);
      return { user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed.');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    // Ignore network failures on logout
  } finally {
    localStorage.removeItem('cc_access_token');
    localStorage.removeItem('cc_refresh_token');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    updateProfileLocally: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearAuthError, updateProfileLocally } = authSlice.actions;
export default authSlice.reducer;
