'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { fmtRon } from '@/utils/format'

const REGIM_MULT   = [1.0, 1.07, 1.13]
const FIN_BASE     = [2800, 4200, 6500]
const REGIM_LABELS = ['Parter', 'P+1', 'P+2'] as const
const FIN_LABELS   = ['Economic', 'Standard', 'Premium'] as const

const STAGES = [
  { name: 'Fundații și infrastructură',               pct: 0.18, unit: 'mc',      qty_factor: 0.15 },
  { name: 'Structură (stâlpi, grinzi, planșee)',      pct: 0.22, unit: 'mc',      qty_factor: 0.12 },
  { name: 'Zidărie și compartimentări',               pct: 0.12, unit: 'mp',      qty_factor: 1.40 },
  { name: 'Instalații (electrice, sanitare, termice)',pct: 0.18, unit: 'proiect', qty_factor: 1    },
  { name: 'Finisaje interioare',                      pct: 0.20, unit: 'mp',      qty_factor: 0.85 },
  { name: 'Finisaje exterioare și termoizolație',     pct: 0.10, unit: 'mp',      qty_factor: 0.45 },
]

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

function DemoContent() {
  const params = useSearchParams()
  const [mp,    setMp]    = useState(() => clamp(parseInt(params.get('mp')    ?? '150'), 60, 500))
  const [regim, setRegim] = useState(() => clamp(parseInt(params.get('regim') ?? '0'),   0, 2))
  const [fin,   setFin]   = useState(() => clamp(parseInt(params.get('fin')   ?? '1'),   0, 2))

  const perMp = Math.round(FIN_BASE[fin] * REGIM_MULT[regim])
  const total = mp * perMp

  function btnStyle(active: boolean): React.CSSProperties {
    return {
      padding: '8px 4px', border: `1px solid ${active ? '#E8500A' : '#E5E3DE'}`,
      borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
      color: active ? '#FFFFFF' : '#1E2329',
      background: active ? '#E8500A' : '#FFFFFF',
      cursor: 'pointer', textAlign: 'center', transition: 'all .15s', fontFamily: sans,
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: sans }}>

      <style>{`
        .demo-grid { display:grid; grid-template-columns:280px 1fr; gap:32px; align-items:start; }
        .demo-sticky { position:sticky; top:80px; }
        @media (max-width:768px) {
          .demo-grid { grid-template-columns:1fr !important; }
          .demo-sticky { position:static !important; }
          .demo-table-row { grid-template-columns:1fr 50px 80px !important; }
          .demo-table-qty { display:none !important; }
        }
      `}</style>

      {/* Banner info */}
      <div style={{
        background: '#1E2329', color: '#FFFFFF',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, flexWrap: 'wrap', textAlign: 'center',
        fontSize: 14,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>
          Demo · Estimare orientativă · Datele nu se salvează
        </span>
        <Link href="/auth/register" style={{
          background: '#E8500A', color: '#FFFFFF',
          padding: '6px 16px', borderRadius: 6,
          fontSize: 13, fontWeight: 700, textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          Creează cont gratuit →
        </Link>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase', color: '#E8500A', marginBottom: 10,
          }}>
            Deviz estimativ · Fără cont
          </p>
          <h1 style={{
            fontFamily: serif, fontSize: 36, lineHeight: 1.1,
            color: '#1E2329', marginBottom: 12, letterSpacing: '-.02em',
          }}>
            Devizul tău pentru o casă {REGIM_LABELS[regim]}, {mp} mp
          </h1>
          <p style={{ fontSize: 15, color: '#6B6860', maxWidth: 560, lineHeight: 1.6 }}>
            Ajustează parametrii din stânga și vezi costurile estimate pe etape.
            Devizul real — cu norme din catalogul de 1.100+ articole, prețuri personalizate
            și urmărire cheltuieli — este disponibil după crearea contului gratuit.
          </p>
        </div>

        <div className="demo-grid">

          {/* Params form */}
          <div className="demo-sticky">
            <div style={{
              background: '#FFFFFF', border: '1px solid #E5E3DE',
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1E2329', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Parametrii proiectului
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4A4744', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Suprafață desfășurată
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range" min={60} max={500} step={5} value={mp}
                    onChange={e => setMp(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#E8500A', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E2329', minWidth: 56, textAlign: 'right' }}>
                    {mp} mp
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4A4744', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Regim înălțime
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {REGIM_LABELS.map((label, i) => (
                    <button key={i} onClick={() => setRegim(i)} style={btnStyle(regim === i)}>{label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4A4744', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Nivel finisaje
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {FIN_LABELS.map((label, i) => (
                    <button key={i} onClick={() => setFin(i)} style={btnStyle(fin === i)}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Total summary */}
              <div style={{ marginTop: 24, background: '#374151', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
                  Total estimat
                </div>
                <div style={{ fontFamily: serif, fontSize: 28, color: '#FFFFFF', lineHeight: 1, marginBottom: 4 }}>
                  {fmtRon(total)} lei
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  ~{fmtRon(Math.round(perMp / 5))} EUR/mp · fără TVA
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>

            {/* Estimate table */}
            <div style={{
              background: '#FFFFFF', border: '1px solid #E5E3DE',
              borderRadius: 16, overflow: 'hidden', marginBottom: 16,
            }}>
              {/* Header */}
              <div className="demo-table-row" style={{
                display: 'grid', gridTemplateColumns: '1fr 60px 90px 110px',
                padding: '12px 20px', background: '#F3F2EF',
                borderBottom: '1px solid #E5E3DE',
                fontSize: 11, fontWeight: 700, color: '#6B6860',
                textTransform: 'uppercase', letterSpacing: '.06em',
              }}>
                <div>Etapă lucrare</div>
                <div style={{ textAlign: 'center' }}>UM</div>
                <div className="demo-table-qty" style={{ textAlign: 'right' }}>Cantitate</div>
                <div style={{ textAlign: 'right' }}>Cost estimat</div>
              </div>

              {STAGES.map((stage, i) => {
                const cost = Math.round(total * stage.pct)
                const qty  = stage.unit === 'proiect'
                  ? 1
                  : Math.round(mp * REGIM_MULT[regim] * stage.qty_factor)
                return (
                  <div key={i} className="demo-table-row" style={{
                    display: 'grid', gridTemplateColumns: '1fr 60px 90px 110px',
                    padding: '14px 20px',
                    borderBottom: i < STAGES.length - 1 ? '1px solid #F3F2EF' : 'none',
                    alignItems: 'center',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1E2329' }}>
                      {stage.name}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 13, color: '#6B6860' }}>
                      {stage.unit}
                    </div>
                    <div className="demo-table-qty" style={{ textAlign: 'right', fontSize: 13, color: '#6B6860' }}>
                      {stage.unit === 'proiect' ? '—' : fmtRon(qty)}
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#1E2329' }}>
                      {fmtRon(cost)} lei
                    </div>
                  </div>
                )
              })}

              {/* Total row */}
              <div className="demo-table-row" style={{
                display: 'grid', gridTemplateColumns: '1fr 60px 90px 110px',
                padding: '16px 20px', background: '#F3F2EF',
                borderTop: '2px solid #E5E3DE', alignItems: 'center',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1E2329' }}>TOTAL (fără TVA)</div>
                <div /><div />
                <div style={{ textAlign: 'right', fontFamily: serif, fontSize: 20, color: '#E8500A', fontWeight: 700 }}>
                  {fmtRon(total)} lei
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: '#A8A59E', marginBottom: 32, lineHeight: 1.6 }}>
              Estimare orientativă ±25%. Nu include TVA (21%), branșamente, autorizații sau lucrări speciale.
              Cantitățile sunt calculate din suprafața introdusă — devizul real include norme detaliate
              din catalogul de 1.100+ articole.
            </p>

            {/* What you get with account */}
            <div style={{
              background: '#374151', borderRadius: 16, padding: 32,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                Cu contul gratuit
              </p>
              <h2 style={{
                fontFamily: serif, fontSize: 26, color: '#FFFFFF',
                marginBottom: 20, lineHeight: 1.2,
              }}>
                Salvează devizul și lucrează cu el.
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                {[
                  'Editezi fiecare linie cu norme reale din catalog',
                  'Înregistrezi cheltuielile reale de pe șantier',
                  'Primești alertă dacă depășești bugetul pe etapă',
                  'Generezi PDF profesional pentru beneficiar',
                  'Ții jurnal de șantier cu lucrări și echipă',
                  'Accesezi proiectul de pe orice telefon',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: 'rgba(42,125,79,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="#2A7D4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/auth/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#E8500A', color: '#FFFFFF',
                  padding: '13px 28px', borderRadius: 8,
                  fontSize: 15, fontWeight: 700, textDecoration: 'none',
                }}>
                  Creează cont gratuit — 30 secunde →
                </Link>
                <Link href="/" style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'transparent', color: 'rgba(255,255,255,0.6)',
                  padding: '13px 20px', borderRadius: 8,
                  fontSize: 14, textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  ← Înapoi la pagina principală
                </Link>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 14 }}>
                Fără card · Fără abonament automat · Anulezi oricând
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '120px 24px', textAlign: 'center', fontFamily: sans, color: '#6B6860' }}>
        Se încarcă...
      </div>
    }>
      <DemoContent />
    </Suspense>
  )
}
