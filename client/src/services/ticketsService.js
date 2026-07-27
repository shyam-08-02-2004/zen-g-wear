import api from './api';

const ticketsService = {
  getMyTickets: (params) => api.get('/tickets/my', { params }),
  getTicket: (id) => api.get(`/tickets/${id}`),
  createTicket: (data) => api.post('/tickets', data),
  addMessage: (id, data) => api.post(`/tickets/${id}/messages`, data),
  // Admin
  getAllTickets: (params) => api.get('/tickets', { params }),
  updateTicket: (id, data) => api.patch(`/tickets/${id}`, data),
};

export default ticketsService;
