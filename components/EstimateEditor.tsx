'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, Info, ChevronDown, ChevronUp, Settings2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { calculateLineCosts, calculateProjectTotal, EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import { motion, AnimatePresence } from 'framer-motion'

export default function EstimateEditor({ 
  initialLines, 
  settings 
}: { 
  initialLines: any[], 
  settings: ProjectSettings 
}) {
  const [lines, setLines] = useState<EstimateLine[]>(initialLines)
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const supabase = createClient()

  const totals = useMemo(() => calculateProjectTotal(lines, settings), [lines, settings])

  const handleUpdateQuantity = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    setLines(lines.map(l => l.id === id ? { ...l, quantity: num } : l))
    setIsSaved(false)
  }

  const handleToggleResource = (lineId: string, resId: string) => {
    setLines(lines.map(l => {
      if (l.id !== lineId) return l
      const excluded = l.excluded_resources.includes(resId)
        ? l.excluded_resources.filter(id => id !== resId)
        : [...l.excluded_resources, resId]
      return { ...l, excluded_resources: excluded }
    }))
    setIsSaved(false)
  }

  const handleUpdatePrice = (lineId: string, resId: string, val: string) => {
    const num = parseFloat(val) || 0
    setLines(lines.map(l => {
      if (l.id !== lineId) return l
      return { ...l, custom_prices: { ...l.custom_prices, [resId]: num } }
    }))
    setIsSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    for (const line of lines) {
      await supabase
        .from('estimate_lines')
        .update({
          quantity: line.quantity,
          custom_prices: line.custom_prices,
          excluded_resources: line.excluded_resources
        })
        .eq('id', line.id)
    }
    setLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Info Proiect */}
      <div className="space-y-6">
        <div className="glass-card p-6 border-primary/10 bg-primary/[0.01]">
          <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Recapitație Proiect</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Profit:</span>
              <span className="font-bold">{settings.profit}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Regie:</span>
              <span className="font-bold">{settings.regie}%</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2 border-border/50">
              <span className="text-slate-500">TVA:</span>
              <span className="font-bold">{settings.tva}%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-slate-900 text-white">
          <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Total Proiect</h3>
          <div className="text-3xl font-black text-primary mb-1">
            {totals.totalWithTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} Lei
          </div>
          <div className="text-xs text-slate-400 mb-6">Inclusiv TVA</div>
          
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Cost Direct:</span>
              <span className="font-mono">{totals.totalDirect.toLocaleString('ro-RO')} Lei</span>
            </div>
            <div className="flex justify-between">
              <span>Fără TVA:</span>
              <span className="font-mono">{totals.totalOfertat.toLocaleString('ro-RO')} Lei</span>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className={`
              w-full mt-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20'
              }
            `}
          >
            {loading ? 'Se salvează...' : isSaved ? <><CheckCircle2 size={18} /> Salvat!</> : <><Save size={18} /> Salvează Progesul</>}
          </button>
        </div>
      </div>

      {/* Tabel Deviz / Linii Estimate */}
      <div className="lg:col-span-3">
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="font-bold text-lg">Articole în Deviz</h2>
            <span className="text-xs font-bold text-slate-400">{lines.length} poziții</span>
          </div>

          <div className="divide-y divide-border/50">
            {lines.map((line) => {
              const lineCosts = calculateLineCosts(line, settings)
              const isExpanded = expandedId === line.id

              return (
                <div key={line.id} className="group">
                  <div className="p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {line.items.normatives?.code}
                          </span>
                          <h4 className="font-bold text-lg">{line.items.name}</h4>
                        </div>
                        <div className="text-xs text-slate-400">
                          {lineCosts.unitDirectCost.toFixed(2)} Lei cost direct / {line.items.um}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-black">Cantitate</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              className="w-24 p-2 text-right bg-slate-100 dark:bg-slate-800 rounded-lg font-mono font-bold focus:ring-1 focus:ring-primary/30 outline-none"
                              value={line.quantity}
                              onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                            />
                            <span className="text-sm font-medium text-slate-400">{line.items.um}</span>
                          </div>
                        </div>

                        <div className="text-right min-w-[120px]">
                          <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-black">Total Linie</label>
                          <div className="font-mono text-xl font-black text-slate-900 dark:text-white">
                            {lineCosts.totalOfertatWithoutTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <button 
                          onClick={() => setExpandedId(isExpanded ? null : line.id)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50 dark:bg-slate-800/20 border-t border-border/30"
                      >
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Settings2 size={16} />
                            <h5 className="text-sm font-bold uppercase tracking-wider">Configurare Resurse Planificate</h5>
                          </div>
                          
                          <div className="grid gap-2">
                            {line.items.resources?.map((res) => {
                              const isExcluded = line.excluded_resources.includes(res.id)
                              const customPrice = line.custom_prices[res.id]
                              
                              return (
                                <div 
                                  key={res.id} 
                                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isExcluded ? 'opacity-40 grayscale bg-slate-100 border-transparent' : 'bg-white dark:bg-slate-900 border-border'}`}
                                >
                                  <div className="flex items-center gap-4">
                                    <input 
                                      type="checkbox" 
                                      checked={!isExcluded}
                                      onChange={() => handleToggleResource(line.id, res.id)}
                                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <div>
                                      <div className="text-sm font-bold">{res.name}</div>
                                      <div className="text-[10px] text-slate-400 uppercase font-black">{res.type} • {res.consumption} {res.um} / {line.items.um}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="text-[10px] text-slate-400 uppercase font-black">Preț Unitar</div>
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="number"
                                          disabled={isExcluded}
                                          className={`w-20 p-1 text-sm text-right bg-slate-50 dark:bg-slate-800 rounded font-mono ${customPrice ? 'text-primary font-bold' : ''}`}
                                          value={customPrice ?? res.unit_price}
                                          onChange={(e) => handleUpdatePrice(line.id, res.id, e.target.value)}
                                        />
                                        <span className="text-[10px] text-slate-400 font-bold">Lei</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
