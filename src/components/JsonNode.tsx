import { useState } from 'react';

type Props = {
  value: unknown;
  label?: string;
  depth?: number;
};

const COLORS = {
  key: '#9cdcfe',
  string: '#ce9178',
  number: '#b5cea8',
  boolean: '#569cd6',
  null: '#808080',
  bracket: '#ffd700',
  toggle: '#808080',
};

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) return <span style={{ color: COLORS.null }}>null</span>;
  if (value === undefined) return <span style={{ color: COLORS.null }}>undefined</span>;
  if (typeof value === 'boolean') return <span style={{ color: COLORS.boolean }}>{String(value)}</span>;
  if (typeof value === 'number') return <span style={{ color: COLORS.number }}>{value}</span>;
  if (typeof value === 'string') return <span style={{ color: COLORS.string }}>"{value}"</span>;
  return <span>{String(value)}</span>;
}

export function JsonNode({ value, label, depth = 0 }: Props) {
  const [expanded, setExpanded] = useState(depth < 2);

  const indent = { paddingLeft: 16 };
  const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', lineHeight: '1.6' };
  const toggleStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.toggle,
    padding: '0 4px 0 0',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  };

  const labelEl = label !== undefined
    ? <span style={{ color: COLORS.key }}>{label}:{' '}</span>
    : null;

  if (Array.isArray(value)) {
    if (value.length === 0) return <div style={rowStyle}>{labelEl}<span style={{ color: COLORS.bracket }}>[]</span></div>;
    return (
      <div>
        <div style={rowStyle}>
          <button style={toggleStyle} onClick={() => setExpanded(e => !e)}>
            {expanded ? '▾' : '▸'}
          </button>
          {labelEl}
          <span style={{ color: COLORS.bracket }}>[</span>
          {!expanded && (
            <span style={{ color: COLORS.null, cursor: 'pointer' }} onClick={() => setExpanded(true)}>
              {value.length} items
            </span>
          )}
          {!expanded && <span style={{ color: COLORS.bracket }}>]</span>}
        </div>
        {expanded && (
          <div style={indent}>
            {value.map((item, i) => (
              <JsonNode key={i} value={item} label={String(i)} depth={depth + 1} />
            ))}
            <div style={{ color: COLORS.bracket }}>]</div>
          </div>
        )}
      </div>
    );
  }

  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value as object).filter(k => typeof (value as Record<string, unknown>)[k] !== 'function');
    if (keys.length === 0) return <div style={rowStyle}>{labelEl}<span style={{ color: COLORS.bracket }}>{'{}'}</span></div>;
    return (
      <div>
        <div style={rowStyle}>
          <button style={toggleStyle} onClick={() => setExpanded(e => !e)}>
            {expanded ? '▾' : '▸'}
          </button>
          {labelEl}
          <span style={{ color: COLORS.bracket }}>{'{'}</span>
          {!expanded && (
            <span style={{ color: COLORS.null, cursor: 'pointer' }} onClick={() => setExpanded(true)}>
              {keys.length} keys
            </span>
          )}
          {!expanded && <span style={{ color: COLORS.bracket }}>{'}'}</span>}
        </div>
        {expanded && (
          <div style={indent}>
            {keys.map(k => (
              <JsonNode key={k} value={(value as Record<string, unknown>)[k]} label={k} depth={depth + 1} />
            ))}
            <div style={{ color: COLORS.bracket }}>{'}'}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={rowStyle}>
      {labelEl}
      <PrimitiveValue value={value} />
    </div>
  );
}
