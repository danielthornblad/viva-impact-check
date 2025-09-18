import test from 'node:test';
import assert from 'node:assert/strict';

import { onRequestPost, __testables } from './login.js';
import { hashPassword } from '../../_lib/passwords.js';

const createMockEnv = (user) => {
  const sessions = [];
  return {
    DB: {
      __sessions: sessions,
      prepare(query) {
        return {
          bind(...params) {
            const statement = {
              query,
              params,
              async run() {
                if (query.includes('failed_login_attempts = 0, locked_until = NULL WHERE id = ?')) {
                  user.failedAttempts = 0;
                  user.lockedUntil = null;
                }
                if (query.includes('failed_login_attempts = ?, locked_until = ? WHERE id = ?')) {
                  user.failedAttempts = params[0];
                  user.lockedUntil = params[1];
                }
                if (query.includes("failed_login_attempts = 0, locked_until = NULL, last_login_at = datetime('now') WHERE id = ?")) {
                  user.failedAttempts = 0;
                  user.lockedUntil = null;
                }
                if (query.includes('INSERT INTO sessions (id, user_id, expires_at)')) {
                  const [id, userId, expiresAt] = params;
                  sessions.push({ id, userId, expiresAt });
                }
              },
            };

            if (query.includes('FROM users WHERE')) {
              statement.first = async () => user;
            }

            return statement;
          },
        };
      },
      async batch(statements) {
        for (const statement of statements) {
          if (typeof statement.run === 'function') {
            await statement.run();
          }
        }
      },
    },
  };
};

test('lock expiry clears counters before counting new failures', async () => {
  const user = {
    id: 'user-1',
    failedAttempts: 5,
    lockedUntil: new Date(Date.now() - 60_000).toISOString(),
  };

  const env = createMockEnv(user);

  await __testables.clearLoginLock(env, user);
  assert.equal(user.failedAttempts, 0);
  assert.equal(user.lockedUntil, null);

  await __testables.handleFailedLogin(env, user);
  assert.equal(user.failedAttempts, 1);
  assert.equal(user.lockedUntil, null);
});

test('allows login when stored email contains uppercase characters', async () => {
  const password = 'secret';
  const user = {
    id: 'user-2',
    email: 'UPPER@Example.COM',
    passwordHash: await hashPassword(password),
    role: 'user',
    isActive: 1,
    failedAttempts: 0,
    lockedUntil: null,
  };

  const env = createMockEnv(user);
  env.TURNSTILE_SECRET_KEY = 'test-secret';

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  try {
    const request = new Request('https://example.com/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password,
        turnstileToken: 'token',
      }),
    });

    const response = await onRequestPost({ request, env });
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.deepEqual(body.user, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const setCookie = response.headers.get('set-cookie');
    assert.ok(setCookie && setCookie.includes('Path=/'));
    assert.equal(env.DB.__sessions.length, 1);
    assert.equal(env.DB.__sessions[0].userId, user.id);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
