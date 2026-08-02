import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import productsService from '../../../services/productsService';
import wishlistService from '../../../services/wishlistService';
import { motion } from 'framer-motion';
import CountdownTimer from '../../ui/CountdownTimer';
import ProductBadges from '../../ui/ProductBadges';

const ProductRowItem = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  
  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  useEffect(() => {
    if (userInfo?.wishlist?.some(id => id === product._id || id?._id === product._id)) {
      setWishlisted(true);
    }
  }, [userInfo, product._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to wishlist');
      return;
    }
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
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link 
        to={`/product/${product._id}`}
        className="relative flex flex-col items-center w-full max-w-[240px] h-full group p-2 sm:p-4 hover:shadow-lg transition-all duration-300 rounded-lg bg-white border border-gray-50 sm:border-transparent hover:border-gray-100"
      >
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 lg:bg-white/0 lg:group-hover:bg-white/90 rounded-full transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-white shadow-sm lg:shadow-none lg:group-hover:shadow-md"
      >
        <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
      </button>

      <div className="w-full h-[120px] sm:h-[180px] mb-2 sm:mb-4 overflow-hidden flex items-center justify-center relative">
        <ProductBadges product={product} />
        {(discountPercent >= 70 || product.showTimer) && (
          <CountdownTimer className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 z-10" />
        )}
        <img 
          src={product.images[0]?.url} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x400/f5f5f5/999999?text=${encodeURIComponent(product.name.substring(0,10))}`;
          }}
        />
      </div>
      <div className="w-full text-left mt-auto px-1">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wide mb-0.5">
          {product.brand || 'ZEN-G WEAR'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-normal line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </p>
        <div className="mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-2">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
    </motion.div>
  );
};

const ProductRowSkeleton = ({ title }) => (
  <div className="w-full bg-[#f1f3f6] sm:bg-transparent mb-2 sm:mb-4 font-sans animate-pulse">
    <div className="bg-white sm:rounded-sm shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-100">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{title}</h2>
        <div className="w-20 h-8 bg-gray-200 rounded-sm"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 p-3 sm:p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center w-full p-2 sm:p-4">
            <div className="w-full h-[120px] sm:h-[180px] mb-2 sm:mb-4 bg-gray-200 rounded-sm"></div>
            <div className="w-full h-4 bg-gray-200 mb-2 rounded-sm"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded-sm mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProductRow = ({ title, query, linkTo }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsService.getProducts(`?pageSize=8&${query}`)
      .then(res => {
        setProducts(res.data?.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <ProductRowSkeleton title={title} />;
  if (!loading && products.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-[#f1f3f6] sm:bg-transparent mb-2 sm:mb-4 font-sans"
    >
      <div className="bg-white sm:rounded-sm shadow-sm overflow-hidden">
        {/* Header section */}
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-100">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{title}</h2>
          <Link 
            to={linkTo} 
            className="bg-[#2874f0] text-white p-1.5 sm:px-6 sm:py-2 rounded-full sm:rounded-sm text-xs sm:text-sm font-bold shadow hover:shadow-md transition-shadow flex items-center justify-center"
          >
            <span className="hidden sm:inline">VIEW ALL</span>
            <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>

        {/* Horizontal Scrolling Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 p-3 sm:p-6">
          {products.map((product) => (
            <ProductRowItem key={product._id} product={product} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductRow;
