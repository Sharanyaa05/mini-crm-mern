import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  lead: null,
  total: 0,
  page: 1,
  pages: 0,
  loading: false,
  error: null,
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    clearLead: (state) => {
      state.lead = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload || 'Request failed';
    };

    builder
      .addCase('leads/fetchList/pending', pending)
      .addCase('leads/fetchList/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.leads = payload.leads;
        state.total = payload.total;
        state.page = payload.page;
        state.pages = payload.pages;
        state.error = null;
      })
      .addCase('leads/fetchList/rejected', rejected)
      .addCase('leads/fetchOne/pending', pending)
      .addCase('leads/fetchOne/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.lead = payload;
        state.error = null;
      })
      .addCase('leads/fetchOne/rejected', rejected)
      .addCase('leads/create/pending', pending)
      .addCase('leads/create/fulfilled', (state) => {
        state.loading = false;
        state.lead = null;
        state.error = null;
      })
      .addCase('leads/create/rejected', rejected)
      .addCase('leads/update/pending', pending)
      .addCase('leads/update/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.lead = payload;
        state.error = null;
      })
      .addCase('leads/update/rejected', rejected)
      .addCase('leads/remove/pending', pending)
      .addCase('leads/remove/fulfilled', (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase('leads/remove/rejected', rejected)
      .addCase('leads/updateStatus/pending', pending)
      .addCase('leads/updateStatus/fulfilled', (state, { payload }) => {
        state.loading = false;
        const idx = state.leads.findIndex((l) => l._id === payload._id);
        if (idx !== -1) state.leads[idx] = payload;
        state.error = null;
      })
      .addCase('leads/updateStatus/rejected', rejected);
  },
});

export const { setPage, clearLead, clearError } = leadsSlice.actions;
export default leadsSlice.reducer;
