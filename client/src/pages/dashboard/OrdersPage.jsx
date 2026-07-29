import { useState } from 'react';
import { Search, ShoppingBag, ChevronRight, CheckCircle2, Package, Truck, Home } from 'lucide-react';
import ApiState from '../../components/dashboard/ApiState';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import ordersService from '../../services/ordersService';
import { notify } from '../../components/ui/Toast';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrdersPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useApi(
    () => ordersService.getMyOrders({ search: search || undefined, status: status || undefined, page, limit: 10 }),
    [search, status, page]
  );

  const getStatusDisplay = (status, date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    switch(status) {
      case 'completed': 
        return { text: `Delivered on ${formattedDate}`, color: 'text-green-600', dot: 'bg-green-600', icon: <CheckCircle2 size={14}/> };
      case 'processing': 
        return { text: 'Arriving soon', color: 'text-blue-600', dot: 'bg-blue-600', icon: <Package size={14}/> };
      case 'pending': 
        return { text: 'Order Placed', color: 'text-orange-500', dot: 'bg-orange-500', icon: <Package size={14}/> };
      case 'cancelled': case 'failed': 
        return { text: 'Cancelled', color: 'text-red-500', dot: 'bg-red-500', icon: <CheckCircle2 size={14}/> };
      default: 
        return { text: status, color: 'text-gray-600', dot: 'bg-gray-600', icon: null };
    }
  };

  return (
    <div className="font-sans min-h-[500px]">
      
      {/* Filters (Desktop) */}
      <div className="hidden lg:flex items-center gap-4 mb-4">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setPage(1); setStatus(opt.value); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === opt.value 
                ? 'bg-[#2874f0] text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#2874f0] hover:text-[#2874f0]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white lg:shadow-sm border-b lg:border border-gray-200 lg:rounded-sm mb-4 lg:mb-4 flex items-center px-4 py-2">
        <input
          type="text"
          placeholder="Search your orders here"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="w-full py-2 bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-500"
        />
        <div className="bg-[#2874f0] text-white px-6 py-2 rounded-sm text-sm font-medium cursor-pointer">
          <Search size={16} className="inline-block mr-2" />
          Search Orders
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
        <div className="space-y-2 lg:space-y-4">
          {data?.orders?.map((order) => {
            const statusInfo = getStatusDisplay(order.status, order.createdAt);
            
            return (
              <div key={order._id} className="bg-white border-y lg:border border-gray-200 lg:rounded-sm hover:shadow-md transition-shadow cursor-pointer">
                {/* We map through order items because Flipkart treats items individually in the list */}
                {order.orderItems?.map((item, idx) => (
                  <Link 
                    key={idx}
                    to={`/dashboard/orders/${order._id}`} 
                    className={`flex flex-col sm:flex-row p-4 gap-4 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    {/* Left: Image & Title */}
                    <div className="flex gap-4 flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 shrink-0 rounded flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#2874f0]">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size || 'Free'} | Qty: {item.quantity}</p>
                      </div>
                    </div>

                    {/* Middle: Price */}
                    <div className="hidden sm:block w-32 shrink-0">
                      <p className="text-[15px] font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>

                    {/* Right: Status */}
                    <div className="sm:w-64 shrink-0 flex items-start gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${statusInfo.dot}`}></div>
                      <div>
                        <p className={`text-sm font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                        {order.status === 'completed' && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">Your item has been delivered</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border-r border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                Page {data.page} of {data.pages}
              </span>
              <button 
                disabled={page >= data.pages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border-l border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </ApiState>
    </div>
  );
};

export default OrdersPage;
