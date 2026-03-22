-- ============================================================
-- Migrare 004: Pregătire import masiv norme deviz.ro
-- Rulează în Supabase Dashboard → SQL Editor ÎNAINTE de import
-- ============================================================

-- 1. Adaugă coloana pentru ID-ul din deviz.ro
ALTER TABLE catalog_norms
  ADD COLUMN IF NOT EXISTS deviz_reference_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_catalog_norms_deviz_ref
  ON catalog_norms(deviz_reference_id);

-- 2. Politică temporară INSERT pentru import din browser
--    (o vom șterge după import cu migrarea 005)
DROP POLICY IF EXISTS "catalog_norms_insert_import" ON catalog_norms;
CREATE POLICY "catalog_norms_insert_import" ON catalog_norms
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "catalog_norms_upsert_import" ON catalog_norms
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- DUPĂ import, rulează 005_remove_import_policy.sql
-- ============================================================
