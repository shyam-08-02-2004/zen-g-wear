import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { bucketByMonth } from '../../utils/chartData';
import usersAdminService from '../../services/usersAdminService';
import ordersService from '../../services/ordersService';
import paymentsService from '../../services/paymentsService';
import productsService from '../../services/productsService';

const AdminDashboardOverview = () => {
  const users = useApi(() => usersAdminService.getUsers({ limit: 5, sortBy: 'createdAt', order: 'desc' }), []);
  const orders = useApi(() => ordersService.getAllOrders({ limit: 5, sortBy: 'createdAt', order: 'desc' }), []);
  const payments = useApi(() => paymentsService.getAllPayments({ limit: 200 }), []);
  const [lowStock, setLowStock] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    // Fetch Low Stock
    productsService.getProducts('?pageSize=100').then(res => {
      const allProducts = res.data?.data || [];
      setLowStock(allProducts.filter(p => p.stock < 10));
      // Simulate top sellers by sorting by reviews (assuming more reviews = more sales)
      setTopSellers([...allProducts].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0)).slice(0, 5));
    }).catch(() => {});
  }, []);

  const validPayments = useMemo(
    () => (payments.data?.payments ?? []).filter((p) => p.status !== 'failed' && p.status !== 'refunded'),
    [payments.data]
  );
  
  const totalRevenue = useMemo(() => validPayments.reduce((s, p) => s + p.amount, 0), [validPayments]);
  
  const revenueSeries = useMemo(
    () => bucketByMonth(validPayments, 'createdAt', (p) => p.amount, 6),
    [validPayments]
  );

  const totalOrdersCount = Array.isArray(orders.data) ? orders.data.length : (orders.data?.total ?? 0);
  const recentOrdersList = Array.isArray(orders.data) ? orders.data.slice(0, 5) : (orders.data?.orders ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome to your Zen-G Wear Seller Hub</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-[#0a2885]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-full"><DollarSign size={20} className="text-[#0a2885]" /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrdersCount}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-full"><ShoppingCart size={20} className="text-green-600" /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{Array.isArray(users.data) ? users.data.length : (users.data?.total ?? 0)}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-full"><Users size={20} className="text-orange-600" /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{lowStock.length}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-full"><AlertTriangle size={20} className="text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-sm shadow-sm">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Sales Analytics (Last 6 Months)</h2>
            <Link to="/admin/revenue" className="text-sm text-[#0a2885] font-semibold hover:underline">View Report</Link>
          </div>
          <div className="p-4 h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a2885" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0a2885" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} width={50} />
                <Tooltip 
                  formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0a2885" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts (New Feature) */}
        <div className="bg-white rounded-sm shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="font-bold text-gray-800">Low Stock Alerts</h2>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[300px]">
            {lowStock.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {lowStock.map(item => (
                  <li key={item._id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div className="flex gap-3 items-center flex-1">
                      <img src={item.images[0]?.url} alt="" className="w-10 h-10 rounded object-cover border" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-red-500 font-bold">Only {item.stock} left!</p>
                      </div>
                    </div>
                    <Link to={`/admin/products?search=${encodeURIComponent(item.name)}`} className="text-xs text-blue-600 font-bold uppercase hover:underline ml-2">Edit</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">All products are well stocked.</div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link to="/admin/products" className="text-sm font-semibold text-[#0a2885]">Manage Inventory</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-white rounded-sm shadow-sm">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-800">Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-sm text-[#0a2885] font-semibold flex items-center gap-1">View All <ArrowRight size={14}/></Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {recentOrdersList.length > 0 ? (
              <table className="w-full text-left text-sm min-w-[520px]">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrdersList.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-[#0a2885]">#{order.orderNumber?.slice(-6)}</td>
                      <td className="px-4 py-3 text-gray-700">{order.user?.name || 'Guest'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">Rs {order.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-sm text-gray-500">No orders yet.</p>
            )}
          </div>
        </div>

        {/* Top Selling Products (New Feature) */}
        <div className="bg-white rounded-sm shadow-sm">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              <h2 className="font-bold text-gray-800">Top Performing Products</h2>
            </div>
          </div>
          <div className="p-0">
            {topSellers.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {topSellers.map((item, idx) => (
                  <li key={item._id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                    <span className="font-bold text-lg text-gray-300 w-4">{idx + 1}</span>
                    <img src={item.images[0]?.url} alt="" className="w-12 h-12 rounded object-cover border" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-sm font-bold text-gray-900">Rs {item.price}</p>
                      <Link to={`/admin/products?search=${encodeURIComponent(item.name)}`} className="text-[10px] text-blue-600 font-bold uppercase hover:underline">Edit Item</Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-6 text-center text-sm text-gray-500">No data available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardOverview;
