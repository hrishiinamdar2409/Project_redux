import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// handle login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/signIn', credentials);
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        return response.data; // assuming response contains token and other user data
    } catch (error) {
        return rejectWithValue(error.response.data || 'Login failed'); // Return the error message
    }
});

// handle user registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data || 'Registration failed');
    }
});

// Async thunk to fetch user profile, including logo
export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
        const response = await axios.get('http://localhost:5000/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Assuming the API response includes primaryColor and secondaryColor
        const { primaryColor, secondaryColor } = response.data;

        // Use CSSOM to update CSS variables at runtime
        document.documentElement.style.setProperty('--app-primary-color', primaryColor);
        document.documentElement.style.setProperty('--app-secondary-color', secondaryColor);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data || 'Profile fetch failed');
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,  // Initialize token from localStorage
        user: null, // Stores the user profile, including logo
        status: null,
        error: null,
    },
    reducers: {
        // Action to logout and clear localStorage
        logoutUser: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            state.status = 'logged_out';
      
            // Clear custom CSS properties when logging out
            document.documentElement.style.removeProperty('--app-primary-color');
            document.documentElement.style.removeProperty('--app-secondary-color');
          },
    },
    extraReducers: (builder) => {
        builder
            // Handle login success
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user; // Store user profile
                state.status = 'logged_in';
                state.error = null; // Clear any previous errors
            })
            // Handle login failure
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload; // Use error message from rejectWithValue
                state.status = 'login_failed';
            })

            // Handle registration success
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'registered';
                state.error = null; // Clear any previous errors
            })
            // Handle registration failure
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload; // Use error message from rejectWithValue
                state.status = 'registration_failed';
            })

            // Handle profile fetch success (including logo)
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;  // Store user data (including logo) in Redux
                state.error = null;  // Clear any previous errors
            })
            // Handle profile fetch failure
            .addCase(fetchProfile.rejected, (state, action) => {
                state.error = action.payload; // Use error message from rejectWithValue
                state.status = 'profile_fetch_failed';
            });
    },
});

export const { logoutUser } = authSlice.actions; // Export the logout action

export default authSlice.reducer;


// Add primaryColor and secondaryColor in the profile response



