/**
 * ============================================================
 * IMPORT NORME DEVIZ.RO → SUPABASE
 * Script pentru rulare din browser (DevTools Console)
 * pe pagina app.deviz.ro (unde sesiunea e activă)
 * ============================================================
 *
 * PAȘI:
 * 1. Rulează SQL-ul din supabase/migrations/004_catalog_norms_deviz_ref.sql
 * 2. Deschide app.deviz.ro în browser și loghează-te
 * 3. Deschide DevTools → Console (F12)
 * 4. Copiază și lipește tot acest script în consolă
 * 5. Apasă Enter → importul începe automat
 * 6. Când termină, rulează SQL-ul din 005_remove_import_policy.sql
 * ============================================================
 */

(async () => {

// ── Configurare ─────────────────────────────────────────────
const SUPA_URL  = 'https://vwcwsxvmkxmcwjtlikcq.supabase.co'
const ANON_KEY  = 'sb_publishable_1bY5YbwgR0EIUGzOUjWB2w_OlOyA5lL'
const AUTH      = '102884%2C10637110%2CN9MESAzVc1r6vNzr'
const TOTAL_PAGES = 450
const BATCH_SIZE  = 300   // inserăm câte 300 odată
const DELAY_MS    = 150   // pauză între cereri (ms)

// ── Mapare categorie din prefix simbol ──────────────────────
function getCategory(symbol) {
  const s = symbol.toUpperCase()
  if (/^TS/.test(s))                    return 'Terasamente'
  if (/^CF/.test(s))                    return 'Cofraje'
  if (/^CA/.test(s) || /^CB/.test(s))  return 'Beton și beton armat'
  if (/^CZ/.test(s) || /^CP/.test(s))  return 'Zidărie și prefabricate'
  if (/^CK/.test(s))                    return 'Materiale speciale'
  if (/^AC/.test(s))                    return 'Acoperișuri'
  if (/^IZ/.test(s))                    return 'Izolații'
  if (/^TF/.test(s))                    return 'Tencuieli și finisaje'
  if (/^VOP/.test(s) || /^VP/.test(s)) return 'Vopsitorii'
  if (/^PD/.test(s) || /^PAR/.test(s)) return 'Pardoseli'
  if (/^TP/.test(s) || /^TL/.test(s))  return 'Tâmplărie'
  if (/^IS/.test(s))                    return 'Instalații sanitare'
  if (/^IT/.test(s) || /^SV/.test(s))  return 'Instalații termice'
  if (/^IE/.test(s) || /^IC/.test(s) || /^IL/.test(s)) return 'Instalații electrice'
  if (/^SM/.test(s) || /^CM/.test(s))  return 'Structuri metalice'
  if (/^DD/.test(s) || /^DC/.test(s) || /^DA/.test(s) || /^DB/.test(s)) return 'Drumuri'
  if (/^RPDC/.test(s) || /^RPD/.test(s)) return 'Reparații drumuri'
  if (/^RP/.test(s))                    return 'Reparații'
  if (/^PL/.test(s) || /^PB/.test(s))  return 'Poduri'
  if (/^W/.test(s))                     return 'Instalații electrice speciale'
  if (/^SVJ/.test(s))                   return 'Structuri speciale'
  if (/^XA/.test(s) || /^YB/.test(s) || /^YC/.test(s)) return 'Ajustări prețuri'
  return 'Diverse'
}

// ── Normalizare UM ──────────────────────────────────────────
function normUnit(mu) {
  if (!mu) return 'buc'
  return mu.trim()
    .replace(/^1\s+/,'')
    .replace(/^un\s+/i,'')
    .substring(0, 20)
}

// ── Fetch o pagină din deviz.ro ─────────────────────────────
async function fetchPage(page) {
  const url = `https://app.deviz.ro/api/estimation-search-norms?searchString=&sortColumn=Symbol&sortDirection=asc&searchFilterParentType=all&searchFilterParentId=all&pageNo=${page}&authParams=${AUTH}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json._embedded?.SearchNorms || []
}

// ── Insert batch în Supabase ────────────────────────────────
async function insertBatch(norms) {
  const rows = norms.map(n => ({
    symbol:             n.Symbol.substring(0, 50),
    name:               n.Name.substring(0, 1000),
    unit:               normUnit(n.MU),
    category:           getCategory(n.Symbol),
    unit_price:         0,
    is_active:          true,
    deviz_reference_id: n.ReferenceId,
  }))

  const res = await fetch(`${SUPA_URL}/rest/v1/catalog_norms`, {
    method: 'POST',
    headers: {
      'apikey':         ANON_KEY,
      'Authorization':  `Bearer ${ANON_KEY}`,
      'Content-Type':   'application/json',
      'Prefer':         'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase ${res.status}: ${err.substring(0, 200)}`)
  }
  return rows.length
}

// ── Main ────────────────────────────────────────────────────
console.log('%c╔══════════════════════════════════════╗', 'color: #E8500A; font-weight:bold')
console.log('%c║  IMPORT NORME DEVIZ.RO → SUPABASE   ║', 'color: #E8500A; font-weight:bold')
console.log('%c╚══════════════════════════════════════╝', 'color: #E8500A; font-weight:bold')
console.log(`Target: ${SUPA_URL}`)
console.log(`Pages: 1 → ${TOTAL_PAGES} | Batch: ${BATCH_SIZE} | Delay: ${DELAY_MS}ms`)
console.log('─────────────────────────────────────────')

let buffer = []
let totalInserted = 0
let totalSkipped = 0
let failedPages = []
let lastReferenceId = null
const startTime = Date.now()

for (let page = 1; page <= TOTAL_PAGES; page++) {
  try {
    const norms = await fetchPage(page)

    // Detectăm ultima pagină (server returnează ultima pagina dacă depășim)
    if (norms.length > 0 && norms[0].ReferenceId === lastReferenceId) {
      console.log(`%c✅ Am ajuns la final la pagina ${page} — catalog complet!`, 'color:green')
      break
    }
    lastReferenceId = norms[0]?.ReferenceId

    if (norms.length === 0) {
      console.log(`⚠️ Pagina ${page} goală — stop.`)
      break
    }

    buffer.push(...norms)

    // Progress la fiecare 25 pagini
    if (page % 25 === 0 || page === 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
      const pct = ((page / TOTAL_PAGES) * 100).toFixed(1)
      const eta = page > 1 ? Math.round((TOTAL_PAGES - page) * (Date.now() - startTime) / page / 1000) : '?'
      console.log(`📄 Pag ${page}/${TOTAL_PAGES} (${pct}%) | Buffer: ${buffer.length} | Insertat: ${totalInserted} | ${elapsed}s | ETA: ${eta}s`)
    }

    // Insert când buffer-ul e plin
    if (buffer.length >= BATCH_SIZE) {
      try {
        const inserted = await insertBatch(buffer)
        totalInserted += inserted
        console.log(`%c💾 Inserez ${inserted} norme → total: ${totalInserted}`, 'color: #2A7D4F')
        buffer = []
      } catch (e) {
        console.error(`❌ Insert eșuat: ${e.message}`)
        totalSkipped += buffer.length
        buffer = []
      }
    }

    await new Promise(r => setTimeout(r, DELAY_MS))

  } catch (err) {
    console.error(`❌ Pagina ${page}: ${err.message}`)
    failedPages.push(page)
    await new Promise(r => setTimeout(r, 1000))
  }
}

// Insert restul din buffer
if (buffer.length > 0) {
  try {
    const inserted = await insertBatch(buffer)
    totalInserted += inserted
    console.log(`%c💾 Ultimele ${inserted} norme inserate.`, 'color: #2A7D4F')
  } catch (e) {
    console.error(`❌ Insert final eșuat: ${e.message}`)
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
console.log('%c╔══════════════════════════════════════╗', 'color: #E8500A; font-weight:bold')
console.log('%c║  IMPORT FINALIZAT!                   ║', 'color: #E8500A; font-weight:bold')
console.log('%c╚══════════════════════════════════════╝', 'color: #E8500A; font-weight:bold')
console.log(`%c✅ Total inserate: ${totalInserted}`, 'color:green; font-size:14px; font-weight:bold')
if (totalSkipped > 0) console.log(`⚠️  Omise: ${totalSkipped}`)
if (failedPages.length > 0) console.log(`⚠️  Pagini eșuate: ${failedPages.join(', ')} — rulează din nou scriptul`)
console.log(`⏱️  Timp total: ${elapsed}s`)
console.log('')
console.log('%c⚡ ACUM rulează SQL-ul din 005_remove_import_policy.sql în Supabase Dashboard!', 'color: orange; font-weight:bold')

})()
