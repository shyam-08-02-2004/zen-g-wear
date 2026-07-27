import { Link } from 'react-router-dom';

const catData = [
  { name: 'Men', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=200&q=80', link: '/shop?category=men' },
  { name: 'Women', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=200&q=80', link: '/shop?category=women' },
  { name: 'Kids', img: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=200&q=80', link: '/shop?category=kids' },
  { name: 'T-Shirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80', link: '/shop?category=t-shirts' },
  { name: 'Shirts', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=200&q=80', link: '/shop?category=shirts' },
  { name: 'Jeans', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=200&q=80', link: '/shop?category=jeans' },
  { name: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80', link: '/shop?category=shoes' },
  { name: 'Accessories', img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=200&q=80', link: '/shop?category=accessories' }
];

const ShopByCategory = () => {
  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-ink">
            Shop By Category
          </h2>
          <Link to="/shop" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
            View All
          </Link>
        </div>
        
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 hide-scrollbar">
          {catData.map((cat, i) => (
            <Link key={i} to={cat.link} className="flex flex-col items-center group min-w-[100px] md:min-w-[140px]">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border border-mist shadow-sm premium-shadow-hover">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-sm font-semibold text-ink-soft group-hover:text-ink">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
