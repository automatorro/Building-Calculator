'use client'

import Link from 'next/link'
import { useState } from 'react'
import { fmtRon } from '@/utils/format'

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

/* ── Date demo fixe — proiect realist ─────────────────────────────────────── */
const PROJECT = {
  name: 'Casă unifamilială D+P',
  location: 'Gruia, Cluj-Napoca',
  client: 'Familia Ionescu',
  coef: { regie: 15, profit: 10, tva: 21 },
}

type Line = {
  cod: string
  desc: string
  um: string
  qty: number
  pret: number
}

type Stage = {
  name: string
  lines: Line[]
  spent: number
}

const STAGES: Stage[] = [
  {
    name: 'Fundații și infrastructură',
    spent: 61_240,
    lines: [
      { cod: 'TsA01A1', desc: 'Săpătură mecanică în pământ, h < 2 m',             um: 'mc',      qty: 32.50, pret:   85.00 },
      { cod: 'CZ01A1',  desc: 'Beton armat C20/25 — fundații continue',            um: 'mc',      qty: 18.40, pret:  680.00 },
      { cod: 'CB03A1',  desc: 'Cofrare și decofrare fundații — tablă metalică',    um: 'mp',      qty: 112.0, pret:   85.00 },
      { cod: 'CA01A1',  desc: 'Armare OB37, Ø 8–14 mm',                           um: 'kg',      qty: 2460,  pret:   10.20 },
    ],
  },
  {
    name: 'Structură beton armat',
    spent: 0,
    lines: [
      { cod: 'CC02A1',  desc: 'Beton C25/30 — stâlpi și pereți structurali',      um: 'mc',      qty: 14.20, pret:  820.00 },
      { cod: 'CC04A1',  desc: 'Planșeu beton armat monolit, h = 15 cm',           um: 'mp',      qty: 128.0, pret:  295.00 },
      { cod: 'CB01A1',  desc: 'Cofrare planșeu — sistem panel recuperabil',        um: 'mp',      qty: 128.0, pret:   65.00 },
      { cod: 'CA02A1',  desc: 'Armare planșee PC52, Ø 10–16 mm',                  um: 'kg',      qty: 3840,  pret:   10.20 },
    ],
  },
  {
    name: 'Zidărie și compartimentări',
    spent: 0,
    lines: [
      { cod: 'ZC01A1',  desc: 'Zidărie BCA 30 cm — Ytong D50',                   um: 'mp',      qty: 248.0, pret:  195.00 },
      { cod: 'ZC02A1',  desc: 'Zidărie despărțitoare BCA 10 cm',                  um: 'mp',      qty:  96.0, pret:  115.00 },
      { cod: 'ZC03A1',  desc: 'Buiandrugi prefabricați tip U din beton armat',    um: 'buc',     qty:  24,   pret:  185.00 },
    ],
  },
  {
    name: 'Instalații tehnice',
    spent: 7_000,
    lines: [
      { cod: 'II01A1',  desc: 'Instalații electrice — trase în corp de clădire',  um: 'proiect', qty:    1,  pret: 28_500.00 },
      { cod: 'IS01A1',  desc: 'Instalații sanitare — rece, cald, canalizare',     um: 'proiect', qty:    1,  pret: 18_400.00 },
      { cod: 'IT01A1',  desc: 'Instalații termice — CT gaz + radiatoare',         um: 'proiect', qty:    1,  pret: 22_800.00 },
    ],
  },
  {
    name: 'Finisaje interioare',
    spent: 0,
    lines: [
      { cod: 'CF01A1',  desc: 'Tencuială interioară manuală, grosime 1,5 cm',     um: 'mp',      qty: 524.0, pret:   68.00 },
      { cod: 'CF02A1',  desc: 'Glet ipsos și grunduire pentru vopsitorie',         um: 'mp',      qty: 524.0, pret:   32.00 },
      { cod: 'CF04A1',  desc: 'Parchet laminat 8 mm AC5, montat flotant',          um: 'mp',      qty:  82.0, pret:  145.00 },
      { cod: 'CF05A1',  desc: 'Gresie și faianță baie + bucătărie, pus pe adeziv', um: 'mp',     qty:  48.0, pret:  210.00 },
    ],
  },
  {
    name: 'Anvelopă și acoperiș',
    spent: 0,
    lines: [
      { cod: 'CE01A1',  desc: 'Termosistem EPS 10 cm — fațadă și soclu',          um: 'mp',      qty: 298.0, pret:  195.00 },
      { cod: 'CE02A1',  desc: 'Șarpantă lemn masiv — căpriori, pane, cosoroabe',  um: 'mc',      qty:  14.6, pret: 1_240.00 },
      { cod: 'CE03A1',  desc: 'Învelitoare tablă falțuită, zincat vopsit',         um: 'mp',      qty: 148.0, pret:  128.00 },
    ],
  },
]

const PURCHASES = [
  { date: '14 mai 2026', desc: 'Beton C20/25 — Lafarge Holcim',   etapa: 'Fundații', suma: 18_400, over: true  },
  { date: '12 mai 2026', desc: 'Armătură OB37 — Arcelor Mittal',  etapa: 'Fundații', suma: 24_840, over: false },
  { date: '10 mai 2026', desc: 'Cofraje metalice — închiriere',    etapa: 'Fundații', suma: 7_800,  over: false },
  { date: '09 mai 2026', desc: 'Beton C12/15 egalizare — local',  etapa: 'Fundații', suma: 3_200,  over: false },
  { date: '07 mai 2026', desc: 'Avans instalații electrice',       etapa: 'Instalații', suma: 7_000, over: false },
]

/* ── Calcule deviz ─────────────────────────────────────────────────────────── */
function lineTotal(l: Line) { return l.qty * l.pret }
function stageTotal(s: Stage) { return s.lines.reduce((a, l) => a + lineTotal(l), 0) }

const costDirect  = STAGES.reduce((a, s) => a + stageTotal(s), 0)
const regie       = costDirect * (PROJECT.coef.regie / 100)
const profit      = (costDirect + regie) * (PROJECT.coef.profit / 100)
const bazaImpo    = costDirect + regie + profit
const tva         = bazaImpo * (PROJECT.coef.tva / 100)
const totalCuTva  = bazaImpo + tva

const totalSpent  = STAGES.reduce((a, s) => a + s.spent, 0)
const overstage   = STAGES.find(s => s.spent > stageTotal(s))
const overAmt     = overstage ? overstage.spent - stageTotal(overstage) : 0

/* ── Helpers UI ───────────────────────────────────────────────────────────── */
function Chip({ children, color = '#6B6860' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
      background: `${color}18`, color, border: `1px solid ${color}30`,
      padding: '2px 8px', borderRadius: 100,
    }}>{children}</span>
  )
}

function KpiCard({
  label, value, sub, accent = false, warn = false,
}: { label: string; value: string; sub?: string; accent?: boolean; warn?: boolean }) {
  const bg   = accent ? '#374151' : '#FFFFFF'
  const col  = accent ? '#FFFFFF' : '#1E2329'
  const sub2 = warn ? '#E57373' : accent ? 'rgba(255,255,255,0.55)' : '#6B6860'
  return (
    <div style={{ background: bg, border: accent ? 'none' : '1px solid #E5E3DE', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: accent ? 'rgba(255,255,255,0.5)' : '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: serif, fontSize: 22, color: col, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: sub2 }}>{sub}</div>}
    </div>
  )
}

/* ── Component principal ──────────────────────────────────────────────────── */
export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'deviz' | 'cheltuieli'>('deviz')
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false, 3: false, 4: false, 5: false })

  function toggleStage(i: number) {
    setExpandedStages(prev => ({ ...prev, [i]: !prev[i] }))
  }

  const progressPct = Math.round((totalSpent / costDirect) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#F3F2EF', fontFamily: sans }}>

      {/* ── Banner ── */}
      <div style={{
        background: '#1E2329', padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          Proiect demo · Datele sunt fictive și nu se salvează
        </span>
        <Link href="/auth/register" style={{
          background: '#E8500A', color: '#FFFFFF',
          padding: '7px 18px', borderRadius: 6,
          fontSize: 13, fontWeight: 700, textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          Creează cont gratuit — 30 secunde →
        </Link>
      </div>

      {/* ── Header proiect ── */}
      <div style={{ background: '#374151', padding: '28px 32px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Chip color="#F4835A">Demo</Chip>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{PROJECT.location}</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 28, color: '#FFFFFF', marginBottom: 6, letterSpacing: '-.02em' }}>
            {PROJECT.name}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Beneficiar: {PROJECT.client} · Regie {PROJECT.coef.regie}% · Profit {PROJECT.coef.profit}% · TVA {PROJECT.coef.tva}%
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* ── KPI row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          <KpiCard label="Total deviz (fără TVA)" value={`${fmtRon(costDirect)} lei`} sub={`${fmtRon(totalCuTva)} lei cu TVA`} accent />
          <KpiCard label="Cheltuit până acum"     value={`${fmtRon(totalSpent)} lei`} sub={`${progressPct}% din deviz`} />
          <KpiCard label="Profit estimat"         value={`${fmtRon(profit)} lei`}     sub={`${PROJECT.coef.profit}% din baza impozabilă`} />
          <KpiCard label="Etape finalizate"       value="0 / 6" sub="Fundații în execuție" />
        </div>

        {/* ── Alertă depășire buget ── */}
        {overstage && (
          <div style={{
            background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 20,
            display: 'flex', alignItems: 'flex-start', gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(192,57,43,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>⚠</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#C0392B', marginBottom: 3 }}>
                Etapa &ldquo;{overstage.name}&rdquo; a depășit bugetul
              </div>
              <div style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.5 }}>
                Devizat: <strong>{fmtRon(stageTotal(overstage))} lei</strong> · Cheltuit: <strong>{fmtRon(overstage.spent)} lei</strong> ·
                Depășire: <strong style={{ color: '#C0392B' }}>+{fmtRon(overAmt)} lei ({Math.round((overAmt / stageTotal(overstage)) * 100)}%)</strong>
              </div>
              <div style={{ fontSize: 12, color: '#A8A59E', marginTop: 4 }}>
                Impact pe profit estimat: <strong style={{ color: '#C0392B' }}>−{fmtRon(overAmt)} lei</strong>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: '#FFFFFF', borderRadius: 10, border: '1px solid #E5E3DE', padding: 4, width: 'fit-content' }}>
          {([['deviz', 'Deviz'], ['cheltuieli', 'Cheltuieli reale']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: activeTab === key ? 600 : 400,
                background: activeTab === key ? '#374151' : 'transparent',
                color: activeTab === key ? '#FFFFFF' : '#6B6860',
                fontFamily: sans, transition: 'all .15s',
              }}
            >{label}</button>
          ))}
        </div>

        {/* ── Tab: Deviz ── */}
        {activeTab === 'deviz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {STAGES.map((stage, si) => {
              const stTotal   = stageTotal(stage)
              const isOver    = stage.spent > stTotal && stage.spent > 0
              const isPartial = stage.spent > 0 && stage.spent <= stTotal
              const expanded  = expandedStages[si]

              return (
                <div key={si} style={{ background: '#FFFFFF', border: `1px solid ${isOver ? 'rgba(192,57,43,0.35)' : '#E5E3DE'}`, borderRadius: 12, overflow: 'hidden' }}>
                  {/* Stage header */}
                  <button
                    onClick={() => toggleStage(si)}
                    style={{
                      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
                      fontFamily: sans, textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 16, color: '#A8A59E', flexShrink: 0 }}>{expanded ? '▼' : '▶'}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#1E2329', flex: 1 }}>{stage.name}</span>
                    {isOver    && <Chip color="#C0392B">Depășit</Chip>}
                    {isPartial && <Chip color="#E8500A">În execuție</Chip>}
                    {!stage.spent && <Chip color="#6B6860">Planificat</Chip>}
                    <span style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: isOver ? '#C0392B' : '#1E2329', minWidth: 100, textAlign: 'right' }}>
                      {fmtRon(stTotal)} lei
                    </span>
                  </button>

                  {/* Lines */}
                  {expanded && (
                    <>
                      <div style={{
                        display: 'grid', gridTemplateColumns: '90px 1fr 50px 90px 90px 110px',
                        padding: '8px 20px', background: '#F3F2EF', borderTop: '1px solid #E5E3DE',
                        fontSize: 10, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em',
                      }}>
                        <div>Cod normă</div>
                        <div>Descriere lucrare</div>
                        <div style={{ textAlign: 'center' }}>UM</div>
                        <div style={{ textAlign: 'right' }}>Cantitate</div>
                        <div style={{ textAlign: 'right' }}>Preț unitar</div>
                        <div style={{ textAlign: 'right' }}>Total</div>
                      </div>
                      {stage.lines.map((line, li) => (
                        <div key={li} style={{
                          display: 'grid', gridTemplateColumns: '90px 1fr 50px 90px 90px 110px',
                          padding: '10px 20px', borderTop: '1px solid #F3F2EF', alignItems: 'center',
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#E8500A', fontFamily: 'monospace' }}>{line.cod}</div>
                          <div style={{ fontSize: 13, color: '#2E2D2A', lineHeight: 1.4 }}>{line.desc}</div>
                          <div style={{ textAlign: 'center', fontSize: 12, color: '#6B6860' }}>{line.um}</div>
                          <div style={{ textAlign: 'right', fontSize: 13, color: '#6B6860' }}>{fmtRon(line.qty)}</div>
                          <div style={{ textAlign: 'right', fontSize: 13, color: '#6B6860' }}>{fmtRon(line.pret)} lei</div>
                          <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#1E2329' }}>{fmtRon(lineTotal(line))} lei</div>
                        </div>
                      ))}
                      <div style={{
                        display: 'grid', gridTemplateColumns: '90px 1fr 50px 90px 90px 110px',
                        padding: '10px 20px', background: '#F3F2EF', borderTop: '1px solid #E5E3DE',
                        alignItems: 'center',
                      }}>
                        <div />
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1E2329' }}>TOTAL etapă</div>
                        <div /><div /><div />
                        <div style={{ textAlign: 'right', fontFamily: serif, fontSize: 16, color: '#1E2329', fontWeight: 700 }}>{fmtRon(stTotal)} lei</div>
                      </div>
                    </>
                  )}
                </div>
              )
            })}

            {/* Recapitulatie */}
            <div style={{ background: '#374151', borderRadius: 12, padding: 24, marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Recapitulație</div>
              {[
                { label: 'Cost direct',                          val: costDirect,                  gray: false },
                { label: `Cheltuieli indirecte (regie ${PROJECT.coef.regie}%)`, val: regie,        gray: true },
                { label: `Profit (${PROJECT.coef.profit}%)`,    val: profit,                      gray: true },
                { label: 'Bază impozabilă',                     val: bazaImpo,                     gray: false },
                { label: `TVA ${PROJECT.coef.tva}%`,            val: tva,                         gray: true },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 14, color: row.gray ? 'rgba(255,255,255,0.55)' : '#FFFFFF' }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: row.gray ? 400 : 600 }}>{fmtRon(row.val)} lei</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontSize: 18, color: '#FFFFFF', fontFamily: serif }}>
                <span style={{ fontWeight: 700 }}>TOTAL CU TVA</span>
                <span style={{ color: '#E8500A', fontWeight: 700 }}>{fmtRon(totalCuTva)} lei</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Cheltuieli ── */}
        {activeTab === 'cheltuieli' && (
          <div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 120px 110px 80px',
                padding: '10px 20px', background: '#F3F2EF', borderBottom: '1px solid #E5E3DE',
                fontSize: 10, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em',
              }}>
                <div>Data</div><div>Descriere</div><div>Etapă</div><div style={{ textAlign: 'right' }}>Sumă</div><div style={{ textAlign: 'center' }}>Status</div>
              </div>
              {PURCHASES.map((p, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 120px 110px 80px',
                  padding: '12px 20px', borderBottom: i < PURCHASES.length - 1 ? '1px solid #F3F2EF' : 'none',
                  alignItems: 'center',
                }}>
                  <div style={{ fontSize: 12, color: '#A8A59E' }}>{p.date}</div>
                  <div style={{ fontSize: 13, color: '#2E2D2A', fontWeight: 500 }}>{p.desc}</div>
                  <div style={{ fontSize: 12, color: '#6B6860' }}>{p.etapa}</div>
                  <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#1E2329' }}>{fmtRon(p.suma)} lei</div>
                  <div style={{ textAlign: 'center' }}>
                    {p.over
                      ? <span style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', background: 'rgba(192,57,43,0.1)', padding: '2px 8px', borderRadius: 100 }}>Depășit</span>
                      : <span style={{ fontSize: 11, fontWeight: 700, color: '#2A7D4F', background: 'rgba(42,125,79,0.1)', padding: '2px 8px', borderRadius: 100 }}>OK</span>
                    }
                  </div>
                </div>
              ))}
              <div style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 120px 110px 80px',
                padding: '12px 20px', background: '#F3F2EF', borderTop: '1px solid #E5E3DE',
              }}>
                <div /><div style={{ fontSize: 13, fontWeight: 700, color: '#1E2329' }}>TOTAL cheltuit</div><div /><div style={{ textAlign: 'right', fontFamily: serif, fontSize: 16, fontWeight: 700, color: '#1E2329' }}>{fmtRon(totalSpent)} lei</div><div />
              </div>
            </div>

            {/* Progress per etapa */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>Buget per etapă</div>
              {STAGES.map((s, i) => {
                const plan = stageTotal(s)
                const pct  = plan > 0 ? Math.min(100, Math.round((s.spent / plan) * 100)) : 0
                const over = s.spent > plan
                return (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span style={{ color: '#1E2329', fontWeight: 500 }}>{s.name}</span>
                      <span style={{ color: over ? '#C0392B' : '#6B6860' }}>
                        {fmtRon(s.spent)} / {fmtRon(plan)} lei
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#F3F2EF', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#C0392B' : '#E8500A', borderRadius: 3, transition: 'width .3s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CTA final ── */}
        <div style={{
          background: '#374151', borderRadius: 16, padding: 32,
          marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: 24, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-.02em' }}>
              Lucrezi pe un proiect real?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 480, lineHeight: 1.55 }}>
              Creezi devizul tău cu catalogul complet de 1.100+ norme românești, înregistrezi
              cheltuielile reale și urmărești profitul în timp real — din orice telefon, fără instalare.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
              Fără card · Fără abonament automat · Cont gratuit, primul proiect complet 0 lei
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <Link href="/auth/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#E8500A', color: '#FFFFFF',
              padding: '13px 28px', borderRadius: 8,
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Creează cont gratuit →
            </Link>
            <Link href="/" style={{
              textAlign: 'center', fontSize: 13,
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
            }}>
              ← Înapoi la pagina principală
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
