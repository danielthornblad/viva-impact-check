import {
  buildSessionCookie,
  createSession,
  findAllowedAccountByEmail,
  jsonResponse,
  publicSessionPayload,
  verifyGoogleIdToken,
} from '../../lib/auth.js';

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  const idToken = payload.id_token || payload.idToken;
  const verification = await verifyGoogleIdToken(env, idToken);
  if (verification.error) {
    return jsonResponse({ error: verification.error }, 401);
  }

  const allowedAccount = await findAllowedAccountByEmail(env, verification.email);
  if (!allowedAccount || !allowedAccount.isActive) {
    return jsonResponse({ error: 'Google-kontot är inte behörigt för Viva Impact.' }, 403);
  }

  if (!allowedAccount.displayName && verification.name) {
    await env.DB.prepare(
      `UPDATE allowed_google_accounts SET display_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
      .bind(verification.name, allowedAccount.id)
      .run();
  }

  const session = await createSession(env, allowedAccount.id, verification.sub);
  const cookie = buildSessionCookie(env, session.id, session.expiresAt);

  return new Response(JSON.stringify({ session: publicSessionPayload(session) }, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': cookie,
    },
  });
}
