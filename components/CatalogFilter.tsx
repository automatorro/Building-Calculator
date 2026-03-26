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
