import { Link } from 'react-router-dom';

const brands = [
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.svg' },
  { name: 'Zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg' },
  { name: 'H&M', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg' },
  { name: 'Levi\'s', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Levi%27s_logo.svg' },
  { name: 'U.S. Polo Assn.', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/98/U.S._Polo_Assn._Logo.png' },
];

const TopBrands = () => {
  return (
    <div className="w-full py-16 bg-white border-t border-mist">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-ink">
            Top Brands
          </h2>
          <Link to="/brands" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
            View All
          </Link>
        </div>
        
        <div className="flex justify-between items-center overflow-x-auto gap-8 pb-4 hide-scrollbar">
          {brands.map((brand, i) => (
            <div key={i} className="min-w-[100px] h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
              <img src={brand.logo} alt={brand.name} className="max-h-12 max-w-[120px] object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBrands;
