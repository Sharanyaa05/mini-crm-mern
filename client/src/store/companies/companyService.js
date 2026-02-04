import api from '../../api/axios';

export const fetchCompaniesApi = (params) =>
  api.get('/companies', { params }).then((res) => res.data);

export const fetchCompanyByIdApi = (id) =>
  api.get(`/companies/${id}`).then((res) => res.data);

export const createCompanyApi = (data) =>
  api.post('/companies', data).then((res) => res.data);
