import api from '../../api/axios';

export const fetchTasksApi = (params) =>
  api.get('/tasks', { params }).then((res) => res.data);

export const createTaskApi = (data) => api.post('/tasks', data).then((res) => res.data);

export const updateTaskStatusApi = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((res) => res.data);
