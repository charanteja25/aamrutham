import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('home.title')}</h1>
          <p className="text-xl mb-8">{t('home.subtitle')}</p>
          <Link
            to="/products"
            className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-100 transition"
          >
            {t('home.shopNow')}
          </Link>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('home.whyChoose')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold mb-2">{t('home.natural.title')}</h3>
            <p className="text-gray-600">{t('home.natural.desc')}</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">{t('home.delivery.title')}</h3>
            <p className="text-gray-600">{t('home.delivery.desc')}</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">{t('home.quality.title')}</h3>
            <p className="text-gray-600">{t('home.quality.desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;