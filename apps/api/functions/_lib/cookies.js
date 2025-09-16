const formatExpires = (date) => date.toUTCString();

export const serializeCookie = (name, value, options = {}) => {
  if (!name) {
    throw new Error('Cookie name is required');
  }
  const parts = [`${name}=${value ?? ''}`];
  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  }
  if (options.expires) {
    const expires = options.expires instanceof Date
      ? options.expires
      : new Date(options.expires);
    parts.push(`Expires=${formatExpires(expires)}`);
  }
  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.secure) {
    parts.push('Secure');
  }
  if (options.httpOnly) {
    parts.push('HttpOnly');
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }
  return parts.join('; ');
};

export const expireCookie = (name, options = {}) => {
  return serializeCookie(name, '', {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
};
