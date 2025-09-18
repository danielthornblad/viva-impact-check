const DEFAULT_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export const jsonResponse = (data, init = {}) => {
  const status = init.status || 200;
  const headers = new Headers(DEFAULT_HEADERS);
  if (init.headers) {
    for (const [key, value] of Object.entries(init.headers)) {
      headers.set(key, value);
    }
  }
  return new Response(JSON.stringify(data), { status, headers });
};

export const errorResponse = (status, message, extra = {}) => {
  return jsonResponse({ error: message, ...extra }, { status });
};
