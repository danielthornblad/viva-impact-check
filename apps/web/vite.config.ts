import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeConfig } from 'vite';

import sharedConfig from '@viva/configs/vite.config.shared';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default mergeConfig(sharedConfig, {
  root: projectRoot,
  publicDir: path.resolve(projectRoot, 'public'),
  build: {
    outDir: path.resolve(projectRoot, 'dist'),
    emptyOutDir: true,
  },
});
