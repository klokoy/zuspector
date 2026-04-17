import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterState>()(
  devtools(
    set => ({
      count: 0,
      increment: () => set(s => ({ count: s.count + 1 }), false, 'increment'),
      decrement: () => set(s => ({ count: s.count - 1 }), false, 'decrement'),
      reset: () => set({ count: 0 }, false, 'reset'),
    }),
    { name: 'CounterStore' }
  )
);

type UserState = {
  user: { name: string; email: string } | null;
  theme: 'light' | 'dark';
  setUser: (user: UserState['user']) => void;
  toggleTheme: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    set => ({
      user: { name: 'Alice', email: 'alice@example.com' },
      theme: 'dark',
      setUser: user => set({ user }, false, 'setUser'),
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' }), false, 'toggleTheme'),
    }),
    { name: 'UserStore' }
  )
);
