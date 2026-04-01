ALTER TABLE estimate_lines
  ADD COLUMN IF NOT EXISTS resources_override JSONB DEFAULT '[]'::jsonb;

