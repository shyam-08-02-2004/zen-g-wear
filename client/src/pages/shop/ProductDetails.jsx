import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ShoppingCart, ChevronRight, Star, Heart, MapPin, CheckCircle2, XCircle, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import productsService from '../../services/productsService';
import wishlistService from '../../services/wishlistService';
import reviewsService from '../../services/reviewsService';
import questionsService from '../../services/questionsService';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === 'admin';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Review states
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null); // null, 'checking', 'success', 'error'
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSubmitLoading, setQuestionSubmitLoading] = useState(false);
  const [adminReply, setAdminReply] = useState({});

  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setEditingProduct({
      ...product,
      imageUrl: product.images?.[0]?.url || '',
      sizesStr: product.sizes?.join(', ') || '',
      colorsStr: product.colors?.join(', ') || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : undefined,
        stock: Number(editingProduct.stock),
        brand: editingProduct.brand,
        sku: editingProduct.sku,
        material: editingProduct.material,
        isActive: editingProduct.isActive,
        isFeatured: editingProduct.isFeatured,
        isTrending: editingProduct.isTrending,
        isBestSeller: editingProduct.isBestSeller,
        isNewArrival: editingProduct.isNewArrival,
        sizes: editingProduct.sizesStr ? editingProduct.sizesStr.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: editingProduct.colorsStr ? editingProduct.colorsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: [{ url: editingProduct.imageUrl, publicId: editingProduct.images?.[0]?.publicId || 'default' }],
      };
      
      await productsService.updateProduct(editingProduct._id, updateData);
      toast.success('Product updated successfully');
      setEditingProduct(null);
      // Refresh current product
      const { data } = await productsService.getProductById(id);
      if (data?.data) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Failed to update product', error);
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const checkDelivery = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryStatus('error');
      setDeliveryMessage('Please enter a valid 6-digit PIN code');
      return;
    }
    setDeliveryStatus('checking');
    setTimeout(() => {
      setDeliveryStatus('success');
      const days = Math.floor(Math.random() * 5) + 2;
      setDeliveryMessage(`Delivery available! Expected in ${days} days.`);
    }, 1000);
  };

  const toggleWishlist = async () => {
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

  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productsService.deleteProduct(product._id);
        toast.success('Product deleted successfully');
        navigate('/shop');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error('Please login to write a review');
    if (!reviewTitle.trim() || !reviewComment.trim()) return toast.error('Title and comment are required');
    
    setReviewSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', id);
      formData.append('rating', reviewRating);
      formData.append('title', reviewTitle);
      formData.append('comment', reviewComment);
      
      // Append files
      if (reviewImages) {
        Array.from(reviewImages).forEach((file) => {
          formData.append('images', file);
        });
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to submit review');

      toast.success('Review submitted successfully!');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      setReviewImages([]);
      
      // Refresh reviews
      const { data } = await productsService.getProductReviews(id);
      setReviews(data?.data?.reviews || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestionSubmitLoading(true);
    try {
      await questionsService.addQuestion(product._id, { question: newQuestion });
      toast.success('Question submitted successfully');
      setNewQuestion('');
      const qRes = await questionsService.getQuestionsByProduct(product._id);
      setQuestions(qRes?.data?.data || []);
    } catch (error) {
      toast.error('Failed to submit question');
    } finally {
      setQuestionSubmitLoading(false);
    }
  };

  const submitAnswer = async (questionId) => {
    const answerText = adminReply[questionId];
    if (!answerText?.trim()) return;
    try {
      await questionsService.answerQuestion(questionId, { answer: answerText });
      toast.success('Answer submitted successfully');
      setAdminReply(prev => ({...prev, [questionId]: ''}));
      const qRes = await questionsService.getQuestionsByProduct(product._id);
      setQuestions(qRes?.data?.data || []);
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productsService.getProductById(id);
        if (data?.data) {
          setProduct(data.data);
          if (data.data.sizes?.length > 0) setSelectedSize(data.data.sizes[0]);
        }
        
        // Fetch reviews
        const reviewsRes = await reviewsService.getProductReviews(id);
        setReviews(reviewsRes?.data?.data?.reviews || []);
        
        // Fetch questions
        const questionsRes = await questionsService.getQuestionsByProduct(id);
        setQuestions(questionsRes?.data?.data || []);

        // Fetch similar products
        if (data?.data?.category) {
          const similarRes = await productsService.getProducts({ categoryName: data.data.category, limit: 5 });
          const filtered = (similarRes?.data?.data || []).filter(p => p._id !== id).slice(0, 4);
          setSimilarProducts(filtered);
        }

        // Add to recently viewed
        if (data?.data) {
          try {
            const p = data.data;
            const viewedItem = { _id: p._id, name: p.name, image: p.images?.[0]?.url, price: p.price, discountPrice: p.discountPrice, brand: p.brand };
            let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            recent = recent.filter(item => item._id !== p._id);
            recent.unshift(viewedItem);
            if (recent.length > 5) recent.pop();
            localStorage.setItem('recentlyViewed', JSON.stringify(recent));
          } catch (e) {
            console.error('Failed to save recently viewed', e);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.discountPrice || product.price,
      size: selectedSize,
      quantity: qty,
    }));
    navigate('/cart');
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="flex flex-col bg-white">
        <main className="flex-grow flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center items-center py-32">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-900 mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Back to Shop
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white font-sans selection:bg-black selection:text-white pb-20 md:pb-0">
      
      <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 w-full">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          
          {/* Image Gallery & Actions (Left Column) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Image Gallery (Mobile Swipeable, Desktop Large) */}
            <div className="relative w-full">
              {/* Mobile Carousel */}
              <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full relative h-[450px] bg-gray-50 border border-gray-100">
                {(product.images?.length > 0 ? product.images : [{url: ''}]).map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                    <img 
                      src={img.url} 
                      alt={`${product.name} - ${idx + 1}`} 
                      className="w-full h-full object-contain object-center mix-blend-multiply"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/800x1000/f5f5f5/999999?text=${encodeURIComponent(product.name.substring(0,10))}`;
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Desktop Image */}
              <div className="hidden lg:block aspect-auto h-[600px] xl:h-[750px] bg-gray-50 overflow-hidden relative border border-gray-100">
                <img 
                  src={product.images?.[activeImageIndex]?.url} 
                  alt={product.name} 
                  className="w-full h-full object-contain object-center mix-blend-multiply"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/800x1000/f5f5f5/999999?text=${encodeURIComponent(product.name.substring(0,10))}`;
                  }}
                />
              </div>

              {product.isNewArrival && (
                <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-gray-200 z-20">
                  New Arrival
                </span>
              )}
            </div>
            
            {/* Thumbnail Gallery (Desktop Only) */}
            {product.images?.length > 1 && (
              <div className="hidden lg:grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-[3/4] bg-gray-50 cursor-pointer overflow-hidden border transition-colors ${activeImageIndex === idx ? 'border-[#2874f0] shadow-sm' : 'border-gray-200 hover:border-black'}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover mix-blend-multiply p-1" />
                  </div>
                ))}
              </div>
            )}

            {/* Flipkart Style Actions (Sticky on Mobile, normal on Desktop) */}
            <div className="fixed bottom-14 left-0 right-0 z-40 bg-white p-2 border-t border-gray-200 lg:relative lg:bottom-auto lg:p-0 lg:border-none lg:z-auto lg:bg-transparent shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:shadow-none">
              {!isAdmin ? (
                <div className="flex gap-2 w-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#ff9f00] py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-bold text-white shadow-sm hover:shadow-md transition-shadow disabled:bg-gray-300 disabled:cursor-not-allowed rounded-sm"
                  >
                    <ShoppingCart size={18} fill="currentColor" /> 
                    {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      if (product.stock > 0) {
                        handleAddToCart();
                      }
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#fb641b] py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-bold text-white shadow-sm hover:shadow-md transition-shadow disabled:bg-gray-300 disabled:cursor-not-allowed rounded-sm"
                  >
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 hidden sm:block">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.89437 2.10091L4.10565 2.10091C3.12151 2.10091 2.30232 2.85593 2.20367 3.83447L1.24431 13.3496C1.12175 14.5653 2.07469 15.6174 3.29851 15.6174H10.7015C11.9253 15.6174 12.8783 14.5653 12.7557 13.3496L11.7963 3.83447C11.6977 2.85593 10.8785 2.10091 9.89437 2.10091ZM10.7015 17.0183H3.29851C1.22941 17.0183 -0.380963 15.2405 -0.174003 13.188L0.785351 3.67283C0.95191 2.02026 2.33596 0.700012 3.99611 0.700012L10.0039 0.700012C11.6641 0.700012 13.0481 2.02026 13.2147 3.67283L14.174 13.188C14.381 15.2405 12.7706 17.0183 10.7015 17.0183Z" fill="white"/>
                      <path d="M4 6C4 4.89543 4.89543 4 6 4H8C9.10457 4 10 4.89543 10 6V7H11.5V6C11.5 4.067 9.933 2.5 8 2.5H6C4.067 2.5 2.5 4.067 2.5 6V7H4V6Z" fill="white"/>
                    </svg>
                    BUY NOW
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2874f0] py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-bold text-white shadow-sm hover:shadow-md transition-shadow rounded-sm"
                  >
                    <Edit2 size={18} /> 
                    EDIT PRODUCT
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-bold text-white shadow-sm hover:shadow-md transition-shadow rounded-sm"
                  >
                    <Trash2 size={18} /> 
                    DELETE PRODUCT
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Info (Right Column) */}
          <div className="lg:col-span-7 mt-10 lg:mt-0">
            <div className="sticky top-28">
              
              <h2 className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-1">{product.brand || 'ZEN-G WEAR'}</h2>
              <h1 className="text-[18px] sm:text-[22px] font-normal text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>

              {/* Flipkart Assured & Ratings */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#388e3c] text-white text-[12px] font-bold px-2 py-0.5 rounded-sm flex items-center">
                  {product.rating ? product.rating.toFixed(1) : '4.2'} <Star size={10} className="ml-1 fill-white" />
                </span>
                <span className="text-[#878787] text-[14px] font-medium">{product.numReviews || 8} Ratings & Reviews</span>
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-5 ml-auto sm:ml-4" />
              </div>

              <div className="text-[#388e3c] text-[13px] font-bold mb-1">Special price</div>
              {/* Price */}
              <div className="flex items-end gap-3 mb-6">
                <span className="text-[28px] font-bold text-[#212121] leading-none">
                  ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-[16px] text-[#878787] line-through mb-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[16px] font-bold text-[#388e3c] mb-1">
                      {product.discountPercentage}% off
                    </span>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-gray-200 mb-6"></div>

              <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                


                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-black">Select Size</h3>
                      <button 
                        type="button" 
                        onClick={() => setShowSizeGuide(true)}
                        className="text-xs font-bold uppercase tracking-widest text-gray-500 underline underline-offset-4 hover:text-black"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`py-3 px-2 flex items-center justify-center text-xs font-bold uppercase tracking-widest border transition-all ${
                            selectedSize === size 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-200 bg-white text-black hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}


                
              </form>

              {/* Delivery & Services */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                  <MapPin size={16} /> Delivery Options
                </h3>
                <div className="bg-gray-50 p-4 border border-gray-100">
                  <form onSubmit={checkDelivery} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit PIN code" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 focus:border-black focus:outline-none"
                    />
                    <button 
                      type="submit" 
                      disabled={deliveryStatus === 'checking'}
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                    >
                      {deliveryStatus === 'checking' ? 'Checking' : 'Check'}
                    </button>
                  </form>
                  {deliveryStatus && deliveryStatus !== 'checking' && (
                    <div className={`mt-3 flex items-start gap-2 text-sm ${deliveryStatus === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                      {deliveryStatus === 'success' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <XCircle size={16} className="mt-0.5 shrink-0" />}
                      <span className="font-medium">{deliveryMessage}</span>
                    </div>
                  )}
                  <ul className="mt-4 space-y-2 text-xs text-gray-500">
                    <li className="flex items-center gap-2">• 100% Original Products</li>
                    <li className="flex items-center gap-2">• Pay on delivery might be available</li>
                  </ul>
                </div>
              </div>

              {/* Description & Details */}
              <div className="mt-12 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Description</h4>
                  <div className="text-sm text-gray-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
                
                <div className="h-px bg-gray-200 w-full"></div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Product Details</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex gap-2"><span className="font-bold text-gray-900 min-w-[100px]">SKU:</span> {product.sku || 'N/A'}</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 min-w-[100px]">Material:</span> {product.material || '100% Cotton'}</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 min-w-[100px]">Fit:</span> Regular Fit</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 min-w-[100px]">Care:</span> Machine wash</li>
                  </ul>
                </div>
                
                <div className="h-px bg-gray-200 w-full"></div>
                
                {/* Reviews Section Placeholder */}
                <div id="reviews">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                    Ratings & Reviews 
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded-sm text-[10px]">
                      {product.rating ? product.rating.toFixed(1) : 'No Rating'} ★
                    </span>
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">{product.numReviews} Reviews</p>
                  
                  {/* Reviews List */}
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {reviews.length === 0 ? (
                      <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>
                    ) : (
                      reviews.map((rv) => (
                        <div key={rv._id} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center">
                              {rv.rating} <Star size={8} className="ml-0.5 fill-white" />
                            </span>
                            <span className="text-sm font-bold text-gray-900">{rv.title}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rv.comment}</p>
                          {rv.images && rv.images.length > 0 && (
                            <div className="flex gap-2 mb-3 mt-2 overflow-x-auto">
                              {rv.images.map((img, idx) => (
                                <img key={idx} src={img.url} alt="Review" className="w-16 h-16 object-cover border border-gray-200 rounded-sm" />
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                            <span className="font-medium text-gray-500">{rv.user?.name}</span>
                            <span>•</span>
                            <span>{new Date(rv.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Write Review Form */}
                  {userInfo && !isAdmin && (
                    <div className="mt-8 bg-gray-50 p-6 border border-gray-100">
                      <h5 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Write a Review</h5>
                      <form onSubmit={submitReview} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating</label>
                          <select 
                            value={reviewRating} 
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm bg-white"
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Terrible</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Review Title</label>
                          <input 
                            type="text" 
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Sum up your experience"
                            className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Review Details</label>
                          <textarea 
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="What did you like or dislike?"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm bg-white custom-scrollbar"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Upload Photos (Max 3)</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files.length > 3) {
                                alert("You can only upload up to 3 images.");
                                e.target.value = "";
                              } else {
                                setReviewImages(e.target.files);
                              }
                            }}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-gray-200 file:text-black hover:file:bg-gray-300 transition-colors"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={reviewSubmitLoading}
                          className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                          {reviewSubmitLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-200 w-full"></div>

                {/* Q&A Section */}
                <div id="qa">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                    Customer Questions & Answers
                  </h4>
                  
                  {userInfo && !isAdmin && (
                    <form onSubmit={submitQuestion} className="mb-6 flex gap-2">
                      <input 
                        type="text"
                        placeholder="Have a question? Ask here..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 focus:border-black focus:outline-none"
                      />
                      <button 
                        type="submit"
                        disabled={questionSubmitLoading || !newQuestion.trim()}
                        className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                      >
                        Ask
                      </button>
                    </form>
                  )}

                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {questions.length === 0 ? (
                      <p className="text-sm text-gray-400">No questions yet. Be the first to ask!</p>
                    ) : (
                      questions.map(q => (
                        <div key={q._id} className="border-b border-gray-100 pb-4">
                          <p className="text-sm font-bold text-gray-900 mb-1">Q: {q.question}</p>
                          <p className="text-xs text-gray-400 mb-3">{q.user?.name} on {new Date(q.createdAt).toLocaleDateString()}</p>
                          
                          {q.answer ? (
                            <div className="bg-gray-50 p-3 pl-4 border-l-2 border-green-600">
                              <p className="text-sm text-gray-700"><span className="font-bold text-black">A:</span> {q.answer}</p>
                              {q.answeredBy && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  By {q.answeredBy?.name} {q.answeredBy?.role === 'admin' && <CheckCircle2 size={12} className="text-green-600" />}
                                </p>
                              )}
                            </div>
                          ) : isAdmin ? (
                            <div className="mt-2 flex gap-2">
                              <input 
                                type="text"
                                placeholder="Type answer..."
                                value={adminReply[q._id] || ''}
                                onChange={(e) => setAdminReply({...adminReply, [q._id]: e.target.value})}
                                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 focus:border-black focus:outline-none"
                              />
                              <button 
                                type="button"
                                onClick={() => submitAnswer(q._id)}
                                disabled={!adminReply[q._id]?.trim()}
                                className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 disabled:opacity-50"
                              >
                                Reply
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        {similarProducts.length >= 2 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-display font-black uppercase tracking-widest text-black mb-8">Frequently Bought Together</h2>
            <div className="bg-gray-50 border border-gray-200 p-8 flex flex-col lg:flex-row items-center gap-8">
              
              {/* Bundle Items */}
              <div className="flex-1 flex items-center justify-center gap-4 flex-wrap w-full">
                {/* Main Product */}
                <div className="text-center w-32">
                  <div className="aspect-[3/4] bg-white border border-gray-200 p-2 mb-2">
                    <img src={product.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] font-bold truncate">This Item</p>
                  <p className="text-xs font-bold mt-1">Rs {(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                </div>
                
                <span className="text-2xl font-light text-gray-400">+</span>

                {/* Bundle Item 1 */}
                <div className="text-center w-32">
                  <div className="aspect-[3/4] bg-white border border-gray-200 p-2 mb-2 cursor-pointer" onClick={() => { navigate(`/product/${similarProducts[0]._id}`); window.scrollTo(0,0); }}>
                    <img src={similarProducts[0].images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{similarProducts[0].name}</p>
                  <p className="text-xs font-bold mt-1">Rs {(similarProducts[0].discountPrice || similarProducts[0].price).toLocaleString('en-IN')}</p>
                </div>

                <span className="text-2xl font-light text-gray-400">+</span>

                {/* Bundle Item 2 */}
                <div className="text-center w-32">
                  <div className="aspect-[3/4] bg-white border border-gray-200 p-2 mb-2 cursor-pointer" onClick={() => { navigate(`/product/${similarProducts[1]._id}`); window.scrollTo(0,0); }}>
                    <img src={similarProducts[1].images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{similarProducts[1].name}</p>
                  <p className="text-xs font-bold mt-1">Rs {(similarProducts[1].discountPrice || similarProducts[1].price).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Bundle Action */}
              <div className="lg:border-l lg:border-gray-300 lg:pl-8 flex flex-col items-center lg:items-start text-center lg:text-left min-w-[200px]">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Price</p>
                <p className="text-2xl font-bold text-black mb-4">
                  Rs {((product.discountPrice || product.price) + 
                       (similarProducts[0].discountPrice || similarProducts[0].price) + 
                       (similarProducts[1].discountPrice || similarProducts[1].price)).toLocaleString('en-IN')}
                </p>
                <button 
                  onClick={() => {
                    handleAddToCart(); // Adds main item
                    dispatch(addToCart({
                      product: similarProducts[0]._id, name: similarProducts[0].name, image: similarProducts[0].images?.[0]?.url, price: similarProducts[0].discountPrice || similarProducts[0].price, size: similarProducts[0].sizes?.[0] || 'M', quantity: 1
                    }));
                    dispatch(addToCart({
                      product: similarProducts[1]._id, name: similarProducts[1].name, image: similarProducts[1].images?.[0]?.url, price: similarProducts[1].discountPrice || similarProducts[1].price, size: similarProducts[1].sizes?.[0] || 'M', quantity: 1
                    }));
                    toast.success('Bundle added to cart!');
                  }}
                  disabled={isAdmin}
                  className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors w-full disabled:opacity-50"
                >
                  Add all 3 to Cart
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-black uppercase tracking-widest text-black">Similar Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <div key={p._id} className="group cursor-pointer" onClick={() => { navigate(`/product/${p._id}`); window.scrollTo(0,0); }}>
                  <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative">
                    <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{p.brand || 'ZEN-G WEAR'}</h3>
                    <p className="text-sm font-bold text-black mb-2 line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">Rs {(p.discountPrice || p.price).toLocaleString('en-IN')}</span>
                      {p.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">Rs {p.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Edit Modal (Admin Only) */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-white border border-gray-200 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0a2885] text-white shrink-0 rounded-t-sm">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Edit2 size={16} /> Edit Listing Details
                </h2>
                <button onClick={() => setEditingProduct(null)} className="text-white/80 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                <form id="edit-product-form" onSubmit={handleSaveEdit} className="space-y-10">
                  
                  {/* Image Edit Section */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Product Image</h3>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-48 h-64 bg-gray-100 border border-gray-200 shrink-0 flex flex-col items-center justify-center overflow-hidden">
                        {editingProduct.imageUrl ? (
                          <img src={editingProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                        ) : (
                          <ImageIcon size={48} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Image URL *</label>
                        <input 
                          type="url" 
                          name="imageUrl" 
                          value={editingProduct.imageUrl} 
                          onChange={handleEditChange} 
                          required 
                          placeholder="https://example.com/image.jpg"
                          className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50" 
                        />
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Paste a valid image URL. The preview will update automatically.</p>
                      </div>
                    </div>
                  </section>

                  {/* Basic Info */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Product Name *</label>
                        <input type="text" name="name" value={editingProduct.name} onChange={handleEditChange} required className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Description</label>
                        <textarea name="description" value={editingProduct.description || ''} onChange={handleEditChange} rows="3" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 custom-scrollbar"></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Brand</label>
                        <input type="text" name="brand" value={editingProduct.brand || ''} onChange={handleEditChange} className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">SKU</label>
                        <input type="text" name="sku" value={editingProduct.sku || ''} onChange={handleEditChange} className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                    </div>
                  </section>

                  {/* Pricing & Inventory */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Regular Price (Rs) *</label>
                        <input type="number" name="price" value={editingProduct.price} onChange={handleEditChange} required min="0" step="0.01" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Discount Price (Rs)</label>
                        <input type="number" name="discountPrice" value={editingProduct.discountPrice || ''} onChange={handleEditChange} min="0" step="0.01" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Stock Quantity *</label>
                        <input type="number" name="stock" value={editingProduct.stock} onChange={handleEditChange} required min="0" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                    </div>
                  </section>

                  {/* Variations */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Variations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Sizes (comma separated)</label>
                        <input type="text" name="sizesStr" value={editingProduct.sizesStr || ''} onChange={handleEditChange} placeholder="S, M, L, XL" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Colors (comma separated)</label>
                        <input type="text" name="colorsStr" value={editingProduct.colorsStr || ''} onChange={handleEditChange} placeholder="Black, White, Red" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
                      </div>
                    </div>
                  </section>

                  {/* Visibility & Badges */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Visibility & Badges</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-gray-50 p-4 border border-gray-200">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isActive" checked={editingProduct.isActive || false} onChange={handleEditChange} className="w-4 h-4 accent-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600">Active</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isFeatured" checked={editingProduct.isFeatured || false} onChange={handleEditChange} className="w-4 h-4 accent-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600">Featured</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isTrending" checked={editingProduct.isTrending || false} onChange={handleEditChange} className="w-4 h-4 accent-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600">Trending</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isBestSeller" checked={editingProduct.isBestSeller || false} onChange={handleEditChange} className="w-4 h-4 accent-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600">Best Seller</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isNewArrival" checked={editingProduct.isNewArrival || false} onChange={handleEditChange} className="w-4 h-4 accent-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600">New Arrival</span>
                      </label>
                    </div>
                  </section>
                  
                </form>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0 rounded-b-sm">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-sm hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button form="edit-product-form" type="submit" disabled={isSaving} className="px-8 py-2 bg-[#2874f0] text-white text-sm font-bold rounded-sm flex items-center gap-2 hover:bg-[#0a2885] transition-colors disabled:opacity-50 shadow-sm">
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </span>
                  ) : (
                    <><CheckCircle2 size={16} /> Save Listing</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowSizeGuide(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold uppercase text-black mb-6 tracking-widest text-center border-b border-gray-100 pb-4">Size Guide</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-xs font-bold uppercase tracking-widest border border-gray-200">Size</th>
                      <th className="p-3 text-xs font-bold uppercase tracking-widest border border-gray-200">Chest (in)</th>
                      <th className="p-3 text-xs font-bold uppercase tracking-widest border border-gray-200">Length (in)</th>
                      <th className="p-3 text-xs font-bold uppercase tracking-widest border border-gray-200">Shoulder (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'S', chest: '38', length: '27', shoulder: '16.5' },
                      { size: 'M', chest: '40', length: '28', shoulder: '17' },
                      { size: 'L', chest: '42', length: '29', shoulder: '17.5' },
                      { size: 'XL', chest: '44', length: '30', shoulder: '18' },
                      { size: 'XXL', chest: '46', length: '30.5', shoulder: '18.5' },
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm font-bold border border-gray-200">{row.size}</td>
                        <td className="p-3 text-sm text-gray-600 border border-gray-200">{row.chest}</td>
                        <td className="p-3 text-sm text-gray-600 border border-gray-200">{row.length}</td>
                        <td className="p-3 text-sm text-gray-600 border border-gray-200">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">Measurements may vary slightly (± 0.5 inches) due to manufacturing processes.</p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
      `}} />
    </div>
  );
};

export default ProductDetails;
