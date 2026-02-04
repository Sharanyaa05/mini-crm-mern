import { createAsyncThunk } from '@reduxjs/toolkit';
import * as leadsService from './leadsService';

export const fetchList = createAsyncThunk(
  'leads/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await leadsService.fetchLeadsApi(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchOne = createAsyncThunk(
  'leads/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await leadsService.fetchLeadByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const create = createAsyncThunk(
  'leads/create',
  async (data, { rejectWithValue }) => {
    try {
      return await leadsService.createLeadApi(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const update = createAsyncThunk(
  'leads/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await leadsService.updateLeadApi(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const remove = createAsyncThunk(
  'leads/remove',
  async (id, { rejectWithValue }) => {
    try {
      await leadsService.deleteLeadApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateStatus = createAsyncThunk(
  'leads/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await leadsService.updateLeadStatusApi(id, status);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
