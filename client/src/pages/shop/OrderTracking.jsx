import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock status steps for demonstration
const mockStatus = [
  { label: 'Order Placed', key: 'placed' },
  { label: 'Processing', key: 'processing' },
  { label: 'Shipped', key: 'shipped' },
  { label: 'Out for Delivery', key: 'out_for_delivery' },
  { label: 'Delivered', key: 'delivered' },
];

// Simulate fetching order status (replace with real API later)
const fetchOrderStatus = async (orderId) => {
  await new Promise((r) => setTimeout(r, 800));
  const randomIdx = Math.floor(Math.random() * mockStatus.length);
  return mockStatus[randomIdx].key;
};

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    const status = await fetchOrderStatus(orderId.trim());
    setCurrentStatus(status);
    setLoading(false);
  };

  const statusIndex = mockStatus.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Track Your Order</h1>
      <form onSubmit={handleTrack} className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-sm focus:outline-none focus:border-[#2874f0]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#2874f0] text-white rounded-sm hover:bg-[#1a5b9f] transition-colors"
        >
          {loading ? 'Checking…' : 'Track'}
        </button>
      </form>

      {currentStatus && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Order ID: {orderId}</h2>
          <ul className="space-y-4">
            {mockStatus.map((step, idx) => (
              <li key={step.key} className="flex items-center">
                {idx <= statusIndex ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-gray-300" />
                )}
                <span className="ml-3 text-sm font-medium text-gray-700">{step.label}</span>
                {idx === statusIndex && (
                  <motion.span
                    className="ml-2 text-xs text-[#2874f0]"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    In progress
                  </motion.span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-sm hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
