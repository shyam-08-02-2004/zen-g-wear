import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App.jsx';
import { store } from './redux/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            // ToastCard (components/ui/Toast.jsx) renders its own card via
            // toast.custom, so the default react-hot-toast chrome is
            // stripped down to just positioning.
            style: { background: 'transparent', boxShadow: 'none', padding: 0, margin: 0 },
          }}
        />
      </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
