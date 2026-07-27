import api from './api';

const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateDetails: (data) => api.patch('/auth/update-details', data),
  updatePassword: (data) => api.patch('/auth/update-password', data),
  resendVerification: () => api.post('/auth/resend-verification'),
  deactivateAccount: () => api.delete('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export default authService;
