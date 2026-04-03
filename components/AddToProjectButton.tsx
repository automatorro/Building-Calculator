'use client'

import { useState } from 'react'
import { PlusCircle, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddToProjectButton({ norm, projectId }: { norm: any, projectId: string }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAdd = async () => {
    setAdding(true)
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
      setAdded(true)
      toast.success('Normă adăugată în Deviz!')
      setTimeout(() => {
        setAdding(false)
        router.push(`/projects/${projectId}?tab=planning`)
      }, 800)
    } else {
      toast.error('Eroare la adăugarea în deviz.')
      console.error(error)
      setAdding(false)
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className={`px-8 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
        added
          ? 'bg-green-100 text-green-700'
          : adding
          ? 'bg-primary/20 text-primary cursor-wait'
          : 'bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/30 active:scale-95'
      }`}
    >
      {added ? <><Check className="w-5 h-5" /> Adăugat!</> : <><PlusCircle className="w-5 h-5" /> Adaugă în Proiect</>}
    </button>
  )
}
