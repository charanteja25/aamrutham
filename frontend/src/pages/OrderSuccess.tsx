import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderSuccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold mb-4">{t('orderSuccess.title')}</h1>
      <p className="text-gray-600 mb-8">{t('orderSuccess.message')}</p>
      <Link
        to="/products"
        className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition"
      >
        {t('orderSuccess.continueShopping')}
      </Link>
    </div>
  );
};

export default OrderSuccess;