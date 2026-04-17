# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`zuspector` is a React npm library — a Zustand state inspector. Drop `<Zuspector />` into any React app to get a floating action button that opens a bottom drawer showing all detected Zustand stores and their live state.

## Commands

```bash
npm run dev       # Vite dev server running the example app
npm run build     # Vite library build → dist/ (ESM + CJS)
npm run lint      # ESLint
npm test          # Vitest unit tests
npm run typecheck # tsc --noEmit
```

## Architecture

### Package entry

`src/index.ts` is the only public export — it exports the `<Zuspector />` component.

Vite lib config targets `src/index.ts`, externalizes `react`, `react-dom`, and `zustand`, and outputs both `es` and `cjs` formats to `dist/`.

### Component tree

```
<Zuspector>
  ├── <FabButton>       fixed-position button, toggles drawer open/closed
  └── <Drawer>          slides up from bottom, all styles are inline (no CSS files)
        ├── <StoreList> left sidebar — lists detected store names
        └── <StateViewer>
              └── <JsonNode>  recursive, expandable/collapsible JSON tree
```

All styles are **inline only** — the library ships zero CSS files so consumers have nothing extra to import.

### Store detection

Zustand's `devtools` middleware registers stores using the Redux DevTools Extension protocol via `window.__REDUX_DEVTOOLS_EXTENSION__`. Zuspector intercepts this by monkey-patching `window.__REDUX_DEVTOOLS_EXTENSION__.connect()` on mount to capture each store connection. State updates arrive via the DevTools message protocol (`connection.subscribe(message => ...)`).

Actions are intentionally excluded from the display — only state snapshots are shown.

### Internal state

A single internal hook/store (`useZuspectorStore`) tracks:
- `isOpen: boolean`
- `stores: Map<string, DevtoolsConnection>` — name → devtools connection object
- `selectedStore: string | null`
- `storeState: Record<string, unknown>` — current snapshot for the selected store

### Example app

`example/` is a standalone Vite app used for manual testing during development. It imports the library source directly (via path alias) and sets up a few sample Zustand stores with the devtools middleware to exercise the inspector.
