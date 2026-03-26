// scripts/generate_catalog_seed.mjs
// Generează supabase/seed_catalog_full.sql din datele live Supabase
// Rulează cu: node scripts/generate_catalog_seed.mjs

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vwcwsxvmkxmcwjtlikcq.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // service role — set via environment variable

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const PAGE = 1000
let allRows = []
let from = 0

console.log('Fetching catalog_norms...')

while (true) {
  const { data, error } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price, is_active')
    .range(from, from + PAGE - 1)
    .order('id')

  if (error) { console.error('Error:', error); process.exit(1) }
  if (!data || data.length === 0) break

  allRows = allRows.concat(data)
  console.log(`  Fetched ${allRows.length} rows...`)
  if (data.length < PAGE) break
  from += PAGE
}

console.log(`Total: ${allRows.length} norme`)

const esc = (s) => s == null ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`
const num = (n) => n == null ? '0' : Number(n).toFixed(2)
const bool = (b) => b === false ? 'false' : 'true'

const lines = allRows.map(r =>
  `(${r.id}, ${esc(r.symbol)}, ${esc(r.name)}, ${esc(r.unit)}, ${esc(r.category)}, ${num(r.unit_price)}, ${bool(r.is_active)})`
)

const sql = `-- ============================================================
-- seed_catalog_full.sql — Backup catalog_norms
-- Generat automat la ${new Date().toISOString()}
-- Total: ${allRows.length} norme
-- ============================================================

-- Dezactivează temporarily constrângerile pentru import rapid
BEGIN;

INSERT INTO catalog_norms (id, symbol, name, unit, category, unit_price, is_active)
OVERRIDING SYSTEM VALUE
VALUES
${lines.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  symbol     = EXCLUDED.symbol,
  name       = EXCLUDED.name,
  unit       = EXCLUDED.unit,
  category   = EXCLUDED.category,
  unit_price = EXCLUDED.unit_price,
  is_active  = EXCLUDED.is_active;

-- Resetează secvența IDENTITY după import manual
SELECT setval(pg_get_serial_sequence('catalog_norms', 'id'), MAX(id)) FROM catalog_norms;

COMMIT;
`

const outPath = resolve(ROOT, 'supabase/seed_catalog_full.sql')
writeFileSync(outPath, sql, 'utf8')
console.log(`\nSalvat în: ${outPath}`)
console.log(`Linii SQL: ${allRows.length}`)
