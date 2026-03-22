# BuildingCalc — Fix-uri prioritare pentru Claude Code

## Context rapid
- Repo: https://github.com/automatorro/building-calculator
- Stack: Next.js 16 App Router, TypeScript, Supabase, Tailwind v4
- Supabase project: vwcwsxvmkxmcwjtlikcq.supabase.co
- catalog_norms: 27.188 norme importate (unit_price=0, editabil)

---

## BUG 1 — UUID trunchiat → 404 la deschiderea proiectului
**Fișier:** `app/projects/page.tsx`  
**Cauza:** Link-ul generează `/projects/d9724775` în loc de UUID complet  
**Fix:**
```typescript
// ÎNAINTE (greșit):
href={`/projects/${project.id.slice(0, 8)}`}
// sau
href={`/projects/${project.id.split('-')[0]}`}

// DUPĂ (corect):
href={`/projects/${project.id}`}
```

---

## BUG 2 — Query crash la deschiderea proiectului
**Fișier:** `app/projects/[id]/page.tsx` linia ~36  
**Cauza:** Coloana `date` nu există în tabelul `purchases`  
**Fix:**
```typescript
// ÎNAINTE:
.order('date', { ascending: false })

// DUPĂ:
.order('created_at', { ascending: false })
```

---

## BUG 3 — Tab switching complet broken (CRITIC)
**Fișier:** `components/ProjectClientContainer.tsx`  
**Cauza:** `AnimatePresence` / `motion.div` are `key` static → React nu re-renderizează la schimbarea tab-ului. Toate 5 tab-uri (Dashboard, Planificare, Deviz, Timeline, Achiziții) arată același conținut.

**Fix — găsește blocul AnimatePresence și adaugă `key={activeTab}`:**
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}  // ← ASTA LIPSEȘTE
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.15 }}
  >
    {activeTab === 'dashboard' && <ProjectDashboard {...props} />}
    {activeTab === 'planificare' && <EstimateEditor {...props} />}
    {activeTab === 'deviz' && <ProjectDevizView {...props} />}
    {activeTab === 'timeline' && <ProjectTimeline {...props} />}
    {activeTab === 'achizitii' && <div>Achiziții placeholder</div>}
  </motion.div>
</AnimatePresence>
```

---

## BUG 4 — Deviz-ul e mereu gol (ARHITECTURAL - cel mai important)
**Problema:** `estimate_lines` are 0 rânduri pentru că:
1. Codul încearcă să insereze cu `item_id` → `items` (schema veche, 5 rânduri)
2. Trebuie să insereze cu `catalog_norm_id` → `catalog_norms` (schema nouă, 27.188 norme)

**Schema actuală `estimate_lines`** (coloanele noi există deja în DB):
- `catalog_norm_id` (UUID, FK → catalog_norms.id)
- `name` (TEXT) 
- `code` (TEXT) — simbolul normei (ex: CA01A1)
- `unit` (TEXT)
- `unit_price` (NUMERIC)
- `category` (TEXT)
- `stage_name` (TEXT)
- `sort_order` (INT)
- `notes` (TEXT)
- `quantity` (NUMERIC)

**Fix în `components/CatalogFilter.tsx` — funcția de adăugare normă în deviz:**
```typescript
// Când userul dă click pe "Adaugă în deviz":
const addNormToDeviz = async (norm: CatalogNorm, projectId: string) => {
  const { error } = await supabase
    .from('estimate_lines')
    .insert({
      project_id: projectId,
      catalog_norm_id: norm.id,
      name: norm.name,
      code: norm.symbol,
      unit: norm.unit,
      unit_price: norm.unit_price ?? 0,
      category: norm.category,
      quantity: 1,
      sort_order: 0,
      custom_prices: {},
    })
  if (error) console.error('Error adding norm:', error)
}
```

**Fix în `components/EstimateEditor.tsx` și `components/ProjectDevizView.tsx` — citirea liniilor:**
```typescript
// La fetch estimate_lines, join cu catalog_norms pentru fallback:
const { data: lines } = await supabase
  .from('estimate_lines')
  .select('*, catalog_norms(symbol, name, unit)')
  .eq('project_id', projectId)

// La afișare:
const displayName = line.name || line.catalog_norms?.name || 'Articol fără nume'
const displayCode = line.code || line.catalog_norms?.symbol || ''
const displayUnit = line.unit || line.catalog_norms?.unit || ''
const displayPrice = line.unit_price ?? 0
const total = (line.quantity ?? 0) * displayPrice
```

**Fix în `components/CatalogFilter.tsx` — normele trebuie să fie clickabile:**
- Adaugă `cursor-pointer` și `onClick` pe cardul normei
- Deschide un modal cu detalii + buton "Adaugă în deviz"
- Pasează `projectId` ca prop din pagina de proiect

---

## BUG 5 — Câmpuri `settings` inconsistente
**Problema:** Codul folosește mixt `profit_margin`, `indirect_costs`, `profit`, `regie`  
**Fix:** Standardizează pretutindeni la:
```typescript
project.settings = {
  tva: 19,           // nu "TVA" sau "tax"
  regie: 10,         // nu "indirect_costs" sau "overhead"  
  profit: 5,         // nu "profit_margin"
  taxe_manopera: 0   // nu "labor_tax"
}
```

---

## TASK SUPLIMENTAR — Seed file backup catalog

Generează fișierul `supabase/seed_catalog_full.sql` cu toate cele 27.188 norme din catalog_norms. Folosește Supabase CLI:

```bash
# Opțiunea 1 - Supabase CLI dump (recomandat):
npx supabase db dump --data-only --table catalog_norms > supabase/seed_catalog_full.sql

# Opțiunea 2 - dacă CLI nu merge, prin API:
# Scrie un script Node.js care fetch-uiește toate normele din Supabase
# și generează INSERT statements în fișierul SQL
```

Fișierul trebuie commituit în repo astfel încât dacă baza de date e ștearsă,
rulezi `psql < supabase/seed_catalog_full.sql` și ai totul înapoi.

---

## Ordinea de execuție recomandată

1. **BUG 2** — 1 linie, zero risc (`.order('created_at')`)
2. **BUG 1** — 1 linie, zero risc (UUID complet)
3. **BUG 3** — `key={activeTab}` pe motion.div
4. **SEED** — generează `supabase/seed_catalog_full.sql`
5. **BUG 4** — fluxul complet de adăugare norme în deviz
6. **BUG 5** — standardizare settings

---

## Starea bazei de date (referință)

```
catalog_norms:    27.188 norme (88 cu prețuri, 27.100 fără)
projects:         3 proiecte test
estimate_lines:   0 rânduri (de populat cu BUG 4)
purchases:        tabel creat, 0 rânduri
profiles:         trigger creat, 0 rânduri
```

## Coloane cheie `catalog_norms`:
- id (UUID)
- symbol (TEXT, UNIQUE) — ex: "CA01A1"
- name (TEXT) — denumirea completă
- unit (TEXT) — UM: mc, mp, ml, kg, etc.
- category (TEXT) — constructii, instalatii, finisaje, etc.
- unit_price (NUMERIC, default 0) — **editabil de utilizator**
- deviz_reference_id (INTEGER) — ID-ul original din deviz.ro
