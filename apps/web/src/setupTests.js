// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock(
  '@viva/configs',
  () => ({
    getViteConfigName: () => 'vite.config.shared.js',
  }),
  { virtual: true },
);
