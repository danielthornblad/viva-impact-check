const DEFAULT_SESSION_COOKIE = 'viva_session';
const DEFAULT_ADMIN_ROLE = 'admin';
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dagar

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
  });
}

export function parseCookies(request) {
  const header = request.headers.get('cookie') || '';
  return header.split(';').reduce((acc, part) => {
    const [name, ...valueParts] = part.trim().split('=');
    if (!name) {
      return acc;
    }
    acc[name] = decodeURIComponent(valueParts.join('='));
    return acc;
  }, {});
}

export function getCookie(request, name) {
  const cookies = parseCookies(request);
  return cookies[name];
}

function cookieName(env) {
  return env.SESSION_COOKIE_NAME || DEFAULT_SESSION_COOKIE;
}

function adminRoleName(env) {
  return env.ADMIN_ROLE_NAME || DEFAULT_ADMIN_ROLE;
}

function sessionTtlSeconds(env) {
  const raw = parseInt(env.SESSION_TTL_SECONDS || '', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_SESSION_TTL_SECONDS;
}

function cookieSecureFlag(env) {
  return env.SESSION_COOKIE_SECURE !== 'false';
}

export function buildSessionCookie(env, value, expiresAt) {
  const name = cookieName(env);
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (cookieSecureFlag(env)) {
    parts.push('Secure');
  }
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  parts.push(`Max-Age=${maxAge}`);
  parts.push(`Expires=${expiresAt.toUTCString()}`);
  return parts.join('; ');
}

export function buildSessionClearCookie(env) {
  const name = cookieName(env);
  const parts = [`${name}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0', 'Expires=Thu, 01 Jan 1970 00:00:00 GMT'];
  if (cookieSecureFlag(env)) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export async function verifyGoogleIdToken(env, idToken) {
  if (!idToken) {
    return { error: 'Missing id_token in request body.' };
  }
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return { error: 'GOOGLE_CLIENT_ID environment variable is not configured.' };
  }

  const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  let payload;
  try {
    const response = await fetch(tokenInfoUrl, { method: 'GET' });
    if (!response.ok) {
      return { error: 'Failed to validate id_token with Google.' };
    }
    payload = await response.json();
  } catch (error) {
    return { error: `Unable to validate id_token: ${error.message}` };
  }

  if (!payload || payload.aud !== clientId) {
    return { error: 'Invalid Google client id for provided token.' };
  }

  const verified = payload.email_verified === true || payload.email_verified === 'true' || payload.email_verified === '1';
  if (!verified) {
    return { error: 'Google account is not verified.' };
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || payload.given_name || payload.email,
    picture: payload.picture || null,
  };
}

export async function findAllowedAccountByEmail(env, email) {
  const row = await env.DB.prepare(
    `SELECT id, email, display_name, is_active, created_at, updated_at
     FROM allowed_google_accounts
     WHERE email = ?`
  ).bind(email).first();
  if (!row) {
    return null;
  }
  const roles = await env.DB.prepare(
    `SELECT role FROM admin_roles WHERE account_id = ?`
  ).bind(row.id).all();
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    roles: (roles.results || []).map((entry) => entry.role),
  };
}

async function findAllowedAccountById(env, id) {
  const row = await env.DB.prepare(
    `SELECT id, email, display_name, is_active, created_at, updated_at
     FROM allowed_google_accounts
     WHERE id = ?`
  ).bind(id).first();
  if (!row) {
    return null;
  }
  const roles = await env.DB.prepare(
    `SELECT role FROM admin_roles WHERE account_id = ?`
  ).bind(row.id).all();
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    roles: (roles.results || []).map((entry) => entry.role),
  };
}

export async function createSession(env, accountId, googleSub) {
  const id = crypto.randomUUID();
  const ttl = sessionTtlSeconds(env);
  const expiresAt = new Date(Date.now() + ttl * 1000);
  await env.DB.prepare(
    `INSERT INTO user_sessions (id, account_id, google_sub, expires_at)
     VALUES (?, ?, ?, ?)`
  ).bind(id, accountId, googleSub, expiresAt.toISOString()).run();
  const account = await findAllowedAccountById(env, accountId);
  return { id, expiresAt, account };
}

export async function deleteSession(env, sessionId) {
  await env.DB.prepare(`DELETE FROM user_sessions WHERE id = ?`).bind(sessionId).run();
}

export async function getSessionFromRequest(env, request) {
  const name = cookieName(env);
  const sessionId = getCookie(request, name);
  if (!sessionId) {
    return null;
  }

  const row = await env.DB.prepare(
    `SELECT id, account_id, google_sub, expires_at, created_at, refreshed_at
     FROM user_sessions
     WHERE id = ?`
  ).bind(sessionId).first();
  if (!row) {
    return null;
  }

  const expiresAt = new Date(row.expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
    await deleteSession(env, sessionId);
    return null;
  }

  const account = await findAllowedAccountById(env, row.account_id);
  if (!account || !account.isActive) {
    await deleteSession(env, sessionId);
    return null;
  }

  return {
    id: row.id,
    expiresAt,
    createdAt: row.created_at,
    refreshedAt: row.refreshed_at,
    account,
  };
}

export async function refreshSession(env, sessionId) {
  const ttl = sessionTtlSeconds(env);
  const expiresAt = new Date(Date.now() + ttl * 1000);
  await env.DB.prepare(
    `UPDATE user_sessions
       SET expires_at = ?,
           refreshed_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(expiresAt.toISOString(), sessionId).run();
  return expiresAt;
}

export async function requireSession(env, request) {
  const session = await getSessionFromRequest(env, request);
  if (!session) {
    return { response: jsonResponse({ error: 'Authentication required.' }, 401) };
  }
  return { session };
}

export async function requireAdmin(env, request) {
  const { session, response } = await requireSession(env, request);
  if (response) {
    return { response };
  }
  const role = adminRoleName(env);
  if (!session.account.roles.includes(role)) {
    return { response: jsonResponse({ error: 'Forbidden.' }, 403) };
  }
  return { session };
}

export function normalizeRoles(roles) {
  if (!roles) {
    return [];
  }
  if (Array.isArray(roles)) {
    return Array.from(new Set(roles.map((role) => role.trim()).filter(Boolean)));
  }
  if (typeof roles === 'string') {
    return Array.from(
      new Set(
        roles
          .split(',')
          .map((role) => role.trim())
          .filter(Boolean)
      )
    );
  }
  return [];
}

export function publicSessionPayload(session) {
  if (!session) {
    return null;
  }
  return {
    id: session.id,
    expiresAt: session.expiresAt,
    account: {
      id: session.account.id,
      email: session.account.email,
      displayName: session.account.displayName,
      roles: session.account.roles,
    },
  };
}
