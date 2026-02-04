import api from '../../api/axios';

export const fetchStatsApi = () => api.get('/dashboard/stats').then((res) => res.data);
