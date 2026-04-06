import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productRoutes } from './routes/products';
import { cartRoutes } from './routes/cart';
import { orderRoutes } from './routes/orders';
import { i18nRoutes } from './routes/i18n';
import { checkoutRoutes } from './routes/checkout';
import { razorpayRoutes } from './routes/razorpay';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/i18n', i18nRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/razorpay', razorpayRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});