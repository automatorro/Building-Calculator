-- ============================================================
-- Migrare 041: Reparare Definitivă RLS & Eliminare Recursivitate
-- ============================================================

-- 1. Funcție pentru verificarea proprietarului (DOAR tabelul projects)
-- SECURITY DEFINER pentru a asigura bypass RLS intern
CREATE OR REPLACE FUNCTION check_is_project_owner_v4(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM projects WHERE id = p_id AND (user_id = auth.uid() OR user_id IS NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Funcție pentru verificarea membrului (DOAR tabelul project_members)
CREATE OR REPLACE FUNCTION check_is_project_member_v4(p_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    u_email TEXT := auth.jwt() ->> 'email';
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = p_id 
        AND (user_id = auth.uid() OR (u_email IS NOT NULL AND user_email = u_email))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Funcție unificată pentru restul tabelelor (Fără auto-recursivitate)
CREATE OR REPLACE FUNCTION check_project_access_v4(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN check_is_project_owner_v4(p_id) OR check_is_project_member_v4(p_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Actualizare Politici PROJECTS (Ruptură de ciclu)
DROP POLICY IF EXISTS "projects_full_access_v2" ON projects;
CREATE POLICY "projects_full_access_v3" ON projects
    FOR ALL TO authenticated
    USING ( (user_id = auth.uid() OR user_id IS NULL) OR check_is_project_member_v4(id) )
    WITH CHECK ( (user_id = auth.uid() OR user_id IS NULL) OR check_is_project_member_v4(id) );

-- 5. Actualizare Politici PROJECT_MEMBERS (Ruptură de ciclu)
DROP POLICY IF EXISTS "project_members_full_access_v2" ON project_members;
CREATE POLICY "project_members_full_access_v3" ON project_members
    FOR ALL TO authenticated
    USING ( check_is_project_owner_v4(project_id) OR user_id = auth.uid() OR user_email = (auth.jwt() ->> 'email') )
    WITH CHECK ( check_is_project_owner_v4(project_id) OR user_id = auth.uid() OR user_email = (auth.jwt() ->> 'email') );

-- 6. Actualizare Politici pentru celelalte tabele (Folosesc v4 unificat)
-- ESTIMATE_LINES
DROP POLICY IF EXISTS "estimate_lines_full_access_v2" ON estimate_lines;
CREATE POLICY "estimate_lines_full_access_v3" ON estimate_lines
    FOR ALL TO authenticated
    USING (check_project_access_v4(project_id))
    WITH CHECK (check_project_access_v4(project_id));

-- PURCHASES
DROP POLICY IF EXISTS "purchases_full_access_v2" ON purchases;
CREATE POLICY "purchases_full_access_v3" ON purchases
    FOR ALL TO authenticated
    USING (check_project_access_v4(project_id))
    WITH CHECK (check_project_access_v4(project_id));

-- VENDOR_OFFERS (dacă există)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'vendor_offers') THEN
        DROP POLICY IF EXISTS "vendor_offers_full_access_v2" ON vendor_offers;
        CREATE POLICY "vendor_offers_full_access_v3" ON vendor_offers
            FOR ALL TO authenticated
            USING (check_project_access_v4(project_id))
            WITH CHECK (check_project_access_v4(project_id));
    END IF;
END $$;
