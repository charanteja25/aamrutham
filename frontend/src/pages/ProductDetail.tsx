import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore, CartItem } from '../store/cartStore';

const products: Record<string, { name: string; price: number; image?: string; description: string }> = {
  '1': { name: 'Bobbili Peechu', price: 899, image: '/assets/bobbili-peechu.jpg', description: 'Sweet and juicy mangoes from Bobbili region.' },
  '2': { name: 'Imam Pasand', price: 999, image: '/assets/imam-pasand.jpg', description: 'Premium variety known for its exceptional taste.' },
  '3': { name: 'Kothapalli Kobbari', price: 799, image: '/assets/Kothapalli-Kobbari.jpg', description: 'Traditional variety with unique coconut-like flavor.' },
  '4': { name: 'Mettavalasa Peechu', price: 849, image: '/assets/mettavalasa-peechu.jpg', description: 'Handpicked from Mettavalasa orchards.' },
};

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const product = id ? products[id] : null;
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">{t('productDetail.notFound')}</h1>
        <Link to="/products" className="text-amber-600 hover:underline">{t('productDetail.backToProducts')}</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAnimating(true);
    const item: CartItem = {
      id: id!,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    };
    addItem(item);
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => {
      setIsAdded(false);
      setIsAnimating(false);
    }, 1200);
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const increaseQuantity = () => {
    setQuantity((q) => q + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 transition-colors duration-200 group">
        <span className="transform transition-transform duration-200 group-hover:-translate-x-1">←</span>
        {t('productDetail.backToProducts')}
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <div className="relative h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg group">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <span className="text-9xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">🥭</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
          <p className="text-3xl text-amber-600 font-bold mb-4">₹{product.price}</p>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description}</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-semibold text-lg">{t('productDetail.quantity')}:</span>
              <div className="flex items-center gap-3 bg-white rounded-full shadow-sm px-2 py-1">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 bg-gray-100 rounded-full hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-amber-700 transition-all duration-200 active:scale-90 hover:shadow-md"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-xl text-gray-800">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 bg-gray-100 rounded-full hover:bg-amber-100 flex items-center justify-center font-bold text-amber-700 transition-all duration-200 active:scale-90 hover:shadow-md"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4 text-gray-600">
              <span>{t('cart.subtotal')}</span>
              <span className="font-semibold text-lg">₹{(product.price * quantity).toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAnimating}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                isAdded
                  ? 'bg-green-500 scale-105 shadow-xl shadow-green-200'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-200 hover:-translate-y-1'
              } text-white disabled:cursor-not-allowed`}
            >
              <span className={`flex items-center justify-center gap-3 transition-all duration-300 ${isAdded ? 'animate-bounce' : ''}`}>
                {isAdded ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('productDetail.added')}
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {t('productDetail.addToCart')}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;