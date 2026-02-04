import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [],
  company: null,
  users: [],
  total: 0,
  page: 1,
  pages: 0,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    clearCompany: (state) => {
      state.company = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
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
      .addCase('companies/fetchList/pending', pending)
      .addCase('companies/fetchList/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.companies = payload.companies;
        state.total = payload.total;
        state.page = payload.page;
        state.pages = payload.pages;
        state.error = null;
      })
      .addCase('companies/fetchList/rejected', rejected)
      .addCase('companies/fetchOne/pending', pending)
      .addCase('companies/fetchOne/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.company = payload;
        state.error = null;
      })
      .addCase('companies/fetchOne/rejected', rejected)
      .addCase('companies/create/pending', pending)
      .addCase('companies/create/fulfilled', (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase('companies/create/rejected', rejected);
  },
});

export const { setPage, clearCompany, clearError, setUsers } = companySlice.actions;
export default companySlice.reducer;
