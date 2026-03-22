'use client'

import { useState, useCallback, useRef, useEffect, useTransition } from 'react'
import {
  Search,
  X,
  PlusCircle,
  Check,
  ChevronDown,
  Loader2,
  Package,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { normalizeContains } from '@/utils/normalize'

// ─── Tipuri aliniate cu tabela catalog_norms ──────────────────────────────────

export interface CatalogNorm {
  id: string           // UUID
  symbol: string       // ex: "CA01A1"
  name: string
  unit: string         // mc, mp, ml, kg, buc...
  category: string     // terasamente, zidarie, acoperis...
  unit_price: number
}

interface Props {
  initialNorms: CatalogNorm[]
  categories: string[]
  totalCount: number
  pageSize: number
  projectId?: string | null
}

// ─── Label-uri și emoji-uri pentru categorii ──────────────────────────────────

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  terasamente: { label: 'Terasamente', emoji: '🏗️' },
  demolari:    { label: 'Demolări',    emoji: '⛏️' },
  beton:       { label: 'Beton',       emoji: '🧱' },
  cofraje:     { label: 'Cofraje',     emoji: '📐' },
  zidarie:     { label: 'Zidărie',     emoji: '🏠' },
  tencuieli:   { label: 'Tencuieli',   emoji: '🖌️' },
  pardoseli:   { label: 'Pardoseli',   emoji: '🟫' },
  izolatii:    { label: 'Izolații',    emoji: '🌡️' },
  acoperis:    { label: 'Acoperiș',    emoji: '🏘️' },
  finisaje:    { label: 'Finisaje',    emoji: '🎨' },
  tamplarie:   { label: 'Tâmplărie',  emoji: '🚪' },
  instalatii:  { label: 'Instalații',  emoji: '🔧' },
}

function getCategoryMeta(cat: string) {
  return CATEGORY_META[cat] ?? { label: cat, emoji: '📦' }
}

// ─── Componenta principală ────────────────────────────────────────────────────

export default function CatalogFilter({
  initialNorms,
  categories,
  totalCount,
  pageSize,
  projectId,
}: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State
  const [norms, setNorms] = useState<CatalogNorm[]>(initialNorms)
  const [page, setPage] = useState(0) // pagina curentă încărcată (0-based)
  const [hasMore, setHasMore] = useState(initialNorms.length === pageSize)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [selectedNorm, setSelectedNorm] = useState<CatalogNorm | null>(null)

  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // ─── Căutare server-side (cu debounce 300ms) ───────────────────────────────

  const doSearch = useCallback(
    async (query: string, category: string) => {
      setIsSearching(true)
      try {
        let q = supabase
          .from('catalog_norms')
          .select('id, symbol, name, unit, category, unit_price')
          .eq('is_active', true)
          .order('category')
          .order('symbol')

        if (category !== 'all') {
          q = q.eq('category', category)
        }

        if (query.trim().length > 0) {
          // Strategie dublă: ILIKE pentru robustețe + acoperire diacritice
          // (full-text search romanian poate rata termeni scurți ca "BCA")
          q = q.ilike('name', `%${query.trim()}%`)
          // Fallback suplimentar: caută și după symbol
        }

        const { data, error } = await q.limit(200)
        if (!error && data) {
          // Dacă query conține diacritice sau nu, aplicăm și filtru local
          // pentru a prinde și variantele fără diacritice (caramida → cărămidă)
          const filtered =
            query.trim().length > 0
              ? data.filter(
                  (n) =>
                    normalizeContains(n.name, query) ||
                    n.symbol.toLowerCase().includes(query.toLowerCase())
                )
              : data

          setNorms(filtered as CatalogNorm[])
          setHasMore(false) // în modul search nu paginăm
        }
      } finally {
        setIsSearching(false)
      }
    },
    [supabase]
  )

  // Trigger search la schimbarea input-ului
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (search.trim().length === 0 && activeCategory === 'all') {
      // Resetăm la initial fără query
      setNorms(initialNorms)
      setPage(0)
      setHasMore(initialNorms.length === pageSize)
      return
    }

    searchTimeout.current = setTimeout(() => {
      doSearch(search, activeCategory)
    }, 300)

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [search, activeCategory, doSearch, initialNorms, pageSize])

  // ─── Schimbare categorie ───────────────────────────────────────────────────

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setSearch('')
    // Dacă revenim la "all" fără search, reîncărcăm prima pagină
    if (cat === 'all' && search.trim().length === 0) {
      setNorms(initialNorms)
      setPage(0)
      setHasMore(initialNorms.length === pageSize)
    }
  }

  // ─── Load more (paginare) ─────────────────────────────────────────────────

  const loadMore = async () => {
    if (!hasMore || isSearching) return
    const nextPage = page + 1
    const from = nextPage * pageSize

    setIsSearching(true)
    try {
      let q = supabase
        .from('catalog_norms')
        .select('id, symbol, name, unit, category, unit_price')
        .eq('is_active', true)
        .order('category')
        .order('symbol')
        .range(from, from + pageSize - 1)

      if (activeCategory !== 'all') {
        q = q.eq('category', activeCategory)
      }

      const { data } = await q
      if (data) {
        setNorms((prev) => [...prev, ...(data as CatalogNorm[])])
        setPage(nextPage)
        setHasMore(data.length === pageSize)
      }
    } finally {
      setIsSearching(false)
    }
  }

  // ─── Adăugare normă în deviz ──────────────────────────────────────────────

  const handleAddNorm = async (norm: CatalogNorm) => {
    if (!projectId) {
      alert('Selectează un proiect mai întâi!')
      return
    }
    setAddingId(norm.id)

    const { error } = await supabase.from('estimate_lines').insert({
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

    if (!error) {
      setAddedIds((prev) => new Set(prev).add(norm.id))
      setTimeout(() => {
        setAddingId(null)
        startTransition(() => router.push(`/projects/${projectId}`))
      }, 600)
    } else {
      console.error('Eroare adăugare normă:', error)
      setAddingId(null)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const showingCount = norms.length

  return (
    <div className="space-y-6">
      {/* ── Search bar ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută normă... (ex: BCA, cărămidă, țiglă, fundație)"
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                     bg-white dark:bg-slate-900 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary/40
                     placeholder:text-slate-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Tabs categorii ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <CategoryTab
          active={activeCategory === 'all'}
          onClick={() => handleCategoryChange('all')}
          label="Toate"
          emoji="🗂️"
        />
        {categories.map((cat) => {
          const meta = getCategoryMeta(cat)
          return (
            <CategoryTab
              key={cat}
              active={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
              label={meta.label}
              emoji={meta.emoji}
            />
          )
        })}
      </div>

      {/* ── Counter + status ── */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {isSearching ? (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Căutare...
            </span>
          ) : (
            <>
              <strong className="text-slate-700 dark:text-slate-300">
                {showingCount.toLocaleString('ro-RO')}
              </strong>{' '}
              {search ? 'rezultate' : 'norme afișate'} din{' '}
              <strong>{totalCount.toLocaleString('ro-RO')}</strong> total
            </>
          )}
        </span>
        {projectId && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            Mod: adăugare în proiect
          </span>
        )}
      </div>

      {/* ── Lista de norme ── */}
      {norms.length === 0 && !isSearching ? (
        <div className="text-center py-16 text-slate-400">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            Nicio normă găsită pentru &ldquo;{search}&rdquo;
          </p>
          <p className="text-xs mt-1 opacity-60">
            Încearcă fără diacritice: &ldquo;caramida&rdquo;, &ldquo;tigla&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {norms.map((norm) => (
            <NormCard
              key={norm.id}
              norm={norm}
              projectId={projectId}
              isAdding={addingId === norm.id}
              isAdded={addedIds.has(norm.id)}
              onAdd={handleAddNorm}
              onSelect={setSelectedNorm}
            />
          ))}
        </div>
      )}

      {/* ── Load more ── */}
      {hasMore && !search && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            disabled={isSearching}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full
                       border border-slate-200 dark:border-slate-700
                       text-sm text-slate-600 dark:text-slate-400
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       disabled:opacity-50 transition-colors"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Încarcă mai multe norme
          </button>
        </div>
      )}

      {/* ── Modal detalii normă ── */}
      {selectedNorm && (
        <NormModal
          norm={selectedNorm}
          projectId={projectId}
          isAdding={addingId === selectedNorm.id}
          isAdded={addedIds.has(selectedNorm.id)}
          onAdd={handleAddNorm}
          onClose={() => setSelectedNorm(null)}
        />
      )}
    </div>
  )
}

// ─── Sub-componente ────────────────────────────────────────────────────────────

function CategoryTab({
  active,
  onClick,
  label,
  emoji,
}: {
  active: boolean
  onClick: () => void
  label: string
  emoji: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-none flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
                  whitespace-nowrap transition-all
                  ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

function NormCard({
  norm,
  projectId,
  isAdding,
  isAdded,
  onAdd,
  onSelect,
}: {
  norm: CatalogNorm
  projectId?: string | null
  isAdding: boolean
  isAdded: boolean
  onAdd: (n: CatalogNorm) => void
  onSelect: (n: CatalogNorm) => void
}) {
  const meta = getCategoryMeta(norm.category)

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl
                 bg-white dark:bg-slate-900
                 border border-slate-100 dark:border-slate-800
                 hover:border-primary/40 hover:shadow-sm
                 transition-all cursor-pointer group"
      onClick={() => onSelect(norm)}
    >
      {/* Symbol badge */}
      <span className="flex-none font-mono text-xs font-semibold
                       text-primary bg-primary/8 px-2 py-0.5 rounded-md
                       max-w-[90px] truncate">
        {norm.symbol}
      </span>

      {/* Name */}
      <span className="flex-1 text-sm text-slate-700 dark:text-slate-300
                       line-clamp-1 group-hover:text-slate-900 dark:group-hover:text-white">
        {norm.name}
      </span>

      {/* Unit */}
      <span className="flex-none text-xs text-slate-400 font-medium w-8 text-right">
        {norm.unit}
      </span>

      {/* Category chip */}
      <span className="flex-none hidden sm:inline-flex items-center gap-0.5
                       text-xs text-slate-500 bg-slate-50 dark:bg-slate-800
                       px-2 py-0.5 rounded-full">
        {meta.emoji} {meta.label}
      </span>

      {/* Add button — apare doar dacă suntem în context proiect */}
      {projectId && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAdd(norm)
          }}
          disabled={isAdding || isAdded}
          className={`flex-none ml-1 p-1.5 rounded-lg transition-all
                      ${
                        isAdded
                          ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                      }`}
          title="Adaugă în deviz"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAdded ? (
            <Check className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  )
}

function NormModal({
  norm,
  projectId,
  isAdding,
  isAdded,
  onAdd,
  onClose,
}: {
  norm: CatalogNorm
  projectId?: string | null
  isAdding: boolean
  isAdded: boolean
  onAdd: (n: CatalogNorm) => void
  onClose: () => void
}) {
  const meta = getCategoryMeta(norm.category)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                 bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900
                   rounded-2xl shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-sm font-bold text-primary">
              {norm.symbol}
            </span>
            <h2 className="text-base font-semibold text-slate-800 dark:text-white leading-snug">
              {norm.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-none text-slate-400 hover:text-slate-600 mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-3 gap-3">
          <MetaCell label="Unitate" value={norm.unit} />
          <MetaCell
            label="Categorie"
            value={`${meta.emoji} ${meta.label}`}
          />
          <MetaCell
            label="Preț referință"
            value={
              norm.unit_price > 0
                ? `${norm.unit_price.toLocaleString('ro-RO')} RON/${norm.unit}`
                : 'Nesetat'
            }
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                       text-sm text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Închide
          </button>
          {projectId && (
            <button
              onClick={() => onAdd(norm)}
              disabled={isAdding || isAdded}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium
                         hover:bg-primary/90 disabled:opacity-60 transition-colors
                         flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4" /> Adăugat
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Adaugă în deviz
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-0.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
        {value}
      </p>
    </div>
  )
}
