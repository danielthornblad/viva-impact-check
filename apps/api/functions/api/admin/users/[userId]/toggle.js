import { jsonResponse, errorResponse } from '../../../../_lib/response';
import { requireAdminSession, revokeSessionsForUser } from '../../../../_lib/session';

export const onRequestPost = async ({ request, env, params }) => {
  const { userId } = params;
  if (!userId) {
    return errorResponse(400, 'Användar-ID saknas.');
  }

  const { session, response } = await requireAdminSession(request, env);
  if (!session) {
    return response;
  }

  if (session.userId === userId) {
    return errorResponse(400, 'Du kan inte ändra status på ditt eget konto.');
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, 'Kunde inte tolka JSON.');
  }

  const { action } = body || {};
  if (!['disable', 'enable'].includes(action)) {
    return errorResponse(400, 'Ogiltig åtgärd.');
  }

  const user = await env.DB.prepare(
    'SELECT id, is_active as isActive FROM users WHERE id = ?'
  ).bind(userId).first();
  if (!user) {
    return errorResponse(404, 'Användaren kunde inte hittas.');
  }

  const nextActive = action === 'enable' ? 1 : 0;
  await env.DB.prepare(
    'UPDATE users SET is_active = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).bind(nextActive, userId).run();

  if (nextActive === 0) {
    await revokeSessionsForUser(env, userId);
  }

  return jsonResponse({ success: true, isActive: nextActive === 1 });
};
