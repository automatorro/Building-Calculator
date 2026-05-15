'use client'

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Trash2, Save, Info, ChevronDown, ChevronUp, Settings2, CheckCircle2, Lightbulb, Store, Link as LinkIcon, BookPlus, MoreVertical, Copy, Search, AlertCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { calculateLineCosts, EstimateLine, ProjectSettings, calculateProjectTotals, analyzeEstimateLine } from '@/utils/calculators/estimate'
import { motion, AnimatePresence } from 'framer-motion'
import VendorOfferPicker from './VendorOfferPicker'
import EstimateImporter from './EstimateImporter'
import { FileSpreadsheet } from 'lucide-react'
import { fmtRon } from '@/utils/format'
import ProjectSettingsPanel from './ProjectSettingsPanel'

interface EstimateEditorProps {
  projectId: string
  lines: EstimateLine[]
  settings: ProjectSettings
  dimensions: any
  onUpdateLine: (id: string, updates: Partial<EstimateLine>) => void
  onAddLine: (stageName?: string) => void
  onDeleteLine: (id: string) => void
  onDuplicateLine: (line: EstimateLine) => void
  onImport: (lines: EstimateLine[]) => void
  onUpdateSettings: (settings: ProjectSettings) => void
  isSaving: boolean
  isSaved: boolean
}

function detectLineIssues(line: EstimateLine, isManual: boolean): { code: string; message: string }[] {
  const issues: { code: string; message: string }[] = []
  const resources: any[] = (line.resources_override && line.resources_override.length > 0
    ? line.resources_override
    : line.items?.resources) || []
  const excluded = line.excluded_resources || []
  const customPrices = line.custom_prices || {}

  if (!isManual && resources.length === 0) {
    issues.push({ code: 'NO_RECIPE', message: 'Lipsă rețetă — nicio resursă definită' })
    return issues
  }

  if (isManual && resources.length === 0) {
    const description = (line.name || line.manual_name || '').trim()
    const price = line.unit_price ?? (line as any).manual_price ?? 0
    if (description.length >= 10 && price > 0) {
      issues.push({ code: 'MANUAL_NO_RECIPE', message: 'Fără defalcare pe resurse — AI poate genera una' })
    }
    return issues
  }

  const active = resources.filter((r: any) => !excluded.includes(r.id))
  if (active.length > 0) {
    const zeroQ = active.filter((r: any) => !r.consumption || r.consumption === 0)
    if (zeroQ.length > 0)
      issues.push({ code: 'ZERO_CONSUMPTION', message: `${zeroQ.length} ${zeroQ.length === 1 ? 'resursă' : 'resurse'} cu consum 0` })

    const allZeroPrice = active.every((r: any) => !(customPrices[r.id] ?? r.unit_price))
    if (allZeroPrice)
      issues.push({ code: 'ZERO_PRICE', message: 'Toate resursele active au prețul 0' })

    if (!isManual) {
      const hasMaterial = active.some((r: any) => r.type === 'material')
      const hasLabor = active.some((r: any) => r.type === 'labor')
      if (hasMaterial && !hasLabor)
        issues.push({ code: 'MISSING_LABOR', message: 'Rețeta nu include manoperă' })
    }
  }

  return issues
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
  onImport,
  onUpdateSettings,
  isSaving,
  isSaved
}: EstimateEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeOfferPicker, setActiveOfferPicker] = useState<{ resourceId: string, resourceName: string, lineId: string } | null>(null)
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({})
  const [didInitCollapse, setDidInitCollapse] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showImporter, setShowImporter] = useState(false)
  const [activeBadgeId, setActiveBadgeId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{
    lineId: string
    loading: boolean
    error: string | null
    explanation: string
    resources: Array<{
      id: string
      name: string
      type: 'material' | 'labor' | 'equipment' | 'transport'
      um: string
      consumption: number
      unit_price: number
      waste_percent: number
    }>
  } | null>(null)
  const supabase = createClient()

  useEffect(() => { setMounted(true) }, [])

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
      const taxeManoperaMultiplier = res.type === 'labor'
        ? (1 + (settings.taxe_manopera || 0) / 100)
        : 1
      const cost = (res.consumption || 0) * price * wasteMultiplier * taxeManoperaMultiplier

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

  const generateAiRecipe = async (line: EstimateLine) => {
    const lineUnit = line.unit || line.manual_um || line.items?.um || 'buc'
    const lineName = line.name || line.manual_name || line.items?.name || ''
    const lineAnalysis = analyzeEstimateLine(line)
    const isManualLine = lineAnalysis.origin === 'Adăugat manual'
    const hasResources = (line.resources_override && line.resources_override.length > 0) || (line.items?.resources && line.items.resources.length > 0)
    const existingUnitPrice = isManualLine && !hasResources
      ? ((line.unit_price ?? (line as any).manual_price) || null)
      : null
    setAiSuggestion({ lineId: line.id, loading: true, error: null, explanation: '', resources: [] })
    try {
      const res = await fetch('/api/ai/suggest-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineName,
          lineCode: line.code || line.items?.normatives?.code || '',
          lineUnit,
          quantity: line.quantity,
          stageName: line.stage_name || '',
          dimensions,
          existingUnitPrice,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Eroare server')
      setAiSuggestion({ lineId: line.id, loading: false, error: null, explanation: data.explanation, resources: data.resources })
    } catch (e: any) {
      setAiSuggestion(prev => prev ? { ...prev, loading: false, error: e.message || 'Eroare la generarea rețetei.' } : null)
    }
  }

  const updateSuggestedResource = (idx: number, field: string, value: string | number) => {
    setAiSuggestion(prev => {
      if (!prev) return prev
      const resources = [...prev.resources]
      resources[idx] = { ...resources[idx], [field]: value }
      return { ...prev, resources }
    })
  }

  const applyAiRecipe = (lineId: string) => {
    if (!aiSuggestion || !aiSuggestion.resources.length) return
    onUpdateLine(lineId, { resources_override: aiSuggestion.resources })
    setAiSuggestion(null)
    setActiveBadgeId(null)
    setExpandedId(lineId)
    toast.success('✨ Rețetă AI aplicată! Verifică și ajustează consumurile.')
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 md:gap-8">
      {/* Sidebar Info Proiect */}
      <div className="space-y-4 md:space-y-6 order-1 lg:order-1">
        <div className="glass-card p-4 md:p-6 shadow-sm" style={{ borderColor: '#E5E3DE' }}>
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Recapitulație Proiect</h3>
            <ProjectSettingsPanel settings={settings} onSave={onUpdateSettings} variant="minimal" />
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-slate-500">Profit:</span>
              <span className="font-bold">{settings.profit}%</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-slate-500">Regie:</span>
              <span className="font-bold">{settings.regie}%</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm border-t pt-2 border-border/50">
              <span className="text-slate-500">TVA:</span>
              <span className="font-bold">{settings.tva}%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-[9px] text-slate-400 italic leading-relaxed">
              💡 Marjele comerciale se aplică peste costul direct al resurselor. 
              Modifică-le folosind iconița <Settings2 size={10} className="inline" /> de mai sus.
            </p>
          </div>
        </div>

        <div className="glass-card p-5 md:p-6 bg-slate-900 text-white sticky top-4 z-20 shadow-2xl lg:shadow-none rounded-2xl">
          <h3 className="font-bold mb-3 md:mb-4 uppercase text-[10px] tracking-widest text-slate-400">Total Proiect</h3>
          <div className="text-2xl md:text-3xl font-black text-primary mb-1">
            {fmtRon(totals.totalWithTVA)} Lei
          </div>
          <div className="text-[10px] text-slate-400 mb-4 md:mb-6 font-bold uppercase tracking-wide">Inclusiv TVA</div>
          
          <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-300 mb-4 md:mb-6">
            <div className="flex justify-between">
              <span>Cost Execuție:</span>
              <span className="font-mono">{fmtRon(totals.totalDirect)} Lei</span>
            </div>
            <div className="flex justify-between">
              <span>Vânzare (fără TVA):</span>
              <span className="font-mono">{fmtRon(totals.totalOfertat)} Lei</span>
            </div>
          </div>

          <button 
            onClick={() => {}}
            disabled={isSaving}
            className={`
              w-full py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
              ${isSaved 
                ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/30'
              }
            `}
          >
            {isSaving ? "Se salvează..." : isSaved ? <><CheckCircle2 size={16} /> Salvat!</> : <><Save size={16} /> Salvează Deviz</>}
          </button>
        </div>
      </div>

      {/* Tabel Deviz */}
      <div className="lg:col-span-3 order-2 lg:order-2">
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="font-bold text-lg">Centralizator Lucrări</h2>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowImporter(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-black border border-border/50 transition-all active:scale-95 shadow-sm"
              >
                <FileSpreadsheet size={16} /> Importă din Excel
              </button>
              <button 
                onClick={() => handleAddManualLine()}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95"
              >
                <Plus size={16} /> Creează Rețetă Nouă
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-border/50">
            {(() => {
              const invalidCount = lines.filter(l => !analyzeEstimateLine(l).isCalculable).length;
              const issueCount = lines.filter(l => {
                const a = analyzeEstimateLine(l)
                return detectLineIssues(l, a.origin === 'Adăugat manual').length > 0
              }).length;
              if (invalidCount === 0 && issueCount === 0) return null;
              return (
                <div className="space-y-3 mb-4">
                  {invalidCount > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/30 rounded-2xl flex items-center justify-between animate-pulse">
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
                  )}
                  {issueCount > 0 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white shadow-md shadow-amber-400/40 shrink-0">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight text-sm">
                            ✨ {issueCount} {issueCount === 1 ? 'articol cu problemă de rețetă' : 'articole cu probleme în rețete'}
                          </h4>
                          <p className="text-xs font-bold text-amber-700/70 dark:text-amber-500/70">
                            Caută indicatoarele ✨ de pe fiecare linie pentru detalii și corecții rapide.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-md shadow-amber-400/30 shrink-0">Analiză AI</span>
                    </div>
                  )}
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
                <div key={stage} className="bg-slate-200/50 dark:bg-slate-800/30">
                  <div className="px-6 py-3 bg-slate-300/40 dark:bg-slate-700/50 border-y border-slate-400/20 dark:border-slate-600/40 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCollapsedStages(prev => ({ ...prev, [stage]: !prev[stage] }))}
                        className="p-1 rounded bg-white/60 dark:bg-slate-800/80 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors ring-1 ring-border/40 dark:ring-slate-600/40"
                        aria-label={isCollapsed ? 'Extinde categoria' : 'Restrânge categoria'}
                      >
                        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      </button>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">{stage}</span>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400">({filteredStageLines.length})</span>
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
                    const lineIssues = detectLineIssues(line, isManual)
                    const isHintOnly = lineIssues.length > 0 && lineIssues.every(i => i.code === 'MANUAL_NO_RECIPE')
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
                      <div key={line.id} className={`group transition-all duration-300 ${isExpanded ? 'my-6 bg-white dark:bg-slate-900 border border-primary/20 shadow-2xl rounded-2xl ring-4 ring-primary/5 z-10 relative' : 'border-b border-slate-300/30 dark:border-slate-700/40 last:border-0 hover:bg-slate-200/20 dark:hover:bg-slate-700/30'}`}>
                        <div className={`p-4 md:p-6 transition-colors ${isExpanded ? 'rounded-t-2xl bg-white dark:bg-slate-900' : 'bg-slate-100/30 dark:bg-slate-800/20'}`}>
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-col w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
                                      {line.code || line.metadata?.catalog_norm_symbol || (isManual ? 'MANUAL' : line.items!.normatives?.code || 'N/A')}
                                    </span>
                                    {hasCustomResources && (
                                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full shrink-0">Personalizat</span>
                                    )}
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded-full shrink-0">{analysis.origin}</span>
                                  </div>
                                  {lineIssues.length > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveBadgeId(activeBadgeId === line.id ? null : line.id)
                                      }}
                                      className={`flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-[11px] font-black shadow-lg transition-all hover:scale-105 active:scale-95 ring-2 ring-offset-1 shrink-0 ${
                                        isHintOnly
                                          ? 'bg-gradient-to-r from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600 shadow-indigo-400/50 ring-indigo-300'
                                          : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 shadow-amber-400/50 ring-amber-300'
                                      }`}
                                    >
                                      <Sparkles size={12} className="shrink-0 fill-white" />
                                      <span>{isHintOnly ? '✨ Completează cu AI' : `✨ ${lineIssues.length} ${lineIssues.length === 1 ? 'problemă' : 'probleme'}`}</span>
                                    </button>
                                  )}
                                </div>

                                {isCatalogNorm ? (
                                  <div className="flex flex-col w-full">
                                    <h4 className="font-black text-lg md:text-2xl leading-tight break-words text-slate-900 dark:text-white">{line.name || line.manual_name || '—'}</h4>
                                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm font-bold uppercase tracking-wide mt-1.5 px-3 py-2 ${!analysis.isCalculable ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300'} rounded-lg border border-transparent`}>
                                      {!analysis.isCalculable ? (
                                        <>
                                          <AlertCircle size={14} className="shrink-0" />
                                          <span>{analysis.issueMessage}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>Cost net: {fmtRon(lineCosts.unitDirectCost)} lei / {line.unit || '—'}</span>
                                          <span className="text-primary font-black">Preț/buc cu TVA: {fmtRon(lineCosts.totalWithTVA / line.quantity)} / {line.unit}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ) : isManual ? (
                                  <div className="flex-1">
                                      <textarea
                                        rows={1}
                                        className="font-black text-lg md:text-2xl leading-tight bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-primary focus:border-primary outline-none transition-all w-full resize-none overflow-hidden text-slate-900 dark:text-white pb-1"
                                      value={line.name ?? line.manual_name ?? ''}
                                      placeholder="Nume reper..."
                                      onChange={(e) => {
                                        handleUpdateManualField(line.id, 'name', e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                      }}
                                    />
                                    <div className="grid grid-cols-5 gap-2 mt-3">
                                      <div className="flex flex-col gap-1 col-span-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Preț Unitar Direct:</span>
                                        <div className="relative flex items-center">
                                          <input
                                            type="number"
                                            readOnly={hasCustomResources}
                                            className={`w-full px-2 py-1.5 ${hasCustomResources ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border border-slate-200'} rounded-lg outline-none text-base font-mono font-black text-slate-900 dark:text-white focus:border-primary transition-all`}
                                            value={hasCustomResources ? lineCosts.unitDirectCost : (line.unit_price ?? line.manual_price ?? 0)}
                                            onChange={(e) => !hasCustomResources && handleUpdateManualField(line.id, 'unit_price', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1 col-span-2">
                                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">U.M.:</span>
                                         <div className="flex gap-1">
                                           <input
                                             className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 rounded-lg outline-none text-base font-mono font-black text-slate-900 dark:text-white focus:border-primary transition-all"
                                             value={line.unit ?? line.manual_um ?? (line.items?.um || '')}
                                             onChange={(e) => handleUpdateManualField(line.id, 'unit', e.target.value)}
                                           />
                                           <select
                                             value={line.metadata?.resource_type || 'material'}
                                             onChange={e => onUpdateLine(line.id, { 
                                               metadata: { ...line.metadata, resource_type: e.target.value }
                                             })}
                                             className="px-1 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 rounded-lg outline-none text-[10px] font-black uppercase text-slate-600 focus:border-primary transition-all"
                                           >
                                             <option value="material">MAT</option>
                                             <option value="labor">MAN</option>
                                             <option value="equipment">UTIL</option>
                                             <option value="transport">TRA</option>
                                           </select>
                                         </div>
                                       </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col w-full">
                                    <h4 className="font-black text-lg md:text-2xl leading-tight break-words text-slate-900 dark:text-white">{line.items!.name}</h4>
                                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm font-bold uppercase tracking-wide mt-1.5 px-3 py-2 ${!analysis.isCalculable ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300'} rounded-lg border border-transparent`}>
                                      {!analysis.isCalculable ? (
                                        <>
                                          <AlertCircle size={14} className="shrink-0" />
                                          <span>{analysis.issueMessage}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>Cost net: {fmtRon(lineCosts.unitDirectCost)} lei / {line.items!.um}</span>
                                          <span className="text-primary font-black">Preț/buc cu TVA: {fmtRon(lineCosts.totalWithTVA / line.quantity)} lei</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {analysis.isCalculable && (
                                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 p-3 bg-slate-100/50 dark:bg-slate-700/40 rounded-xl border border-border/30 dark:border-slate-600/30 text-[11px] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-300">
                                  <span className="text-slate-400 dark:text-slate-400">Desfășurare Preț Final:</span>
                                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-border/50 dark:border-slate-600/50">
                                    <span>Bază: {fmtRon(lineCosts.unitDirectCost)}</span>
                                  </div>
                                  <span>+</span>
                                  <div className="flex items-center gap-1.5">
                                    <span>Regie ({settings.regie}%):</span>
                                    <span className="text-amber-600">{fmtRon(lineCosts.regieAmount / line.quantity)}</span>
                                  </div>
                                  <span>+</span>
                                  <div className="flex items-center gap-1.5">
                                    <span>Profit ({settings.profit}%):</span>
                                    <span className="text-emerald-600">{fmtRon(lineCosts.profitAmount / line.quantity)}</span>
                                  </div>
                                  <span>+</span>
                                  <div className="flex items-center gap-1.5">
                                    <span>TVA ({settings.tva}%):</span>
                                    <span className="text-indigo-600">{fmtRon(lineCosts.tvaAmount / line.quantity)}</span>
                                  </div>
                                  <span className="text-primary">=</span>
                                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20 font-black">
                                    {fmtRon(lineCosts.totalWithTVA / line.quantity)} lei / {line.unit || (isManual ? line.manual_um : line.items!.um)}
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

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-100 dark:border-slate-800">
                               <div className="flex items-center justify-between sm:justify-start gap-4">
                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-border/30">
                                  <div className="relative">
                                    <input 
                                      type="number"
                                      className="w-20 sm:w-24 px-2 bg-white dark:bg-slate-900 text-center font-black text-xl md:text-3xl outline-none text-slate-900 dark:text-white py-2 shadow-sm rounded-lg border-2 border-slate-200 focus:border-primary"
                                      value={line.quantity}
                                      onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-slate-400 pr-2">{line.unit || (isManual ? line.manual_um : line.items!.um)}</span>
                                </div>

                                <div className="text-right flex-1 min-w-[140px]">
                                  {!analysis.isCalculable ? (
                                    <div className="animate-pulse bg-red-600 text-white text-[10px] font-black px-3 py-2 rounded-lg shadow-md flex items-center gap-2 whitespace-nowrap">
                                      <AlertCircle size={12} className="shrink-0" />
                                      <span>{analysis.status}</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Total cu TVA</div>
                                      <div className="font-mono text-xl md:text-3xl font-black text-slate-900 dark:text-white">
                                        {fmtRon(lineCosts.totalWithTVA)}
                                        <span className="text-xs ml-1">lei</span>
                                      </div>
                                      <div className="text-xs text-slate-500 font-mono">
                                        fără TVA: <span className="font-bold">{fmtRon(lineCosts.totalOfertatWithoutTVA)}</span> lei
                                      </div>
                                      <div className="text-xs text-indigo-500 font-mono font-bold">
                                        TVA {settings.tva}%: {fmtRon(lineCosts.tvaAmount)} lei
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex sm:flex-col gap-2 items-center justify-between sm:justify-center bg-slate-50 dark:bg-slate-800/30 p-2 sm:p-0 rounded-xl sm:bg-transparent">
                                <button 
                                  onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black transition-all border ${isExpanded ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-border hover:border-primary'}`}
                                >
                                  {isExpanded ? <ChevronUp size={14} /> : <Settings2 size={14} />}
                                  <span>{allResources.length > 0 ? `${allResources.length} Resurse` : 'Rețetă'}</span>
                                </button>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDuplicateLine(line)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-white transition-colors"
                                  >
                                    <Copy size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteLine(line.id)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
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
                              className="overflow-hidden bg-slate-50/50 dark:bg-slate-800/40 border-t border-border/30 dark:border-slate-700/50"
                            >
                              <div className="bg-slate-100/30 dark:bg-slate-900/60 p-4 md:p-8 space-y-8">
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
                                        className={`flex flex-col p-4 rounded-2xl border transition-all gap-4 ${isExcluded ? 'opacity-40 grayscale bg-slate-100 dark:bg-slate-900/50 border-transparent' : 'bg-white dark:bg-slate-900 border-border shadow-sm group/res'}`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <input 
                                            type="checkbox" 
                                            checked={!isExcluded}
                                            onChange={() => handleToggleResource(line.id, res.id)}
                                            className="w-5 h-5 mt-1 rounded border-slate-300 text-primary focus:ring-primary shrink-0"
                                          />
                                          <div className="flex-1 space-y-3">
                                            <div className="flex flex-col gap-2">
                                              <div className="flex items-center gap-2">
                                                <select 
                                                  value={res.type}
                                                  onChange={(e) => handleUpdateResourceField(line.id, res.id, 'type', e.target.value)}
                                                  className="text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700"
                                                >
                                                  <option value="material">MAT</option>
                                                  <option value="labor">MAN</option>
                                                  <option value="equipment">UTIL</option>
                                                  <option value="transport">TRANS</option>
                                                </select>
                                                <input 
                                                  className="text-base md:text-2xl font-black bg-transparent border-b border-primary/10 focus:border-primary outline-none flex-1 py-0.5 text-slate-900 dark:text-white"
                                                  value={res.name}
                                                  onChange={(e) => handleUpdateResourceField(line.id, res.id, 'name', e.target.value)}
                                                />
                                              </div>
                                              <input 
                                                className="text-xs text-slate-500 bg-transparent outline-none w-full italic"
                                                placeholder="Note / Detalii..."
                                                value={res.note || ''}
                                                onChange={(e) => handleUpdateResourceField(line.id, res.id, 'note', e.target.value)}
                                              />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
                                              <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase text-slate-400">Consum / {line.unit || 'UM'}</span>
                                                <div className="flex items-center gap-2">
                                                  <input 
                                                    type="number"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none text-primary outline-none font-black text-center py-1.5 rounded-lg text-base"
                                                    value={res.consumption}
                                                    onChange={(e) => handleUpdateResourceField(line.id, res.id, 'consumption', e.target.value)}
                                                  />
                                                  <span className="text-xs font-bold text-slate-400">{res.um}</span>
                                                </div>
                                              </div>
                                              <div className="space-y-1 text-right">
                                                <span className="text-[9px] font-black uppercase text-slate-400">Preț / {res.um}</span>
                                                <div className="flex items-center justify-end gap-2">
                                                  <input 
                                                    type="number"
                                                    disabled={isExcluded}
                                                    className={`w-full p-1.5 text-right bg-slate-50 dark:bg-slate-800 border-none rounded-lg font-black outline-none ${customPrice ? 'text-primary' : 'text-slate-900 dark:text-white'}`}
                                                    value={customPrice ?? res.unit_price}
                                                    onChange={(e) => handleUpdatePrice(line.id, res.id, e.target.value)}
                                                  />
                                                  <button 
                                                    onClick={() => setActiveOfferPicker({ resourceId: res.id, resourceName: res.name, lineId: line.id })}
                                                    className={`p-1 rounded bg-slate-100 dark:bg-slate-700 ${customPrice ? 'text-primary' : 'text-slate-400'}`}
                                                  >
                                                    <Store size={12} />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-2 text-[10px] font-black uppercase text-slate-400">
                                              <span>Total Resursă:</span>
                                              <span className="text-primary font-black text-sm">
                                                {fmtRon(res.consumption * line.quantity * (customPrice ?? res.unit_price) * (1 + (res.waste_percent || 0) / 100))} lei
                                              </span>
                                            </div>
                                          </div>

                                          <button 
                                            onClick={() => handleDeleteResource(line.id, res.id)}
                                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 transition-all self-center"
                                          >
                                            <Trash2 size={16} />
                                          </button>
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

      {mounted && activeBadgeId && (() => {
        const activeLine = lines.find(l => l.id === activeBadgeId)
        if (!activeLine) return null
        const activeAnalysis = analyzeEstimateLine(activeLine)
        const activeIsManual = activeAnalysis.origin === 'Adăugat manual'
        const activeLineIssues = detectLineIssues(activeLine, activeIsManual)
        const activeIsHintOnly = activeLineIssues.length > 0 && activeLineIssues.every(i => i.code === 'MANUAL_NO_RECIPE')
        const activeUnit = activeLine.unit || activeLine.manual_um || activeLine.items?.um || 'UM'

        return createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/30 md:bg-black/20"
              style={{ zIndex: 9998 }}
              onClick={() => setActiveBadgeId(null)}
            />
            <div
              className={`fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:top-[8vh] md:w-[420px] bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-2xl shadow-2xl border-t-2 md:border-2 flex flex-col overflow-hidden max-h-[92vh] md:max-h-[82vh] ${
                activeIsHintOnly ? 'border-indigo-300 dark:border-indigo-700' : 'border-amber-300 dark:border-amber-700'
              }`}
              style={{ zIndex: 9999 }}
            >
              {/* Mobile drag handle */}
              <div className="md:hidden w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 shrink-0" />
              {/* Header */}
              <div className={`bg-gradient-to-r px-4 py-2.5 flex items-center gap-2 shrink-0 ${
                activeIsHintOnly ? 'from-indigo-400 to-violet-500' : 'from-amber-400 to-orange-400'
              }`}>
                <Sparkles size={14} className="text-white fill-white shrink-0" />
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  {aiSuggestion?.lineId === activeLine.id && !aiSuggestion.loading && !aiSuggestion.error && aiSuggestion.resources.length > 0
                    ? 'Rețetă AI Generată — Editează & Aplică'
                    : activeIsHintOnly ? 'Completează Rețeta cu AI' : 'Analiză AI — Probleme Detectate'}
                </span>
              </div>

              {/* Phase 1 */}
              {(!aiSuggestion || aiSuggestion.lineId !== activeLine.id || aiSuggestion.error) && (
                <div className="p-3 space-y-2 overflow-y-auto">
                  {activeIsHintOnly ? (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800/30 text-xs text-indigo-700 dark:text-indigo-300 font-bold leading-relaxed">
                      Această linie are un preț direct definit. AI poate genera o defalcare detaliată (materiale + manoperă) calibrată față de prețul tău de referință.
                    </div>
                  ) : (
                    activeLineIssues.map((issue, issueIdx) => (
                      <div key={issueIdx} className="flex items-start gap-2.5 p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30">
                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{issue.message}</span>
                      </div>
                    ))
                  )}
                  {aiSuggestion?.lineId === activeLine.id && aiSuggestion.error && (
                    <div className="p-2.5 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 text-xs text-red-600 font-bold">
                      {aiSuggestion.error}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => generateAiRecipe(activeLine)}
                      className={`flex-1 bg-gradient-to-r text-white py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                        activeIsHintOnly
                          ? 'from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600'
                          : 'from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500'
                      }`}
                    >
                      <Sparkles size={12} className="fill-white" /> {activeIsHintOnly ? 'Generează Rețetă Detaliată' : 'Generează Rețetă AI'}
                    </button>
                    <button
                      onClick={() => { setActiveBadgeId(null); setExpandedId(activeLine.id) }}
                      className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                    >
                      <Settings2 size={12} /> Manual
                    </button>
                  </div>
                </div>
              )}

              {/* Loading */}
              {aiSuggestion?.lineId === activeLine.id && aiSuggestion.loading && (
                <div className="p-8 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-500">Se generează rețeta conform normelor 2026...</p>
                </div>
              )}

              {/* Phase 2 */}
              {aiSuggestion?.lineId === activeLine.id && !aiSuggestion.loading && !aiSuggestion.error && aiSuggestion.resources.length > 0 && (
                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {aiSuggestion.explanation && (
                    <p className="text-[11px] text-slate-500 italic p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 leading-relaxed">
                      {aiSuggestion.explanation}
                    </p>
                  )}
                  <div className="flex items-start gap-2 px-2.5 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 rounded-xl text-[10px] text-amber-800 dark:text-amber-300 leading-snug">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    <span>Verifică tipul fiecărei resurse — AI poate clasifica greșit manopera. Corectează tipul din lista de opțiuni înainte de a aplica.</span>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestion.resources.map((res, resIdx) => (
                      <div key={res.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={res.type}
                            onChange={e => updateSuggestedResource(resIdx, 'type', e.target.value)}
                            className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg outline-none shrink-0 ${
                              res.type === 'labor' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                              res.type === 'equipment' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                              res.type === 'transport' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                              'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <option value="material">MAT</option>
                            <option value="labor">MAN</option>
                            <option value="equipment">UTIL</option>
                            <option value="transport">TRANS</option>
                          </select>
                          <input
                            value={res.name}
                            onChange={e => updateSuggestedResource(resIdx, 'name', e.target.value)}
                            className="flex-1 text-sm font-bold bg-transparent border-b border-slate-200 dark:border-slate-600 focus:border-primary outline-none text-slate-900 dark:text-white py-0.5"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <div className="text-[9px] font-black uppercase text-slate-400">Consum / {activeUnit}</div>
                            <input
                              type="number"
                              value={res.consumption}
                              onChange={e => updateSuggestedResource(resIdx, 'consumption', parseFloat(e.target.value) || 0)}
                              className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg px-2 py-1.5 font-mono font-black text-sm text-primary outline-none focus:border-primary"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[9px] font-black uppercase text-slate-400">U.M.</div>
                            <input
                              value={res.um}
                              onChange={e => updateSuggestedResource(resIdx, 'um', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 font-mono font-black text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[9px] font-black uppercase text-slate-400">Preț / {res.um}</div>
                            <input
                              type="number"
                              value={res.unit_price}
                              onChange={e => updateSuggestedResource(resIdx, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg px-2 py-1.5 font-mono font-black text-sm text-emerald-700 outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/50 pb-2">
                    <button
                      onClick={() => applyAiRecipe(activeLine.id)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle2 size={14} /> Aplică Rețeta în Deviz
                    </button>
                    <button
                      onClick={() => setAiSuggestion(null)}
                      className="px-3 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all"
                    >
                      Înapoi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>,
          document.body
        )
      })()}

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

      {showImporter && (
        <EstimateImporter
          onClose={() => setShowImporter(false)}
          onImport={(importedLines) => {
            onImport(importedLines)
          }}
        />
      )}
    </div>
  )
}
