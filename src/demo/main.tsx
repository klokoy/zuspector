import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import Zuspector first so devtools are patched before stores initialize
import { Zuspector } from '../index';
import { useCounterStore, useUserStore } from './stores';

function App() {
  const { count, increment, decrement, reset } = useCounterStore();
  const { user, theme, toggleTheme } = useUserStore();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32, background: theme === 'dark' ? '#111' : '#fff', minHeight: '100vh', color: theme === 'dark' ? '#eee' : '#111' }}>
      <h1 style={{ marginBottom: 8 }}>Zuspector Demo</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Click the <strong>Z</strong> button in the bottom-right to inspect stores.</p>

      <section style={{ marginBottom: 32 }}>
        <h2>CounterStore</h2>
        <p>Count: <strong>{count}</strong></p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={decrement}>-</button>
          <button onClick={increment}>+</button>
          <button onClick={reset}>Reset</button>
        </div>
      </section>

      <section>
        <h2>UserStore</h2>
        <p>User: <strong>{user?.name ?? 'none'}</strong> ({user?.email})</p>
        <p>Theme: <strong>{theme}</strong></p>
        <button onClick={toggleTheme}>Toggle theme</button>
      </section>

      <Zuspector />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
