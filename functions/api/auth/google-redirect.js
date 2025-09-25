const LOGIN_PATH = '/login';

const buildRedirectUrl = (requestUrl, params = new URLSearchParams()) => {
  const url = new URL(requestUrl);
  const target = new URL(LOGIN_PATH, url.origin);

  params.forEach((value, key) => {
    if (value != null && value !== '') {
      target.searchParams.set(key, value);
    }
  });

  return target.toString();
};

const redirectToLogin = (requestUrl, params) =>
  Response.redirect(buildRedirectUrl(requestUrl, params), 303);

export async function onRequestPost({ request }) {
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    return redirectToLogin(request.url);
  }

  const credential = formData.get('credential');
  const gCsrfToken = formData.get('g_csrf_token');

  const params = new URLSearchParams();
  if (credential) {
    params.set('credential', credential);
  }
  if (gCsrfToken) {
    params.set('g_csrf_token', gCsrfToken);
  }

  return redirectToLogin(request.url, params);
}

export const onRequestGet = ({ request }) => redirectToLogin(request.url);
