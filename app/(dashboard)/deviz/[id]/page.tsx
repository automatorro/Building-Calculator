"use client"

import { useState, useEffect } from "react"
import { ListTree, Download, FileText, ChevronDown, CheckCircle2 } from "lucide-react"

// Hardcoded for MVP presentation. In a real app this comes from DB/State based on Estimator.
const MOCK_TOTAL_COST = 65000 

const BREAKDOWN_PERCENTAGES = [
  { id: 'fundatie', name: 'Fundație', pct: 0.15, icon: CheckCircle2 },
  { id: 'structura', name: 'Structură', pct: 0.20, icon: CheckCircle2 },
  { id: 'zidarie', name: 'Zidărie', pct: 0.15, icon: CheckCircle2 },
  { id: 'acoperis', name: 'Acoperiș', pct: 0.15, icon: CheckCircle2 },
  { id: 'instalatii', name: 'Instalații', pct: 0.15, icon: CheckCircle2 },
  { id: 'finisaje', name: 'Finisaje', pct: 0.20, icon: CheckCircle2 },
]

export default function DevizPage() {
  const [stages, setStages] = useState<any[]>([])
  const [expandedStage, setExpandedStage] = useState<string | null>('fundatie')

  useEffect(() => {
    const data = BREAKDOWN_PERCENTAGES.map(stage => {
      const stageTotal = MOCK_TOTAL_COST * stage.pct
      const materiale = stageTotal * 0.6 // 60% materiale
      const manopera = stageTotal * 0.4 // 40% manopera
      
      return {
        ...stage,
        total: stageTotal,
        materiale,
        manopera,
        items: [
          { name: 'Materiale principale', amount: materiale, unit: 'global' },
          { name: 'Manoperă echipă', amount: manopera, unit: 'ore' },
          { name: 'Utilaje și transport', amount: stageTotal * 0.05, unit: 'zile' }
        ]
      }
    })
    setStages(data)
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <ListTree className="w-8 h-8 text-blue-600" />
            Deviz Detaliat pe Etape
          </h1>
          <p className="text-slate-500 mt-1">Costul total defalcat pe etape de execuție, materiale și manoperă.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20">
            <FileText className="w-5 h-5" />
            Generează PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Deviz list */}
        <div className="lg:col-span-3 space-y-4">
          {stages.map((stage) => (
            <div key={stage.id} className="glass-card overflow-hidden border border-slate-200 transition-all duration-300">
              <button 
                onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                className="w-full flex items-center justify-between p-5 bg-white/50 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${expandedStage === stage.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <stage.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-slate-800">{stage.name}</h3>
                    <p className="text-sm text-slate-500">{((stage.pct) * 100).toFixed(0)}% din costul total</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-lg text-slate-900">{stage.total.toLocaleString('ro-RO')} EUR</div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedStage === stage.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expandedStage === stage.id && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-sm text-slate-500 mb-1">Total Materiale</div>
                      <div className="font-semibold text-lg text-blue-700">{stage.materiale.toLocaleString('ro-RO')} EUR</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-sm text-slate-500 mb-1">Total Manoperă</div>
                      <div className="font-semibold text-lg text-orange-600">{stage.manopera.toLocaleString('ro-RO')} EUR</div>
                    </div>
                  </div>

                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100/50 rounded-lg">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg font-medium">Categorie Linie</th>
                        <th className="px-4 py-3 font-medium">U.M.</th>
                        <th className="px-4 py-3 rounded-r-lg font-medium text-right">Cost Estimat (EUR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.items.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-white/40 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                          <td className="px-4 py-3 text-slate-500">{item.unit}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-700">{item.amount.toLocaleString('ro-RO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-green-500 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 text-slate-900">Sumar Total</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Materiale (60%)</span>
                <span className="font-medium text-slate-700">{(MOCK_TOTAL_COST * 0.6).toLocaleString('ro-RO')} EUR</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Manoperă (40%)</span>
                <span className="font-medium text-slate-700">{(MOCK_TOTAL_COST * 0.4).toLocaleString('ro-RO')} EUR</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-500 mb-1">Cost Total Deviz</div>
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {MOCK_TOTAL_COST.toLocaleString('ro-RO')} <span className="text-lg text-slate-400 font-normal">EUR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
