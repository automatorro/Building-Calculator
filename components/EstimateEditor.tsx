'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, Info, ChevronDown, ChevronUp, Settings2, CheckCircle2, Lightbulb, Store, Link as LinkIcon, BookPlus, MoreVertical, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { calculateLineCosts, EstimateLine, ProjectSettings, calculateProjectTotals } from '@/utils/calculators/estimate'
import { motion, AnimatePresence } from 'framer-motion'
import VendorOfferPicker from './VendorOfferPicker'

interface EstimateEditorProps {
  projectId: string
  lines: EstimateLine[]
  settings: ProjectSettings
  dimensions: any
  onUpdateLine: (id: string, updates: Partial<EstimateLine>) => void
  onAddLine: (stageName?: string) => void
  onDeleteLine: (id: string) => void
  onDuplicateLine: (line: EstimateLine) => void
  isSaving: boolean
  isSaved: boolean
}

export default function EstimateEditor({ 
  projectId, 
  lines, 
  settings, 
  dimensions,
  onUpdateLine,
  onAddLine,
  onDeleteLine,
  onDuplicateLine,
  isSaving,
  isSaved
}: EstimateEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeOfferPicker, setActiveOfferPicker] = useState<{ resourceId: string, resourceName: string, lineId: string } | null>(null)
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({})
  const [didInitCollapse, setDidInitCollapse] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (didInitCollapse) return
    const stageOrder = Array.from(new Set(lines.map(l => l.stage_name || 'Lucrări Generale')))
    if (stageOrder.length === 0) return
    const next: Record<string, boolean> = {}
    stageOrder.forEach((s, idx) => { next[s] = idx !== 0 })
    setCollapsedStages(next)
    setDidInitCollapse(true)
  }, [didInitCollapse, lines])

  const totals = useMemo(() => calculateProjectTotals(lines, settings), [lines, settings])

    const handleUpdateQuantity = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    onUpdateLine(id, { quantity: num })
  }

  const handleUpdateManualField = (id: string, field: 'manual_name' | 'manual_um' | 'manual_price' | 'manual_labor_price' | 'manual_equipment_price' | 'manual_transport_price', val: string) => {
    const isNumeric = field !== 'manual_name' && field !== 'manual_um'
    const newVal = isNumeric ? parseFloat(val) || 0 : val
    onUpdateLine(id, { [field]: newVal })
  }

  const handleAddManualLine = (stageName?: string) => {
    onAddLine(stageName)
  }

  const handleDeleteLine = (id: string) => {
    onDeleteLine(id)
    toast.success('Rând șters.')
  }

    const handleDuplicateLine = (line: EstimateLine) => {
    onDuplicateLine(line)
  }

  const ensureResourcesOverride = (line: EstimateLine) => {
    if (line.resources_override && line.resources_override.length > 0) return line.resources_override
    return line.items?.resources ? JSON.parse(JSON.stringify(line.items.resources)) : []
  }

  const handleUpdateResourceField = (lineId: string, resId: string, field: string, val: any) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const currentResources = ensureResourcesOverride(line)
    const newResources = currentResources.map((r: any) => {
      if (r.id !== resId) return r
      const isNumeric = ['consumption', 'unit_price', 'waste_percent'].includes(field)
      return { ...r, [field]: isNumeric ? parseFloat(val) || 0 : val }
    })
    onUpdateLine(lineId, { resources_override: newResources })
  }

  const handleAddResource = (lineId: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const currentResources = ensureResourcesOverride(line)
    const newRes = {
      id: crypto.randomUUID(),
      name: 'Resursă nouă',
      type: 'material' as const,
      um: 'buc',
      consumption: 1,
      unit_price: 0,
      waste_percent: 0
    }
    onUpdateLine(lineId, { resources_override: [...currentResources, newRes] })
  }

  const handleDeleteResource = (lineId: string, resId: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const currentResources = ensureResourcesOverride(line)
    const newResources = currentResources.filter((r: any) => r.id !== resId)
    onUpdateLine(lineId, { resources_override: newResources })
  }

  const handleToggleResource = (lineId: string, resId: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const excluded = line.excluded_resources.includes(resId)
      ? line.excluded_resources.filter(id => id !== resId)
      : [...line.excluded_resources, resId]
    onUpdateLine(lineId, { excluded_resources: excluded })
  }

  const handleUpdatePrice = (lineId: string, resId: string, val: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const num = parseFloat(val) || 0
    onUpdateLine(lineId, { custom_prices: { ...line.custom_prices, [resId]: num } })
  }

  const handleSaveToLibrary = async (line: EstimateLine) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Sesiune expirată. Te rugăm să te reloghezi.')
      return
    }

    const resourcesToSave = ensureResourcesOverride(line)
    const itemName = line.manual_name || line.items?.name || 'Articol fără nume'
    const itemUM = line.manual_um || line.items?.um || 'buc'
    
    const { data: newItem, error: itemError } = await supabase
      .from('items')
      .insert([{
        name: itemName,
        um: itemUM,
        code: line.items?.code || `USER-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        category_id: line.items?.category_id,
        normative_id: line.items?.normative_id,
        user_id: user.id
      }])
      .select()
      .single()

    if (itemError) return console.error('Error saving item:', itemError)

    const resourcesToInsert = resourcesToSave.map((r: any) => ({
      item_id: newItem.id,
      type: r.type,
      name: r.name,
      um: r.um,
      quantity: r.consumption,
      default_price: line.custom_prices[r.id] ?? r.unit_price,
      waste_percent: r.waste_percent || 0,
      user_id: user.id
    }))

    const { error: resError } = await supabase.from('resources').insert(resourcesToInsert)
    if (resError) console.error('Error saving resources:', resError)
    else alert('✅ Rețetă salvată cu succes în Biblioteca Personală!')
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
      {/* Sidebar Info Proiect */}
      <div className="space-y-6 order-1 lg:order-1">
        <div className="glass-card p-6 shadow-sm" style={{ borderColor: '#E5E3DE' }}>
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
            onClick={() => {}}
            disabled={isSaving}
            className={`
              w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
              ${isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/30'
              }
            `}
          >
            {isSaving ? "Se salvează..." : isSaved ? <><CheckCircle2 size={18} /> Salvat!</> : <><Save size={18} /> Salvează Deviz</>}
          </button>
        </div>
      </div>

      {/* Tabel Deviz */}
      <div className="lg:col-span-3 order-2 lg:order-2">
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="font-bold text-lg">Centralizator Lucrări</h2>
            <button 
              onClick={() => handleAddManualLine()}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95"
            >
              <Plus size={16} /> Creează Propria Rețetă
            </button>
          </div>

          <div className="divide-y divide-border/50">
            {Array.from(new Set(lines.map(l => l.stage_name || 'Lucrări Generale'))).map(stage => (
              <div key={stage} className="bg-slate-50/30 dark:bg-white/[0.02]">
                <div className="px-6 py-2 bg-slate-100/50 dark:bg-slate-800/40 border-y border-border/30 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCollapsedStages(prev => ({ ...prev, [stage]: !prev[stage] }))}
                      className="p-1 rounded bg-white/60 dark:bg-slate-900/30 hover:bg-slate-200/60 dark:hover:bg-slate-700/40 text-slate-600 hover:text-primary transition-colors ring-1 ring-border/40"
                      aria-label={collapsedStages[stage] ? 'Extinde categoria' : 'Restrânge categoria'}
                    >
                      {collapsedStages[stage] ? <ChevronDown size={18} strokeWidth={3} /> : <ChevronUp size={18} strokeWidth={3} />}
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stage}</span>
                  </div>
                  <button onClick={() => handleAddManualLine(stage)} className="text-[9px] font-bold text-primary/70 hover:text-primary uppercase tracking-tighter hover:bg-primary/10 px-2 py-1 rounded">
                    + Rețetă nouă în {stage}
                  </button>
                </div>
                
                {!collapsedStages[stage] && lines.filter(l => (l.stage_name || 'Lucrări Generale') === stage).map((line) => {
                  const lineCosts = calculateLineCosts(line, settings)
                  const isExpanded = expandedId === line.id
                  const isCatalogNorm = !!(line.catalog_norm_id || (line.code && !line.items))
                  const isManual = !line.items && !isCatalogNorm

                  return (
                    <div key={line.id} className="group border-b border-border/10 last:border-0">
                      <div className="p-4 md:p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                                {line.code || line.metadata?.catalog_norm_symbol || (isManual ? 'MANUAL' : line.items!.normatives?.code || 'N/A')}
                              </span>
                              {isCatalogNorm ? (
                                <h4 className="font-bold text-base md:text-lg leading-tight">{line.name || line.manual_name || '—'}</h4>
                              ) : isManual ? (
                                <input
                                  className="font-bold text-base md:text-lg leading-tight bg-transparent border-b border-dashed border-transparent hover:border-border/50 focus:border-primary outline-none transition-all w-full max-w-md"
                                  value={line.manual_name ?? ''}
                                  onChange={(e) => handleUpdateManualField(line.id, 'manual_name', e.target.value)}
                                />
                              ) : (
                                <h4 className="font-bold text-base md:text-lg leading-tight">{line.items!.name}</h4>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                              {isCatalogNorm ? (
                                <span>
                                  {(line.unit_price ?? 0) > 0
                                    ? `${line.unit_price!.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lei / ${line.unit || '—'}`
                                    : `Preț necompletat · ${line.unit || '—'} · ${line.category || ''}`
                                  }
                                </span>
                              ) : isManual ? (
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">Material:</span>
                                    <input
                                      type="number"
                                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950/40 border border-primary/30 hover:border-primary/50 rounded-lg font-mono text-primary outline-none text-[11px] sm:text-[12px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                                      value={line.manual_price ?? 0}
                                      onChange={(e) => handleUpdateManualField(line.id, 'manual_price', e.target.value)}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">Manoperă:</span>
                                    <input
                                      type="number"
                                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950/40 border border-primary/30 hover:border-primary/50 rounded-lg font-mono text-orange-500 outline-none text-[11px] sm:text-[12px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                                      value={line.manual_labor_price ?? 0}
                                      onChange={(e) => handleUpdateManualField(line.id, 'manual_labor_price', e.target.value)}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">Utilaje:</span>
                                    <input
                                      type="number"
                                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950/40 border border-primary/30 hover:border-primary/50 rounded-lg font-mono text-blue-500 outline-none text-[11px] sm:text-[12px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                                      value={line.manual_equipment_price ?? 0}
                                      onChange={(e) => handleUpdateManualField(line.id, 'manual_equipment_price', e.target.value)}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">Transport:</span>
                                    <input
                                      type="number"
                                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950/40 border border-primary/30 hover:border-primary/50 rounded-lg font-mono text-purple-500 outline-none text-[11px] sm:text-[12px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                                      value={line.manual_transport_price ?? 0}
                                      onChange={(e) => handleUpdateManualField(line.id, 'manual_transport_price', e.target.value)}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 border-l pl-2 border-border/30 ml-1">
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">Unitate:</span>
                                    <input
                                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950/40 border border-primary/30 hover:border-primary/50 rounded-lg outline-none text-[11px] sm:text-[12px] font-mono font-bold text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                                      value={line.manual_um ?? ''}
                                      onChange={(e) => handleUpdateManualField(line.id, 'manual_um', e.target.value)}
                                    />
                                  </div>
                                </div>
                              ) : (
                                `${lineCosts.unitDirectCost.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lei direct / ${line.items!.um}`
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 md:gap-8 shrink-0">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-border/30">
                                    
                              <div className="relative group/quantity">
                                <input 
                                  type="number" 
                                  className="w-24 bg-transparent text-center font-black text-lg outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"
                                  value={line.quantity}
                                  onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                />

                              </div>
                              <span className="text-xs font-bold text-slate-400 pr-2">{line.unit || (isManual ? line.manual_um : line.items!.um)}</span>
                            </div>

                            <div className="text-right min-w-[100px] md:min-w-[120px]">
                              <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-black">Total</label>
                              <div className="font-mono text-lg md:text-xl font-black text-slate-900 dark:text-white">
                                {lineCosts.totalOfertatWithoutTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 items-center">
                              <button 
                                onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                title={isExpanded ? "Restrânge detalii" : "Extinde detalii"}
                              >
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                              <button
                                onClick={() => handleDuplicateLine(line)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Duplică rând"
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Șterge rând"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
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
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-primary">
                                  <Settings2 size={16} />
                                  <h5 className="text-[11px] font-black uppercase tracking-widest">Rețetă Resurse & Consumuri</h5>
                                </div>
                                <div className="flex items-center gap-4">
                                  <button 
                                    onClick={() => handleSaveToLibrary(line)}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary flex items-center gap-1.5 transition-colors border border-border/50 px-3 py-1.5 rounded-lg"
                                    title="Salvează această variantă optimizată în Catalog"
                                  >
                                    <BookPlus size={12} /> Salvează în Bibliotecă
                                  </button>
                                  <button 
                                    onClick={() => handleAddResource(line.id)}
                                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                                  >
                                    <Plus size={12} /> Adaugă Resursă
                                  </button>
                                </div>
                              </div>
                              
                              <div className="grid gap-3">
                                {ensureResourcesOverride(line).map((res: any) => {
                                  const isExcluded = line.excluded_resources.includes(res.id)
                                  const customPrice = line.custom_prices[res.id]
                                  
                                  return (
                                    <div 
                                      key={res.id} 
                                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${isExcluded ? 'opacity-40 grayscale bg-slate-100 dark:bg-slate-900/50 border-transparent' : 'bg-white dark:bg-slate-900 border-border shadow-sm group/res'}`}
                                    >
                                      <div className="flex items-center gap-4 flex-1">
                                        <input 
                                          type="checkbox" 
                                          checked={!isExcluded}
                                          onChange={() => handleToggleResource(line.id, res.id)}
                                          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary shrink-0"
                                        />
                                        <div className="flex-1 space-y-2">
                                          <div className="flex items-center gap-2">
                                            <select 
                                              value={res.type}
                                              onChange={(e) => handleUpdateResourceField(line.id, res.id, 'type', e.target.value)}
                                              className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border-none outline-none"
                                            >
                                              <option value="material">Mat</option>
                                              <option value="labor">Man</option>
                                              <option value="equipment">Util</option>
                                              <option value="transport">Trans</option>
                                            </select>
                                            <input 
                                              className="text-sm font-bold bg-transparent border-b border-border/30 focus:border-primary outline-none flex-1"
                                              value={res.name}
                                              onChange={(e) => handleUpdateResourceField(line.id, res.id, 'name', e.target.value)}
                                            />
                                          </div>
                                          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                            <div className="flex items-center gap-1">
                                              Necesar pt. 1 {line.unit || (isManual ? line.manual_um : line.items!.um)}: 
                                               <input 
                                                 type="number"
                                                 className="w-12 bg-transparent border-b border-border/30 text-primary outline-none font-bold"
                                                 value={res.consumption}
                                                 onChange={(e) => handleUpdateResourceField(line.id, res.id, 'consumption', e.target.value)}
                                               />
                                               <span className="italic text-slate-400 font-normal ml-1">
                                                 (Total necesar: {(res.consumption * line.quantity).toLocaleString('ro-RO')} {res.um})
                                               </span>
                                              <input 
                                                className="w-8 bg-transparent border-b border-border/30 outline-none"
                                                value={res.um}
                                                onChange={(e) => handleUpdateResourceField(line.id, res.id, 'um', e.target.value)}
                                              />
                                            </div>
                                            {res.type === 'material' && (
                                              <div className="flex items-center gap-1 text-orange-500">
                                                Pierderi: 
                                                <input 
                                                  type="number"
                                                  className="w-8 bg-transparent border-b border-orange-500/30 text-orange-500 outline-none font-mono"
                                                  value={res.waste_percent || 0}
                                                  onChange={(e) => handleUpdateResourceField(line.id, res.id, 'waste_percent', e.target.value)}
                                                /> %
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-3 pl-8 sm:pl-0 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                                        <div className="text-right">
                                          <div className="text-[9px] text-slate-400 uppercase font-black">Preț Unitar (Lei)</div>
                                           <div className="text-[10px] text-primary font-bold">
                                             Cost total: {(res.consumption * line.quantity * (customPrice ?? res.unit_price) * (1 + (res.waste_percent || 0) / 100)).toLocaleString('ro-RO')} lei
                                           </div>
                                          <div className="flex items-center gap-2">
                                            <input 
                                              type="number"
                                              disabled={isExcluded}
                                              className={`w-24 p-1.5 text-sm text-right bg-slate-50 dark:bg-slate-800 rounded font-mono focus:ring-1 focus:ring-primary/20 outline-none transition-all ${customPrice ? 'text-primary font-bold border-primary/30' : 'border-transparent'}`}
                                              value={customPrice ?? res.unit_price}
                                              onChange={(e) => handleUpdatePrice(line.id, res.id, e.target.value)}
                                            />
                                            <button 
                                              onClick={() => setActiveOfferPicker({ resourceId: res.id, resourceName: res.name, lineId: line.id })}
                                              className={`p-1.5 rounded bg-slate-100 dark:bg-slate-700 hover:text-primary transition-all ${customPrice ? 'text-primary' : 'text-slate-400'}`}
                                              title="Compară prețuri magazine"
                                            >
                                              <Store size={14} />
                                            </button>
                                            <button 
                                              onClick={() => handleDeleteResource(line.id, res.id)}
                                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover/res:opacity-100"
                                            >
                                              <Trash2 size={12} />
                                            </button>
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
            ))}
          </div>
        </div>
      </div>

      {activeOfferPicker && (
        <VendorOfferPicker 
          projectId={projectId}
          resourceId={activeOfferPicker.resourceId}
          resourceName={activeOfferPicker.resourceName}
          onSelect={(price) => {
            handleUpdatePrice(activeOfferPicker.lineId, activeOfferPicker.resourceId, price.toString())
          }}
          onClose={() => setActiveOfferPicker(null)}
        />
      )}
    </div>
  )
}
