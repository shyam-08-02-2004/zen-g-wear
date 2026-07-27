import HeroSection from '../components/sections/ecommerce/HeroSection';
import BestSellers from '../components/sections/ecommerce/BestSellers';
import RecentlyViewed from '../components/sections/ecommerce/RecentlyViewed';
import ProductRow from '../components/sections/ecommerce/ProductRow';

const Home = () => {
  return (
    <div className="flex flex-col text-ink w-full">
      {/* Banner Carousel */}
      <HeroSection />
      
      {/* Horizontal Scrolling Product Rows */}
      <div className="max-w-[1248px] mx-auto mt-4 space-y-4 px-2 sm:px-4 w-full">
        <BestSellers />
        
        <ProductRow 
          title="Best of Watches" 
          query="subcategory=watches" 
          linkTo="/shop?subcategory=watches" 
        />
        
        <ProductRow 
          title="Trending Shoes" 
          query="subcategory=shoes" 
          linkTo="/shop?subcategory=shoes" 
        />
        
        <ProductRow 
          title="Men's Fashion" 
          query="categoryName=men" 
          linkTo="/shop?category=men" 
        />
        
        <ProductRow 
          title="Women's Fashion" 
          query="categoryName=women" 
          linkTo="/shop?category=women" 
        />
        
        <ProductRow 
          title="Kids Collection" 
          query="categoryName=kids" 
          linkTo="/shop?category=kids" 
        />
        
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default Home;
