import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsService from '../../../services/productsService';

const ProductRow = ({ title, query, linkTo }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsService.getProducts(`?pageSize=8&${query}`)
      .then(res => {
        setProducts(res.data?.data || []);
      })
      .catch(err => console.error(err));
  }, [query]);

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-[#f1f3f6] sm:bg-transparent mb-2 sm:mb-4 font-sans">
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
        <div className="flex overflow-x-auto hide-scrollbar p-3 sm:p-6 gap-3 sm:gap-6">
          {products.map((product) => (
            <Link 
              key={product._id} 
              to={`/product/${product._id}`}
              className="flex flex-col items-center flex-shrink-0 w-[130px] sm:w-[200px] group p-2 sm:p-4 hover:shadow-md transition-all duration-300 rounded-sm bg-white border border-gray-50 sm:border-transparent hover:border-gray-100"
            >
              <div className="w-full h-[120px] sm:h-[180px] mb-2 sm:mb-4 overflow-hidden flex items-center justify-center">
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
              From ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
            </p>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
};

export default ProductRow;
