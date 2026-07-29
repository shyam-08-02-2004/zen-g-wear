import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import { addToCart, removeFromCart, applyCoupon, removeCoupon } from '../../redux/slices/cartSlice';
import couponsService from '../../services/couponsService';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, coupon } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'fixed') {
      return Math.min(coupon.discountValue, subtotal);
    }
    const calculatedDiscount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      return Math.min(calculatedDiscount, coupon.maxDiscountAmount);
    }
    return calculatedDiscount;
  }, [coupon, subtotal]);

  const subtotalAfterDiscount = subtotal - discountAmount;
  const shippingPrice = subtotalAfterDiscount > 5000 || subtotalAfterDiscount === 0 ? 0 : 50;
  const taxPrice = 0.18 * subtotalAfterDiscount; 
  const totalPrice = subtotalAfterDiscount + shippingPrice + taxPrice;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await couponsService.validateCoupon(couponCode, subtotal);
      dispatch(applyCoupon(data.data.coupon));
      toast.success('Coupon applied!');
      setCouponCode('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col bg-[#f1f3f6] font-sans selection:bg-[#2874f0] selection:text-white">
      <main className="flex-grow max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-8 py-6 w-full">

        {cartItems.length === 0 ? (
          <div className="text-center py-32 flex flex-col items-center">
            <ShoppingBag size={64} className="text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any items to your bag yet. Discover our latest arrivals.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-900 transition-colors"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:gap-4 lg:items-start">
            
            {/* Cart Items List */}
            <div className="lg:w-[70%] bg-white rounded-sm shadow-sm">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-900">My Cart ({cartItems.length})</h1>
                <div className="text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-[#2874f0]" /> 
                  <span className="text-gray-600">Deliver to</span>
                  <span className="font-bold text-gray-900">New Delhi 110001</span>
                </div>
              </div>
              <ul className="divide-y divide-gray-100">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.li 
                      key={item.product + item.size + item.color + index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-6"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        <div className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 bg-gray-50 flex items-center justify-center p-2">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="max-w-full max-h-full object-contain" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/400x500/f5f5f5/999999?text=${encodeURIComponent(item.name.substring(0,10))}`;
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-[15px] text-gray-900 line-clamp-1 hover:text-[#2874f0]">
                                <Link to={`/product/${item.product}`}>
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="text-[13px] text-gray-500 mt-1">Seller: ZEN-G Retail</p>
                              <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-[18px] font-bold text-black">₹{item.price.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-600">
                                {item.size && (
                                  <div className="flex items-center gap-1">
                                    <span>Size: {item.size}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-[13px] font-medium text-gray-900 hidden sm:block">
                              Delivery by Tomorrow
                            </p>
                          </div>
                          
                          <div className="mt-4 flex items-center gap-6">
                            <div className="flex items-center gap-2 border border-gray-300 rounded-sm">
                              <button 
                                type="button"
                                className="px-2.5 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50" 
                                onClick={() => {
                                  if (item.quantity <= 1) dispatch(removeFromCart(item));
                                  else dispatch(addToCart({ ...item, quantity: item.quantity - 1 }));
                                }}
                              >-</button>
                              <span className="px-3 text-[14px] font-bold border-x border-gray-300 bg-white">{item.quantity}</span>
                              <button 
                                type="button"
                                className="px-2.5 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50" 
                                disabled={item.quantity >= 10}
                                onClick={() => dispatch(addToCart({ ...item, quantity: item.quantity + 1 }))}
                              >+</button>
                            </div>
                            <button className="text-[15px] font-bold uppercase hover:text-[#2874f0] transition-colors text-gray-800">
                              Save for later
                            </button>
                            <button 
                              type="button" 
                              className="text-[15px] font-bold uppercase hover:text-[#2874f0] transition-colors text-gray-800" 
                              onClick={() => dispatch(removeFromCart(item))}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 flex justify-end">
                <motion.button 
                  whileTap={{ scale: 0.98 }} 
                  type="button" 
                  onClick={checkoutHandler} 
                  className="bg-[#fb641b] py-3.5 px-10 text-[15px] font-bold text-white shadow-sm hover:shadow-md transition-shadow"
                >
                  PLACE ORDER
                </motion.button>
              </div>
            </div>

            {/* Order Summary (PRICE DETAILS) */}
            <section className="mt-4 lg:mt-0 lg:w-[30%] bg-white rounded-sm shadow-sm sticky top-[72px]">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-[15px] font-bold text-gray-500 uppercase">Price Details</h2>
              </div>
              
              <div className="p-4 sm:p-5">
                <dl className="space-y-4 text-[15px] text-gray-900">
                  <div className="flex items-center justify-between">
                    <dt>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</dt>
                    <dd>₹{subtotal.toLocaleString('en-IN')}</dd>
                  </div>
                  {coupon && (
                    <div className="flex items-center justify-between text-[#388e3c]">
                      <dt className="flex items-center gap-2">
                        Discount ({coupon.code})
                        <button onClick={() => dispatch(removeCoupon())} className="text-red-500 hover:text-red-700 text-[10px] uppercase bg-red-50 px-1 py-0.5 rounded-sm">Remove</button>
                      </dt>
                      <dd>- ₹{discountAmount.toLocaleString('en-IN')}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <dt>Delivery Charges</dt>
                    <dd className={shippingPrice === 0 ? "text-[#388e3c]" : ""}>
                      {shippingPrice === 0 ? (
                        <><span className="line-through text-gray-400 mr-1">₹50</span> Free</>
                      ) : (
                        `₹${shippingPrice}`
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Estimated Tax (18% GST)</dt>
                    <dd>₹{Math.round(taxPrice).toLocaleString('en-IN')}</dd>
                  </div>
                  


                  <div className="h-px bg-gray-200 my-4 border-t border-dashed border-gray-300"></div>
                  
                  <div className="flex items-center justify-between text-[18px] font-bold">
                    <dt>Total Amount</dt>
                    <dd>₹{Math.round(totalPrice).toLocaleString('en-IN')}</dd>
                  </div>
                </dl>
                
                <div className="mt-4 pt-4 border-t border-gray-100 border-dashed text-[#388e3c] font-bold text-sm">
                  You will save ₹{(discountAmount + 50).toLocaleString('en-IN')} on this order
                </div>
              </div>
            </section>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
