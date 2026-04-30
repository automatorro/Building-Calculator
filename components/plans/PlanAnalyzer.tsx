'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import {
  Upload, FileText, Image, Loader2, CheckCircle2,
  ChevronDown, ChevronUp, Copy, Save, AlertTriangle, X
} from 'lucide-react'

// ─── Tipuri ─────────────────────────────────────────────────────────────────

interface CampField {
  label: string
  valoare: string
  unitate: string
}

interface ColoanaDef {
  cheie: string
  label: string
  tip: 'text' | 'numar'
}

interface Categorie {
  id: string
  titlu: string
  tip: 'campuri' | 'tabel'
  campuri?: CampField[]
  coloane?: ColoanaDef[]
  randuri?: Record<string, string | number>[]
}

interface PlanData {
  tip_plan: string
  element: string
  scara: string
  faza: string
  categorii: Categorie[]
  note: string
}

interface PlanAnalyzerProps {
  projectId: string
  userId: string
  isPremium?: boolean
  userPlan?: string
}

// ─── Tabel densitate liniară bare armare (kg/m) ─────────────────────────────

const MASA_LINIARA: Record<number, number> = {
  6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888,
  14: 1.208, 16: 1.578, 20: 2.466, 25: 3.853,
}

function getMasaLiniara(diametru: number): number {
  return MASA_LINIARA[diametru] ?? (0.00617 * diametru * diametru)
}

// ─── Recalcul automat armare ────────────────────────────────────────────────

function recalcArmareRand(rand: Record<string, string | number>): Record<string, string | number> {
  const nrBare = Number(rand['nr_bare'] ?? 0)
  const lungime = Number(rand['lungime_m'] ?? 0)
  const diametru = Number(rand['diametru_mm'] ?? 0)

  if (nrBare === 0 && lungime === 0) return rand

  const totalLungime = nrBare * lungime
  const masaLiniara = getMasaLiniara(diametru)
  const masaTotala = parseFloat((totalLungime * masaLiniara).toFixed(3))

  return {
    ...rand,
    total_lungime_m: parseFloat(totalLungime.toFixed(3)),
    masa_liniara_kg_m: masaLiniara,
    masa_totala_kg: masaTotala,
  }
}

const ARMARE_RECALC_KEYS = new Set(['nr_bare', 'diametru_mm', 'lungime_m'])

// ─── Mesaje loading ──────────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  'Se încarcă fișierul...',
  'Se analizează planul...',
  'Se extrag datele tehnice...',
  'Se structurează informațiile...',
  'Aproape gata...',
]

// ─── Componenta principală ───────────────────────────────────────────────────

export default function PlanAnalyzer({ projectId, userId, isPremium, userPlan = 'gratuit' }: PlanAnalyzerProps) {
  const supabase = createClient()

  // Acces permis doar pentru planurile plătite (constructor, echipa) SAU dacă isPremium e true explicit.
  const canAnalyze = isPremium || userPlan === 'constructor' || userPlan === 'echipa'

  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [activeTab, setActiveTab] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Upload zone handlers ──────────────────────────────────────────────────

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) processFile(dropped)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) processFile(selected)
  }

  const processFile = (f: File) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(f.type)) {
      toast.error('Tip de fișier nesuportat. Acceptăm PDF, PNG, JPG.')
      return
    }
    const maxMB = 4
    if (f.size > maxMB * 1024 * 1024) {
      toast.error(`Fișierul depășește ${maxMB}MB. Comprimă-l înainte de upload.`)
      return
    }
    setFile(f)
    setPlanData(null)
    setSaved(false)
    analyzeFile(f)
  }

  // ─── Analiză via Next.js API route ────────────────────────────────────────

  const analyzeFile = async (f: File) => {
    if (!canAnalyze) {
      toast.error('Funcție disponibilă pentru planurile Constructor și Echipă. Upgradează pentru a analiza planuri.')
      return
    }

    setLoading(true)
    let msgIdx = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    loadingIntervalRef.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIdx])
    }, 2500)

    try {
      const arrayBuffer = await f.arrayBuffer()
      const uint8 = new Uint8Array(arrayBuffer)
      let binary = ''
      for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i])
      const fileBase64 = btoa(binary)

      const res = await fetch('/api/ai/analyze-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, mediaType: f.type }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data?.error || `Eroare server: ${res.status}`)

      if (data?.error) throw new Error(data.error)

      const result = data as PlanData
      setPlanData(result)
      setActiveTab(result.categorii?.[0]?.id ?? 'note')
      toast.success('Planul a fost analizat cu succes!')
    } catch (err: any) {
      toast.error('Eroare la analiză: ' + (err?.message ?? 'Eroare necunoscută'))
    } finally {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current)
      setLoading(false)
      setLoadingMsg('')
    }
  }

  // ─── Editare date ──────────────────────────────────────────────────────────

  const handleCampChange = (catId: string, idx: number, field: 'valoare' | 'unitate', val: string) => {
    setPlanData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        categorii: prev.categorii.map(cat =>
          cat.id !== catId ? cat : {
            ...cat,
            campuri: cat.campuri?.map((c, i) => i !== idx ? c : { ...c, [field]: val }),
          }
        )
      }
    })
  }

  const handleCellChange = (catId: string, rowIdx: number, cheie: string, val: string) => {
    setPlanData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        categorii: prev.categorii.map(cat => {
          if (cat.id !== catId || !cat.randuri) return cat
          const newRanduri = cat.randuri.map((rand, i) => {
            if (i !== rowIdx) return rand
            const updated = { ...rand, [cheie]: val }
            if (ARMARE_RECALC_KEYS.has(cheie)) return recalcArmareRand(updated)
            return updated
          })
          return { ...cat, randuri: newRanduri }
        })
      }
    })
  }

  const handleNoteChange = (val: string) => {
    setPlanData(prev => prev ? { ...prev, note: val } : prev)
  }

  // ─── Adaugă rând gol ───────────────────────────────────────────────────────

  const handleAddRow = (catId: string) => {
    setPlanData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        categorii: prev.categorii.map(cat => {
          if (cat.id !== catId || !cat.coloane) return cat
          const emptyRow: Record<string, string | number> = {}
          cat.coloane.forEach(col => { emptyRow[col.cheie] = '' })
          return { ...cat, randuri: [...(cat.randuri ?? []), emptyRow] }
        })
      }
    })
  }

  // ─── Șterge rând ──────────────────────────────────────────────────────────

  const handleDeleteRow = (catId: string, rowIdx: number) => {
    setPlanData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        categorii: prev.categorii.map(cat => {
          if (cat.id !== catId || !cat.randuri) return cat
          return { ...cat, randuri: cat.randuri.filter((_, i) => i !== rowIdx) }
        })
      }
    })
  }

  // ─── Salvare în proiect ────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!planData) return
    setSaving(true)
    try {
      const { error } = await supabase.from('plan_analyses').insert([{
        project_id: projectId,
        user_id: userId,
        tip_plan: planData.tip_plan,
        element: planData.element,
        scara: planData.scara,
        faza: planData.faza,
        categorii: planData.categorii,
        note: planData.note,
        file_name: file?.name ?? null,
      }])
      if (error) throw error
      setSaved(true)
      toast.success('Analiza a fost salvată în proiect!')
    } catch (err: any) {
      toast.error('Eroare la salvare: ' + (err?.message ?? 'Eroare necunoscută'))
    } finally {
      setSaving(false)
    }
  }

  // ─── Generează raport text ─────────────────────────────────────────────────

  const handleGenerateReport = () => {
    if (!planData) return
    const lines: string[] = [
      `RAPORT CANTITĂȚI — ${planData.tip_plan?.toUpperCase() ?? 'PLAN'}`,
      `Element: ${planData.element}   Scară: ${planData.scara}   Fază: ${planData.faza}`,
      '',
    ]
    for (const cat of planData.categorii) {
      lines.push(`── ${cat.titlu.toUpperCase()} ──`)
      if (cat.tip === 'campuri' && cat.campuri) {
        for (const c of cat.campuri) {
          lines.push(`  ${c.label}: ${c.valoare} ${c.unitate}`)
        }
      } else if (cat.tip === 'tabel' && cat.randuri && cat.coloane) {
        const header = cat.coloane.map(col => col.label.padEnd(16)).join(' ')
        lines.push('  ' + header)
        for (const rand of cat.randuri) {
          const row = cat.coloane!.map(col => String(rand[col.cheie] ?? '').padEnd(16)).join(' ')
          lines.push('  ' + row)
        }
      }
      lines.push('')
    }
    if (planData.note) {
      lines.push('NOTE:', planData.note)
    }
    const text = lines.join('\n')
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Raportul a fost copiat în clipboard!')
    })
  }

  // ─── Render upload zone ────────────────────────────────────────────────────

  if (!planData && !loading) {
    return (
      <div style={{ padding: '24px 0' }}>
        {!canAnalyze && (
          <div style={{
            background: '#FFF7ED', border: '1px solid #FDBA74',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <AlertTriangle size={16} style={{ color: '#EA580C', flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#C2410C', margin: 0 }}>
              Analiza planurilor este disponibilă pentru planurile Constructor și Echipă.
            </p>
          </div>
        )}

        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => canAnalyze && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#E8500A' : '#D1CFC9'}`,
            borderRadius: 14,
            padding: '56px 32px',
            textAlign: 'center',
            cursor: canAnalyze ? 'pointer' : 'not-allowed',
            background: dragging ? '#FFF0E8' : '#FAFAF8',
            transition: 'all .2s',
            opacity: canAnalyze ? 1 : 0.6,
          }}
        >
          <div style={{
            width: 56, height: 56, background: '#FFF0E8', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Upload size={24} style={{ color: '#E8500A' }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1E2329', marginBottom: 6 }}>
            Drag & drop plan PDF sau imagine
          </p>
          <p style={{ fontSize: 13, color: '#A8A59E', marginBottom: 0 }}>
            Suportăm PDF, PNG, JPG · Max 4 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    )
  }

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{
        padding: '80px 32px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20
      }}>
        <div style={{
          width: 64, height: 64, background: '#FFF0E8', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Loader2 size={28} style={{ color: '#E8500A', animation: 'spin 1s linear infinite' }} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1E2329', marginBottom: 6 }}>
            {file?.name}
          </p>
          <p style={{ fontSize: 13, color: '#A8A59E' }}>{loadingMsg}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ─── Editor tabular ────────────────────────────────────────────────────────

  if (!planData) return null

  const tabIds = [...planData.categorii.map(c => c.id), 'note']

  return (
    <div>
      {/* Meta info plan */}
      <div style={{
        background: '#F3F2EF', borderRadius: 10, padding: '12px 16px',
        marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {planData.tip_plan?.toLowerCase().includes('pdf') || file?.type === 'application/pdf'
            ? <FileText size={16} style={{ color: '#E8500A' }} />
            : <Image size={16} style={{ color: '#E8500A' }} />
          }
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E8500A', textTransform: 'uppercase' }}>
            {planData.tip_plan}
          </span>
        </div>
        {planData.element && (
          <span style={{ fontSize: 13, color: '#4A4744' }}>
            <strong>Element:</strong> {planData.element}
          </span>
        )}
        {planData.scara && (
          <span style={{ fontSize: 13, color: '#4A4744' }}>
            <strong>Scară:</strong> {planData.scara}
          </span>
        )}
        {planData.faza && (
          <span style={{ fontSize: 13, color: '#4A4744' }}>
            <strong>Fază:</strong> {planData.faza}
          </span>
        )}
        <button
          onClick={() => { setFile(null); setPlanData(null); setSaved(false) }}
          style={{
            marginLeft: 'auto', background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#A8A59E', display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600
          }}
        >
          <X size={14} /> Analizează alt plan
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, overflowX: 'auto',
        borderBottom: '1px solid #E5E3DE', marginBottom: 20, paddingBottom: 0,
      }}>
        {planData.categorii.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              padding: '8px 14px', border: 'none', background: 'transparent',
              borderBottom: activeTab === cat.id ? '2px solid #E8500A' : '2px solid transparent',
              color: activeTab === cat.id ? '#E8500A' : '#6B6860',
              fontWeight: activeTab === cat.id ? 700 : 500,
              fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
              marginBottom: -1, transition: 'all .15s',
            }}
          >
            {cat.titlu}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('note')}
          style={{
            padding: '8px 14px', border: 'none', background: 'transparent',
            borderBottom: activeTab === 'note' ? '2px solid #E8500A' : '2px solid transparent',
            color: activeTab === 'note' ? '#E8500A' : '#6B6860',
            fontWeight: activeTab === 'note' ? 700 : 500,
            fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
            marginBottom: -1, transition: 'all .15s',
          }}
        >
          Note
        </button>
      </div>

      {/* Conținut tab */}
      {planData.categorii.map(cat => {
        if (cat.id !== activeTab) return null
        return (
          <div key={cat.id}>
            {cat.tip === 'campuri' && cat.campuri && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}>
                {cat.campuri.map((camp, idx) => (
                  <div key={idx} style={{
                    background: '#FAFAF8', border: '1px solid #E5E3DE',
                    borderRadius: 8, padding: '12px 14px',
                  }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 6 }}>
                      {camp.label}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        value={camp.valoare}
                        onChange={e => handleCampChange(cat.id, idx, 'valoare', e.target.value)}
                        style={{
                          flex: 1, border: 'none', borderBottom: '1px solid #D1CFC9',
                          background: 'transparent', fontSize: 15, fontWeight: 600,
                          color: '#1E2329', outline: 'none', padding: '2px 0',
                        }}
                      />
                      <input
                        value={camp.unitate}
                        onChange={e => handleCampChange(cat.id, idx, 'unitate', e.target.value)}
                        placeholder="UM"
                        style={{
                          width: 56, border: 'none', borderBottom: '1px solid #D1CFC9',
                          background: 'transparent', fontSize: 12, color: '#6B6860',
                          outline: 'none', padding: '2px 0', textAlign: 'right',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cat.tip === 'tabel' && cat.coloane && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F3F2EF' }}>
                      {cat.coloane.map(col => (
                        <th key={col.cheie} style={{
                          padding: '9px 12px', textAlign: 'left',
                          fontSize: 11, fontWeight: 700, color: '#6B6860',
                          textTransform: 'uppercase', letterSpacing: '.04em',
                          borderBottom: '1px solid #E5E3DE', whiteSpace: 'nowrap',
                        }}>
                          {col.label}
                        </th>
                      ))}
                      <th style={{ width: 32 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {(cat.randuri ?? []).map((rand, rowIdx) => {
                      const isCalc = cat.coloane?.some(c => ARMARE_RECALC_KEYS.has(c.cheie))
                      return (
                        <tr key={rowIdx} style={{ borderBottom: '1px solid #F3F2EF' }}>
                          {cat.coloane!.map(col => {
                            const isAutoCalc = isCalc && !ARMARE_RECALC_KEYS.has(col.cheie) &&
                              ['total_lungime_m', 'masa_liniara_kg_m', 'masa_totala_kg'].includes(col.cheie)
                            return (
                              <td key={col.cheie} style={{ padding: '6px 12px' }}>
                                <input
                                  value={rand[col.cheie] ?? ''}
                                  readOnly={isAutoCalc}
                                  onChange={e => !isAutoCalc && handleCellChange(cat.id, rowIdx, col.cheie, e.target.value)}
                                  style={{
                                    width: '100%', border: 'none',
                                    borderBottom: isAutoCalc ? '1px solid transparent' : '1px solid #E5E3DE',
                                    background: isAutoCalc ? '#F9F8F6' : 'transparent',
                                    fontSize: 13, color: isAutoCalc ? '#6B6860' : '#1E2329',
                                    outline: 'none', padding: '3px 4px',
                                    minWidth: col.tip === 'numar' ? 80 : 120,
                                    fontFamily: col.tip === 'numar' ? 'monospace' : 'inherit',
                                    cursor: isAutoCalc ? 'default' : 'text',
                                  }}
                                />
                              </td>
                            )
                          })}
                          <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleDeleteRow(cat.id, rowIdx)}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#D1CFC9', padding: 4,
                              }}
                              title="Șterge rând"
                            >
                              <X size={13} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <button
                  onClick={() => handleAddRow(cat.id)}
                  style={{
                    marginTop: 10, background: 'transparent', border: '1px dashed #D1CFC9',
                    borderRadius: 6, padding: '6px 14px', fontSize: 12, color: '#A8A59E',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  + Adaugă rând
                </button>
              </div>
            )}
          </div>
        )
      })}

      {activeTab === 'note' && (
        <textarea
          value={planData.note}
          onChange={e => handleNoteChange(e.target.value)}
          rows={6}
          placeholder="Note despre plan..."
          style={{
            width: '100%', border: '1px solid #E5E3DE', borderRadius: 8,
            padding: '12px 14px', fontSize: 13, color: '#1E2329',
            resize: 'vertical', outline: 'none', fontFamily: 'inherit',
            background: '#FAFAF8',
          }}
        />
      )}

      {/* Acțiuni */}
      <div style={{
        marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        paddingTop: 20, borderTop: '1px solid #E5E3DE',
      }}>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: saved ? '#16A34A' : '#E8500A', color: 'white',
            border: 'none', borderRadius: 8, padding: '10px 18px',
            fontSize: 13, fontWeight: 700, cursor: saving || saved ? 'default' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saved ? 'Salvat în proiect' : saving ? 'Se salvează...' : 'Salvează în proiect'}
        </button>

        <button
          onClick={handleGenerateReport}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'white', color: '#4A4744',
            border: '1px solid #E5E3DE', borderRadius: 8, padding: '10px 18px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Copy size={15} />
          Copiază raport text
        </button>
      </div>
    </div>
  )
}
