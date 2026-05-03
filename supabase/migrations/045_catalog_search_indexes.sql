-- Indecși GIN pentru căutare rapidă în catalogul de norme
-- Fără impact pe date sau logică, doar performanță
-- Impact estimat: ~10x mai rapid la ILIKE pe 1.100+ rânduri

CREATE INDEX IF NOT EXISTS idx_catalog_norms_name_gin 
  ON catalog_norms USING gin(to_tsvector('romanian', name));

CREATE INDEX IF NOT EXISTS idx_catalog_norms_symbol 
  ON catalog_norms(symbol);

CREATE INDEX IF NOT EXISTS idx_catalog_norms_category_active 
  ON catalog_norms(category, is_active);
