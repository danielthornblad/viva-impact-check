import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const monorepoRoot = path.resolve(packageDir, '..', '..');

const packagesDir = path.resolve(monorepoRoot, 'packages');

const workspaceAliases = Object.fromEntries(
  fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const packageRoot = path.join(packagesDir, entry.name);
      const packageJsonPath = path.join(packageRoot, 'package.json');

      if (!fs.existsSync(packageJsonPath)) return [];

      const { name } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
        name?: string;
      };

      if (!name) return [];

      const sourceDir = path.join(packageRoot, 'src');

      return [[name, fs.existsSync(sourceDir) ? sourceDir : packageRoot]];
    }),
) as Record<string, string>;

const sharedConfig: UserConfig = {
  plugins: [react()],
  server: {
    fs: {
      allow: [monorepoRoot],
    },
  },
  resolve: {
    alias: workspaceAliases,
  },
};

export const withSharedConfig = (config: UserConfig = {}) =>
  defineConfig(mergeConfig(sharedConfig, config));

export default defineConfig(sharedConfig);
