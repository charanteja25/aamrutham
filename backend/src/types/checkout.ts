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

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}