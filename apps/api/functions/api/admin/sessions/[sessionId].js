import { jsonResponse, errorResponse } from '../../../_lib/response';
import { requireAdminSession, revokeSession } from '../../../_lib/session';

export const onRequestDelete = async ({ request, env, params }) => {
  const { sessionId } = params;
  if (!sessionId) {
    return errorResponse(400, 'Session-ID saknas.');
  }

  const { session, response } = await requireAdminSession(request, env);
  if (!session) {
    return response;
  }

  await revokeSession(env, sessionId);
  return jsonResponse({ success: true });
};
