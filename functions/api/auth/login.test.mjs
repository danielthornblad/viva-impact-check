import test from 'node:test';
import assert from 'node:assert/strict';

import { __testables } from './login.js';

const createMockEnv = (user) => {
  return {
    DB: {
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
              },
            };

            if (query.includes('FROM users WHERE email')) {
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
