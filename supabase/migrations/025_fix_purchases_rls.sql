-- Fix RLS policy for purchases table to explicitly allow INSERTs
DROP POLICY IF EXISTS "Allow public access to purchases" ON purchases;

CREATE POLICY "Allow public access to purchases" ON purchases
    FOR ALL
    USING (true)
    WITH CHECK (true);
