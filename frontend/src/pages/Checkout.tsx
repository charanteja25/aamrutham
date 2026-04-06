import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore } from '../store/checkoutStore';
import { api, CheckoutProvider } from '../services/api';
import { shopifyService, CartLineItem } from '../services/shopify';
import { razorpayService } from '../services/razorpay';
import { getShopifyVariantId, isShopifyConfigured } from '../config/shopifyProducts';
import { CustomerInfo } from '../types';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { config, provider, loading: configLoading, fetchConfig, setProvider } = useCheckoutStore();
  
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);
  
  const isShopifyReady = config?.shopify.enabled && isShopifyConfigured();
  const isRazorpayReady = config?.razorpay.enabled;
  
  const availableProviders: Array<{ id: CheckoutProvider; name: string; available: boolean }> = [
    { id: 'shopify', name: 'Shopify Checkout', available: isShopifyReady || false },
    { id: 'razorpay', name: 'Razorpay', available: isRazorpayReady || false },
    { id: 'local', name: 'Cash on Delivery', available: true },
  ];
  
  const validateForm = (requireAddress: boolean) => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (requireAddress) {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Invalid pincode';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleShopifyCheckout = async () => {
    setLoading(true);
    try {
      const lineItems: CartLineItem[] = [];
      
      for (const item of items) {
        const variantId = getShopifyVariantId(item.productId, item.packId);
        if (variantId) {
          lineItems.push({
            variantId,
            quantity: item.quantity,
          });
        }
      }
      
      if (lineItems.length === 0) {
        throw new Error('No valid Shopify products found');
      }
      
      const checkout = await shopifyService.createCheckout(lineItems);
      clearCart();
      shopifyService.redirectToCheckout(checkout);
    } catch (error) {
      console.error('Failed to create Shopify checkout:', error);
      alert('Failed to redirect to checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRazorpayCheckout = async () => {
    setLoading(true);
    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        packId: item.packId,
        quantity: item.quantity,
      }));
      
      const order = await razorpayService.createOrder(cartItems);
      
      await razorpayService.openCheckout({
        order,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        onSuccess: async (response) => {
          const verification = await razorpayService.verifyPayment(response);
          if (verification.verified) {
            const result = await api.orders.create(cartItems, formData);
            clearCart();
            navigate(`/order-success/${result.order.id}?payment=${verification.paymentId}`);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Failed to create Razorpay checkout:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) return;
    
    setLoading(true);
    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        packId: item.packId,
        quantity: item.quantity,
      }));
      
      const result = await api.orders.create(cartItems, formData);
      clearCart();
      navigate(`/order-success/${result.order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requireAddress = provider === 'local';
    
    if (!validateForm(requireAddress)) return;
    
    switch (provider) {
      case 'shopify':
        handleShopifyCheckout();
        break;
      case 'razorpay':
        handleRazorpayCheckout();
        break;
      case 'local':
      default:
        handleLocalCheckout(e);
        break;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
            {t('cart.empty')}
          </h2>
          <Link to="/products" className="btn-primary">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }
  
  const requireAddress = provider === 'local';
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-8">
          {t('checkout.title')}
        </h1>
        
        {configLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {availableProviders.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        disabled={!p.available}
                        onClick={() => setProvider(p.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          provider === p.id
                            ? 'border-mango-500 bg-mango-50'
                            : p.available
                              ? 'border-gray-200 hover:border-mango-300'
                              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{p.name}</span>
                          {!p.available && (
                            <span className="text-xs text-gray-400">Not configured</span>
                          )}
                        </div>
                        {p.id === 'shopify' && p.available && (
                          <p className="text-xs text-gray-500 mt-1">Secure checkout via Shopify</p>
                        )}
                        {p.id === 'razorpay' && p.available && (
                          <p className="text-xs text-gray-500 mt-1">Cards, UPI, Netbanking</p>
                        )}
                        {p.id === 'local' && (
                          <p className="text-xs text-gray-500 mt-1">Pay when you receive</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {t('checkout.customerInfo')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-mango-500 focus:border-transparent`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-mango-500 focus:border-transparent`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mango-500 focus:border-transparent"
                    />
                  </div>
                  
                  {requireAddress && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.address')} *
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-mango-500 focus:border-transparent`}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.city')} *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-mango-500 focus:border-transparent`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.pincode')} *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.pincode ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-mango-500 focus:border-transparent`}
                        />
                        {errors.pincode && (
                          <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading 
                    ? t('common.loading') 
                    : provider === 'shopify'
                      ? 'Proceed to Secure Checkout'
                      : provider === 'razorpay'
                        ? 'Pay Now'
                        : t('checkout.placeOrder')
                  }
                </button>
                
                {provider === 'shopify' && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure checkout powered by Shopify
                  </p>
                )}
                
                {provider === 'razorpay' && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure payment via Razorpay
                  </p>
                )}
              </form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {t('cart.title')}
                </h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.packId}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.product?.name || 'Product'} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{((item.pack?.price || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('cart.subtotal')}</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('cart.shipping')}</span>
                    <span className="text-green-600">{t('cart.free')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                    <span>{t('cart.total')}</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}