import { useState } from 'react';
import { Search, X, ShoppingBag, Eye, CheckCircle2, Package, Truck, Home, ChevronDown, ChevronUp } from 'lucide-react';
import ApiState from '../../components/dashboard/ApiState';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import ordersService from '../../services/ordersService';
import { notify } from '../../components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Successful' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrdersPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { data, loading, error, refetch } = useApi(
    () => ordersService.getMyOrders({ search: search || undefined, status: status || undefined, page, limit: 10 }),
    [search, status, page]
  );

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await ordersService.cancelOrder(cancelTarget._id);
      notify.success(`Order ${cancelTarget.orderNumber} cancelled`);
      setCancelTarget(null);
      refetch();
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="font-sans max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-black uppercase tracking-widest mb-2">My Orders</h1>
        <p className="text-sm text-gray-500 uppercase tracking-widest">Track and manage your purchases.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border border-gray-200 p-4 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search order number..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            className="w-full sm:w-48 appearance-none px-4 py-3 bg-white border border-gray-200 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-black cursor-pointer"
          >
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <ApiState
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={!data?.orders?.length}
        emptyProps={{
          icon: <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />,
          title: 'No orders found',
          description: "You haven't placed any orders yet, or none match your search.",
        }}
      >
        <div className="space-y-6">
          {data?.orders?.map((order) => (
            <div key={order._id} className="border border-gray-200 bg-white">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Order Placed</p>
                    <p className="text-sm font-bold text-black">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-sm font-bold text-black">Rs {order.totalPrice?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Order #</p>
                    <p className="text-sm font-bold text-black uppercase">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 ${getStatusStyle(order.status)}`}>
                    {order.status === 'completed' ? 'SUCCESSFUL' : order.status}
                  </span>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center shrink-0">
                    <ShoppingBag size={24} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black mb-1">{order.orderItems?.length ?? 0} Item(s) in this order</h3>
                    <p className="text-xs text-gray-500">Includes clothing, accessories, and shipping.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                    className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-black border border-black hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Eye size={14} /> {expandedOrderId === order._id ? 'Hide Details' : 'View Details'}
                  </button>
                  {['pending', 'processing'].includes(order.status) && (
                    <button 
                      onClick={() => setCancelTarget(order)}
                      className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Live Tracking Timeline */}
              <AnimatePresence>
                {expandedOrderId === order._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-200 bg-gray-50"
                  >
                    <div className="p-6 sm:p-8">
                      <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-6">Tracking Timeline</h4>
                      
                      {order.status === 'cancelled' ? (
                        <div className="flex items-center gap-4 text-red-600">
                          <X size={24} />
                          <div>
                            <p className="font-bold">Order Cancelled</p>
                            <p className="text-sm text-gray-500 mt-1">This order was cancelled and will not be shipped.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Timeline Line */}
                          <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 hidden sm:block">
                            <div 
                              className="h-full bg-green-500 transition-all duration-1000" 
                              style={{ 
                                width: order.status === 'completed' ? '100%' : 
                                       order.status === 'shipped' ? '66%' : 
                                       order.status === 'processing' ? '33%' : '0%' 
                              }}
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                            
                            {/* Step 1: Placed */}
                            <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 text-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${order.createdAt ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                                <CheckCircle2 size={20} />
                              </div>
                              <div className="text-left sm:text-center">
                                <p className={`text-xs font-bold uppercase tracking-widest ${order.createdAt ? 'text-black' : 'text-gray-400'}`}>Order Placed</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {/* Step 2: Processing */}
                            <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 text-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${['processing', 'shipped', 'out_for_delivery', 'completed'].includes(order.status) ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                                <Package size={18} />
                              </div>
                              <div className="text-left sm:text-center">
                                <p className={`text-xs font-bold uppercase tracking-widest ${['processing', 'shipped', 'out_for_delivery', 'completed'].includes(order.status) ? 'text-black' : 'text-gray-400'}`}>Processing</p>
                                {['processing', 'shipped', 'out_for_delivery', 'completed'].includes(order.status) && (
                                  <p className="text-[10px] text-gray-500 mt-0.5">Item packed</p>
                                )}
                              </div>
                            </div>

                            {/* Step 3: Shipped (Mock) */}
                            <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 text-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${['shipped', 'out_for_delivery', 'completed'].includes(order.status) ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                                <Truck size={18} />
                              </div>
                              <div className="text-left sm:text-center">
                                <p className={`text-xs font-bold uppercase tracking-widest ${['shipped', 'out_for_delivery', 'completed'].includes(order.status) ? 'text-black' : 'text-gray-400'}`}>Shipped</p>
                                {['shipped', 'out_for_delivery', 'completed'].includes(order.status) && (
                                  <p className="text-[10px] text-gray-500 mt-0.5">In transit</p>
                                )}
                              </div>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 text-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${order.status === 'completed' ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                                <Home size={18} />
                              </div>
                              <div className="text-left sm:text-center">
                                <p className={`text-xs font-bold uppercase tracking-widest ${order.status === 'completed' ? 'text-black' : 'text-gray-400'}`}>Successful</p>
                                {order.status === 'completed' && (
                                  <p className="text-[10px] text-gray-500 mt-0.5">Package delivered</p>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Order Items</h5>
                        <ul className="space-y-4">
                          {order.orderItems?.map((item, idx) => (
                            <li key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="w-16 h-20 bg-gray-200 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-black">{item.name}</p>
                                <p className="text-xs text-gray-500 uppercase mt-1">Qty: {item.quantity} {item.size ? `| ${item.size}` : ''}</p>
                                <p className="text-sm font-bold mt-2">Rs {item.price.toLocaleString('en-IN')}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Delivery Location</h5>
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-black">{order.shippingAddress?.fullName}</p>
                            <p className="text-xs text-gray-600 mt-1">{order.shippingAddress?.streetAddress}</p>
                            <p className="text-xs text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                            <p className="text-xs text-gray-600">{order.shippingAddress?.country}</p>
                          </div>
                          <div className="flex-1 h-48 sm:h-64 border border-gray-200 bg-gray-100">
                            <iframe
                              title="Delivery Location"
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${order.shippingAddress?.streetAddress || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.country || ''}`)}&output=embed`}
                              allowFullScreen
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Page {data.page} of {data.pages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black disabled:opacity-50 disabled:hover:border-gray-200 transition-colors"
              >
                Prev
              </button>
              <button 
                disabled={page >= data.pages} 
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black disabled:opacity-50 disabled:hover:border-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </ApiState>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 max-w-sm w-full border border-gray-200 shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <X size={24} />
              </div>
              <h3 className="text-lg font-bold text-center text-black mb-2 uppercase tracking-widest">Cancel Order?</h3>
              <p className="text-center text-sm text-gray-500 mb-8">
                Are you sure you want to cancel order <span className="font-bold text-black uppercase">{cancelTarget.orderNumber}</span>? This action is permanent.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Keep It
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
