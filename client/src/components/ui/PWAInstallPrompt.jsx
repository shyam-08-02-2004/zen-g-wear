import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

/**
 * Floating install prompt for the PWA.
 * It appears as a small round button at the top‑right corner when the
 * `beforeinstallprompt` event fires. Clicking the button triggers the native
 * install dialog.
 */
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // prevent automatic mini‑banner
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // Hide button regardless of outcome
    setShow(false);
    setDeferredPrompt(null);
    console.log('PWA install outcome:', outcome);
  };

  if (!show) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed top-4 right-4 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
      aria-label="Add Zen‑G Wear to Home Screen"
    >
      <Download size={24} className="text-white" />
    </button>
  );
};

export default PWAInstallPrompt;
