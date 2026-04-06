interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  keyId: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill: {
    name: string;
    email?: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptLoaded = false;

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (scriptLoaded || window.Razorpay) {
      scriptLoaded = true;
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => {
      scriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export interface RazorpayCheckoutParams {
  order: RazorpayOrder;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  onSuccess: (response: RazorpayResponse) => void;
  onCancel?: () => void;
}

export const razorpayService = {
  async createOrder(items: Array<{ productId: string; packId: string; quantity: number }>): Promise<RazorpayOrder> {
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }
    
    return response.json();
  },
  
  async verifyPayment(response: RazorpayResponse): Promise<{ verified: boolean; paymentId?: string }> {
    const res = await fetch('/api/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    });
    
    const data = await res.json();
    return data;
  },
  
  async openCheckout(params: RazorpayCheckoutParams): Promise<void> {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }
    
    const options: RazorpayOptions = {
      key: params.order.keyId,
      amount: params.order.amount,
      currency: params.order.currency,
      order_id: params.order.id,
      name: 'Aamrutham',
      description: 'Premium Heritage Mangoes',
      image: '/aam-final.png',
      prefill: {
        name: params.customerName,
        email: params.customerEmail || '',
        contact: params.customerPhone,
      },
      theme: {
        color: '#f97316',
      },
      handler: params.onSuccess,
      modal: {
        ondismiss: params.onCancel,
      },
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  },
};

export type { RazorpayOrder, RazorpayResponse };