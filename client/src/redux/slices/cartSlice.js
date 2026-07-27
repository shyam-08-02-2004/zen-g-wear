import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const couponFromStorage = localStorage.getItem('cartCoupon')
  ? JSON.parse(localStorage.getItem('cartCoupon'))
  : null;

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: {},
  coupon: couponFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product && x.size === item.size && x.color === item.color);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product && x.size === existItem.size && x.color === existItem.color ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => !(x.product === action.payload.product && x.size === action.payload.size && x.color === action.payload.color)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.coupon = null;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.removeItem('cartCoupon');
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      localStorage.setItem('cartCoupon', JSON.stringify(state.coupon));
    },
    removeCoupon: (state) => {
      state.coupon = null;
      localStorage.removeItem('cartCoupon');
    }
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, clearCartItems, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
