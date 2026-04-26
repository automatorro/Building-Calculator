-- ============================================================
-- Migrare 005: Câmpuri Stripe + contor AI zilnic pe profiles
-- Rulează manual în Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id       TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id   TEXT,
  ADD COLUMN IF NOT EXISTS subscription_plan        TEXT    DEFAULT 'gratuit',
  ADD COLUMN IF NOT EXISTS subscription_status      TEXT    DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS subscription_period_end  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_end                TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_requests_today        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_requests_reset_at     DATE    DEFAULT CURRENT_DATE;

-- Index rapid pe ID-urile Stripe pentru webhook handler
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id
  ON profiles(stripe_subscription_id);

-- Funcție ajutătoare: resetează contorul AI dacă ziua s-a schimbat
CREATE OR REPLACE FUNCTION reset_ai_requests_if_new_day(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET
    ai_requests_today    = 0,
    ai_requests_reset_at = CURRENT_DATE
  WHERE id = profile_id
    AND ai_requests_reset_at < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
