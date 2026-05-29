'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

/* ─── Durate ────────────────────────────────────────────────────────────────── */
const SCENE_DURATION = 6000   // ms per scenă
const TRANSITION_MS  = 400

/* ─── Scenă 1: Scanare plan → cantități ───────────────────────────────────── */
function ScenePlan({ active }: { active: boolean }) {
  const [scanY, setScanY] = useState(0)
  const [rows, setRows]   = useState<number[]>([])
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) { setScanY(0); setRows([]); return }
    startRef.current = null
    setScanY(0)
    setRows([])

    // Scanare linie animată 0→100% în 2s
    const animateScan = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / 2000, 1)
      setScanY(progress * 100)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateScan)
      } else {
        // Apariție rânduri secvențial
        const delays = [0, 300, 600, 900, 1200]
        delays.forEach((d, i) => setTimeout(() => setRows(r => [...r, i]), d))
      }
    }
    rafRef.current = requestAnimationFrame(animateScan)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active])

  const planLines = [
    { label: 'Betonare fundație', dim: '12 × 8 × 0.6 m', unit: 'mc', qty: '57.6' },
    { label: 'Cofraje fundație',  dim: '12 × 8 m perimetru', unit: 'mp', qty: '48.0' },
    { label: 'Armare fundație',   dim: 'OB37, ρ = 80 kg/mc',  unit: 'kg', qty: '4.608' },
    { label: 'Umplutură piatră',  dim: 'H=20cm, S=96mp',      unit: 'mc', qty: '19.2' },
    { label: 'Hidroizolație',     dim: 'MP 2mm, S=96mp',      unit: 'mp', qty: '96.0' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          background: 'rgba(232,80,10,0.15)', border: '1px solid rgba(232,80,10,0.35)',
          borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700,
          color: '#F4835A', fontFamily: sans, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F4835A" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          AI analizează planul
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: sans }}>
          Plan_Fundatie_Vila.pdf
        </div>
      </div>

      {/* Plan SVG cu linie de scanare */}
      <div style={{
        position: 'relative', borderRadius: 8, overflow: 'hidden',
        background: '#1a2035', border: '1px solid rgba(255,255,255,0.08)',
        height: 90, flexShrink: 0,
      }}>
        {/* Grid plan arhitectural */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {/* Grid lines */}
          {[20, 40, 60, 80].map(x => (
            <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
              stroke="rgba(100,140,200,0.15)" strokeWidth="0.5"/>
          ))}
          {[33, 66].map(y => (
            <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
              stroke="rgba(100,140,200,0.15)" strokeWidth="0.5"/>
          ))}
          {/* Fundatie dreptunghi */}
          <rect x="10%" y="15%" width="80%" height="70%" rx="2"
            stroke="rgba(100,180,255,0.5)" strokeWidth="1.5" fill="rgba(100,180,255,0.05)"/>
          <rect x="20%" y="25%" width="60%" height="50%" rx="1"
            stroke="rgba(100,180,255,0.3)" strokeWidth="1" fill="none" strokeDasharray="4,2"/>
          {/* Dimensiuni */}
          <text x="50%" y="92%" textAnchor="middle" fill="rgba(255,255,255,0.3)"
            fontSize="8" fontFamily="monospace">12.00 m</text>
          <text x="4%" y="55%" textAnchor="middle" fill="rgba(255,255,255,0.3)"
            fontSize="7" fontFamily="monospace" transform="rotate(-90, 12, 50)">8.00 m</text>
          {/* Cote */}
          <line x1="10%" y1="8%" x2="90%" y2="8%" stroke="rgba(255,220,100,0.4)" strokeWidth="0.5"/>
          <line x1="10%" y1="5%" x2="10%" y2="11%" stroke="rgba(255,220,100,0.4)" strokeWidth="0.5"/>
          <line x1="90%" y1="5%" x2="90%" y2="11%" stroke="rgba(255,220,100,0.4)" strokeWidth="0.5"/>
        </svg>

        {/* Linie de scanare */}
        {scanY < 100 && (
          <div style={{
            position: 'absolute', left: 0, right: 0,
            top: `${scanY}%`,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #E8500A 30%, #FF8A00 50%, #E8500A 70%, transparent 100%)',
            boxShadow: '0 0 12px rgba(232,80,10,0.8)',
            transition: 'top 16ms linear',
            pointerEvents: 'none',
          }} />
        )}
        {scanY >= 100 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(42,125,79,0.08)',
            border: '1px solid rgba(42,125,79,0.3)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#81C784', fontFamily: sans, fontWeight: 600, gap: 5,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Plan analizat · 5 elemente detectate
          </div>
        )}
      </div>

      {/* Tabel cantități apărând secvențial */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8,
          fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: sans,
          padding: '0 4px', marginBottom: 2 }}>
          <span>Articol</span><span style={{ textAlign: 'right' }}>U.M.</span><span style={{ textAlign: 'right' }}>Cantitate</span>
        </div>
        {planLines.map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8,
            background: 'rgba(255,255,255,0.05)', borderRadius: 5,
            padding: '5px 8px', alignItems: 'center',
            opacity: rows.includes(i) ? 1 : 0,
            transform: rows.includes(i) ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}>
            <div style={{ fontSize: 10, color: '#FFFFFF', fontFamily: sans, fontWeight: 500 }}>
              {row.label}
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>{row.dim}</div>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: sans, textAlign: 'right' }}>
              {row.unit}
            </div>
            <div style={{ fontSize: 11, color: '#E8500A', fontFamily: serif, fontWeight: 600, textAlign: 'right' }}>
              {row.qty}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Scenă 2: Scanare factură → cheltuială ────────────────────────────────── */
function SceneInvoice({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0)
  // phase 0: factura, 1: scanare, 2: rezultat extras, 3: confirmat

  useEffect(() => {
    if (!active) { setPhase(0); return }
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 2000)
    const t3 = setTimeout(() => setPhase(3), 3600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [active])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          background: 'rgba(232,80,10,0.15)', border: '1px solid rgba(232,80,10,0.35)',
          borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700,
          color: '#F4835A', fontFamily: sans, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F4835A" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Scanare factură cu AI
        </div>
      </div>

      {/* Factura + overlay scanare */}
      <div style={{
        position: 'relative', borderRadius: 8, overflow: 'hidden',
        background: phase >= 2 ? 'rgba(42,125,79,0.06)' : '#f8f6f0',
        border: phase >= 2 ? '1px solid rgba(42,125,79,0.35)' : '1px solid rgba(255,255,255,0.1)',
        height: 100, flexShrink: 0, padding: '10px 14px',
        transition: 'background 0.4s, border 0.4s',
      }}>
        {/* Conținut factură simulată */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: phase >= 2 ? 0.3 : 1, transition: 'opacity 0.4s' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#1E2329', fontFamily: sans }}>
            BETON EXPERT SRL · Factură #2847
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, color: '#4A4744', fontFamily: sans }}>Beton C25/30 · 38 mc</span>
            <span style={{ fontSize: 9, color: '#1E2329', fontFamily: sans, fontWeight: 600 }}>18.240 lei</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, color: '#4A4744', fontFamily: sans }}>Transport · 2 curse</span>
            <span style={{ fontSize: 9, color: '#1E2329', fontFamily: sans, fontWeight: 600 }}>1.200 lei</span>
          </div>
          <div style={{ borderTop: '1px dashed #ddd', paddingTop: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, color: '#6B6860', fontFamily: sans }}>TVA 19%</span>
            <span style={{ fontSize: 9, color: '#6B6860', fontFamily: sans }}>3.686 lei</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1E2329', fontFamily: sans }}>TOTAL</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1E2329', fontFamily: sans }}>23.126 lei</span>
          </div>
        </div>

        {/* Overlay scanare */}
        {phase === 1 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(30,35,41,0.6)', backdropFilter: 'blur(1px)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #E8500A',
                borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 10, color: '#FFFFFF', fontFamily: sans }}>AI extrage datele…</span>
            </div>
          </div>
        )}

        {/* Overlay highlight câmpuri extrase */}
        {phase >= 2 && (
          <div style={{ position: 'absolute', inset: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { label: 'Furnizor', value: 'BETON EXPERT SRL', color: '#81C784' },
              { label: 'Valoare fără TVA', value: '19.440 lei', color: '#64B5F6' },
              { label: 'TVA', value: '3.686 lei', color: '#FFD54F' },
              { label: 'Total factură', value: '23.126 lei', color: '#E8500A' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '3px 8px',
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? 'translateX(0)' : 'translateX(-8px)',
                transition: `opacity 0.3s ${i * 0.1}s, transform 0.3s ${i * 0.1}s`,
              }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: sans }}>{f.label}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: f.color, fontFamily: sans }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rezultat înregistrat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Etapă afectată */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: 7, padding: '8px 12px',
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.4s 0.5s',
        }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: sans, marginBottom: 4 }}>
            Asociat automat la etapă
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#FFFFFF', fontFamily: sans, fontWeight: 500 }}>Fundații · Beton</span>
            <span style={{ fontSize: 10, color: '#E8500A', fontFamily: sans }}>− 23.126 lei</span>
          </div>
          <div style={{ marginTop: 6, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, #E8500A, #FF6B35)',
              width: phase >= 3 ? '87%' : '0%',
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>
            <span>Cheltuit: 48.320 lei</span>
            <span>Buget: 55.600 lei</span>
          </div>
        </div>

        {/* Notificare succes */}
        <div style={{
          background: 'rgba(42,125,79,0.15)', border: '1px solid rgba(42,125,79,0.35)',
          borderRadius: 7, padding: '7px 12px',
          opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s, transform 0.35s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#81C784', fontFamily: sans }}>Cheltuială înregistrată</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: sans }}>Etapa Fundații: 87% din buget consumat</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Scenă 3: AI găsește rețete lipsă ─────────────────────────────────────── */
function SceneAI({ active }: { active: boolean }) {
  const [found, setFound] = useState<number[]>([])
  const [added, setAdded] = useState(false)
  const [typing, setTyping] = useState('')
  const fullText = 'tencuiala exterioara 200mp cu grund si finisaj'

  useEffect(() => {
    if (!active) { setFound([]); setAdded(false); setTyping(''); return }

    // Typing effect
    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTyping(fullText.slice(0, i))
      if (i >= fullText.length) clearInterval(typeInterval)
    }, 45)

    // AI găsește articole
    const t1 = setTimeout(() => setFound([0]), 2400)
    const t2 = setTimeout(() => setFound([0, 1]), 3000)
    const t3 = setTimeout(() => setFound([0, 1, 2]), 3600)
    const t4 = setTimeout(() => setAdded(true), 4800)

    return () => { clearInterval(typeInterval); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [active])

  const recipes = [
    { code: 'CF01A', name: 'Aplicare grund amorsa exterior',  qty: '200', um: 'mp', match: '98%' },
    { code: 'TF06B', name: 'Tencuiala decorativă exterioară', qty: '200', um: 'mp', match: '96%' },
    { code: 'TF03A', name: 'Strat suport tencuiala (amorsaj)', qty: '200', um: 'mp', match: '91%' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          background: 'rgba(232,80,10,0.15)', border: '1px solid rgba(232,80,10,0.35)',
          borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700,
          color: '#F4835A', fontFamily: sans, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          ✦ AI Consultant deviz
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: sans }}>
          1.100+ norme românești
        </div>
      </div>

      {/* Input căutare */}
      <div style={{
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(232,80,10,0.4)',
        borderRadius: 7, padding: '8px 12px', position: 'relative',
      }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: sans, marginBottom: 3 }}>
          Descrie lucrarea în cuvinte simple
        </div>
        <div style={{ fontSize: 11, color: '#FFFFFF', fontFamily: sans, minHeight: 16 }}>
          {typing}
          <span style={{
            display: 'inline-block', width: 1.5, height: 12, background: '#E8500A',
            marginLeft: 1, verticalAlign: 'text-bottom',
            animation: typing.length < fullText.length ? 'none' : 'blink 1s infinite',
          }} />
        </div>
      </div>

      {/* Rețete găsite */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {found.length > 0 && (
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: sans, marginBottom: 2 }}>
            Norme găsite în catalog
          </div>
        )}
        {recipes.map((r, i) => (
          <div key={i} style={{
            background: added ? 'rgba(42,125,79,0.12)' : 'rgba(255,255,255,0.06)',
            border: added ? '1px solid rgba(42,125,79,0.3)' : '1px solid transparent',
            borderRadius: 7, padding: '7px 10px',
            opacity: found.includes(i) ? 1 : 0,
            transform: found.includes(i) ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity 0.35s ease, transform 0.35s ease, background 0.4s, border 0.4s`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 4, flexShrink: 0,
              background: added ? 'rgba(42,125,79,0.3)' : 'rgba(232,80,10,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.4s',
            }}>
              {added
                ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                : <span style={{ fontSize: 8, color: '#E8500A', fontWeight: 700 }}>+</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#FFFFFF', fontFamily: sans, fontWeight: 500 }}>
                {r.name}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>
                {r.code} · {r.qty} {r.um}
              </div>
            </div>
            <div style={{
              fontSize: 9, fontWeight: 700, fontFamily: sans,
              color: added ? '#81C784' : '#E8500A',
              transition: 'color 0.4s',
            }}>
              {added ? 'Adăugat' : r.match}
            </div>
          </div>
        ))}

        {/* Buton adăugare / confirmat */}
        {found.length === 3 && (
          <div style={{
            marginTop: 4,
            background: added ? 'rgba(42,125,79,0.2)' : '#E8500A',
            borderRadius: 7, padding: '8px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: 1, transition: 'background 0.4s',
          }}>
            {added ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#81C784', fontFamily: sans }}>
                  3 norme adăugate în deviz
                </span>
              </>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', fontFamily: sans }}>
                Adaugă 3 norme în deviz →
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Container principal ───────────────────────────────────────────────────── */
const SCENES = [
  {
    id: 'plan',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    label: 'Plan → Cantități',
    sublabel: 'AI citește planul și calculează automat',
  },
  {
    id: 'invoice',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    label: 'Factură → Cheltuială',
    sublabel: 'O poză la factură, înregistrată automat',
  },
  {
    id: 'ai',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    label: 'Descriere → Norme deviz',
    sublabel: 'AI găsește și adaugă articolele lipsă',
  },
]

export default function HeroInteractiveDemo() {
  const [activeScene, setActiveScene] = useState(0)
  const [progress, setProgress]   = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToScene = (idx: number) => {
    if (idx === activeScene) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveScene(idx)
      setProgress(0)
      setTransitioning(false)
    }, TRANSITION_MS)
  }

  useEffect(() => {
    // Progress bar
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return p
        return p + (100 / (SCENE_DURATION / 50))
      })
    }, 50)

    // Auto-advance
    intervalRef.current = setInterval(() => {
      setProgress(0)
      setTransitioning(true)
      setTimeout(() => {
        setActiveScene(s => (s + 1) % SCENES.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, SCENE_DURATION)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [activeScene])

  const handleTabClick = (idx: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    goToScene(idx)

    // Restart auto-advance
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (SCENE_DURATION / 50)), 100))
    }, 50)
    intervalRef.current = setInterval(() => {
      setProgress(0)
      setTransitioning(true)
      setTimeout(() => {
        setActiveScene(s => (s + 1) % SCENES.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, SCENE_DURATION)
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>

      <div style={{
        background: '#1E2329',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
        fontFamily: sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
            Demo interactiv
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 10, color: 'rgba(255,255,255,0.3)',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            live · fără cont
          </div>
        </div>

        {/* Tabs scenă */}
        <div style={{ display: 'flex', gap: 6 }}>
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleTabClick(i)}
              style={{
                flex: 1, border: 'none', cursor: 'pointer', borderRadius: 8,
                padding: '7px 6px', textAlign: 'left',
                background: activeScene === i ? 'rgba(232,80,10,0.15)' : 'rgba(255,255,255,0.04)',
                outline: activeScene === i ? '1px solid rgba(232,80,10,0.4)' : '1px solid transparent',
                transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Progress bar subtirat în tab activ */}
              {activeScene === i && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0,
                  height: 2, background: '#E8500A',
                  width: `${progress}%`, transition: 'width 50ms linear',
                  borderRadius: '0 0 2px 2px',
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2,
                color: activeScene === i ? '#E8500A' : 'rgba(255,255,255,0.4)' }}>
                {s.icon}
                <span style={{ fontSize: 10, fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1.3, paddingLeft: 19 }}>
                {s.sublabel}
              </div>
            </button>
          ))}
        </div>

        {/* Scenă activă */}
        <div style={{
          background: '#161B22',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: '14px 16px',
          minHeight: 260,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(4px) scale(0.99)' : 'translateY(0) scale(1)',
          transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
        }}>
          {activeScene === 0 && <ScenePlan active={!transitioning} />}
          {activeScene === 1 && <SceneInvoice active={!transitioning} />}
          {activeScene === 2 && <SceneAI active={!transitioning} />}
        </div>

        {/* CTA */}
        <Link href="/demo" style={{
          display: 'block', width: '100%', background: '#E8500A', color: '#FFFFFF',
          border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: sans, letterSpacing: '-.01em',
          textAlign: 'center', textDecoration: 'none', transition: 'background 0.2s',
          boxShadow: '0 4px 16px rgba(232,80,10,0.35)',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#C43F06')}
          onMouseLeave={e => (e.currentTarget.style.background = '#E8500A')}
        >
          Încearcă demo — fără cont →
        </Link>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0, fontFamily: sans }}>
          Fără cont · Fără card · Cont gratuit când vrei să salvezi
        </p>
      </div>
    </>
  )
}
