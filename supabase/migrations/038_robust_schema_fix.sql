-- ============================================================
-- Migrare 038: Reparare Robustă Schemă (user_id & CASCADE)
-- ============================================================

-- 1. Adăugăm coloana user_id în estimate_lines dacă nu există
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'estimate_lines' AND column_name = 'user_id') THEN
        ALTER TABLE estimate_lines ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Backfill user_id din tabelul projects pentru liniile existente
UPDATE estimate_lines el
SET user_id = p.user_id
FROM projects p
WHERE el.project_id = p.id
AND el.user_id IS NULL 
AND p.user_id IS NOT NULL;

-- 3. Ne asigurăm că ștergerea (DELETE CASCADE) este activă și corectă pe toate tabelele dependente
-- Acest lucru previne erorile de "foreign key violation" la ștergerea unui proiect.

-- estimate_lines (obligatoriu)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'estimate_lines') THEN
    ALTER TABLE estimate_lines 
      DROP CONSTRAINT IF EXISTS estimate_lines_project_id_fkey,
      ADD CONSTRAINT estimate_lines_project_id_fkey 
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- purchases (opțional)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'purchases') THEN
    ALTER TABLE purchases 
      DROP CONSTRAINT IF EXISTS purchases_project_id_fkey,
      ADD CONSTRAINT purchases_project_id_fkey 
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- vendor_offers (opțional)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'vendor_offers') THEN
    ALTER TABLE vendor_offers 
      DROP CONSTRAINT IF EXISTS vendor_offers_project_id_fkey,
      ADD CONSTRAINT vendor_offers_project_id_fkey 
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Politici RLS pentru estimate_lines bazate pe user_id
-- Ștergem politici vechi care ar putea fi în conflict
DROP POLICY IF EXISTS "Allow public access to estimate_lines" ON estimate_lines;
DROP POLICY IF EXISTS "estimate_lines_owner_all" ON estimate_lines;
DROP POLICY IF EXISTS "estimate_lines_project_owner" ON estimate_lines;

-- Permitem accesul complet posesorului liniilor
CREATE POLICY "estimate_lines_owner_all" ON estimate_lines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Politică de siguranță: posesorul proiectului poate vedea/editează liniile proiectului chiar dacă user_id pe linie e null
CREATE POLICY "estimate_lines_project_owner" ON estimate_lines
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.user_id = auth.uid() OR p.user_id IS NULL)
  ));

-- 5. Re-verificare Politici Projects (pentru a fi siguri că ștergerea e permisă)
DROP POLICY IF EXISTS "projects_delete_owner" ON projects;
DROP POLICY IF EXISTS "projects_delete_anonymous" ON projects;
DROP POLICY IF EXISTS "projects_owner_all" ON projects;

CREATE POLICY "projects_owner_all" ON projects
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
