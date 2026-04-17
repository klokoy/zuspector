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
    padding: '12px 16px',
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#d4d4d4',
  };

  if (!storeName) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
        Select a store
      </div>
    );
  }

  if (!entry) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
        No state received yet
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <JsonNode value={entry.state} depth={0} />
    </div>
  );
}
