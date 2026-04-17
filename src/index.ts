import { patchDevtools } from './lib/devtools';

// Patch before any stores can connect
patchDevtools();

export { Zuspector } from './components/Zuspector';
