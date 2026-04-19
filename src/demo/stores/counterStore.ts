import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type CounterState = {
  count: number;
  step: number;
  increment: () => void;
  decrement: () => void;
  setStep: (step: number) => void;
  reset: () => void;
};

export const useCounterStore = create<CounterState>()(
  devtools(
    set => ({
      count: 0,
      step: 1,
      increment: () => set(s => ({ count: s.count + s.step }), false, 'increment'),
      decrement: () => set(s => ({ count: s.count - s.step }), false, 'decrement'),
      setStep: step => set({ step }, false, 'setStep'),
      reset: () => set({ count: 0 }, false, 'reset'),
    }),
    { name: 'CounterStore' }
  )
);
