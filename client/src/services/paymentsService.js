import api from './api';

const paymentsService = {
  getMyPayments: (params) => api.get('/payments/my', { params }),
  getPayment: (id) => api.get(`/payments/${id}`),
  // Admin
  getAllPayments: (params) => api.get('/payments', { params }),
  updatePaymentStatus: (id, data) => api.patch(`/payments/${id}/status`, data),
};

export default paymentsService;
