'use client'

import { useState, useMemo, useEffect } from 'react'
import ProjectDashboard from './ProjectDashboard'
import EstimateEditor from './EstimateEditor'
import EditorAIAssistant from './EditorAIAssistant'
import ProjectTimeline from './ProjectTimeline'
import ProjectDevizView from './ProjectDevizView'
import ProjectStepper from './ProjectStepper'
import { EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import type { OptimizationSuggestion } from '@/lib/ai-types'
import { Purchase, calculateFinancials } from '@/utils/calculators/financials'
import {
  LayoutDashboard, ClipboardList, Wallet,
  Settings as SettingsIcon, Plus, CalendarDays, ListTree, CheckCircle2, MessageSquare, Users, Sparkles, BookOpen, ScanLine, Sunrise, AlertTriangle
} from 'lucide-react'
import ProjectAssistantAI from './ProjectAssistantAI'
import ProjectTeamSettings from './ProjectTeamSettings'
import SiteJournal from './SiteJournal'
import PlanAnalyzer from './plans/PlanAnalyzer'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { fmtRon } from '@/utils/format'
import { processPurchaseDocument, PurchaseOcrResult } from '@/utils/purchase-ocr'
import { Camera, Scan, Loader2, Info } from 'lucide-react'

interface ProjectClientContainerProps {
  projectId: string
  projectName: string
  projectLocation?: string
  initialLines: EstimateLine[]
  initialPurchases: Purchase[]
  settings: ProjectSettings
  dimensions: any
  totalEstimatedRevenue: number
  stages: string[]   // ← din Supabase projects.stages
  userId?: string
  isPremium?: boolean
  userPlan?: string
}

/* ─── Export Excel client-side ──────────────────────────────────────────── */
async function exportExcel(lines: EstimateLine[], settings: ProjectSettings, projectName: string) {
  const XLSX = await import('xlsx')
  const { calculateLineCosts } = await import('@/utils/calculators/estimate')

  const header = ['Nr.', 'Cod normativ', 'Descriere', 'UM', 'Cantitate',
    'Cost direct unitar (lei)', 'Total direct (lei)', 'Total ofertat fără TVA (lei)', 'Etapă']

  const rows = lines.map((line, i) => {
    const costs = calculateLineCosts(line, settings)
    const isManual = !line.items
    const code = line.code
      || (isManual
        ? (line.metadata?.catalog_norm_symbol || 'MANUAL')
        : `${line.items?.normatives?.code || ''} ${line.items?.code || ''}`.trim())
    const name = line.name || line.manual_name || line.items?.name || ''
    const um = line.manual_um || line.items?.um || ''
    return [
      i + 1, code, name, um,
      line.quantity,
      +costs.unitDirectCost.toFixed(2),
      +costs.totalDirectCost.toFixed(2),
      +costs.totalOfertatWithoutTVA.toFixed(2),
      line.stage_name || '',
    ]
  })

  // Totaluri
  const totalDirect = rows.reduce((s, r) => s + (r[6] as number), 0)
  const totalOfertat = rows.reduce((s, r) => s + (r[7] as number), 0)
  const tva = totalOfertat * (settings.tva / 100)

  const wsData = [
    header,
    ...rows,
    [],
    ['', '', '', '', '', '', 'Total direct (lei):', +totalDirect.toFixed(2)],
    ['', '', '', '', '', '', `Total fără TVA (${settings.regie}% regie + ${settings.profit}% profit):`, +totalOfertat.toFixed(2)],
    ['', '', '', '', '', '', `TVA ${settings.tva}%:`, +tva.toFixed(2)],
    ['', '', '', '', '', '', 'TOTAL GENERAL (cu TVA):', +(totalOfertat + tva).toFixed(2)],
  ]

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Lățimi coloane
  ws['!cols'] = [
    { wch: 5 }, { wch: 14 }, { wch: 45 }, { wch: 8 },
    { wch: 10 }, { wch: 22 }, { wch: 20 }, { wch: 28 }, { wch: 18 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Deviz')
  XLSX.writeFile(wb, `deviz-${projectName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`)
}

/* ─── Export CSV client-side ────────────────────────────────────────────── */
async function exportCSV(lines: EstimateLine[], settings: ProjectSettings, projectName: string) {
  const { calculateLineCosts } = await import('@/utils/calculators/estimate')

  const header = ['Cod normativ', 'Descriere', 'UM', 'Cantitate', 'Preț unitar (lei)',
    'Total direct (lei)', 'Total ofertat fără TVA (lei)', 'Etapă'].join(',')

  const rows = lines.map(line => {
    const costs = calculateLineCosts(line, settings)
    const isManual = !line.items
    const code = isManual ? 'MANUAL' : `${line.items?.normatives?.code || ''} ${line.items?.code || ''}`.trim()
    const name = (line.name || line.manual_name || line.items?.name || '').replace(/,/g, ';')
    const um = line.manual_um || line.items?.um || ''
    return [
      code, `"${name}"`, um,
      line.quantity.toString().replace('.', ','),
      costs.unitDirectCost.toFixed(2).replace('.', ','),
      costs.totalDirectCost.toFixed(2).replace('.', ','),
      costs.totalOfertatWithoutTVA.toFixed(2).replace('.', ','),
      line.stage_name || '',
    ].join(',')
  })

  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `deviz-${projectName.toLowerCase().replace(/\s+/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

type Tab = 'dashboard' | 'planning' | 'purchases' | 'timeline' | 'deviz' | 'team' | 'copilot' | 'journal' | 'plans' | 'today'

export default function ProjectClientContainer({
  projectId,
  projectName,
  projectLocation,
  initialLines,
  initialPurchases,
  settings: initialSettings,
  dimensions,
  totalEstimatedRevenue: initialRevenue,
  stages,
  userId = '',
  isPremium = false,
  userPlan = 'gratuit',
}: ProjectClientContainerProps) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const defaultTab = initialPurchases.length > 0 ? 'dashboard' : 'planning'
  const [view, setView] = useState<Tab>(tabParam || defaultTab)

  useEffect(() => {
    if (tabParam) {
      setView(tabParam)
    }
  }, [tabParam])
  const [lines, setLines] = useState<EstimateLine[]>(initialLines)
  const [settings, setSettings] = useState<ProjectSettings>(initialSettings)
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases)
  const [revenue, setRevenue] = useState(initialRevenue)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [budgetAlert, setBudgetAlert] = useState<{
    stage: string; exceeded: number; impact: number
  } | null>(null)

  const [isSaved, setIsSaved] = useState(true)
  const [loading, setLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<OptimizationSuggestion[]>([])

  // Note: Removed the useEffect that synced state from initialLines when isSaved is true.
  // This was causing local additions to disappear during auto-save because initialLines (props) 
  // were not yet updated with the newly added items. State is already initialized from props.

  const handleAddManualLine = (stageName?: string) => {
    const newLine: EstimateLine = {
      id: crypto.randomUUID(),
      quantity: 1,
      custom_prices: {},
      excluded_resources: [],
      metadata: { source: 'manual', autoExpand: true },
      stage_name: stageName || '',
      name: 'Rețetă Nouă',
      code: 'MANUAL',
      unit: 'mc',
      unit_price: 0,
      resources_override: [],
      items: null
    }
    setLines([...lines, newLine])
    setIsSaved(false)
  }

  const [deletingLineId, setDeletingLineId] = useState<string | null>(null)

  const handleDeleteLine = async (id: string) => {
    setDeletingLineId(id)
    const { error } = await supabase.from('estimate_lines').delete().eq('id', id)
    if (error) {
      toast.error('Eroare la ștergerea rândului.')
      setDeletingLineId(null)
      return
    }
    // Ștergem din state DUPĂ confirmare DB
    setLines(lines.filter(l => l.id !== id))
    setDeletingLineId(null)
    toast.success('Rând șters.')
  }

  const handleDuplicateLine = (line: EstimateLine) => {
    const newLine = { ...line, id: crypto.randomUUID() }
    const currentIndex = lines.findIndex(l => l.id === line.id)
    
    if (currentIndex === -1) {
      setLines([...lines, newLine])
    } else {
      const newLines = [...lines]
      newLines.splice(currentIndex + 1, 0, newLine)
      setLines(newLines)
    }
    
    setIsSaved(false)
    toast.success('Rând duplicat cu succes.')
  }

  const handleImportLines = (newLines: EstimateLine[]) => {
    setLines([...lines, ...newLines])
    setIsSaved(false)
  }

  const handleImportFromPlan = (importedLines: EstimateLine[]) => {
    setLines([...lines, ...importedLines])
    setIsSaved(false)
    toast.success(`${importedLines.length} rânduri importate din plan cu succes. Caută-le în deviz!`)
    setView('planning')
  }

  const supabase = createClient()
  const router = useRouter()

  const financials = useMemo(() =>
    calculateFinancials(lines, purchases, settings, revenue),
    [lines, purchases, settings, revenue]
  )

  /* ── Înregistrare achiziție cu alertă depășire buget ────────────────── */
  const handleAddPurchase = async (newPurchase: any) => {
    const photosFiles: File[] = Array.isArray(newPurchase?.photosFiles) ? newPurchase.photosFiles : []
    const uploadBucket = 'purchases'
    let photos: string[] = []

    if (photosFiles.length > 0) {
      try {
        for (const file of photosFiles.slice(0, 3)) {
          const safeName = (file.name || 'photo')
            .toLowerCase()
            .replace(/[^\w.\-]+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 120)

          let uid = ''
          try {
            uid = crypto.randomUUID()
          } catch {
            uid = `${Date.now()}-${Math.random().toString(16).slice(2)}`
          }

          const path = `${projectId}/${Date.now()}-${uid}-${safeName}`

          const { error: uploadError } = await supabase.storage
            .from(uploadBucket)
            .upload(path, file, { contentType: file.type || 'application/octet-stream' })

          if (uploadError) {
            toast.error('Eroare la upload poze: ' + uploadError.message)
            return
          }

          const publicUrl = supabase.storage.from(uploadBucket).getPublicUrl(path).data.publicUrl
          if (publicUrl) photos.push(publicUrl)
        }
      } catch (e: any) {
        toast.error('Eroare la upload poze: ' + (e?.message || 'Eroare necunoscută'))
        return
      }
    }

    const toInsert = { ...newPurchase }
    delete toInsert.photosFiles
    if (photos.length > 0) toInsert.photos = photos

    const { data, error } = await supabase
      .from('purchases')
      .insert([{ ...toInsert, project_id: projectId }])
      .select()
      .single()

    if (data) {
      const updated = [...purchases, data as Purchase]
      setPurchases(updated)
      setShowPurchaseForm(false)
      toast.success('Achiziție înregistrată cu succes!')

      /* Verificare depășire buget pe etapă */
      if (newPurchase.stage_name) {
        const stage = newPurchase.stage_name
        const newTotal = updated
          .filter(p => p.stage_name === stage)
          .reduce((acc, p) => acc + Number(p.amount_total), 0)

        const planned = financials.deviations.find(d => d.stage === stage)?.planned ?? 0

        if (planned > 0 && newTotal > planned) {
          const exceeded = newTotal - planned
          const impact = -exceeded
          setBudgetAlert({ stage, exceeded, impact })
          toast.warning(`Atenție! Bugetul pentru etapa "${stage}" a fost depășit.`)

          // Trimite notificare email (fire-and-forget)
          fetch('/api/notifications/budget-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId,
              projectName,
              stage,
              exceeded,
            }),
          }).catch(() => { /* silențios — emailul e opțional */ })
        }
      }
    }
    if (error) {
      console.error('Error adding purchase:', error)
      toast.error('Eroare la adăugarea achiziției: ' + (error.message || 'Eroare necunoscută'))
    }
  }

  /* ── Actualizare linie din orice tab (Planificare/Deviz) ────────────── */
  const handleUpdateLine = (id: string, updates: Partial<EstimateLine>) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    setIsSaved(false)
  }

  /* ── Auto-Save Logic (Debounced) ──────────────────────────────────── */
  useEffect(() => {
    if (isSaved || loading) return

    const timer = setTimeout(() => {
      handleSave()
    }, 1500) // Salvăm automat după 1.5s de inactivitate

    return () => clearTimeout(timer)
  }, [lines, isSaved, loading])

  const handleSave = async () => {
    setLoading(true)
    try {
      for (const line of lines) {
        const isCatalogNorm = !!line.catalog_norm_id
        const { error } = await supabase
          .from('estimate_lines')
          .upsert({
            id: line.id.includes('-') ? line.id : undefined,
            project_id: projectId,
            quantity: line.quantity,
            custom_prices: line.custom_prices,
            excluded_resources: line.excluded_resources,
            stage_name: line.stage_name,
            sort_order: lines.indexOf(line),
            notes: line.notes,
            catalog_norm_id: line.catalog_norm_id ?? null,
            name: line.name || line.manual_name || 'Articol',
            code: line.code || line.metadata?.catalog_norm_symbol || 'MANUAL',
            unit: line.unit || line.manual_um || 'buc',
            unit_price: line.unit_price || line.manual_price || 0,
            category: line.category ?? null,
            resources_override: line.resources_override ?? null
          })
        if (error) throw error
      }
      setIsSaved(true)
    } catch (err) {
      console.error('Error auto-saving:', err)
      toast.error('Eroare la salvarea automată.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhaseClick = (phase: 'setup' | 'offer' | 'execution') => {
    if (phase === 'setup') setView('planning')
    else if (phase === 'offer') setView('deviz')
    else if (phase === 'execution') setView('dashboard')
  }

  const handleUpdateRevenue = async (val: number) => {
    setRevenue(val)
    await supabase.from('projects')
      .update({ total_estimated_revenue: val })
      .eq('id', projectId)
  }

  /* ── Export PDF (deschide pagina de print) ────────────────────────────── */
  const handleExportPDF = () => {
    window.open(`/projects/${projectId}/print`, '_blank')
  }

  /* ── Export CSV ───────────────────────────────────────────────────────── */
  const handleExportCSV = () => exportCSV(lines, settings, projectName)

  /* ── Export Excel ─────────────────────────────────────────────────────── */
  const handleExportExcel = () => exportExcel(lines, settings, projectName)

  /* ── Tab config (Progressive Disclosure) ────────────────────────────────── */
  const TABS = useMemo(() => {
    const allTabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
      { id: 'planning', label: 'Editor Deviz', icon: ClipboardList },
      { id: 'plans', label: 'Planuri & Cantități', icon: ScanLine },
      { id: 'deviz', label: 'Vizualizare & Export', icon: ListTree },
      { id: 'timeline', label: 'Cronologie', icon: CalendarDays },
      { id: 'today', label: 'Azi', icon: Sunrise },
      { id: 'purchases', label: 'Achiziții', icon: Wallet },
      { id: 'dashboard', label: 'Status', icon: LayoutDashboard },
      { id: 'journal', label: 'Jurnal', icon: BookOpen },
      { id: 'copilot', label: 'AI', icon: Sparkles },
      { id: 'team', label: 'Echipă', icon: Users },
    ]

    // 1. Dacă nu avem niciun rând în deviz, arătăm doar editorul + plans
    if (lines.length === 0) return allTabs.filter(t => t.id === 'planning' || t.id === 'journal' || t.id === 'plans')

    // 2. Dacă avem deviz dar nu avem achiziții, nu arătăm încă Dashboard-ul (Status)
    if (purchases.length === 0) return allTabs.filter(t => t.id !== 'dashboard')

    return allTabs
  }, [lines.length, purchases.length])

  const handleSaveSettings = async (newSettings: ProjectSettings) => {
    setSettings(newSettings)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ settings: newSettings })
        .eq('id', projectId)
      if (error) throw error
      toast.success('Setări actualizate cu succes.')
    } catch (err) {
      console.error(err)
      toast.error('Eroare la salvarea setărilor.')
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Project Stepper & Assistant ── */}
      <div className="flex flex-col gap-2">
        <ProjectStepper
          globalPhase={
            purchases.length > 0 ? 'execution' : (lines.length > 0 ? 'offer' : 'setup')
          }
          activePhase={
            view === 'planning' ? 'setup' : (view === 'deviz' ? 'offer' : 'execution')
          }
          onPhaseClick={handlePhaseClick}
        />
        <div className="flex justify-end pr-2">
          {loading ? (
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" /> Se sincronizează...
            </span>
          ) : isSaved ? (
            <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 uppercase tracking-widest">
              <CheckCircle2 size={10} /> Toate modificările au fost salvate
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 uppercase tracking-widest">
              Modificări nesalvate...
            </span>
          )}
        </div>
      </div>

      <div style={{
        background: '#FFF0E8', padding: '12px 16px', borderRadius: 12, border: '1px solid #E8500A33',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{
          background: '#E8500A', width: 24, height: 24, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700
        }}>
          ?
        </div>
        <p style={{ fontSize: 13, color: '#C43F06', fontWeight: 500 }}>
          {lines.length === 0
            ? 'Proiectul este la început. Adăugă primele norme din Catalog pentru a începe ofertarea.'
            : (purchases.length === 0
              ? 'Devizul tău este în lucru. După ce finalizezi cantitățile, generează PDF-ul pentru Client.'
              : 'Proiectul este în faza de Execuție. Monitorizează profitul real în tab-ul Status.')
          }
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex md:justify-center overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
        <div style={{
          background: '#F3F2EF', padding: 6, borderRadius: 14,
          display: 'flex', gap: 4, border: '1px solid #E5E3DE',
          width: 'max-content'
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = view === tab.id
            return (
              <button key={tab.id} onClick={() => setView(tab.id)}
                className="bc-project-tab-btn"
                style={{
                  padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
                  fontSize: 14, fontWeight: active ? 600 : 500,
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: active ? 'white' : 'transparent',
                  color: active ? '#E8500A' : '#6B6860',
                  boxShadow: active ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all .15s',
                  whiteSpace: 'nowrap'
                }}>
                <Icon size={16} style={{ color: active ? '#E8500A' : '#A8A59E' }} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Alertă depășire buget ─────────────────────────────────────────── */}
      {budgetAlert && (
        <div style={{
          background: '#FCEBEB', border: '1px solid #C0392B33',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 36, height: 36, background: '#C0392B', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>!</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: '#791F1F', marginBottom: 4, fontSize: 14 }}>
              Atenție! Depășire buget — etapa <em>{budgetAlert.stage}</em>
            </p>
            <p style={{ fontSize: 13, color: '#C0392B', lineHeight: 1.5 }}>
              S-a depășit bugetul planificat cu{' '}
              <strong>{fmtRon(budgetAlert.exceeded)} lei</strong>.
              {budgetAlert.impact < 0 && (
                <> Impact profit: <strong>{fmtRon(budgetAlert.impact)} lei</strong>.</>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <button onClick={() => setBudgetAlert(null)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#C0392B', fontSize: 18, padding: 4, lineHeight: 1, flexShrink: 0
              }}>
              ×
            </button>
            <button 
              onClick={() => {
                const msg = `⚠️ Atenție: Etapa "${budgetAlert.stage}" de la proiectul "${projectName}" a depășit bugetul cu ${fmtRon(budgetAlert.exceeded)} lei. Verifică aici: ${window.location.href}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#25D366', color: 'white', border: 'none',
                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}
            >
              <MessageSquare size={14} /> Anunță pe WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* ── Conținut tab activ ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'today' && (
          <motion.div key="today"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {(() => {
              // Etape cu 0 achiziții = "De comandat azi"
              const stagesWithPurchases = new Set(purchases.map(p => p.stage_name).filter(Boolean))
              const stagesNeedingOrders = stages.filter(s => !stagesWithPurchases.has(s))

              // Alertele active (depășiri buget)
              const activeAlerts = financials.alerts.filter(a => a.type === 'danger')

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1E2329, #2E2D2A)',
                    borderRadius: 16, padding: '28px 32px',
                    color: 'white',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <Sunrise size={22} style={{ color: '#E8500A' }} />
                      <h2 style={{
                        fontSize: 20, fontWeight: 700,
                        fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
                      }}>
                        Azi pe Șantier
                      </h2>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
                      Rezumatul zilei pentru proiectul <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{projectName}</strong>
                    </p>
                  </div>

                  {/* De comandat azi */}
                  <div style={{
                    background: '#FAFAF8', border: '1px solid #E5E3DE',
                    borderRadius: 14, overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '14px 20px', borderBottom: '1px solid #E5E3DE',
                      background: '#F3F2EF',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: '#FFF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Wallet size={14} style={{ color: '#E8500A' }} />
                      </div>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1E2329', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                        Etape fără achiziții — De comandat
                      </h3>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                      {stagesNeedingOrders.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {stagesNeedingOrders.map(stage => (
                            <div key={stage} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '12px 16px', background: '#FFF0E8', borderRadius: 10, border: '1px solid #E8500A22',
                            }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: '#1E2329' }}>📋 {stage}</span>
                              <span style={{ fontSize: 11, color: '#E8500A', fontWeight: 700, textTransform: 'uppercase' }}>
                                Fără achiziții
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 13, color: '#2A7D4F', fontWeight: 500, textAlign: 'center', padding: 20 }}>
                          ✓ Toate etapele au achiziții înregistrate.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Alerte active */}
                  {activeAlerts.length > 0 && (
                    <div style={{
                      background: '#FCEBEB', border: '1px solid #C0392B22',
                      borderRadius: 14, overflow: 'hidden',
                    }}>
                      <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #C0392B22',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <AlertTriangle size={16} style={{ color: '#C0392B' }} />
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#791F1F', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                          Alerte active ({activeAlerts.length})
                        </h3>
                      </div>
                      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {activeAlerts.map((alert, i) => (
                          <div key={i} style={{
                            padding: '10px 14px', background: 'rgba(192,57,43,0.06)', borderRadius: 8,
                            fontSize: 13, color: '#C0392B', fontWeight: 500,
                          }}>
                            {alert.message}
                            {alert.impact && alert.impact !== 0 && (
                              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700 }}>
                                ({fmtRon(alert.impact)} lei)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acțiune rapidă */}
                  <div style={{
                    background: '#FAFAF8', border: '1px solid #E5E3DE',
                    borderRadius: 14, padding: '24px 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 16,
                  }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1E2329', marginBottom: 4 }}>
                        Acțiune rapidă
                      </p>
                      <p style={{ fontSize: 12, color: '#6B6860' }}>
                        Înregistrează o achiziție fără a schimba tab-ul
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPurchaseForm(true)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#E8500A', color: 'white', border: 'none',
                        padding: '12px 24px', borderRadius: 10,
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
                        boxShadow: '0 4px 12px rgba(232,80,10,0.2)',
                        transition: 'background .15s',
                      }}
                    >
                      <Plus size={16} /> Înregistrează achiziție
                    </button>
                  </div>

                  {/* Forecast rapid */}
                  {financials.upcomingCosts.length > 0 && (
                    <div style={{
                      background: '#1E2329', borderRadius: 14, padding: '24px 28px',
                      color: 'white',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <CalendarDays size={16} style={{ color: '#E8500A' }} />
                        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(255,255,255,0.5)' }}>
                          Necesar de plată — etape următoare
                        </h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {financials.upcomingCosts.slice(0, 4).map((cost, i) => (
                          <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 8,
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{cost.stage}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#E8500A', fontFamily: 'monospace' }}>
                              {fmtRon(cost.amount)} lei
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div key="dashboard"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ProjectDashboard
              financials={financials}
              projectName={projectName}
              projectId={projectId}
              dimensions={dimensions}
              onAddPurchase={() => setShowPurchaseForm(true)}
              onViewStages={() => setView('planning')}
              lines={lines}
              settings={settings}
              onUpdateSettings={handleSaveSettings}
              purchases={purchases}
            />
            <div className="mt-8" style={{
              background: '#F3F2EF', borderRadius: 12,
              padding: '20px 24px', border: '1px solid #E5E3DE'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 10, background: '#FFF0E8', borderRadius: 8 }}>
                  <SettingsIcon size={18} style={{ color: '#E8500A' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 800, color: '#4A4744',
                    textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6
                  }}>
                    Valoare finală contract semnat (Vânzare)
                  </p>
                  <p style={{ fontSize: 12, color: '#6B6860', marginTop: 0, marginBottom: 16, lineHeight: 1.4, fontWeight: 500 }}>
                    Dacă lași valoarea 0, sistemul va folosi automat ca preț de vânzare <strong>Totalul Devizului Ofertat</strong>. <br/>Dacă ai negociat sau semnat o altă sumă clară cu clientul, introdu-o fix aici.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number"
                      style={{
                        background: 'transparent', borderBottom: '2px solid #E8500A',
                        border: 'none', outline: 'none', fontSize: 20, fontWeight: 700,
                        color: '#1E2329', fontFamily: 'inherit', width: 'clamp(100px, 50%, 180px)'
                      }}
                      value={revenue}
                      onChange={e => handleUpdateRevenue(parseFloat(e.target.value) || 0)} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#A8A59E' }}>lei</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'planning' && (
          <motion.div key="planning"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <EstimateEditor
              projectId={projectId}
              lines={lines}
              settings={settings}
              onUpdateSettings={handleSaveSettings}
              dimensions={dimensions}
              onUpdateLine={handleUpdateLine}
              onAddLine={handleAddManualLine}
              onDeleteLine={handleDeleteLine}
              onDuplicateLine={handleDuplicateLine}
              onImport={handleImportLines}
              isSaving={loading}
              isSaved={isSaved}
            />
            <EditorAIAssistant
              lines={lines}
              settings={settings}
              dimensions={dimensions}
              projectName={projectName}
            />
          </motion.div>
        )}

        {view === 'deviz' && (
          <motion.div key="deviz"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ProjectDevizView
              lines={lines}
              settings={settings}
              projectName={projectName}
              projectLocation={projectLocation}
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
              onExportExcel={handleExportExcel}
              onUpdateLine={handleUpdateLine}
              onSave={handleSave}
              isSaving={loading}
            />
          </motion.div>
        )}

        {view === 'timeline' && (
          <motion.div key="timeline"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ProjectTimeline
              stages={stages}
              lines={lines}
              purchases={purchases}
              projectName={projectName}
            />
          </motion.div>
        )}

        {view === 'purchases' && (
          <motion.div key="purchases"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div style={{ background: '#FAFAF8', border: '1px solid #E5E3DE', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{
                padding: '16px 24px', borderBottom: '1px solid #E5E3DE',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#F3F2EF'
              }}>
                <h3 style={{ fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: '#1E2329' }}>
                  Registru Achiziții Reale
                </h3>
                <button onClick={() => setShowPurchaseForm(true)}
                  style={{
                    background: '#E8500A', color: 'white', border: 'none',
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center'
                  }}>
                  <Plus size={18} />
                </button>
              </div>
              <div className="overflow-x-auto relative">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F3F2EF' }}>
                      <th style={{
                        padding: '10px 20px', textAlign: 'left',
                        fontSize: 11, fontWeight: 600, color: '#6B6860',
                        textTransform: 'uppercase', letterSpacing: '.04em',
                        position: 'sticky', left: 0, background: '#F3F2EF', zIndex: 10,
                        boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)'
                      }}>
                        Articol / Notă
                      </th>
                      {['Dată', 'Poze', 'Etapă', 'Categorie', 'Sumă'].map(h => (
                        <th key={h} style={{
                          padding: '10px 20px', textAlign: h === 'Sumă' ? 'right' : 'left',
                          fontSize: 11, fontWeight: 600, color: '#6B6860',
                          textTransform: 'uppercase', letterSpacing: '.04em',
                          borderBottom: '1px solid #E5E3DE',
                          whiteSpace: 'nowrap'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{
                          padding: '40px', textAlign: 'center',
                          color: '#A8A59E', fontStyle: 'italic', fontSize: 13
                        }}>
                          Nu există achiziții înregistrate.
                        </td>
                      </tr>
                    ) : (
                      purchases.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #F3F2EF' }}>
                          <td style={{ 
                            padding: '12px 20px', fontWeight: 600, color: '#1E2329',
                            position: 'sticky', left: 0, background: 'inherit', zIndex: 5,
                            boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                            minWidth: 160
                          }}>
                            {p.name}
                          </td>
                          <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontSize: 12, color: '#6B6860', whiteSpace: 'nowrap' }}>
                            {new Date(p.date).toLocaleDateString('ro-RO')}
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            {Array.isArray((p as any).photos) && (p as any).photos.length > 0 ? (
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {((p as any).photos as string[]).slice(0, 3).map((url) => (
                                  <a key={url} href={url} target="_blank" rel="noreferrer">
                                    <img
                                      src={url}
                                      alt=""
                                      style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', border: '1px solid #E5E3DE' }}
                                    />
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#A8A59E' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 20px', fontSize: 12, color: '#6B6860', whiteSpace: 'nowrap' }}>
                            {p.stage_name || '—'}
                          </td>
                          <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: 100,
                              background: '#F3F2EF', color: '#6B6860',
                              fontSize: 11, fontWeight: 500
                            }}>
                              {p.category}
                            </span>
                          </td>
                          <td style={{
                            padding: '12px 20px', textAlign: 'right',
                            fontWeight: 700, color: '#E8500A', whiteSpace: 'nowrap'
                          }}>
                            {fmtRon(Number(p.amount_total))} lei
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        {view === 'copilot' && (
          <motion.div key="copilot"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ProjectAssistantAI
              projectId={projectId}
              projectName={projectName}
              lines={lines}
              settings={settings}
              fullPage={true}
              onApplyAction={handleUpdateLine}
              initialSuggestions={aiSuggestions}
              onSuggestionsChange={setAiSuggestions}
            />
          </motion.div>
        )}
        {view === 'team' && (
          <motion.div key="team"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ProjectTeamSettings projectId={projectId} />
          </motion.div>
        )}
        {view === 'journal' && (
          <motion.div key="journal"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <SiteJournal
              projectId={projectId}
              projectName={projectName}
              stages={stages}
              lines={lines}
              onUpdateLineProg={(lineId, progress) =>
                handleUpdateLine(lineId, { progress_pct: progress } as any)
              }
            />
          </motion.div>
        )}
        {view === 'plans' && (
          <motion.div key="plans"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div style={{
              background: 'white', border: '1px solid #E5E3DE',
              borderRadius: 14, padding: '24px',
            }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{
                  fontSize: 16, fontWeight: 700, color: '#1E2329', marginBottom: 4,
                  fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
                }}>
                  Planuri & Cantități
                </h3>
                <p style={{ fontSize: 13, color: '#A8A59E', margin: 0 }}>
                  Uploadează un plan de construcție (PDF sau imagine) și extrage automat cantitățile cu AI.
                </p>
              </div>
              <PlanAnalyzer
                projectId={projectId}
                userId={userId}
                isPremium={isPremium}
                userPlan={userPlan}
                stages={stages.length > 0 ? stages : [...new Set(lines.map(l => l.stage_name || 'Lucrări Generale'))]}
                onImportToDeviz={handleImportFromPlan}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal achiziție ─────────────────────────────────────────────── */}
      {showPurchaseForm && (
        <PurchaseFormModal
          onClose={() => setShowPurchaseForm(false)}
          onSave={handleAddPurchase}
          financials={financials}
          settings={settings}
          stages={stages.length > 0
            ? stages
            : [...new Set(lines.map(l => l.stage_name || 'Lucrări Generale'))]
          }
        />
      )}
    </div>
  )
}

/* ─── Modal înregistrare achiziție ──────────────────────────────────────── */
function PurchaseFormModal({
  onClose, onSave, stages, financials, settings,
}: {
  onClose: () => void
  onSave: (p: any) => void
  stages: string[]
  financials: any
  settings: any
}) {
  const [formData, setFormData] = useState({
    name: '', amount_total: '',
    stage_name: stages[0] || 'Lucrări Generale',
    category: 'Material',
    date: new Date().toISOString().split('T')[0],
  })
  const [tvaInclus, setTvaInclus] = useState(true)
  const [photosFiles, setPhotosFiles] = useState<File[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [ocrResult, setOcrResult] = useState<PurchaseOcrResult | null>(null)

  const handleScan = async (file: File) => {
    setIsScanning(true)
    try {
      const result = await processPurchaseDocument(file)
      setOcrResult(result)
      setFormData(prev => ({
        ...prev,
        name: result.vendorName || prev.name,
        amount_total: result.totalAmount?.toString() || prev.amount_total,
        date: result.date || prev.date
      }))
      toast.success('Date extrase cu succes!')
    } catch (err) {
      console.error(err)
      toast.error('Eroare la scanarea documentului.')
    } finally {
      setIsScanning(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: '#F3F2EF',
    border: '1px solid #E5E3DE', borderRadius: 8, fontSize: 14,
    color: '#1E2329', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(30,35,41,0.5)', backdropFilter: 'blur(4px)', padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: ocrResult ? 800 : 480, background: '#FAFAF8',
        borderRadius: 16, padding: '28px 28px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
        maxHeight: '90vh', overflowY: 'auto', transition: 'all 0.3s ease'
      }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize: 22, fontWeight: 400, color: '#1E2329'
          }}>
            Înregistrare Achiziție
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              background: '#F3F2EF', borderRadius: 8, fontSize: 11, fontWeight: 800,
              cursor: 'pointer', color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <Camera size={14} /> Foto Cameră
              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setPhotosFiles([file])
                    handleScan(file)
                  }
                }} />
            </label>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              background: '#E8500A15', borderRadius: 8, fontSize: 11, fontWeight: 800,
              cursor: 'pointer', color: '#E8500A', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <Scan size={14} /> Încarcă & Scan
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setPhotosFiles([file])
                    handleScan(file)
                  }
                }} />
            </label>
          </div>
        </div>

        {isScanning && (
          <div style={{ 
            background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, 
            padding: '24px', textAlign: 'center', marginBottom: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
          }}>
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0369A1' }}>Se analizează documentul nativ...</p>
            <p style={{ fontSize: 12, color: '#0EA5E9' }}>Extragem CUI, Furnizor, TVA și Produse</p>
          </div>
        )}

        <div className="ocr-purchase-grid" style={{ display: 'grid', gridTemplateColumns: ocrResult ? '1fr 1.5fr' : '1fr', gap: 28 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 500,
                color: '#6B6860', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6
              }}>
                Descriere / Furnizor
              </label>
              <input placeholder="ex: Dedeman SRL" style={inputStyle}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#E8500A')}
                onBlur={e => (e.target.style.borderColor = '#E5E3DE')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 500,
                  color: '#6B6860', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6
                }}>
                  Sumă totală (lei)
                </label>
                <input type="number" placeholder="ex: 4500" style={inputStyle}
                  value={formData.amount_total}
                  onChange={e => setFormData({ ...formData, amount_total: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#E8500A')}
                  onBlur={e => (e.target.style.borderColor = '#E5E3DE')} />
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 6 }}>
                  <input 
                    type="checkbox" 
                    checked={tvaInclus} 
                    onChange={e => setTvaInclus(e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: '#E8500A' }}
                  />
                  <span style={{ fontSize: 11, color: '#6B6860', fontWeight: 500 }}>
                    Suma include TVA ({settings.tva}%)?
                  </span>
                </label>
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 500,
                  color: '#6B6860', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6
                }}>
                  Dată
                </label>
                <input type="date" style={inputStyle}
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>

            {ocrResult?.vendorCui && (
              <div style={{ fontSize: 11, background: '#F3F2EF', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                <span style={{ color: '#6B6860' }}>CUI Furnizor identificat: </span>
                <span style={{ fontWeight: 700, color: '#1E2329' }}>{ocrResult.vendorCui}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 500,
                  color: '#6B6860', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6
                }}>
                  Etapă
                </label>
                <select style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formData.stage_name}
                  onChange={e => setFormData({ ...formData, stage_name: e.target.value })}>
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="Lucrări Generale">Alte Lucrări</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 500,
                  color: '#6B6860', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6
                }}>
                  Categorie
                </label>
                <select style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  {['Material', 'Manoperă', 'Utilaj', 'Transport', 'Altele'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Poze Previzualizare ── */}
            {photosFiles.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                {photosFiles.map((file) => {
                  const url = URL.createObjectURL(file)
                  return (
                    <div key={`${file.name}-${file.size}-${file.lastModified}`} style={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt=""
                        style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', border: '1px solid #E5E3DE' }}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Live Impact Analysis ── */}
            {(() => {
              const amount = parseFloat(formData.amount_total) || 0
              if (amount <= 0) return null
              
              const deviation = financials.deviations.find((d: any) => d.stage === formData.stage_name)
              const planned = deviation?.planned || 0
              const spent = deviation?.spent || 0
              const newTotal = spent + amount
              const isExceeded = planned > 0 && newTotal > planned
              const diff = newTotal - planned
              const impactOnProfit = isExceeded ? diff : 0

              return (
                <div style={{
                  padding: '12px', borderRadius: 10,
                  background: isExceeded ? '#FFF5F5' : '#F0FFF4',
                  border: `1px solid ${isExceeded ? '#FEB2B2' : '#9AE6B4'}`,
                }}>
                  <div style={{ display: 'flex', fontSize: 11, fontWeight: 700, color: isExceeded ? '#C53030' : '#2F855A', textTransform: 'uppercase', marginBottom: 4 }}>
                    {isExceeded ? '⚠️ DEPĂȘIRE' : '✅ ÎN LIMITĂ'}
                  </div>
                  <div style={{ fontSize: 12, color: isExceeded ? '#9B2C2C' : '#276749', lineHeight: 1.4 }}>
                    {isExceeded 
                      ? <>S-a depășit bugetul cu <strong>{diff.toLocaleString()} Lei</strong>.</>
                      : <>Rămân <strong>{(planned - newTotal).toLocaleString()} Lei</strong>.</>}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* ── Detalii OCR Extrase ── */}
          {ocrResult && (
            <div style={{ background: '#F1F5F9', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Info size={16} style={{ color: '#64748B' }} />
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Produse Identificate</h4>
              </div>
              
              <div style={{ maxHeight: 300, overflowY: 'auto' }} className="no-scrollbar">
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#F1F5F9' }}>
                    <tr style={{ borderBottom: '1px solid #CBD5E1' }}>
                      <th style={{ textAlign: 'left', padding: '6px 4px', color: '#64748B' }}>Articol</th>
                      <th style={{ textAlign: 'center', padding: '6px 4px', color: '#64748B' }}>Cant.</th>
                      <th style={{ textAlign: 'right', padding: '6px 4px', color: '#64748B' }}>Total (Lei)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrResult.items.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: '20px 0', textAlign: 'center', color: '#94A3B8' }}>
                          Nu s-au putut extrage produsele individual.
                        </td>
                      </tr>
                    ) : (
                      ocrResult.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '8px 4px', color: '#1E293B' }}>{item.name}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'center', color: '#1E293B' }}>{item.quantity}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>{item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {ocrResult.tvaAmount && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '2px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748B' }}>Din care TVA inclus:</span>
                  <span style={{ fontWeight: 700, color: '#1E293B' }}>{ocrResult.tvaAmount.toFixed(2)} Lei</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{
              flex: 1, padding: '12px', background: 'transparent',
              border: '1px solid #E5E3DE', borderRadius: 8, fontSize: 14,
              fontWeight: 500, color: '#6B6860', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all .15s'
            }}>
            Anulează
          </button>
          <button
            onClick={() => {
              const amountRaw = parseFloat(formData.amount_total) || 0
              const amountFinal = tvaInclus
                ? (ocrResult?.tvaAmount != null
                    ? amountRaw - ocrResult.tvaAmount
                    : amountRaw / (1 + (settings.tva || 21) / 100))
                : amountRaw

              onSave({ 
                ...formData, 
                amount_total: amountFinal, 
                photosFiles,
                metadata: { 
                  vendor_cui: ocrResult?.vendorCui,
                  tva_amount: ocrResult?.tvaAmount,
                  items: ocrResult?.items,
                  tva_inclus_la_introducere: tvaInclus,
                  suma_bruta_originala: amountRaw
                }
              })
            }}
            disabled={!formData.name || !formData.amount_total || isScanning}
            style={{
              flex: 1, padding: '12px', background: '#E8500A', border: 'none',
              borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'white',
              cursor: (!formData.name || !formData.amount_total || isScanning) ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: (!formData.name || !formData.amount_total || isScanning) ? 0.5 : 1,
              transition: 'background .15s'
            }}>
            {isScanning ? 'Se analizează...' : 'Salvează'}
          </button>
        </div>
      </div>
    </div>
  )
}
