import { createAsyncThunk } from '@reduxjs/toolkit';
import * as companyService from './companyService';

export const fetchList = createAsyncThunk(
  'companies/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await companyService.fetchCompaniesApi(params || {});
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchOne = createAsyncThunk(
  'companies/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await companyService.fetchCompanyByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const create = createAsyncThunk(
  'companies/create',
  async (data, { rejectWithValue }) => {
    try {
      return await companyService.createCompanyApi(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
