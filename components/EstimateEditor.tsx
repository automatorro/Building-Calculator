'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, Info, ChevronDown, ChevronUp, Settings2, CheckCircle2, Lightbulb, Store, Link as LinkIcon, BookPlus, MoreVertical, Copy, Search } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')
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

  // Auto-expand new manual lines
  useEffect(() => {
    const lastManualLine = lines.find(l => l.metadata?.autoExpand)
    if (lastManualLine && expandedId !== lastManualLine.id) {
      setExpandedId(lastManualLine.id)
      // Remove the flag so it doesn't keep expanding on every render
      onUpdateLine(lastManualLine.id, { metadata: { ...lastManualLine.metadata, autoExpand: false } })
    }
  }, [lines, expandedId, onUpdateLine])

  const totals = useMemo(() => calculateProjectTotals(lines, settings), [lines, settings])

    const handleUpdateQuantity = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    onUpdateLine(id, { quantity: num })
  }

  const handleUpdateManualField = (id: string, field: 'manual_name' | 'manual_um' | 'manual_price' | 'manual_labor_price' | 'manual_equipment_price' | 'manual_transport_price', val: string) => {
    const isNumeric = field !== 'manual_name' && field !== 'manual_um'
    const newVal = isNumeric ? parseFloat(val) || 0 : val
    
    // Clear autoExpand if we're manually editing
    onUpdateLine(id, { [field]: newVal, metadata: { ...lines.find(l => l.id === id)?.metadata, autoExpand: false } })
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

          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Caută în deviz (nume rând, cod sau resursă)..."
                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-border/50 rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-border/50 font-sans">
            {Array.from(new Set(lines.map(l => l.stage_name || 'Lucrări Generale'))).map(stage => {
              const stageLines = lines.filter(l => (l.stage_name || 'Lucrări Generale') === stage)
              const filteredStageLines = stageLines.filter(line => {
                if (!searchQuery.trim()) return true
                const q = searchQuery.toLowerCase()
                const nameMatch = (line.manual_name || line.name || '').toLowerCase().includes(q)
                const codeMatch = (line.code || (line.items?.normatives?.code || '')).toLowerCase().includes(q)
                const resourcesMatch = ensureResourcesOverride(line).some((r: any) => r.name.toLowerCase().includes(q))
                return nameMatch || codeMatch || resourcesMatch
              })

              if (filteredStageLines.length === 0 && searchQuery.trim()) return null

              const isCollapsed = collapsedStages[stage] && !searchQuery.trim()
              
              return (
                <div key={stage} className="bg-slate-50/30 dark:bg-white/[0.02]">
                  <div className="px-6 py-2 bg-slate-100/50 dark:bg-slate-800/40 border-y border-border/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCollapsedStages(prev => ({ ...prev, [stage]: !prev[stage] }))}
                        className="p-1 rounded bg-white/60 dark:bg-slate-900/30 hover:bg-slate-200/60 dark:hover:bg-slate-700/40 text-slate-600 hover:text-primary transition-colors ring-1 ring-border/40"
                        aria-label={isCollapsed ? 'Extinde categoria' : 'Restrânge categoria'}
                      >
                        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      </button>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">{stage}</span>
                      <span className="text-xs font-bold text-slate-400">({filteredStageLines.length})</span>
                    </div>
                    <button 
                      onClick={() => handleAddManualLine(stage)} 
                      className="text-xs font-black text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                      <Plus size={14} /> <span>Rețetă nouă în {stage}</span>
                    </button>
                  </div>
                  
                  {!isCollapsed && filteredStageLines.map((line) => {
                    const lineCosts = calculateLineCosts(line, settings)
                    const isExpanded = expandedId === line.id
                    const isCatalogNorm = !!(line.catalog_norm_id || (line.code && !line.items))
                    const isManual = !line.items && !isCatalogNorm
                    const hasCustomResources = (line.resources_override && line.resources_override.length > 0)
                    const allResources = ensureResourcesOverride(line)
                    const resSummary = allResources.length > 0 ? (() => {
                      const counts: Record<string, number> = {}
                      allResources.forEach((r: any) => {
                        const t = r.type === 'material' ? 'materiale' : r.type === 'labor' ? 'manoperă' : r.type === 'equipment' ? 'utilaj' : 'transport'
                        counts[t] = (counts[t] || 0) + 1
                      })
                      return Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · ')
                    })() : null

                    return (
                      <div key={line.id} className="group border-b border-border/10 last:border-0">
                        <div className="p-4 md:p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
                                  {line.code || line.metadata?.catalog_norm_symbol || (isManual ? 'MANUAL' : line.items!.normatives?.code || 'N/A')}
                                </span>
                                {hasCustomResources && (
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">Personalizat</span>
                                )}
                                {isCatalogNorm ? (
                                  <div className="flex flex-col">
                                    <h4 className="font-bold text-lg md:text-xl leading-tight break-words">{line.name || line.manual_name || '—'}</h4>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                      <span>Cost Direct: {line.unit_price?.toLocaleString('ro-RO')} lei / {line.unit || '—'}</span>
                                      <span className="text-primary/50">→</span>
                                      <span className="text-primary">Preț Final: {(lineCosts.totalWithTVA / line.quantity).toLocaleString('ro-RO')} lei / {line.unit || '—'}</span>
                                    </div>
                                  </div>
                                ) : isManual ? (
                                  <div className="flex-1">
                                    <textarea
                                      rows={1}
                                      className="font-bold text-lg md:text-xl leading-snug bg-transparent border-b border-dashed border-slate-200 dark:border-slate-700 hover:border-primary focus:border-primary outline-none transition-all w-full resize-none overflow-hidden text-slate-900 dark:text-white pb-1"
                                      value={line.manual_name ?? ''}
                                      placeholder="Nume reper (clic pentru a edita)..."
                                      onChange={(e) => {
                                        handleUpdateManualField(line.id, 'manual_name', e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                      }}
                                      onFocus={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                      }}
                                    />
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                                      {[
                                        { label: 'Mat.', field: 'manual_price', color: 'sky', calcValue: lineCosts.directMaterialUnit },
                                        { label: 'Man.', field: 'manual_labor_price', color: 'orange', calcValue: lineCosts.directLaborUnit },
                                        { label: 'Util.', field: 'manual_equipment_price', color: 'emerald', calcValue: lineCosts.directEquipmentUnit },
                                        { label: 'Trans.', field: 'manual_transport_price', color: 'purple', calcValue: lineCosts.directTransportUnit }
                                      ].map(p => {
                                        const actualValue = hasCustomResources ? p.calcValue : ((line as any)[p.field] ?? 0)
                                        const finalValue = actualValue * (1 + settings.regie/100) * (1 + settings.profit/100) * (1 + settings.tva/100)
                                        
                                        return (
                                          <div key={p.field} className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex justify-between`}>
                                              <span>{p.label}</span>
                                              {hasCustomResources && <span className="text-[8px] text-primary/50">CALC</span>}
                                            </span>
                                            <div className="relative">
                                              <input
                                                type="number"
                                                readOnly={hasCustomResources}
                                                className={`w-full px-3 py-2 ${hasCustomResources ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-80' : `bg-${p.color}-50/50 dark:bg-${p.color}-900/10 border-${p.color}-200/50 dark:border-${p.color}-800/30 hover:border-${p.color}-400/50`} border rounded-lg font-mono text-slate-900 dark:text-slate-200 outline-none text-base font-black focus:ring-2 focus:ring-${p.color}-500/20 focus:border-${p.color}-500 transition-all`}
                                                value={actualValue}
                                                onFocus={(e) => !hasCustomResources && e.currentTarget.select()}
                                                onChange={(e) => !hasCustomResources && handleUpdateManualField(line.id, p.field as any, e.target.value)}
                                              />
                                              {actualValue > 0 && (
                                                <span className="absolute -bottom-4 left-1 text-[9px] font-bold text-slate-400 whitespace-nowrap">
                                                  Ofertat: {finalValue.toLocaleString('ro-RO', {maximumFractionDigits: 2})}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      })}
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 border-l-2 border-slate-200 ml-1">U.M.:</span>
                                        <input
                                          className="w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-400 rounded-lg outline-none text-base font-mono font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ml-1"
                                          value={line.manual_um ?? line.unit ?? (line.items?.um || '')}
                                          onChange={(e) => handleUpdateManualField(line.id, 'manual_um', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col">
                                    <h4 className="font-bold text-lg md:text-xl leading-tight break-words">{line.items!.name}</h4>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                      <span>Cost Direct: {lineCosts.unitDirectCost.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei / {line.items!.um}</span>
                                      <span className="text-primary/50">→</span>
                                      <span className="text-primary font-black">Preț Final: {(lineCosts.totalWithTVA / line.quantity).toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei / {line.items!.um}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Transparency Ribbon - Receipt Style */}
                              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 p-3 bg-slate-100/50 dark:bg-slate-950/20 rounded-xl border border-border/30 text-[11px] font-bold uppercase tracking-tight text-slate-500">
                                <span className="text-slate-400">Desfășurare Preț Final:</span>
                                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-border/50">
                                  <span>Bază: {(lineCosts.unitDirectCost).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <span>+</span>
                                <div className="flex items-center gap-1.5">
                                  <span>Regie ({settings.regie}%):</span>
                                  <span className="text-amber-600">{(lineCosts.regieAmount / line.quantity).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <span>+</span>
                                <div className="flex items-center gap-1.5">
                                  <span>Profit ({settings.profit}%):</span>
                                  <span className="text-emerald-600">{(lineCosts.profitAmount / line.quantity).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <span>+</span>
                                <div className="flex items-center gap-1.5">
                                  <span>TVA ({settings.tva}%):</span>
                                  <span className="text-indigo-600">{(lineCosts.tvaAmount / line.quantity).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <span className="text-primary">=</span>
                                <div className="bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20 font-black">
                                  {(lineCosts.totalWithTVA / line.quantity).toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei / {line.unit || (isManual ? line.manual_um : line.items!.um)}
                                </div>
                              </div>
                              {resSummary && (
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                  className="text-[10px] text-slate-400 hover:text-primary transition-colors cursor-pointer mt-1"
                                >
                                  {resSummary}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-4 md:gap-8 shrink-0">
                              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-border/30">
                                      
                                <div className="relative group/quantity">
                                  <input 
                                    type="number" 
                                    className="w-28 bg-transparent text-center font-black text-xl outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"
                                    value={line.quantity}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                  />

                                </div>
                                <span className="text-sm font-bold text-slate-400 pr-2">{line.unit || (isManual ? line.manual_um : line.items!.um)}</span>
                              </div>

                              <div className="text-right min-w-[120px] md:min-w-[150px]">
                                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-widest font-black">Total</label>
                                <div className="font-mono text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                                  {lineCosts.totalOfertatWithoutTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 items-center">
                                <button 
                                  onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all border ring-1 ring-inset ${isExpanded ? 'bg-primary/10 text-primary border-primary/30 ring-primary/20 shadow-inner' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-border shadow-sm hover:text-primary hover:border-primary/50'}`}
                                  title={isExpanded ? "Restrânge rețeta" : "Editează rețeta"}
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <Settings2 size={16} />}
                                  <span>Rețetă</span>
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
                              <div className="bg-slate-100/30 dark:bg-white/[0.03] p-4 md:p-8 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                      <Settings2 size={24} />
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-black uppercase tracking-widest text-primary">Rețetă Resurse & Consumuri</h5>
                                      <p className="text-xs text-slate-400 font-bold">Configurează materialele și manopera pentru acest rând</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleSaveToLibrary(line)}
                                      className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-border px-4 py-2.5 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/50 shadow-sm transition-all"
                                    >
                                      <Save size={16} /> SALVEAZĂ ÎN BIBLIOTECĂ
                                    </button>
                                    <button
                                      onClick={() => handleAddResource(line.id)}
                                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95"
                                    >
                                      <Plus size={18} /> ADAUGĂ RESURSĂ
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
                                            <div className="flex items-center gap-3">
                                              <select 
                                                value={res.type}
                                                onChange={(e) => handleUpdateResourceField(line.id, res.id, 'type', e.target.value)}
                                                className="text-xs font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700"
                                              >
                                                <option value="material">MAT</option>
                                                <option value="labor">MAN</option>
                                                <option value="equipment">UTIL</option>
                                                <option value="transport">TRANS</option>
                                              </select>
                                              <input 
                                                className="text-lg md:text-xl font-black bg-transparent border-b border-border/30 focus:border-primary outline-none flex-1 py-1"
                                                value={res.name}
                                                onChange={(e) => handleUpdateResourceField(line.id, res.id, 'name', e.target.value)}
                                              />
                                            </div>
                                            <input 
                                              className="text-sm text-slate-500 bg-transparent border-b border-border/30 focus:border-primary outline-none w-full italic font-medium py-1"
                                              placeholder="Introduceți numele resursei aici..."
                                              value={res.note || ''}
                                              onChange={(e) => handleUpdateResourceField(line.id, res.id, 'note', e.target.value)}
                                            />
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-slate-500 font-black uppercase tracking-widest py-1">
                                              <div className="flex items-center gap-2">
                                                <span>Necesar pt. 1 {line.unit || (isManual ? line.manual_um : line.items!.um)}:</span> 
                                                 <input 
                                                   type="number"
                                                   className="w-16 bg-slate-100 dark:bg-slate-800 border-b border-primary/30 text-primary outline-none font-black text-center py-1 rounded-md text-base"
                                                   value={res.consumption}
                                                   onFocus={(e) => e.currentTarget.select()}
                                                   onChange={(e) => handleUpdateResourceField(line.id, res.id, 'consumption', e.target.value)}
                                                 />
                                                 <span className="italic text-slate-400 font-bold normal-case lowercase ml-1 whitespace-nowrap">
                                                   (total: {(res.consumption * line.quantity).toLocaleString('ro-RO')} {res.um})
                                                 </span>
                                                <input 
                                                  className="w-12 bg-transparent border-b border-border/30 outline-none text-center font-bold lowercase"
                                                  value={res.um}
                                                  onChange={(e) => handleUpdateResourceField(line.id, res.id, 'um', e.target.value)}
                                                />
                                              </div>
                                              {res.type === 'material' && (
                                                <div className="flex items-center gap-2 text-orange-600 whitespace-nowrap">
                                                  <span>Pierderi:</span> 
                                                  <input 
                                                    type="number"
                                                    className="w-14 bg-orange-50 dark:bg-orange-950/20 border-b border-orange-500/30 text-orange-600 outline-none font-black text-center py-1 rounded-md text-base"
                                                    value={res.waste_percent || 0}
                                                    onFocus={(e) => e.currentTarget.select()}
                                                    onChange={(e) => handleUpdateResourceField(line.id, res.id, 'waste_percent', e.target.value)}
                                                  /> <span className="text-orange-400">%</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-6 pl-8 sm:pl-0 border-t sm:border-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-800">
                                          <div className="text-right">
                                            <div className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-1">Preț Unitar (Lei)</div>
                                             <div className="text-xs text-primary font-black mb-2">
                                               Cost rând: {(res.consumption * line.quantity * (customPrice ?? res.unit_price) * (1 + (res.waste_percent || 0) / 100)).toLocaleString('ro-RO')} lei
                                             </div>
                                            <div className="flex items-center gap-3">
                                              <input 
                                                type="number"
                                                disabled={isExcluded}
                                                className={`w-32 p-3 text-lg text-right bg-white dark:bg-slate-900 border-2 rounded-xl font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all ${customPrice ? 'text-primary border-primary/40' : 'border-border/50 text-slate-900 dark:text-white'}`}
                                                value={customPrice ?? res.unit_price}
                                                onFocus={(e) => e.currentTarget.select()}
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
              )
            })}
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
