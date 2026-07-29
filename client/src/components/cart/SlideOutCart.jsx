import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { toggleCart, removeFromCart } from '../../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const SlideOutCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen, cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Close cart when pressing Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        dispatch(toggleCart(false));
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, dispatch]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  const handleRemove = (product, size, color) => {
    dispatch(removeFromCart({ product, size, color }));
  };

  const handleCheckout = () => {
    dispatch(toggleCart(false));
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart(false))}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-white dark:bg-gray-900 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                <ShoppingBag size={20} />
                Your Cart ({cartItems.length})
              </h2>
              <button 
                onClick={() => dispatch(toggleCart(false))}
                className="p-2 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
                    <button 
                      onClick={() => { dispatch(toggleCart(false)); navigate('/shop'); }}
                      className="mt-4 text-[#2874f0] font-bold text-sm hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={`${item.product}-${item.size}-${item.color}-${index}`} className="flex gap-4 group">
                      <div className="w-20 h-24 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-sm overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100"><ShoppingBag size={20} className="text-gray-300"/></div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link 
                              to={`/product/${item.product}`}
                              onClick={() => dispatch(toggleCart(false))}
                              className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-[#2874f0] transition-colors"
                            >
                              {item.name}
                            </Link>
                            <button 
                              onClick={() => handleRemove(item.product, item.size, item.color)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {item.size && <span>Size: <strong className="text-gray-700 dark:text-gray-300">{item.size}</strong></span>}
                            {item.color && <span>Color: <strong className="text-gray-700 dark:text-gray-300">{item.color}</strong></span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-black dark:text-white">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
                  <span className="text-xl font-black text-black dark:text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-sm shadow-md transition-all active:scale-[0.98] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideOutCart;
