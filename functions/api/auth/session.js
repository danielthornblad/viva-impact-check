import { authenticateRequest, createJsonResponse } from '../../_lib/auth';

export async function onRequestPost(context) {
  const { request, env } = context;
  const database = env.VIVA_AUTH_DB;

  if (!database) {
    return createJsonResponse(500, { error: 'D1 database binding VIVA_AUTH_DB is missing' });
  }

  const authentication = await authenticateRequest(database, request);
  if (!authentication.ok) {
    return createJsonResponse(authentication.status, { error: authentication.reason });
  }

  return createJsonResponse(200, {
    user: authentication.user
  });
}

export const onRequestOptions = () =>
  createJsonResponse(204, {}, {
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-allow-origin': '*'
  });
