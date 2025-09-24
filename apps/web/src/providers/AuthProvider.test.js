import React from 'react';
import { vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';

const AuthStateObserver = React.forwardRef((_, ref) => {
  const auth = useAuth();
  React.useImperativeHandle(ref, () => auth, [auth]);
  return null;
});

const STORAGE_KEY = 'viva-auth-token';

describe('AuthProvider verifyToken', () => {
  const originalVerifyUrl = import.meta.env.VITE_AUTH_VERIFY_URL;
  const originalAbortController = global.AbortController;

  afterEach(() => {
    import.meta.env.VITE_AUTH_VERIFY_URL = originalVerifyUrl;
    global.AbortController = originalAbortController;
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test('keeps auth state when verification request is aborted', async () => {
    import.meta.env.VITE_AUTH_VERIFY_URL = 'https://example.com/verify';

    const controllers = [];
    class MockAbortSignal {
      constructor() {
        this.aborted = false;
        this.listeners = new Set();
      }

      addEventListener(event, handler) {
        if (event === 'abort') {
          this.listeners.add(handler);
        }
      }

      removeEventListener(event, handler) {
        if (event === 'abort') {
          this.listeners.delete(handler);
        }
      }
    }

    class MockAbortController {
      constructor() {
        this.signal = new MockAbortSignal();
        controllers.push(this);
      }

      abort() {
        if (this.signal.aborted) {
          return;
        }
        this.signal.aborted = true;
        this.signal.listeners.forEach((handler) => handler());
      }
    }

    global.AbortController = MockAbortController;

    const token = 'valid-token';
    const user = { name: 'Testare' };

    const fetchMock = vi.spyOn(global, 'fetch');
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user })
    });

    fetchMock.mockImplementationOnce((_, options = {}) =>
      new Promise((resolve, reject) => {
        const { signal } = options;
        if (signal) {
          signal.addEventListener('abort', () => {
            const abortError = new Error('Aborted');
            abortError.name = 'AbortError';
            reject(abortError);
          });
        }
      })
    );

    const authRef = React.createRef();

    render(
      <AuthProvider>
        <AuthStateObserver ref={authRef} />
      </AuthProvider>
    );

    await waitFor(() => expect(authRef.current).toBeTruthy());

    await act(async () => {
      const result = await authRef.current.verifyToken(token);
      expect(result).toEqual(user);
    });

    await waitFor(() => {
      expect(authRef.current.token).toBe(token);
      expect(authRef.current.user).toEqual(user);
      expect(authRef.current.isLoading).toBe(false);
    });

    window.localStorage.setItem(STORAGE_KEY, token);

    let abortingVerificationPromise;
    await act(async () => {
      abortingVerificationPromise = authRef.current.verifyToken(token);
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    await act(async () => {
      const activeController = controllers[controllers.length - 1];
      activeController.abort();
    });

    let abortedResult;
    await act(async () => {
      abortedResult = await abortingVerificationPromise;
    });

    expect(abortedResult).toBeNull();

    await waitFor(() => expect(authRef.current.isLoading).toBe(false));

    expect(authRef.current.token).toBe(token);
    expect(authRef.current.user).toEqual(user);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(token);
  });
});
