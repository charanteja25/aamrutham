import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import { CartItem } from '../types';
import { products } from '../data/products';

export const razorpayRoutes = Router();

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    const pack = product?.packs.find(p => p.id === item.packId);
    return total + (pack?.price || 0) * item.quantity;
  }, 0);
};

const getRazorpayInstance = (): Razorpay | null => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    return null;
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

razorpayRoutes.post('/create-order', async (req: Request, res: Response) => {
  const { items, receipt } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    return res.status(500).json({ error: 'Razorpay not configured' });
  }
  
  const amount = calculateTotal(items);
  const amountInPaise = Math.round(amount * 100);
  
  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    });
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

razorpayRoutes.post('/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: 'Razorpay not configured' });
  }
  
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  
  if (expectedSignature === razorpay_signature) {
    res.json({ verified: true, paymentId: razorpay_payment_id });
  } else {
    res.status(400).json({ verified: false, error: 'Invalid signature' });
  }
});