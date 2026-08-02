import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import productsService from '../../../services/productsService';
import wishlistService from '../../../services/wishlistService';
import { getRecentlyViewedItems } from '../../../utils/recentlyViewed';

const RecentlyViewedItem = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const placeholderSrc = `https://placehold.co/400x400/f5f5f5/999999?text=${encodeURIComponent(
    (product.name || 'Product').substring(0, 10)
  )}`;

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
    <Link 
      to={`/product/${product._id}`}
      state={{ product }}
      className="relative flex flex-col items-center w-[140px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-start group p-2 sm:p-3 hover:shadow-md transition-all duration-300 rounded-sm bg-white border border-gray-200 hover:border-gray-300"
    >
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 lg:bg-white/0 lg:group-hover:bg-white/90 rounded-full transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-white shadow-sm lg:shadow-none lg:group-hover:shadow-md"
      >
        <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
      </button>

      <div className="w-full h-[120px] sm:h-[180px] mb-2 sm:mb-4 overflow-hidden flex items-center justify-center">
        <img 
          src={product.images[0]?.url || placeholderSrc} 
          alt={product.name || 'Recently viewed product'} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderSrc;
          }}
        />
      </div>
      <div className="w-full text-left mt-auto px-1">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wide mb-0.5">
          {product.brand || 'ZEN-G WEAR'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-normal line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name || 'Untitled Product'}
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
  );
};

const RecentlyViewedSkeleton = () => (
  <div className="w-full bg-[#f1f3f6] sm:bg-transparent mb-2 sm:mb-4 font-sans animate-pulse">
    <div className="bg-white sm:rounded-sm shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-100">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Recently Viewed</h2>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar p-3 sm:p-6 gap-3 sm:gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 w-[140px] sm:w-[180px] lg:w-[200px] p-2 sm:p-3 border border-gray-100 rounded-sm">
            <div className="w-full h-[140px] sm:h-[180px] mb-2 sm:mb-4 bg-gray-200 rounded-sm"></div>
            <div className="w-full h-4 bg-gray-200 mb-2 rounded-sm"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded-sm mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadItems = () => {
      try {
        const guestItems = getRecentlyViewedItems(null);
        const userItems = userInfo ? getRecentlyViewedItems(userInfo) : [];
        const storedItems = userInfo
          ? userItems.length > 0
            ? userItems
            : guestItems
          : guestItems;

        const formattedItems = storedItems
          .map((item) => ({
            ...item,
            name: item.name || 'Product',
            brand: item.brand || 'ZEN-G WEAR',
            price: item.price || 0,
            discountPrice: item.discountPrice,
            images: [{ url: item.image || item.images?.[0]?.url || '' }],
          }))
          .filter((item) => item._id);

        setProducts(formattedItems);
      } catch (error) {
        console.error('Error reading recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
    
    window.addEventListener('recentlyViewedUpdated', loadItems);
    return () => window.removeEventListener('recentlyViewedUpdated', loadItems);
  }, [userInfo]);

  if (loading) return <RecentlyViewedSkeleton />;

  return (
    <div className="w-full bg-[#f1f3f6] sm:bg-transparent mb-2 sm:mb-4 font-sans">
      <div className="bg-white sm:rounded-sm shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-100">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Recently Viewed</h2>
        </div>
        {products.length > 0 ? (
          <div className="p-0">
            <div className="flex overflow-x-auto hide-scrollbar p-3 sm:p-6 gap-3 sm:gap-6 snap-x snap-mandatory">
              {products.map((product) => (
                <RecentlyViewedItem key={product._id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[14px] text-gray-500 py-6 px-4 sm:px-6 text-center">No recently viewed products.</div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
