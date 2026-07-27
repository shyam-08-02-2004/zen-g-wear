import api from './api';

const getProductReviews = (productId) => {
  return api.get(`/reviews/${productId}`);
};

const createReview = (reviewData) => {
  return api.post('/reviews', reviewData);
};

const reviewsService = {
  getProductReviews,
  createReview,
};

export default reviewsService;
