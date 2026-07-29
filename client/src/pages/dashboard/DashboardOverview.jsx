import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Heart, CreditCard, User, Bell, HeadphonesIcon, Settings, ChevronRight, ShoppingCart, LogOut } from 'lucide-react';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import api from '../../services/api';
import { notify } from '../../components/ui/Toast';

const DashboardOverview = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logoutAction());
    notify.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { icon: <Package size={24} className="text-[#2874f0]" />, label: 'Orders', to: '/dashboard/orders', subtext: 'Check your order status' },
    { icon: <Heart size={24} className="text-[#2874f0]" />, label: 'Wishlist', to: '/dashboard/wishlist', subtext: 'Your saved items' },
    { icon: <User size={24} className="text-[#2874f0]" />, label: 'Profile', to: '/dashboard/profile', subtext: 'Edit personal info' },
    { icon: <ShoppingCart size={24} className="text-[#2874f0]" />, label: 'My Cart', to: '/cart', subtext: 'View your items' },
    { icon: <Bell size={24} className="text-[#2874f0]" />, label: 'Notifications', to: '/dashboard/notifications', subtext: 'Offers & Updates' },
    { icon: <HeadphonesIcon size={24} className="text-[#2874f0]" />, label: 'Help Center', to: '/dashboard/tickets', subtext: 'Need assistance?' },
  ];

  return (
    <div className="font-sans">
      
      {/* Mobile Top Greeting (Hidden on Desktop since Sidebar has it) */}
      <div className="lg:hidden bg-white p-4 mb-2 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hey! {userInfo?.name?.split(' ')[0]}</h2>
          <p className="text-sm text-gray-500">Explore Zen-G Wear</p>
        </div>
        <div className="w-12 h-12 bg-[#2874f0]/10 rounded-full flex items-center justify-center">
          <User size={24} className="text-[#2874f0]" />
        </div>
      </div>

      {/* Zen-G Coins Mock Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-sm p-4 mb-4 lg:mb-6 shadow-sm flex items-center justify-between mx-4 lg:mx-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
            <span className="font-bold text-white text-lg">Z</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Zen-G Coins Balance</h3>
            <p className="text-sm text-gray-600 font-medium">Use coins to get extra discounts!</p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-black text-gray-900">150</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-600">Coins</span>
        </div>
      </div>

      {/* Grid Menu (Visible on both, but optimized for Mobile "My Account" feel) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4 px-2 lg:px-0 mb-8">
        {menuItems.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.to}
            className="bg-white p-4 rounded-sm shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-1">
              {item.icon}
            </div>
            <h4 className="font-bold text-gray-900 text-[15px]">{item.label}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{item.subtext}</p>
          </Link>
        ))}
      </div>

      {/* Account Settings List (Mobile Only) */}
      <div className="bg-white lg:rounded-sm lg:shadow-sm flex flex-col divide-y divide-gray-100">
        <Link to="/dashboard/settings" className="flex items-center justify-between p-4">
          <span className="text-[15px] font-medium text-gray-800">Account Settings</span>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        <Link to="/dashboard/profile" className="flex items-center justify-between p-4 border-t border-gray-100">
          <span className="text-[15px] font-medium text-gray-800">Edit Profile</span>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        <Link to="/dashboard/addresses" className="flex items-center justify-between p-4">
          <span className="text-[15px] font-medium text-gray-800">Saved Addresses</span>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        <button onClick={handleLogout} className="flex items-center justify-between p-4 w-full text-left active:bg-gray-50 transition-colors">
          <span className="text-[15px] font-bold text-red-500">Logout</span>
          <LogOut size={18} className="text-red-500" />
        </button>
      </div>

    </div>
  );
};

export default DashboardOverview;
