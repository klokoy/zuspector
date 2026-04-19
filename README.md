# zuspector

A Zustand state inspector for React apps. Adds a floating button that opens a bottom drawer showing all detected Zustand stores with live state and available actions.

## Requirements

- React 18 or 19
- Zustand 4 or 5
- Vite — required for dev-mode detection (`import.meta.env.DEV`) and editor links (`/__open-in-editor`)
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

## Dev mode only

`zuspector` is a no-op in production builds. The store interception and the `<Zuspector />` component both check `import.meta.env.DEV` (a Vite compile-time flag) and do nothing when it is `false`. In a production bundle, Vite replaces `import.meta.env.DEV` with `false` and tree-shakes the dead code, so no inspector logic ships to users.

You can leave `<Zuspector />` in your component tree permanently — it renders nothing and intercepts nothing outside of a Vite dev server.

## How it works

`zuspector` intercepts `window.__REDUX_DEVTOOLS_EXTENSION__` — the same hook used by the Redux DevTools browser extension. When a store with `devtools` middleware initializes, the inspector captures its name and subscribes to state updates. No browser extension is required.

Because the interception happens at import time, `zuspector` must be imported before any store modules are evaluated. In most setups this means importing it at the top of your app entry point (`main.tsx` / `index.tsx`).

## Inspector

Click the **Z** button in the bottom-right corner to open the drawer. Drag the top edge to resize it vertically.

**Left panel — store list**
- Lists all detected store names
- Shows field and action counts for each store

**Right panel — state viewer**
- Expandable/collapsible JSON tree showing the current state (actions excluded)
- **Search bar** at the top filters the tree as you type. Searches deeply through nested objects and arrays — matching a value inside an object shows the full object, and matching an item in an array shows only the matching items
- **Actions section** at the bottom lists all action names. Click an action badge to log its function reference to the browser console — Chrome DevTools renders it with a clickable link to the source definition

## Settings

Click the **⚙** icon in the drawer header to open settings.

### Show editor links

When enabled, a file icon button appears next to each action badge. Clicking it opens the action's source file at the correct line in your editor via Vite's built-in `/__open-in-editor` endpoint.

To configure which editor opens, set `LAUNCH_EDITOR` in your dev script:

```json
"dev": "LAUNCH_EDITOR=code vite"
```

For VS Code, also install the `code` CLI: open the Command Palette and run **Shell Command: Install 'code' command in PATH**.

> Editor links only work in Vite dev mode.
