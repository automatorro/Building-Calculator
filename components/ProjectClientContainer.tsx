'use client'

import { useState, useMemo } from 'react'
import ProjectDashboard from './ProjectDashboard'
import EstimateEditor from './EstimateEditor'
import { EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import { Purchase, calculateFinancials } from '@/utils/calculators/financials'
import { LayoutDashboard, ClipboardList, Wallet, Settings as SettingsIcon, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

interface ProjectClientContainerProps {
  projectId: string
  projectName: string
  initialLines: EstimateLine[]
  initialPurchases: Purchase[]
  settings: ProjectSettings
  dimensions: any
  totalEstimatedRevenue: number
}

export default function ProjectClientContainer({
  projectId,
  projectName,
  initialLines,
  initialPurchases,
  settings,
  dimensions,
  totalEstimatedRevenue: initialRevenue
}: ProjectClientContainerProps) {
  const [view, setView] = useState<'dashboard' | 'planning' | 'purchases'>('dashboard')
  const [lines, setLines] = useState<EstimateLine[]>(initialLines)
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases)
  const [revenue, setRevenue] = useState(initialRevenue)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  
  const supabase = createClient()

  const financials = useMemo(() => 
    calculateFinancials(lines, purchases, settings, revenue),
    [lines, purchases, settings, revenue]
  )

  const handleAddPurchase = async (newPurchase: Omit<Purchase, 'id' | 'project_id'>) => {
    const { data, error } = await supabase
      .from('purchases')
      .insert([{ ...newPurchase, project_id: projectId }])
      .select()
      .single()

    if (data) {
      setPurchases([...purchases, data as Purchase])
      setShowPurchaseForm(false)
    }
    if (error) console.error('Error adding purchase:', error)
  }

  const handleUpdateRevenue = async (val: number) => {
    setRevenue(val)
    const { error } = await supabase
      .from('projects')
      .update({ total_estimated_revenue: val })
      .eq('id', projectId)
    
    if (error) console.error('Error updating revenue:', error)
  }

  return (
    <div className="space-y-8">
      {/* View Switcher Overlay (Tab Style) */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl flex gap-1 border border-border/50">
          <ViewTab 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
            icon={<LayoutDashboard size={16} />} 
            label="Dashboard" 
          />
          <ViewTab 
            active={view === 'planning'} 
            onClick={() => setView('planning')} 
            icon={<ClipboardList size={16} />} 
            label="Planificare" 
          />
          <ViewTab 
            active={view === 'purchases'} 
            onClick={() => setView('purchases')} 
            icon={<Wallet size={16} />} 
            label="Achiziții Reale" 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ProjectDashboard 
              financials={financials}
              projectName={projectName}
              onAddPurchase={() => setShowPurchaseForm(true)}
              onViewStages={() => setView('planning')}
            />
            
            {/* Revenue Slider/Input in Dashboard */}
            <div className="mt-8 glass-card p-6 bg-slate-50 dark:bg-slate-800/20 border-border/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <SettingsIcon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Configurare Profitabilitate</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-bold text-slate-500">Venit Proiect (Vânzare):</span>
                    <input 
                      type="number"
                      className="bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none font-mono text-lg font-black w-48 transition-all"
                      value={revenue}
                      onChange={(e) => handleUpdateRevenue(parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-sm font-bold text-slate-400">Lei</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'planning' && (
          <motion.div
            key="planning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EstimateEditor 
              projectId={projectId}
              initialLines={lines}
              settings={settings}
              dimensions={dimensions}
            />
          </motion.div>
        )}

        {view === 'purchases' && (
          <motion.div
            key="purchases"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="glass-card bg-white dark:bg-slate-900 border-border/50">
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <h3 className="font-black uppercase text-xs tracking-widest">Registru Achiziții Reale</h3>
                <button 
                  onClick={() => setShowPurchaseForm(true)}
                  className="bg-primary text-white p-2 rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 bg-slate-50 dark:bg-slate-800/40">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Dată</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Articol / Notă</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Etapă</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Categorie</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Sumă Totală</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Nu există achiziții înregistrate.</td>
                      </tr>
                    ) : (
                      purchases.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{new Date(p.date).toLocaleDateString('ro-RO')}</td>
                          <td className="px-6 py-4 font-bold text-sm tracking-tight">{p.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{p.stage_name || '-'}</td>
                          <td className="px-6 py-4">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-black text-primary">{p.amount_total.toLocaleString('ro-RO')} Lei</td>
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

      {/* Quick Add Purchase Modal */}
      {showPurchaseForm && (
        <PurchaseFormModal 
          onClose={() => setShowPurchaseForm(false)} 
          onSave={handleAddPurchase} 
          stages={lines.map(l => l.stage_name || 'Alte Lucrări').filter((v, i, a) => a.indexOf(v) === i)}
        />
      )}
    </div>
  )
}

function ViewTab({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all
        ${active 
          ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-border/50' 
          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }
      `}
    >
      {icon} {label}
    </button>
  )
}

function PurchaseFormModal({ onClose, onSave, stages }: { onClose: () => void, onSave: (p: any) => void, stages: string[] }) {
  const [formData, setFormData] = useState({
    name: '',
    amount_total: '',
    stage_name: stages[0] || 'Alte Lucrări',
    category: 'Material',
    date: new Date().toISOString().split('T')[0]
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 space-y-6">
        <h3 className="text-xl font-black">Înregistrare Achiziție</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Descriere / Articol</label>
            <input 
              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold"
              placeholder="Ex: Fier beton fundatie"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Sumă Totală (Lei)</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-mono font-bold"
                value={formData.amount_total}
                onChange={e => setFormData({...formData, amount_total: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Dată</label>
              <input 
                type="date"
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Etapă Proiect</label>
              <select 
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold"
                value={formData.stage_name}
                onChange={e => setFormData({...formData, stage_name: e.target.value})}
              >
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Categorie</label>
              <select 
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Material">Material</option>
                <option value="Manopera">Manoperă</option>
                <option value="Utilaj">Utilaj</option>
                <option value="Transport">Transport</option>
                <option value="Altele">Altele</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Anulează</button>
          <button 
            onClick={() => onSave({...formData, amount_total: parseFloat(formData.amount_total) || 0})}
            className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Salvează Acum
          </button>
        </div>
      </div>
    </div>
  )
}
