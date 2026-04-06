import { Product, Cart, Order, CustomerInfo, CartItem } from '../types';

const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

export type CheckoutProvider = 'shopify' | 'razorpay' | 'local';

export interface CheckoutConfig {
  provider: CheckoutProvider;
  shopify: {
    enabled: boolean;
    storeDomain?: string;
    storefrontToken?: string;
  };
  razorpay: {
    enabled: boolean;
    keyId?: string;
  };
}

export const api = {
  products: {
    getAll: (lang = 'en') => 
      fetchAPI<Product[]>(`/products?lang=${lang}`),
    getById: (id: string, lang = 'en') => 
      fetchAPI<Product>(`/products/${id}?lang=${lang}`),
  },
  
  cart: {
    get: (cartId: string, lang = 'en') => 
      fetchAPI<Cart>(`/cart/${cartId}?lang=${lang}`),
    create: () => 
      fetchAPI<{ cartId: string }>('/cart', { method: 'POST' }),
    addItem: (cartId: string, productId: string, packId: string, quantity = 1) =>
      fetchAPI<Cart>(`/cart/${cartId}/items`, {
        method: 'POST',
        body: JSON.stringify({ productId, packId, quantity }),
      }),
    updateItem: (cartId: string, productId: string, packId: string, quantity: number) =>
      fetchAPI<Cart>(`/cart/${cartId}/items/${productId}/${packId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (cartId: string, productId: string, packId: string) =>
      fetchAPI<Cart>(`/cart/${cartId}/items/${productId}/${packId}`, {
        method: 'DELETE',
      }),
  },
  
  orders: {
    create: (items: CartItem[], customer: CustomerInfo) =>
      fetchAPI<{ success: boolean; order: { id: string; total: number } }>('/orders', {
        method: 'POST',
        body: JSON.stringify({ items, customer }),
      }),
    getById: (orderId: string, lang = 'en') =>
      fetchAPI<Order>(`/orders/${orderId}?lang=${lang}`),
    getAll: () =>
      fetchAPI<Order[]>('/orders'),
  },
  
  i18n: {
    getLanguages: () =>
      fetchAPI<Array<{ code: string; name: string; nativeName: string }>>('/i18n/languages'),
    getTranslations: (lang: string) =>
      fetchAPI<Record<string, unknown>>(`/i18n/${lang}`),
  },
  
  checkout: {
    getConfig: () =>
      fetchAPI<CheckoutConfig>('/checkout/config'),
  },
};