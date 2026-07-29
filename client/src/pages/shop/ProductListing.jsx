import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, ChevronDown, ShoppingBag, X, ShoppingCart } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import CategoryNav from '../../components/layout/CategoryNav';
import Footer from '../../components/layout/Footer';
import productsService from '../../services/productsService';
import wishlistService from '../../services/wishlistService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import SkeletonProductCard from '../../components/SkeletonProductCard';

const SORT_OPTIONS = [
  { label: 'Popularity (Rating)', value: '-rating' },
  { label: 'Newest Arrivals', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
];

const SUBCATEGORY_MAP = {
  men: [
    { group: 'Topwear', items: [{l:'T-Shirts',v:'tshirt'},{l:'Shirts',v:'shirt'},{l:'Hoodies',v:'hoodie'},{l:'Sweatshirts',v:'sweatshirt'},{l:'Jackets',v:'jacket'},{l:'Blazers',v:'blazer'}]},
    { group: 'Bottomwear', items: [{l:'Jeans',v:'jeans'},{l:'Trousers',v:'trousers'},{l:'Shorts',v:'shorts'},{l:'Track Pants',v:'trackpants'},{l:'Joggers',v:'joggers'},{l:'Cargo Pants',v:'cargo'}]},
    { group: 'Innerwear', items: [{l:'Vests',v:'vest'},{l:'Briefs',v:'brief'},{l:'Boxers',v:'boxer'},{l:'Innerwear',v:'innerwear'},{l:'Socks',v:'socks'}]},
    { group: 'Footwear', items: [{l:'Sports Shoes',v:'sportsshoes'},{l:'Casual Shoes',v:'casualshoes'},{l:'Formal Shoes',v:'formalshoes'},{l:'Sandals',v:'sandals'},{l:'Slippers',v:'slippers'}]},
    { group: 'Accessories', items: [{l:'Watches',v:'watches'},{l:'Belts',v:'belt'},{l:'Wallets',v:'wallet'},{l:'Caps',v:'cap'},{l:'Sunglasses',v:'sunglasses'}]},
    { group: 'Ethnic', items: [{l:'Ethnic Wear',v:'ethnicwear'}]},
  ],
  women: [
    { group: 'Western Wear', items: [{l:'Dresses',v:'dress'},{l:'Tops',v:'top'},{l:'T-Shirts',v:'tshirt'},{l:'Shirts',v:'shirt'},{l:'Hoodies',v:'hoodie'},{l:'Sweatshirts',v:'sweatshirt'},{l:'Jackets',v:'jacket'}]},
    { group: 'Bottomwear', items: [{l:'Jeans',v:'jeans'},{l:'Trousers',v:'trousers'},{l:'Leggings',v:'leggings'},{l:'Palazzos',v:'palazzo'},{l:'Skirts',v:'skirt'}]},
    { group: 'Ethnic Wear', items: [{l:'Kurtis',v:'kurti'},{l:'Kurtas',v:'kurta'},{l:'Sarees',v:'saree'},{l:'Lehengas',v:'lehenga'},{l:'Ethnic Wear',v:'ethnicwear'}]},
    { group: 'Lingerie & Sleepwear', items: [{l:'Bras',v:'bra'},{l:'Panties',v:'panty'},{l:'Sports Bras',v:'sportsbra'},{l:'Lingerie',v:'lingerie'},{l:'Shapewear',v:'shapewear'},{l:'Nightwear',v:'nightwear'}]},
    { group: 'Footwear', items: [{l:'Heels',v:'heels'},{l:'Flats',v:'flats'},{l:'Sneakers',v:'sneakers'},{l:'Sandals',v:'sandals'}]},
    { group: 'Accessories', items: [{l:'Handbags',v:'handbag'},{l:'Wallets',v:'wallet'},{l:'Jewellery',v:'jewellery'},{l:'Watches',v:'watches'},{l:'Beauty',v:'beauty'},{l:'Accessories',v:'accessories'}]},
  ],
  kids: [
    { group: 'Clothing', items: [{l:'Boys Clothing',v:'boysclothing'},{l:'Girls Clothing',v:'girlsclothing'},{l:'Baby Clothing',v:'babyclothing'},{l:'T-Shirts',v:'tshirt'},{l:'Shirts',v:'shirt'},{l:'Jeans',v:'jeans'},{l:'Shorts',v:'shorts'},{l:'Frocks',v:'frock'},{l:'Dresses',v:'dress'}]},
    { group: 'School & Winter', items: [{l:'School Uniform',v:'schooluniform'},{l:'Winter Wear',v:'winterwear'},{l:'School Bags',v:'schoolbag'}]},
    { group: 'Footwear', items: [{l:'Shoes',v:'shoes'},{l:'Sandals',v:'sandals'}]},
    { group: 'Accessories', items: [{l:'Watches',v:'watches'},{l:'Caps',v:'cap'},{l:'Toys',v:'toys'},{l:'Baby Care',v:'babycare'},{l:'Accessories',v:'accessories'}]},
  ],
};
const DEFAULT_SUBS = [{l:'T-Shirts',v:'tshirt'},{l:'Shirts',v:'shirt'},{l:'Jeans',v:'jeans'},{l:'Dresses',v:'dress'},{l:'Shorts',v:'shorts'},{l:'Watches',v:'watches'},{l:'Shoes',v:'shoes'},{l:'Jackets',v:'jacket'}];


const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === 'admin';
  const [wishlisted, setWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product._id);
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.discountPrice || product.price,
      size: product.sizes?.[0] || 'M',
      quantity: 1,
    }));
    dispatch(toggleCart(true));
  };

  // Check if we have a second image for the hover effect
  const primaryImage = product.images?.[0]?.url;
  const secondaryImage = product.images?.[1]?.url || primaryImage;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col font-sans bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-gray-200">
            New
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={toggleWishlist}
        disabled={wishlistLoading}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 lg:bg-white/0 lg:group-hover:bg-white/90 rounded-full transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 disabled:opacity-50 hover:bg-white shadow-sm lg:shadow-none lg:group-hover:shadow-md"
      >
        <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && secondaryImage !== primaryImage ? 'opacity-0' : 'opacity-100'}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x800/f5f5f5/999999?text=${encodeURIComponent(product.name.substring(0,10))}`;
              }}
            />
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={48} className="text-gray-300" />
          </div>
        )}

        {/* Quick Add (Desktop) */}
        {!isAdmin && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white/95 backdrop-blur text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Product Info - Premium Style */}
      <div className="pt-4 px-3 pb-4 flex flex-col gap-1.5 flex-grow justify-between bg-white dark:bg-gray-800">
        <div className="flex flex-col">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-0.5">
              {product.brand || 'Brand'}
            </h3>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-blue-600 transition-colors">
              {product.name}
            </p>
          </Link>
          
          <div className="flex items-center gap-2 mt-1.5">
            {product.rating > 0 ? (
              <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                {product.rating} <span className="ml-0.5 text-[8px]">★</span>
              </span>
            ) : (
              <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                4.2 <span className="ml-0.5 text-[8px]">★</span>
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium">({product.numReviews})</span>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-4 ml-auto" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-700">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-black text-black dark:text-white">
              ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Mobile Add to Cart Button */}
          {!isAdmin && (
            <button
              onClick={handleQuickAdd}
              className="lg:hidden flex-shrink-0 bg-black text-white p-2 rounded-full shadow-md active:scale-95 transition-transform hover:bg-gray-800"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Filter Accordion Component
const FilterAccordion = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button 
        className="flex w-full items-center justify-between text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('-createdAt');
  const [filterOpen, setFilterOpen] = useState(false); // For mobile sidebar

  const keyword = searchParams.get('keyword') || '';
  const categoryFilter = searchParams.get('category') || '';
  const subcategoryFilter = searchParams.get('subcategory') || '';
  const sizesFilter = searchParams.get('sizes') || '';
  const colorsFilter = searchParams.get('colors') || '';
  const minPriceFilter = searchParams.get('minPrice') || '';
  const maxPriceFilter = searchParams.get('maxPrice') || '';
  const offersFilter = searchParams.get('offers') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let qs = `?pageSize=16&pageNumber=${currentPage}&sort=${sort}`;
      if (keyword) qs += `&keyword=${keyword}`;
      if (categoryFilter) qs += `&categoryName=${categoryFilter}`;
      if (subcategoryFilter) qs += `&subcategory=${subcategoryFilter}`;
      if (sizesFilter) qs += `&sizes=${sizesFilter}`;
      if (colorsFilter) qs += `&colors=${colorsFilter}`;
      if (minPriceFilter) qs += `&minPrice=${minPriceFilter}`;
      if (maxPriceFilter) qs += `&maxPrice=${maxPriceFilter}`;
      if (offersFilter) qs += `&offers=${offersFilter}`;

      const { data } = await productsService.getProducts(qs);
      setProducts(data?.data || []);
      setTotalProducts(data?.total || 0);
      setTotalPages(data?.pages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, keyword, categoryFilter, subcategoryFilter, sizesFilter, colorsFilter, minPriceFilter, maxPriceFilter, offersFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, categoryFilter, subcategoryFilter, sizesFilter, colorsFilter, minPriceFilter, maxPriceFilter, offersFilter, sort]);

  const handleSortChange = (val) => {
    setSort(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col bg-white font-sans selection:bg-gray-900 selection:text-white">
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-0 sm:px-4 lg:px-8 py-4 lg:py-8">
        
        {/* Page Header */}
        <div className="px-4 sm:px-0 mb-2 lg:mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Home</span><span>›</span>
            <span className="capitalize">{categoryFilter || 'All Products'}</span>
            {subcategoryFilter && <><span>›</span><span className="capitalize text-gray-800 font-semibold">{subcategoryFilter}</span></>}
          </div>
          <h1 className="text-xl lg:text-3xl font-display font-black uppercase tracking-tight text-black">
            {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}'s ${subcategoryFilter || 'Collection'}` : keyword ? `Search: "${keyword}"` : 'All Products'}
          </h1>
          
        </div>

        {/* Horizontal Chips (Flipkart Style) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-3 mt-4 px-4 sm:px-0 lg:hidden">
          {(categoryFilter && SUBCATEGORY_MAP[categoryFilter]
            ? SUBCATEGORY_MAP[categoryFilter].flatMap(g => g.items)
            : DEFAULT_SUBS
          ).map((sub, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchParams(prev => {
                  prev.set('subcategory', sub.v);
                  return prev;
                });
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-[13px] font-medium whitespace-nowrap transition-colors ${
                subcategoryFilter === sub.v
                  ? 'bg-[#2874f0] text-white border-[#2874f0]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {sub.l}
            </button>
          ))}
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden lg:flex items-center justify-between border-b border-gray-200 pb-4 mb-6 px-4 sm:px-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 border border-gray-300 px-3 py-2 rounded-sm"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <span className="hidden lg:block text-sm text-gray-500 font-medium">
              Showing {products.length} of {totalProducts} products
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:block">Sort By</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-none text-sm font-semibold bg-white focus:outline-none focus:border-gray-900 cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Backdrop */}
          {filterOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
              onClick={() => setFilterOpen(false)}
            />
          )}

          {/* Sidebar Filters */}
          <aside className={`
            fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-[320px] bg-white z-[70] shadow-[4px_0_24px_rgba(0,0,0,0.15)] transform transition-transform duration-300 ease-in-out flex flex-col
            lg:relative lg:top-auto lg:left-auto lg:h-auto lg:w-64 lg:shadow-none lg:transform-none lg:z-auto lg:block lg:bg-transparent
            ${filterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Filter Header */}
            <div className="lg:hidden flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-[#2874f0]" />
                <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900">Filters</h2>
              </div>
              <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pb-24 lg:pb-0 lg:overflow-visible lg:sticky lg:top-24 custom-scrollbar bg-white lg:bg-transparent">
              <div className="pr-0 lg:pr-4 p-5 lg:p-0">
              
              {/* Category Filter */}
              <FilterAccordion title="Category" defaultOpen={true}>
                <div className="flex flex-col gap-3">
                  {['Men', 'Women', 'Kids'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="category"
                          checked={categoryFilter === cat.toLowerCase()}
                          onChange={() => {
                            setSearchParams(prev => { 
                              prev.set('category', cat.toLowerCase()); 
                              prev.delete('subcategory');
                              return prev; 
                            });
                            setCurrentPage(1);
                          }}
                          className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-gray-900 checked:border-gray-900 transition-colors"
                        />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`text-sm ${categoryFilter === cat.toLowerCase() ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
                    </label>
                  ))}
                  {categoryFilter && (
                    <button
                      onClick={() => { setSearchParams(prev => { prev.delete('category'); prev.delete('subcategory'); return prev; }); setCurrentPage(1); }}
                      className="text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider mt-2 flex items-center gap-1"
                    >
                      <X size={12} /> Clear Category
                    </button>
                  )}
                </div>
              </FilterAccordion>

              {/* Subcategory Filter — Dynamic per Category */}
              <FilterAccordion title="Type" defaultOpen={true}>
                <div className="flex flex-col gap-1 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                  {(categoryFilter && SUBCATEGORY_MAP[categoryFilter] ? SUBCATEGORY_MAP[categoryFilter] : [{group:'Popular',items:DEFAULT_SUBS}]).map((grp) => (
                    <div key={grp.group} className="mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 mt-1">{grp.group}</p>
                      {grp.items.map(sub => {
                        const isSelected = subcategoryFilter === sub.v;
                        return (
                          <label key={sub.v} className="flex items-center gap-3 cursor-pointer group py-1">
                            <div className="relative flex items-center justify-center">
                              <input type="radio" name="subcategory" checked={isSelected}
                                onChange={() => { setSearchParams(prev => { prev.set('subcategory', sub.v); return prev; }); setCurrentPage(1); }}
                                className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-gray-900 checked:border-gray-900 transition-colors"
                              />
                              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className={`text-sm ${isSelected ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{sub.l}</span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                  {subcategoryFilter && (
                    <button onClick={() => { setSearchParams(prev => { prev.delete('subcategory'); return prev; }); setCurrentPage(1); }}
                      className="text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider mt-2 flex items-center gap-1">
                      <X size={12} /> Clear Type
                    </button>
                  )}
                </div>
              </FilterAccordion>

              {/* Price Filter */}
              <FilterAccordion title="Price" defaultOpen={true}>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Under Rs 250', min: '', max: '250' },
                    { label: 'Rs 250 - Rs 500', min: '250', max: '500' },
                    { label: 'Rs 500 - Rs 1000', min: '500', max: '1000' },
                    { label: 'Rs 1000 - Rs 2000', min: '1000', max: '2000' },
                    { label: 'Above Rs 2000', min: '2000', max: '' },
                  ].map((priceOpt, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="price_range" 
                          checked={minPriceFilter === priceOpt.min && maxPriceFilter === priceOpt.max}
                          onChange={() => {
                            setSearchParams(prev => { 
                              if(priceOpt.min) prev.set('minPrice', priceOpt.min); else prev.delete('minPrice');
                              if(priceOpt.max) prev.set('maxPrice', priceOpt.max); else prev.delete('maxPrice');
                              return prev; 
                            });
                            setCurrentPage(1);
                          }}
                          className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-gray-900 checked:border-gray-900 transition-colors" 
                        />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`text-sm ${minPriceFilter === priceOpt.min && maxPriceFilter === priceOpt.max ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{priceOpt.label}</span>
                    </label>
                  ))}
                  {(minPriceFilter || maxPriceFilter) && (
                    <button
                      onClick={() => { setSearchParams(prev => { prev.delete('minPrice'); prev.delete('maxPrice'); return prev; }); setCurrentPage(1); }}
                      className="text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider mt-2 flex items-center gap-1"
                    >
                      <X size={12} /> Clear Price
                    </button>
                  )}
                </div>
              </FilterAccordion>

              {/* Size Filter */}
              <FilterAccordion title="Size" defaultOpen={true}>
                <div className="grid grid-cols-4 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11'].map(size => {
                    const currentSizes = sizesFilter ? sizesFilter.split(',') : [];
                    const isSelected = currentSizes.includes(size);
                    return (
                      <button 
                        key={size}
                        onClick={() => {
                          const newSizes = isSelected ? currentSizes.filter(s => s !== size) : [...currentSizes, size];
                          setSearchParams(prev => {
                            if (newSizes.length > 0) prev.set('sizes', newSizes.join(','));
                            else prev.delete('sizes');
                            return prev;
                          });
                          setCurrentPage(1);
                        }}
                        className={`border py-2 text-xs font-medium transition-colors ${isSelected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50'}`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </FilterAccordion>


              </div>
            </div>
            
            {/* Mobile Filter Footer */}
            <div className="lg:hidden p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => setFilterOpen(false)}
                className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold text-[14px] uppercase tracking-wider shadow-sm hover:shadow-md transition-shadow"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                {[...Array(8)].map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
                <ShoppingBag size={48} className="text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-500 mb-8 max-w-md">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={() => { setSearchParams({}); setCurrentPage(1); }}
                  className="px-8 py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div 
                  layout 
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12"
                >
                  <AnimatePresence>
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1 mt-20 border-t border-gray-200 pt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-black disabled:opacity-30 disabled:hover:text-gray-900 transition-colors"
                    >
                      Prev
                    </button>
                    <div className="flex items-center gap-1 mx-4 overflow-x-auto max-w-full">
                      {(() => {
                        let startPage = Math.max(1, currentPage - 2);
                        let endPage = Math.min(totalPages, startPage + 4);
                        if (endPage - startPage < 4) {
                          startPage = Math.max(1, endPage - 4);
                        }
                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }
                        return (
                          <>
                            {startPage > 1 && <span className="px-2 text-gray-500">...</span>}
                            {pages.map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center text-sm font-bold transition-colors ${currentPage === page ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 rounded-md'}`}
                              >
                                {page}
                              </button>
                            ))}
                            {endPage < totalPages && <span className="px-2 text-gray-500">...</span>}
                          </>
                        );
                      })()}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-black disabled:opacity-30 disabled:hover:text-gray-900 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      {/* Mobile Sticky Sort & Filter Footer */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 z-40 flex shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex-1 border-r border-gray-200 relative">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-700 pointer-events-none">
            <ChevronDown size={18} className="text-gray-500" /> SORT
          </div>
        </div>
        <button 
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-700"
        >
          <SlidersHorizontal size={18} className="text-gray-500" /> FILTER
        </button>
      </div>
    </div>
  );
};

export default ProductListing;
