import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CartAnimation from './components/CartAnimation';
import SeasonPassPrompt from './components/SeasonPassPrompt';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import { InventoryProvider } from './context/InventoryContext';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TeamPage from './pages/TeamPage';
import MaasPage from './pages/MaasPage';
import SignatureBoxPage from './pages/SignatureBoxPage';
import ValuesPage from './pages/ValuesPage';

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
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    );
  }
  return (
    <InventoryProvider>
      <div className="app-shell">
        <ScrollManager />
        <Navbar />
        <CartDrawer />
        <CartAnimation />
        <SeasonPassPrompt />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failure" element={<PaymentFailurePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/maas" element={<MaasPage />} />
          <Route path="/signature-box" element={<SignatureBoxPage />} />
          <Route path="/values" element={<ValuesPage />} />
        </Routes>
        <Footer />
        <WhatsAppFloat />
      </div>
    </InventoryProvider>
  );
}
