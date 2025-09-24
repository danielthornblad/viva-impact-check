import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import sharedConfig from '@viva/configs/vite.config.shared';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: path.resolve(projectRoot, 'src/setupTests.js'),
    },
  }),
);
