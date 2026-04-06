import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';

const products = [
  { id: '1', name: 'Bobbili Peechu', price: 899, image: '/assets/bobbili-peechu.jpg' },
  { id: '2', name: 'Imam Pasand', price: 999, image: '/assets/imam-pasand.jpg' },
  { id: '3', name: 'Kothapalli Kobbari', price: 799, image: '/assets/Kothapalli-Kobbari.jpg' },
  { id: '4', name: 'Mettavalasa Peechu', price: 849, image: '/assets/mettavalasa-peechu.jpg' },
];

const Products: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('products.title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;