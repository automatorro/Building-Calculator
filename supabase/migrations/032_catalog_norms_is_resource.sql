-- ============================================================
-- Migrare 032: Adăugarea flag-ului pentru resurse pure
-- ============================================================

-- 1. Adăugăm coloana
ALTER TABLE catalog_norms ADD COLUMN IF NOT EXISTS is_resource BOOLEAN DEFAULT false;

-- 2. Creăm index pe ea
CREATE INDEX IF NOT EXISTS idx_catalog_norms_is_resource ON catalog_norms(is_resource);

-- 3. Actualizăm bazele cu categoria "Diverse" (care sunt forță de muncă și utilaje)
UPDATE catalog_norms
SET is_resource = true
WHERE category = 'Diverse';
