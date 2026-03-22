#!/usr/bin/env node
/**
 * BuildingCalc — Generator seed catalog_norms
 * Rulează din rădăcina repo-ului:
 *   node generate_seed.js
 * 
 * Generează: supabase/seed_catalog_full.sql
 * Necesită: NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY în .env.local
 */

const fs = require('fs')
const path = require('path')

// Load env
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
// Service role key bypass-ează RLS — necesar pentru a citi toate normele
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL'
  return "'" + String(str).replace(/'/g, "''") + "'"
}

async function fetchPage(from, to) {
  const url = `${SUPABASE_URL}/rest/v1/catalog_norms?select=symbol,name,unit,category,unit_price,deviz_reference_id&order=category,symbol&offset=${from}&limit=${to - from + 1}`
  const resp = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Range': `${from}-${to}`,
      'Range-Unit': 'items',
      'Prefer': 'count=exact'
    }
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`)
  const total = parseInt(resp.headers.get('content-range')?.split('/')[1] || '0')
  return { data: await resp.json(), total }
}

async function main() {
  console.log('Fetching catalog from Supabase...')
  
  const PAGE_SIZE = 1000
  let allRows = []
  let total = 0
  let from = 0
  
  // First request to get total count
  const first = await fetchPage(0, PAGE_SIZE - 1)
  allRows = allRows.concat(first.data)
  total = first.total
  from = PAGE_SIZE
  
  console.log(`Total norms: ${total}`)
  
  // Fetch remaining pages
  while (from < total) {
    const to = Math.min(from + PAGE_SIZE - 1, total - 1)
    process.stdout.write(`\rFetching ${from}-${to} of ${total}...`)
    const page = await fetchPage(from, to)
    allRows = allRows.concat(page.data)
    from += PAGE_SIZE
  }
  
  console.log(`\nFetched ${allRows.length} norms. Generating SQL...`)
  
  // Generate SQL
  const outputPath = path.join('supabase', 'seed_catalog_full.sql')
  const stream = fs.createWriteStream(outputPath)
  
  stream.write(`-- BuildingCalc catalog_norms seed\n`)
  stream.write(`-- Generated: ${new Date().toISOString()}\n`)
  stream.write(`-- Total: ${allRows.length} norms\n`)
  stream.write(`-- Restore: psql $DATABASE_URL < supabase/seed_catalog_full.sql\n\n`)
  stream.write(`TRUNCATE catalog_norms CASCADE;\n\n`)
  
  // Write in batches of 500
  const BATCH = 500
  for (let i = 0; i < allRows.length; i += BATCH) {
    const batch = allRows.slice(i, i + BATCH)
    stream.write(`INSERT INTO catalog_norms (symbol, name, unit, category, unit_price, deviz_reference_id) VALUES\n`)
    const values = batch.map(r => 
      `  (${escapeSQL(r.symbol)}, ${escapeSQL(r.name)}, ${escapeSQL(r.unit)}, ${escapeSQL(r.category)}, ${r.unit_price ?? 0}, ${r.deviz_reference_id ?? 'NULL'})`
    )
    stream.write(values.join(',\n'))
    stream.write(`\nON CONFLICT (symbol) DO NOTHING;\n\n`)
    
    if ((i / BATCH) % 10 === 0) process.stdout.write(`\rWriting batch ${Math.floor(i/BATCH)+1}/${Math.ceil(allRows.length/BATCH)}...`)
  }
  
  stream.end()
  console.log(`\nDone! Saved to ${outputPath}`)
  console.log(`File size: ~${Math.round(allRows.length * 150 / 1024)} KB`)
}

main().catch(console.error)
