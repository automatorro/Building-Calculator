'use client'

import { useState, useMemo } from 'react'
import ProjectDashboard from './ProjectDashboard'
import EstimateEditor from './EstimateEditor'
import ProjectTimeline from './ProjectTimeline'
import ProjectDevizView from './ProjectDevizView'
import { EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import { Purchase, calculateFinancials } from '@/utils/calculators/financials'
import {
  LayoutDashboard, ClipboardList, Wallet,
  Settings as SettingsIcon, Plus, CalendarDays, ListTree,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
    const code = isManual
      ? (line.metadata?.catalog_norm_symbol || 'MANUAL')
      : `${line.items?.normatives?.code || ''} ${line.items?.code || ''}`.trim()
    const name = line.manual_name || line.items?.name || ''
    const um   = line.manual_um || line.items?.um || ''
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
  const totalDirect  = rows.reduce((s, r) => s + (r[6] as number), 0)
  const totalOfertat = rows.reduce((s, r) => s + (r[7] as number), 0)
  const tva          = totalOfertat * (settings.tva / 100)

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
function exportCSV(lines: EstimateLine[], settings: ProjectSettings, projectName: string) {
  const { calculateLineCosts } = require('@/utils/calculators/estimate')

  const header = ['Cod normativ', 'Descriere', 'UM', 'Cantitate', 'Preț unitar (lei)',
    'Total direct (lei)', 'Total ofertat fără TVA (lei)', 'Etapă'].join(',')

  const rows = lines.map(line => {
    const costs = calculateLineCosts(line, settings)
    const isManual = !line.items
    const code = isManual ? 'MANUAL' : `${line.items?.normatives?.code || ''} ${line.items?.code || ''}`.trim()
    const name = (line.manual_name || line.items?.name || '').replace(/,/g, ';')
    const um   = line.manual_um || line.items?.um || ''
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
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `deviz-${projectName.toLowerCase().replace(/\s+/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

type Tab = 'dashboard' | 'planning' | 'purchases' | 'timeline' | 'deviz'

export default function ProjectClientContainer({
  projectId,
  projectName,
  projectLocation,
  initialLines,
  initialPurchases,
  settings,
  dimensions,
  totalEstimatedRevenue: initialRevenue,
  stages,
}: ProjectClientContainerProps) {
  const [view,      setView]      = useState<Tab>('dashboard')
  const [lines,     setLines]     = useState<EstimateLine[]>(initialLines)
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases)
  const [revenue,   setRevenue]   = useState(initialRevenue)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [budgetAlert, setBudgetAlert] = useState<{
    stage: string; exceeded: number; impact: number
  } | null>(null)

  const supabase = createClient()
  const router   = useRouter()

  const financials = useMemo(() =>
    calculateFinancials(lines, purchases, settings, revenue),
    [lines, purchases, settings, revenue]
  )

  /* ── Înregistrare achiziție cu alertă depășire buget ────────────────── */
  const handleAddPurchase = async (newPurchase: Omit<Purchase, 'id' | 'project_id'>) => {
    const { data, error } = await supabase
      .from('purchases')
      .insert([{ ...newPurchase, project_id: projectId }])
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
          const impact   = -(exceeded * (settings.profit / 100))
          setBudgetAlert({ stage, exceeded, impact })
          toast.warning(`Atenție! Bugetul pentru etapa "${stage}" a fost depășit.`)
        }
      }
    }
    if (error) {
      console.error('Error adding purchase:', error)
      toast.error('Eroare la adăugarea achiziției: ' + (error.message || 'Eroare necunoscută'))
    }
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

  /* ── Tab config ────────────────────────────────────────────────────────── */
  const TABS: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'planning',  label: 'Planificare',  icon: ClipboardList   },
    { id: 'deviz',     label: 'Deviz',        icon: ListTree        },
    { id: 'timeline',  label: 'Timeline',     icon: CalendarDays    },
    { id: 'purchases', label: 'Achiziții',    icon: Wallet          },
  ]

  return (
    <div className="space-y-8">

      {/* ── Tab switcher ── */}
      <div className="flex items-center justify-center">
        <div style={{ background:'#F3F2EF', padding:6, borderRadius:12,
          display:'flex', gap:4, border:'1px solid #E5E3DE', flexWrap:'wrap' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = view === tab.id
            return (
              <button key={tab.id} onClick={() => setView(tab.id)}
                style={{
                  padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer',
                  fontFamily:'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
                  fontSize:13, fontWeight: active ? 500 : 400,
                  display:'flex', alignItems:'center', gap:6,
                  background: active ? 'white' : 'transparent',
                  color: active ? '#E8500A' : '#6B6860',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition:'all .15s',
                }}>
                <Icon size={15} style={{ color: active ? '#E8500A' : '#A8A59E' }} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Alertă depășire buget ─────────────────────────────────────────── */}
      {budgetAlert && (
        <div style={{
          background:'#FCEBEB', border:'1px solid #C0392B33',
          borderRadius:12, padding:'16px 20px',
          display:'flex', alignItems:'flex-start', gap:14,
        }}>
          <div style={{ width:36, height:36, background:'#C0392B', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'white', fontSize:18, fontWeight:700 }}>!</span>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:600, color:'#791F1F', marginBottom:4, fontSize:14 }}>
              Depășire buget — etapa <em>{budgetAlert.stage}</em>
            </p>
            <p style={{ fontSize:13, color:'#C0392B', lineHeight:1.5 }}>
              Etapa a depășit bugetul planificat cu{' '}
              <strong>{budgetAlert.exceeded.toLocaleString('ro-RO', { maximumFractionDigits:0 })} lei</strong>.
              {budgetAlert.impact < 0 && (
                <> Impact estimat asupra profitului: <strong>{budgetAlert.impact.toLocaleString('ro-RO', { maximumFractionDigits:0 })} lei</strong>.</>
              )}
            </p>
          </div>
          <button onClick={() => setBudgetAlert(null)}
            style={{ background:'transparent', border:'none', cursor:'pointer',
              color:'#C0392B', fontSize:18, padding:4, lineHeight:1, flexShrink:0 }}>
            ×
          </button>
        </div>
      )}

      {/* ── Conținut tab activ ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div key="dashboard"
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <ProjectDashboard
              financials={financials}
              projectName={projectName}
              onAddPurchase={() => setShowPurchaseForm(true)}
              onViewStages={() => setView('planning')}
            />
            <div className="mt-8" style={{ background:'#F3F2EF', borderRadius:12,
              padding:'20px 24px', border:'1px solid #E5E3DE' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ padding:10, background:'#FFF0E8', borderRadius:8 }}>
                  <SettingsIcon size={18} style={{ color:'#E8500A' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:600, color:'#A8A59E',
                    textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>
                    Venit estimat proiect (vânzare)
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <input type="number"
                      style={{ background:'transparent', borderBottom:'2px solid #E8500A',
                        border:'none', outline:'none', fontSize:20, fontWeight:700,
                        color:'#1E2329', fontFamily:'inherit', width:180 }}
                      value={revenue}
                      onChange={e => handleUpdateRevenue(parseFloat(e.target.value) || 0)} />
                    <span style={{ fontSize:14, fontWeight:500, color:'#A8A59E' }}>lei</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'planning' && (
          <motion.div key="planning"
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <EstimateEditor
              projectId={projectId}
              initialLines={lines}
              settings={settings}
              dimensions={dimensions}
            />
          </motion.div>
        )}

        {view === 'deviz' && (
          <motion.div key="deviz"
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <ProjectDevizView
              lines={lines}
              settings={settings}
              projectName={projectName}
              projectLocation={projectLocation}
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
              onExportExcel={handleExportExcel}
            />
          </motion.div>
        )}

        {view === 'timeline' && (
          <motion.div key="timeline"
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
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
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <div style={{ background:'#FAFAF8', border:'1px solid #E5E3DE', borderRadius:14, overflow:'hidden' }}>
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #E5E3DE',
                display:'flex', justifyContent:'space-between', alignItems:'center',
                background:'#F3F2EF' }}>
                <h3 style={{ fontFamily:'inherit', fontSize:15, fontWeight:600, color:'#1E2329' }}>
                  Registru Achiziții Reale
                </h3>
                <button onClick={() => setShowPurchaseForm(true)}
                  style={{ background:'#E8500A', color:'white', border:'none',
                    padding:'8px 10px', borderRadius:8, cursor:'pointer',
                    display:'flex', alignItems:'center' }}>
                  <Plus size={18} />
                </button>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ background:'#F3F2EF', borderBottom:'1px solid #E5E3DE' }}>
                      {['Dată', 'Articol / Notă', 'Etapă', 'Categorie', 'Sumă'].map(h => (
                        <th key={h} style={{ padding:'10px 20px', textAlign: h === 'Sumă' ? 'right' : 'left',
                          fontSize:11, fontWeight:600, color:'#6B6860',
                          textTransform:'uppercase', letterSpacing:'.04em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding:'40px', textAlign:'center',
                          color:'#A8A59E', fontStyle:'italic', fontSize:13 }}>
                          Nu există achiziții înregistrate.
                        </td>
                      </tr>
                    ) : (
                      purchases.map(p => (
                        <tr key={p.id} style={{ borderBottom:'1px solid #F3F2EF' }}>
                          <td style={{ padding:'12px 20px', fontFamily:'monospace', fontSize:12, color:'#6B6860' }}>
                            {new Date(p.date).toLocaleDateString('ro-RO')}
                          </td>
                          <td style={{ padding:'12px 20px', fontWeight:500, color:'#1E2329' }}>
                            {p.name}
                          </td>
                          <td style={{ padding:'12px 20px', fontSize:12, color:'#6B6860' }}>
                            {p.stage_name || '—'}
                          </td>
                          <td style={{ padding:'12px 20px' }}>
                            <span style={{ padding:'3px 10px', borderRadius:100,
                              background:'#F3F2EF', color:'#6B6860',
                              fontSize:11, fontWeight:500 }}>
                              {p.category}
                            </span>
                          </td>
                          <td style={{ padding:'12px 20px', textAlign:'right',
                            fontWeight:600, color:'#E8500A' }}>
                            {Number(p.amount_total).toLocaleString('ro-RO')} lei
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
      </AnimatePresence>

      {/* ── Modal achiziție ─────────────────────────────────────────────── */}
      {showPurchaseForm && (
        <PurchaseFormModal
          onClose={() => setShowPurchaseForm(false)}
          onSave={handleAddPurchase}
          stages={stages.length > 0
            ? stages
            : [...new Set(lines.map(l => l.stage_name || 'Alte Lucrări'))]
          }
        />
      )}
    </div>
  )
}

/* ─── Modal înregistrare achiziție ──────────────────────────────────────── */
function PurchaseFormModal({
  onClose, onSave, stages,
}: {
  onClose: () => void
  onSave: (p: any) => void
  stages: string[]
}) {
  const [formData, setFormData] = useState({
    name: '', amount_total: '',
    stage_name: stages[0] || 'Alte Lucrări',
    category: 'Material',
    date: new Date().toISOString().split('T')[0],
  })

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'11px 14px', background:'#F3F2EF',
    border:'1px solid #E5E3DE', borderRadius:8, fontSize:14,
    color:'#1E2329', fontFamily:'inherit', outline:'none', boxSizing:'border-box',
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'rgba(30,35,41,0.5)', backdropFilter:'blur(4px)', padding:16 }}>
      <div style={{ width:'100%', maxWidth:480, background:'#FAFAF8',
        borderRadius:16, padding:'28px 28px', boxShadow:'0 24px 60px rgba(0,0,0,0.2)',
        fontFamily:'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)' }}>

        <h3 style={{ fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
          fontSize:22, fontWeight:400, color:'#1E2329', marginBottom:20 }}>
          Înregistrare Achiziție
        </h3>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:500,
              color:'#6B6860', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>
              Descriere / Articol
            </label>
            <input placeholder="ex: Fier beton fundație" style={inputStyle}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              onFocus={e=>(e.target.style.borderColor='#E8500A')}
              onBlur={e=>(e.target.style.borderColor='#E5E3DE')} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12 }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:500,
                color:'#6B6860', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>
                Sumă totală (lei)
              </label>
              <input type="number" placeholder="ex: 4500" style={inputStyle}
                value={formData.amount_total}
                onChange={e => setFormData({...formData, amount_total: e.target.value})}
                onFocus={e=>(e.target.style.borderColor='#E8500A')}
                onBlur={e=>(e.target.style.borderColor='#E5E3DE')} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:500,
                color:'#6B6860', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>
                Dată
              </label>
              <input type="date" style={inputStyle}
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12 }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:500,
                color:'#6B6860', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>
                Etapă
              </label>
              <select style={{ ...inputStyle, cursor:'pointer' }}
                value={formData.stage_name}
                onChange={e => setFormData({...formData, stage_name: e.target.value})}>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="Alte Lucrări">Alte Lucrări</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:500,
                color:'#6B6860', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>
                Categorie
              </label>
              <select style={{ ...inputStyle, cursor:'pointer' }}
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}>
                {['Material', 'Manoperă', 'Utilaj', 'Transport', 'Altele'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginTop:24 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:'12px', background:'transparent',
              border:'1px solid #E5E3DE', borderRadius:8, fontSize:14,
              fontWeight:500, color:'#6B6860', cursor:'pointer', fontFamily:'inherit',
              transition:'all .15s' }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor='#A8A59E')}
            onMouseLeave={e=>(e.currentTarget.style.borderColor='#E5E3DE')}>
            Anulează
          </button>
          <button
            onClick={() => onSave({...formData, amount_total: parseFloat(formData.amount_total) || 0})}
            disabled={!formData.name || !formData.amount_total}
            style={{ flex:1, padding:'12px', background:'#E8500A', border:'none',
              borderRadius:8, fontSize:14, fontWeight:500, color:'white',
              cursor: !formData.name || !formData.amount_total ? 'not-allowed' : 'pointer',
              fontFamily:'inherit', opacity: !formData.name || !formData.amount_total ? 0.5 : 1,
              transition:'background .15s' }}
            onMouseEnter={e=>{ if(formData.name && formData.amount_total) e.currentTarget.style.background='#C43F06' }}
            onMouseLeave={e=>(e.currentTarget.style.background='#E8500A')}>
            Salvează
          </button>
        </div>
      </div>
    </div>
  )
}
