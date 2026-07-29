import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes.jsx';
import SlideOutCart from './components/cart/SlideOutCart.jsx';

// One-time migration: clear old malformed auth storage so refresh works correctly
try {
  const raw = localStorage.getItem('userInfo');
  if (raw) {
    const parsed = JSON.parse(raw);
    // Old format had nested { success, data: { user, accessToken } }
    // If it still has the old nested shape, clear it so user re-logs in fresh
    if (parsed?.success !== undefined || parsed?.data !== undefined) {
      localStorage.removeItem('userInfo');
    }
  }
} catch {
  localStorage.removeItem('userInfo');
}

function App() {
  const { cartItems, totalPrice } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  
  const initialRender = useRef(true);

  // Sync cart with backend when it changes
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    if (userInfo && userInfo.token) {
      const syncCart = async () => {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userInfo.token}`
            },
            body: JSON.stringify({ cartItems, totalPrice })
          });
        } catch (error) {
          console.error('Failed to sync cart', error);
        }
      };
      
      // Debounce slightly to avoid too many requests
      const timeoutId = setTimeout(() => {
        syncCart();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, totalPrice, userInfo]);

  return (
    <>
      <SlideOutCart />
      <AppRoutes />
    </>
  );
}

export default App;
