'use client'

import Link from 'next/link'
import { useState } from 'react'
import { fmtRon } from '@/utils/format'

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

const PROJECT = {
  name: 'Casă unifamilială D+P',
  location: 'Gruia, Cluj-Napoca',
  client: 'Familia Ionescu',
  coef: { regie: 15, profit: 10, tva: 21 },
}

type Line  = { cod: string; desc: string; um: string; qty: number; pret: number }
type Stage = { name: string; lines: Line[]; spent: number }

const STAGES: Stage[] = [
  {
    name: 'Fundații și infrastructură', spent: 61_240,
    lines: [
      { cod: 'TsA01A1', desc: 'Săpătură mecanică în pământ, h < 2 m',           um: 'mc',      qty: 32.50, pret:    85 },
      { cod: 'CZ01A1',  desc: 'Beton armat C20/25 — fundații continue',          um: 'mc',      qty: 18.40, pret:   680 },
      { cod: 'CB03A1',  desc: 'Cofrare și decofrare fundații — tablă metalică',  um: 'mp',      qty: 112.0, pret:    85 },
      { cod: 'CA01A1',  desc: 'Armare OB37, Ø 8–14 mm',                         um: 'kg',      qty: 2460,  pret:  10.2 },
    ],
  },
  {
    name: 'Structură beton armat', spent: 0,
    lines: [
      { cod: 'CC02A1', desc: 'Beton C25/30 — stâlpi și pereți structurali',     um: 'mc',  qty: 14.20, pret:  820 },
      { cod: 'CC04A1', desc: 'Planșeu beton armat monolit, h = 15 cm',          um: 'mp',  qty: 128.0, pret:  295 },
      { cod: 'CB01A1', desc: 'Cofrare planșeu — sistem panel recuperabil',       um: 'mp',  qty: 128.0, pret:   65 },
      { cod: 'CA02A1', desc: 'Armare planșee PC52, Ø 10–16 mm',                 um: 'kg',  qty: 3840,  pret: 10.2 },
    ],
  },
  {
    name: 'Zidărie și compartimentări', spent: 0,
    lines: [
      { cod: 'ZC01A1', desc: 'Zidărie BCA 30 cm — Ytong D50',                  um: 'mp',  qty: 248.0, pret: 195 },
      { cod: 'ZC02A1', desc: 'Zidărie despărțitoare BCA 10 cm',                 um: 'mp',  qty:  96.0, pret: 115 },
      { cod: 'ZC03A1', desc: 'Buiandrugi prefabricați tip U din beton armat',   um: 'buc', qty:    24, pret: 185 },
    ],
  },
  {
    name: 'Instalații tehnice', spent: 7_000,
    lines: [
      { cod: 'II01A1', desc: 'Instalații electrice — trase în corp de clădire', um: 'proiect', qty: 1, pret: 28_500 },
      { cod: 'IS01A1', desc: 'Instalații sanitare — rece, cald, canalizare',    um: 'proiect', qty: 1, pret: 18_400 },
      { cod: 'IT01A1', desc: 'Instalații termice — CT gaz + radiatoare',        um: 'proiect', qty: 1, pret: 22_800 },
    ],
  },
  {
    name: 'Finisaje interioare', spent: 0,
    lines: [
      { cod: 'CF01A1', desc: 'Tencuială interioară manuală, grosime 1,5 cm',    um: 'mp', qty: 524.0, pret:  68 },
      { cod: 'CF02A1', desc: 'Glet ipsos și grunduire pentru vopsitorie',        um: 'mp', qty: 524.0, pret:  32 },
      { cod: 'CF04A1', desc: 'Parchet laminat 8 mm AC5, montat flotant',         um: 'mp', qty:  82.0, pret: 145 },
      { cod: 'CF05A1', desc: 'Gresie și faianță baie + bucătărie',               um: 'mp', qty:  48.0, pret: 210 },
    ],
  },
  {
    name: 'Anvelopă și acoperiș', spent: 0,
    lines: [
      { cod: 'CE01A1', desc: 'Termosistem EPS 10 cm — fațadă și soclu',         um: 'mp', qty: 298.0, pret:   195 },
      { cod: 'CE02A1', desc: 'Șarpantă lemn masiv — căpriori, pane, cosoroabe', um: 'mc', qty:  14.6, pret: 1_240 },
      { cod: 'CE03A1', desc: 'Învelitoare tablă falțuită, zincat vopsit',        um: 'mp', qty: 148.0, pret:   128 },
    ],
  },
]

const PURCHASES = [
  { date: '14 mai', desc: 'Beton C20/25 — Lafarge Holcim',  etapa: 'Fundații',   suma: 18_400, over: true  },
  { date: '12 mai', desc: 'Armătură OB37 — Arcelor Mittal', etapa: 'Fundații',   suma: 24_840, over: false },
  { date: '10 mai', desc: 'Cofraje metalice — închiriere',   etapa: 'Fundații',   suma:  7_800, over: false },
  { date: '09 mai', desc: 'Beton C12/15 egalizare — local', etapa: 'Fundații',   suma:  3_200, over: false },
  { date: '07 mai', desc: 'Avans instalații electrice',      etapa: 'Instalații', suma:  7_000, over: false },
]

function lineTotal(l: Line)  { return l.qty * l.pret }
function stageTotal(s: Stage){ return s.lines.reduce((a, l) => a + lineTotal(l), 0) }

const costDirect = STAGES.reduce((a, s) => a + stageTotal(s), 0)
const regie      = costDirect * (PROJECT.coef.regie / 100)
const profit     = (costDirect + regie) * (PROJECT.coef.profit / 100)
const bazaImpo   = costDirect + regie + profit
const tva        = bazaImpo * (PROJECT.coef.tva / 100)
const totalCuTva = bazaImpo + tva
const totalSpent = STAGES.reduce((a, s) => a + s.spent, 0)
const overstage  = STAGES.find(s => s.spent > stageTotal(s))
const overAmt    = overstage ? overstage.spent - stageTotal(overstage) : 0

function Chip({ children, color = '#6B6860' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
      background: `${color}18`, color, border: `1px solid ${color}30`,
      padding: '2px 8px', borderRadius: 100, flexShrink: 0,
    }}>{children}</span>
  )
}

export default function DemoPage() {
  const [activeTab, setActiveTab]     = useState<'deviz' | 'cheltuieli'>('deviz')
  const [expanded, setExpanded]       = useState<Record<number, boolean>>({ 0: true })
  const progressPct = Math.round((totalSpent / costDirect) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#F3F2EF', fontFamily: sans, overflowX: 'hidden' }}>

      <style>{`
        /* ── Responsive helpers ─────────────────────────────── */
        .kpi-grid   { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
        .tbl-deviz  { display:grid; grid-template-columns:80px 1fr 44px 84px 84px 100px; }
        .tbl-ch     { display:grid; grid-template-columns:60px 1fr 80px 90px 64px; }
        .proj-pad   { padding:24px 32px 20px; }
        .main-pad   { padding:20px 20px 72px; }
        .cta-block  { display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }

        @media (max-width:640px) {
          .kpi-grid  { grid-template-columns:1fr 1fr !important; }
          .proj-pad  { padding:16px 16px 14px !important; }
          .main-pad  { padding:14px 12px 60px !important; }

          /* Deviz table — mobile: cod+descriere | total */
          .tbl-deviz { grid-template-columns:1fr 90px !important; }
          .col-um, .col-qty, .col-pret { display:none !important; }
          .col-cod   { font-size:10px !important; }

          /* Cheltuieli table — mobile: descriere | suma | status */
          .tbl-ch    { grid-template-columns:1fr 84px 56px !important; }
          .col-data, .col-etapa { display:none !important; }

          /* Stage header — wrap total below name on very small screens */
          .stage-hdr { flex-wrap:wrap; gap:6px !important; }
          .stage-total { min-width:0 !important; font-size:14px !important; }

          /* CTA */
          .cta-block { flex-direction:column !important; align-items:flex-start !important; }
          .cta-btns  { width:100% !important; }
          .cta-btns a { width:100% !important; justify-content:center !important; }

          /* Tabs */
          .tabs-wrap { width:100% !important; }
          .tab-btn   { flex:1 !important; }

          /* Banner */
          .banner-inner { flex-direction:column !important; align-items:flex-start !important; gap:8px !important; }
        }
      `}</style>

      {/* ── Banner ── */}
      <div style={{ background: '#1E2329', padding: '10px 16px' }}>
        <div className="banner-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
            Proiect demo · Datele sunt fictive și nu se salvează
          </span>
          <Link href="/auth/register" style={{
            background: '#E8500A', color: '#FFFFFF',
            padding: '7px 16px', borderRadius: 6,
            fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Creează cont gratuit →
          </Link>
        </div>
      </div>

      {/* ── Header proiect ── */}
      <div style={{ background: '#374151' }}>
        <div className="proj-pad" style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Chip color="#F4835A">Demo</Chip>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{PROJECT.location}</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 24, color: '#FFFFFF', marginBottom: 6, letterSpacing: '-.02em' }}>
            {PROJECT.name}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Regie {PROJECT.coef.regie}% · Profit {PROJECT.coef.profit}% · TVA {PROJECT.coef.tva}%
          </p>
        </div>
      </div>

      <div className="main-pad" style={{ maxWidth: 1040, margin: '0 auto' }}>

        {/* ── KPI row ── */}
        <div className="kpi-grid" style={{ marginBottom: 16 }}>
          {[
            { label: 'Total deviz (fără TVA)', val: `${fmtRon(costDirect)} lei`, sub: `${fmtRon(totalCuTva)} lei cu TVA`, dark: true },
            { label: 'Cheltuit până acum',     val: `${fmtRon(totalSpent)} lei`, sub: `${progressPct}% din deviz` },
            { label: 'Profit estimat',         val: `${fmtRon(profit)} lei`,     sub: `${PROJECT.coef.profit}% din bază` },
            { label: 'Etape finalizate',       val: '0 / 6',                     sub: 'Fundații în execuție' },
          ].map(k => (
            <div key={k.label} style={{
              background: k.dark ? '#374151' : '#FFFFFF',
              border: k.dark ? 'none' : '1px solid #E5E3DE',
              borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5, color: k.dark ? 'rgba(255,255,255,0.45)' : '#A8A59E' }}>{k.label}</div>
              <div style={{ fontFamily: serif, fontSize: 20, lineHeight: 1, marginBottom: 3, color: k.dark ? '#FFFFFF' : '#1E2329' }}>{k.val}</div>
              <div style={{ fontSize: 11, color: k.dark ? 'rgba(255,255,255,0.5)' : '#6B6860' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Alertă depășire ── */}
        {overstage && (
          <div style={{
            background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.2 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#C0392B', marginBottom: 3 }}>
                Etapa &ldquo;{overstage.name}&rdquo; a depășit bugetul
              </div>
              <div style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.5 }}>
                Devizat <strong>{fmtRon(stageTotal(overstage))} lei</strong> · Cheltuit <strong>{fmtRon(overstage.spent)} lei</strong>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#C0392B', marginTop: 2 }}>
                +{fmtRon(overAmt)} lei depășire ({Math.round((overAmt / stageTotal(overstage)) * 100)}%) · Impact profit: −{fmtRon(overAmt)} lei
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="tabs-wrap" style={{
          display: 'flex', gap: 0, marginBottom: 16,
          background: '#FFFFFF', borderRadius: 10, border: '1px solid #E5E3DE',
          padding: 4, width: 'fit-content',
        }}>
          {([['deviz', 'Deviz'], ['cheltuieli', 'Cheltuieli']] as const).map(([key, label]) => (
            <button key={key} className="tab-btn" onClick={() => setActiveTab(key)} style={{
              padding: '9px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: activeTab === key ? 600 : 400,
              background: activeTab === key ? '#374151' : 'transparent',
              color: activeTab === key ? '#FFFFFF' : '#6B6860',
              fontFamily: sans, transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

        {/* ── Tab Deviz ── */}
        {activeTab === 'deviz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {STAGES.map((stage, si) => {
              const stTotal   = stageTotal(stage)
              const isOver    = stage.spent > stTotal && stage.spent > 0
              const isPartial = stage.spent > 0 && stage.spent <= stTotal
              const isOpen    = !!expanded[si]

              return (
                <div key={si} style={{
                  background: '#FFFFFF',
                  border: `1px solid ${isOver ? 'rgba(192,57,43,0.4)' : '#E5E3DE'}`,
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  <button onClick={() => setExpanded(p => ({ ...p, [si]: !p[si] }))} style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '13px 16px', fontFamily: sans, textAlign: 'left',
                  }}>
                    <div className="stage-hdr" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#A8A59E', flexShrink: 0 }}>{isOpen ? '▼' : '▶'}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1E2329', flex: 1, textAlign: 'left' }}>{stage.name}</span>
                      {isOver    && <Chip color="#C0392B">Depășit</Chip>}
                      {isPartial && <Chip color="#E8500A">În execuție</Chip>}
                      {!stage.spent && <Chip color="#6B6860">Planificat</Chip>}
                      <span className="stage-total" style={{ fontFamily: serif, fontSize: 15, fontWeight: 700, color: isOver ? '#C0392B' : '#1E2329', minWidth: 90, textAlign: 'right' }}>
                        {fmtRon(stTotal)} lei
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <>
                      {/* Tabel header */}
                      <div className="tbl-deviz" style={{
                        padding: '7px 16px', background: '#F3F2EF', borderTop: '1px solid #E5E3DE',
                        fontSize: 10, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em',
                      }}>
                        <div className="col-cod">Cod</div>
                        <div>Descriere</div>
                        <div className="col-um" style={{ textAlign: 'center' }}>UM</div>
                        <div className="col-qty" style={{ textAlign: 'right' }}>Cant.</div>
                        <div className="col-pret" style={{ textAlign: 'right' }}>Preț/u</div>
                        <div style={{ textAlign: 'right' }}>Total</div>
                      </div>

                      {stage.lines.map((line, li) => (
                        <div key={li} className="tbl-deviz" style={{
                          padding: '10px 16px', borderTop: '1px solid #F3F2EF', alignItems: 'center',
                        }}>
                          <div className="col-cod" style={{ fontSize: 11, fontWeight: 600, color: '#E8500A', fontFamily: 'monospace' }}>{line.cod}</div>
                          <div style={{ fontSize: 13, color: '#2E2D2A', lineHeight: 1.35 }}>{line.desc}</div>
                          <div className="col-um" style={{ textAlign: 'center', fontSize: 12, color: '#6B6860' }}>{line.um}</div>
                          <div className="col-qty" style={{ textAlign: 'right', fontSize: 12, color: '#6B6860' }}>{fmtRon(line.qty)}</div>
                          <div className="col-pret" style={{ textAlign: 'right', fontSize: 12, color: '#6B6860' }}>{fmtRon(line.pret)}</div>
                          <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#1E2329' }}>{fmtRon(lineTotal(line))} lei</div>
                        </div>
                      ))}

                      <div className="tbl-deviz" style={{
                        padding: '10px 16px', background: '#F3F2EF', borderTop: '1px solid #E5E3DE', alignItems: 'center',
                      }}>
                        <div className="col-cod" />
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1E2329' }}>TOTAL etapă</div>
                        <div className="col-um" /><div className="col-qty" /><div className="col-pret" />
                        <div style={{ textAlign: 'right', fontFamily: serif, fontSize: 15, fontWeight: 700, color: '#1E2329' }}>{fmtRon(stTotal)} lei</div>
                      </div>
                    </>
                  )}
                </div>
              )
            })}

            {/* Recapitulatie */}
            <div style={{ background: '#374151', borderRadius: 12, padding: 20, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Recapitulație</div>
              {[
                { label: 'Cost direct',                                          val: costDirect, gray: false },
                { label: `Cheltuieli indirecte (regie ${PROJECT.coef.regie}%)`, val: regie,      gray: true  },
                { label: `Profit (${PROJECT.coef.profit}%)`,                    val: profit,     gray: true  },
                { label: 'Bază impozabilă',                                      val: bazaImpo,   gray: false },
                { label: `TVA ${PROJECT.coef.tva}%`,                            val: tva,        gray: true  },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  fontSize: 13, gap: 8,
                  color: row.gray ? 'rgba(255,255,255,0.5)' : '#FFFFFF',
                }}>
                  <span style={{ flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontWeight: row.gray ? 400 : 600, textAlign: 'right' }}>{fmtRon(row.val)} lei</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '14px 0 0', fontSize: 17, color: '#FFFFFF', fontFamily: serif, gap: 8,
              }}>
                <span style={{ fontWeight: 700 }}>TOTAL CU TVA</span>
                <span style={{ color: '#E8500A', fontWeight: 700 }}>{fmtRon(totalCuTva)} lei</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab Cheltuieli ── */}
        {activeTab === 'cheltuieli' && (
          <div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>

              <div className="tbl-ch" style={{
                padding: '8px 16px', background: '#F3F2EF', borderBottom: '1px solid #E5E3DE',
                fontSize: 10, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em',
              }}>
                <div className="col-data">Data</div>
                <div>Descriere</div>
                <div className="col-etapa">Etapă</div>
                <div style={{ textAlign: 'right' }}>Sumă</div>
                <div style={{ textAlign: 'center' }}>Status</div>
              </div>

              {PURCHASES.map((p, i) => (
                <div key={i} className="tbl-ch" style={{
                  padding: '11px 16px',
                  borderBottom: i < PURCHASES.length - 1 ? '1px solid #F3F2EF' : 'none',
                  alignItems: 'center',
                }}>
                  <div className="col-data" style={{ fontSize: 12, color: '#A8A59E' }}>{p.date}</div>
                  <div style={{ fontSize: 13, color: '#2E2D2A', fontWeight: 500, lineHeight: 1.35 }}>{p.desc}</div>
                  <div className="col-etapa" style={{ fontSize: 12, color: '#6B6860' }}>{p.etapa}</div>
                  <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#1E2329' }}>{fmtRon(p.suma)} lei</div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: p.over ? '#C0392B' : '#2A7D4F',
                      background: p.over ? 'rgba(192,57,43,0.1)' : 'rgba(42,125,79,0.1)',
                      padding: '2px 7px', borderRadius: 100,
                    }}>{p.over ? 'Depășit' : 'OK'}</span>
                  </div>
                </div>
              ))}

              <div className="tbl-ch" style={{ padding: '10px 16px', background: '#F3F2EF', borderTop: '1px solid #E5E3DE', alignItems: 'center' }}>
                <div className="col-data" />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E2329' }}>TOTAL cheltuit</div>
                <div className="col-etapa" />
                <div style={{ textAlign: 'right', fontFamily: serif, fontSize: 15, fontWeight: 700, color: '#1E2329' }}>{fmtRon(totalSpent)} lei</div>
                <div />
              </div>
            </div>

            {/* Progress bars */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, padding: '16px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Buget per etapă</div>
              {STAGES.map((s, i) => {
                const plan = stageTotal(s)
                const pct  = plan > 0 ? Math.min(100, Math.round((s.spent / plan) * 100)) : 0
                const over = s.spent > plan
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13, gap: 8 }}>
                      <span style={{ color: '#1E2329', fontWeight: 500 }}>{s.name}</span>
                      <span style={{ color: over ? '#C0392B' : '#6B6860', flexShrink: 0, fontSize: 12 }}>
                        {fmtRon(s.spent)} / {fmtRon(plan)} lei
                      </span>
                    </div>
                    <div style={{ height: 5, background: '#F3F2EF', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#C0392B' : '#E8500A', borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CTA final ── */}
        <div className="cta-block" style={{ background: '#374151', borderRadius: 14, padding: 24, marginTop: 20 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: serif, fontSize: 22, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-.02em' }}>
              Lucrezi pe un proiect real?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.55 }}>
              Deviz cu 1.100+ norme românești, cheltuieli reale, alerte buget — din orice telefon.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
              Fără card · Fără abonament automat · Primul proiect 0 lei
            </p>
          </div>
          <div className="cta-btns" style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <Link href="/auth/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#E8500A', color: '#FFFFFF',
              padding: '13px 24px', borderRadius: 8,
              fontSize: 15, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Creează cont gratuit →
            </Link>
            <Link href="/" style={{
              textAlign: 'center', fontSize: 13,
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            }}>
              ← Înapoi la pagina principală
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
