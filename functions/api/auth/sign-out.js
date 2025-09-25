import {
  createJsonResponse,
  deleteSessionByTokenHash,
  extractBearerToken,
  hashSessionToken
} from '../../_lib/auth';

export async function onRequestPost(context) {
  const { request, env } = context;
  const database = env.VIVA_AUTH_DB;

  if (!database) {
    return createJsonResponse(500, { error: 'D1 database binding VIVA_AUTH_DB is missing' });
  }

  const token = extractBearerToken(request);
  if (!token) {
    return createJsonResponse(200, { message: 'Ingen aktiv session att avsluta' });
  }

  const tokenHash = await hashSessionToken(token);
  await deleteSessionByTokenHash(database, tokenHash);

  return createJsonResponse(200, { message: 'Utloggning slutförd' });
}

export const onRequestOptions = () =>
  createJsonResponse(204, {}, {
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-allow-origin': '*'
  });
