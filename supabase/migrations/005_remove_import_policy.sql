-- ============================================================
-- Migrare 005: Elimină politica temporară de import
-- Rulează DUPĂ ce importul de norme s-a terminat
-- ============================================================

DROP POLICY IF EXISTS "catalog_norms_insert_import" ON catalog_norms;
DROP POLICY IF EXISTS "catalog_norms_upsert_import" ON catalog_norms;
