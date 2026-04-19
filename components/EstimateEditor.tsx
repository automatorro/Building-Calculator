'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, Info, ChevronDown, ChevronUp, Settings2, CheckCircle2, Lightbulb, Store, Link as LinkIcon, BookPlus, MoreVertical, Copy, Search } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { calculateLineCosts, EstimateLine, ProjectSettings, calculateProjectTotals, analyzeEstimateLine } from '@/utils/calculators/estimate'
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

  const handleUpdateManualField = (id: string, field: 'name' | 'unit' | 'unit_price', val: string) => {
    const isNumeric = field === 'unit_price'
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

  const getResourceCostBreakdown = (line: EstimateLine) => {
    const breakdown = {
      directMaterialUnit: 0,
      directLaborUnit: 0,
      directEquipmentUnit: 0,
      directTransportUnit: 0,
    }

    const resourcesToUse = ensureResourcesOverride(line)
    if (resourcesToUse.length === 0) return breakdown

    resourcesToUse.forEach((res: any) => {
      if (line.excluded_resources.includes(res.id)) return

      const price = line.custom_prices[res.id] ?? res.unit_price
      const wasteMultiplier = 1 + ((res.waste_percent || 0) / 100)
      const cost = (res.consumption || 0) * price * wasteMultiplier

      if (res.type === 'material') breakdown.directMaterialUnit += cost
      else if (res.type === 'labor') breakdown.directLaborUnit += cost
      else if (res.type === 'equipment') breakdown.directEquipmentUnit += cost
      else if (res.type === 'transport') breakdown.directTransportUnit += cost
    })

    return breakdown
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
    const itemName = line.name || line.manual_name || line.items?.name || 'Articol fără nume'
    const itemUM = line.unit || line.manual_um || line.items?.um || 'buc'
    
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
            {(() => {
              const invalidCount = lines.filter(l => !analyzeEstimateLine(l).isCalculable).length;
              if (invalidCount === 0) return null;
              return (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/30 rounded-2xl flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600">
                      <Info size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-red-900 dark:text-red-400 uppercase tracking-tight text-sm">Atenție: {invalidCount} articole neconfigurate</h4>
                      <p className="text-xs font-bold text-red-700/70 dark:text-red-500/70">Acestea vor apărea cu preț zero în oferta finală PDF.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Urgent</span>
                </div>
              );
            })()}
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
                <div key={stage} className="bg-slate-200/50 dark:bg-white/[0.02]">
                  <div className="px-6 py-3 bg-slate-300/40 dark:bg-slate-800/60 border-y border-slate-400/20 flex justify-between items-center">
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
                    const analysis = analyzeEstimateLine(line)
                    const isExpanded = expandedId === line.id
                    const isCatalogNorm = !!(line.catalog_norm_id || (line.code && !line.items))
                    const isManual = analysis.origin === 'Adăugat manual'
                    const hasCustomResources = (line.resources_override && line.resources_override.length > 0)
                    const resourceCostBreakdown = hasCustomResources ? getResourceCostBreakdown(line) : null
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
                      <div key={line.id} className={`group transition-all duration-300 ${isExpanded ? 'my-6 bg-white dark:bg-slate-900 border border-primary/20 shadow-2xl rounded-2xl ring-4 ring-primary/5 z-10 relative' : 'border-b border-slate-300/30 last:border-0 hover:bg-slate-200/20'}`}>
                        <div className={`p-4 md:p-6 transition-colors ${isExpanded ? 'rounded-t-2xl bg-white dark:bg-slate-900' : 'bg-slate-100/30'}`}>
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
                                  {line.code || line.metadata?.catalog_norm_symbol || (isManual ? 'MANUAL' : line.items!.normatives?.code || 'N/A')}
                                </span>
                                {hasCustomResources && (
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">Personalizat</span>
                                )}
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">{analysis.origin}</span>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">{analysis.source}</span>
                                {isCatalogNorm ? (
                                  <div className="flex flex-col w-full mt-1">
                                    <h4 className="font-black text-xl md:text-2xl leading-tight break-words text-slate-900 dark:text-white">{line.name || line.manual_name || '—'}</h4>
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mt-1">
                                      {!analysis.isCalculable ? (
                                        <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">{analysis.issueMessage}</span>
                                      ) : (
                                        <>
                                          <span className="text-slate-400">Cost Direct: {line.unit_price?.toLocaleString('ro-RO')} lei / {line.unit || '—'}</span>
                                          <span className="text-primary/50">→</span>
                                          <span className="text-primary">Preț Final: {(lineCosts.totalWithTVA / line.quantity).toLocaleString('ro-RO')} lei / {line.unit || '—'}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ) : isManual ? (
                                  <div className="flex-1">
                                      <textarea
                                        rows={2}
                                        className="font-black text-xl md:text-2xl leading-tight bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-primary focus:border-primary outline-none transition-all w-full resize-none overflow-hidden text-slate-900 dark:text-white pb-2 shadow-sm focus:shadow-md"
                                      value={line.name ?? line.manual_name ?? ''}
                                      placeholder="Nume reper (clic pentru a edita)..."
                                      onChange={(e) => {
                                        handleUpdateManualField(line.id, 'name', e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                      }}
                                      onFocus={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                      }}
                                    />
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 mt-2">
                                      <div className="flex flex-col gap-1 col-span-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 border-l-2 border-slate-200 ml-1">Preț Unitar Direct (Total / UM):</span>
                                        <div className="relative flex items-center">
                                          <input
                                            type="number"
                                            readOnly={hasCustomResources}
                                            className={`w-full px-3 py-2 ${hasCustomResources ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-80' : 'bg-slate-100/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400'} rounded-xl outline-none text-lg md:text-xl font-mono font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all`}
                                            value={hasCustomResources ? lineCosts.unitDirectCost : (line.unit_price ?? line.manual_price ?? 0)}
                                            onFocus={(e) => !hasCustomResources && e.currentTarget.select()}
                                            onChange={(e) => {
                                              if (!hasCustomResources) {
                                                handleUpdateManualField(line.id, 'unit_price', e.target.value)
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1 col-span-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 border-l-2 border-slate-200 ml-1">U.M.:</span>
                                          <input
                                            className="w-full px-3 py-3 bg-slate-100/60 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 rounded-xl outline-none text-xl md:text-2xl font-mono font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                                          value={line.unit ?? line.manual_um ?? (line.items?.um || '')}
                                          onChange={(e) => handleUpdateManualField(line.id, 'unit', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col w-full mt-1">
                                    <h4 className="font-black text-xl md:text-2xl leading-tight break-words text-slate-900 dark:text-white">{line.items!.name}</h4>
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mt-1">
                                      {!analysis.isCalculable ? (
                                        <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">{analysis.issueMessage}</span>
                                      ) : (
                                        <>
                                          <span className="text-slate-400">Cost Direct: {lineCosts.unitDirectCost.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei / {line.items!.um}</span>
                                          <span className="text-primary/50">→</span>
                                          <span className="text-primary font-black">Preț Final: {(lineCosts.totalWithTVA / line.quantity).toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei / {line.items!.um}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {analysis.isCalculable && (
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
                              )}
                              {resSummary && (
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                  className="text-[10px] text-slate-400 hover:text-primary transition-colors cursor-pointer mt-1"
                                >
                                  {resSummary}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-border/30">
                                      
                                <div className="relative group/quantity">
                                  <input 
                                    type="number"                                    className="w-24 px-2 bg-white dark:bg-slate-900 text-center font-black text-2xl md:text-3xl outline-none text-slate-900 dark:text-white py-3 shadow-sm hover:shadow-md focus:shadow-lg rounded-xl cursor-pointer transition-all border-2 border-slate-200 focus:border-primary"
                                    value={line.quantity}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                  />

                                </div>
                                <span className="text-sm font-bold text-slate-400 pr-2">{line.unit || (isManual ? line.manual_um : line.items!.um)}</span>
                              </div>

                              <div className="text-right min-w-[90px] md:min-w-[110px]">
                                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-widest font-black">Total</label>
                                {!analysis.isCalculable ? (
                                  <div className="inline-flex flex-col items-end animate-bounce">
                                    <span className="text-[11px] uppercase font-black px-3 py-1.5 bg-red-600 text-white rounded-lg border-2 border-red-200 shadow-lg shadow-red-500/20 whitespace-nowrap">
                                      {analysis.status}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="font-mono text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                                    {lineCosts.totalOfertatWithoutTVA.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 items-center">
                                <button 
                                  onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all border ring-1 ring-inset ${isExpanded ? 'bg-primary/10 text-primary border-primary/30 ring-primary/20 shadow-inner' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-border shadow-sm hover:text-primary hover:border-primary/50'}`}
                                  title={isExpanded ? "Restrânge rețeta" : "Editează rețeta"}
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <Settings2 size={16} />}
                                  <span>Rețetă</span>
                                  {allResources.length > 0 && (
                                    <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                      {allResources.length}
                                    </span>
                                  )}
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
                                
                                <div className="grid gap-3 mt-4">
                                  {ensureResourcesOverride(line).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4 ring-8 ring-white dark:ring-slate-950">
                                        <Plus size={24} />
                                      </div>
                                      <h6 className="font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Acest articol nu are încă o rețetă definită</h6>
                                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                        Poți folosi prețul unitar direct sau poți adăuga materiale și manoperă pentru a calcula automat costul real.
                                      </p>
                                      <button
                                        onClick={() => handleAddResource(line.id)}
                                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-xl text-xs font-black hover:bg-primary/20 transition-all border border-primary/20"
                                      >
                                        <Plus size={16} /> ÎNCEPE REȚETA NOUĂ
                                      </button>
                                    </div>
                                  ) : null}
                                  
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
                                                className="text-xl md:text-2xl font-black bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none flex-1 py-1 text-slate-900 dark:text-white"
                                                value={res.name}
                                                onChange={(e) => handleUpdateResourceField(line.id, res.id, 'name', e.target.value)}
                                              />
                                            </div>
                                            <input 
                                              className="text-sm text-slate-500 bg-transparent border-b border-border/30 focus:border-primary outline-none w-full italic font-medium py-1"
                                              placeholder="Note / Detalii adiționale..."
                                              value={res.note || ''}
                                              onChange={(e) => handleUpdateResourceField(line.id, res.id, 'note', e.target.value)}
                                            />
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-slate-500 font-black uppercase tracking-widest py-1">
                                              <div className="flex items-center gap-2">
                                                <span>Consum per 1 {line.unit || (isManual ? line.manual_um : line.items!.um)}:</span> 
                                                 <input 
                                                   type="number"
                                                   className="w-20 bg-slate-100 dark:bg-slate-800 border-b-2 border-primary/30 text-primary outline-none font-black text-center py-2 rounded-xl text-xl"
                                                   value={res.consumption}
                                                   onFocus={(e) => e.currentTarget.select()}
                                                   onChange={(e) => handleUpdateResourceField(line.id, res.id, 'consumption', e.target.value)}
                                                 />
                                                 <span className="italic text-slate-400 font-bold normal-case lowercase ml-1 whitespace-nowrap">
                                                   (total proiect: {(res.consumption * line.quantity).toLocaleString('ro-RO')} {res.um})
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
                                            <div className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-1">Preț Unitar de bază (Lei / {res.um})</div>
                                            <div className="flex items-center justify-end gap-3 mb-2">
                                              <input 
                                                type="number"
                                                disabled={isExcluded}
                                                className={`w-40 p-4 text-2xl text-right bg-white dark:bg-slate-900 border-2 rounded-2xl font-black focus:ring-8 focus:ring-primary/10 outline-none transition-all ${customPrice ? 'text-primary border-primary/40' : 'border-slate-200 text-slate-900 dark:text-white'}`}
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
                                            <div className="text-sm text-primary font-black mt-2 bg-primary/5 px-3 py-1 rounded-lg border border-primary/10 inline-block">
                                              Total: {(res.consumption * line.quantity * (customPrice ?? res.unit_price) * (1 + (res.waste_percent || 0) / 100)).toLocaleString('ro-RO', {maximumFractionDigits: 2})} lei
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
