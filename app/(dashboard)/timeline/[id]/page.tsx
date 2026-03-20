"use client"

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CalendarDays, Flag, Clock } from "lucide-react"

// Preset rules (user requirement: fiecare etapă depinde de precedenta, durate preset)
const TIMELINE_STAGES = [
  { id: 1, name: 'Studiu Geotehnic & Avize', durationWeeks: 4, deps: [] },
  { id: 2, name: 'Fundație', durationWeeks: 3, deps: [1] },
  { id: 3, name: 'Structură (inclusiv plăci)', durationWeeks: 4, deps: [2] },
  { id: 4, name: 'Zidărie (Interioară & Exterioară)', durationWeeks: 3, deps: [3] },
  { id: 5, name: 'Acoperiș', durationWeeks: 2, deps: [4] },
  { id: 6, name: 'Instalații (Sanitare, Electrice, Termice)', durationWeeks: 4, deps: [5] },
  { id: 7, name: 'Finisaje (Șape, Tencuieli, Glet, Vopsea)', durationWeeks: 5, deps: [6] },
]

export default function TimelinePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  useEffect(() => {
    if (params?.id === 'current') router.replace('/projects')
  }, [params?.id, router])
  const totalWeeks = TIMELINE_STAGES.reduce((acc, stage) => acc + stage.durationWeeks, 0)
  
  let currentStartWeek = 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            Planificator Lucrări
          </h1>
          <p className="text-slate-500 mt-1">Timeline automat generat ({totalWeeks} săptămâni cumulate). Fiecare etapă depinde de finalizarea celei precedente.</p>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <div className="min-w-[800px]">
           {/* Timeline Header (Weeks) */}
           <div className="flex border-b border-slate-200 pb-2 mb-4">
              <div className="w-64 shrink-0 font-medium text-slate-500 text-sm">Etape / Lucrări</div>
              <div className="flex-1 flex justify-between px-4 text-xs font-semibold text-slate-400">
                <span>Start</span>
                <span>Jumătate</span>
                <span>Final ({totalWeeks} săpt)</span>
              </div>
           </div>

           {/* Timeline Rows */}
           <div className="space-y-4 relative">
              {/* Optional graphical vertical line guides */}
              <div className="absolute top-0 bottom-0 left-64 right-0 flex justify-evenly pointer-events-none opacity-20">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-px bg-slate-400 h-full"></div>
                ))}
              </div>

              {TIMELINE_STAGES.map((stage, index) => {
                const widthPercent = (stage.durationWeeks / totalWeeks) * 100
                const leftPercent = (currentStartWeek / totalWeeks) * 100
                
                currentStartWeek += stage.durationWeeks // increment for next stage

                return (
                  <div key={stage.id} className="flex items-center relative z-10 group">
                    <div className="w-64 shrink-0 flex items-center gap-2 pr-4">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono border border-blue-200 shrink-0">
                        {stage.id}
                      </div>
                      <span className="text-sm font-medium text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">{stage.name}</span>
                    </div>

                    <div className="flex-1 relative h-10 bg-slate-100/50 rounded-lg">
                       <div 
                         className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md shadow-sm flex items-center px-3 overflow-hidden"
                         style={{ 
                            left: `${leftPercent}%`, 
                            width: `${widthPercent}%`,
                            minWidth: '40px'
                         }}
                       >
                         <span className="text-white text-xs font-medium truncate drop-shadow-sm">
                           {stage.durationWeeks}săpt
                         </span>
                       </div>
                    </div>
                  </div>
                )
              })}
           </div>

           <div className="mt-8 pt-4 border-t border-slate-200 flex items-center gap-6 justify-end text-sm text-slate-600">
             <div className="flex items-center gap-2">
               <Clock className="w-4 h-4 text-slate-400" />
               Durată Toală: <span className="font-bold text-slate-900">{totalWeeks} săptămâni</span>
             </div>
             <div className="flex items-center gap-2">
               <Flag className="w-4 h-4 text-green-500" />
               Dată estimată finalizare: <strong>Calculat la lansare</strong>
             </div>
           </div>

        </div>
      </div>
    </div>
  )
}
