'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Store, Check, MapPin } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Shop {
  id: string
  name: string
  location?: string
}

export default function ShopManager({ onClose }: { onClose: () => void }) {
  const [shops, setShops] = useState<Shop[]>([])
  const [newName, setNewName] = useState('')
  const [newLoc, setNewLoc] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    const { data, error } = await supabase.from('shops').select('*').order('name')
    if (data) setShops(data)
    setLoading(false)
  }

  const handleAddShop = async () => {
    if (!newName.trim()) return
    const { data, error } = await supabase
      .from('shops')
      .insert({ name: newName.trim(), location: newLoc.trim() })
      .select()

    if (data) {
      setShops([...shops, data[0]])
      setNewName('')
      setNewLoc('')
    }
  }

  const handleDeleteShop = async (id: string) => {
    const { error } = await supabase.from('shops').delete().eq('id', id)
    if (!error) {
      setShops(shops.filter(s => s.id !== id))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <Store size={24} />
            <h2 className="text-xl font-black">Furnizori / Magazine</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Nume Furnizor (Ex: Dedeman)"
              className="w-full p-3 bg-slate-50 dark:bg-white/5 border border-border rounded-xl focus:border-primary/50 outline-none"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Locație / Oraș"
                  className="w-full p-3 pl-10 bg-slate-50 dark:bg-white/5 border border-border rounded-xl focus:border-primary/50 outline-none"
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddShop}
                className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {loading ? (
              <p className="text-center py-8 text-slate-400 italic">Se încarcă...</p>
            ) : shops.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-sm italic">Nu ai adăugat niciun furnizor.</p>
            ) : (
              shops.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-border transition-all group">
                  <div>
                    <div className="font-bold">{shop.name}</div>
                    {shop.location && <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {shop.location}</div>}
                  </div>
                  <button 
                    onClick={() => handleDeleteShop(shop.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-800/50 text-center">
          <button
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  )
}
