import { useSyncExternalStore } from 'react';
import { getStoreMap, subscribeStores, type StoreEntry } from '../lib/devtools';
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

  const actions = Object.keys(entry.state).filter(
    k => typeof (entry.state as Record<string, unknown>)[k] === 'function'
  );

  return (
    <div style={containerStyle}>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        <JsonNode value={entry.state} depth={0} />
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
