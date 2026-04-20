-- ============================================================
-- Migrare 036: Sistem Blog (Articole + Admin)
-- ============================================================

-- 1. Adăugare coloană is_admin în profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Creare tabel blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 3. Activare RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. Politici RLS pentru blog_posts
-- Publicul poate vedea doar postările publicate
CREATE POLICY "Public pot vedea articole publicate" 
  ON blog_posts FOR SELECT 
  USING (published = true);

-- Adminii pot face orice (CRUD)
CREATE POLICY "Admini au control total" 
  ON blog_posts FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 5. Trigger pentru înnoirea updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
