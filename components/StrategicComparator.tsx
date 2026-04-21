'use client'

import { useState, useMemo, useEffect } from 'react'
import { BarChart3, Clock, DollarSign, ArrowRight, Zap, Info, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

interface Scenario {
  id: string
  name: string
  icon: string
  options: [Option, Option]
}

interface Option {
  name: string
  materialCostPerUM: number
  laborCostPerUM: number
  timePerUM: number // hours
  um: string
  description: string
  symbol?: string
}

const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'zidarie',
    name: 'Zidărie: BCA vs Cărămidă',
    icon: '🏗️',
    options: [
      {
        name: 'Blocuri BCA (25cm)',
        symbol: 'ZdA02A1',
        materialCostPerUM: 520, // fallback
        laborCostPerUM: 120,    
        timePerUM: 0.6,         
        um: 'mc',
        description: 'Rapiditate maximă, izolare termică bună, preț scăzut.'
      },
      {
        name: 'Cărămidă Eficientă (25cm)',
        symbol: 'ZdA01B1',
        materialCostPerUM: 690, // fallback
        laborCostPerUM: 160,    
        timePerUM: 0.9,         
        um: 'mc',
        description: 'Masă termică ridicată, durabilitate tradițională, execuție mai lentă.'
      }
    ]
  },
  {
    id: 'termoizolatie',
    name: 'Fațadă: Polistiren vs Vată Bazaltică',
    icon: '🏠',
    options: [
      {
        name: 'Polistiren EPS 80 (10cm)',
        symbol: 'IzA01A1',
        materialCostPerUM: 185,  
        laborCostPerUM: 55,     
        timePerUM: 0.4,         
        um: 'mp',
        description: 'Cea mai economică variantă, execuție rapidă.'
      },
      {
        name: 'Vată Bazaltică (10cm)',
        symbol: 'IzA02A1',
        materialCostPerUM: 250, 
        laborCostPerUM: 75,     
        timePerUM: 0.7,         
        um: 'mp',
        description: 'Ignifugă, permeabilitate la vapori, izolare fonică superioară.'
      }
    ]
  }
]

interface StrategicComparatorProps {
  initialArea?: number
}

export default function StrategicComparator({ initialArea = 100 }: StrategicComparatorProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS)
  const [selectedScenarioId, setSelectedScenarioId] = useState(DEFAULT_SCENARIOS[0].id)
  const [area, setArea] = useState(initialArea)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function syncPrices() {
      setLoading(true)
      const symbols = DEFAULT_SCENARIOS.flatMap(s => s.options.map(o => o.symbol).filter(Boolean))
      
      const { data } = await supabase
        .from('catalog_norms')
        .select('symbol, unit_price')
        .in('symbol', symbols)

      if (data) {
        const updated = DEFAULT_SCENARIOS.map(s => ({
          ...s,
          options: s.options.map(o => {
            const match = data.find(d => d.symbol === o.symbol)
            return match ? { ...o, materialCostPerUM: Number(match.unit_price) } : o
          }) as [Option, Option]
        }))
        setScenarios(updated)
      }
      setLoading(false)
    }

    syncPrices()
  }, [])

  const scenario = useMemo(() => 
    scenarios.find(s => s.id === selectedScenarioId) || scenarios[0]
  , [selectedScenarioId, scenarios])

  const results = useMemo(() => {
    return scenario.options.map(opt => {
      const totalMat = opt.materialCostPerUM * area
      const totalLabor = opt.laborCostPerUM * area
      const totalTime = opt.timePerUM * area
      return {
        ...opt,
        totalMat,
        totalLabor,
        totalTime,
        totalCost: totalMat + totalLabor
      }
    })
  }, [scenario, area])

  const diff = useMemo(() => {
    const costDiff = Math.abs(results[0].totalCost - results[1].totalCost)
    const timeDiff = Math.abs(results[0].totalTime - results[1].totalTime)
    const cheapestIdx = results[0].totalCost < results[1].totalCost ? 0 : 1
    const fastestIdx = results[0].totalTime < results[1].totalTime ? 0 : 1

    return { costDiff, timeDiff, cheapestIdx, fastestIdx }
  }, [results])

  const S = {
    orange: '#E8500A',
    black: '#1E2329',
    gray100: '#F3F2EF',
    gray200: '#E5E3DE',
    green: '#10B981',
    red: '#EF4444'
  }

  return (
    <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-2xl overflow-hidden rounded-3xl">
      <div className="p-6 md:p-8 border-b border-border/30 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Comparator de Scenarii</h3>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">Optimizare Cost/Timp</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedScenarioId === s.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-8 p-6 bg-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-primary text-xs font-black uppercase tracking-widest">
              <Zap size={14} /> Parametru de calcul
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Cantitate totală ({scenario.options[0].um})</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    value={area}
                    onChange={(e) => setArea(parseInt(e.target.value))}
                  />
                  <input 
                    type="number"
                    className="w-24 bg-slate-800 border-none rounded-xl py-2 px-3 text-center text-lg font-black text-white focus:ring-2 focus:ring-primary outline-none"
                    value={area}
                    onChange={(e) => setArea(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hidden md:block">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Atenție</p>
                <p className="text-xs text-slate-300">Modifică suprafața pentru a vedea cum cresc diferențele de cost/timp la scară mare.</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {results.map((res, i) => (
            <div key={i} className={`p-6 md:p-8 rounded-3xl border-2 transition-all ${i === diff.cheapestIdx ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/20' : 'bg-white dark:bg-slate-900 border-border/50'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Opțiunea {i + 1}</div>
                  <h4 className="text-xl font-black group-hover:text-primary transition-colors">{res.name}</h4>
                </div>
                {i === diff.cheapestIdx && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-500/20">Cea mai ieftină</span>
                )}
                {i !== diff.cheapestIdx && i === diff.fastestIdx && (
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg shadow-amber-500/20">Cea mai rapidă</span>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>Cost Materiale</span>
                    <span>{res.materialCostPerUM} lei / {res.um}</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {res.totalMat.toLocaleString('ro-RO')} <span className="text-xs">Lei</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-border/30">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Manoperă Est.</div>
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{res.totalLabor.toLocaleString('ro-RO')} Lei</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timp Manoperă</div>
                    <div className="text-lg font-bold text-amber-600 flex items-center gap-2">
                      <Clock size={16} /> {Math.ceil(res.totalTime)} h
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investiție Totală</div>
                  <div className={`text-3xl lg:text-4xl font-black ${i === diff.cheapestIdx ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {res.totalCost.toLocaleString('ro-RO')} Lei
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Versi Overlay Hub */}
          <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex flex-col items-center gap-3 w-full lg:w-auto p-4 z-10">
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 text-center min-w-[200px]">
              <div className="text-[9px] font-black uppercase text-primary mb-1">Diferența de Cost</div>
              <div className="text-xl font-black text-primary">-{diff.costDiff.toLocaleString('ro-RO')} Lei</div>
              <div className="h-px bg-white/10 my-2" />
              <div className="text-[9px] font-black uppercase text-amber-500 mb-1">Economie Timp</div>
              <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                <Zap size={14} /> {Math.ceil(diff.timeDiff)} Ore
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-950/20 rounded-3xl border border-border/50 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-md flex items-center justify-center text-primary shrink-0">
            <Info size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h5 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Concluzie Analitică</h5>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Dacă alegi <strong>{results[diff.cheapestIdx].name}</strong>, economisești <strong>{diff.costDiff.toLocaleString('ro-RO')} Lei</strong>. 
              Dacă timpul este critic, <strong>{results[diff.fastestIdx].name}</strong> îți salvează <strong>{Math.ceil(diff.timeDiff)} ore</strong> de manoperă (echivalentul a aprox. {Math.ceil(diff.timeDiff / 8)} zile de lucru pentru o echipă de 2 oameni).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
