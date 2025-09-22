import {
  buildSessionClearCookie,
  deleteSession,
  getSessionFromRequest,
} from '../../lib/auth.js';

async function handleSignOut(request, env) {
  const session = await getSessionFromRequest(env, request);
  if (session) {
    await deleteSession(env, session.id);
  }
  const cookie = buildSessionClearCookie(env);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': cookie,
    },
  });
}

export async function onRequestPost({ request, env }) {
  return handleSignOut(request, env);
}

export async function onRequestDelete({ request, env }) {
  return handleSignOut(request, env);
}
