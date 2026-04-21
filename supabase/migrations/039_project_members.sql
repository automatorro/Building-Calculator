-- ============================================================
-- Migrare 039: Sistem Membri Echipă (Multi-user)
-- ============================================================

-- 1. Tabel pentru membrii proiectului
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role TEXT DEFAULT 'Editor' CHECK (role IN ('Manager', 'Editor', 'Viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_email)
);

-- 2. Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_email ON project_members(user_email);

-- 3. Activare RLS
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Politici pentru project_members
-- Proprietarul proiectului poate gestiona membrii
CREATE POLICY "project_members_owner_all" ON project_members
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()
    ));

-- Membrii pot vedea cine mai face parte din proiect
CREATE POLICY "project_members_view_self" ON project_members
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 4. Actualizare Politici RLS pentru PROJECTS (Acces partajat)
DROP POLICY IF EXISTS "projects_owner_all" ON projects;

CREATE POLICY "projects_shared_access" ON projects
    FOR ALL TO authenticated
    USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = id AND (user_id = auth.uid() OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
    );

-- 5. Actualizare Politici RLS pentru ESTIMATE_LINES (Acces partajat)
-- Notă: Eliminăm politicile vechi și centralizăm pe accesul prin proiect
DROP POLICY IF EXISTS "estimate_lines_owner_all" ON estimate_lines;
DROP POLICY IF EXISTS "estimate_lines_project_owner" ON estimate_lines;

CREATE POLICY "estimate_lines_shared_access" ON estimate_lines
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_id AND (
                p.user_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM project_members pm 
                    WHERE pm.project_id = p.id AND (pm.user_id = auth.uid() OR pm.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
                )
            )
        )
    );

-- 6. Actualizare Politici RLS pentru PURCHASES (Acces partajat)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "purchases_owner_all" ON purchases;

CREATE POLICY "purchases_shared_access" ON purchases
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_id AND (
                p.user_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM project_members pm 
                    WHERE pm.project_id = p.id AND (pm.user_id = auth.uid() OR pm.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
                )
            )
        )
    );
