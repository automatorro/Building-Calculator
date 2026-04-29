-- Migration 044: plan_analyses table
-- Stochează rezultatele analizei planurilor de construcție (PDF/imagine)

CREATE TABLE IF NOT EXISTS plan_analyses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now(),
  tip_plan        text,
  element         text,
  scara           text,
  faza            text,
  categorii       jsonb DEFAULT '[]',
  note            text,
  file_name       text,
  validated_at    timestamptz  -- null = nevalidat, not null = validat de user
);

-- RLS
ALTER TABLE plan_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_analyses: owner read"
  ON plan_analyses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "plan_analyses: owner insert"
  ON plan_analyses FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "plan_analyses: owner update"
  ON plan_analyses FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "plan_analyses: owner delete"
  ON plan_analyses FOR DELETE
  USING (user_id = auth.uid());

-- Index pentru query rapid pe proiect
CREATE INDEX IF NOT EXISTS plan_analyses_project_id_idx ON plan_analyses(project_id);
CREATE INDEX IF NOT EXISTS plan_analyses_user_id_idx    ON plan_analyses(user_id);
