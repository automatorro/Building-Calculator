-- ============================================================
-- Migrare 005: Câmpuri Stripe + contor AI zilnic pe profiles
--              + trigger limită 1 proiect pe planul Gratuit
-- Rulează manual în Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Coloane noi pe profiles ─────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id       TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id   TEXT,
  ADD COLUMN IF NOT EXISTS subscription_plan        TEXT    DEFAULT 'gratuit',
  ADD COLUMN IF NOT EXISTS subscription_status      TEXT    DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS subscription_period_end  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_end                TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_requests_today        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_requests_reset_at     DATE    DEFAULT CURRENT_DATE;

-- ── 2. Indecși pentru webhook handler ───────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id
  ON profiles(stripe_subscription_id);

-- ── 3. Trigger: limitează la 1 proiect pe planul Gratuit ────
-- Blochează INSERT indiferent de unde vine cererea (UI, API, direct SQL)
CREATE OR REPLACE FUNCTION enforce_project_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan       TEXT;
  existing_count  INTEGER;
BEGIN
  -- Citim planul curent al utilizatorului
  SELECT COALESCE(subscription_plan, 'gratuit')
    INTO user_plan
    FROM profiles
   WHERE id = NEW.user_id;

  -- Doar planul Gratuit are limită de proiecte
  IF user_plan = 'gratuit' THEN
    SELECT COUNT(*)
      INTO existing_count
      FROM projects
     WHERE user_id = NEW.user_id;

    IF existing_count >= 1 THEN
      RAISE EXCEPTION
        'PLAN_LIMIT: Planul Gratuit permite un singur proiect activ. Fă upgrade la Constructor pentru proiecte nelimitate.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_project_limit ON projects;
CREATE TRIGGER trg_enforce_project_limit
  BEFORE INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION enforce_project_limit();
