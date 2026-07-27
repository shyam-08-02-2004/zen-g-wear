import api from './api';

const productsService = {
  getProducts: (queryString = '') => api.get(`/products${queryString.startsWith('?') ? queryString : queryString ? '?keyword=' + queryString : ''}`),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productsService;
