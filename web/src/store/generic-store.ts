// this is only used when the global state will be used on both customer and owner sides
import {  create }from 'zustand';
type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

// Create the Zustand store
const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useCounterStore;