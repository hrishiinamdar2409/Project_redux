import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to handle profile update
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ email, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Retrieve the token from the auth state
      const response = await axios.put(
        `http://localhost:5000/profile?email_address=${email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in Authorization header
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data; // Assuming the backend responds with updated profile data
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    homeAddress: '',
    logo: '', // Assuming there's a logo field in the user profile
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Update profile state with the updated user data
        return { ...state, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;

