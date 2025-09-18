import { errorResponse, jsonResponse } from '../../_lib/response.js';
import {
  requireSession,
  revokeSession,
  buildSessionLogoutCookie,
} from '../../_lib/session.js';

export const onRequestPost = async ({ request, env }) => {
  const { session, response } = await requireSession(request, env);
  if (!session) {
    return response || errorResponse(401, 'Ingen aktiv session.');
  }

  await revokeSession(env, session.id);
  const logoutCookie = buildSessionLogoutCookie(env);

  return jsonResponse({ success: true }, {
    headers: {
      'Set-Cookie': logoutCookie,
    },
  });
};
