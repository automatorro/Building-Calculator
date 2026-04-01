ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}'::text[];

