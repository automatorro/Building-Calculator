-- ============================================================
-- BuildingCalc — Modul Achiziții: Catalog Dedeman
-- Migration: 048_dedeman_catalog.sql
-- ============================================================

-- ── 1. Tabel catalog produse Dedeman ──────────────────────────
CREATE TABLE IF NOT EXISTS public.dedeman_catalog (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cod_produs        TEXT NOT NULL UNIQUE,
  ean               TEXT,
  nume              TEXT NOT NULL,
  brand             TEXT,
  categorie         TEXT,
  subcategorie      TEXT,
  pret              NUMERIC(10, 2),
  pret_vechi        NUMERIC(10, 2),
  discount_procent  NUMERIC(5, 1),
  moneda            TEXT DEFAULT 'RON',
  disponibilitate   TEXT,
  unitate_masura    TEXT,
  descriere_scurta  TEXT,
  specificatii      JSONB DEFAULT '{}',
  imagini           TEXT[] DEFAULT '{}',
  rating            NUMERIC(3, 1),
  nr_review         INTEGER DEFAULT 0,
  url               TEXT,
  sync_at           TIMESTAMPTZ DEFAULT NOW(),
  activ             BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_dedeman_catalog_categorie ON public.dedeman_catalog(categorie);
CREATE INDEX IF NOT EXISTS idx_dedeman_catalog_brand     ON public.dedeman_catalog(brand);
CREATE INDEX IF NOT EXISTS idx_dedeman_catalog_pret      ON public.dedeman_catalog(pret);
CREATE INDEX IF NOT EXISTS idx_dedeman_catalog_search
  ON public.dedeman_catalog USING gin(to_tsvector('romanian', coalesce(nume,'') || ' ' || coalesce(brand,'')));

-- ── 2. Tabel surse alternative de pret (MaxBau, Praktiker etc.) ──
CREATE TABLE IF NOT EXISTS public.catalog_furnizori (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  furnizor      TEXT NOT NULL,
  cod_furnizor  TEXT,
  cod_produs_ref TEXT,
  ean           TEXT,
  nume          TEXT NOT NULL,
  pret          NUMERIC(10, 2),
  unitate_masura TEXT,
  disponibilitate TEXT,
  url           TEXT,
  sync_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_furnizori_ean        ON public.catalog_furnizori(ean);
CREATE INDEX IF NOT EXISTS idx_furnizori_ref        ON public.catalog_furnizori(cod_produs_ref);
CREATE INDEX IF NOT EXISTS idx_furnizori_furnizor   ON public.catalog_furnizori(furnizor);

-- ── 3. View: comparare preturi pe EAN ──────────────────────────
CREATE OR REPLACE VIEW public.v_price_comparison AS
SELECT
  d.cod_produs,
  d.ean,
  d.nume,
  d.brand,
  d.categorie,
  d.unitate_masura,
  d.pret            AS pret_dedeman,
  d.disponibilitate AS disponibilitate_dedeman,
  d.url             AS url_dedeman,
  f.furnizor,
  f.pret            AS pret_furnizor,
  f.disponibilitate AS disponibilitate_furnizor,
  f.url             AS url_furnizor,
  CASE
    WHEN d.pret IS NOT NULL AND f.pret IS NOT NULL
    THEN ROUND(((d.pret - f.pret) / d.pret * 100), 1)
  END AS diferenta_procent,
  CASE
    WHEN d.pret IS NULL THEN f.furnizor
    WHEN f.pret IS NULL THEN 'dedeman'
    WHEN f.pret < d.pret THEN f.furnizor
    ELSE 'dedeman'
  END AS cel_mai_ieftin
FROM public.dedeman_catalog d
LEFT JOIN public.catalog_furnizori f
  ON d.ean = f.ean AND f.ean IS NOT NULL
WHERE d.activ = TRUE;

-- ── 4. Tabel comenzi de achizitie ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.comenzi_achizitie (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id),
  furnizor        TEXT DEFAULT 'Dedeman',
  status          TEXT DEFAULT 'draft'
                  CHECK (status IN ('draft', 'trimisa', 'confirmata', 'livrata', 'anulata')),
  total           NUMERIC(12, 2),
  moneda          TEXT DEFAULT 'RON',
  note            TEXT,
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comenzi_project ON public.comenzi_achizitie(project_id);

-- Linii comanda
CREATE TABLE IF NOT EXISTS public.comanda_linii (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comanda_id      UUID REFERENCES public.comenzi_achizitie(id) ON DELETE CASCADE,
  cod_produs      TEXT,
  ean             TEXT,
  nume_produs     TEXT NOT NULL,
  brand           TEXT,
  furnizor        TEXT DEFAULT 'Dedeman',
  cantitate       NUMERIC(10, 3) NOT NULL,
  unitate_masura  TEXT,
  pret_unitar     NUMERIC(10, 2),
  url_produs      TEXT,
  imagine_url     TEXT,
  note_linie      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comanda_linii_comanda ON public.comanda_linii(comanda_id);

-- ── 5. Trigger: updated_at automat ────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at_comenzi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comenzi_updated_at ON public.comenzi_achizitie;
CREATE TRIGGER trg_comenzi_updated_at
  BEFORE UPDATE ON public.comenzi_achizitie
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_comenzi();

-- ── 6. RLS Policies ───────────────────────────────────────────
ALTER TABLE public.dedeman_catalog    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_furnizori  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comenzi_achizitie  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comanda_linii      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "catalog_read_all"      ON public.dedeman_catalog;
DROP POLICY IF EXISTS "catalog_service_write" ON public.dedeman_catalog;
DROP POLICY IF EXISTS "furnizori_read_all"    ON public.catalog_furnizori;
DROP POLICY IF EXISTS "furnizori_service_write" ON public.catalog_furnizori;
DROP POLICY IF EXISTS "comenzi_user_crud"     ON public.comenzi_achizitie;
DROP POLICY IF EXISTS "linii_via_comanda"     ON public.comanda_linii;

-- Catalogul e read-only pentru useri autentificati
CREATE POLICY "catalog_read_all"
  ON public.dedeman_catalog FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "furnizori_read_all"
  ON public.catalog_furnizori FOR SELECT
  USING (auth.role() = 'authenticated');

-- Comenzi: fiecare user vede doar comenzile lui
CREATE POLICY "comenzi_user_crud"
  ON public.comenzi_achizitie FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "linii_via_comanda"
  ON public.comanda_linii FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.comenzi_achizitie c
      WHERE c.id = comanda_id AND c.user_id = auth.uid()
    )
  );

-- Service role poate scrie in catalog (pentru sync script)
CREATE POLICY "catalog_service_write"
  ON public.dedeman_catalog FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "furnizori_service_write"
  ON public.catalog_furnizori FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
