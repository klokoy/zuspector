import { StoreList } from './StoreList';
import { StateViewer } from './StateViewer';

type Props = {
  isOpen: boolean;
  selectedStore: string | null;
};

export function Drawer({ isOpen, selectedStore }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99998,
        height: '55vh',
        background: '#141414',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid #2a2a2a',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#4fc3f7', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          ZUSPECTOR
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <StoreList selectedStore={selectedStore} />
        <StateViewer storeName={selectedStore} />
      </div>
    </div>
  );
}
