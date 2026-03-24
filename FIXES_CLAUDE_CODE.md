# BuildingCalc — Fix-uri prioritare pentru Claude Code

## Context rapid
- Repo: https://github.com/automatorro/building-calculator
- Stack: Next.js 16 App Router, TypeScript, Supabase, Tailwind v4
- Supabase project: vwcwsxvmkxmcwjtlikcq.supabase.co
- catalog_norms: 27.188 norme importate (unit_price=0, editabil)

---

## BUG 1 — UUID trunchiat → 404 la deschiderea proiectului
**Fișier:** `app/projects/page.tsx`
**Fix:**
```typescript
// ÎNAINTE (greșit):
href={`/projects/${project.id.slice(0, 8)}`}
// DUPĂ (corect):
href={`/projects/${project.id}`}
```

---

## BUG 2 — Query crash la deschiderea proiectului
**Fișier:** `app/projects/[id]/page.tsx` linia ~36
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
**Fix — adaugă `key={activeTab}` pe motion.div:**
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
    ...
  </motion.div>
</AnimatePresence>
```

---

## BUG 4 — Deviz-ul e mereu gol (ARHITECTURAL)
**Problema:** `estimate_lines` are 0 rânduri — codul încearcă `item_id` (schema veche, 5 rânduri) în loc de `catalog_norm_id` (schema nouă, 27.188 norme).

**Fix în `components/CatalogFilter.tsx`:**
```typescript
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
}
```

**Fix în `EstimateEditor.tsx` și `ProjectDevizView.tsx`:**
```typescript
const { data: lines } = await supabase
  .from('estimate_lines')
  .select('*, catalog_norms(symbol, name, unit)')
  .eq('project_id', projectId)

const displayName = line.name || line.catalog_norms?.name || 'Articol fără nume'
const displayCode = line.code || line.catalog_norms?.symbol || ''
const displayPrice = line.unit_price ?? 0
```

---

## BUG 5 — Câmpuri `settings` inconsistente + TVA GREȘIT
**Problema:** Codul folosește mixt `profit_margin`, `indirect_costs` etc. TVA era 19% — GREȘIT.
**Fix:** Standardizează pretutindeni la:
```typescript
project.settings = {
  tva: 21,           // NU 19! (Legea 141/2025, din 1 aug 2025)
  regie: 10,         // nu "indirect_costs" sau "overhead"
  profit: 5,         // nu "profit_margin"
  taxe_manopera: 0   // nu "labor_tax"
}
```

**TVA România actualizat:**
- Standard: **21%** (din 1 august 2025)
- Redus: **11%** (înlocuiește fostele 5% și 9%)
- Tranzitoriu: **9%** doar pentru locuințe cu avans plătit înainte de 1 aug 2025, valabil până 1 aug 2026

---

## TASK SUPLIMENTAR — Seed file backup catalog

```bash
npx supabase db dump --data-only --table catalog_norms > supabase/seed_catalog_full.sql
```

---

## Ordinea de execuție

1. **BUG 2** — 1 linie, zero risc
2. **BUG 1** — 1 linie, zero risc
3. **BUG 3** — `key={activeTab}`
4. **BUG 5** — TVA 21% + standardizare settings
5. **BUG 4** — flux complet estimate_lines (cel mai complex)
6. **SEED** — backup catalog
