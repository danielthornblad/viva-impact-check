import { serializeCookie, expireCookie } from './cookies';
import { jsonResponse, errorResponse } from './response';

const DEFAULT_SESSION_COOKIE = 'viva_session';
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dagar

const parseCookies = (request) => {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return {};
  }
  return cookieHeader.split(';').reduce((acc, raw) => {
    const [name, ...rest] = raw.trim().split('=');
    if (!name) {
      return acc;
    }
    acc[name] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
};

export const getSessionCookieName = (env) => env.SESSION_COOKIE_NAME || DEFAULT_SESSION_COOKIE;

export const readSessionIdFromRequest = (request, env) => {
  const cookies = parseCookies(request);
  const name = getSessionCookieName(env);
  return cookies[name] || null;
};

const ttlFromExpires = (expiresAtIso) => {
  const expiresAt = new Date(expiresAtIso).getTime();
  const now = Date.now();
  const diff = Math.floor((expiresAt - now) / 1000);
  return diff > 0 ? diff : 0;
};

const cacheSession = async (env, session) => {
  if (!env.SESSION_CACHE) {
    return;
  }
  const ttl = ttlFromExpires(session.expiresAt);
  if (ttl <= 0) {
    return;
  }
  await env.SESSION_CACHE.put(session.id, JSON.stringify(session), { expirationTtl: ttl });
};

const removeSessionFromCache = async (env, sessionId) => {
  if (!env.SESSION_CACHE) {
    return;
  }
  await env.SESSION_CACHE.delete(sessionId);
};

const fetchSessionFromCache = async (env, sessionId) => {
  if (!env.SESSION_CACHE) {
    return null;
  }
  const cached = await env.SESSION_CACHE.get(sessionId);
  if (!cached) {
    return null;
  }
  try {
    return JSON.parse(cached);
  } catch (error) {
    await env.SESSION_CACHE.delete(sessionId);
    return null;
  }
};

const fetchSessionFromDatabase = async (env, sessionId) => {
  const row = await env.DB.prepare(
    `SELECT s.id, s.user_id as userId, s.expires_at as expiresAt, s.revoked_at as revokedAt,
            u.email, u.role, u.is_active as isActive
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = ?`
  ).bind(sessionId).first();
  if (!row) {
    return null;
  }
  return {
    ...row,
    expiresAt: row.expiresAt,
  };
};

const invalidateSession = async (env, sessionId) => {
  await env.DB.prepare('UPDATE sessions SET revoked_at = datetime(\'now\') WHERE id = ?').bind(sessionId).run();
  await removeSessionFromCache(env, sessionId);
};

export const getSession = async (request, env) => {
  const sessionId = readSessionIdFromRequest(request, env);
  if (!sessionId) {
    return null;
  }

  let session = await fetchSessionFromCache(env, sessionId);
  if (!session) {
    session = await fetchSessionFromDatabase(env, sessionId);
    if (session) {
      await cacheSession(env, session);
    }
  }

  if (!session) {
    return null;
  }

  const now = new Date();
  if (session.revokedAt) {
    await removeSessionFromCache(env, session.id);
    return null;
  }

  if (new Date(session.expiresAt) <= now) {
    await invalidateSession(env, session.id);
    return null;
  }

  if (!session.isActive) {
    await invalidateSession(env, session.id);
    return null;
  }

  return session;
};

export const requireSession = async (request, env) => {
  const session = await getSession(request, env);
  if (!session) {
    return { response: errorResponse(401, 'Ogiltig eller utgången session.'), session: null };
  }
  return { session };
};

export const requireAdminSession = async (request, env) => {
  const { session, response } = await requireSession(request, env);
  if (!session) {
    return { response, session: null };
  }
  if (session.role !== 'admin') {
    return { response: errorResponse(403, 'Åtkomst nekad.') };
  }
  return { session };
};

export const createSession = async (env, userId, role, metadata = {}) => {
  const ttl = Number(env.SESSION_TTL_SECONDS || DEFAULT_SESSION_TTL_SECONDS);
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  await env.DB.prepare(
    `INSERT INTO sessions (id, user_id, expires_at)
     VALUES (?, ?, ?)`
  ).bind(sessionId, userId, expiresAt).run();
  const session = {
    id: sessionId,
    userId,
    role,
    expiresAt,
    isActive: 1,
    ...metadata,
  };
  await cacheSession(env, session);
  return session;
};

export const revokeSession = async (env, sessionId) => {
  await invalidateSession(env, sessionId);
};

export const revokeSessionsForUser = async (env, userId) => {
  const sessions = await env.DB.prepare(
    'SELECT id FROM sessions WHERE user_id = ? AND revoked_at IS NULL'
  ).bind(userId).all();
  const ids = sessions.results?.map((row) => row.id) || [];
  if (ids.length === 0) {
    return;
  }
  const statements = ids.map((id) => env.DB.prepare(
    'UPDATE sessions SET revoked_at = datetime(\'now\') WHERE id = ?'
  ).bind(id));
  await env.DB.batch(statements);
  for (const id of ids) {
    await removeSessionFromCache(env, id);
  }
};

export const buildSessionCookie = (env, session) => {
  const ttl = Number(env.SESSION_TTL_SECONDS || DEFAULT_SESSION_TTL_SECONDS);
  const name = getSessionCookieName(env);
  return serializeCookie(name, session.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: ttl,
    expires: new Date(session.expiresAt),
  });
};

export const buildSessionLogoutCookie = (env) => {
  const name = getSessionCookieName(env);
  return expireCookie(name, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
  });
};

export const respondWithSession = (data, sessionCookie) => {
  return jsonResponse(data, {
    headers: {
      'Set-Cookie': sessionCookie,
    },
  });
};
