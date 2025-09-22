import {
  buildSessionCookie,
  getSessionFromRequest,
  jsonResponse,
  publicSessionPayload,
  refreshSession,
} from '../../lib/auth.js';

export async function onRequestGet({ request, env }) {
  const session = await getSessionFromRequest(env, request);
  if (!session) {
    return jsonResponse({ session: null, error: 'Authentication required.' }, 401);
  }
  return jsonResponse({ session: publicSessionPayload(session) }, 200);
}

export async function onRequestPost({ request, env }) {
  const session = await getSessionFromRequest(env, request);
  if (!session) {
    return jsonResponse({ error: 'Authentication required.' }, 401);
  }
  const newExpiry = await refreshSession(env, session.id);
  session.expiresAt = newExpiry;
  const cookie = buildSessionCookie(env, session.id, newExpiry);
  return new Response(JSON.stringify({ session: publicSessionPayload(session) }, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': cookie,
    },
  });
}
