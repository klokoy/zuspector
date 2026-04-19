import { useCallback, useEffect, useRef, useState } from 'react';
import { toggleSettings } from '../store';
import { Settings } from './Settings';
import { StoreList } from './StoreList';
import { StateViewer } from './StateViewer';

const MIN_HEIGHT = 120;
const MAX_HEIGHT_VH = 90;
const DEFAULT_HEIGHT = Math.round(window.innerHeight * 0.55);

type Props = {
  isOpen: boolean;
  selectedStore: string | null;
  showSettings: boolean;
  showEditorLinks: boolean;
};

export function Drawer({ isOpen, selectedStore, showSettings, showEditorLinks }: Props) {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [height]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const delta = startY.current - e.clientY;
      const maxHeight = Math.round(window.innerHeight * MAX_HEIGHT_VH / 100);
      setHeight(Math.min(maxHeight, Math.max(MIN_HEIGHT, startHeight.current + delta)));
    }

    function onMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99998,
        height,
        background: '#141414',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: dragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          height: 6,
          cursor: 'ns-resize',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#141414',
          borderTop: '1px solid #2a2a2a',
        }}
      >
        <div style={{ width: 32, height: 3, borderRadius: 2, background: '#3a3a3a' }} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 16px',
          borderBottom: '1px solid #2a2a2a',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#4fc3f7', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          ZUSPECTOR
        </span>
        <button
          onClick={toggleSettings}
          title="Settings"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: showSettings ? '#4fc3f7' : '#555',
            fontSize: 16,
            lineHeight: 1,
            padding: '2px 4px',
            borderRadius: 4,
          }}
        >
          ⚙
        </button>
      </div>

      {showSettings && <Settings showEditorLinks={showEditorLinks} />}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <StoreList selectedStore={selectedStore} />
        <StateViewer storeName={selectedStore} showEditorLinks={showEditorLinks} />
      </div>
    </div>
  );
}
