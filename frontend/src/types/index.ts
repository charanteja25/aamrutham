export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
}