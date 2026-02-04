import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import leadsReducer from './leads/leadsSlice';
import companyReducer from './companies/companySlice';
import taskReducer from './tasks/taskSlice';
import dashboardReducer from './dashboard/dashboardSlice';

export default combineReducers({
  auth: authReducer,
  leads: leadsReducer,
  companies: companyReducer,
  tasks: taskReducer,
  dashboard: dashboardReducer,
});
