import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    // If user accesses this page directly without placing an order, redirect home
    if (!state?.orderId) {
      navigate('/shop');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { orderId, totalPrice, paymentMethod, itemsCount } = state;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-black selection:text-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-2xl w-full bg-white border border-gray-200 p-8 sm:p-12 shadow-2xl"
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full mb-6"
            >
              <CheckCircle size={40} />
            </motion.div>
            <h1 className="text-3xl font-display font-black text-black uppercase tracking-widest mb-4">Order Received!</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
              Your order has been placed but is awaiting payment verification. <br/>
              Our team will verify your UTR and confirm your order shortly.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-10">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Order Details</h2>
            
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <dt className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</dt>
                <dd className="text-sm font-bold text-black uppercase">{orderId}</dd>
              </div>
              
              <div>
                <dt className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date</dt>
                <dd className="text-sm font-bold text-black">{new Date().toLocaleDateString('en-IN')}</dd>
              </div>
              
              <div>
                <dt className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Amount Paid</dt>
                <dd className="text-sm font-bold text-black">Rs {totalPrice.toLocaleString('en-IN')}</dd>
              </div>
              
              <div>
                <dt className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Payment Method</dt>
                <dd className="text-sm font-bold text-black uppercase">{paymentMethod}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Estimated Delivery</dt>
                <dd className="text-sm font-bold text-green-600 flex items-center gap-2">
                  <Package size={16} /> 
                  By {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/dashboard/orders" 
              className="flex-1 flex items-center justify-center gap-2 border border-black px-6 py-4 text-xs font-bold text-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              <Package size={16} /> View Orders
            </Link>
            <Link 
              to="/shop" 
              className="flex-1 flex items-center justify-center gap-2 bg-black px-6 py-4 text-xs font-bold text-white uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              <Home size={16} /> Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>

        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
