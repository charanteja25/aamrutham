import { create } from 'zustand';
import { CheckoutProvider, CheckoutConfig } from '../services/api';
import { api } from '../services/api';

interface CheckoutState {
  config: CheckoutConfig | null;
  provider: CheckoutProvider;
  loading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  setProvider: (provider: CheckoutProvider) => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  config: null,
  provider: 'local',
  loading: false,
  error: null,
  
  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const config = await api.checkout.getConfig();
      set({ 
        config, 
        provider: config.provider,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to load checkout config', 
        loading: false,
        provider: 'local'
      });
    }
  },
  
  setProvider: (provider: CheckoutProvider) => {
    const { config } = get();
    
    if (provider === 'shopify' && !config?.shopify.enabled) {
      return;
    }
    if (provider === 'razorpay' && !config?.razorpay.enabled) {
      return;
    }
    
    set({ provider });
  },
}));