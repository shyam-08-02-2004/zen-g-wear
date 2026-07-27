import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsService from '../../../services/productsService';

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products for Best Sellers display (e.g. fashion/electronics)
    productsService.getProducts('?pageSize=8')
      .then(res => {
        setProducts(res.data?.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-white sm:rounded-sm shadow-sm overflow-hidden">
      {/* Header section */}
      <div className="flex justify-between items-center px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Best of Zen-G</h2>
        <Link 
          to="/shop" 
          className="bg-[#2874f0] text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow hover:shadow-md transition-shadow"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Horizontal Scrolling Products */}
      <div className="flex overflow-x-auto hide-scrollbar p-4 sm:p-6 gap-4 sm:gap-6">
        {products.map((product) => (
          <Link 
            key={product._id} 
            to={`/product/${product._id}`}
            className="flex flex-col items-center flex-shrink-0 w-[150px] sm:w-[200px] group p-2 sm:p-4 hover:shadow-md transition-all duration-300 rounded-sm bg-white border border-transparent hover:border-gray-100"
          >
            <div className="w-full h-[140px] sm:h-[180px] mb-4 overflow-hidden flex items-center justify-center">
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
            
            <p className="text-sm text-gray-700 text-center line-clamp-1 mb-1.5 group-hover:text-[#2874f0] transition-colors">
              {product.name}
            </p>
            <p className="text-[#388e3c] text-base font-bold text-center">
              From ₹{Math.round(product.discountPrice || product.price).toLocaleString('en-IN')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
