import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryNav from './CategoryNav';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import GlobalPopup from '../ui/GlobalPopup';

const StoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] font-sans pb-14 md:pb-0">
      <Navbar />
      <CategoryNav />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <GlobalPopup />
    </div>
  );
};

export default StoreLayout;
