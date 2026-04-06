import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-amber-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🥭</span> Aamrutham
            </h3>
            <p className="text-amber-200">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-amber-200">
              <li><Link to="/products" className="hover:text-white transition">{t('header.products')}</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">{t('header.cart')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <p className="text-amber-200">{t('footer.email')}</p>
          </div>
        </div>
        <div className="border-t border-amber-700 mt-8 pt-8 text-center text-amber-200">
          <p>&copy; 2024 Aamrutham. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;