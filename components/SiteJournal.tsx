'use client'

import { useState, useEffect, useMemo, type ElementType } from 'react'
import { createClient } from '@/utils/supabase/client'
import { EstimateLine } from '@/utils/calculators/estimate'
import { Users, ClipboardList, CalendarDays, FileText, Plus, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  JournalEntry, EntryType, ENTRY_TYPE_LABELS, ENTRY_TYPE_COLORS,
  formatDateRo, getEntryDescription,
} from './journal/types'
import { AddCrewModal, AddWorkModal } from './journal/JournalModals'

interface SiteJournalProps {
  projectId: string
  projectName: string
  stages: string[]
  lines: EstimateLine[]
  onUpdateLineProg?: (lineId: string, progress: number) => void
}

type JournalTab = 'timeline' | 'crew' | 'work' | 'export'

const TABS: { id: JournalTab; label: string; icon: ElementType }[] = [
  { id: 'timeline',  label: 'Cronologic', icon: CalendarDays },
  { id: 'crew',      label: 'Echipă',     icon: Users },
  { id: 'work',      label: 'Lucrări',    icon: ClipboardList },
  { id: 'export',    label: 'Export',     icon: FileText },
]

/* ─── Entry type icon ────────────────────────────────────────────────────── */
function EntryTypeBadge({ type }: { type: EntryType }) {
  const c = ENTRY_TYPE_COLORS[type]
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
      background: c.bg, color: c.text, border: `1px solid ${c.border}20`,
      textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap',
    }}>
      {ENTRY_TYPE_LABELS[type]}
    </span>
  )
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */
function EmptyState({ icon: Icon, title, subtitle }: {
  icon: ElementType; title: string; subtitle: string
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '56px 32px', textAlign: 'center',
    }}>
      <Icon size={36} style={{ color: '#A8A59E', marginBottom: 14 }} />
      <p style={{
        fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
        fontSize: 20, fontWeight: 400, color: '#1E2329', marginBottom: 6,
      }}>{title}</p>
      <p style={{ fontSize: 13, color: '#6B6860', maxWidth: 280, lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  )
}

/* ─── Skeleton loader ────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: 60, borderRadius: 10, background: '#F3F2EF',
          animation: 'pulse 1.5s infinite',
        }} />
      ))}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function SiteJournal({
  projectId, projectName, stages, lines, onUpdateLineProg,
}: SiteJournalProps) {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<JournalTab>('timeline')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lineProgress, setLineProgress] = useState<Record<string, number>>({})
  const [modal, setModal] = useState<'crew' | 'work' | null>(null)
  const [preselectedLine, setPreselectedLine] = useState<string | undefined>()

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  const fetchProgress = async () => {
    const { data } = await supabase
      .from('estimate_lines')
      .select('id, progress_pct')
      .eq('project_id', projectId)
    if (data) {
      const map: Record<string, number> = {}
      data.forEach((r: any) => { map[r.id] = r.progress_pct ?? 0 })
      setLineProgress(map)
    }
  }

  useEffect(() => {
    fetchEntries()
    fetchProgress()
  }, [projectId])

  const handleWorkSaved = (lineId: string | undefined, progress: number) => {
    fetchEntries()
    if (lineId) {
      setLineProgress(prev => ({ ...prev, [lineId]: progress }))
      onUpdateLineProg?.(lineId, progress)
    }
  }

  /* Grupează entries pe dată */
  const byDate = useMemo(() => {
    const map: Record<string, JournalEntry[]> = {}
    entries.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [entries])

  /* crew entries */
  const crewEntries = useMemo(() => entries.filter(e => e.entry_type === 'crew'), [entries])

  /* statistici pentru export */
  const exportStats = useMemo(() => {
    const totalDays = new Set(entries.map(e => e.date)).size
    const totalWorkerDays = crewEntries.reduce((s, e) => s + (e.data?.workers?.length ?? 0), 0)
    const linesWithProgress = Object.values(lineProgress).filter(v => v > 0).length
    return { totalDays, totalWorkerDays, linesWithProgress }
  }, [entries, crewEntries, lineProgress])

  /* ── Tab: CRONOLOGIC ───────────────────────────────────────────────────── */
  const renderTimeline = () => {
    if (loading) return <Skeleton />
    if (byDate.length === 0) return (
      <EmptyState
        icon={CalendarDays}
        title="Nicio intrare în jurnal"
        subtitle="Adaugă prezența echipei sau înregistrează lucrările executate."
      />
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {byDate.map(([date, dayEntries]) => (
          <div key={date}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: '#A8A59E',
              textTransform: 'uppercase', letterSpacing: '.06em',
              marginBottom: 10, paddingLeft: 4,
            }}>
              {formatDateRo(date)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dayEntries.map(entry => (
                <div key={entry.id} style={{
                  background: '#FAFAF8', border: '1px solid #E5E3DE',
                  borderRadius: 10, padding: '12px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: ENTRY_TYPE_COLORS[entry.entry_type].bg,
                    border: `1px solid ${ENTRY_TYPE_COLORS[entry.entry_type].border}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>
                    {entry.entry_type === 'crew' && '👷'}
                    {entry.entry_type === 'work' && '🔧'}
                    {entry.entry_type === 'weather' && '🌤️'}
                    {entry.entry_type === 'note' && '📝'}
                    {entry.entry_type === 'problem' && '⚠️'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <EntryTypeBadge type={entry.entry_type} />
                      {entry.stage_name && (
                        <span style={{ fontSize: 11, color: '#A8A59E' }}>{entry.stage_name}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: '#1E2329', lineHeight: 1.5, margin: 0 }}>
                      {getEntryDescription(entry)}
                    </p>
                    {entry.entry_type === 'work' && entry.data?.progress_pct != null && (
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 100, background: '#F3F2EF', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 100,
                            width: `${entry.data.progress_pct}%`,
                            background: entry.data.progress_pct === 100 ? '#2A7D4F' : '#E8500A',
                          }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B6860', whiteSpace: 'nowrap' }}>
                          {entry.data.progress_pct}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  /* ── Tab: ECHIPĂ ───────────────────────────────────────────────────────── */
  const renderCrew = () => {
    if (loading) return <Skeleton />
    if (crewEntries.length === 0) return (
      <EmptyState
        icon={Users}
        title="Nicio prezență înregistrată"
        subtitle="Înregistrează zilnic cine a lucrat pe șantier și câte ore."
      />
    )
    return (
      <div style={{ background: '#FAFAF8', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F3F2EF', borderBottom: '1px solid #E5E3DE' }}>
              {['Dată', 'Muncitori', 'Total ore', 'Etapă'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: 10, fontWeight: 700, color: '#6B6860',
                  textTransform: 'uppercase', letterSpacing: '.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crewEntries.map(entry => {
              const workers = entry.data?.workers ?? []
              const totalHours = workers.reduce((s: number, w: any) => s + (w.hours || 0), 0)
              return (
                <tr key={entry.id} style={{ borderBottom: '1px solid #F3F2EF' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#6B6860', whiteSpace: 'nowrap' }}>
                    {new Date(entry.date + 'T12:00:00').toLocaleDateString('ro-RO')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {workers.map((w: any, i: number) => (
                        <span key={i} style={{
                          padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                          background: '#E6F1FB', color: '#093462',
                        }}>
                          {w.name} ({w.role}) · {w.hours}h
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E2329' }}>
                    {totalHours}h
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6860' }}>
                    {entry.stage_name || '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  /* ── Tab: LUCRĂRI ──────────────────────────────────────────────────────── */
  const renderWork = () => {
    if (lines.length === 0) return (
      <EmptyState
        icon={ClipboardList}
        title="Niciun articol în deviz"
        subtitle="Adaugă mai întâi articole în deviz pentru a urmări progresul lor."
      />
    )

    const byStage: Record<string, EstimateLine[]> = {}
    lines.forEach(l => {
      const s = l.stage_name || 'Fără etapă'
      if (!byStage[s]) byStage[s] = []
      byStage[s].push(l)
    })

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {Object.entries(byStage).map(([stage, stageLines]) => (
          <div key={stage}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: '#A8A59E',
              textTransform: 'uppercase', letterSpacing: '.06em',
              marginBottom: 8, paddingLeft: 4,
            }}>
              {stage}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stageLines.map(line => {
                const prog = lineProgress[line.id] ?? 0
                const name = line.name || line.manual_name || line.items?.name || 'Articol'
                const isDone = prog === 100
                return (
                  <div key={line.id} style={{
                    background: '#FAFAF8', border: '1px solid #E5E3DE',
                    borderRadius: 10, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E2329', margin: 0 }}>{name}</p>
                        {isDone && (
                          <span style={{
                            padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                            background: '#E8F5EE', color: '#1F5E3A',
                          }}>✓ Finalizat</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 100, background: '#F3F2EF', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 100,
                            width: `${prog}%`,
                            background: isDone ? '#2A7D4F' : '#E8500A',
                            transition: 'width .3s',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? '#2A7D4F' : '#6B6860', minWidth: 36, textAlign: 'right' }}>
                          {prog}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setPreselectedLine(line.id); setModal('work') }}
                      style={{
                        flexShrink: 0, padding: '6px 12px', background: '#F3F2EF',
                        border: '1px solid #E5E3DE', borderRadius: 8, cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, color: '#6B6860', fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Actualizează %
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  /* ── Tab: EXPORT ───────────────────────────────────────────────────────── */
  const renderExport = () => (
    <div>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>

      <div className="no-print" style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#E8500A', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          <FileText size={15} /> Printează / Salvează PDF
        </button>
      </div>

      {/* Conținut printabil */}
      <div style={{ fontFamily: 'serif' }}>
        <div style={{ borderBottom: '2px solid #1E2329', paddingBottom: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1E2329', margin: '0 0 4px' }}>
            Jurnal de Șantier
          </h1>
          <p style={{ fontSize: 14, color: '#6B6860', margin: 0 }}>
            {projectName} · Generat {new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Sumar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Zile lucrate', value: exportStats.totalDays },
            { label: 'Muncitori-zile', value: exportStats.totalWorkerDays },
            { label: 'Articole cu progres', value: exportStats.linesWithProgress },
          ].map(s => (
            <div key={s.label} style={{
              border: '1px solid #E5E3DE', borderRadius: 8, padding: '14px 16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#1E2329', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#6B6860', margin: 0, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Intrări pe zile */}
        {byDate.length === 0 ? (
          <p style={{ color: '#A8A59E', fontStyle: 'italic' }}>Nicio intrare înregistrată.</p>
        ) : (
          byDate.map(([date, dayEntries]) => (
            <div key={date} style={{ marginBottom: 20, pageBreakInside: 'avoid' as const }}>
              <p style={{
                fontSize: 12, fontWeight: 700, color: '#6B6860',
                textTransform: 'uppercase', letterSpacing: '.06em',
                borderBottom: '1px solid #E5E3DE', paddingBottom: 6, marginBottom: 10,
              }}>
                {formatDateRo(date)}
              </p>
              {dayEntries.map(entry => (
                <div key={entry.id} style={{ display: 'flex', gap: 10, marginBottom: 6, paddingLeft: 8 }}>
                  <span style={{ fontSize: 12, color: '#6B6860', minWidth: 70, fontWeight: 600 }}>
                    {ENTRY_TYPE_LABELS[entry.entry_type]}
                  </span>
                  <span style={{ fontSize: 12, color: '#1E2329' }}>{getEntryDescription(entry)}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )

  /* ── Render principal ──────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={20} style={{ color: '#E8500A' }} />
          <h2 style={{
            fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize: 22, fontWeight: 400, color: '#1E2329', margin: 0,
          }}>
            Jurnal de Șantier
          </h2>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setPreselectedLine(undefined); setModal('work') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#F3F2EF', border: '1px solid #E5E3DE',
              borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: '#6B6860', fontFamily: 'inherit',
            }}
          >
            <Plus size={13} /> Lucrare
          </button>
          <button
            onClick={() => setModal('crew')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#E8500A', border: 'none',
              borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'white', fontFamily: 'inherit',
            }}
          >
            <Plus size={13} /> Prezență echipă
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print" style={{
        background: '#F3F2EF', padding: 4, borderRadius: 10,
        display: 'flex', gap: 2, width: 'max-content',
        border: '1px solid #E5E3DE',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
              fontSize: 12, fontWeight: active ? 600 : 500,
              display: 'flex', alignItems: 'center', gap: 6,
              background: active ? 'white' : 'transparent',
              color: active ? '#E8500A' : '#6B6860',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all .15s', whiteSpace: 'nowrap',
            }}>
              <Icon size={13} style={{ color: active ? '#E8500A' : '#A8A59E' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Conținut */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'timeline' && renderTimeline()}
          {activeTab === 'crew'     && renderCrew()}
          {activeTab === 'work'     && renderWork()}
          {activeTab === 'export'   && renderExport()}
        </motion.div>
      </AnimatePresence>

      {/* Modaluri */}
      {modal === 'crew' && (
        <AddCrewModal
          projectId={projectId}
          stages={stages}
          onClose={() => setModal(null)}
          onSaved={fetchEntries}
        />
      )}
      {modal === 'work' && (
        <AddWorkModal
          projectId={projectId}
          stages={stages}
          lines={lines}
          preselectedLineId={preselectedLine}
          onClose={() => setModal(null)}
          onSaved={handleWorkSaved}
        />
      )}
    </div>
  )
}
