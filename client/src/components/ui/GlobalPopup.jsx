import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const GlobalPopup = () => {
  const [settings, setSettings] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has closed the popup in this session
    if (sessionStorage.getItem('popupClosed')) return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
        const data = await res.json();
        const siteSettings = data?.data?.settings;
        
        if (siteSettings && siteSettings.popupEnabled) {
          setSettings(siteSettings);
          // Show popup after a small delay
          setTimeout(() => setIsOpen(true), 2000);
        }
      } catch (err) {
        console.error('Failed to fetch site settings', err);
      }
    };
    
    fetchSettings();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('popupClosed', 'true');
  };

  if (!isOpen || !settings) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white max-w-md w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-black" />
        </button>
        
        {settings.popupImageUrl && (
          <div className="w-full h-48 bg-gray-100">
            <img 
              src={settings.popupImageUrl} 
              alt="Promo" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-black uppercase tracking-widest mb-3">
            {settings.popupTitle}
          </h2>
          <p className="text-gray-600 mb-8 text-sm">
            {settings.popupMessage}
          </p>
          
          <Link 
            to={settings.popupLink || '/shop'} 
            onClick={handleClose}
            className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors w-full"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlobalPopup;
