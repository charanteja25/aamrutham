import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore, CartItem } from '../store/cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    const item: CartItem = {
      id: product.id,
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative group">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <span className="text-6xl transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🥭</span>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-amber-600 transition-colors duration-200">{product.name}</h3>
        </Link>
        <p className="text-amber-600 font-bold text-xl mb-4">₹{product.price}</p>
        
        <div className="flex items-center justify-center gap-3 mb-4 bg-gray-50 rounded-full py-2 px-4">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="w-8 h-8 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-amber-700 transition-all duration-200 active:scale-90"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-lg text-gray-700">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="w-8 h-8 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-amber-50 flex items-center justify-center font-bold text-amber-700 transition-all duration-200 active:scale-90"
          >
            +
          </button>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isAnimating}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform ${
            isAdded
              ? 'bg-green-500 scale-105 shadow-lg shadow-green-200'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5'
          } text-white disabled:cursor-not-allowed`}
        >
          <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isAdded ? 'animate-bounce' : ''}`}>
            {isAdded ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('products.added')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('products.addToCart')}
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;