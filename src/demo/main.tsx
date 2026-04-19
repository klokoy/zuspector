import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import Zuspector first so devtools are patched before stores initialize
import { Zuspector } from '../index';
import { useCounterStore } from './stores/counterStore';
import { useUserStore } from './stores/userStore';
import { useCartStore } from './stores/cartStore';

function App() {
  const { count, step, increment, decrement, setStep, reset } = useCounterStore();
  const { users, activeUserId, theme, setActiveUser, toggleTheme } = useUserStore();
  const { items, coupon, total, addItem, removeItem, applyCoupon, clearCart } = useCartStore();
  const activeUser = users.find(u => u.id === activeUserId);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32, background: theme === 'dark' ? '#111' : '#fff', minHeight: '100vh', color: theme === 'dark' ? '#eee' : '#111' }}>
      <h1 style={{ marginBottom: 4 }}>Zuspector Demo</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Click the <strong>Z</strong> button in the bottom-right to inspect stores.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

        <section style={{ border: '1px solid #333', borderRadius: 8, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>CounterStore</h2>
          <p>Count: <strong>{count}</strong> &nbsp; Step: <strong>{step}</strong></p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <button onClick={decrement}>−</button>
            <button onClick={increment}>+</button>
            <button onClick={reset}>Reset</button>
          </div>
          <label style={{ fontSize: 13 }}>
            Step:{' '}
            <input
              type="number"
              value={step}
              min={1}
              onChange={e => setStep(Number(e.target.value))}
              style={{ width: 60, marginLeft: 4 }}
            />
          </label>
        </section>

        <section style={{ border: '1px solid #333', borderRadius: 8, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>UserStore</h2>
          <p style={{ marginBottom: 8 }}>Active: <strong>{activeUser?.name}</strong> ({activeUser?.role})</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => setActiveUser(u.id)}
                style={{ fontWeight: activeUserId === u.id ? 700 : 400 }}
              >
                {u.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <button onClick={toggleTheme}>Toggle theme ({theme})</button>
        </section>

        <section style={{ border: '1px solid #333', borderRadius: 8, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>CartStore</h2>
          <p style={{ marginBottom: 8 }}>Total: <strong>${total().toFixed(2)}</strong> &nbsp; {coupon && <span style={{ color: '#6dbf6d' }}>Coupon: {coupon}</span>}</p>
          <div style={{ marginBottom: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 4 }}>
                <span>{item.name} × {item.quantity}</span>
                <button onClick={() => removeItem(item.id)} style={{ fontSize: 11 }}>Remove</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => addItem({ id: 4, name: 'Desk Lamp', price: 24.99 })}>Add item</button>
            <button onClick={() => applyCoupon('SAVE10')}>Apply coupon</button>
            <button onClick={clearCart}>Clear</button>
          </div>
        </section>

      </div>

      <Zuspector />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
