import {
  authenticateRequest,
  createJsonResponse,
  ensureRolesExist,
  listRolesForAccount,
  requireAdminRole
} from '../../../_lib/auth';

const ACCOUNT_SELECT = `
  SELECT id, email, display_name, created_at, updated_at
  FROM allowed_google_accounts
  ORDER BY lower(email)
`;

const ACCOUNT_INSERT = `
  INSERT INTO allowed_google_accounts (id, email, display_name)
  VALUES (?, ?, ?)
`;

const ACCOUNT_ROLE_INSERT = `
  INSERT OR IGNORE INTO account_roles (account_id, role_id)
  VALUES (?, ?)
`;

const ROLE_LOOKUP = (count) =>
  `SELECT id, name FROM roles WHERE name IN (${new Array(count).fill('?').join(', ')})`;

const ROLE_ASSIGNMENTS_SELECT = `
  SELECT ar.account_id, r.name
  FROM account_roles ar
  INNER JOIN roles r ON r.id = ar.role_id
`;

const ROLE_LIST = 'SELECT name FROM roles ORDER BY name';

const loadRoleMap = async (database) => {
  const { results } = await database.prepare(ROLE_ASSIGNMENTS_SELECT).all();
  const map = new Map();
  for (const row of results ?? []) {
    if (!map.has(row.account_id)) {
      map.set(row.account_id, []);
    }
    map.get(row.account_id).push(row.name);
  }
  return map;
};

const listAccounts = async (database) => {
  const { results } = await database.prepare(ACCOUNT_SELECT).all();
  const roleMap = await loadRoleMap(database);
  return (results ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    roles: roleMap.get(row.id) ?? []
  }));
};

const fetchRoleIds = async (database, roleNames) => {
  if (!Array.isArray(roleNames) || roleNames.length === 0) {
    return [];
  }
  const { results } = await database
    .prepare(ROLE_LOOKUP(roleNames.length))
    .bind(...roleNames)
    .all();
  return results ?? [];
};

export async function onRequest(context) {
  const { request, env } = context;
  const database = env.VIVA_AUTH_DB;

  if (!database) {
    return createJsonResponse(500, { error: 'D1 database binding VIVA_AUTH_DB is missing' });
  }

  const authentication = await authenticateRequest(database, request);
  if (!authentication.ok) {
    return createJsonResponse(authentication.status, { error: authentication.reason });
  }

  if (!requireAdminRole(authentication.user)) {
    return createJsonResponse(403, { error: 'Administratörsbehörighet krävs' });
  }

  if (request.method === 'GET') {
    const accounts = await listAccounts(database);
    const { results: roleRows } = await database.prepare(ROLE_LIST).all();
    const availableRoles = (roleRows ?? []).map((row) => row.name);
    return createJsonResponse(200, { accounts, availableRoles });
  }

  if (request.method === 'POST') {
    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return createJsonResponse(400, { error: 'Kunde inte tolka JSON-kroppen' });
    }

    const email = payload?.email?.toString().trim().toLowerCase();
    const displayName = payload?.displayName?.toString().trim() || null;
    const requestedRoles = Array.isArray(payload?.roles)
      ? Array.from(new Set(payload.roles.map((role) => role.toString().trim()).filter(Boolean)))
      : [];

    if (!email) {
      return createJsonResponse(400, { error: 'E-postadress krävs' });
    }

    const rolesExist = await ensureRolesExist(database, requestedRoles);
    if (!rolesExist) {
      return createJsonResponse(400, { error: 'En eller flera roller saknas i uppsättningen' });
    }

    const accountId = crypto.randomUUID();

    try {
      await database.prepare(ACCOUNT_INSERT).bind(accountId, email, displayName).run();
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return createJsonResponse(409, { error: 'E-postadressen finns redan i allow-listan' });
      }
      return createJsonResponse(500, { error: 'Kunde inte skapa konto', details: error.message });
    }

    if (requestedRoles.length > 0) {
      const roleRows = await fetchRoleIds(database, requestedRoles);
      for (const role of roleRows) {
        await database.prepare(ACCOUNT_ROLE_INSERT).bind(accountId, role.id).run();
      }
    }

    const account = await database
      .prepare(
        `SELECT id, email, display_name, created_at, updated_at
         FROM allowed_google_accounts
         WHERE id = ?`
      )
      .bind(accountId)
      .first();
    const roles = await listRolesForAccount(database, accountId);

    return createJsonResponse(201, {
      account: {
        id: account.id,
        email: account.email,
        displayName: account.display_name,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
        roles
      }
    });
  }

  return createJsonResponse(405, { error: 'Metoden stöds inte' }, { Allow: 'GET, POST, OPTIONS' });
}

export const onRequestOptions = () =>
  createJsonResponse(204, {}, {
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-allow-origin': '*'
  });
