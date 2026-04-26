-- M17: Jurnal de șantier
-- Rulează manual în Supabase SQL Editor

-- 1. Tabel intrări jurnal
CREATE TABLE IF NOT EXISTS journal_entries (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_type      TEXT NOT NULL CHECK (entry_type IN ('crew', 'work', 'weather', 'note', 'problem')),
  stage_name      VARCHAR(255),
  estimate_line_id UUID REFERENCES estimate_lines(id) ON DELETE SET NULL,
  data            JSONB DEFAULT '{}'::jsonb,
  photos          TEXT[] DEFAULT '{}',
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Adaugă progress_pct pe estimate_lines (M17.link)
ALTER TABLE estimate_lines
  ADD COLUMN IF NOT EXISTS progress_pct NUMERIC(5, 2) DEFAULT 0;

-- 3. RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'journal_entries'
      AND policyname = 'Allow public access to journal_entries'
  ) THEN
    CREATE POLICY "Allow public access to journal_entries"
      ON journal_entries FOR ALL USING (true);
  END IF;
END $$;

-- 4. Indecși pentru interogări rapide
CREATE INDEX IF NOT EXISTS idx_journal_entries_project_date
  ON journal_entries(project_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_estimate_line
  ON journal_entries(estimate_line_id)
  WHERE estimate_line_id IS NOT NULL;
