import { Router, Request, Response } from 'express';
import { Order, CustomerInfo, CartItem } from '../types';
import { products } from '../data/products';

export const orderRoutes = Router();

const orders: Order[] = [];

const generateOrderId = () => `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    const pack = product?.packs.find(p => p.id === item.packId);
    return total + (pack?.price || 0) * item.quantity;
  }, 0);
};

orderRoutes.post('/', (req: Request, res: Response) => {
  const { items, customer }: { items: CartItem[]; customer: CustomerInfo } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
    return res.status(400).json({ error: 'Missing required customer information' });
  }
  
  const order: Order = {
    id: generateOrderId(),
    items,
    customer,
    total: calculateTotal(items),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  res.status(201).json({
    success: true,
    order: {
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt
    }
  });
});

orderRoutes.get('/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const lang = req.query.lang as string || 'en';
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const orderWithDetails = {
    ...order,
    items: order.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const pack = product?.packs.find(p => p.id === item.packId);
      return {
        ...item,
        product: product ? {
          id: product.id,
          name: lang === 'te' ? product.nameTe : product.name,
          image: product.image
        } : null,
        pack: pack ? {
          id: pack.id,
          name: lang === 'te' ? pack.nameTe : pack.name,
          price: pack.price
        } : null
      };
    })
  };
  
  res.json(orderWithDetails);
});

orderRoutes.get('/', (req: Request, res: Response) => {
  res.json(orders.map(o => ({
    id: o.id,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
    customerName: o.customer.name
  })));
});