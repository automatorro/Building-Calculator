'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, ArrowRight, BarChart3, Wallet, Clock, CheckCircle2 } from 'lucide-react'
import { FinancialsSummary } from '@/utils/calculators/financials'
import { motion } from 'framer-motion'

interface ProjectDashboardProps {
  financials: FinancialsSummary
  projectName: string
  onAddPurchase: () => void
  onViewStages: () => void
}

export default function ProjectDashboard({ financials, projectName, onAddPurchase, onViewStages }: ProjectDashboardProps) {
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
          value={`${totalSpent.toLocaleString('ro-RO')} Lei`}
          subValue="Total ieșiri reale"
          icon={<DollarSign className="text-blue-500" />}
          trend={null}
        />
        <SummaryCard 
          label="Cât mai am?" 
          value={`${remainingBudget.toLocaleString('ro-RO')} Lei`}
          subValue="Buget planificat rămas"
          icon={<Wallet className="text-green-500" />}
          trend={null}
        />
        <SummaryCard 
          label="Profit Estimat" 
          value={`${netProfit.toLocaleString('ro-RO')} Lei`}
          subValue={`${marginPercent.toFixed(1)}% Marjă Profit`}
          icon={<TrendingUp className="text-primary" />}
          trend={marginPercent > 10 ? 'positive' : 'negative'}
        />
        <SummaryCard 
          label="Status Buget" 
          value={isOverBudget ? 'Derapaj' : 'În Grafic'}
          subValue={`${percentSpent.toFixed(1)}% din plan consumat`}
          icon={isOverBudget ? <AlertTriangle className="text-red-500" /> : <BarChart3 className="text-primary" />}
          trend={isOverBudget ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 md:p-8 bg-white dark:bg-slate-900 border-border/50 shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Progres Cheltuieli vs. Buget</h3>
                  <div className="text-3xl font-black">{percentSpent.toFixed(1)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Limită Buget:</div>
                  <div className="font-mono font-bold">{totalBudget.toLocaleString('ro-RO')} Lei</div>
                </div>
              </div>
              
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, percentSpent)}%` }}
                  className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]`}
                />
              </div>
              
              <div className="grid grid-cols-2 mt-8 pt-8 border-t border-border/30 gap-8">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Venit Total (Vânzare)</div>
                  <div className="text-xl font-bold font-mono">{totalEstimatedRevenue.toLocaleString('ro-RO')} Lei</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cheltuieli Reale</div>
                  <div className="text-xl font-bold font-mono">{totalSpent.toLocaleString('ro-RO')} Lei</div>
                </div>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Etape Drill-down */}
          <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-lg">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
              <h3 className="font-black uppercase text-xs tracking-widest">Performanță pe Etape</h3>
              <button 
                onClick={onViewStages}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                Vezi toate etapele <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-border/50">
              {deviations.slice(0, 5).map((dev, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="space-y-1">
                    <div className="font-bold text-sm tracking-tight">{dev.stage}</div>
                    <div className="text-[10px] font-medium text-slate-400">
                      Rămas: <span className="font-bold text-slate-600">{(dev.planned - dev.spent).toLocaleString('ro-RO')} Lei</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-black ${dev.diff > 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                      {dev.spent.toLocaleString('ro-RO')} Lei
                    </div>
                    <div className={`text-[9px] font-black uppercase ${dev.diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {dev.diff > 0 ? `+${dev.percent.toFixed(1)}% Depășire` : `-${Math.abs(dev.percent).toFixed(1)}% sub buget`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Alerts & Forecast */}
        <div className="space-y-6">
          <div className={`glass-card p-6 border-border/20 ${alerts.some(a => a.type === 'danger') ? 'bg-red-50/30 dark:bg-red-950/20 ring-1 ring-red-500/20' : 'bg-orange-50/20 dark:bg-orange-950/20'}`}>
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
                        Impact: {alert.impact.toLocaleString('ro-RO')} Lei
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

          <div className="glass-card p-6 bg-slate-900 text-white shadow-2xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Clock size={18} />
                <h3 className="font-black uppercase text-xs tracking-widest">Cashflow Forecast (30 zile)</h3>
              </div>
              <div className="space-y-6">
                <div className="pb-6 border-b border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Necesar de plată</div>
                  <div className="text-2xl font-black text-primary">
                    {upcomingCosts.reduce((sum, c) => sum + c.amount, 0).toLocaleString('ro-RO')} Lei
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">Estimat bazat pe etapele nelucrate</div>
                </div>
                
                <div className="space-y-4">
                  {upcomingCosts.slice(0, 3).map((cost, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="p-1.5 bg-white/5 rounded-lg text-primary"><Calendar size={12} /></div>
                      <div>
                        <div className="text-[11px] font-bold tracking-tight">{cost.stage}</div>
                        <div className="text-[10px] text-slate-500">{cost.amount.toLocaleString('ro-RO')} Lei</div>
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

          <div className="p-6 rounded-3xl border-2 border-dashed border-border flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
              <BarChart3 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Vrei să reduci costul?</h4>
              <p className="text-[10px] text-slate-500 mt-1">Rulează un scenariu de tip " EPS vs Vată" pentru a vedea impactul în profitul final.</p>
            </div>
            <button className="text-[10px] font-black text-primary uppercase border-b border-primary/30">Start Scenariu</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, subValue, icon, trend }: { label: string, value: string, subValue: string, icon: React.ReactNode, trend: 'positive' | 'negative' | null }) {
  return (
    <div className="glass-card p-6 bg-white dark:bg-slate-900 border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
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
