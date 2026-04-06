import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/cartStore';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-4">{t('cart.empty')}</h1>
        <Link 
          to="/products" 
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8\">{t('cart.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b py-4">
              <div className="w-20 h-20 bg-amber-100 rounded-lg flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl">🥭</span>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-amber-600 font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 bg-white rounded-full hover:bg-amber-50 flex items-center justify-center font-bold transition"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-white rounded-full hover:bg-amber-50 flex items-center justify-center font-bold transition"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 font-medium transition"
              >
                {t('cart.remove')}
              </button>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
          <div className="flex justify-between mb-2">
            <span>{t('cart.subtotal')}</span>
            <span className="font-semibold">₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>{t('cart.shipping')}</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>{t('cart.total')}</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-amber-600 text-white text-center py-3 rounded-lg mt-6 hover:bg-amber-700 transition font-semibold"
          >
            {t('cart.proceedToCheckout')}
          </Link>
          <button
            onClick={clearCart}
            className="w-full text-red-500 mt-4 hover:text-red-700 transition font-medium"
          >
            {t('cart.clearCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;