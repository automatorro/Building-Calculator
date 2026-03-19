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
  user_id?: string | null
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
  const [filterType, setFilterType] = useState<'all' | 'personal'>('all')
  const [addingId, setAddingId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const filteredItems = useMemo(() => {
    let items = initialItems
    if (filterType === 'personal') {
      items = initialItems.filter(item => item.user_id !== null)
    }

    if (!search) return items
    const lowerSearch = search.toLowerCase()
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerSearch) ||
      item.code.toLowerCase().includes(lowerSearch) ||
      (item.normatives?.code.toLowerCase().includes(lowerSearch))
    )
  }, [search, initialItems, filterType])

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

  const handleCreateNewItem = async (newItem: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Te rugăm să te autentifici!')

    const { data, error } = await supabase
      .from('items')
      .insert([{
        ...newItem,
        user_id: user.id,
        code: `USER-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      }])
      .select()
    
    if (data) {
      setShowCreateModal(false)
      router.refresh()
    }
    if (error) console.error(error)
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Articole de Deviz</h2>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md transition-all ${filterType === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
              >
                Toate
              </button>
              <button 
                onClick={() => setFilterType('personal')}
                className={`px-3 py-1.5 rounded-md transition-all ${filterType === 'personal' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
              >
                Biblioteca Mea
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle size={14} /> Crează Articol Master
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative p-5 bg-white dark:bg-slate-900 border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                      {item.normatives?.code} {item.code}
                    </span>
                    {item.user_id && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/10">
                        Personal
                      </span>
                    )}
                  </div>
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

      {showCreateModal && (
        <CreateItemModal 
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateNewItem}
        />
      )}
    </div>
  )
}


function CreateItemModal({ onClose, onSave }: { onClose: () => void, onSave: (item: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    um: 'buc',
    category_id: ''
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 space-y-6">
        <h3 className="text-xl font-black">Adaugă Articol în Bibliotecă</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Denumire Articol</label>
            <input 
              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold"
              placeholder="Ex: Montaj ferestre PVC"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Unitate de Măsură</label>
            <input 
              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold"
              placeholder="Ex: mp, buc, kg"
              value={formData.um}
              onChange={e => setFormData({...formData, um: e.target.value})}
            />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Anulează</button>
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all"
          >
            Salvează
          </button>
        </div>
      </div>
    </div>
  )
}
