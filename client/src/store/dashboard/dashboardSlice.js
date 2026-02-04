import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('dashboard/fetchStats/pending', (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase('dashboard/fetchStats/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.stats = payload;
        state.error = null;
      })
      .addCase('dashboard/fetchStats/rejected', (state, { payload }) => {
        state.loading = false;
        state.error = payload || 'Request failed';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
