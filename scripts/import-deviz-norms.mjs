/**
 * ============================================================
 * IMPORT NORME DEVIZ.RO → SUPABASE catalog_norms
 * ============================================================
 * Extrage toate cele ~44.942 norme din API-ul deviz.ro și
 * le importă în tabela catalog_norms din Supabase.
 *
 * Rulare:
 *   node scripts/import-deviz-norms.mjs
 *
 * Prerequisite:
 *   node >= 18 (fetch nativ)
 *   npm install @supabase/supabase-js
 * ============================================================
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// ── Configurare ─────────────────────────────────────────────
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY // service role

// authParams deviz.ro — actualizează dacă expiră sesiunea
const AUTH_PARAMS   = process.env.DEVIZ_AUTH_PARAMS

const TOTAL_PAGES   = 450   // numărul de pagini (actualizat după audit)
const BATCH_SIZE    = 500   // câte norme inserăm odată în Supabase
const DELAY_MS      = 200   // pauză între request-uri (politicoasă față de server)

// ── Client Supabase ─────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Mapare categorie din prefix simbol ──────────────────────
function getCategory(symbol) {
  const s = symbol.toUpperCase()

  // Terasamente
  if (s.startsWith('TSA') || s.startsWith('TSB') || s.startsWith('TSC') ||
      s.startsWith('TSD') || s.startsWith('TSE') || s.startsWith('TSF') ||
      s.startsWith('TSG') || s.startsWith('TSH') || s.startsWith('TSI') ||
      s.startsWith('TSJ')) return 'Terasamente'

  // Cofraje
  if (s.startsWith('CF') || s.startsWith('CF.') || s.startsWith('CF '))
    return 'Cofraje'

  // Beton armat / simplu
  if (s.startsWith('CA') || s.startsWith('CB') || s.startsWith('CC'))
    return 'Beton și beton armat'

  // Zidărie, elemente prefabricate
  if (s.startsWith('CZ') || s.startsWith('CP'))
    return 'Zidărie și prefabricate'

  // Acoperișuri
  if (s.startsWith('AC') || s.startsWith('ACD') || s.startsWith('ACR'))
    return 'Acoperișuri'

  // Izolații
  if (s.startsWith('IZ') || s.startsWith('IZF') || s.startsWith('IZT'))
    return 'Izolații'

  // Tencuieli și finisaje
  if (s.startsWith('TF') || s.startsWith('TF.') || s.startsWith('VOP') ||
      s.startsWith('VP') || s.startsWith('FIN'))
    return 'Tencuieli și finisaje'

  // Pardoseli
  if (s.startsWith('PD') || s.startsWith('PAR'))
    return 'Pardoseli'

  // Tâmplărie
  if (s.startsWith('TP') || s.startsWith('TMP') || s.startsWith('TL'))
    return 'Tâmplărie'

  // Instalații sanitare
  if (s.startsWith('IS') || s.startsWith('IS.'))
    return 'Instalații sanitare'

  // Instalații termice / HVAC
  if (s.startsWith('IT') || s.startsWith('IV') || s.startsWith('SV'))
    return 'Instalații termice'

  // Instalații electrice
  if (s.startsWith('IE') || s.startsWith('IC') || s.startsWith('IL'))
    return 'Instalații electrice'

  // Structuri metalice
  if (s.startsWith('SM') || s.startsWith('CM') || s.startsWith('SF'))
    return 'Structuri metalice'

  // Drumuri și sistematizare
  if (s.startsWith('DD') || s.startsWith('DC') || s.startsWith('DS') ||
      s.startsWith('DB') || s.startsWith('DA') || s.startsWith('RPDC') ||
      s.startsWith('RPD'))
    return 'Drumuri și sistematizare'

  // Poduri și lucrări speciale
  if (s.startsWith('PL') || s.startsWith('PB') || s.startsWith('PT'))
    return 'Poduri'

  // Reparații
  if (s.startsWith('RP'))
    return 'Reparații'

  // Instalații electrice speciale (revizii, relee)
  if (s.startsWith('W'))
    return 'Instalații electrice speciale'

  // Ajustări de prețuri (norme auxiliare)
  if (s.startsWith('XA') || s.startsWith('YB') || s.startsWith('YC'))
    return 'Ajustări prețuri'

  // TSJ - Terasamente speciale
  if (s.startsWith('TSJ'))
    return 'Terasamente'

  // SVJ - Structuri ventilate/speciale
  if (s.startsWith('SVJ') || s.startsWith('SVG'))
    return 'Structuri speciale'

  // CK - Materiale speciale/ceramice
  if (s.startsWith('CK'))
    return 'Materiale speciale'

  return 'Diverse'
}

// ── Normalizare UM ──────────────────────────────────────────
function normalizeUnit(mu) {
  if (!mu) return 'buc'
  const u = mu.trim()
    .replace(/\s+/g, ' ')
    .replace(/^1\s*/, '')  // elimină "1" din "1buc"
    .replace(/^un\s+/i, '') // elimină "un " din "un echipament"
    .toLowerCase()
  // Standardizare
  const map = {
    'mc': 'mc', 'm3': 'mc',
    'mp': 'mp', 'm2': 'mp',
    'ml': 'ml', 'm': 'm',
    'kg': 'kg', 't': 't',
    'buc': 'buc', 'bucata': 'buc',
    'set': 'set', 'pereche': 'per',
    'lei': 'lei', 'mii lei': 'mii lei',
  }
  return map[u] || mu.trim()
}

// ── Fetch o pagină ──────────────────────────────────────────
async function fetchPage(pageNo) {
  const url = `https://app.deviz.ro/api/estimation-search-norms?searchString=&sortColumn=Symbol&sortDirection=asc&searchFilterParentType=all&searchFilterParentId=all&pageNo=${pageNo}&authParams=${AUTH_PARAMS}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} la pagina ${pageNo}`)

  const json = await res.json()
  return json._embedded?.SearchNorms || []
}

// ── Insert batch în Supabase ────────────────────────────────
async function insertBatch(norms) {
  const rows = norms.map(n => ({
    symbol:             n.Symbol,
    name:               n.Name,
    unit:               normalizeUnit(n.MU),
    category:           getCategory(n.Symbol),
    unit_price:         0,  // utilizatorul va introduce prețul
    is_active:          true,
    deviz_reference_id: n.ReferenceId,
  }))

  const { error, count } = await supabase
    .from('catalog_norms')
    .upsert(rows, {
      onConflict: 'symbol',
      ignoreDuplicates: false,
      count: 'exact',
    })

  if (error) {
    console.error('  ❌ Eroare insert:', error.message)
    return 0
  }
  return rows.length
}

// ── Adaugă coloana deviz_reference_id dacă nu există ───────
async function ensureColumn() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE catalog_norms ADD COLUMN IF NOT EXISTS deviz_reference_id INTEGER;`
  })
  // ignorăm eroarea dacă funcția nu există — coloana se poate adăuga manual
  if (error && !error.message.includes('already exists')) {
    console.log('  ℹ️  Adaugă manual coloana: ALTER TABLE catalog_norms ADD COLUMN IF NOT EXISTS deviz_reference_id INTEGER;')
  }
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════╗')
  console.log('║   IMPORT NORME DEVIZ.RO → SUPABASE           ║')
  console.log('╚══════════════════════════════════════════════╝')
  console.log(`  Target: ${SUPABASE_URL}`)
  console.log(`  Pages: 1 → ${TOTAL_PAGES}`)
  console.log(`  Estimated norms: ~44.942\n`)

  await ensureColumn()

  let allNorms = []
  let totalInserted = 0
  let pagesFailed = []

  const startTime = Date.now()

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    try {
      const norms = await fetchPage(page)

      if (norms.length === 0) {
        console.log(`  ⚠️  Pagina ${page} goală — probabil am depășit catalogul.`)
        break
      }

      allNorms.push(...norms)

      // Progress log
      if (page % 10 === 0 || page === 1) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
        const pct = ((page / TOTAL_PAGES) * 100).toFixed(1)
        console.log(`  📄 Pagina ${page}/${TOTAL_PAGES} (${pct}%) | Colectate: ${allNorms.length} | ${elapsed}s`)
      }

      // Insert când buffer-ul e plin
      if (allNorms.length >= BATCH_SIZE) {
        process.stdout.write(`  💾 Inserez ${allNorms.length} norme... `)
        const inserted = await insertBatch(allNorms)
        totalInserted += inserted
        console.log(`✅ ${inserted} inserate (total: ${totalInserted})`)
        allNorms = []
      }

      // Pauză politicoasă
      await new Promise(r => setTimeout(r, DELAY_MS))

    } catch (err) {
      console.error(`  ❌ Pagina ${page} eșuată: ${err.message}`)
      pagesFailed.push(page)
      // Continuăm cu pagina următoare
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  // Inserăm restul
  if (allNorms.length > 0) {
    process.stdout.write(`  💾 Inserez ultimele ${allNorms.length} norme... `)
    const inserted = await insertBatch(allNorms)
    totalInserted += inserted
    console.log(`✅ ${inserted} inserate`)
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)

  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║   IMPORT FINALIZAT                           ║')
  console.log('╚══════════════════════════════════════════════╝')
  console.log(`  ✅ Total inserate: ${totalInserted}`)
  console.log(`  ⏱️  Timp total: ${elapsed}s`)
  if (pagesFailed.length > 0) {
    console.log(`  ⚠️  Pagini eșuate: ${pagesFailed.join(', ')}`)
    console.log(`      Rulează din nou scriptul — UPSERT ignoră duplicatele.`)
  }
  console.log('\n  ℹ️  Prețurile sunt 0 — utilizatorii le vor introduce manual.')
  console.log('  ℹ️  Catalogul e disponibil la /catalog în aplicație.\n')
}

main().catch(console.error)
