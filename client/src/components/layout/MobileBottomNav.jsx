import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Search, ShoppingCart, User, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutGrid, label: 'Categories', path: '/shop' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', count: cartCount },
    { icon: User, label: 'Account', path: '/dashboard' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {showSearch && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowSearch(false)}>
          <div className="bg-white p-4 shadow-lg" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2.5 bg-gray-50">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowSearch(false)} className="text-[#2874f0] text-sm font-bold ml-2">Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-14">
          {navItems.slice(0, 2).map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={index} to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-0.5 relative transition-colors ${active ? 'text-[#2874f0]' : 'text-gray-500'}`}>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2874f0] rounded-full" />}
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}

          <button onClick={() => setShowSearch(true)}
            className="flex flex-col items-center justify-center flex-1 h-full space-y-0.5 text-gray-500 active:text-[#2874f0] transition-colors">
            <Search size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">Search</span>
          </button>

          {navItems.slice(2).map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={index} to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-0.5 relative transition-colors ${active ? 'text-[#2874f0]' : 'text-gray-500'}`}>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2874f0] rounded-full" />}
                <div className="relative">
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                  {item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white leading-none">
                      {item.count > 9 ? '9+' : item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
