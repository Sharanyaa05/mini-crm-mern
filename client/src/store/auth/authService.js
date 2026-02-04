import api from '../../api/axios';

export const loginApi = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const registerApi = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then((res) => res.data);

export const getMeApi = () => api.get('/auth/me').then((res) => res.data);

export const getUsersApi = () => api.get('/auth/users').then((res) => res.data);
