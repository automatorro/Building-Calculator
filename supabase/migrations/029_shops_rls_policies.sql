ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'shops' AND policyname = 'shops_insert_authenticated'
  ) THEN
    CREATE POLICY "shops_insert_authenticated" ON shops
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'shops' AND policyname = 'shops_update_authenticated'
  ) THEN
    CREATE POLICY "shops_update_authenticated" ON shops
      FOR UPDATE TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

