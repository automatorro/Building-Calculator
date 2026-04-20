-- ============================================================
-- Migrare 037: Configurare Storage pentru Blog
-- ============================================================

-- 1. Creare bucket blog-images dacă nu există
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Eliminare politici vechi dacă există (pentru a evita erori la re-rulare)
DROP POLICY IF EXISTS "Public pot vedea pozele din blog" ON storage.objects;
DROP POLICY IF EXISTS "Adminii pot incarca poze in blog" ON storage.objects;
DROP POLICY IF EXISTS "Adminii pot sterge poze din blog" ON storage.objects;

-- 3. Politică: Acces public la vizualizare
CREATE POLICY "Public pot vedea pozele din blog"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- 4. Politică: Încărcare (doar admini)
CREATE POLICY "Adminii pot incarca poze in blog"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- 5. Politică: Ștergere (doar admini)
CREATE POLICY "Adminii pot sterge poze din blog"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);
