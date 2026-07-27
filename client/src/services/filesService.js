import api from './api';

const filesService = {
  getStorageStats: () => api.get('/files/storage/stats'),
};

export default filesService;
