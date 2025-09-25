const normalizeTargetPath = (rawPath) => {
  if (!rawPath || typeof rawPath !== 'string') {
    return '/login';
  }

  try {
    const trimmed = rawPath.trim();
    if (!trimmed) {
      return '/login';
    }

    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  } catch (_error) {
    return '/login';
  }
};

const mergeParamsFromPostBody = async (request, existingParams) => {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        existingParams.set(key, value);
      }
    }
    return;
  }

  if (contentType.includes('application/json')) {
    try {
      const body = await request.json();
      if (body && typeof body === 'object') {
        for (const [key, value] of Object.entries(body)) {
          if (typeof value === 'string') {
            existingParams.set(key, value);
          }
        }
      }
      return;
    } catch (_error) {
      // fall through to attempt plain text parsing
    }
  }

  const rawBody = await request.text();
  if (!rawBody) {
    return;
  }

  try {
    const fallbackParams = new URLSearchParams(rawBody);
    for (const [key, value] of fallbackParams.entries()) {
      existingParams.set(key, value);
    }
  } catch (_error) {
    // ignore unparsable bodies
  }
};

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method !== 'GET' && method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const requestUrl = new URL(request.url);
  const combinedParams = new URLSearchParams(requestUrl.search);

  if (method === 'POST') {
    await mergeParamsFromPostBody(request, combinedParams);
  }

  const targetPath = normalizeTargetPath(env.GOOGLE_REDIRECT_TARGET_PATH);
  const redirectUrl = new URL(targetPath, requestUrl.origin);

  for (const [key, value] of combinedParams.entries()) {
    if (typeof value === 'string') {
      redirectUrl.searchParams.set(key, value);
    }
  }

  return Response.redirect(redirectUrl.toString(), 303);
}
