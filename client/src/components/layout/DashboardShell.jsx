import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Folder, CreditCard, Power, ChevronRight, UserCircle } from 'lucide-react';
import Navbar from './Navbar';
import notificationsService from '../../services/notificationsService';
import api from '../../services/api';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import { notify } from '../ui/Toast';

const DashboardShell = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    notificationsService
      .getMyNotifications({ limit: 1 })
      .then((res) => {
        if (isMounted) setUnreadCount(res.data.data?.unreadCount ?? 0);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logoutAction());
    notify.success('Logged out successfully');
    navigate('/login');
  };

  const menuSections = [
    {
      title: 'Account Settings',
      icon: <User size={20} className="text-[#2874f0]" />,
      items: [
        { label: 'Profile Information', to: '/dashboard/profile' },
        { label: 'Manage Addresses', to: '/dashboard/addresses' },
        { label: 'PAN Card Information', to: '/dashboard/pan' }
      ]
    },
    {
      title: 'Payments',
      icon: <CreditCard size={20} className="text-[#2874f0]" />,
      items: [
        { label: 'Gift Cards', to: '/dashboard/giftcards' },
        { label: 'Saved UPI', to: '/dashboard/upi' },
        { label: 'Saved Cards', to: '/dashboard/cards' }
      ]
    },
    {
      title: 'My Stuff',
      icon: <Folder size={20} className="text-[#2874f0]" />,
      items: [
        { label: 'My Coupons', to: '/dashboard/coupons' },
        { label: 'My Reviews & Ratings', to: '/dashboard/reviews' },
        { label: 'All Notifications', to: '/dashboard/notifications', badge: unreadCount },
        { label: 'My Wishlist', to: '/dashboard/wishlist' }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1248px] w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-4">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4">
          
          {/* User Greeting Card */}
          <div className="bg-white rounded-sm shadow-sm p-3 flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-full bg-[#f1f3f6] flex items-center justify-center shrink-0">
              <UserCircle size={40} className="text-gray-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-500 font-medium">Hello,</span>
              <span className="text-base font-bold text-gray-900 truncate max-w-[180px]">{userInfo?.name}</span>
            </div>
          </div>

          {/* Navigation Card */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden hidden lg:block">
            
            <NavLink to="/dashboard/orders" className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 group">
              <div className="flex items-center gap-4">
                <Folder size={20} className="text-[#2874f0]" />
                <span className="text-[15px] font-bold text-gray-500 group-hover:text-[#2874f0] transition-colors">MY ORDERS</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#2874f0]" />
            </NavLink>

            {menuSections.map((section, idx) => (
              <div key={idx} className="border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4 p-4 pb-2">
                  {section.icon}
                  <span className="text-[15px] font-bold text-gray-500">{section.title.toUpperCase()}</span>
                </div>
                <div className="flex flex-col pb-2">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => 
                        `pl-[52px] pr-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive || (item.to === '/dashboard/profile' && location.pathname === '/dashboard')
                            ? 'text-[#2874f0] bg-blue-50/50' 
                            : 'text-gray-700 hover:text-[#2874f0] hover:bg-blue-50/30'
                        } flex justify-between items-center`
                      }
                    >
                      <span>{item.label}</span>
                      {item.badge > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 border-t border-gray-100 hover:bg-gray-50 group text-left"
            >
              <Power size={20} className="text-[#2874f0]" />
              <span className="text-[15px] font-bold text-gray-500 group-hover:text-[#2874f0] transition-colors">LOGOUT</span>
            </button>
          </div>

        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default DashboardShell;
