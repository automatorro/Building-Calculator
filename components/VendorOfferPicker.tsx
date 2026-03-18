'use client'

import { useState, useEffect } from 'react'
import { X, Check, Store, TrendingDown } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface VendorOffer {
  id: string
  shop_id: string
  unit_price: number
  is_selected: boolean
  shops: { name: string }
}

interface Shop {
  id: string
  name: string
}

interface VendorOfferPickerProps {
  projectId: string
  resourceId: string
  resourceName: string
  onSelect: (price: number) => void
  onClose: () => void
}

export default function VendorOfferPicker({ projectId, resourceId, resourceName, onSelect, onClose }: VendorOfferPickerProps) {
  const [offers, setOffers] = useState<VendorOffer[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // 1. Fetch Shops
    const { data: shopsData } = await supabase.from('shops').select('id, name').order('name')
    if (shopsData) setShops(shopsData)

    // 2. Fetch existing offers for this resource in this project
    const { data: offersData } = await supabase
      .from('vendor_offers')
      .select('*, shops(name)')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)

    if (offersData) setOffers(offersData as any)
    setLoading(false)
  }

  const handleUpdatePrice = async (shopId: string, price: number) => {
    if (price <= 0) return

    const existingOffer = offers.find(o => o.shop_id === shopId)
    
    if (existingOffer) {
      const { error } = await supabase
        .from('vendor_offers')
        .update({ unit_price: price })
        .eq('id', existingOffer.id)
      
      if (!error) {
        setOffers(offers.map(o => o.id === existingOffer.id ? { ...o, unit_price: price } : o))
      }
    } else {
      const { data, error } = await supabase
        .from('vendor_offers')
        .insert({
          project_id: projectId,
          shop_id: shopId,
          resource_id: resourceId,
          unit_price: price
        })
        .select('*, shops(name)')

      if (data) setOffers([...offers, data[0] as any])
    }
  }

  const handleSelectOffer = async (offer: VendorOffer) => {
    // 1. Reset all selections for this resource
    await supabase
      .from('vendor_offers')
      .update({ is_selected: false })
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)

    // 2. Set current selection
    const { error } = await supabase
      .from('vendor_offers')
      .update({ is_selected: true })
      .eq('id', offer.id)

    if (!error) {
      setOffers(offers.map(o => ({ ...o, is_selected: o.id === offer.id })))
      onSelect(offer.unit_price) // Callback to update EstimateEditor state
      onClose()
    }
  }

  const cheapestOffer = offers.length > 0 ? [...offers].sort((a, b) => a.unit_price - b.unit_price)[0] : null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-border/50 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 text-primary mb-1">
              <TrendingDown size={28} />
              <h2 className="text-2xl font-black">Comparație Prețuri</h2>
            </div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{resourceName}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X size={28} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="font-bold text-slate-400 tracking-widest uppercase text-xs">Se caută oferte...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {shops.map((shop) => {
                const offer = offers.find(o => o.shop_id === shop.id)
                const isCheapest = cheapestOffer && offer && offer.id === cheapestOffer.id

                return (
                  <div 
                    key={shop.id} 
                    className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${offer?.is_selected ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-slate-50/50 dark:bg-white/[0.02] border-border/50 hover:border-border'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${offer?.is_selected ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                        <Store size={24} />
                      </div>
                      <div>
                        <div className="font-black text-lg">{shop.name}</div>
                        {isCheapest && (
                          <div className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                            <Check size={12} /> Cel mai mic preț
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Preț Unitar</div>
                        <input 
                          type="number"
                          placeholder="0.00"
                          className="w-28 p-3 bg-white dark:bg-slate-900 border border-border rounded-xl font-mono text-lg font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
                          value={offer?.unit_price || ''}
                          onChange={(e) => handleUpdatePrice(shop.id, parseFloat(e.target.value))}
                        />
                      </div>
                      
                      {offer && (
                        <button 
                          onClick={() => handleSelectOffer(offer)}
                          className={`p-4 rounded-2xl transition-all ${offer.is_selected ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:bg-primary hover:text-white'}`}
                        >
                          <Check size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {shops.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] border-2 border-dashed border-border/50">
                  <p className="text-slate-400 font-bold mb-4">Nu ai definit magazine pentru acest proiect.</p>
                  <button onClick={onClose} className="bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Adaugă Magazine
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-border/50 bg-slate-50/50 dark:bg-white/[0.01]">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            * Selectând un furnizor, prețul acestuia va fi aplicat automat în deviz și va recalcula toate totalurile proiectului.
          </p>
        </div>
      </div>
    </div>
  )
}
