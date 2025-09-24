import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const monorepoRoot = path.resolve(packageDir, '..', '..');

const sharedConfig: UserConfig = {
  plugins: [react()],
  server: {
    fs: {
      allow: [monorepoRoot],
    },
  },
  resolve: {
    alias: {
      '@viva/shared': path.resolve(monorepoRoot, 'packages/shared/src'),
      '@viva/ui': path.resolve(monorepoRoot, 'packages/ui/src'),
    },
  },
};

export const withSharedConfig = (config: UserConfig = {}) =>
  defineConfig(mergeConfig(sharedConfig, config));

export default defineConfig(sharedConfig);
