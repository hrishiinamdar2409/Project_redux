import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  logs: [],
  loading: false,
  error: null,
};

// Helper function to get the JWT token from localStorage or Redux state
const getAuthToken = (getState) => {
  const token = getState().auth.token;  // Assuming you store the token in Redux under 'auth'
  return token ? `Bearer ${token}` : null;
};

// Thunk to fetch logs with JWT token
export const fetchLogs = createAsyncThunk('calculator/fetchLogs', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getAuthToken(getState);
    const config = {
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.get('http://localhost:5000/calculations', config);
    return response.data.logs;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk to add a calculation log with JWT token
export const addCalculationLog = createAsyncThunk(
  'calculator/addCalculationLog',
  async (logEntry, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.post('http://localhost:5000/calculations', logEntry, config);
      return response.data.log;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete logs with JWT token
export const deleteLogs = createAsyncThunk(
  'calculator/deleteLogs',
  async (ids, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      const config = {
        headers: {
          Authorization: token,
        },
        data: { ids },  // Sending data in the request body for DELETE
      };
      await axios.delete('http://localhost:5000/calculations', config);
      return ids;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Logs
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
        state.loading = false;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Calculation Log
      .addCase(addCalculationLog.fulfilled, (state, action) => {
        state.logs.push(action.payload);
      })
      
      // Delete Logs
      .addCase(deleteLogs.fulfilled, (state, action) => {
        const idsToDelete = action.payload;
        state.logs = state.logs.filter(log => !idsToDelete.includes(log._id));
      });
  },
});

export default calculatorSlice.reducer;
