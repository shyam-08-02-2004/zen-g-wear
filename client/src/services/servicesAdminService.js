import api from './api';

const servicesAdminService = {
  getServices: (params) => api.get('/services', { params }),
  getService: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.patch(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
};

export default servicesAdminService;
