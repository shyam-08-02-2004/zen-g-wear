import api from './api';

const questionsService = {
  getQuestionsByProduct: (productId) => api.get(`/questions/product/${productId}`),
  addQuestion: (productId, data) => api.post(`/questions/product/${productId}`, data),
  answerQuestion: (id, data) => api.patch(`/questions/${id}/answer`, data),
};

export default questionsService;
