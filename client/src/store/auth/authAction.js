import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from './authService';
import { setCredentials, setError, setUsers } from './authSlice';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const data = await authService.loginApi(email, password);
      dispatch(setCredentials(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue, dispatch }) => {
    try {
      const data = await authService.registerApi(name, email, password);
      dispatch(setCredentials(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    return await authService.getMeApi();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getUsers = createAsyncThunk(
  'auth/getUsers',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const users = await authService.getUsersApi();
      dispatch(setUsers(users));
      return users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
