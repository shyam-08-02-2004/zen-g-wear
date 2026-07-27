import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import wishlistService from '../../services/wishlistService';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await wishlistService.getWishlist();
      setWishlist(data?.data?.wishlist || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.discountPrice || product.price,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Black',
      quantity: 1,
    }));
    handleRemove(product._id);
    toast.success('Moved to cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500 fill-red-500" size={24} />
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">My Wishlist</h1>
        <span className="text-sm font-medium text-gray-500 ml-auto bg-gray-100 px-3 py-1 rounded-full">
          {wishlist.length} Items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-lg border border-gray-100 shadow-sm">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Save your favorite items here to easily find them later and keep track of price drops.</p>
          <Link to="/shop" className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-sm">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white group rounded-md border border-gray-100 shadow-sm overflow-hidden flex flex-col font-sans relative"
              >
                <button
                  onClick={() => handleRemove(item._id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-sm text-gray-400 hover:text-red-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>
                <Link to={`/product/${item._id}`} className="aspect-[3/4] bg-gray-50 overflow-hidden block">
                  <img
                    src={item.images?.[0]?.url || 'https://placehold.co/400x500/f5f5f5/999999'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <Link to={`/product/${item._id}`} className="hover:underline underline-offset-4">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-sm font-bold text-gray-900">
                      Rs {(item.discountPrice || item.price).toLocaleString('en-IN')}
                    </span>
                    {item.discountPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        Rs {item.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full mt-3 py-2 bg-gray-50 text-gray-900 text-xs font-bold uppercase tracking-wider border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
