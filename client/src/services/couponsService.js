import api from './api';

const validateCoupon = (code, purchaseAmount) => {
  return api.post('/coupons/validate', { code, purchaseAmount });
};

const couponsService = {
  validateCoupon,
};

export default couponsService;
