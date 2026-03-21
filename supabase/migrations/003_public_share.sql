-- ============================================================
-- Migrare 003: Token public pentru partajare deviz
-- Rulează manual în Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS public_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS public_share_enabled BOOLEAN DEFAULT false;

-- Index pe token pentru lookup rapid
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_public_token
  ON projects(public_token);

-- Policy: oricine (anon) poate citi un proiect dacă are token-ul și share-ul e activat
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'projects_public_read'
  ) THEN
    CREATE POLICY "projects_public_read" ON projects
      FOR SELECT TO anon
      USING (public_share_enabled = true);
  END IF;
END $$;

-- Populare token pentru proiectele existente care nu au token
UPDATE projects
  SET public_token = gen_random_uuid()
  WHERE public_token IS NULL;
