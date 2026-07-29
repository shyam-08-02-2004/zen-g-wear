import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Package,
  LifeBuoy,
  BarChart3,
  TrendingUp,
  LogOut,
  Bell,
  Menu,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import api from '../../services/api';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
  { label: 'Listings / Products', to: '/admin/products', icon: <Package size={20} /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingCart size={20} /> },
  { label: 'Abandoned Carts', to: '/admin/abandoned-carts', icon: <ShoppingCart size={20} className="text-red-400" /> },
  { label: 'Payments', to: '/admin/payments', icon: <CreditCard size={20} /> },
  { label: 'Users', to: '/admin/users', icon: <Users size={20} /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Revenue', to: '/admin/revenue', icon: <TrendingUp size={20} /> },
  { label: 'Seller Support', to: '/admin/support', icon: <LifeBuoy size={20} /> },
  { label: 'Settings', to: '/admin/settings', icon: <Settings size={20} /> },
];

const AdminShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans">
      {/* Top Header (Flipkart Seller Hub Style) */}
      <header className="h-[60px] bg-[#0a2885] text-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-white" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/" className="font-bold text-xl tracking-wide flex items-baseline gap-1 hover:opacity-80 transition-opacity">
            <span>Zen-G</span>
            <span className="text-[#ffe11b] text-sm">Wear</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium">Hello, {userInfo?.name || 'Admin'}</span>
          </div>
          <button className="relative">
            <Bell size={20} className="text-white hover:text-gray-200" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold hover:text-gray-200">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-[250px] bg-white border-r border-gray-200 shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
          <nav className="flex flex-col py-4">
            {SIDEBAR_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center gap-3 px-6 py-3.5 text-[15px] font-semibold transition-colors
                  ${isActive 
                    ? 'text-[#0a2885] bg-blue-50/50 border-r-4 border-[#0a2885]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a2885]'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Sidebar Mobile Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-[250px] bg-white shadow-xl flex flex-col">
              <div className="h-[60px] bg-[#0a2885] text-white flex items-center px-6 font-bold text-lg">
                Menu
              </div>
              <nav className="flex flex-col py-4 flex-1 overflow-y-auto">
                {SIDEBAR_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-6 py-3.5 text-[15px] font-semibold transition-colors
                      ${isActive 
                        ? 'text-[#0a2885] bg-blue-50/50 border-r-4 border-[#0a2885]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a2885]'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-60px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
