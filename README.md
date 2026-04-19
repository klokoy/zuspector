# zuspector

A Zustand state inspector for React apps. Adds a floating button that opens a bottom drawer showing all detected Zustand stores with live state and available actions.

![zuspector drawer showing store state and actions]()

## Requirements

- React 18 or 19
- Zustand 4 or 5
- Stores must use the [`devtools` middleware](https://zustand.docs.pmnd.rs/middlewares/devtools) from `zustand/middleware`

## Installation

```bash
npm install zuspector
```

## Usage

Add `<Zuspector />` anywhere in your component tree — typically near the root of your app. **Import it before your stores are created** so it can intercept the devtools connections.

```tsx
// main.tsx
import { Zuspector } from 'zuspector'; // must be first
import { useCounterStore } from './stores/counter';

function App() {
  return (
    <>
      <YourApp />
      <Zuspector />
    </>
  );
}
```

Your stores must use the `devtools` middleware and include a `name` option so they appear in the inspector:

```ts
// stores/counter.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCounterStore = create()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 })),
    }),
    { name: 'CounterStore' } // shown in the store list
  )
);
```

## How it works

`zuspector` intercepts `window.__REDUX_DEVTOOLS_EXTENSION__` — the same hook used by the Redux DevTools browser extension. When a store with `devtools` middleware initializes, the inspector captures its name and subscribes to state updates. No browser extension is required.

Because the interception happens at import time, `zuspector` must be imported before any store modules are evaluated. In most setups this means importing it at the top of your app entry point (`main.tsx` / `index.tsx`).

## Inspector

Click the **Z** button in the bottom-right corner to open the drawer. Drag the top edge to resize it vertically.

- **Left panel** — lists all detected store names
- **Right panel** — shows the current state of the selected store as an expandable JSON tree
- **Actions section** — lists the action names available on the store
