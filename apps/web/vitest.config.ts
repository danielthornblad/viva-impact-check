import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import sharedConfig from '@viva/configs/vite.config.shared.js';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.js'],
    },
  }),
);
