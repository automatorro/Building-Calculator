'use client'

import { useMemo, useState } from 'react'
import { ListTree, ChevronDown, ChevronUp, Download, FileText, CheckCircle2, Sheet } from 'lucide-react'
import {
  EstimateLine,
  ProjectSettings,
  calculateLineCosts,
  calculateProjectTotals,
} from '@/utils/calculators/estimate'

interface ProjectDevizViewProps {
  lines: EstimateLine[]
  settings: ProjectSettings
  projectName: string
  projectLocation?: string
  onExportPDF: () => void
  onExportCSV: () => void
  onExportExcel?: () => void
}

/* Formatare număr în lei */
const lei = (n: number) =>
  n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* Coeficienți pierderi tehnologice per tip lucrare */
const PIERDERI: Record<string, number> = {
  faianță: 0.08, faianta: 0.08,
  gresie: 0.08,
  tencuială: 0.05, tencuiala: 0.05,
  vopsitorie: 0.10, vopsire: 0.10,
  beton: 0.03,
  cofraj: 0.05,
  zidărie: 0.04, zidarie: 0.04, bca: 0.04,
  acoperiș: 0.06, acoperis: 0.06, învelitoare: 0.06, invelitoare: 0.06,
  tâmplărie: 0.02, tamplarie: 0.02,
  pardoseală: 0.08, pardoseala: 0.08, parchet: 0.08,
}

function getPierderi(name: string): number {
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(PIERDERI)) {
    if (lower.includes(key)) return val
  }
  return 0.05 // default 5%
}

export default function ProjectDevizView({
  lines,
  settings,
  projectName,
  projectLocation,
  onExportPDF,
  onExportCSV,
  onExportExcel,
}: ProjectDevizViewProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const [discountB2B, setDiscountB2B] = useState(0)
  const [includePierderi, setIncludePierderi] = useState(false)

  /* Grupăm liniile după etapă */
  const grouped = useMemo(() => {
    const map: Record<string, EstimateLine[]> = {}
    for (const line of lines) {
      const stage = line.stage_name || 'Alte Lucrări'
      if (!map[stage]) map[stage] = []
      map[stage].push(line)
    }
    return map
  }, [lines])

  const stages = Object.keys(grouped)

  /* Totaluri per etapă */
  const stageTotals = useMemo(() => {
    const result: Record<string, {
      direct: number
      ofertat: number
      withTVA: number
    }> = {}
    for (const stage of stages) {
      const t = calculateProjectTotals(grouped[stage], settings)
      result[stage] = { direct: t.totalDirect, ofertat: t.totalOfertat, withTVA: t.totalWithTVA }
    }
    return result
  }, [grouped, stages, settings])

  /* Total general */
  const totals = useMemo(() => calculateProjectTotals(lines, settings), [lines, settings])

  const totalDirect   = totals.totalDirect
  const regieAmount   = totalDirect * (settings.regie / 100)
  const costCuRegie   = totalDirect + regieAmount
  const profitAmount  = costCuRegie * (settings.profit / 100)
  const fAraTVA       = totals.totalOfertat
  const tvaAmount     = totals.totalWithTVA - fAraTVA

  /* Ajustări discount B2B + pierderi */
  const discountFactor  = 1 - discountB2B / 100
  const totalCuDiscount = fAraTVA * discountFactor
  const economieLei     = fAraTVA - totalCuDiscount

  if (lines.length === 0) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', padding:'64px 32px', textAlign:'center',
        background:'#FAFAF8', borderRadius:14, border:'1px solid #E5E3DE' }}>
        <ListTree size={40} style={{ color:'#A8A59E', marginBottom:16 }} />
        <h3 style={{ fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
          fontSize:22, fontWeight:400, color:'#1E2329', marginBottom:8 }}>
          Devizul este gol
        </h3>
        <p style={{ fontSize:14, color:'#6B6860', maxWidth:300, lineHeight:1.6 }}>
          Adaugă articole din tab-ul <strong>Planificare</strong> pentru a genera devizul detaliat.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize:26, fontWeight:400, color:'#1E2329',
            lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:4 }}>
            Deviz Detaliat
          </h2>
          <p style={{ fontSize:14, color:'#6B6860' }}>
            {projectName}{projectLocation ? ` · ${projectLocation}` : ''} · {lines.length} articole
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onExportCSV}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px',
              background:'#FAFAF8', border:'1px solid #E5E3DE', borderRadius:8,
              fontSize:13, fontWeight:500, color:'#1E2329', cursor:'pointer',
              fontFamily:'inherit', transition:'all .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#A8A59E'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#E5E3DE'}}>
            <Download size={14} /> Export CSV
          </button>
          {onExportExcel && (
            <button onClick={onExportExcel}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px',
                background:'#E8F5EE', border:'1px solid #2A7D4F33', borderRadius:8,
                fontSize:13, fontWeight:500, color:'#2A7D4F', cursor:'pointer',
                fontFamily:'inherit', transition:'all .15s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#D4EDDA'}}
              onMouseLeave={e=>{e.currentTarget.style.background='#E8F5EE'}}>
              <Sheet size={14} /> Export Excel
            </button>
          )}
          <button onClick={onExportPDF}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px',
              background:'#E8500A', border:'none', borderRadius:8,
              fontSize:13, fontWeight:500, color:'white', cursor:'pointer',
              fontFamily:'inherit', transition:'background .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#C43F06'}}
            onMouseLeave={e=>{e.currentTarget.style.background='#E8500A'}}>
            <FileText size={14} /> Generează PDF
          </button>
        </div>
      </div>

      {/* ── Controale discount B2B + pierderi ── */}
      <div style={{ background:'#F3F2EF', borderRadius:12, padding:'16px 20px',
        border:'1px solid #E5E3DE', display:'flex', flexWrap:'wrap', gap:24, alignItems:'center' }}>
        {/* Slider discount */}
        <div style={{ flex:'1 1 260px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <label style={{ fontSize:13, fontWeight:500, color:'#1E2329' }}>
              Discount B2B la materiale
            </label>
            <span style={{ fontSize:14, fontWeight:700, color:'#E8500A' }}>{discountB2B}%</span>
          </div>
          <input type="range" min={0} max={40} value={discountB2B}
            onChange={e => setDiscountB2B(Number(e.target.value))}
            style={{ width:'100%', accentColor:'#E8500A', cursor:'pointer' }} />
          <p style={{ fontSize:11, color:'#A8A59E', marginTop:4 }}>
            Prețul tău negociat cu furnizorul (0 = preț de listă)
          </p>
        </div>
        {/* Toggle pierderi */}
        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer',
          flex:'1 1 200px' }}>
          <div onClick={() => setIncludePierderi(!includePierderi)}
            style={{ width:40, height:22, borderRadius:11, background: includePierderi ? '#E8500A' : '#E5E3DE',
              position:'relative', transition:'background .2s', cursor:'pointer', flexShrink:0 }}>
            <div style={{ position:'absolute', top:3, left: includePierderi ? 21 : 3,
              width:16, height:16, borderRadius:'50%', background:'white',
              transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:'#1E2329' }}>
              Pierderi tehnologice automate
            </div>
            <div style={{ fontSize:11, color:'#A8A59E' }}>
              +5–10% pe cantități (faianta +8%, vopsit +10% etc.)
            </div>
          </div>
        </label>
        {/* Preview economie */}
        {discountB2B > 0 && (
          <div style={{ background:'#E8F5EE', border:'1px solid #2A7D4F33',
            borderRadius:8, padding:'10px 16px', flexShrink:0 }}>
            <div style={{ fontSize:11, color:'#2A7D4F', textTransform:'uppercase',
              letterSpacing:'.04em', fontWeight:600, marginBottom:2 }}>
              Economie estimată
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:'#2A7D4F' }}>
              -{lei(economieLei)} lei
            </div>
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24, alignItems:'start' }}>

        {/* ── Etape ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {stages.map((stage) => {
            const stageLines = grouped[stage]
            const tot = stageTotals[stage]
            const isOpen = expandedStage === stage
            const pct = totals.totalWithTVA > 0
              ? ((tot.withTVA / totals.totalWithTVA) * 100).toFixed(0)
              : '0'

            return (
              <div key={stage} style={{ background:'#FAFAF8', border:'1px solid #E5E3DE',
                borderRadius:12, overflow:'hidden' }}>

                {/* Header etapă */}
                <button onClick={() => setExpandedStage(isOpen ? null : stage)}
                  style={{ width:'100%', display:'flex', alignItems:'center',
                    justifyContent:'space-between', padding:'16px 20px',
                    background: isOpen ? '#FFF0E8' : '#FAFAF8',
                    border:'none', cursor:'pointer', textAlign:'left',
                    borderBottom: isOpen ? '1px solid #E5E3DE' : 'none',
                    transition:'background .15s', fontFamily:'inherit' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ padding:'6px 8px', background: isOpen ? '#E8500A' : '#F3F2EF',
                      borderRadius:7, transition:'background .15s' }}>
                      <CheckCircle2 size={16} style={{ color: isOpen ? 'white' : '#A8A59E' }} />
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <div style={{ fontSize:15, fontWeight:500, color:'#1E2329', marginBottom:2 }}>
                        {stage}
                      </div>
                      <div style={{ fontSize:12, color:'#6B6860' }}>
                        {pct}% din deviz · {stageLines.length} articole
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:16, fontWeight:600, color:'#1E2329' }}>
                        {lei(tot.withTVA)} lei
                      </div>
                      <div style={{ fontSize:11, color:'#A8A59E' }}>cu TVA</div>
                    </div>
                    {isOpen
                      ? <ChevronUp size={18} style={{ color:'#A8A59E', flexShrink:0 }} />
                      : <ChevronDown size={18} style={{ color:'#A8A59E', flexShrink:0 }} />
                    }
                  </div>
                </button>

                {/* Conținut expandat */}
                {isOpen && (
                  <div style={{ padding:'16px 20px' }}>
                    {/* Mini recapitulație etapă */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                      <div style={{ background:'#F3F2EF', borderRadius:8, padding:'10px 14px' }}>
                        <div style={{ fontSize:11, color:'#A8A59E', marginBottom:3, textTransform:'uppercase',
                          letterSpacing:'.04em', fontWeight:500 }}>Cost direct</div>
                        <div style={{ fontSize:15, fontWeight:600, color:'#1E2329' }}>
                          {lei(tot.direct)} lei
                        </div>
                      </div>
                      <div style={{ background:'#F3F2EF', borderRadius:8, padding:'10px 14px' }}>
                        <div style={{ fontSize:11, color:'#A8A59E', marginBottom:3, textTransform:'uppercase',
                          letterSpacing:'.04em', fontWeight:500 }}>Fără TVA</div>
                        <div style={{ fontSize:15, fontWeight:600, color:'#E8500A' }}>
                          {lei(tot.ofertat)} lei
                        </div>
                      </div>
                    </div>

                    {/* Tabel articole */}
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                        <thead>
                          <tr style={{ background:'#F3F2EF' }}>
                            {['Cod', 'Descriere', 'UM', 'Cant.', 'Preț unitar', 'Total direct', 'Total ofertat'].map(h => (
                              <th key={h} style={{ padding:'8px 12px', textAlign: h === 'Descriere' ? 'left' : 'right',
                                fontSize:11, fontWeight:600, color:'#6B6860',
                                textTransform:'uppercase', letterSpacing:'.04em',
                                ...(h === 'Cod' || h === 'Descriere' ? { textAlign:'left' as const } : {}) }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stageLines.map((line, i) => {
                            const costs = calculateLineCosts(line, settings)
                            const isCatalogNorm = !!(line.catalog_norm_id || line.metadata?.catalog_norm_id)
                            const isManual = !line.items && !isCatalogNorm
                            const name = line.name || line.manual_name || line.items?.name || '—'
                            const code = line.code || line.metadata?.catalog_norm_symbol ||
                              (line.items
                                ? `${line.items.normatives?.code || ''} ${line.items.code || ''}`.trim()
                                : 'MANUAL')
                            const um   = line.unit || line.manual_um || line.items?.um || '—'

                            return (
                              <tr key={line.id} style={{ borderBottom:'1px solid #F3F2EF',
                                background: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                                <td style={{ padding:'8px 12px', fontFamily:'monospace',
                                  fontSize:11, color:'#A8A59E', whiteSpace:'nowrap' }}>
                                  {code.trim() || '—'}
                                </td>
                                <td style={{ padding:'8px 12px', color:'#1E2329', maxWidth:240 }}>
                                  {name}
                                </td>
                                <td style={{ padding:'8px 12px', textAlign:'right', color:'#6B6860' }}>
                                  {um}
                                </td>
                                <td style={{ padding:'8px 12px', textAlign:'right', color:'#1E2329', fontWeight:500 }}>
                                  {includePierderi ? (
                                    <span title={`+${(getPierderi(name) * 100).toFixed(0)}% pierderi`}>
                                      {(line.quantity * (1 + getPierderi(name))).toLocaleString('ro-RO', { maximumFractionDigits: 2 })}
                                      <span style={{ fontSize:10, color:'#E8500A', marginLeft:3 }}>
                                        +{(getPierderi(name) * 100).toFixed(0)}%
                                      </span>
                                    </span>
                                  ) : line.quantity.toLocaleString('ro-RO')}
                                </td>
                                <td style={{ padding:'8px 12px', textAlign:'right', color:'#6B6860' }}>
                                  {lei(costs.unitDirectCost)}
                                </td>
                                <td style={{ padding:'8px 12px', textAlign:'right', color:'#1E2329' }}>
                                  {lei(costs.totalDirectCost)}
                                </td>
                                <td style={{ padding:'8px 12px', textAlign:'right',
                                  fontWeight:600, color:'#E8500A' }}>
                                  {lei(costs.totalOfertatWithoutTVA)}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background:'#FFF0E8', borderTop:'2px solid #E8500A' }}>
                            <td colSpan={5} style={{ padding:'10px 12px', fontSize:13,
                              fontWeight:600, color:'#C43F06', textAlign:'right',
                              textTransform:'uppercase', letterSpacing:'.03em' }}>
                              Total etapă {stage}
                            </td>
                            <td style={{ padding:'10px 12px', textAlign:'right',
                              fontWeight:600, color:'#1E2329' }}>
                              {lei(tot.direct)}
                            </td>
                            <td style={{ padding:'10px 12px', textAlign:'right',
                              fontWeight:700, color:'#E8500A' }}>
                              {lei(tot.ofertat)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Recapitulație ── */}
        <div style={{ position:'sticky', top:24 }}>
          <div style={{ background:'#1E2329', borderRadius:14, padding:24, color:'white' }}>
            <h3 style={{ fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
              fontSize:18, fontWeight:400, color:'#FAFAF8', marginBottom:20,
              letterSpacing:'-0.01em' }}>
              Recapitulație
            </h3>

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <RecapRow label="Cost direct total" value={lei(totalDirect)} unit="lei" />
              <RecapRow
                label={`Cheltuieli indirecte (${settings.regie}%)`}
                value={lei(regieAmount)} unit="lei"
                sub />
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', margin:'4px 0' }} />
              <RecapRow label="Cost cu indirecte" value={lei(costCuRegie)} unit="lei" />
              <RecapRow
                label={`Profit (${settings.profit}%)`}
                value={lei(profitAmount)} unit="lei"
                sub />
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', margin:'4px 0' }} />
              <RecapRow label="Valoare fără TVA" value={lei(fAraTVA)} unit="lei" accent />
              {discountB2B > 0 && (
                <RecapRow
                  label={`Discount B2B tău (${discountB2B}%)`}
                  value={`-${lei(economieLei)}`} unit="lei"
                  sub />
              )}
              <RecapRow
                label={`TVA (${settings.tva}%)`}
                value={lei(tvaAmount)} unit="lei"
                sub />
            </div>

            <div style={{ borderTop:'1px solid rgba(255,255,255,0.12)', marginTop:16, paddingTop:16 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase',
                letterSpacing:'.06em', fontWeight:500, marginBottom:6 }}>
                Total deviz (cu TVA)
              </div>
              <div style={{ fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
                fontSize:34, color:'#FAFAF8', lineHeight:1 }}>
                {lei(totals.totalWithTVA)}
                <span style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontFamily:'inherit',
                  fontWeight:400 }}> lei</span>
              </div>
            </div>
          </div>

          {/* Info coeficienți */}
          <div style={{ marginTop:12, background:'#F3F2EF', borderRadius:10,
            padding:'12px 16px', border:'1px solid #E5E3DE' }}>
            <p style={{ fontSize:11, color:'#6B6860', lineHeight:1.5,
              textTransform:'uppercase', letterSpacing:'.04em', fontWeight:500, marginBottom:8 }}>
              Coeficienți aplicați
            </p>
            {[
              [`Profit`, `${settings.profit}%`],
              [`Cheltuieli indirecte`, `${settings.regie}%`],
              [`TVA`, `${settings.tva}%`],
            ].map(([k, v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between',
                fontSize:12, color:'#6B6860', marginBottom:4 }}>
                <span>{k}</span>
                <span style={{ fontWeight:600, color:'#1E2329' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RecapRow({
  label, value, unit, sub = false, accent = false,
}: {
  label: string; value: string; unit: string; sub?: boolean; accent?: boolean
}) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <span style={{ fontSize: sub ? 12 : 13,
        color: sub ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
        paddingLeft: sub ? 12 : 0 }}>
        {label}
      </span>
      <span style={{ fontSize: accent ? 16 : (sub ? 12 : 14),
        fontWeight: accent ? 700 : (sub ? 400 : 500),
        color: accent ? '#E8500A' : (sub ? 'rgba(255,255,255,0.4)' : '#FAFAF8') }}>
        {value} <span style={{ fontSize:10, fontWeight:400 }}>{unit}</span>
      </span>
    </div>
  )
}
