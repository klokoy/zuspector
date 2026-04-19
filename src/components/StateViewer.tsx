import { useState, useSyncExternalStore } from 'react';
import { getStoreMap, subscribeStores, type StoreEntry } from '../lib/devtools';
import { filterState } from '../lib/filterState';
import { openInEditor } from '../lib/openInEditor';
import { JsonNode } from './JsonNode';

function getSnapshot(): ReadonlyMap<string, StoreEntry> {
  return getStoreMap();
}

type Props = {
  storeName: string | null;
  showEditorLinks: boolean;
};

function EditorButton({ fileUrl, actionName }: { fileUrl: string | null; actionName: string }) {
  const [loading, setLoading] = useState(false);

  async function open() {
    if (!fileUrl || loading) return;
    setLoading(true);
    const ok = await openInEditor(fileUrl, actionName);
    setLoading(false);
    if (!ok) {
      console.warn('[zuspector] Could not open editor for', actionName, '— store file:', fileUrl);
    }
  }

  return (
    <button
      onClick={open}
      disabled={!fileUrl || loading}
      title="Open in editor"
      style={{
        background: 'none',
        border: 'none',
        cursor: fileUrl && !loading ? 'pointer' : 'default',
        padding: '2px',
        color: loading ? '#444' : '#0078d4',
        lineHeight: 1,
        opacity: fileUrl ? 1 : 0.25,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {loading ? (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* File outline with folded corner */}
          <path d="M2 1.5h6l2.5 2.5V12H2V1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          {/* Folded corner */}
          <path d="M8 1.5V4h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          {/* Code lines */}
          <line x1="4" y1="6.5" x2="8.5" y2="6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="4" y1="8.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

export function StateViewer({ storeName, showEditorLinks }: Props) {
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
            {actions.map(name => {
              const fn = entry.actionRefs.get(name);
              return (
                <span
                  key={name}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
                >
                  <button
                    title={fn ? 'Click to log function in DevTools console' : undefined}
                    onClick={fn ? () => console.log(`[zuspector] ${entry.name}.${name}:`, fn) : undefined}
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#1e2a1e',
                      border: '1px solid #2d4a2d',
                      color: '#6dbf6d',
                      fontSize: 12,
                      fontFamily: 'monospace',
                      cursor: fn ? 'pointer' : 'default',
                    }}
                  >
                    {name}()
                  </button>
                  {showEditorLinks && (
                    <EditorButton fileUrl={entry.fileUrl} actionName={name} />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
