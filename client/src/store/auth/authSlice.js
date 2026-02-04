import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  users: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload ?? !state.loading;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError, setUsers } = authSlice.actions;
export default authSlice.reducer;
