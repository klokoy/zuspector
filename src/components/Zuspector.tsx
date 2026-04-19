import { useZuspectorState } from '../store';
import { FabButton } from './FabButton';
import { Drawer } from './Drawer';

export function Zuspector() {
  const { isOpen, selectedStore, showSettings, settings } = useZuspectorState();

  return (
    <>
      <FabButton isOpen={isOpen} />
      <Drawer
        isOpen={isOpen}
        selectedStore={selectedStore}
        showSettings={showSettings}
        showEditorLinks={settings.showEditorLinks}
      />
    </>
  );
}
