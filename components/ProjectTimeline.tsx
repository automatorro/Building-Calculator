'use client'

import { useMemo } from 'react'
import { CalendarDays, Clock, Flag, AlertCircle } from 'lucide-react'
import { Purchase } from '@/utils/calculators/financials'
import { EstimateLine } from '@/utils/calculators/estimate'

interface ProjectTimelineProps {
  stages: string[]           // din Supabase projects.stages
  lines: EstimateLine[]      // liniile de deviz reale
  purchases: Purchase[]      // achizițiile reale
  projectName: string
}

/* Durate default per tip etapă (săptămâni) — calibrate pentru case P+1 */
const DEFAULT_DURATIONS: Record<string, number> = {
  'Organizare Șantier':        1,
  'Fundație':                  3,
  'Structură':                 4,
  'Zidărie':                   3,
  'Acoperiș':                  2,
  'Instalații':                4,
  'Finisaje Interioare':       5,
  'Finisaje Exterioare':       3,
  'Termosistem':               2,
  'Tâmplărie':                 1,
  'Amenajări Exterioare':      2,
}

function getDuration(stageName: string): number {
  // Caută potrivire exactă sau parțială în cheie
  const exact = DEFAULT_DURATIONS[stageName]
  if (exact) return exact
  const partial = Object.entries(DEFAULT_DURATIONS).find(([k]) =>
    stageName.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(stageName.toLowerCase())
  )
  return partial ? partial[1] : 2 // default 2 săptămâni
}

/* Culori per etapă (ciclu) */
const STAGE_COLORS = [
  { bg: '#E8500A', light: '#FFF0E8', text: '#C43F06' },
  { bg: '#2A7D4F', light: '#E8F5EE', text: '#1F5E3A' },
  { bg: '#0C447C', light: '#E6F1FB', text: '#093462' },
  { bg: '#633806', light: '#FAEEDA', text: '#4A2904' },
  { bg: '#791F1F', light: '#FCEBEB', text: '#5C1717' },
  { bg: '#2E2D2A', light: '#F3F2EF', text: '#1E2329' },
]

export default function ProjectTimeline({
  stages,
  lines,
  purchases,
  projectName,
}: ProjectTimelineProps) {

  /* Calculează stats per etapă din date reale */
  const stageStats = useMemo(() => {
    return stages.map((stage, idx) => {
      const stageLines = lines.filter(l => l.stage_name === stage)
      const stagePurchases = purchases.filter(p => p.stage_name === stage)

      const plannedCost = stageLines.reduce((acc, l) => {
        const unitCost = l.manual_price ?? 0
        return acc + unitCost * l.quantity
      }, 0)

      const spentCost = stagePurchases.reduce((acc, p) => acc + Number(p.amount_total), 0)
      const duration = getDuration(stage)
      const color = STAGE_COLORS[idx % STAGE_COLORS.length]
      const hasActivity = stageLines.length > 0 || stagePurchases.length > 0
      const isOverBudget = plannedCost > 0 && spentCost > plannedCost

      return {
        name: stage,
        duration,
        plannedCost,
        spentCost,
        linesCount: stageLines.length,
        purchasesCount: stagePurchases.length,
        hasActivity,
        isOverBudget,
        color,
      }
    })
  }, [stages, lines, purchases])

  const totalWeeks = stageStats.reduce((acc, s) => acc + s.duration, 0)

  if (stages.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '64px 32px', textAlign: 'center',
        background: '#FAFAF8', borderRadius: 14,
        border: '1px solid #E5E3DE',
      }}>
        <CalendarDays size={40} style={{ color: '#A8A59E', marginBottom: 16 }} />
        <h3 style={{ fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
          fontSize: 22, fontWeight: 400, color: '#1E2329', marginBottom: 8 }}>
          Nicio etapă definită
        </h3>
        <p style={{ fontSize: 14, color: '#6B6860', maxWidth: 300, lineHeight: 1.6 }}>
          Adaugă etapele proiectului din secțiunea <strong>Planificare</strong> pentru a genera timeline-ul automat.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize: 26, fontWeight: 400, color: '#1E2329',
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 4,
          }}>
            Timeline Lucrări
          </h2>
          <p style={{ fontSize: 14, color: '#6B6860' }}>
            {stages.length} etape · durata estimată: <strong style={{ color: '#1E2329' }}>{totalWeeks} săptămâni</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: '#6B6860', background: '#F3F2EF',
          padding: '6px 14px', borderRadius: 100, border: '1px solid #E5E3DE' }}>
          <Clock size={13} />
          Durată secvențială · etapele se succed
        </div>
      </div>

      {/* ── Gantt bar ── */}
      <div className="overflow-x-auto">
      <div style={{
        background: '#FAFAF8', border: '1px solid #E5E3DE',
        borderRadius: 14, overflow: 'hidden', minWidth: 560,
      }}>
        {/* Header săptămâni */}
        <div style={{
          display: 'flex', borderBottom: '2px solid #E5E3DE',
          background: '#EDEBE6', padding: '12px 24px',
        }}>
          <div style={{ width: 200, flexShrink: 0, fontSize: 11,
            fontWeight: 600, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Etapă
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between',
            fontSize: 11, fontWeight: 600, color: '#A8A59E',
            textTransform: 'uppercase', letterSpacing: '.06em' }}>
            <span>Start</span>
            <span>Săpt. {Math.ceil(totalWeeks / 2)}</span>
            <span>Final ({totalWeeks} săpt.)</span>
          </div>
        </div>

        {/* Rânduri etape */}
        <div style={{ position: 'relative' }}>
          {/* Linii verticale de ghidaj */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 200,
            right: 0, display: 'flex', pointerEvents: 'none', zIndex: 0 }}>
            {[25, 50, 75].map(pct => (
              <div key={pct} style={{ position: 'absolute', left: `${pct}%`,
                top: 0, bottom: 0, width: 1, background: '#F3F2EF' }} />
            ))}
          </div>

          {stageStats.map((stage, idx) => {
            /* Calculează offset și lățime bara Gantt */
            const startWeek = stageStats.slice(0, idx).reduce((a, s) => a + s.duration, 0)
            const leftPct   = (startWeek / totalWeeks) * 100
            const widthPct  = (stage.duration / totalWeeks) * 100

            return (
              <div key={stage.name} style={{
                display: 'flex', alignItems: 'center',
                borderBottom: idx < stageStats.length - 1 ? '1px solid #F3F2EF' : 'none',
                position: 'relative', zIndex: 1, minHeight: 64,
              }}>
                {/* Nume etapă */}
                <div style={{ width: 200, flexShrink: 0, padding: '14px 24px',
                  display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%',
                    background: stage.color.bg, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1E2329', lineHeight: 1.2 }}>
                      {stage.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#A8A59E', marginTop: 2 }}>
                      {stage.duration} săpt.
                      {stage.linesCount > 0 && ` · ${stage.linesCount} articole`}
                    </div>
                  </div>
                </div>

                {/* Bara Gantt */}
                <div style={{ flex: 1, height: 56, position: 'relative', padding: '10px 0' }}>
                  <div style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: 10, bottom: 10,
                    background: stage.isOverBudget ? '#FCEBEB' : stage.color.light,
                    border: `1.5px solid ${stage.isOverBudget ? '#C0392B' : stage.color.bg}`,
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center',
                    paddingLeft: 10, overflow: 'hidden',
                    minWidth: 28,
                  }}>
                    {stage.isOverBudget && (
                      <AlertCircle size={12} style={{ color: '#C0392B', marginRight: 4, flexShrink: 0 }} />
                    )}
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: stage.isOverBudget ? '#C0392B' : stage.color.text,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {widthPct > 12 ? stage.name : ''}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer total */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '14px 24px', borderTop: '1px solid #E5E3DE',
          background: '#F3F2EF', justifyContent: 'flex-end',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B6860' }}>
            <Clock size={14} style={{ color: '#A8A59E' }} />
            Durata totală: <strong style={{ color: '#1E2329' }}>{totalWeeks} săptămâni</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B6860' }}>
            <Flag size={14} style={{ color: '#2A7D4F' }} />
            Finalizare: calculată de la data de start
          </div>
        </div>
      </div>
      </div>

      {/* ── Cards etape cu detalii ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {stageStats.map((stage) => (
          <div key={stage.name} style={{
            background: '#FAFAF8', border: `1px solid ${stage.hasActivity ? stage.color.bg + '40' : '#E5E3DE'}`,
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color.bg }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1E2329', lineHeight: 1.2 }}>
                {stage.name}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#A8A59E' }}>Durată</span>
                <span style={{ fontWeight: 500, color: '#1E2329' }}>{stage.duration} săpt.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#A8A59E' }}>Articole</span>
                <span style={{ fontWeight: 500, color: stage.linesCount > 0 ? '#1E2329' : '#A8A59E' }}>
                  {stage.linesCount > 0 ? stage.linesCount : '—'}
                </span>
              </div>
              {stage.spentCost > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#A8A59E' }}>Cheltuit</span>
                  <span style={{ fontWeight: 600, color: stage.isOverBudget ? '#C0392B' : '#2A7D4F' }}>
                    {stage.spentCost.toLocaleString('ro-RO')} lei
                  </span>
                </div>
              )}
            </div>

            {!stage.hasActivity && (
              <div style={{ marginTop: 8, padding: '4px 8px', background: '#F3F2EF',
                borderRadius: 6, fontSize: 11, color: '#A8A59E', textAlign: 'center' }}>
                Neplanificat
              </div>
            )}
            {stage.isOverBudget && (
              <div style={{ marginTop: 8, padding: '4px 8px', background: '#FCEBEB',
                borderRadius: 6, fontSize: 11, color: '#C0392B', textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <AlertCircle size={10} /> Depășire buget
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
