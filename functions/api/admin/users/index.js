import { jsonResponse, errorResponse } from '../../../_lib/response';
import { requireAdminSession } from '../../../_lib/session';
import { requireTurnstile } from '../../../_lib/turnstile';
import { hashPassword } from '../../../_lib/passwords';
import { isValidEmail, sanitizeEmail, validatePassword } from '../../../_lib/validation';

const serializeUser = (row) => ({
  id: row.id,
  email: row.email,
  role: row.role,
  isActive: row.isActive === 1 || row.isActive === true,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  lastLoginAt: row.lastLoginAt,
  activeSessions: row.activeSessions || 0,
});

export const onRequestGet = async ({ request, env }) => {
  const { session, response } = await requireAdminSession(request, env);
  if (!session) {
    return response;
  }

  const result = await env.DB.prepare(
    `SELECT u.id, u.email, u.role, u.is_active as isActive, u.created_at as createdAt,
            u.updated_at as updatedAt, u.last_login_at as lastLoginAt,
            (
              SELECT COUNT(*) FROM sessions s
              WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > datetime('now')
            ) as activeSessions
       FROM users u
       ORDER BY u.created_at DESC`
  ).all();

  const users = (result.results || []).map(serializeUser);
  return jsonResponse({ users });
};

export const onRequestPost = async ({ request, env }) => {
  const { session, response } = await requireAdminSession(request, env);
  if (!session) {
    return response;
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, 'Kunde inte tolka JSON.');
  }

  const { email, password, role = 'user', turnstileToken } = body || {};
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

  if (!['admin', 'user'].includes(role)) {
    return errorResponse(400, 'Ogiltig roll.');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return errorResponse(400, 'Ogiltigt lösenord.', { reasons: passwordValidation.errors });
  }

  const existingUser = await env.DB.prepare(
    'SELECT id FROM users WHERE LOWER(email) = ?'
  )
    .bind(sanitizeEmail(email))
    .first();
  if (existingUser) {
    return errorResponse(409, 'En användare med denna e-postadress finns redan.');
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, role)
     VALUES (?, ?, ?, ?)`
  ).bind(userId, normalizedEmail, passwordHash, role).run();

  const user = await env.DB.prepare(
    `SELECT id, email, role, is_active as isActive, created_at as createdAt,
            updated_at as updatedAt, last_login_at as lastLoginAt
       FROM users WHERE id = ?`
  ).bind(userId).first();

  return jsonResponse({ user: serializeUser(user) }, { status: 201 });
};
