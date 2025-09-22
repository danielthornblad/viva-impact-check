-- D1 schema for authentication and authorization primitives
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS allowed_google_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL REFERENCES allowed_google_accounts(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, role)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES allowed_google_accounts(id) ON DELETE CASCADE,
  google_sub TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  refreshed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_account_id ON user_sessions(account_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_account_id ON admin_roles(account_id);
