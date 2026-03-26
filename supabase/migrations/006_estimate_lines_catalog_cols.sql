-- ============================================================
-- Migrare 006: Adaugă coloane catalog_norms în estimate_lines
-- Rulează manual în Supabase Dashboard → SQL Editor
-- ============================================================

-- Coloane necesare pentru linii adăugate din catalog_norms
-- (complementare cu item_id din schema veche — ambele pot coexista)

ALTER TABLE estimate_lines
  ADD COLUMN IF NOT EXISTS catalog_norm_id INTEGER REFERENCES catalog_norms(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS code VARCHAR(100),
  ADD COLUMN IF NOT EXISTS unit VARCHAR(50),
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(15, 4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS category VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Index pentru căutare rapidă după catalog_norm_id
CREATE INDEX IF NOT EXISTS idx_estimate_lines_catalog_norm
  ON estimate_lines(catalog_norm_id);

-- RLS: politica existentă "Allow public access to estimate_lines" acoperă și coloanele noi
-- Nu e nevoie de politici suplimentare
