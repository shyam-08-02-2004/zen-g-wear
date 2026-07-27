import api from './api';

const getWishlist = () => {
  return api.get('/users/wishlist');
};

const addToWishlist = (productId) => {
  return api.post('/users/wishlist', { productId });
};

const removeFromWishlist = (productId) => {
  return api.delete(`/users/wishlist/${productId}`);
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
