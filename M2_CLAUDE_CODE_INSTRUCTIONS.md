# INSTRUCȚIUNI CLAUDE CODE — Milestone M2 (Catalog real funcțional)
# ═══════════════════════════════════════════════════════════════════
# CITEȘTE COMPLET ÎNAINTE DE ORICE ACȚIUNE.
# Un task per commit. Nu combina. Nu inventa.
# ═══════════════════════════════════════════════════════════════════

## CONTEXT RAPID

Scopul M2: Catalogul să citească din `catalog_norms` (27.260 norme reale)
în loc de `items` / `categories` / `normatives` (6 rânduri demo).

Fișierele afectate: EXACT 3, nimic altceva.
DB: NU se modifică. Nicio migrare SQL necesară — tabelele există deja.

---

## PASUL 0 — Citire obligatorie ÎNAINTE de orice modificare

```bash
cat app/catalog/page.tsx
cat components/CatalogFilter.tsx
cat app/catalog/item/\[id\]/page.tsx
```

Confirmă că:
- `catalog/page.tsx` face query pe `items`, `categories`, `normatives` → va fi înlocuit
- `CatalogFilter.tsx` folosește interfața `Item` cu câmpurile `code`, `um` → va fi înlocuit
- `catalog/item/[id]/page.tsx` face query pe `items` și `resources` → va fi înlocuit

Dacă oricare fișier NU există sau are o structură complet diferită față de ce
e descris mai jos → OPREȘTE-TE și raportează diferența. Nu continua.

---

## TASK M2.page — Înlocuire app/catalog/page.tsx

### Ce face fișierul NOU:
- Query pe `catalog_norms` cu câmpurile: `id, symbol, name, unit, category, unit_price`
- Filtrează `is_active = true`, ordonează după `category` și `symbol`
- Limitează la 2000 rânduri (performanță)
- Extrage categoriile unice din norme (nu mai are nevoie de tabela `categories`)
- Extrage prefixele normative unice din `symbol` (nu mai are nevoie de `normatives`)
- Pasează `initialNorms` (nu `initialItems`) către `<CatalogFilter />`

### Înlocuiește complet `app/catalog/page.tsx` cu:

```typescript
// app/catalog/page.tsx
import { createClient } from '@/utils/supabase/server'
import CatalogFilter from '@/components/CatalogFilter'

export const dynamic = 'force-dynamic'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const projectId =
    typeof resolvedParams.projectId === 'string' ? resolvedParams.projectId : null

  const { data: norms, error: normsError } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price')
    .eq('is_active', true)
    .order('category')
    .order('symbol')
    .limit(2000)

  const categories = [...new Set(norms?.map((n) => n.category) || [])].sort()

  const normativePrefixes = [
    ...new Set(
      norms
        ?.map((n) => {
          const match = n.symbol.match(/^[A-Za-z]+/)
          return match ? match[0].substring(0, 4).toUpperCase() : null
        })
        .filter(Boolean) || []
    ),
  ].sort()

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
          Catalog de Norme & Devize
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          {norms?.length.toLocaleString('ro-RO') || '0'} norme tehnice pentru
          construcții. Alege o normă pentru a o adăuga în devizul proiectului.
        </p>
      </header>

      {normsError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
          <p className="font-bold">Eroare la conectarea cu baza de date:</p>
          <p>{normsError.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">
              Categorii
            </h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300 capitalize"
                >
                  <span className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
                  {cat}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">
              Indicatoare
            </h2>
            <div className="flex flex-wrap gap-2">
              {normativePrefixes.slice(0, 30).map((prefix) => (
                <span
                  key={prefix}
                  className="px-2 py-1 bg-primary/5 text-primary border border-primary/20 rounded text-xs font-mono font-bold"
                >
                  {prefix}
                </span>
              ))}
              {normativePrefixes.length > 30 && (
                <span className="text-xs text-slate-400 self-center">
                  +{normativePrefixes.length - 30} altele
                </span>
              )}
            </div>
          </section>
        </div>

        <CatalogFilter
          initialNorms={(norms as any) || []}
          projectId={projectId}
        />
      </div>
    </main>
  )
}
```

### Commit după acest task:
```bash
npm run build   # trebuie să treacă — va fi eroare TypeScript la CatalogFilter
                # până rulezi M2.filter, e normal
git add app/catalog/page.tsx
git commit -m "M2.page: catalog citește din catalog_norms — app/catalog/page.tsx"
```

---

## TASK M2.filter — Înlocuire components/CatalogFilter.tsx

### Ce face fișierul NOU față de cel vechi:
- Interfața `Item` { code, um, categories, normatives } → `CatalogNorm` { symbol, unit, category, unit_price }
- `initialItems` prop → `initialNorms` prop
- Filtre: câmp text + butoane categorii (înlocuiesc toggle Personal/Toate)
- Insert în `estimate_lines`: folosește `manual_name`, `manual_um`, `manual_price`
  (compatibil cu `estimate.ts` existent — NU SE ATINGE motorul de calcul)
- `catalog_norm_id` și `symbol` salvate în câmpul `metadata` (JSONB)
- Afișare preț per unitate pe card

### ⚠️ IMPORTANT privind insert-ul în estimate_lines:
Codul vechi insera cu `item_id`. Codul nou inserează cu `manual_name` / `manual_um`
/ `manual_price` — aceste coloane există deja în schema `estimate_lines`.
Câmpul `metadata` (JSONB) stochează referința la norma originală.
NU adăuga coloane noi în DB.

### Înlocuiește complet `components/CatalogFilter.tsx` cu:

```typescript
'use client'
// components/CatalogFilter.tsx

import { useState, useMemo } from 'react'
import { Search, X, PlusCircle, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface CatalogNorm {
  id: number
  symbol: string
  name: string
  unit: string
  category: string
  unit_price: number
}

export default function CatalogFilter({
  initialNorms,
  projectId,
}: {
  initialNorms: CatalogNorm[]
  projectId?: string | null
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [addingId, setAddingId] = useState<number | null>(null)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const categories = useMemo(
    () => ['all', ...new Set(initialNorms.map((n) => n.category))].sort(),
    [initialNorms]
  )

  const filteredNorms = useMemo(() => {
    let norms = initialNorms
    if (selectedCategory !== 'all') {
      norms = norms.filter((n) => n.category === selectedCategory)
    }
    if (!search.trim()) return norms
    const lower = search.toLowerCase()
    return norms.filter(
      (n) =>
        n.name.toLowerCase().includes(lower) ||
        n.symbol.toLowerCase().includes(lower) ||
        n.category.toLowerCase().includes(lower)
    )
  }, [search, selectedCategory, initialNorms])

  const handleAddNorm = async (norm: CatalogNorm) => {
    if (!projectId) return
    setAddingId(norm.id)

    const { error } = await supabase.from('estimate_lines').insert([
      {
        project_id: projectId,
        item_id: null,
        manual_name: norm.name,
        manual_um: norm.unit,
        manual_price: norm.unit_price ?? 0,
        quantity: 1,
        custom_prices: {},
        excluded_resources: [],
        resources_override: [],
        metadata: {
          catalog_norm_id: norm.id,
          symbol: norm.symbol,
          category: norm.category,
          source: 'catalog',
        },
      },
    ])

    if (!error) {
      setAddedId(norm.id)
      setTimeout(() => {
        setAddingId(null)
        setAddedId(null)
        router.push(`/projects/${projectId}`)
      }, 800)
    } else {
      console.error('Eroare la adăugare normă:', error)
      setAddingId(null)
    }
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Caută după denumire sau simbol (ex: termosistem, IzA01...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-12 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary/30 focus:ring-0 transition-all text-lg shadow-sm hover:border-slate-200"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filtre categorii */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'Toate' : cat}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold">
          Norme de deviz
          <span className="ml-2 text-base font-normal text-slate-400">
            ({filteredNorms.length.toLocaleString('ro-RO')})
          </span>
        </h2>
      </div>

      {/* Lista */}
      {filteredNorms.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nicio normă găsită pentru &quot;{search}&quot;</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all') }}
            className="mt-4 text-primary hover:underline text-sm"
          >
            Șterge filtrele
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredNorms.slice(0, 100).map((norm) => (
            <div
              key={norm.id}
              className="group relative p-5 bg-white dark:bg-slate-900 border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                    {norm.symbol}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium capitalize">
                    {norm.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {norm.unit_price > 0 && (
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {norm.unit_price.toLocaleString('ro-RO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      lei/{norm.unit}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">
                    u.m. {norm.unit}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={() => setExpandedId(expandedId === norm.id ? null : norm.id)}
                  className="flex-1 text-left group-hover:text-primary transition-colors flex items-start gap-2"
                >
                  <span className="text-base font-semibold leading-snug">
                    {norm.name}
                  </span>
                  {expandedId === norm.id ? (
                    <ChevronUp className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
                  )}
                </button>

                {projectId && (
                  <button
                    onClick={() => handleAddNorm(norm)}
                    disabled={addingId === norm.id}
                    title="Adaugă în deviz"
                    className={`
                      flex-shrink-0 p-2 rounded-lg transition-all
                      ${addedId === norm.id
                        ? 'bg-green-100 text-green-600'
                        : addingId === norm.id
                        ? 'bg-primary/20 text-primary cursor-wait'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }
                    `}
                  >
                    {addedId === norm.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <PlusCircle className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              {expandedId === norm.id && (
                <div className="mt-3 pt-3 border-t border-border text-sm text-slate-500 space-y-1">
                  <div><span className="font-medium">Simbol:</span> {norm.symbol}</div>
                  <div><span className="font-medium">Unitate de măsură:</span> {norm.unit}</div>
                  <div>
                    <span className="font-medium">Categorie:</span>{' '}
                    <span className="capitalize">{norm.category}</span>
                  </div>
                  {norm.unit_price > 0 && (
                    <div>
                      <span className="font-medium">Preț referință:</span>{' '}
                      {norm.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}{' '}
                      lei/{norm.unit} (fără TVA)
                    </div>
                  )}
                  <a
                    href={`/catalog/item/${norm.id}`}
                    className="inline-block mt-2 text-primary hover:underline text-xs"
                  >
                    Vezi detalii complet →
                  </a>
                </div>
              )}
            </div>
          ))}

          {filteredNorms.length > 100 && (
            <p className="text-center text-sm text-slate-400 py-4">
              Afișate primele 100 din {filteredNorms.length.toLocaleString('ro-RO')} rezultate.
              Restrânge căutarea pentru mai multă precizie.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

### Commit după acest task:
```bash
npm run build   # acum ambele fișiere sunt sincronizate — build ar trebui să treacă
git add components/CatalogFilter.tsx
git commit -m "M2.filter: CatalogFilter migrat la CatalogNorm, insert manual_name în estimate_lines — components/CatalogFilter.tsx"
```

---

## TASK M2.item — Înlocuire app/catalog/item/[id]/page.tsx

### Ce face fișierul NOU față de cel vechi:
- Query pe `catalog_norms` (nu `items`)
- Query pe `norm_components` (nu `resources`) — doar dacă `has_components = true`
- Afișează tabel complet: material, manoperă, transport, utilaj cu cantități și prețuri
- Calculează totaluri pe tip și total general
- Funcționează și fără componente (normă simplă) — afișează mesaj informativ
- Menține `?projectId=` în link-urile de navigare

### Înlocuiește complet `app/catalog/item/[id]/page.tsx` cu:

```typescript
// app/catalog/item/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, HardHat, Hammer, Truck, Box, Wrench } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface NormComponent {
  id: number
  name: string
  specification: string | null
  unit: string
  qty_per_unit: number
  unit_price: number
  component_type: 'material' | 'manopera' | 'transport' | 'utilaj' | 'taxa'
  is_optional: boolean
  optional_note: string | null
  can_substitute: boolean
  substitute_note: string | null
  sort_order: number
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  material:  { label: 'Material',  color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  manopera:  { label: 'Manoperă',  color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  transport: { label: 'Transport', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  utilaj:    { label: 'Utilaj',    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  taxa:      { label: 'Taxă',      color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20' },
}

export default async function CatalogItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ projectId?: string }>
}) {
  const { id } = await params
  const { projectId } = await searchParams
  const supabase = await createClient()

  const normId = parseInt(id, 10)
  if (isNaN(normId)) return notFound()

  const { data: norm, error: normError } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price, has_components, description')
    .eq('id', normId)
    .single()

  if (normError || !norm) return notFound()

  let components: NormComponent[] = []
  if (norm.has_components) {
    const { data: comps } = await supabase
      .from('norm_components')
      .select('id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, optional_note, can_substitute, substitute_note, sort_order')
      .eq('norm_id', normId)
      .order('component_type')
      .order('is_optional')
      .order('sort_order')
    components = (comps as NormComponent[]) || []
  }

  const required = components.filter((c) => !c.is_optional)
  const optional = components.filter((c) => c.is_optional)
  const totalRequired = required.reduce((s, c) => s + c.qty_per_unit * c.unit_price, 0)
  const totalOptional = optional.reduce((s, c) => s + c.qty_per_unit * c.unit_price, 0)

  const byType = components.reduce<Record<string, number>>((acc, c) => {
    acc[c.component_type] = (acc[c.component_type] || 0) + c.qty_per_unit * c.unit_price
    return acc
  }, {})

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <a
        href={`/catalog${projectId ? `?projectId=${projectId}` : ''}`}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Înapoi la Catalog
      </a>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-primary text-white text-sm font-mono font-bold rounded">
            {norm.symbol}
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded capitalize font-medium">
            {norm.category}
          </span>
          {norm.has_components && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
              ✓ Compus cu articole
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-3 leading-snug">{norm.name}</h1>
        {norm.description && (
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-3xl">{norm.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Unitate de măsură:</span>
            <span className="font-semibold">{norm.unit}</span>
          </div>
          {norm.unit_price > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Preț referință:</span>
              <span className="font-semibold text-primary">
                {norm.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei/{norm.unit}
              </span>
              <span className="text-xs text-slate-400">(fără TVA)</span>
            </div>
          )}
        </div>
      </div>

      {/* Componente sau normă simplă */}
      {norm.has_components && components.length > 0 ? (
        <>
          {/* Sumar costuri */}
          <section className="glass-card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Structura costului per {norm.unit}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {Object.entries(byType).map(([type, val]) => {
                const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.material
                return (
                  <div key={type} className={`rounded-lg p-3 ${cfg.color}`}>
                    <div className="text-xs font-medium mb-1">{cfg.label}</div>
                    <p className="text-lg font-bold">
                      {val.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs opacity-70">lei/{norm.unit}</p>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-border pt-4 flex flex-wrap justify-between gap-4 text-sm">
              <div>
                <span className="text-slate-400">Total obligatoriu:</span>{' '}
                <span className="font-bold text-base">
                  {totalRequired.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei/{norm.unit}
                </span>
              </div>
              {totalOptional > 0 && (
                <div>
                  <span className="text-slate-400">+ opționale:</span>{' '}
                  <span className="font-semibold text-slate-500">
                    +{totalOptional.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Tabel componente */}
          <section className="glass-card overflow-hidden mb-8">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Articole componente ({components.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="text-left px-6 py-3">Articol</th>
                    <th className="text-center px-4 py-3">Tip</th>
                    <th className="text-right px-4 py-3">Cantitate</th>
                    <th className="text-right px-4 py-3">Preț unitar</th>
                    <th className="text-right px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...required, ...optional].map((comp) => {
                    const lineTotal = comp.qty_per_unit * comp.unit_price
                    const cfg = TYPE_CONFIG[comp.component_type] || TYPE_CONFIG.material
                    return (
                      <tr
                        key={comp.id}
                        className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 ${comp.is_optional ? 'opacity-60' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium leading-snug">
                            {comp.name}
                            {comp.is_optional && (
                              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                opțional
                              </span>
                            )}
                          </div>
                          {comp.specification && (
                            <div className="text-xs text-slate-400 mt-0.5">{comp.specification}</div>
                          )}
                          {comp.optional_note && (
                            <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                              ⓘ {comp.optional_note}
                            </div>
                          )}
                          {comp.can_substitute && comp.substitute_note && (
                            <div className="text-xs text-blue-500 mt-0.5">
                              ↔ {comp.substitute_note}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">
                          {comp.qty_per_unit.toLocaleString('ro-RO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}{' '}
                          <span className="text-slate-400 text-xs">{comp.unit}</span>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">
                          {comp.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}{' '}
                          <span className="text-slate-400 text-xs">lei</span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-semibold">
                          {lineTotal.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}{' '}
                          <span className="text-slate-400 text-xs font-normal">lei</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                    <td colSpan={4} className="px-6 py-3 text-right text-sm">
                      TOTAL per {norm.unit}:
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-primary">
                      {totalRequired.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="glass-card p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Box className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Normă simplă</h2>
              <p className="text-slate-500 text-sm max-w-lg">
                Această normă nu are articole componente detaliate.
                Prețul de referință de{' '}
                <strong>
                  {norm.unit_price > 0
                    ? `${norm.unit_price.toFixed(2)} lei/${norm.unit}`
                    : 'neconfigurat'}
                </strong>{' '}
                reprezintă costul estimativ total.
              </p>
            </div>
          </div>
        </section>
      )}

      {projectId && (
        <div className="flex gap-4">
          <a
            href={`/catalog?projectId=${projectId}`}
            className="px-6 py-3 border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            ← Înapoi la catalog
          </a>
          <a
            href={`/projects/${projectId}`}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Mergi la proiect →
          </a>
        </div>
      )}
    </main>
  )
}
```

### Commit după acest task:
```bash
npm run build   # trebuie să treacă complet
git add "app/catalog/item/[id]/page.tsx"
git commit -m "M2.item: pagina detalii normă citește din catalog_norms + norm_components — app/catalog/item/[id]/page.tsx"
```

---

## TASK M2.V — Verificare finală M2

### Rulează și verifică manual în browser:

1. `/catalog` → trebuie să afișeze 27.000+ norme, categorii în sidebar, filtre
2. `/catalog?projectId=UUID_VALID` → trebuie să apară butonul "+" pe fiecare card
3. Click pe o normă → `/catalog/item/ID` → detalii normă, tabel componente
4. Click "+" pe o normă cu projectId → redirect la proiect, linia trebuie să apară

### Verificare în Supabase (opțional):
```sql
SELECT manual_name, manual_um, manual_price, metadata
FROM estimate_lines
ORDER BY created_at DESC
LIMIT 5;
```
Trebuie să vedem `manual_name` completat și `metadata` cu `symbol`, `catalog_norm_id`.

### Commit final M2:
```bash
git commit --allow-empty -m "M2.V: catalog funcțional cu catalog_norms — verificat manual"
```

---

## CE NU FAC ÎN ACEASTĂ SESIUNE

- ⛔ NU modific `estimate.ts` sau `financials.ts`
- ⛔ NU modific `middleware.ts`
- ⛔ NU modific `EstimateEditor.tsx` sau `ProjectClientContainer.tsx`
- ⛔ NU creez tabele noi în DB
- ⛔ NU modific schema `estimate_lines`
- ⛔ NU mă ating de fișiere din `utils/calculators/`

---

## DACĂ APARE O EROARE TypeScript

Cele mai probabile erori și fix-urile lor:

**Eroare: `Property 'initialNorms' does not exist`**
→ Ai uitat să actualizezi și `catalog/page.tsx` — pasezi `initialItems` în loc de `initialNorms`.
→ Fix: verifică că `page.tsx` pasează `initialNorms={...}`.

**Eroare: `Property 'has_components' does not exist`**
→ Tipul `catalog_norms` din Supabase nu include coloana nou adăugată.
→ Fix: adaugă `as any` temporar sau actualizează tipurile generate din Supabase.

**Eroare: `Cannot find module '@/utils/supabase/client'`**
→ Verifică calea corectă: poate fi `@/lib/supabase/client` sau `@/utils/supabase`.
→ Fix: copiază import-ul din fișierul original înainte de a-l suprascrie.

**Eroare: `norm_components` — tabel lipsă**
→ Migrarea phase 1 nu a rulat. Rulează în Supabase `migration_phase1_norm_components.sql`.

---

*Document generat pentru BuildingCalc M2 — 26 martie 2026*
*Fișiere atinse: app/catalog/page.tsx | components/CatalogFilter.tsx | app/catalog/item/[id]/page.tsx*
