import { useSyncExternalStore } from 'react';

const LS_KEY = 'zuspector:settings';

type Settings = {
  showEditorLinks: boolean;
};

function loadSettings(): Settings {
  try {
    return { showEditorLinks: false, ...JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') };
  } catch {
    return { showEditorLinks: false };
  }
}

function saveSettings(s: Settings) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* */ }
}

type InternalState = {
  isOpen: boolean;
  selectedStore: string | null;
  showSettings: boolean;
  settings: Settings;
};

let state: InternalState = {
  isOpen: false,
  selectedStore: null,
  showSettings: false,
  settings: loadSettings(),
};

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

export function toggleSettings() {
  state = { ...state, showSettings: !state.showSettings };
  notify();
}

export function updateSettings(patch: Partial<Settings>) {
  const settings = { ...state.settings, ...patch };
  saveSettings(settings);
  state = { ...state, settings };
  notify();
}
