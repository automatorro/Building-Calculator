'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, Info, ChevronDown, ChevronUp, Settings2, CheckCircle2, Lightbulb } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { calculateLineCosts, calculateProjectTotal, EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import { motion, AnimatePresence } from 'framer-motion'

export default function EstimateEditor({ 
  initialLines, 
  settings,
  dimensions = {}
}: { 
  initialLines: EstimateLine[], 
  settings: ProjectSettings,
  dimensions?: any
}) {
  const [lines, setLines] = useState<EstimateLine[]>(initialLines)
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const supabase = createClient()

  // Calculăm valorile "Smart" disponibile bazate pe dimensiuni
  const smartValues = useMemo(() => {
    const d = {
      length: 10, width: 8, height: 3, 
      foundation_depth: 0.8, foundation_width: 0.6, 
      slab_thickness: 0.15, wall_thickness: 0.25,
      ...dimensions
    }
    const area = d.length * d.width
    const perimeter = (d.length + d.width) * 2
    
    return {
      'foundation_concrete': perimeter * d.foundation_depth * d.foundation_width,
      'slab_concrete': area * d.slab_thickness,
      'wall_volume': perimeter * d.height * d.wall_thickness,
      'formwork_area': (perimeter * 0.5) + (perimeter * d.height),
      'excavation_volume': perimeter * d.foundation_depth * d.foundation_width * 1.2,
      'floor_area': area
    }
  }, [dimensions])

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
          excluded_resources: line.excluded_resources,
          metadata: line.metadata // Salvăm metadatele (inclusiv smart_link)
        })
        .eq('id', line.id)
    }
    setLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleSmartLink = (lineId: string, formulaKey: string | null) => {
    setLines(lines.map(l => {
      if (l.id !== lineId) return l
      const newMetadata = { ...l.metadata, smart_link: formulaKey }
      const newQuantity = formulaKey ? (smartValues as any)[formulaKey] : l.quantity
      return { ...l, metadata: newMetadata, quantity: newQuantity }
    }))
    setIsSaved(false)
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
      {/* Sidebar Info Proiect - Stays on top on mobile, side on desktop */}
      <div className="space-y-6 order-1 lg:order-1">
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

        <div className="glass-card p-6 bg-slate-900 text-white sticky top-4 z-20 shadow-2xl lg:shadow-none">
          <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Total Proiect</h3>
          <div className="text-3xl font-black text-primary mb-1">
            {totals.totalWithTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} Lei
          </div>
          <div className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-wide">Inclusiv TVA</div>
          
          <div className="space-y-2 text-sm text-slate-300 mb-6">
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
              w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
              ${isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/30'
              }
            `}
          >
            {loading ? 'Se salvează...' : isSaved ? <><CheckCircle2 size={18} /> Salvat!</> : <><Save size={18} /> Salvează Deviz</>}
          </button>
        </div>
      </div>

      {/* Tabel Deviz / Linii Estimate */}
      <div className="lg:col-span-3 order-2 lg:order-2">
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
                  <div className="p-4 md:p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      {/* Titlu si Cod */}
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                            {line.items.normatives?.code}
                          </span>
                          <h4 className="font-bold text-base md:text-lg leading-tight">{line.items.name}</h4>
                        </div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                          {lineCosts.unitDirectCost.toFixed(2)} Lei direct / {line.items.um}
                        </div>
                      </div>
                      
                      {/* Input si Pret */}
                      <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-0 border-border/30">
                        <div className="text-left md:text-right">
                          <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-black">Cantitate</label>
                          <div className="flex items-center gap-2 relative">
                            <input 
                              type="number" 
                              disabled={!!line.metadata?.smart_link}
                              className={`w-20 md:w-24 p-2 text-right rounded-lg font-mono font-bold focus:ring-1 focus:ring-primary/30 outline-none transition-all ${line.metadata?.smart_link ? 'bg-blue-50 text-blue-600 border-blue-200 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-800 border-transparent'}`}
                              value={line.quantity.toFixed(2)}
                              onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                            />
                            
                            {/* Smart Link Dropdown / Toggle */}
                            <div className="relative group/smart">
                              <button 
                                className={`p-1.5 rounded-md transition-all ${line.metadata?.smart_link ? 'bg-primary text-white' : 'text-slate-300 hover:text-primary'}`}
                                title={line.metadata?.smart_link ? `Calculat prin: ${line.metadata.smart_link}` : "Leagă de Smart Calculator"}
                              >
                                <Lightbulb size={16} />
                              </button>
                              
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/smart:opacity-100 group-hover/smart:translate-y-0 group-hover/smart:pointer-events-auto transition-all z-30">
                                <div className="p-2 border-b border-border text-[10px] font-black text-slate-400 uppercase tracking-widest">Alege Formulă</div>
                                <div className="p-1 space-y-1">
                                  {Object.keys(smartValues).map((key) => (
                                    <button
                                      key={key}
                                      onClick={() => handleSmartLink(line.id, key)}
                                      className={`w-full text-left p-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${line.metadata?.smart_link === key ? 'text-primary font-bold' : ''}`}
                                    >
                                      {key.replace('_', ' ')}
                                    </button>
                                  ))}
                                  {line.metadata?.smart_link && (
                                    <button
                                      onClick={() => handleSmartLink(line.id, null)}
                                      className="w-full text-left p-2 text-xs rounded-lg text-red-500 hover:bg-red-50 transition-colors border-t border-border mt-1"
                                    >
                                      Deleagă (Manual)
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-slate-400">{line.items.um}</span>
                          </div>
                        </div>

                        <div className="text-right min-w-[100px] md:min-w-[120px]">
                          <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-black">Total</label>
                          <div className="font-mono text-lg md:text-xl font-black text-slate-900 dark:text-white">
                            {lineCosts.totalOfertatWithoutTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <button 
                          onClick={() => setExpandedId(isExpanded ? null : line.id)}
                          className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}
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
                        <div className="p-4 md:p-6 space-y-4">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Settings2 size={16} />
                            <h5 className="text-[11px] font-black uppercase tracking-widest">Resurse Planificate</h5>
                          </div>
                          
                          <div className="grid gap-2">
                            {line.items.resources?.map((res) => {
                              const isExcluded = line.excluded_resources.includes(res.id)
                              const customPrice = line.custom_prices[res.id]
                              
                              return (
                                <div 
                                  key={res.id} 
                                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-all gap-3 ${isExcluded ? 'opacity-40 grayscale bg-slate-100 dark:bg-slate-900/50 border-transparent' : 'bg-white dark:bg-slate-900 border-border shadow-sm'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="checkbox" 
                                      checked={!isExcluded}
                                      onChange={() => handleToggleResource(line.id, res.id)}
                                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary shrink-0"
                                    />
                                    <div>
                                      <div className="text-sm font-bold leading-snug">{res.name}</div>
                                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{res.type} • {res.consumption} {res.um} / {line.items.um}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end gap-3 pl-8 sm:pl-0 border-t sm:border-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                                    <div className="text-right">
                                      <div className="text-[9px] text-slate-400 uppercase font-black">Preț Unitar (Lei)</div>
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="number"
                                          disabled={isExcluded}
                                          className={`w-24 p-1.5 text-sm text-right bg-slate-50 dark:bg-slate-800 rounded font-mono focus:ring-1 focus:ring-primary/20 outline-none transition-all ${customPrice ? 'text-primary font-bold border-primary/30' : 'border-transparent'}`}
                                          value={customPrice ?? res.unit_price}
                                          onChange={(e) => handleUpdatePrice(line.id, res.id, e.target.value)}
                                        />
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
