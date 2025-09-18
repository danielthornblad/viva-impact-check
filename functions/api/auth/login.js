import { errorResponse } from '../../_lib/response.js';
import { requireTurnstile } from '../../_lib/turnstile.js';
import { isValidEmail, sanitizeEmail } from '../../_lib/validation.js';
import { verifyPassword } from '../../_lib/passwords.js';
import {
  createSession,
  buildSessionCookie,
  respondWithSession,
} from '../../_lib/session.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const parseBody = async (request) => {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('invalid_json');
  }
};

const fetchUserByEmail = async (env, email) => {
  return env.DB.prepare(
    `SELECT id, email, password_hash as passwordHash, role, is_active as isActive,
            failed_login_attempts as failedAttempts, locked_until as lockedUntil
       FROM users WHERE email = ?`
  ).bind(email).first();
};

const handleFailedLogin = async (env, user) => {
  const attempts = Number(user.failedAttempts || 0) + 1;
  const updates = [];
  let lockedUntil = null;
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString();
  }
  updates.push(
    env.DB.prepare(
      'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?'
    ).bind(attempts, lockedUntil, user.id)
  );
  await env.DB.batch(updates);
  user.failedAttempts = attempts;
  user.lockedUntil = lockedUntil;
};

const clearLoginLock = async (env, user) => {
  await env.DB.prepare(
    'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?'
  ).bind(user.id).run();
  user.failedAttempts = 0;
  user.lockedUntil = null;
};

const resetFailedLogins = async (env, user) => {
  await env.DB.prepare(
    'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = datetime(\'now\') WHERE id = ?'
  ).bind(user.id).run();
  user.failedAttempts = 0;
  user.lockedUntil = null;
};

const respondUnauthorized = () => errorResponse(401, 'Felaktiga inloggningsuppgifter.');

export const onRequestPost = async ({ request, env }) => {
  let body;
  try {
    body = await parseBody(request);
  } catch (error) {
    if (error.message === 'invalid_json') {
      return errorResponse(400, 'Kunde inte tolka JSON i förfrågan.');
    }
    return errorResponse(400, 'Ogiltig inloggningsförfrågan.');
  }

  const { email, password, turnstileToken } = body || {};
  const remoteIp = request.headers.get('CF-Connecting-IP');
  const turnstileError = await requireTurnstile(env, turnstileToken, remoteIp);
  if (turnstileError) {
    return turnstileError;
  }

  if (!email || !password) {
    return errorResponse(400, 'E-postadress och lösenord krävs.');
  }

  const normalizedEmail = sanitizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    return errorResponse(400, 'Ogiltig e-postadress.');
  }

  const user = await fetchUserByEmail(env, normalizedEmail);
  if (!user) {
    // Förhindra användaruppslagning via timing
    await new Promise((resolve) => setTimeout(resolve, 200));
    return respondUnauthorized();
  }

  if (!user.isActive) {
    return errorResponse(403, 'Kontot är avaktiverat. Kontakta administratören.');
  }

  if (user.lockedUntil) {
    const lockedUntilDate = new Date(user.lockedUntil);
    const now = new Date();
    if (lockedUntilDate > now) {
      return errorResponse(423, 'Kontot är tillfälligt låst efter för många misslyckade försök. Försök igen senare.');
    }
    if (!Number.isNaN(lockedUntilDate.getTime())) {
      await clearLoginLock(env, user);
    }
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) {
    await handleFailedLogin(env, user);
    return respondUnauthorized();
  }

  await resetFailedLogins(env, user);

  const session = await createSession(env, user.id, user.role, {
    email: user.email,
  });
  const sessionCookie = buildSessionCookie(env, session);

  return respondWithSession({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  }, sessionCookie);
};

export const __testables = {
  handleFailedLogin,
  clearLoginLock,
  resetFailedLogins,
};
