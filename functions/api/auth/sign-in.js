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

const extractErrorMessages = (error, seen = new Set()) => {
  if (!error) {
    return [];
  }

  if (typeof error === 'string') {
    return [error];
  }

  if (Array.isArray(error)) {
    return error.flatMap((item) => extractErrorMessages(item, seen));
  }

  if (typeof error !== 'object') {
    return [];
  }

  if (seen.has(error)) {
    return [];
  }
  seen.add(error);

  const messages = [];

  if (typeof error.message === 'string') {
    messages.push(error.message);
  }

  if (error.cause) {
    messages.push(...extractErrorMessages(error.cause, seen));
  }

  if (Array.isArray(error.errors)) {
    for (const nestedError of error.errors) {
      messages.push(...extractErrorMessages(nestedError, seen));
    }
  }

  return messages;
};

const isAuthTablesMissingError = (error) =>
  extractErrorMessages(error).some((message) => {
    if (message == null) {
      return false;
    }

    const normalized = String(message).toLowerCase();
    return normalized.includes('no such table');
  });

const createAuthTablesMissingResponse = () =>
  createJsonResponse(500, {
    error: 'Databasen saknar auth-tabeller – kör D1-migrationerna.'
  });

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
  let account;
  try {
    account = await findAccountByEmail(database, email);
  } catch (error) {
    if (isAuthTablesMissingError(error)) {
      console.error('Kunde inte hämta konto från auth-databasen', error);
      return createAuthTablesMissingResponse();
    }

    throw error;
  }
  if (!account) {
    return createJsonResponse(403, { error: 'Kontot är inte godkänt för Viva Impact' });
  }

  let roles;
  try {
    roles = await listRolesForAccount(database, account.id);
  } catch (error) {
    if (isAuthTablesMissingError(error)) {
      console.error('Kunde inte hämta roller från auth-databasen', error);
      return createAuthTablesMissingResponse();
    }

    throw error;
  }
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
