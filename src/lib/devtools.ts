export type StoreEntry = {
  name: string;
  state: Record<string, unknown>;
  // Captured on init — used to log function references to Chrome DevTools
  actionRefs: Map<string, () => void>;
  // URL of the store's source file on the dev server (used for VS Code links)
  fileUrl: string | null;
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
      const actionRefs = new Map(
        Object.entries(state)
          .filter((entry): entry is [string, () => void] => typeof entry[1] === 'function')
      );
      const fileUrl = captureStoreFileUrl();
      storeMap.set(name, { name, state, actionRefs, fileUrl });
      notifyListeners();
      (real?.init as ((s: unknown) => void) | undefined)?.(state);
    },
    send(action: unknown, state: Record<string, unknown>) {
      const existing = storeMap.get(name);
      storeMap.set(name, { name, state, actionRefs: existing?.actionRefs ?? new Map(), fileUrl: existing?.fileUrl ?? null });
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

// Used to filter our own file out of the Error stack when detecting store source URLs
const SELF_PATH = new URL(import.meta.url).pathname;

function captureStoreFileUrl(): string | null {
  try {
    const stack = new Error().stack ?? '';
    for (const line of stack.split('\n').slice(1)) {
      const match = line.match(/https?:\/\/[^\s)]+/);
      if (!match) continue;
      // Strip query params and trailing :line:col added by V8 stack traces
      const url = match[0].split('?')[0].replace(/:\d+:\d+$/, '');
      if (url.includes('/node_modules/')) continue;
      if (new URL(url).pathname === SELF_PATH) continue;
      return url;
    }
  } catch { /* */ }
  return null;
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
