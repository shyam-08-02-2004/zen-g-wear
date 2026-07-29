import { useState, useEffect } from 'react';
import { ShoppingCart, Clock, User, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAbandonedCartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/abandoned`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCarts(data?.data?.carts || []);
      } catch (err) {
        toast.error('Failed to fetch abandoned carts');
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-black flex items-center gap-3">
          <ShoppingCart className="text-gray-400" size={28} />
          Abandoned Carts
        </h1>
        <p className="text-sm text-gray-500 mt-2">View carts that have been inactive for more than 2 hours.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>
      ) : carts.length === 0 ? (
        <div className="bg-gray-50 p-10 text-center border border-gray-100">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-widest">No Abandoned Carts</h3>
          <p className="text-sm text-gray-500">All customers seem to be completing their orders!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {carts.map(cart => (
            <div key={cart._id} className="border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <User size={14} /> Customer Info
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{cart.user?.name || 'Unknown User'}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {cart.user?.email || 'N/A'}</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {cart.user?.phone || 'N/A'}</p>
                  <p className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Last Active: {new Date(cart.updatedAt).toLocaleString()}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a 
                    href={`https://wa.me/91${cart.user?.phone?.replace(/\D/g,'')}?text=Hi ${cart.user?.name}, we noticed you left some items in your cart at Zen-G Wear! Need any help completing your order?`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-[#128C7E] transition-colors"
                  >
                    <Phone size={14} /> Send WhatsApp Reminder
                  </a>
                </div>
              </div>
              
              <div className="p-6 flex-1 lg:flex-[2]">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cart Items ({cart.items.length})</h4>
                  <span className="text-sm font-bold text-black">Total: Rs {cart.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-white border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-gray-50" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-black line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}</p>
                        <p className="text-sm font-bold text-black mt-1">Rs {item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
      `}} />
    </div>
  );
};

export default AdminAbandonedCartsPage;
