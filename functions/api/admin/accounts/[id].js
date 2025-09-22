import {
  authenticateRequest,
  createJsonResponse,
  ensureRolesExist,
  listRolesForAccount,
  requireAdminRole
} from '../../../_lib/auth';

const ACCOUNT_SELECT_BY_ID = `
  SELECT id, email, display_name, created_at, updated_at
  FROM allowed_google_accounts
  WHERE id = ?
`;

export async function onRequest(context) {
  const { request, env, params } = context;
  const database = env.VIVA_AUTH_DB;
  const accountId = params?.id;

  if (!database) {
    return createJsonResponse(500, { error: 'D1 database binding VIVA_AUTH_DB is missing' });
  }

  if (!accountId) {
    return createJsonResponse(400, { error: 'Kontots id saknas i URL:en' });
  }

  const authentication = await authenticateRequest(database, request);
  if (!authentication.ok) {
    return createJsonResponse(authentication.status, { error: authentication.reason });
  }

  if (!requireAdminRole(authentication.user)) {
    return createJsonResponse(403, { error: 'Administratörsbehörighet krävs' });
  }

  const existing = await database.prepare(ACCOUNT_SELECT_BY_ID).bind(accountId).first();
  if (!existing) {
    return createJsonResponse(404, { error: 'Kontot kunde inte hittas' });
  }

  if (request.method === 'PUT' || request.method === 'PATCH') {
    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return createJsonResponse(400, { error: 'Kunde inte tolka JSON-kroppen' });
    }

    const displayName = payload?.displayName?.toString().trim() || null;
    const requestedRoles = Array.isArray(payload?.roles)
      ? Array.from(new Set(payload.roles.map((role) => role.toString().trim()).filter(Boolean)))
      : [];

    const rolesExist = await ensureRolesExist(database, requestedRoles);
    if (!rolesExist) {
      return createJsonResponse(400, { error: 'En eller flera roller saknas i uppsättningen' });
    }

    await database
      .prepare(
        `UPDATE allowed_google_accounts
         SET display_name = ?, updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(displayName, accountId)
      .run();

    await database.prepare('DELETE FROM account_roles WHERE account_id = ?').bind(accountId).run();

    if (requestedRoles.length > 0) {
      const placeholders = requestedRoles.map(() => '?').join(', ');
      const { results } = await database
        .prepare(`SELECT id, name FROM roles WHERE name IN (${placeholders})`)
        .bind(...requestedRoles)
        .all();
      for (const role of results ?? []) {
        await database
          .prepare('INSERT OR IGNORE INTO account_roles (account_id, role_id) VALUES (?, ?)')
          .bind(accountId, role.id)
          .run();
      }
    }

    const updated = await database.prepare(ACCOUNT_SELECT_BY_ID).bind(accountId).first();
    const roles = await listRolesForAccount(database, accountId);

    return createJsonResponse(200, {
      account: {
        id: updated.id,
        email: updated.email,
        displayName: updated.display_name,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
        roles
      }
    });
  }

  if (request.method === 'DELETE') {
    await database.prepare('DELETE FROM allowed_google_accounts WHERE id = ?').bind(accountId).run();
    return createJsonResponse(200, { message: 'Kontot har tagits bort' });
  }

  return createJsonResponse(405, { error: 'Metoden stöds inte' }, { Allow: 'PUT, PATCH, DELETE, OPTIONS' });
}

export const onRequestOptions = () =>
  createJsonResponse(204, {}, {
    'access-control-allow-methods': 'PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-allow-origin': '*'
  });
