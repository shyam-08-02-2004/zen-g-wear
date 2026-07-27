import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 sm:pt-24 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Discover the latest in</span>
                <span className="block text-blue-600">Modern Fashion</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Upgrade your wardrobe with Zen-G Wear's exclusive collection of premium clothing. From casual wear to formal attire, we have something for every occasion.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:text-left">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:px-10 md:py-4 md:text-lg"
                >
                  Shop Now
                </Link>
                <Link
                  to="/categories/new-arrivals"
                  className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-200 md:px-10 md:py-4 md:text-lg"
                >
                  New Arrivals
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <img
                className="w-full rounded-lg"
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Clothing Collection"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
