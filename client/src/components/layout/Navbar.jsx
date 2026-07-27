import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart, User as UserIcon, LogOut, ChevronDown, Menu, X, Package } from 'lucide-react';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import api from '../../services/api';
import { notify } from '../ui/Toast';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isAdmin = userInfo?.role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const mobileSearchRef = useRef(null);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logoutAction());
    notify.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setSearchLoading(true);
        try {
          const { data } = await api.get(`/products?keyword=${encodeURIComponent(searchQuery.trim())}&pageSize=5`);
          setSearchResults(data?.data || []);
          setShowSearchResults(true);
        } catch (error) {
          console.error(error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      setMobileSearchOpen(false);
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#2874f0] shadow-md font-sans">
        <div className="max-w-[1248px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-2 lg:gap-8">

            {/* Left: Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {onMenuClick && (
                <button
                  type="button"
                  onClick={onMenuClick}
                  className="lg:hidden p-1 text-white hover:bg-white/10 rounded-sm transition-colors"
                >
                  <Menu size={24} />
                </button>
              )}
              <Link to="/" className="flex flex-col items-start">
                <span className="font-bold text-white text-lg sm:text-xl italic tracking-tight leading-none">
                  ZEN-G WEAR
                </span>
                <span className="text-white text-[9px] italic hover:underline mt-0.5 flex items-center">
                  Explore <span className="text-[#ffe500] font-bold ml-1">Plus</span>
                  <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png" alt="plus" className="h-[10px] ml-0.5" />
                </span>
              </Link>
            </div>

            {/* Middle: Search Bar (Desktop) */}
            <div ref={searchRef} className="flex-1 max-w-2xl hidden md:block relative">
              <form onSubmit={handleSearch} className="w-full relative shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim().length > 1) setShowSearchResults(true); }}
                  placeholder="Search for Mens, Womens, Kids, Watches, Shoes..."
                  className="w-full pl-4 pr-10 py-2 bg-white rounded-sm text-sm text-black focus:outline-none placeholder-gray-400"
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-[#2874f0]">
                  <Search size={20} strokeWidth={2.5} />
                </button>
              </form>

              {/* Desktop Search Autocomplete */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border-t border-gray-100 rounded-b-sm overflow-hidden z-50">
                  {searchLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((product) => (
                        <li key={product._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <Link
                            to={`/product/${product._id}`}
                            onClick={() => { setShowSearchResults(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 p-2.5 transition-colors"
                          >
                            <div className="w-10 h-10 bg-gray-50 flex-shrink-0 p-1">
                              {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-contain" />}
                            </div>
                            <div>
                              <p className="text-sm text-black line-clamp-1">{product.name}</p>
                              <p className="text-xs text-green-600 font-bold">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Mobile Search Toggle (Removed for Flipkart UI) */}

              {/* Desktop: Auth */}
              {isAuthenticated ? (
                <div
                  className="relative hidden md:flex items-center gap-1 cursor-pointer group py-2"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <UserIcon size={16} className="text-white" />
                  <span className="text-white font-medium text-sm">{userInfo?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-white transition-transform group-hover:rotate-180" />

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 pt-1 w-56 z-50">
                      <div className="bg-white rounded-sm shadow-xl border border-gray-200 flex flex-col py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-900">{userInfo?.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{userInfo?.email}</p>
                        </div>
                        {userInfo?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-gray-50">
                            <UserIcon size={16} className="text-[#2874f0]" /> Admin Panel
                          </Link>
                        )}
                        {!isAdmin && (
                          <>
                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-gray-50">
                              <UserIcon size={16} className="text-[#2874f0]" /> My Profile
                            </Link>
                            <Link to="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-gray-50">
                              <Package size={16} className="text-[#2874f0]" /> My Orders
                            </Link>
                          </>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-gray-50 text-left">
                          <LogOut size={16} className="text-[#2874f0]" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:block bg-white text-[#2874f0] font-bold text-sm px-8 py-1.5 rounded-sm hover:bg-gray-50 shadow-sm transition-colors">
                  Login
                </Link>
              )}

              {/* Mobile: Hamburger / User Menu */}
              <button
                className="md:hidden text-white p-1.5 hover:bg-white/10 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <UserIcon size={20} />}
              </button>

              {/* Cart (all sizes) */}
              {!isAdmin && (
                <Link to="/cart" className="relative text-white p-1.5 hover:bg-white/10 rounded-sm transition-colors flex items-center gap-1.5">
                  <ShoppingCart size={20} />
                  <span className="hidden sm:block text-sm font-bold">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-1 sm:right-6 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Always visible like Flipkart) */}
        <div className="md:hidden bg-[#2874f0] px-3 pb-3">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                ref={mobileSearchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                autoFocus
                className="w-full pl-4 pr-10 py-2.5 bg-white rounded-sm text-sm text-black focus:outline-none placeholder-gray-400"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-[#2874f0]">
                <Search size={18} strokeWidth={2.5} />
              </button>
            </form>
            {/* Mobile Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-1 bg-white shadow-xl rounded-b-sm overflow-hidden">
                <ul>
                  {searchResults.map((product) => (
                    <li key={product._id} className="border-b border-gray-100 last:border-0">
                      <Link
                        to={`/product/${product._id}`}
                        onClick={() => { setShowSearchResults(false); setSearchQuery(''); setMobileSearchOpen(false); }}
                        className="flex items-center gap-3 p-2.5"
                      >
                        <div className="w-9 h-9 bg-gray-50 flex-shrink-0">
                          {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-contain" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-black line-clamp-1">{product.name}</p>
                          <p className="text-xs text-green-600 font-bold">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-[#2874f0] p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                {isAuthenticated ? (
                  <>
                    <p className="text-white font-bold text-sm">{userInfo?.name}</p>
                    <p className="text-white/70 text-xs">{userInfo?.email}</p>
                  </>
                ) : (
                  <div>
                    <p className="text-white font-bold text-sm">Hello, Guest</p>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#ffe500] text-xs font-bold underline">
                      Login / Register
                    </Link>
                  </div>
                )}
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/80 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2 flex flex-col">
              {isAuthenticated && !isAdmin && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100">
                    <UserIcon size={18} className="text-[#2874f0]" /> My Profile
                  </Link>
                  <Link to="/dashboard/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100">
                    <Package size={18} className="text-[#2874f0]" /> My Orders
                  </Link>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100">
                    <ShoppingCart size={18} className="text-[#2874f0]" /> My Cart {cartCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                  </Link>
                </>
              )}
              {isAuthenticated && isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100">
                  <UserIcon size={18} className="text-[#2874f0]" /> Admin Panel
                </Link>
              )}

              <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mt-2">Categories</div>
              
              {/* Men Accordion */}
              <div>
                <button 
                  onClick={() => setExpandedCategory(expandedCategory === 'men' ? null : 'men')}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 font-medium"
                >
                  Men's Fashion
                  <ChevronDown size={16} className={`transition-transform duration-200 ${expandedCategory === 'men' ? 'rotate-180' : ''}`} />
                </button>
                {expandedCategory === 'men' && (
                  <div className="bg-gray-50 border-b border-gray-100 pl-8 pr-5 py-2">
                    <Link to="/shop?category=men" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#2874f0] font-bold">View All Men</Link>
                    <Link to="/shop?category=men&subcategory=tshirt" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">T-Shirts & Shirts</Link>
                    <Link to="/shop?category=men&subcategory=jeans" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Jeans & Trousers</Link>
                    <Link to="/shop?category=men&subcategory=sportsshoes" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Footwear</Link>
                  </div>
                )}
              </div>

              {/* Women Accordion */}
              <div>
                <button 
                  onClick={() => setExpandedCategory(expandedCategory === 'women' ? null : 'women')}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 font-medium"
                >
                  Women's Fashion
                  <ChevronDown size={16} className={`transition-transform duration-200 ${expandedCategory === 'women' ? 'rotate-180' : ''}`} />
                </button>
                {expandedCategory === 'women' && (
                  <div className="bg-gray-50 border-b border-gray-100 pl-8 pr-5 py-2">
                    <Link to="/shop?category=women" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#2874f0] font-bold">View All Women</Link>
                    <Link to="/shop?category=women&subcategory=dress" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Dresses & Tops</Link>
                    <Link to="/shop?category=women&subcategory=kurti" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Ethnic Wear</Link>
                    <Link to="/shop?category=women&subcategory=heels" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Footwear</Link>
                  </div>
                )}
              </div>

              {/* Kids Accordion */}
              <div>
                <button 
                  onClick={() => setExpandedCategory(expandedCategory === 'kids' ? null : 'kids')}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 font-medium"
                >
                  Kids Collection
                  <ChevronDown size={16} className={`transition-transform duration-200 ${expandedCategory === 'kids' ? 'rotate-180' : ''}`} />
                </button>
                {expandedCategory === 'kids' && (
                  <div className="bg-gray-50 border-b border-gray-100 pl-8 pr-5 py-2">
                    <Link to="/shop?category=kids" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#2874f0] font-bold">View All Kids</Link>
                    <Link to="/shop?category=kids&subcategory=boysclothing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Boys Clothing</Link>
                    <Link to="/shop?category=kids&subcategory=girlsclothing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Girls Clothing</Link>
                    <Link to="/shop?category=kids&subcategory=shoes" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">Footwear</Link>
                  </div>
                )}
              </div>

              <Link to="/shop?offers=true" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-sm text-red-600 font-bold hover:bg-red-50 border-b border-gray-100">🔥 Top Offers</Link>
            {/* Logout */}
            {isAuthenticated && (
              <div className="p-4 border-t border-gray-200 mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-sm transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
