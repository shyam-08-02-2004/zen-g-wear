import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, CheckCircle, Package, Eye, MapPin, Phone, Mail, User, ShoppingBag, ChevronDown, X, Ban } from 'lucide-react';
import ordersService from '../../services/ordersService';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  completed: { label: '✓ Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Bulk Actions State
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isBulking, setIsBulking] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersService.getAllOrders({ limit: 200, sortBy: 'createdAt', order: 'desc' });
      setOrders(data?.data || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently BAN this user? They will not be able to log in or place orders.")) return;
    try {
      await api.patch(`/users/${userId}/status`, { isActive: false });
      toast.success("User has been permanently banned.");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to ban user.");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus, isPaid = undefined) => {
    setUpdatingId(orderId);
    try {
      const payload = { status: newStatus };
      if (isPaid !== undefined) payload.isPaid = isPaid;
      await ordersService.updateOrderStatus(orderId, payload);
      toast.success('Order updated!');
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus, ...(isPaid !== undefined && { isPaid }) } : o));
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    setIsBulking(true);
    
    try {
      const promises = selectedOrders.map(orderId => 
        ordersService.updateOrderStatus(orderId, { status: bulkAction })
      );
      await Promise.all(promises);
      
      toast.success(`${selectedOrders.length} orders updated successfully!`);
      setOrders(orders.map(o => selectedOrders.includes(o._id) ? { ...o, status: bulkAction } : o));
      setSelectedOrders([]); // clear selection
      setBulkAction(''); // reset dropdown
    } catch (err) {
      console.error(err);
      toast.error('Failed to update some orders in bulk');
    } finally {
      setIsBulking(false);
    }
  };

  const handlePrintLabel = (order) => {
    const printWindow = window.open('', '_blank');
    
    // HTML content for shipping label
    const html = `
      <html>
        <head>
          <title>Shipping Label - ${order.orderNumber || order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #000; }
            .label-box { border: 2px solid #000; width: 4in; height: 6in; padding: 20px; box-sizing: border-box; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
            .to-section { margin-bottom: 20px; }
            .to-title { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
            .address { font-size: 16px; line-height: 1.5; font-weight: bold; }
            .from-section { margin-top: 40px; font-size: 12px; }
            .footer { margin-top: auto; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px; text-align: center; }
            .order-details { margin-top: 20px; font-size: 12px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            @media print {
              @page { size: 4in 6in; margin: 0; }
              body { padding: 0; margin: 0; }
              .label-box { border: none; width: 100%; height: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="label-box">
            <div class="header">
              <div class="logo">ZEN-G WEAR</div>
              <div style="font-size: 12px; margin-top: 5px;">Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</div>
            </div>
            
            <div class="to-section">
              <div class="to-title">SHIP TO:</div>
              <div class="address">
                ${order.shippingAddress?.fullName}<br/>
                ${order.shippingAddress?.streetAddress}<br/>
                ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}<br/>
                ${order.shippingAddress?.country}<br/>
                Ph: ${order.shippingAddress?.phone || order.user?.phone || 'N/A'}
              </div>
            </div>

            <div class="order-details">
              <strong>Order Items:</strong>
              ${order.orderItems.map(item => `
                <div class="item">
                  <span>${item.quantity}x ${item.name} ${item.size ? `(Size: ${item.size})` : ''}</span>
                </div>
              `).join('')}
            </div>

            <div class="from-section">
              <div class="to-title">FROM:</div>
              <div>Zen-G Wear Hub<br/>Delhi, India - 110001<br/>support@zengwear.com</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-widest">Orders</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Manage all customer orders & delivery tracking</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-gray-50 border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 bg-white text-xs font-bold uppercase focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_MAP).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-2.5 whitespace-nowrap">
            {filteredOrders.length} orders
          </span>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedOrders.length > 0 && (
        <div className="bg-[#2874f0] text-white p-3 mb-4 rounded-sm flex items-center justify-between sticky top-[60px] z-10 shadow-md">
          <div className="text-sm font-bold">
            {selectedOrders.length} orders selected
          </div>
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold uppercase text-black bg-white rounded-sm outline-none"
            >
              <option value="">Select Bulk Action...</option>
              <option value="processing">Mark Processing</option>
              <option value="shipped">Mark Shipped</option>
              <option value="completed">Mark Delivered</option>
              <option value="cancelled">Cancel Orders</option>
            </select>
            <button
              onClick={handleBulkStatusChange}
              disabled={!bulkAction || isBulking}
              className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 text-xs font-bold uppercase rounded-sm disabled:opacity-50"
            >
              {isBulking ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      )}

      {/* Select All Row */}
      {filteredOrders.length > 0 && (
        <div className="mb-4 flex items-center gap-3 px-2">
          <input
            type="checkbox"
            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
            onChange={(e) => {
              if (e.target.checked) setSelectedOrders(filteredOrders.map(o => o._id));
              else setSelectedOrders([]);
            }}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          <span className="text-sm font-bold text-gray-600 cursor-pointer" onClick={() => {
              if (selectedOrders.length !== filteredOrders.length) setSelectedOrders(filteredOrders.map(o => o._id));
              else setSelectedOrders([]);
          }}>Select All</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center border border-gray-200 bg-gray-50">
            <ShoppingBag size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
            const isExpanded = expandedOrderId === order._id;
            return (
              <div key={order._id} className="border border-gray-200 bg-white overflow-hidden">

                {/* Order Row */}
                <div className="p-4 sm:p-5 flex flex-col gap-4">

                  {/* Top: Order ID + Status + Date */}
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-start gap-4 w-full md:w-auto">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedOrders([...selectedOrders, order._id]);
                          else setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                        }}
                        className="w-5 h-5 accent-black cursor-pointer mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-bold text-black">{order.orderNumber || order._id?.slice(-8).toUpperCase()}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          {!order.isPaid && order.paymentMethod === 'UPI' && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded-full animate-pulse">
                              ⚠ Unverified Payment
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Middle: Customer + Amount info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Customer Info */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0 font-bold text-gray-700 text-sm">
                        {(order.shippingAddress?.fullName || order.user?.name || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-black truncate">
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </p>
                        {order.user?.email && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                            <Mail size={10} /> {order.user.email}
                          </p>
                        )}
                        {order.user?.phone && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone size={10} /> {order.user.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Summary</p>
                      <p className="text-sm font-bold text-black">Rs {(order.totalPrice || order.totalAmount)?.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">{order.orderItems?.length || 0} item(s)</p>
                      <p className="text-xs text-gray-500">via {order.paymentMethod}</p>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <MapPin size={10} /> Deliver To
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {order.shippingAddress?.streetAddress}<br />
                        {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                        {order.shippingAddress?.mobileNumber && (
                          <span className="block mt-1 font-bold text-black flex items-center gap-1">
                            <Phone size={10} /> {order.shippingAddress.mobileNumber}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">

                    {/* UTR Verification */}
                    {!order.isPaid && order.paymentMethod === 'UPI' && (
                      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-sm">
                        <div>
                          <p className="text-[10px] font-bold text-yellow-800 uppercase">UTR:</p>
                          <p className="text-xs font-bold text-black font-mono">{order.utrNumber || 'N/A'}</p>
                        </div>
                        <button
                          onClick={() => handleStatusChange(order._id, 'processing', true)}
                          disabled={updatingId === order._id}
                          className="text-[10px] font-bold uppercase bg-yellow-400 text-black px-3 py-1.5 hover:bg-yellow-500 transition-colors whitespace-nowrap disabled:opacity-50"
                        >
                          {updatingId === order._id ? '...' : 'Verify & Approve'}
                        </button>
                      </div>
                    )}

                    {/* Status Updater */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Status:</span>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs font-bold uppercase px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:border-black cursor-pointer disabled:opacity-50"
                      >
                        {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                      className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-800 hover:border-black hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={13} />
                      {isExpanded ? 'Hide' : 'View Items'}
                      <ChevronDown size={13} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded: Order Items Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                          {/* Order Items */}
                          <div>
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <ShoppingBag size={13} /> Ordered Items ({order.orderItems?.length})
                            </h5>
                            <div className="space-y-3">
                              {order.orderItems?.map((item, idx) => (
                                <div key={idx} className="flex gap-3 bg-white p-3 border border-gray-200">
                                  <div className="w-14 h-16 bg-gray-100 shrink-0 border border-gray-200 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/56x64/f5f5f5/999?text=IMG'; }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-black line-clamp-2">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}
                                    </p>
                                    <p className="text-sm font-bold text-black mt-1">Rs {item.price?.toLocaleString('en-IN')}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="mt-4 bg-white border border-gray-200 p-4">
                              <div className="flex justify-between text-xs text-gray-600 mb-2">
                                <span>Subtotal</span>
                                <span>Rs {order.orderItems?.reduce((s, i) => s + i.price * i.quantity, 0)?.toLocaleString('en-IN')}</span>
                              </div>
                              {order.shippingPrice > 0 && (
                                <div className="flex justify-between text-xs text-gray-600 mb-2">
                                  <span>Shipping</span>
                                  <span>Rs {order.shippingPrice?.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm font-bold text-black border-t border-gray-200 pt-2 mt-2">
                                <span>Total Paid</span>
                                <span>Rs {(order.totalPrice || order.totalAmount)?.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Customer & Delivery Details */}
                          <div className="space-y-4">
                            {/* Customer Details */}
                            <div className="bg-white border border-gray-200 p-4">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <User size={13} /> Customer Details
                              </h5>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Name</span>
                                  <span className="font-bold text-black">{order.shippingAddress?.fullName || order.user?.name}</span>
                                </div>
                                {order.user?.email && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium text-black text-xs truncate max-w-[180px]">{order.user.email}</span>
                                  </div>
                                )}
                                {order.user?.phone && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="font-bold text-black">{order.user.phone}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Payment</span>
                                  <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                    {order.isPaid ? '✓ Paid' : '✗ Unpaid'} via {order.paymentMethod}
                                  </span>
                                </div>
                                {order.utrNumber && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">UTR Number</span>
                                    <span className="font-mono font-bold text-xs text-blue-700">{order.utrNumber}</span>
                                  </div>
                                )}
                                {order.paymentRefCode && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">QR Bank Note</span>
                                    <span className="font-mono font-black text-xs text-red-600 bg-red-50 px-1 rounded">{order.paymentRefCode}</span>
                                  </div>
                                )}
                              </div>
                              {order.user && (
                                <button 
                                  onClick={() => handleBanUser(order.user._id)}
                                  className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded flex justify-center items-center gap-1 transition-colors border border-red-200"
                                >
                                  <Ban size={14} /> Permanently Ban User
                                </button>
                              )}
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white border border-gray-200 p-4">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MapPin size={13} /> Delivery Address
                              </h5>
                              <p className="text-sm font-bold text-black">{order.shippingAddress?.fullName}</p>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {order.shippingAddress?.streetAddress}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                                {order.shippingAddress?.country}
                              </p>
                              {order.shippingAddress?.phone && (
                                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                  <Phone size={11} /> {order.shippingAddress.phone}
                                </p>
                              )}
                              {/* Post / Dispatch Label */}
                              <div className="mt-3 pt-3 border-t border-gray-100 bg-yellow-50 p-2 border border-yellow-200 text-[10px] font-mono">
                                <p className="font-bold text-gray-700 mb-0.5">📦 DISPATCH TO:</p>
                                <p className="text-black leading-relaxed">
                                  {order.shippingAddress?.fullName}<br />
                                  {order.shippingAddress?.streetAddress},<br />
                                  {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                                </p>
                              </div>

                              <button
                                onClick={() => handlePrintLabel(order)}
                                className="mt-4 w-full bg-black hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded-sm flex justify-center items-center gap-2 transition-colors uppercase tracking-widest"
                              >
                                🖨️ Print Shipping Label
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
