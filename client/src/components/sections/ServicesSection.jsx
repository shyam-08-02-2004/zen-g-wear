import { motion } from 'framer-motion';

const categories = [
  {
    name: "Men's Collection",
    image: 'https://images.unsplash.com/photo-1516826957135-700ede19ebc1?auto=format&fit=crop&w=400&q=80',
    link: '/category/mens',
  },
  {
    name: "Women's Collection",
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    link: '/category/womens',
  },
  {
    name: "Kids Collection",
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=400&q=80',
    link: '/category/kids',
  },
];

const CategoriesSection = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Explore our wide range of clothing for everyone.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.05 }}
              className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-96">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <div className="flex flex-1 flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-gray-900 text-center">
                  <a href={category.link}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {category.name}
                  </a>
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
