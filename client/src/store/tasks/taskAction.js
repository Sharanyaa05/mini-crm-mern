import { createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from './taskService';

export const fetchList = createAsyncThunk(
  'tasks/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await taskService.fetchTasksApi(params || {});
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const create = createAsyncThunk(
  'tasks/create',
  async (data, { rejectWithValue }) => {
    try {
      return await taskService.createTaskApi(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await taskService.updateTaskStatusApi(id, status);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
