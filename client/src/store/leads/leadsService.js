import api from '../../api/axios';

export const fetchLeadsApi = (params) =>
  api.get('/leads', { params }).then((res) => res.data);

export const fetchLeadByIdApi = (id) => api.get(`/leads/${id}`).then((res) => res.data);

export const createLeadApi = (data) => api.post('/leads', data).then((res) => res.data);

export const updateLeadApi = (id, data) => api.put(`/leads/${id}`, data).then((res) => res.data);

export const deleteLeadApi = (id) => api.delete(`/leads/${id}`).then((res) => res.data);

export const updateLeadStatusApi = (id, status) =>
  api.patch(`/leads/${id}/status`, { status }).then((res) => res.data);
