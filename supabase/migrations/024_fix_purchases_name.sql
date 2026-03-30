-- Fix missing 'name' column in purchases table
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT 'Achiziție';

-- Reset default after adding (if we don't want a default for future inserts)
-- ALTER TABLE purchases ALTER COLUMN name DROP DEFAULT;
