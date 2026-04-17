import { useSyncExternalStore } from 'react';

type InternalState = {
  isOpen: boolean;
  selectedStore: string | null;
};

let state: InternalState = { isOpen: false, selectedStore: null };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): InternalState {
  return state;
}

export function useZuspectorState() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function toggle() {
  state = { ...state, isOpen: !state.isOpen };
  notify();
}

export function selectStore(name: string) {
  state = { ...state, selectedStore: name };
  notify();
}
