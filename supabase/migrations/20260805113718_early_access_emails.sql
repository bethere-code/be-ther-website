/*
# Create early_access_emails table (single-tenant, no auth)

1. New Tables
- `early_access_emails`
  - `id` (uuid, primary key)
  - `email` (text, unique, not null) — the visitor's submitted email address
  - `created_at` (timestamptz, defaults to now) — when they signed up
2. Security
- Enable RLS on `early_access_emails`.
- Allow anon + authenticated to INSERT only (so the public landing-page form can submit).
- No SELECT/UPDATE/DELETE for anon — only the service role (edge function / admin) can read.
*/

CREATE TABLE IF NOT EXISTS early_access_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE early_access_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_early_access" ON early_access_emails;
CREATE POLICY "anon_insert_early_access" ON early_access_emails
  FOR INSERT TO anon, authenticated WITH CHECK (true);
