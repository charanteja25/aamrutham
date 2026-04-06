import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/cartStore';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'te' ? 'en' : 'te';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-3xl">🥭</span>
            <span>Aamrutham</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-amber-100 transition font-medium">{t('header.home')}</Link>
            <Link to="/products" className="hover:text-amber-100 transition font-medium">{t('header.products')}</Link>
            <Link to="/cart" className="hover:text-amber-100 transition font-medium relative">
              {t('header.cart')}
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleLanguage}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm font-medium transition"
            >
              {i18n.language === 'te' ? 'English' : 'తెలుగు'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;