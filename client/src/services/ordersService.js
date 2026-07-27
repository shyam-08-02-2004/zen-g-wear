import api from './api';

const ordersService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  // Admin
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
};

export default ordersService;
