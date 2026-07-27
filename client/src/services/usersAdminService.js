import api from './api';

const usersAdminService = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updateUserStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default usersAdminService;
