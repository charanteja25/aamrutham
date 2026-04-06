import { Router, Request, Response } from 'express';
import { products } from '../data/products';
import { CartItem } from '../types';

export const cartRoutes = Router();

const carts: Map<string, CartItem[]> = new Map();

const generateCartId = () => `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    const pack = product?.packs.find(p => p.id === item.packId);
    return total + (pack?.price || 0) * item.quantity;
  }, 0);
};

cartRoutes.get('/:cartId', (req: Request, res: Response) => {
  const { cartId } = req.params;
  const lang = req.query.lang as string || 'en';
  const items = carts.get(cartId) || [];
  
  const itemsWithDetails = items.map(item => {
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
        price: pack.price,
        originalPrice: pack.originalPrice
      } : null
    };
  });
  
  res.json({
    items: itemsWithDetails,
    total: calculateTotal(items)
  });
});

cartRoutes.post('/', (req: Request, res: Response) => {
  const cartId = generateCartId();
  carts.set(cartId, []);
  res.json({ cartId, items: [], total: 0 });
});

cartRoutes.post('/:cartId/items', (req: Request, res: Response) => {
  const { cartId } = req.params;
  const { productId, packId, quantity = 1 } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const pack = product.packs.find(p => p.id === packId);
  if (!pack) {
    return res.status(404).json({ error: 'Pack not found' });
  }
  
  const items = carts.get(cartId) || [];
  const existingIndex = items.findIndex(i => i.productId === productId && i.packId === packId);
  
  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push({ productId, packId, quantity });
  }
  
  carts.set(cartId, items);
  res.json({ cartId, items, total: calculateTotal(items) });
});

cartRoutes.put('/:cartId/items/:productId/:packId', (req: Request, res: Response) => {
  const { cartId, productId, packId } = req.params;
  const { quantity } = req.body;
  
  const items = carts.get(cartId) || [];
  const index = items.findIndex(i => i.productId === productId && i.packId === packId);
  
  if (index >= 0) {
    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = quantity;
    }
    carts.set(cartId, items);
  }
  
  res.json({ cartId, items, total: calculateTotal(items) });
});

cartRoutes.delete('/:cartId/items/:productId/:packId', (req: Request, res: Response) => {
  const { cartId, productId, packId } = req.params;
  
  const items = carts.get(cartId) || [];
  const filtered = items.filter(i => !(i.productId === productId && i.packId === packId));
  carts.set(cartId, filtered);
  
  res.json({ cartId, items: filtered, total: calculateTotal(filtered) });
});