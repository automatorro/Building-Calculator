'use client'

import { useState, useMemo } from 'react'
import { Search, X, PlusCircle, Check } from 'lucide-react'
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
  projectId
}: {
  initialNorms: CatalogNorm[]
  projectId?: string | null
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [addingId, setAddingId] = useState<number | null>(null)
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())
  const supabase = createClient()
  const router = useRouter()

  const categories = useMemo(() =>
    ['all', ...new Set(initialNorms.map(n => n.category))].sort((a, b) =>
      a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b, 'ro')
    ),
    [initialNorms]
  )

  const filteredNorms = useMemo(() => {
    let norms = initialNorms

    if (selectedCategory !== 'all') {
      norms = norms.filter(n => n.category === selectedCategory)
    }

    if (!search) return norms
    const q = search.toLowerCase()
    return norms.filter(n =>
      n.name.toLowerCase().includes(q) ||
      n.symbol.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    )
  }, [search, selectedCategory, initialNorms])

  const handleAddNorm = async (norm: CatalogNorm) => {
    if (!projectId) return
    setAddingId(norm.id)

    const { error } = await supabase
      .from('estimate_lines')
      .insert([{
        project_id: projectId,
        item_id: null,
        // Câmpuri noi (schema actualizată)
        catalog_norm_id: norm.id,
        name: norm.name,
        code: norm.symbol,
        unit: norm.unit,
        unit_price: norm.unit_price,
        category: norm.category,
        // Câmpuri compatibilitate (pentru calcule și display existent)
        manual_name: norm.name,
        manual_um: norm.unit,
        manual_price: norm.unit_price,
        quantity: 1,
        custom_prices: {},
        excluded_resources: [],
        metadata: { catalog_norm_symbol: norm.symbol, catalog_norm_id: norm.id },
      }])

    if (!error) {
      setAddedIds(prev => new Set(prev).add(norm.id))
      setTimeout(() => {
        setAddingId(null)
        router.push(`/projects/${projectId}`)
      }, 600)
    } else {
      console.error(error)
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
          placeholder="Caută după denumire sau simbol (ex: beton, TcA...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-12 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary/30 focus:ring-0 transition-all text-lg shadow-sm hover:border-slate-200 outline-none"
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
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: selectedCategory === cat ? '1px solid #E8500A' : '1px solid #E5E3DE',
              background: selectedCategory === cat ? '#FFF0E8' : 'white',
              color: selectedCategory === cat ? '#E8500A' : '#6B6860',
              fontSize: 13,
              fontWeight: selectedCategory === cat ? 600 : 400,
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {cat === 'all' ? 'Toate' : cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-2xl font-bold">
            Norme tehnice{' '}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#A8A59E' }}>
              ({filteredNorms.length})
            </span>
          </h2>
        </div>

        {filteredNorms.length > 0 ? (
          <div className="grid gap-3">
            {filteredNorms.map((norm) => {
              const isAdded = addedIds.has(norm.id)
              const isAdding = addingId === norm.id
              return (
                <div
                  key={norm.id}
                  className="group relative p-4 bg-white border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {norm.symbol}
                        </span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 100,
                          background: '#F3F2EF', color: '#6B6860',
                          fontSize: 11, fontWeight: 500,
                        }}>
                          {norm.category}
                        </span>
                        <span className="text-xs text-slate-400">u.m. {norm.unit}</span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-800 leading-snug">{norm.name}</h3>
                      {norm.unit_price > 0 && (
                        <p style={{ fontSize: 12, color: '#A8A59E', marginTop: 4 }}>
                          Preț orientativ:{' '}
                          <strong style={{ color: '#E8500A' }}>
                            {norm.unit_price.toLocaleString('ro-RO')} lei/{norm.unit}
                          </strong>
                        </p>
                      )}
                    </div>

                    {projectId && (
                      <button
                        onClick={() => handleAddNorm(norm)}
                        disabled={isAdding || isAdded}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 8,
                          border: 'none',
                          cursor: isAdding || isAdded ? 'default' : 'pointer',
                          background: isAdded ? '#E8F5EE' : isAdding ? '#F3F2EF' : '#FFF0E8',
                          color: isAdded ? '#2A7D4F' : isAdding ? '#A8A59E' : '#E8500A',
                          transition: 'all .15s',
                          flexShrink: 0,
                        }}
                        title={isAdded ? 'Adăugat' : 'Adaugă în deviz'}
                      >
                        {isAdded ? <Check size={18} /> : <PlusCircle size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <div className="mb-4 inline-flex p-4 bg-slate-50 rounded-full text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium">
              {search
                ? `Nu am găsit niciun rezultat pentru "${search}"`
                : 'Nu există norme în această categorie.'
              }
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Resetează căutarea
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
