'use client'

import { useState, useMemo } from 'react'
import ProjectAssistantAI from './ProjectAssistantAI'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, DollarSign, TrendingUp, TrendingDown, 
  AlertTriangle, BarChart3, ArrowRight, Clock, Calendar,
  ShoppingCart, Zap
} from 'lucide-react'

import { FinancialsSummary, Purchase } from '@/utils/calculators/financials'

interface ProjectDashboardProps {
  financials: FinancialsSummary
  projectName: string
  dimensions?: any
  projectId: string
  onAddPurchase: () => void
  onViewStages: () => void
  lines: any[]
  settings: any
  purchases: Purchase[]
}

export default function ProjectDashboard({ 
  financials, projectName, dimensions, projectId, onAddPurchase, onViewStages, lines, settings, purchases 
}: ProjectDashboardProps) {
  const {
    totalBudget,
    totalSpent,
    remainingBudget,
    netProfit,
    percentSpent,
    deviations,
    totalEstimatedRevenue,
    upcomingCosts,
    alerts
  } = financials

  const isOverBudget = totalSpent > totalBudget
  const marginPercent = totalEstimatedRevenue > 0 ? (netProfit / totalEstimatedRevenue) * 100 : 0

  const fmtCost = (n: number) => new Intl.NumberFormat('ro-RO', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n)

  const fmtPct1 = (n: number) => new Intl.NumberFormat('ro-RO', { 
    minimumFractionDigits: 1, 
    maximumFractionDigits: 1 
  }).format(n)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Status Financiar Proiect (Live)
        </p>
        <button
          onClick={onAddPurchase}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#E8500A', color: 'white', border: 'none',
            padding: '9px 16px', borderRadius: 8,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(232,80,10,0.2)',
            transition: 'background .15s',
          }}
        >
          <Wallet size={15} /> Înregistrează Achiziție
        </button>
      </div>

      {/* 4 Întrebări în 5 Secunde */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          label="Cât am cheltuit?" 
          value={`${fmtCost(totalSpent)} Lei`}
          subValue="Total ieșiri reale"
          icon={<DollarSign className="text-blue-500" />}
          trend={null}
        />
        <SummaryCard 
          label="Buget Rămas" 
          value={`${fmtCost(remainingBudget)} Lei`}
          subValue="Buget de execuție disponibil"
          icon={<Wallet className="text-green-500" />}
          trend={null}
        />
        <SummaryCard 
          label="Profit Estimat" 
          value={`${fmtCost(netProfit)} Lei`}
          subValue={`${fmtPct1(marginPercent)}% Marjă Profit`}
          icon={<TrendingUp className="text-primary" />}
          trend={marginPercent > 10 ? 'positive' : 'negative'}
        />
        <SummaryCard 
          label="Status Buget" 
          value={netProfit < 1 ? 'Deficit Estimat' : (isOverBudget ? 'Derapaj' : 'În Grafic')}
          subValue={netProfit < 1 ? 'Cheltuieli > Venituri' : `${fmtPct1(percentSpent)}% din plan consumat`}
          icon={(isOverBudget || netProfit < 1) ? <AlertTriangle className="text-red-500" /> : <BarChart3 className="text-primary" />}
          trend={(isOverBudget || netProfit < 1) ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Progress & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 md:p-8 bg-white dark:bg-slate-900 border-border/50 shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progres Cheltuieli vs. Buget</h3>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black mt-1">{fmtPct1(percentSpent)}%</div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Limită Cheltuieli (Fără Profit):</div>
                  <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold mt-0.5 text-slate-700 dark:text-slate-300">{fmtCost(totalBudget)} Lei</div>
                </div>
              </div>
              
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, percentSpent)}%` }}
                  className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]`}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border/30 gap-4 md:gap-8">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valoare Contract (Ofertată)</div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold font-mono text-primary">{fmtCost(totalEstimatedRevenue)} Lei</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cheltuieli Reale</div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold font-mono">{fmtCost(totalSpent)} Lei</div>
                </div>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Etape Drill-down */}
          <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-lg">
            <div className="p-4 md:p-6 border-b border-border/50 flex flex-wrap justify-between items-center gap-2">
              <h3 className="font-black uppercase text-sm tracking-widest">Performanță pe Etape</h3>
              <button 
                onClick={onViewStages}
                className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                Vezi toate etapele <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-border/50">
              {deviations.slice(0, 5).map((dev, idx) => (
                <div key={idx} className="p-4 md:p-6 flex flex-row items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={onViewStages}>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-black text-sm md:text-base tracking-tight truncate">{dev.stage}</div>
                    <div className="text-[10px] font-medium text-slate-400">
                      Rămas: <span className="font-bold text-slate-700 dark:text-slate-300">{fmtCost(dev.planned - dev.spent)} Lei</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm md:text-lg font-black ${dev.diff > 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                      {fmtCost(dev.spent)} Lei
                    </div>
                    <div className={`text-[9px] font-black uppercase ${dev.diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {dev.diff > 0 ? `+${fmtPct1(dev.percent)}%` : `-${fmtPct1(Math.abs(dev.percent))}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Alerts & Forecast */}
        <div className="space-y-6">
          <div className={`glass-card p-4 md:p-6 border-border/20 ${alerts.some(a => a.type === 'danger') ? 'bg-red-50/30 dark:bg-red-950/20 ring-1 ring-red-500/20' : 'bg-orange-50/20 dark:bg-orange-950/20'}`}>
            <div className="flex items-center gap-2 text-primary mb-4">
              <AlertTriangle size={18} className={alerts.some(a => a.type === 'danger') ? 'text-red-500' : 'text-orange-500'} />
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">Alerte Producție</h3>
            </div>
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map((alert, i) => (
                <div key={i} className={`text-xs flex gap-3 p-3 rounded-xl ${alert.type === 'danger' ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-orange-500/10 text-orange-700 dark:text-orange-300'}`}>
                  <div className="shrink-0 mt-0.5">•</div>
                  <div>
                    <div className="font-bold">{alert.message}</div>
                    {alert.impact && alert.impact !== 0 && (
                      <div className="mt-1 opacity-80 uppercase text-[9px] font-black tracking-widest">
                        Impact: {fmtCost(alert.impact)} Lei
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-xs text-slate-500 italic p-4 text-center border-2 border-dashed border-border/30 rounded-2xl">
                  Nu există derapaje bugetare detectate. Totul OK!
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 bg-slate-900 text-white shadow-2xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Clock size={18} />
                <h3 className="font-black uppercase text-xs tracking-widest">Cashflow Forecast (30 zile)</h3>
              </div>
              <div className="space-y-6">
                <div className="pb-6 border-b border-white/10">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Necesar de plată</div>
                  <div className="text-3xl md:text-4xl font-black text-primary">
                    {fmtCost(upcomingCosts.reduce((sum, c) => sum + c.amount, 0))} Lei
                  </div>
                  <div className="text-xs mt-1 text-slate-500 font-medium">Estimat bazat pe etapele nelucrate</div>
                </div>
                
                <div className="space-y-4">
                  {upcomingCosts.slice(0, 3).map((cost, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="p-1.5 bg-white/5 rounded-lg text-primary"><Calendar size={12} /></div>
                      <div>
                        <div className="text-sm font-bold tracking-tight">{cost.stage}</div>
                        <div className="text-xs font-medium text-slate-400 mt-0.5">{fmtCost(cost.amount)} Lei</div>
                      </div>
                    </div>
                  ))}
                  {upcomingCosts.length === 0 && (
                    <div className="text-[10px] text-slate-500 italic">Toate etapele planificate au achiziții înregistrate.</div>
                  )}
                </div>
              </div>
            </div>
            {/* Background Decor */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>

          <FinanceCenter 
            lines={lines} 
            purchases={purchases} 
            settings={settings} 
            fmtCost={fmtCost} 
            fmtPct1={fmtPct1} 
          />
        </div>
      </div>
    </div>
  )
}

function FinanceCenter({ lines, purchases, settings, fmtCost, fmtPct1 }: { 
  lines: any[], purchases: Purchase[], settings: any, fmtCost: any, fmtPct1: any 
}) {
  const [activeTab, setActiveTab] = useState<'resources' | 'activity' | 'performance'>('resources')
  const { calculateLineCosts } = require('@/utils/calculators/estimate')

  const data = useMemo(() => {
    // 1. Resources Distribution
    let totalMat = 0, totalLab = 0, totalEq = 0, totalTr = 0
    lines.forEach(l => {
      const c = calculateLineCosts(l, settings)
      if (c.breakdown) {
        totalMat += c.breakdown.material
        totalLab += c.breakdown.labor
        totalEq += c.breakdown.equipment
        totalTr += c.breakdown.transport
      }
    })
    const total = totalMat + totalLab + totalEq + totalTr
    
    // 2. Performance (Planned Material Budget vs Actual Material Spent)
    const totalMatSpent = purchases
      .filter(p => p.category?.toLowerCase().includes('material') || !p.category)
      .reduce((sum, p) => sum + p.amount_total, 0)
    
    const performancePct = totalMat > 0 ? ((totalMat - totalMatSpent) / totalMat) * 100 : 0

    return {
      resources: {
        material: totalMat,
        labor: totalLab,
        equipment: totalEq,
        transport: totalTr,
        total,
        pats: [
          { label: 'Materiale', val: totalMat, color: 'bg-primary' },
          { label: 'Manoperă', val: totalLab, color: 'bg-blue-500' },
          { label: 'Utilaje/Transp.', val: totalEq + totalTr, color: 'bg-amber-500' },
        ]
      },
      activity: [...purchases].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
      performance: {
        plannedMat: totalMat,
        spentMat: totalMatSpent,
        savings: totalMat - totalMatSpent,
        pct: performancePct
      }
    }
  }, [lines, purchases, settings])

  const TABS = [
    { id: 'resources', label: 'Ponderi', icon: BarChart3 },
    { id: 'activity', label: 'Activitate', icon: Clock },
    { id: 'performance', label: 'Eficiență', icon: Zap },
  ]

  return (
    <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-xl overflow-hidden rounded-3xl flex flex-col">
      <div className="p-2 bg-slate-50 dark:bg-slate-800/50 flex gap-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === t.id 
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 min-h-[320px]">
        <AnimatePresence mode="wait">
          {activeTab === 'resources' && (
            <motion.div 
              key="res" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {data.resources.pats.map((p, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-slate-500">{p.label}</span>
                      <span className="text-slate-900 dark:text-white">{fmtCost(p.val)} Lei ({data.resources.total > 0 ? fmtPct1((p.val/data.resources.total)*100) : 0}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${data.resources.total > 0 ? (p.val/data.resources.total)*100 : 0}%` }}
                        className={`h-full ${p.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] text-primary font-bold leading-relaxed italic">
                  💡 Sfat: {data.resources.material > data.resources.labor ? 'Proiectul are o pondere mare de materiale. Concentrează-te pe negocierea cu furnizorii pentru a crește marginea.' : 'Manopera domină costurile. Monitorizează productivitatea echipei pentru a evita întârzierile.'}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              key="act" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {data.activity.length > 0 ? data.activity.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{new Date(p.date).toLocaleDateString('ro-RO')} • {p.category || 'General'}</div>
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {fmtCost(p.amount_total)}
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-slate-400 text-xs italic">Nicio achiziție înregistrată.</div>
              )}
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div 
              key="perf" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Economie Realizată (Materiale)</div>
                <div className={`text-4xl font-black ${data.performance.savings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {data.performance.savings >= 0 ? '+' : ''}{fmtCost(data.performance.savings)} Lei
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  {data.performance.pct >= 0 ? 'Sub bugetul planificat' : 'Peste bugetul planificat'} cu {Math.abs(Math.round(data.performance.pct))}%
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/30">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase">Planificat (Mat)</span>
                  <span className="font-black">{fmtCost(data.performance.plannedMat)} Lei</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase">Realizat (Mat)</span>
                  <span className="font-black text-primary">{fmtCost(data.performance.spentMat)} Lei</span>
                </div>
              </div>
              
              <p className="text-[9px] text-center text-slate-400 italic">
                * Comparăm totalul planificat al materialelor din deviz cu achizițiile înregistrate ca fiind materiale.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, subValue, icon, trend }: { label: string, value: string, subValue: string, icon: React.ReactNode, trend: 'positive' | 'negative' | null }) {
  return (
    <div className="glass-card p-4 md:p-6 bg-white dark:bg-slate-900 border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend === 'positive' ? 'Safe' : 'Risk'}
          </div>
        )}
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{value}</div>
        <div className="text-[10px] font-bold text-slate-500">{subValue}</div>
      </div>
    </div>
  )
}
