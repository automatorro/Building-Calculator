-- ============================================================
-- Migrare 040: Reparare Recursivitate RLS & Unificare Permisiuni
-- ============================================================

-- 1. Funcție SECURITY DEFINER pentru a verifica apartenența la proiect
-- Aceasta rupe ciclul infinit de recursivitate RLS
CREATE OR REPLACE FUNCTION check_project_access_v3(p_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    u_id UUID := auth.uid();
    u_email TEXT := auth.jwt() ->> 'email';
BEGIN
    RETURN EXISTS (
        -- Verificăm dacă este proprietar
        SELECT 1 FROM projects WHERE id = p_id AND user_id = u_id
        UNION ALL
        -- Verificăm dacă este membru invitat
        SELECT 1 FROM project_members WHERE project_id = p_id AND (user_id = u_id OR user_email = u_email)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Actualizare Politici PROJECTS
DROP POLICY IF EXISTS "projects_shared_access" ON projects;
DROP POLICY IF EXISTS "projects_owner_all" ON projects;

CREATE POLICY "projects_full_access_v2" ON projects
    FOR ALL TO authenticated
    USING (check_project_access_v3(id))
    WITH CHECK (check_project_access_v3(id));

-- 3. Actualizare Politici PROJECT_MEMBERS
DROP POLICY IF EXISTS "project_members_owner_all" ON project_members;
DROP POLICY IF EXISTS "project_members_view_self" ON project_members;

CREATE POLICY "project_members_full_access_v2" ON project_members
    FOR ALL TO authenticated
    USING (check_project_access_v3(project_id))
    WITH CHECK (check_project_access_v3(project_id));

-- 4. Actualizare Politici ESTIMATE_LINES
DROP POLICY IF EXISTS "estimate_lines_shared_access" ON estimate_lines;

CREATE POLICY "estimate_lines_full_access_v2" ON estimate_lines
    FOR ALL TO authenticated
    USING (check_project_access_v3(project_id))
    WITH CHECK (check_project_access_v3(project_id));

-- 5. Actualizare Politici PURCHASES
DROP POLICY IF EXISTS "purchases_shared_access" ON purchases;

CREATE POLICY "purchases_full_access_v2" ON purchases
    FOR ALL TO authenticated
    USING (check_project_access_v3(project_id))
    WITH CHECK (check_project_access_v3(project_id));

-- 6. Actualizare Politici SHOPS (Magazine/Furnizori)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'shops') THEN
        DROP POLICY IF EXISTS "shops_shared_access" ON shops;
        DROP POLICY IF EXISTS "shops_insert_authenticated" ON shops;
        DROP POLICY IF EXISTS "shops_update_authenticated" ON shops;
        
        CREATE POLICY "shops_full_access_v2" ON shops
            FOR ALL TO authenticated
            USING (true) -- Magazinele sunt de obicei vizibile global, dar putem restrânge dacă e nevoie
            WITH CHECK (true);
    END IF;
END $$;

-- 7. Actualizare Politici VENDOR_OFFERS (doar dacă există)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'vendor_offers') THEN
        DROP POLICY IF EXISTS "vendor_offers_shared_access" ON vendor_offers;
        DROP POLICY IF EXISTS "vendor_offers_full_access_v2" ON vendor_offers;

        CREATE POLICY "vendor_offers_full_access_v2" ON vendor_offers
            FOR ALL TO authenticated
            USING (check_project_access_v3(project_id))
            WITH CHECK (check_project_access_v3(project_id));
    END IF;
END $$;

