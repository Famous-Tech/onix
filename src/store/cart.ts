import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + product.price,
        };
      }

      return {
        items: [...state.items, { product, quantity: 1 }],
        total: state.total + product.price,
      };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
      total: state.items.reduce(
        (acc, item) =>
          item.product.id === productId
            ? acc
            : acc + item.product.price * item.quantity,
        0
      ),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
      total: state.items.reduce(
        (acc, item) =>
          item.product.id === productId
            ? acc + item.product.price * quantity
            : acc + item.product.price * item.quantity,
        0
      ),
    })),
  clearCart: () => set({ items: [], total: 0 }),
}));