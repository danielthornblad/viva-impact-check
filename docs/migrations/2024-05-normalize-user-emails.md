# Normalize user emails to lowercase

## Background

Authentication and duplicate-user checks now compare emails using `LOWER(email)` and
lowercased inputs. Existing rows in the `users` table might still contain
uppercase characters, which can cause mismatches when the stored email casing
differs from a login attempt.

## Required actions

1. **Back up the `users` table.**
   ```sql
   -- adapt destination as needed
   CREATE TABLE users_backup AS SELECT * FROM users;
   ```
2. **Check for conflicts.** Identify addresses that collapse to the same
   lowercase value before updating.
   ```sql
   SELECT LOWER(email) AS normalized_email, COUNT(*) AS occurrences
     FROM users
 GROUP BY normalized_email
   HAVING COUNT(*) > 1;
   ```
   Resolve any duplicates manually (e.g. merge accounts or update emails) so the
   lowercase normalization remains unique.
3. **Normalize the stored values.**
   ```sql
   UPDATE users
      SET email = LOWER(email)
    WHERE email != LOWER(email);
   ```
4. **Enforce case-insensitive uniqueness (optional but recommended).** If the
   database supports it, add a unique index on `LOWER(email)` to prevent future
   duplicates once all rows are normalized.

## Rollback plan

Restore the `users` table from the backup created in step 1.
