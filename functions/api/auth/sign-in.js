import {
  SESSION_SETTINGS,
  buildUserPayload,
  createJsonResponse,
  findAccountByEmail,
  generateSessionToken,
  hashSessionToken,
  listRolesForAccount,
  verifyGoogleIdToken
} from '../../_lib/auth';

const SESSION_INSERT = `
  INSERT INTO sessions (id, account_id, token_hash, expires_at)
  VALUES (?, ?, ?, ?)
`;

export async function onRequestPost(context) {
  const { request, env } = context;
  const database = env.VIVA_AUTH_DB;

  if (!database) {
    return createJsonResponse(500, { error: 'D1 database binding VIVA_AUTH_DB is missing' });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return createJsonResponse(400, { error: 'Request body måste vara giltig JSON' });
  }

  const credential = payload?.credential;
  if (!credential || typeof credential !== 'string') {
    return createJsonResponse(400, { error: 'Fältet credential saknas eller är ogiltigt' });
  }

  const expectedAudience = env.GOOGLE_CLIENT_ID;
  if (!expectedAudience) {
    return createJsonResponse(500, { error: 'Servern saknar GOOGLE_CLIENT_ID-konfiguration' });
  }

  let googleProfile;
  try {
    googleProfile = await verifyGoogleIdToken(credential, expectedAudience, fetch);
  } catch (error) {
    return createJsonResponse(401, { error: 'Google-verifiering misslyckades', details: error.message });
  }

  const email = googleProfile.email?.toLowerCase();
  const account = await findAccountByEmail(database, email);
  if (!account) {
    return createJsonResponse(403, { error: 'Kontot är inte godkänt för Viva Impact' });
  }

  const roles = await listRolesForAccount(database, account.id);
  const user = buildUserPayload(account, roles);

  const sessionToken = generateSessionToken();
  const tokenHash = await hashSessionToken(sessionToken);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const expiresAt = nowSeconds + SESSION_SETTINGS.ttlSeconds;
  const sessionId = crypto.randomUUID();

  try {
    await database.prepare(SESSION_INSERT).bind(sessionId, account.id, tokenHash, expiresAt).run();
  } catch (error) {
    return createJsonResponse(500, { error: 'Kunde inte skapa session', details: error.message });
  }

  return createJsonResponse(200, {
    token: sessionToken,
    user
  });
}

export const onRequestOptions = () =>
  createJsonResponse(204, {}, {
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-allow-origin': '*'
  });
