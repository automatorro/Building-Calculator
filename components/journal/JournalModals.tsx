'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Plus, Trash2, X } from 'lucide-react'
import { EstimateLine } from '@/utils/calculators/estimate'
import {
  Worker, WORKER_ROLES, WEATHER_CONDITIONS,
  inputStyle, JournalEntry,
} from './types'

/* ─── Shared modal wrapper ───────────────────────────────────────────────── */
function ModalWrapper({ onClose, title, children }: {
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(30,35,41,0.55)', backdropFilter: 'blur(4px)', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 520, background: '#FAFAF8',
        borderRadius: 16, padding: '28px 28px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{
            fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize: 22, fontWeight: 400, color: '#1E2329', margin: 0,
          }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#A8A59E', padding: 4, display: 'flex', alignItems: 'center',
          }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ─── Label helper ───────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 600, color: '#6B6860',
      textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6,
    }}>
      {children}
    </label>
  )
}

/* ─── AddCrewModal ───────────────────────────────────────────────────────── */
export function AddCrewModal({ projectId, stages, onClose, onSaved }: {
  projectId: string
  stages: string[]
  onClose: () => void
  onSaved: () => void
}) {
  const supabase = createClient()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [stageName, setStageName] = useState(stages[0] || '')
  const [workers, setWorkers] = useState<Worker[]>([{ name: '', role: 'Zidar', hours: 8 }])
  const [saving, setSaving] = useState(false)

  const addWorker = () => setWorkers(w => [...w, { name: '', role: 'Muncitor necalificat', hours: 8 }])
  const removeWorker = (i: number) => setWorkers(w => w.filter((_, idx) => idx !== i))
  const updateWorker = (i: number, field: keyof Worker, value: string | number) =>
    setWorkers(w => w.map((wk, idx) => idx === i ? { ...wk, [field]: value } : wk))

  const handleSave = async () => {
    const validWorkers = workers.filter(w => w.name.trim())
    if (validWorkers.length === 0) { toast.error('Adaugă cel puțin un muncitor.'); return }
    setSaving(true)
    const { error } = await supabase.from('journal_entries').insert({
      project_id: projectId,
      date,
      entry_type: 'crew',
      stage_name: stageName || null,
      data: { workers: validWorkers },
    })
    setSaving(false)
    if (error) { toast.error('Eroare la salvare: ' + error.message); return }
    toast.success('Prezență echipă salvată.')
    onSaved()
    onClose()
  }

  return (
    <ModalWrapper onClose={onClose} title="Prezență echipă">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <Label>Dată</Label>
            <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Etapă (opțional)</Label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={stageName} onChange={e => setStageName(e.target.value)}>
              <option value="">— fără etapă —</option>
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label>Muncitori</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {workers.map((w, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 6, alignItems: 'center' }}>
                <input
                  placeholder="Nume"
                  style={{ ...inputStyle, padding: '8px 10px' }}
                  value={w.name}
                  onChange={e => updateWorker(i, 'name', e.target.value)}
                />
                <select
                  style={{ ...inputStyle, padding: '8px 10px', cursor: 'pointer' }}
                  value={w.role}
                  onChange={e => updateWorker(i, 'role', e.target.value)}
                >
                  {WORKER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input
                  type="number" min={1} max={16}
                  style={{ ...inputStyle, padding: '8px 10px', width: 60 }}
                  value={w.hours}
                  onChange={e => updateWorker(i, 'hours', Number(e.target.value))}
                />
                <button onClick={() => removeWorker(i)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#C0392B', padding: 4, display: 'flex', alignItems: 'center',
                }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addWorker} style={{
            marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px dashed #E5E3DE',
            borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontSize: 12, color: '#6B6860', fontFamily: 'inherit',
          }}>
            <Plus size={13} /> Adaugă muncitor
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', background: 'transparent',
            border: '1px solid #E5E3DE', borderRadius: 8,
            fontSize: 14, color: '#6B6860', cursor: 'pointer', fontFamily: 'inherit',
          }}>Anulează</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '11px', background: '#E8500A', border: 'none',
            borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'white',
            cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Se salvează...' : 'Salvează'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}

/* ─── AddWorkModal ───────────────────────────────────────────────────────── */
export function AddWorkModal({ projectId, stages, lines, preselectedLineId, onClose, onSaved }: {
  projectId: string
  stages: string[]
  lines: EstimateLine[]
  preselectedLineId?: string
  onClose: () => void
  onSaved: (lineId: string | undefined, progress: number) => void
}) {
  const supabase = createClient()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [lineId, setLineId] = useState(preselectedLineId || '')
  const [progress, setProgress] = useState(0)
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedLine = lines.find(l => l.id === lineId)

  const handleSave = async () => {
    setSaving(true)

    const { error } = await supabase.from('journal_entries').insert({
      project_id: projectId,
      date,
      entry_type: 'work',
      stage_name: selectedLine?.stage_name || null,
      estimate_line_id: lineId || null,
      data: { description, progress_pct: progress, note },
    })

    if (error) { setSaving(false); toast.error('Eroare la salvare: ' + error.message); return }

    if (lineId) {
      await supabase.from('estimate_lines').update({ progress_pct: progress }).eq('id', lineId)
    }

    setSaving(false)
    toast.success('Progres actualizat.')
    onSaved(lineId || undefined, progress)
    onClose()
  }

  return (
    <ModalWrapper onClose={onClose} title="Înregistrează lucrare">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div>
          <Label>Dată</Label>
          <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
          <Label>Articol din deviz (opțional)</Label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={lineId} onChange={e => setLineId(e.target.value)}>
            <option value="">— fără legătură la deviz —</option>
            {lines.map(l => {
              const name = l.name || l.manual_name || l.items?.name || 'Articol'
              const stage = l.stage_name ? ` (${l.stage_name})` : ''
              return <option key={l.id} value={l.id}>{name}{stage}</option>
            })}
          </select>
        </div>

        <div>
          <Label>Progres realizat: <strong style={{ color: '#E8500A' }}>{progress}%</strong></Label>
          <input
            type="range" min={0} max={100} step={1}
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#E8500A', cursor: 'pointer' }}
          />
          <div style={{
            marginTop: 6, height: 8, borderRadius: 100,
            background: '#F3F2EF', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 100,
              width: `${progress}%`,
              background: progress === 100 ? '#2A7D4F' : '#E8500A',
              transition: 'width .2s',
            }} />
          </div>
        </div>

        <div>
          <Label>Descriere lucrare (opțional)</Label>
          <textarea
            placeholder="ex: S-au turnat 12mc din 15mc planificați"
            style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Notă (opțional)</Label>
          <input
            placeholder="ex: s-a oprit din cauza ploii la ora 14"
            style={inputStyle}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', background: 'transparent',
            border: '1px solid #E5E3DE', borderRadius: 8,
            fontSize: 14, color: '#6B6860', cursor: 'pointer', fontFamily: 'inherit',
          }}>Anulează</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '11px', background: '#E8500A', border: 'none',
            borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'white',
            cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Se salvează...' : 'Salvează progres'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
