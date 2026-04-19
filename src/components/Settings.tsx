import { updateSettings } from '../store';

type Props = {
  showEditorLinks: boolean;
};

export function Settings({ showEditorLinks }: Props) {
  return (
    <div style={{
      borderBottom: '1px solid #2a2a2a',
      padding: '10px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      background: '#111',
      flexShrink: 0,
    }}>
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, color: '#ccc' }}>
        <span>Show editor links on actions</span>
        <div
          onClick={() => updateSettings({ showEditorLinks: !showEditorLinks })}
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            background: showEditorLinks ? '#0078d4' : '#333',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 2,
            left: showEditorLinks ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
          }} />
        </div>
      </label>
    </div>
  );
}
