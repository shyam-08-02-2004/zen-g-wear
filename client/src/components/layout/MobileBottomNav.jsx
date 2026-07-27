import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Grid, ShoppingCart, User } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Categories', path: '/shop' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', count: cartCount },
    { icon: User, label: 'Account', path: '/dashboard' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link 
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors ${active ? 'text-[#2874f0]' : 'text-gray-500'}`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} className={active ? 'text-[#2874f0]' : 'text-gray-500'} />
                {item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
