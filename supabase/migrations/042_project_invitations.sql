-- ============================================================
-- Migrare 042: Sistem Invitații Proiect
-- ============================================================

-- 1. Tabel pentru invitații pendinte
CREATE TABLE IF NOT EXISTS project_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'Editor' CHECK (role IN ('Manager', 'Editor', 'Viewer')),
    token TEXT UNIQUE NOT NULL,
    inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    UNIQUE(project_id, email)
);

-- 2. Activare RLS
ALTER TABLE project_invitations ENABLE ROW LEVEL SECURITY;

-- 3. Politici RLS pentru project_invitations
-- Doar proprietarul sau un Manager poate vedea/crea invitații
CREATE POLICY "invitations_owner_all" ON project_invitations
    FOR ALL TO authenticated
    USING (check_is_project_owner_v4(project_id))
    WITH CHECK (check_is_project_owner_v4(project_id));

-- Permitem utilizatorilor să își vadă propriile invitații (după email)
CREATE POLICY "invitations_view_self" ON project_invitations
    FOR SELECT TO authenticated
    USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 4. Indexuri
CREATE INDEX IF NOT EXISTS idx_project_invitations_token ON project_invitations(token);
CREATE INDEX IF NOT EXISTS idx_project_invitations_project_id ON project_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invitations_email ON project_invitations(email);
