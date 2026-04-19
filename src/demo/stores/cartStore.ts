import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  coupon: string | null;
  total: () => number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  applyCoupon: (code: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [
        { id: 1, name: 'Mechanical Keyboard', price: 129.99, quantity: 1 },
        { id: 2, name: 'USB-C Hub', price: 49.99, quantity: 2 },
        { id: 3, name: 'Monitor Stand', price: 35.00, quantity: 1 },
      ],
      coupon: null,
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: item => set(
        s => {
          const existing = s.items.find(i => i.id === item.id);
          if (existing) {
            return { items: s.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        },
        false,
        'addItem'
      ),
      removeItem: id => set(s => ({ items: s.items.filter(i => i.id !== id) }), false, 'removeItem'),
      updateQuantity: (id, quantity) => set(
        s => ({ items: s.items.map(i => i.id === id ? { ...i, quantity } : i) }),
        false,
        'updateQuantity'
      ),
      applyCoupon: code => set({ coupon: code }, false, 'applyCoupon'),
      clearCart: () => set({ items: [], coupon: null }, false, 'clearCart'),
    }),
    { name: 'CartStore' }
  )
);
