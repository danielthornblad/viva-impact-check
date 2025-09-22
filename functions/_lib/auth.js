const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const textEncoder = new TextEncoder();

const googleKeyCache = {
  keys: null,
  expiresAt: 0
};

const baseHeaders = {
  'cache-control': 'no-store',
  'content-type': 'application/json'
};

const toHex = (buffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

const base64UrlToUint8Array = (input) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const base64 = normalized + padding;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const decodeBase64UrlJson = (segment) => {
  try {
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const json = atob(normalized + padding);
    return JSON.parse(json);
  } catch (error) {
    throw new Error('Could not decode JWT segment');
  }
};

const parseMaxAgeSeconds = (headerValue) => {
  if (!headerValue) {
    return 300; // fallback to five minutes
  }
  const match = /max-age=(\d+)/i.exec(headerValue);
  if (match && match[1]) {
    return Number.parseInt(match[1], 10);
  }
  return 300;
};

const loadGoogleKeys = async (fetchImpl = fetch) => {
  const now = Date.now();
  if (googleKeyCache.keys && now < googleKeyCache.expiresAt) {
    return googleKeyCache.keys;
  }

  const response = await fetchImpl(GOOGLE_JWKS_URL, {
    cf: {
      cacheTtl: 3600,
      cacheEverything: true
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load Google public keys');
  }

  const data = await response.json();
  const maxAge = parseMaxAgeSeconds(response.headers.get('cache-control'));
  googleKeyCache.keys = Array.isArray(data?.keys) ? data.keys : [];
  googleKeyCache.expiresAt = now + maxAge * 1000;
  return googleKeyCache.keys;
};

export const verifyGoogleIdToken = async (token, expectedAudience, fetchImpl = fetch) => {
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Malformed Google credential');
  }

  const [headerSegment, payloadSegment, signatureSegment] = token.split('.');
  const header = decodeBase64UrlJson(headerSegment);
  const payload = decodeBase64UrlJson(payloadSegment);

  if (header?.alg !== 'RS256') {
    throw new Error('Unsupported Google credential algorithm');
  }

  const keys = await loadGoogleKeys(fetchImpl);
  const jwk = keys.find((candidate) => candidate.kid === header.kid);
  if (!jwk) {
    throw new Error('Could not match Google signing key');
  }

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['verify']
  );

  const data = textEncoder.encode(`${headerSegment}.${payloadSegment}`);
  const signature = base64UrlToUint8Array(signatureSegment);
  const isValid = await crypto.subtle.verify({ name: 'RSASSA-PKCS1-v1_5' }, cryptoKey, signature, data);
  if (!isValid) {
    throw new Error('Invalid Google credential signature');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && nowSeconds > payload.exp) {
    throw new Error('Google credential expired');
  }

  if (typeof payload.nbf === 'number' && nowSeconds < payload.nbf) {
    throw new Error('Google credential not yet valid');
  }

  if (expectedAudience) {
    const audienceList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audienceList.includes(expectedAudience)) {
      throw new Error('Google credential audience mismatch');
    }
  }

  if (!payload.email || payload.email_verified === false) {
    throw new Error('Google account is not verified');
  }

  return payload;
};

export const createJsonResponse = (status, data, overrides = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      ...baseHeaders,
      ...overrides
    }
  });

export const generateSessionToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export const hashSessionToken = async (token) => {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(token));
  return toHex(digest);
};

export const findAccountByEmail = async (database, email) => {
  if (!email) {
    return null;
  }
  return database
    .prepare(
      `SELECT id, email, display_name, created_at, updated_at
       FROM allowed_google_accounts
       WHERE lower(email) = lower(?)`
    )
    .bind(email)
    .first();
};

export const findAccountById = async (database, accountId) =>
  database
    .prepare(
      `SELECT id, email, display_name, created_at, updated_at
       FROM allowed_google_accounts
       WHERE id = ?`
    )
    .bind(accountId)
    .first();

export const listRolesForAccount = async (database, accountId) => {
  const { results } = await database
    .prepare(
      `SELECT r.id, r.name
       FROM account_roles ar
       INNER JOIN roles r ON r.id = ar.role_id
       WHERE ar.account_id = ?`
    )
    .bind(accountId)
    .all();
  return results?.map((row) => row.name) ?? [];
};

export const buildUserPayload = (accountRow, roles = []) => {
  if (!accountRow) {
    return null;
  }
  return {
    id: accountRow.id,
    email: accountRow.email,
    name: accountRow.display_name || accountRow.email,
    roles
  };
};

export const extractBearerToken = (request) => {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!header) {
    return null;
  }
  const [, token] = header.split(' ');
  return token || null;
};

export const loadSessionFromToken = async (database, token) => {
  if (!token) {
    return null;
  }
  const tokenHash = await hashSessionToken(token);
  const session = await database
    .prepare(
      `SELECT id, account_id, token_hash, expires_at, created_at, last_used_at
       FROM sessions
       WHERE token_hash = ?`
    )
    .bind(tokenHash)
    .first();
  return session || null;
};

export const refreshSessionExpiry = async (database, sessionId, newExpiry) =>
  database
    .prepare(
      `UPDATE sessions
       SET expires_at = ?, last_used_at = datetime('now')
       WHERE id = ?`
    )
    .bind(newExpiry, sessionId)
    .run();

export const deleteSessionById = async (database, sessionId) =>
  database
    .prepare('DELETE FROM sessions WHERE id = ?')
    .bind(sessionId)
    .run();

export const deleteSessionByTokenHash = async (database, tokenHash) =>
  database
    .prepare('DELETE FROM sessions WHERE token_hash = ?')
    .bind(tokenHash)
    .run();

export const ensureRolesExist = async (database, roleNames) => {
  if (!Array.isArray(roleNames) || roleNames.length === 0) {
    return true;
  }
  const placeholders = roleNames.map(() => '?').join(', ');
  const { results } = await database
    .prepare(`SELECT name FROM roles WHERE name IN (${placeholders})`)
    .bind(...roleNames)
    .all();
  const foundNames = new Set(results?.map((row) => row.name));
  return roleNames.every((role) => foundNames.has(role));
};

export const SESSION_SETTINGS = {
  ttlSeconds: SESSION_TTL_SECONDS
};

export const authenticateRequest = async (database, request) => {
  const token = extractBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, reason: 'Missing bearer token' };
  }

  const session = await loadSessionFromToken(database, token);
  if (!session) {
    return { ok: false, status: 401, reason: 'Unknown session' };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (session.expires_at <= nowSeconds) {
    await deleteSessionById(database, session.id);
    return { ok: false, status: 401, reason: 'Session expired' };
  }

  const account = await findAccountById(database, session.account_id);
  if (!account) {
    await deleteSessionById(database, session.id);
    return { ok: false, status: 401, reason: 'Account not found' };
  }

  const roles = await listRolesForAccount(database, account.id);
  const user = buildUserPayload(account, roles);

  const newExpiry = nowSeconds + SESSION_TTL_SECONDS;
  await refreshSessionExpiry(database, session.id, newExpiry);

  return {
    ok: true,
    token,
    session,
    user
  };
};

export const requireAdminRole = (user) => Array.isArray(user?.roles) && user.roles.includes('admin');
