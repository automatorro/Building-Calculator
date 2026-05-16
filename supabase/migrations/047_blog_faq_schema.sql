-- ============================================================
-- Migrare 047: Câmp faq_schema pe blog_posts
-- Stochează FAQ JSON-LD ca text pentru articole cu schema FAQ
-- ============================================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS faq_schema TEXT;
