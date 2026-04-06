import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      const newItems = existingItem
        ? state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        : [...state.items, item];
      return { items: newItems, total: calculateTotal(newItems) };
    }),
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      return { items: newItems, total: calculateTotal(newItems) };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) => (i.id === id ? { ...i, quantity } : i));
      return { items: newItems, total: calculateTotal(newItems) };
    }),
  clearCart: () => set({ items: [], total: 0 }),
}));