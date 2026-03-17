'use client'

import { useState, useMemo } from 'react'
import { Search, X, PlusCircle, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface Item {
  id: string
  code: string
  name: string
  um: string
  categories: { name: string } | null
  normatives: { code: string } | null
}

export default function CatalogFilter({ 
  initialItems, 
  projectId 
}: { 
  initialItems: Item[], 
  projectId?: string | null 
}) {
  const [search, setSearch] = useState('')
  const [addingId, setAddingId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const filteredItems = useMemo(() => {
    if (!search) return initialItems
    const lowerSearch = search.toLowerCase()
    return initialItems.filter(item => 
      item.name.toLowerCase().includes(lowerSearch) ||
      item.code.toLowerCase().includes(lowerSearch) ||
      (item.normatives?.code.toLowerCase().includes(lowerSearch))
    )
  }, [search, initialItems])

  const handleAddItem = async (itemId: string) => {
    if (!projectId) return
    setAddingId(itemId)

    const { error } = await supabase
      .from('estimate_lines')
      .insert([
        { 
          project_id: projectId, 
          item_id: itemId,
          quantity: 0 // Initial cantitatea este 0, se modifica in pagina proiectului
        }
      ])

    if (!error) {
      setTimeout(() => {
        setAddingId(null)
        router.push(`/projects/${projectId}`)
      }, 500)
    } else {
      console.error(error)
      setAddingId(null)
    }
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Caută după nume sau cod (ex: beton, TsCA...)"
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

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-bold">Articole de Deviz</h2>
          <span className="text-sm font-medium text-slate-400">
            {filteredItems.length} {filteredItems.length === 1 ? 'articol' : 'articole'} găsite
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative p-5 bg-white dark:bg-slate-900 border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                    {item.normatives?.code} {item.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">u.m. {item.um}</span>
                </div>
                
                <div className="flex justify-between items-center gap-4">
                  <a href={`/catalog/item/${item.id}`} className="block flex-1 group-hover:text-primary transition-colors">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                  </a>
                  
                  {projectId && (
                    <button 
                      onClick={() => handleAddItem(item.id)}
                      disabled={addingId === item.id}
                      className={`
                        p-2 rounded-lg transition-all
                        ${addingId === item.id 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                        }
                      `}
                    >
                      {addingId === item.id ? <Check size={20} /> : <PlusCircle size={20} />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {item.categories?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <div className="mb-4 inline-flex p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium font-mono">Nu am găsit niciun rezultat pentru "{search}"</p>
            <button 
              onClick={() => setSearch('')}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Resetează căutarea
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

