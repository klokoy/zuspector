import { patchDevtools } from './lib/devtools';

if (import.meta.env.DEV) {
  patchDevtools();
}

export { Zuspector } from './components/Zuspector';
