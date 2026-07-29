import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: '/assets/banner_mens_fashion_1785317224477.jpg',
    link: '/shop?category=men'
  },
  {
    id: 2,
    image: '/assets/banner_summer_sale_1785317235107.jpg',
    link: '/shop?offers=true'
  },
  {
    id: 3,
    image: '/assets/banner_womens_fashion_1785317245637.jpg',
    link: '/shop?category=women'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
            {banners.map((banner) => (
              <Link key={banner.id} to={banner.link} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                <img 
                  src={banner.image} 
                  alt="Promotional Banner" 
                  className="w-full h-full object-cover animate-slow-zoom"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white/80 p-6 shadow-md rounded-r-md hidden sm:group-hover:flex"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white/80 p-6 shadow-md rounded-l-md hidden sm:group-hover:flex"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
