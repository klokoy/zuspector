export type StoreEntry = {
  name: string;
  state: Record<string, unknown>;
};

const storeMap = new Map<string, StoreEntry>();
const changeListeners = new Set<() => void>();

function notifyListeners() {
  changeListeners.forEach(fn => fn());
}

function wrapConnection(name: string, real: Record<string, unknown> | undefined) {
  return {
    ...(real ?? {}),
    init(state: Record<string, unknown>) {
      storeMap.set(name, { name, state });
      notifyListeners();
      (real?.init as ((s: unknown) => void) | undefined)?.(state);
    },
    send(action: unknown, state: Record<string, unknown>) {
      storeMap.set(name, { name, state });
      notifyListeners();
      (real?.send as ((a: unknown, s: unknown) => void) | undefined)?.(action, state);
    },
    // Zustand devtools middleware always calls subscribe/unsubscribe/error.
    // Provide no-op stubs when no real extension is present.
    subscribe: (real?.subscribe as ((l: unknown) => () => void) | undefined) ?? (() => () => {}),
    unsubscribe: (real?.unsubscribe as (() => void) | undefined) ?? (() => {}),
    error: (real?.error as ((msg: unknown) => void) | undefined) ?? (() => {}),
  };
}

function buildProxiedExtension(realExt: Record<string, unknown> | undefined) {
  return {
    ...(realExt ?? {}),
    connect(options: { name?: string; [key: string]: unknown }) {
      const name = options?.name ?? 'store';
      const realConn = (realExt?.connect as ((o: unknown) => Record<string, unknown>) | undefined)?.(options);
      return wrapConnection(name, realConn);
    },
  };
}

let patched = false;

export function patchDevtools() {
  if (patched || typeof window === 'undefined') return;
  patched = true;

  const win = window as unknown as Record<string, unknown>;
  const existing = win['__REDUX_DEVTOOLS_EXTENSION__'] as Record<string, unknown> | undefined;

  // Replace (or install) the extension with our intercepting proxy
  win['__REDUX_DEVTOOLS_EXTENSION__'] = buildProxiedExtension(existing);

  // Handle the case where the real extension loads after us (unlikely but possible)
  Object.defineProperty(window, '__REDUX_DEVTOOLS_EXTENSION__', {
    get() {
      return win['__ZUSPECTOR_EXT__'];
    },
    set(ext: Record<string, unknown>) {
      // Merge in the real extension so its functionality is preserved
      win['__ZUSPECTOR_EXT__'] = buildProxiedExtension(ext);
    },
    configurable: true,
  });

  win['__ZUSPECTOR_EXT__'] = buildProxiedExtension(existing);
}

export function subscribeStores(callback: () => void): () => void {
  changeListeners.add(callback);
  return () => changeListeners.delete(callback);
}

export function getStoreMap(): ReadonlyMap<string, StoreEntry> {
  return storeMap;
}
