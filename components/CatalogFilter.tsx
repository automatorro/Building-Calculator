'use client'

import { useState, useCallback } from 'react'
import { Search, X, PlusCircle, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
  initialSearch = '',
  initialCategory = '',
  totalCount = 0,
}: {
  initialNorms: CatalogNorm[]
  projectId?: string | null
  initialSearch?: string
  initialCategory?: string
  totalCount?: number
}) {
  const [search, setSearch] = useState(initialSearch)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    const params = new URLSearchParams()
    if (value.trim().length >= 2) params.set('q', value.trim())
    if (initialCategory) params.set('cat', initialCategory)
    if (projectId) params.set('projectId', projectId)
    const timeout = setTimeout(() => {
      router.push(`/catalog?${params.toString()}`)
    }, 500)
    return () => clearTimeout(timeout)
  }, [initialCategory, projectId, router])

  const handleAddNorm = async (norm: CatalogNorm) => {
    if (!projectId) return
    setAddingId(norm.id)

    const { error } = await supabase.from('estimate_lines').insert([{
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
    }])

    if (!error) {
      setAddedId(norm.id)
      toast.success('Normă adăugată în deviz!')
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

  const showResults = initialNorms.length > 0 || initialSearch.length >= 2 || !!initialCategory
  const isEmpty = showResults && initialNorms.length === 0

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
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-11 pr-12 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary/30 focus:ring-0 transition-all text-lg shadow-sm hover:border-slate-200"
        />
        {search && (
          <button
            onClick={() => handleSearch('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Header */}
      {showResults ? (
        <div className="flex items-center justify-between px-1">
          <h2 className="text-2xl font-bold">
            {initialCategory ? (
              <span className="capitalize">{initialCategory}</span>
            ) : (
              'Rezultate căutare'
            )}
            <span className="ml-2 text-base font-normal text-slate-400">
              ({initialNorms.length}{initialNorms.length === 200 ? '+' : ''})
            </span>
          </h2>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-16 h-16 mx-auto mb-6 opacity-20" />
          <p className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
            {totalCount.toLocaleString('ro-RO')} norme disponibile
          </p>
          <p className="text-base">
            Caută o normă sau alege o categorie din stânga
          </p>
          <p className="text-sm mt-2 text-slate-400">
            Minim 2 caractere pentru a afișa rezultate
          </p>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">Nicio normă găsită pentru &quot;{initialSearch}&quot;</p>
          <p className="text-sm mt-2">Încearcă alt termen sau alege o categorie</p>
        </div>
      )}

      {/* Lista */}
      {initialNorms.length > 0 && (
        <div className="grid gap-3">
          {initialNorms.map((norm) => (
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
                      {norm.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei/{norm.unit}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">u.m. {norm.unit}</span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={() => setExpandedId(expandedId === norm.id ? null : norm.id)}
                  className="flex-1 text-left group-hover:text-primary transition-colors flex items-start gap-2"
                >
                  <span className="text-base font-semibold leading-snug">{norm.name}</span>
                  {expandedId === norm.id
                    ? <ChevronUp className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
                  }
                </button>

                {projectId && (
                  <button
                    onClick={() => handleAddNorm(norm)}
                    disabled={addingId === norm.id}
                    title="Adaugă în deviz"
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      addedId === norm.id
                        ? 'bg-green-100 text-green-600'
                        : addingId === norm.id
                        ? 'bg-primary/20 text-primary cursor-wait'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {addedId === norm.id ? <Check className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  </button>
                )}
              </div>

              {expandedId === norm.id && (
                <div className="mt-3 pt-3 border-t border-border text-sm text-slate-500 space-y-1">
                  <div><span className="font-medium">Simbol:</span> {norm.symbol}</div>
                  <div><span className="font-medium">Unitate:</span> {norm.unit}</div>
                  <div>
                    <span className="font-medium">Categorie:</span>{' '}
                    <span className="capitalize">{norm.category}</span>
                  </div>
                  {norm.unit_price > 0 && (
                    <div>
                      <span className="font-medium">Preț referință:</span>{' '}
                      {norm.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei/{norm.unit} (fără TVA)
                    </div>
                  )}
                  <a
                    href={`/catalog/item/${norm.id}${projectId ? `?projectId=${projectId}` : ''}`}
                    className="inline-block mt-2 text-primary hover:underline text-xs"
                  >
                    Vezi detalii complet →
                  </a>
                </div>
              )}
            </div>
          ))}

          {initialNorms.length >= 200 && (
            <p className="text-center text-sm text-slate-400 py-4">
              Afișate primele 200 rezultate. Restrânge căutarea pentru mai multă precizie.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
