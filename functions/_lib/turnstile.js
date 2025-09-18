import { errorResponse } from './response.js';

const TURNSTILE_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const verifyTurnstileToken = async (env, token, remoteIp) => {
  if (!env.TURNSTILE_SECRET_KEY) {
    throw new Error('TURNSTILE_SECRET_KEY is not configured');
  }

  const formData = new FormData();
  formData.append('secret', env.TURNSTILE_SECRET_KEY);
  formData.append('response', token || '');
  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  const response = await fetch(TURNSTILE_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to verify Turnstile token (${response.status})`);
  }

  const data = await response.json();
  if (!data.success) {
    const codes = data['error-codes'] || [];
    return {
      success: false,
      codes,
    };
  }

  return { success: true };
};

export const requireTurnstile = async (env, token, remoteIp) => {
  if (!token) {
    return errorResponse(400, 'Turnstile token saknas.');
  }
  try {
    const result = await verifyTurnstileToken(env, token, remoteIp);
    if (!result.success) {
      return errorResponse(403, 'Turnstile validering misslyckades.', {
        codes: result.codes,
      });
    }
  } catch (error) {
    console.error('Turnstile verification error', error);
    return errorResponse(502, 'Kunde inte verifiera Turnstile. Försök igen senare.');
  }
  return null;
};
