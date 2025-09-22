import {
  findAllowedAccountByEmail,
  jsonResponse,
  normalizeRoles,
  publicSessionPayload,
  requireAdmin,
} from '../../lib/auth.js';

export async function onRequestGet({ request, env }) {
  const { response } = await requireAdmin(env, request);
  if (response) {
    return response;
  }

  const { results } = await env.DB.prepare(
    `SELECT a.id, a.email, a.display_name, a.is_active, a.created_at, a.updated_at,
            GROUP_CONCAT(r.role, ',') AS roles
       FROM allowed_google_accounts a
       LEFT JOIN admin_roles r ON r.account_id = a.id
   GROUP BY a.id
   ORDER BY a.email`
  ).all();

  const accounts = (results || []).map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    isActive: row.is_active === 1,
    roles: row.roles ? Array.from(new Set(row.roles.split(',').filter(Boolean))) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return jsonResponse({ accounts });
}

export async function onRequestPost({ request, env }) {
  const { response, session } = await requireAdmin(env, request);
  if (response) {
    return response;
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email) {
    return jsonResponse({ error: 'Email-adress krävs.' }, 400);
  }

  const displayName = payload.displayName ? String(payload.displayName).trim() : null;
  const isActive = payload.isActive !== false;
  const roles = normalizeRoles(payload.roles);

  let account = await env.DB.prepare(
    `SELECT id FROM allowed_google_accounts WHERE email = ?`
  ).bind(email).first();

  if (!account) {
    await env.DB.prepare(
      `INSERT INTO allowed_google_accounts (email, display_name, is_active)
       VALUES (?, ?, ?)`
    )
      .bind(email, displayName, isActive ? 1 : 0)
      .run();
  } else {
    await env.DB.prepare(
      `UPDATE allowed_google_accounts
          SET display_name = ?,
              is_active = ?,
              updated_at = CURRENT_TIMESTAMP
        WHERE email = ?`
    )
      .bind(displayName, isActive ? 1 : 0, email)
      .run();
  }

  account = await env.DB.prepare(
    `SELECT id FROM allowed_google_accounts WHERE email = ?`
  ).bind(email).first();

  if (!account) {
    return jsonResponse({ error: 'Kunde inte spara kontot.' }, 500);
  }

  await env.DB.prepare(`DELETE FROM admin_roles WHERE account_id = ?`).bind(account.id).run();

  for (const role of roles) {
    await env.DB.prepare(
      `INSERT INTO admin_roles (account_id, role) VALUES (?, ?)`
    ).bind(account.id, role)
      .run();
  }

  if (!isActive) {
    await env.DB.prepare(`DELETE FROM user_sessions WHERE account_id = ?`).bind(account.id).run();
  }

  const updatedAccount = await findAllowedAccountByEmail(env, email);
  return jsonResponse({ account: updatedAccount, actor: publicSessionPayload(session) });
}

export async function onRequestDelete({ request, env }) {
  const { response } = await requireAdmin(env, request);
  if (response) {
    return response;
  }

  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  if (!email) {
    return jsonResponse({ error: 'Email-adress saknas.' }, 400);
  }

  const account = await findAllowedAccountByEmail(env, email);
  if (!account) {
    return jsonResponse({ error: 'Kontot hittades inte.' }, 404);
  }

  await env.DB.prepare(
    `UPDATE allowed_google_accounts
        SET is_active = 0,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
  ).bind(account.id).run();
  await env.DB.prepare(`DELETE FROM admin_roles WHERE account_id = ?`).bind(account.id).run();
  await env.DB.prepare(`DELETE FROM user_sessions WHERE account_id = ?`).bind(account.id).run();

  return jsonResponse({
    account: { ...account, isActive: false, roles: [] },
  });
}
