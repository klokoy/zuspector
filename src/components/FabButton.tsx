import { toggle } from '../store';

type Props = {
  isOpen: boolean;
};

export function FabButton({ isOpen }: Props) {
  return (
    <button
      onClick={toggle}
      title={isOpen ? 'Close Zuspector' : 'Open Zuspector'}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: isOpen ? '#1a1a2e' : '#4fc3f7',
        border: isOpen ? '2px solid #4fc3f7' : 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 700,
        color: isOpen ? '#4fc3f7' : '#0d0d1a',
        fontFamily: 'monospace',
        transition: 'background 0.2s, color 0.2s, border 0.2s',
        userSelect: 'none',
      }}
    >
      Z
    </button>
  );
}
