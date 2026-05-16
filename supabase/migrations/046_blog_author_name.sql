-- ============================================================
-- Migrare 046: Câmp author_name pe blog_posts
-- Permite setarea manuală a numelui autorului, indiferent de profil
-- ============================================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_name TEXT;
