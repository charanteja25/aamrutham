export interface Product {
  id: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  inStock: boolean;
  unit: string;
  unitTe: string;
  packs: ProductPack[];
}

export interface ProductPack {
  id: string;
  name: string;
  nameTe: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  savings?: number;
}

export interface CartItem {
  productId: string;
  packId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Translation {
  [key: string]: string | Translation;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}