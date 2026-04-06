import { Router, Request, Response } from 'express';
import { CheckoutConfig, CheckoutProvider } from '../types/checkout';

export const checkoutRoutes = Router();

const getCheckoutConfig = (): CheckoutConfig => {
  const shopifyEnabled = process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN;
  const razorpayEnabled = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
  
  let provider: CheckoutProvider = 'local';
  
  if (shopifyEnabled) {
    provider = 'shopify';
  } else if (razorpayEnabled) {
    provider = 'razorpay';
  }
  
  return {
    provider,
    shopify: {
      enabled: Boolean(shopifyEnabled),
      storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
      storefrontToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
    },
    razorpay: {
      enabled: Boolean(razorpayEnabled),
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  };
};

checkoutRoutes.get('/config', (req: Request, res: Response) => {
  const config = getCheckoutConfig();
  res.json(config);
});