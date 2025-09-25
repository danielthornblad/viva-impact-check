-- Seed script for creating initial allowed Google accounts.
-- Replace the placeholder values before executing in any environment.

INSERT INTO allowed_google_accounts (id, email, display_name)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Initial Admin')
ON CONFLICT(email) DO UPDATE SET display_name = excluded.display_name,
                                 updated_at = datetime('now');

-- Ensure the admin account retains administrator privileges.
INSERT OR IGNORE INTO account_roles (account_id, role_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001');
