import { jsonResponse } from '../../_lib/response';
import { getSession } from '../../_lib/session';

export const onRequestGet = async ({ request, env }) => {
  const session = await getSession(request, env);
  if (!session) {
    return jsonResponse({ authenticated: false, user: null });
  }

  await env.DB.prepare(
    'UPDATE sessions SET last_seen_at = datetime(\'now\') WHERE id = ?'
  ).bind(session.id).run();

  return jsonResponse({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
    },
  });
};
