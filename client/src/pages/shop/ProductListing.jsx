import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, ChevronDown, ShoppingBag, X, ShoppingCart } from 'lucide-react';
import productsService from '../../services/productsService';

const prefetchedProducts = new Set();

const getSubcategoryImage = (label, category) => {
  const l = label.toLowerCase();
  
  if (category === 'women') {
    if (l.includes('dress')) return '/images/category-women-dress.png';
    if (l.includes('skirt')) return '/images/category-women-skirt.jpg';
    if (l.includes('top')) return '/images/category-women-top.png';
    if (l.includes('t-shirt') || l.includes('tshirt')) return '/images/category-women-tshirt.jpg';
    if (l.includes('shirt')) return '/images/category-women-shirt.png';
    if (l.includes('hoodie')) return '/images/category-women-hoodie.png';
    if (l.includes('sweatshirt')) return '/images/category-women-sweatshirt.png';
    if (l.includes('jacket')) return '/images/category-women-jacket.png';
    if (l.includes('jeans')) return '/images/category-women-jeans.jpg';
    if (l.includes('legging')) return '/images/category-women-legging.png';
    if (l.includes('palazzo')) return '/images/category-women-palazzo.png';
    if (l.includes('panty') || l.includes('panties')) return '/images/category-women-panties-v2.png';
    if (l.includes('trouser') || l.includes('pant')) return '/images/category-women-trouser.png';
    if (l.includes('kurti')) return '/images/category-women-kurti.png';
    if (l.includes('kurta')) return '/images/category-women-kurta.png';
    if (l.includes('saree')) return '/images/category-women-saree.jpg';
    if (l.includes('lehenga')) return '/images/category-women-lehenga.png';
    if (l.includes('ethnic')) return '/images/category-women-ethnic.jpg';
    if (l.includes('sports bra') || l.includes('sport bra')) return '/images/category-women-sportsbra.png';
    if (l.includes('bra')) return '/images/category-women-bra.png';
    if (l.includes('lingerie') || l.includes('lingie')) return '/images/category-women-lingerie.png';
    if (l.includes('shapewear')) return '/images/category-women-shapewear.png';
    if (l.includes('nightwear') || l.includes('nightwera')) return '/images/category-women-nightwear.png';
    if (l.includes('heel')) return '/images/category-women-heels.png';
    if (l.includes('flat')) return '/images/category-women-flats.jpg';
    if (l.includes('sneaker') || l.includes('shoe')) return '/images/category-women-sneakers.jpg';
    if (l.includes('sandal')) return '/images/category-women-sandals.png';
    if (l.includes('bag') || l.includes('handbag')) return '/images/category-women-handbag.png';
    if (l.includes('wallet')) return '/images/category-women-wallet.png';
    if (l.includes('jewellery') || l.includes('necklace') || l.includes('ring')) return '/images/category-women-jewellery.png';
    if (l.includes('watch')) return '/images/category-women-watch.png';
    if (l.includes('beauty')) return '/images/category-women-beauty.png';
    if (l.includes('accessori')) return '/images/category-women-accessories.jpg';
    return 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150&h=150&fit=crop';
  }

  if (category === 'kids') {
    if (l.includes('care') || l.includes('bath') || l.includes('lotion')) return '/images/category-kids-babycare-v2.png';
    if (l.includes('baby') || l.includes('infant') || l.includes('toddler')) return '/images/category-kids-baby.png';
    if (l.includes('boy')) return '/images/category-kids-boys.png';
    if (l.includes('girl')) return '/images/category-kids-girls.png';
    if (l.includes('t-shirt') || l.includes('tshirt')) return '/images/category-kids-tshirt.png';
    if (l.includes('shirt')) return '/images/category-kids-shirt.png';
    if (l.includes('jeans')) return '/images/category-kids-jeans.png';
    if (l.includes('short')) return '/images/category-kids-shorts.png';
    if (l.includes('frock')) return '/images/category-kids-frock.png';
    if (l.includes('dress')) return '/images/category-kids-dress.png';
    if (l.includes('bag') || l.includes('backpack')) return '/images/category-kids-schoolbag-v2.png';
    if (l.includes('school') || l.includes('uniform')) return '/images/category-kids-school.png';
    if (l.includes('winter') || l.includes('jacket') || l.includes('sweater')) return '/images/category-kids-winterwear.png';
    if (l.includes('shoe') || l.includes('footwear') || l.includes('sneaker')) return '/images/category-kids-shoes.png';
    if (l.includes('toy') || l.includes('game')) return '/images/category-kids-toys.png';
    if (l.includes('watch')) return '/images/category-kids-watch.png';
    if (l.includes('accessori') || l.includes('lunch') || l.includes('bottle')) return '/images/category-kids-accessories.png';
  }

  // Original defaults (Men & Generic)
  if (l.includes('t-shirt') || l.includes('tshirt') || l.includes('polo')) return '/images/category-men-tshirt.png';
  if (l.includes('shirt')) return '/images/category-shirt.png';
  if (l.includes('hoodie')) return '/images/category-hoodie.jpg';
  if (l.includes('sweatshirt')) return '/images/category-men-sweatshirt.png';
  if (l.includes('jacket')) return '/images/category-jacket.png';
  if (l.includes('blazer') || l.includes('winter')) return '/images/category-blazer.png';
  if (l.includes('jeans')) return '/images/category-jeans.png';
  if (l.includes('cargo')) return '/images/category-cargo.jpg';
  if (l.includes('trouser') || l.includes('pant')) return '/images/category-men-trouser.jpg';
  if (l.includes('track')) return '/images/category-track.png';
  if (l.includes('jogger')) return '/images/category-jogger.png';
  if (l.includes('short')) return '/images/category-short.png';
  if (l.includes('sock')) return '/images/category-sock.png';
  if (l.includes('sport') || l.includes('sneaker') || l.includes('running')) return '/images/category-sports-shoe.png';
  if (l.includes('formal') || l.includes('oxford') || l.includes('derby')) return '/images/category-formal-shoe.png';
  if (l.includes('casual') || l.includes('loafer') || l.includes('shoe')) return '/images/category-casual-shoe.png';
  if (l.includes('sandal') || l.includes('flat') || l.includes('heel') || l.includes('float')) return '/images/category-sandal.png';
  if (l.includes('slipper') || l.includes('slider') || l.includes('slide')) return '/images/category-slipper.png';
  if (l.includes('watch')) return '/images/category-watch.jpg';
  if (l.includes('glass') || l.includes('sunglass')) return '/images/category-glass.jpg';
  if (l.includes('wallet')) return '/images/category-wallet.png';
  if (l.includes('bag')) return 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=150&h=150&fit=crop';
  if (l.includes('belt')) return '/images/category-belt.png';
  if (l.includes('cap') || l.includes('hat')) return '/images/category-cap.png';
  if (l.includes('vest') || l.includes('top')) return '/images/category-top.png';
  if (l.includes('dress') || l.includes('skirt')) return 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150&h=150&fit=crop';
  if (l.includes('ethnic') || l.includes('saree') || l.includes('kurti') || l.includes('lehenga') || l.includes('kurta') || l.includes('sherwani')) return '/images/category-ethnic.jpg';
  if (l.includes('brief')) return '/images/category-brief.png';
  if (l.includes('boxer')) return '/images/category-boxer.png';
  if (l.includes('trunk')) return '/images/category-trunk.png';
  if (l.includes('innerwear') || l.includes('bra') || l.includes('panty') || l.includes('lingerie') || l.includes('sleepwear')) return '/images/category-innerwear.png';

  if (l.includes('kid') || l.includes('boy') || l.includes('girl') || l.includes('baby') || l.includes('school') || l.includes('toy')) return '/images/category-kids-boys.png';
  return 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop';
};
import Navbar from '../../components/layout/Navbar';
import CategoryNav from '../../components/layout/CategoryNav';
import Footer from '../../components/layout/Footer';
import wishlistService from '../../services/wishlistService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import SkeletonProductCard from '../../components/SkeletonProductCard';
import CountdownTimer from '../../components/ui/CountdownTimer';

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
const DEFAULT_SUBS = [{l:'T-Shirts',v:'tshirt'},{l:'Shirts',v:'shirt'},{l:'Jeans',v:'jeans'},{l:'Dresses',v:'dress'},{l:'Tops',v:'top'},{l:'Shorts',v:'shorts'},{l:'Watches',v:'watches'},{l:'Shoes',v:'shoes'},{l:'Jackets',v:'jacket'}];


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
      <Link
        to={`/product/${product._id}`}
        state={{ product }}
        className="block relative aspect-[3/4] bg-gray-100 overflow-hidden"
        onMouseEnter={() => {
          if (!prefetchedProducts.has(product._id)) {
            prefetchedProducts.add(product._id);
            productsService.getProductById(product._id).catch(() => {});
          }
        }}
      >
        {discount >= 40 && (
          <CountdownTimer className="absolute bottom-2 left-2 z-10 shadow-md" />
        )}
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-100'}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x800/f5f5f5/999999?text=${encodeURIComponent(product.name.substring(0,10))}`;
              }}
            />
            {secondaryImage && secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x800/f5f5f5/999999?text=${encodeURIComponent(product.name.substring(0,10))}`;
                }}
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
        <div className="flex flex-col text-left">
          <Link to={`/product/${product._id}`} state={{ product }}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-0.5">
              {product.brand || 'ZEN-G WEAR'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal line-clamp-1 hover:text-blue-600 transition-colors">
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
            <span className="ml-auto inline-flex items-center bg-[#2874f0] rounded-[2px] px-1 h-[14px] sm:h-[16px] select-none shadow-sm">
              <span className="text-[#f7e02b] italic font-bold text-[8px] sm:text-[9px] mr-[2px]">g</span>
              <span className="text-white italic font-bold text-[8px] sm:text-[9px] tracking-wide">Assured</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col mt-2 pt-2 border-t border-gray-50 dark:border-gray-700">
          <div className="flex flex-wrap items-baseline gap-1.5 mb-2">
            <span className="text-[15px] font-black text-black dark:text-white leading-none">
              ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Mobile Add to Cart Button - Flipkart style */}
          {!isAdmin && (
            <button
              onClick={handleQuickAdd}
              className="lg:hidden w-full flex items-center justify-center gap-1.5 bg-white border border-[#2874f0] text-[#2874f0] text-[12px] font-bold py-1.5 rounded-sm active:scale-95 transition-colors"
            >
              <ShoppingCart size={14} /> Add to Cart
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
      
      const getCategoryLabel = (value) => {
        if (!value) return undefined;
        if (typeof value === 'string') return value;
        return value.name || value.slug || value.label || value.value;
      };
      
      const isFootwearProduct = (product) => {
        const text = [
          getCategoryLabel(product?.category),
          getCategoryLabel(product?.subcategory),
          product?.name,
        ].filter(Boolean).join(' ').toLowerCase();
        return /footwear|shoe|sneaker|sandals|chappal|slipper|loafer|heels|flats/.test(text);
      };

      const footwearSizeMap = { XS: '6', S: '7', M: '8', L: '9', XL: '10', XXL: '11', XXXL: '12', xs: '6', s: '7', m: '8', l: '9', xl: '10', xxl: '11', xxxl: '12' };

      const processedProducts = (data?.data || []).map(p => {
        if (isFootwearProduct(p) && p.sizes?.length > 0) {
          p.sizes = p.sizes.map(s => footwearSizeMap[s.trim()] || s.trim());
        }
        return p;
      });

      setProducts(processedProducts);
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
        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 mt-2 px-4 sm:px-0 lg:hidden snap-x">
          {(categoryFilter && SUBCATEGORY_MAP[categoryFilter]
            ? SUBCATEGORY_MAP[categoryFilter].flatMap(g => g.items)
            : DEFAULT_SUBS
          ).map((sub, idx) => {
            const isActive = subcategoryFilter === sub.v;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set('subcategory', sub.v);
                    return prev;
                  });
                  setCurrentPage(1);
                }}
                className="flex flex-col items-center gap-1.5 snap-start shrink-0 group focus:outline-none"
              >
                <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'border-[2px] border-[#2874f0] shadow-sm scale-105' 
                    : 'border border-transparent hover:scale-105'
                }`}>
                  <div className="w-[54px] h-[54px] rounded-full overflow-hidden border border-gray-200">
                    <img src={getSubcategoryImage(sub.l, categoryFilter)} alt={sub.l} loading="lazy" decoding="async" className="w-full h-full object-cover bg-gray-50" />
                  </div>
                </div>
                <span className={`text-[11px] whitespace-nowrap text-center max-w-[68px] truncate transition-colors ${
                  isActive ? 'font-bold text-[#2874f0]' : 'font-medium text-gray-700 group-hover:text-black'
                }`}>
                  {sub.l}
                </span>
              </button>
            );
          })}
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
