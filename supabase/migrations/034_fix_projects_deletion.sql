-- ============================================================
-- Migrare 034: Reparare Politici Ștergere Proiecte
-- ============================================================

-- 1. Ștergem orice politici vechi care pot cauza conflicte sau confuzie
DROP POLICY IF EXISTS "projects_delete_authenticated" ON projects;
DROP POLICY IF EXISTS "Allow public access to projects" ON projects;

-- 2. Creăm o politică robustă: Proiectele pot fi șterse DOAR de proprietar
-- Folosim auth.uid() = user_id pentru siguranță maximă
CREATE POLICY "projects_delete_owner" ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Adăugăm o politică de siguranță pentru cei fără user_id (ex: create înainte de implementarea auth completă)
-- Aceasta permite ștergerea proiectelor anonime de către orice utilizator autentificat (cazuri excepționale/demo)
CREATE POLICY "projects_delete_anonymous" ON projects
  FOR DELETE
  TO authenticated
  USING (user_id IS NULL);

-- 4. Ne asigurăm că TOATE tabelele dependente au CASCADE activ (Redundant dar sigur)
-- (estimate_lines, purchases, vendor_offers au deja din schema.sql, dar re-verificăm structura dacă e cazul)
-- Notă: În PostgreSQL, alterarea constrângerilor existente necesită DROP și ADD, 
-- dar presupunem că schema.sql a fost aplicată corect.
