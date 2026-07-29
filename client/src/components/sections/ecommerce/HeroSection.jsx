import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    id: 1,
    image: '/assets/banner_mens_fashion_1785317224477.jpg',
    link: '/shop?category=men',
    hotspots: [
      { id: 101, x: 30, y: 40, productTitle: "Classic Blue Shirt", price: "₹1,499", link: "/shop?keyword=shirt" },
      { id: 102, x: 75, y: 65, productTitle: "Denim Jeans", price: "₹2,199", link: "/shop?keyword=jeans" }
    ]
  },
  {
    id: 2,
    image: '/assets/banner_summer_sale_1785317235107.jpg',
    link: '/shop?offers=true',
    hotspots: [
      { id: 201, x: 50, y: 50, productTitle: "Summer Mega Sale", price: "Upto 50% Off", link: "/shop?offers=true" }
    ]
  },
  {
    id: 3,
    image: '/assets/banner_womens_fashion_1785317245637.jpg',
    link: '/shop?category=women',
    hotspots: [
      { id: 301, x: 35, y: 35, productTitle: "Floral Dress", price: "₹1,899", link: "/shop?keyword=dress" },
      { id: 302, x: 65, y: 70, productTitle: "Handbag", price: "₹999", link: "/shop?keyword=handbag" }
    ]
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      // Don't auto-slide if user is interacting with a hotspot
      if (activeHotspot === null) {
        setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [activeHotspot]);

  const nextSlide = () => setCurrentSlide(prev => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="w-full bg-white sm:p-2 sm:pt-4">
      <div className="max-w-[1248px] mx-auto relative group">
        
        {/* Slider Container */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] overflow-hidden relative sm:rounded-lg shadow-sm">
          <div 
            className="w-full h-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={banner.id} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                <Link to={banner.link} className="block w-full h-full">
                  <img 
                    src={banner.image} 
                    alt="Promotional Banner" 
                    className="w-full h-full object-cover animate-slow-zoom"
                  />
                </Link>
                
                {/* Hotspots */}
                {index === currentSlide && banner.hotspots && banner.hotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className="absolute z-10"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    onMouseEnter={() => setActiveHotspot(hotspot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                  >
                    {/* Pulsing Dot */}
                    <div className="relative flex items-center justify-center cursor-pointer">
                      <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full opacity-75 animate-ping"></div>
                      <div className="relative w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-[#2874f0]"></div>
                    </div>
                    
                    {/* Tooltip Card */}
                    <AnimatePresence>
                      {activeHotspot === hotspot.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-3 w-40 sm:w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
                        >
                          <div className="p-3 text-center">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{hotspot.productTitle}</h4>
                            <p className="text-xs font-black text-[#2874f0] mb-3">{hotspot.price}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(hotspot.link); }}
                              className="w-full bg-[#2874f0] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest py-2 rounded-sm hover:bg-[#1a5bbf] transition-colors flex items-center justify-center gap-1 sm:gap-2"
                            >
                              <Eye size={12} /> Shop Now
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white/80 p-4 sm:p-6 shadow-md rounded-r-md hidden sm:group-hover:flex"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white/80 p-4 sm:p-6 shadow-md rounded-l-md hidden sm:group-hover:flex"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === currentSlide ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
