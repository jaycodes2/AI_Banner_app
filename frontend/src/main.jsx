import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BannerProvider } from './context/BannerContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BannerProvider>
        <App />
      </BannerProvider>
    </AuthProvider>
  </React.StrictMode>
);

