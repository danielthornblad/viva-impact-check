import { jsonResponse, errorResponse } from '../../../../_lib/response';
import { requireAdminSession, revokeSessionsForUser } from '../../../../_lib/session';
import { requireTurnstile } from '../../../../_lib/turnstile';
import { hashPassword } from '../../../../_lib/passwords';
import { validatePassword } from '../../../../_lib/validation';

export const onRequestPost = async ({ request, env, params }) => {
  const { userId } = params;
  if (!userId) {
    return errorResponse(400, 'Användar-ID saknas.');
  }

  const { session, response } = await requireAdminSession(request, env);
  if (!session) {
    return response;
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, 'Kunde inte tolka JSON.');
  }

  const { password, turnstileToken } = body || {};
  if (!password) {
    return errorResponse(400, 'Nytt lösenord krävs.');
  }

  const remoteIp = request.headers.get('CF-Connecting-IP');
  const turnstileError = await requireTurnstile(env, turnstileToken, remoteIp);
  if (turnstileError) {
    return turnstileError;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return errorResponse(400, 'Ogiltigt lösenord.', { reasons: passwordValidation.errors });
  }

  const user = await env.DB.prepare(
    'SELECT id FROM users WHERE id = ?'
  ).bind(userId).first();
  if (!user) {
    return errorResponse(404, 'Användaren kunde inte hittas.');
  }

  const passwordHash = await hashPassword(password);
  await env.DB.prepare(
    'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).bind(passwordHash, userId).run();
  await revokeSessionsForUser(env, userId);

  return jsonResponse({ success: true });
};
