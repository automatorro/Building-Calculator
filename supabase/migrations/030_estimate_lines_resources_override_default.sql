ALTER TABLE estimate_lines
  ALTER COLUMN resources_override SET DEFAULT '[]'::jsonb;

UPDATE estimate_lines
SET resources_override = '[]'::jsonb
WHERE resources_override IS NULL;

