import { useState, useSyncExternalStore } from 'react';
import { getStoreMap, subscribeStores, type StoreEntry } from '../lib/devtools';
import { filterState } from '../lib/filterState';
import { JsonNode } from './JsonNode';

function getSnapshot(): ReadonlyMap<string, StoreEntry> {
  return getStoreMap();
}

type Props = {
  storeName: string | null;
};

export function StateViewer({ storeName }: Props) {
  const stores = useSyncExternalStore(subscribeStores, getSnapshot);
  const entry = storeName ? stores.get(storeName) : null;
  const [query, setQuery] = useState('');

  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#d4d4d4',
  };

  const centered: React.CSSProperties = {
    ...containerStyle,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
  };

  if (!storeName) return <div style={centered}>Select a store</div>;
  if (!entry) return <div style={centered}>No state received yet</div>;

  const rawState = entry.state as Record<string, unknown>;
  const actions = Object.keys(rawState).filter(k => typeof rawState[k] === 'function');

  let filteredState: Record<string, unknown>;
  let hasResults: boolean;

  if (query) {
    const q = query.toLowerCase();
    const entries = Object.entries(rawState)
      .filter(([, v]) => typeof v !== 'function')
      .flatMap(([k, v]) => {
        if (k.toLowerCase().includes(q)) return [[k, v]] as [string, unknown][];
        const result = filterState(v, query);
        return result.matched ? [[k, result.value]] as [string, unknown][] : [];
      });
    filteredState = Object.fromEntries(entries);
    hasResults = entries.length > 0;
  } else {
    filteredState = rawState;
    hasResults = true;
  }

  return (
    <div style={containerStyle}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a2a', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            background: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: 4,
            padding: '5px 8px',
            color: '#d4d4d4',
            fontFamily: 'monospace',
            fontSize: 12,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        {hasResults ? (
          <JsonNode value={filteredState} depth={0} />
        ) : (
          <span style={{ color: '#555' }}>No matches</span>
        )}
      </div>

      {actions.length > 0 && (
        <div style={{ borderTop: '1px solid #2a2a2a', flexShrink: 0 }}>
          <div style={{
            padding: '6px 16px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#666',
          }}>
            Actions
          </div>
          <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {actions.map(name => (
              <span
                key={name}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: '#1e2a1e',
                  border: '1px solid #2d4a2d',
                  color: '#6dbf6d',
                  fontSize: 12,
                }}
              >
                {name}()
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
