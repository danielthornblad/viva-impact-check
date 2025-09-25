-- Migration: Create authentication tables for Viva Impact auth stack
-- This schema provisions session handling, allow-list management and role assignments.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS allowed_google_accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS account_roles (
  account_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (account_id, role_id),
  FOREIGN KEY (account_id) REFERENCES allowed_google_accounts (id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (account_id) REFERENCES allowed_google_accounts (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_account_id ON sessions (account_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

-- Seed default roles that can be safely created in every environment.
INSERT OR IGNORE INTO roles (id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Full access to manage user allow-list and configuration'),
  ('00000000-0000-0000-0000-000000000002', 'analyst', 'Access to Viva Impact analytical tooling');
