import { createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardService from './dashboardService';

export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.fetchStatsApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
