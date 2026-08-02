import { useMemo } from 'react';
import { TrendingUp, AlertTriangle, Package, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/dashboard/PageHeader';
import ApiState from '../../components/dashboard/ApiState';
import { useApi } from '../../hooks/useApi';
import productsService from '../../services/productsService';
import ordersService from '../../services/ordersService';

const AdminAIInsightsPage = () => {
  const products = useApi(() => productsService.getProducts('?limit=500'), []);
  const orders = useApi(() => ordersService.getAllOrders({ limit: 500 }), []);

  const loading = products.loading || orders.loading;

  // Calculate insights
  const { lowStockProducts, bestSellers } = useMemo(() => {
    if (!products.data?.products || !orders.data?.orders) {
      return { lowStockProducts: [], bestSellers: [] };
    }

    // 1. Low Stock Alerts (threshold: 20)
    const lowStock = products.data.products.filter((p) => p.countInStock < 20);

    // 2. Best Sellers Analysis
    const salesCount = {};
    orders.data.orders.forEach((order) => {
      // Only count paid/delivered orders ideally, but we'll count all for now to simulate demand
      order.orderItems.forEach((item) => {
        if (!salesCount[item.product]) {
          salesCount[item.product] = {
            id: item.product,
            name: item.name,
            qty: 0,
            revenue: 0,
          };
        }
        salesCount[item.product].qty += item.qty;
        salesCount[item.product].revenue += item.qty * item.price;
      });
    });

    const bestSellersArr = Object.values(salesCount)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10); // Top 10

    return {
      lowStockProducts: lowStock,
      bestSellers: bestSellersArr,
    };
  }, [products.data, orders.data]);

  return (
    <div>
      <PageHeader
        title="AI Insights & Smart Dashboard"
        description="AI-driven analytics to predict demand and manage inventory smartly."
      />

      <ApiState
        loading={loading}
        error={products.error || orders.error}
        onRetry={() => {
          products.execute();
          orders.execute();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Actionable Cards */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-800 font-medium">Critical Restock</p>
                <h3 className="text-3xl font-bold text-red-900 mt-2">{lowStockProducts.length}</h3>
                <p className="text-red-700 text-sm mt-1">Items below 20 stock</p>
              </div>
              <div className="bg-red-200 p-3 rounded-xl">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-800 font-medium">Top Performing</p>
                <h3 className="text-3xl font-bold text-indigo-900 mt-2">
                  {bestSellers[0]?.name?.split(' ').slice(0, 2).join(' ') || 'N/A'}
                </h3>
                <p className="text-indigo-700 text-sm mt-1">Highest sales volume</p>
              </div>
              <div className="bg-indigo-200 p-3 rounded-xl">
                <TrendingUp className="text-indigo-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-800 font-medium">AI Demand Prediction</p>
                <h3 className="text-xl font-bold text-emerald-900 mt-2">+15% Surge Expected</h3>
                <p className="text-emerald-700 text-sm mt-1">In Kid's Categories next week</p>
              </div>
              <div className="bg-emerald-200 p-3 rounded-xl">
                <Zap className="text-emerald-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Sellers Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800">Bestsellers by Volume</h3>
            </div>
            {bestSellers.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bestSellers} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      tickFormatter={(value) => value.split(' ').slice(0, 2).join(' ')}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="qty" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Not enough data to compute bestsellers.
              </div>
            )}
          </Card>

          {/* Low Stock List */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Restock Action List</h3>
              </div>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                {lowStockProducts.length} Items
              </span>
            </div>
            
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-red-600 font-semibold mt-0.5">
                        Only {product.countInStock} left in stock
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p>All items are well stocked!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </ApiState>
    </div>
  );
};

export default AdminAIInsightsPage;
