import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import productsService from '../../services/productsService';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productsService.getProducts('?pageSize=2000&all=true'); // Fetch all for admin
      setProducts(data?.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productsService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEditClick = (product) => {
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB for direct upload.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setEditingProduct({
      _id: null,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      brand: 'ZEN-G WEAR',
      sku: `ZGW-${Math.floor(Math.random() * 100000)}`,
      material: '100% Cotton',
      isActive: true,
      imageUrl: '',
      sizesStr: 'S, M, L, XL',
      colorsStr: 'Black, White',
      category: 'men',
      subcategory: 'tshirt'
    });
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
        category: editingProduct.category,
        subcategory: editingProduct.subcategory
      };
      
      if (editingProduct._id) {
        await productsService.updateProduct(editingProduct._id, updateData);
        toast.success('Product updated successfully');
      } else {
        await productsService.createProduct(updateData);
        toast.success('Product created successfully');
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = stockFilter === 'all' 
      ? true 
      : stockFilter === 'out_of_stock' 
        ? p.stock === 0 
        : stockFilter === 'low_stock' 
          ? p.stock > 0 && p.stock <= 10 
          : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0a2885] mb-1">Listings / Products</h1>
          <p className="text-sm text-gray-500">Manage your Zen-G Wear inventory and pricing.</p>
        </div>
        <button onClick={handleAddNew} className="bg-[#2874f0] text-white px-6 py-2.5 text-sm font-bold shadow-sm hover:shadow-md hover:bg-[#0a2885] transition-all rounded-sm flex items-center gap-2">
          <Plus size={18} /> Add New Listing
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by product name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          />
        </div>
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 bg-white text-xs font-bold uppercase focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="low_stock">Low Stock (≤10)</option>
          </select>
          <span className="text-sm font-bold text-[#0a2885] whitespace-nowrap">
            {filteredProducts.length} Items
          </span>
        </div>
      </div>

      {/* Products Grid (Shop-like UI for Admin) */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-gray-200 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-sm group relative flex flex-col border border-gray-200 hover:border-[#2874f0] hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Clickable Image Area */}
                <div 
                  className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleEditClick(product)}
                >
                  {product.images?.[0]?.url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={32} /></div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                    {!product.isActive && (
                      <span className="bg-gray-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">DRAFT</span>
                    )}
                    {product.stock <= 10 && product.stock > 0 && (
                      <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">LOW: {product.stock}</span>
                    )}
                    {product.stock === 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">OUT OF STOCK</span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-2 flex flex-col flex-grow border-t border-gray-100 bg-gray-50/50 cursor-pointer" onClick={() => handleEditClick(product)}>
                  <p className="text-[10px] text-gray-400 uppercase mb-0.5">{product.brand || 'No Brand'}</p>
                  <h3 className="text-xs text-gray-800 font-medium line-clamp-2 mb-1 group-hover:text-[#2874f0] transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mt-auto">
                    <span className="text-sm font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
                    {product.discountPrice && (
                      <span className="text-[10px] font-bold text-green-600">{product.discountPercentage}% off</span>
                    )}
                  </div>
                  <div className="mt-1 text-[10px]">
                    {product.stock > 10 ? (
                      <span className="text-green-600">✓ {product.stock} in stock</span>
                    ) : product.stock > 0 ? (
                      <span className="text-orange-500">⚠ Only {product.stock} left</span>
                    ) : (
                      <span className="text-red-500">✕ Out of stock</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons — Always visible, full width below card */}
                <div className="flex border-t border-gray-200">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditClick(product); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#2874f0] hover:bg-[#2874f0] hover:text-white transition-colors border-r border-gray-200"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full sm:max-w-4xl bg-white sm:border border-gray-200 shadow-2xl flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0a2885] text-white shrink-0 rounded-t-sm">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Edit2 size={16} /> {editingProduct._id ? 'Edit Listing Details' : 'Add New Listing'}
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
                      <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Upload from Gallery</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-[#2874f0] file:text-white hover:file:bg-[#0a2885] cursor-pointer bg-gray-50 border border-gray-200"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                           <hr className="flex-1 border-gray-200" />
                           <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
                           <hr className="flex-1 border-gray-200" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Image URL *</label>
                          <input 
                            type="url" 
                            name="imageUrl" 
                            value={editingProduct.imageUrl} 
                            onChange={handleEditChange} 
                            required={!editingProduct.imageUrl}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50" 
                          />
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Paste a valid image URL. The preview will update automatically.</p>
                        </div>
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
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Section / Category *</label>
                        <select 
                          value={`${editingProduct.category}-${editingProduct.subcategory}`} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if(val === '-') {
                              setEditingProduct(prev => ({...prev, category: '', subcategory: ''}));
                              return;
                            }
                            const [cat, sub] = val.split('-');
                            setEditingProduct(prev => ({...prev, category: cat, subcategory: sub}));
                          }} 
                          required 
                          className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50"
                        >
                          <option value="-">Select Section (e.g. Men's T-Shirt)</option>
                          <optgroup label="Men">
                            {['tshirt', 'shirt', 'hoodie', 'sweatshirt', 'jacket', 'blazer', 'jeans', 'trousers', 'shorts', 'trackpants', 'joggers', 'cargo', 'vest', 'brief', 'boxer', 'innerwear', 'socks', 'sportsshoes', 'casualshoes', 'formalshoes', 'sandals', 'slippers', 'watches', 'belt', 'wallet', 'cap', 'sunglasses', 'ethnicwear'].map(s => (
                              <option key={`men-${s}`} value={`men-${s}`}>Men's {s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Women">
                            {['dress', 'top', 'tshirt', 'shirt', 'hoodie', 'sweatshirt', 'jacket', 'jeans', 'trousers', 'leggings', 'palazzo', 'skirt', 'kurti', 'kurta', 'saree', 'lehenga', 'ethnicwear', 'bra', 'panty', 'sportsbra', 'lingerie', 'shapewear', 'nightwear', 'heels', 'flats', 'sneakers', 'sandals', 'handbag', 'wallet', 'jewellery', 'watches', 'beauty', 'accessories'].map(s => (
                              <option key={`women-${s}`} value={`women-${s}`}>Women's {s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Kids">
                            {['boysclothing', 'girlsclothing', 'babyclothing', 'tshirt', 'shirt', 'jeans', 'shorts', 'frock', 'dress', 'schooluniform', 'winterwear', 'schoolbag', 'shoes', 'sandals', 'watches', 'cap', 'toys', 'babycare', 'accessories'].map(s => (
                              <option key={`kids-${s}`} value={`kids-${s}`}>Kids {s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </optgroup>
                        </select>
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
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Sizes (comma separated)</label>
                        <input type="text" name="sizesStr" value={editingProduct.sizesStr || ''} onChange={handleEditChange} placeholder="S, M, L, XL" className="w-full rounded-none border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50" />
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
                    <><CheckCircle size={16} /> Save Listing</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
      `}} />
    </div>
  );
};

export default AdminProductsPage;
