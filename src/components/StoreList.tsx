import { useSyncExternalStore } from 'react';
import { getStoreMap, subscribeStores, type StoreEntry } from '../lib/devtools';
import { selectStore } from '../store';

function getSnapshot(): ReadonlyMap<string, StoreEntry> {
  return getStoreMap();
}

type Props = {
  selectedStore: string | null;
};

export function StoreList({ selectedStore }: Props) {
  const stores = useSyncExternalStore(subscribeStores, getSnapshot);
  const names = Array.from(stores.keys());

  const containerStyle: React.CSSProperties = {
    width: 200,
    minWidth: 200,
    borderRight: '1px solid #2a2a2a',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    padding: '10px 12px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#666',
    borderBottom: '1px solid #2a2a2a',
  };

  const emptyStyle: React.CSSProperties = {
    padding: '16px 12px',
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Stores</div>
      {names.length === 0 ? (
        <div style={emptyStyle}>No stores detected</div>
      ) : (
        names.map(name => {
          const isSelected = name === selectedStore;
          const storeState = stores.get(name)?.state ?? {};
          const keys = Object.values(storeState);
          const actionCount = keys.filter(v => typeof v === 'function').length;
          const fieldCount = keys.length - actionCount;

          return (
            <button
              key={name}
              onClick={() => selectStore(name)}
              style={{
                background: isSelected ? '#1e3a5f' : 'none',
                border: 'none',
                textAlign: 'left',
                padding: '8px 12px',
                cursor: 'pointer',
                color: isSelected ? '#9cdcfe' : '#ccc',
                borderLeft: isSelected ? '2px solid #4fc3f7' : '2px solid transparent',
                fontFamily: 'monospace',
                width: '100%',
              }}
            >
              <div style={{ fontSize: 13, marginBottom: 3 }}>{name}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: isSelected ? '#6fa8d0' : '#555' }}>
                  {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
                </span>
                <span style={{ fontSize: 11, color: isSelected ? '#5a9e5a' : '#444' }}>
                  {actionCount} {actionCount === 1 ? 'action' : 'actions'}
                </span>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
