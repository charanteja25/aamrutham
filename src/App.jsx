import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CartAnimation from './components/CartAnimation';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = window.setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return undefined;
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollManager />
      <Navbar />
      <CartDrawer />
      <CartAnimation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
