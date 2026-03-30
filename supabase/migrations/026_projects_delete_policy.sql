-- Allow authenticated users to DELETE projects (required for persistent deletion from UI)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'projects'
      AND policyname = 'projects_delete_authenticated'
  ) THEN
    CREATE POLICY "projects_delete_authenticated" ON projects
      FOR DELETE TO authenticated
      USING (true);
  END IF;
END $$;

