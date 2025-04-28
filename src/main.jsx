import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store.js';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Analytics } from "@vercel/analytics/react";
import AppRoutes from './constants/AppRoutes.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Provider>
    <Analytics />
  </React.StrictMode>
);
