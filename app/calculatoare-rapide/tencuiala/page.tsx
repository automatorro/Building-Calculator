'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type PlasterType = 'ipsos' | 'var-ciment'
type ConsBasis = 'per_m2' | 'per_m2_cm'

type Row = {
  name: string
  qtyUnit: string
  consMin: number
  consMax: number
  consUnit?: string
  consBasis?: ConsBasis
  optional: boolean
  note?: string
  plasterType?: PlasterType | 'all'
}

type Section = {
  title: string
  rows: Row[]
}

const sections: Section[] = [
  {
    title: 'Pregătire suport',
    rows: [
      {
        name: 'Amorsă / grund de profunzime (un strat)',
        qtyUnit: 'l',
        consMin: 1 / 6,
        consMax: 1 / 6,
        consUnit: 'l/m²',
        consBasis: 'per_m2',
        optional: false,
      },
      {
        name: 'Profil colț cu plasă (pentru muchii)',
        qtyUnit: 'ml',
        consMin: 0,
        consMax: 0,
        optional: true,
        note: 'introdu ml colț',
      },
    ],
  },
  {
    title: 'Tencuială (strat de bază)',
    rows: [
      {
        name: 'Tencuială pe bază de ipsos',
        qtyUnit: 'kg',
        consMin: 10,
        consMax: 10,
        consUnit: 'kg/m²/cm',
        consBasis: 'per_m2_cm',
        optional: false,
        plasterType: 'ipsos',
      },
      {
        name: 'Tencuială var-ciment',
        qtyUnit: 'kg',
        consMin: 14,
        consMax: 14,
        consUnit: 'kg/m²/cm',
        consBasis: 'per_m2_cm',
        optional: false,
        plasterType: 'var-ciment',
      },
    ],
  },
  {
    title: 'Armare / reparații (opțional)',
    rows: [
      {
        name: 'Plasă fibră de sticlă 160 g/mp (doar pe zone)',
        qtyUnit: 'm²',
        consMin: 0,
        consMax: 0,
        optional: true,
        note: 'introdu m² zonă',
      },
    ],
  },
]

const defaultPrices: Record<string, number> = {
  'Amorsă / grund de profunzime (un strat)': 9.12,
  'Profil colț cu plasă (pentru muchii)': 2.7,
  'Tencuială pe bază de ipsos': 1.57,
  'Tencuială var-ciment': 0.87,
  'Plasă fibră de sticlă 160 g/mp (doar pe zone)': 0,
}

function midCons(r: Row) {
  if (r.consMin === 0 && r.consMax === 0) return 0
  return (r.consMin + r.consMax) / 2
}

function consStr(r: Row) {
  if (r.note) return r.note
  if (r.consMin === r.consMax) return r.consMin.toFixed(2)
  return `${r.consMin.toFixed(2)} – ${r.consMax.toFixed(2)}`
}

export default function Page() {
  const showSources = false
  const [area, setArea] = useState<number>(10)
  const [plasterType, setPlasterType] = useState<PlasterType>('ipsos')
  const [thicknessMm, setThicknessMm] = useState<number>(10)
  const [includeLosses, setIncludeLosses] = useState<boolean>(false)
  const [lossesPct, setLossesPct] = useState<number>(0)
  const [prices, setPrices] = useState<Record<string, number>>({ ...defaultPrices })
  const [included, setIncluded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    sections.forEach(sec => {
      sec.rows.forEach(r => {
        if (r.optional) init[r.name] = true
      })
    })
    return init
  })
  const [manualQty, setManualQty] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    sections.forEach(sec => {
      sec.rows.forEach(r => {
        if (r.note) init[r.name] = 0
      })
    })
    return init
  })

  const thicknessCm = useMemo(() => Math.max(0, (Number(thicknessMm) || 0) / 10), [thicknessMm])
  const lossesFactor = useMemo(() => (includeLosses ? 1 + Math.max(0, Number(lossesPct) || 0) / 100 : 1), [includeLosses, lossesPct])

  const activeSections = useMemo(() => {
    return sections.map(sec => ({
      ...sec,
      rows: sec.rows.filter(r => !r.plasterType || r.plasterType === 'all' || r.plasterType === plasterType),
    }))
  }, [plasterType])

  const { rowsComputed, totalReq, totalOpt, grand, grandVat, totalReqVat } = useMemo(() => {
    const vatRate = 0.21
    let req = 0
    let opt = 0

    const computed = activeSections.flatMap(sec =>
      sec.rows.map(r => {
        const isIncluded = !r.optional || included[r.name] !== false
        const cons = midCons(r)

        let qty: number
        if (cons === 0) qty = manualQty[r.name] ?? 0
        else if (r.consBasis === 'per_m2_cm') qty = cons * area * thicknessCm
        else qty = cons * area

        if (cons !== 0) qty *= lossesFactor

        const p = prices[r.name] ?? 0
        const tot = qty * p

        if (qty !== 0 && isIncluded) {
          if (r.optional) opt += tot
          else req += tot
        }

        return { sectionTitle: sec.title, row: r, cons, qty, price: p, tot, isIncluded }
      }),
    )

    const g = req + opt
    return { rowsComputed: computed, totalReq: req, totalOpt: opt, grand: g, grandVat: g * (1 + vatRate), totalReqVat: req * (1 + vatRate) }
  }, [activeSections, area, included, lossesFactor, manualQty, prices, thicknessCm])

  return (
    <main style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        h1 { font-size: 18px; font-weight: 500; margin-bottom: 1.0rem; color: #1a1a18; }
        .controls { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 10px; margin-bottom: 1.25rem; padding: 12px 16px; background: #fff; border-radius: 12px; border: 0.5px solid #d3d1c7; }
        .control { grid-column: span 3; display: flex; align-items: center; gap: 10px; }
        .control label { font-size: 13px; color: #5f5e5a; white-space: nowrap; }
        .control input[type=number], .control select { width: 100%; font-size: 14px; font-weight: 500; border: 0.5px solid #d3d1c7; border-radius: 6px; padding: 6px 8px; background: #fff; }
        .control .unit { font-size: 12px; color: #5f5e5a; white-space: nowrap; }
        .control.wide { grid-column: span 6; justify-content: space-between; }
        .control .inline { display: flex; align-items: center; gap: 10px; }
        .note { margin-left: auto; font-size: 12px; color: #888780; }
        .section-title { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #888780; margin: 1.25rem 0 0.5rem; padding: 0 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 12px; overflow: hidden; border: 0.5px solid #d3d1c7; margin-bottom: 0.5rem; }
        thead th { font-size: 11px; font-weight: 500; color: #888780; text-align: left; padding: 8px 10px; border-bottom: 0.5px solid #d3d1c7; letter-spacing: 0.04em; background: #f9f8f5; }
        thead th.num { text-align: right; }
        tbody tr { border-bottom: 0.5px solid #e8e7e2; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr.opt td { color: #888780; }
        tbody tr.excluded td { opacity: 0.45; }
        td { padding: 7px 10px; vertical-align: middle; }
        td.mat { font-size: 13px; color: #1a1a18; max-width: 260px; }
        tbody tr.opt td.mat { color: #5f5e5a; }
        td.cons { text-align: right; font-size: 12px; color: #5f5e5a; white-space: nowrap; }
        td.qty { text-align: right; font-size: 12px; font-weight: 500; white-space: nowrap; }
        td.price-cell { text-align: right; width: 95px; }
        td.price-cell input { width: 82px; text-align: right; font-size: 13px; border: 0.5px solid #d3d1c7; border-radius: 5px; padding: 3px 6px; }
        td.total-cell { text-align: right; font-weight: 500; font-size: 13px; white-space: nowrap; }
        td.opt-badge { width: 20px; text-align: center; }
        .opt-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #d3d1c7; }
        .req-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #e28b30; }
        .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 1.5rem; }
        .metric { background: #fff; border-radius: 8px; padding: 12px 14px; border: 0.5px solid #d3d1c7; }
        .metric .lbl { font-size: 11px; color: #888780; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
        .metric .val { font-size: 20px; font-weight: 500; color: #1a1a18; }
        .metric .sub { font-size: 11px; color: #888780; margin-top: 2px; }
        .metric.vat-total { background: #e9f7ed; border-color: #a9dcb6; }
        .metric.vat-total .lbl { color: #2f6d3a; font-weight: 700; }
        .metric.vat-total .val { font-weight: 700; }
        .metric.vat-total .sub { color: #2f6d3a; }
        .legend { display: flex; gap: 16px; margin-top: 1rem; font-size: 11px; color: #888780; }
        .legend span { display: flex; align-items: center; gap: 5px; }
        .sources { margin-top: 18px; background: #fff; border-radius: 12px; padding: 12px 14px; border: 0.5px solid #d3d1c7; }
        .sources h2 { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #888780; margin-bottom: 8px; font-weight: 600; }
        .sources ul { padding-left: 16px; font-size: 12px; color: #5f5e5a; }
        .sources li { margin-bottom: 4px; }
        .sources a { color: #378add; text-decoration: none; }
        .sources a:hover { text-decoration: underline; }
        @media (max-width: 900px) {
          .control { grid-column: span 6; }
          .control.wide { grid-column: span 12; }
          .summary { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <Link href="/calculatoare-rapide" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'none',
        color: '#6B6860',
        border: '1px solid var(--gray-200)',
        padding: '8px 12px',
        borderRadius: 10,
        background: 'var(--white)',
        marginBottom: 14,
      }}>
        ← Înapoi
      </Link>

      <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f5f5f2', borderRadius: 16, padding: '20px 16px', border: '1px solid var(--gray-200)' }}>
        <h1>Calculator materiale — tencuială (estimare)</h1>
        <div style={{ color: '#6B6860', fontSize: 13, marginBottom: 12 }}>
          Toate prețurile sunt fără TVA.
        </div>

        <div className="controls">
          <div className="control">
            <label>Suprafață</label>
            <div className="inline" style={{ width: '100%' }}>
              <input
                type="number"
                value={area}
                min={1}
                step={1}
                onChange={e => setArea(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
              />
              <span className="unit">m²</span>
            </div>
          </div>

          <div className="control">
            <label>Tip tencuială</label>
            <select value={plasterType} onChange={e => setPlasterType(e.target.value as PlasterType)}>
              <option value="ipsos">Pe bază de ipsos</option>
              <option value="var-ciment">Var-ciment</option>
            </select>
          </div>

          <div className="control">
            <label>Grosime strat</label>
            <div className="inline" style={{ width: '100%' }}>
              <input
                type="number"
                min={0}
                step={1}
                value={Number.isFinite(thicknessMm) ? thicknessMm : 0}
                onChange={e => setThicknessMm(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
              />
              <span className="unit">mm</span>
            </div>
          </div>

          <div className="control wide">
            <div className="inline">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={includeLosses} onChange={e => setIncludeLosses(e.target.checked)} />
                Pierderi (%)
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                disabled={!includeLosses}
                value={Number.isFinite(lossesPct) ? lossesPct : 0}
                onChange={e => setLossesPct(Math.max(0, Number(e.target.value) || 0))}
                style={{ width: 110, opacity: includeLosses ? 1 : 0.6 }}
              />
            </div>
            <span className="note">Prețuri în RON (fără TVA)</span>
          </div>
        </div>

        {activeSections.map(sec => (
          <div key={sec.title}>
            <div className="section-title">{sec.title}</div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 10 }} />
                  <th>Material</th>
                  <th className="num">Consum</th>
                  <th className="num">Cantitate ({area} m²)</th>
                  <th className="num" style={{ width: 100 }}>Preț/unitate</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {sec.rows.map(r => {
                  const item = rowsComputed.find(x => x.sectionTitle === sec.title && x.row.name === r.name)
                  const cons = item?.cons ?? 0
                  const qty = item?.qty ?? 0
                  const p = item?.price ?? 0
                  const tot = item?.tot ?? 0
                  const isIncluded = item?.isIncluded ?? true
                  const isManual = cons === 0 && !!r.note
                  const hasQty = qty !== 0

                  const qtyStr = isManual ? '' : (cons === 0 ? '—' : qty.toFixed(2))
                  const consUnit = r.consUnit ? ` ${r.consUnit}` : ''
                  const totStr = cons === 0 ? (hasQty ? `${tot.toFixed(2)} lei` : '—') : `${tot.toFixed(2)} lei`

                  return (
                    <tr key={r.name} className={`${r.optional ? 'opt' : ''}${r.optional && !isIncluded ? ' excluded' : ''}`}>
                      <td className="opt-badge">
                        {r.optional ? (
                          <input
                            type="checkbox"
                            checked={isIncluded}
                            onChange={e => setIncluded(prev => ({ ...prev, [r.name]: e.target.checked }))}
                            aria-label={`Include ${r.name}`}
                          />
                        ) : (
                          <span className="req-dot" />
                        )}
                      </td>
                      <td className="mat">{r.name}</td>
                      <td className="cons">{consStr(r)}{r.note ? '' : consUnit}</td>
                      <td className="qty">
                        {isManual ? (
                          <>
                            <input
                              type="number"
                              min={0}
                              step={0.1}
                              value={Number.isFinite(qty) ? qty : 0}
                              onChange={e => {
                                const next = Number(e.target.value) || 0
                                setManualQty(prev => ({ ...prev, [r.name]: next }))
                              }}
                              style={{
                                width: 82,
                                textAlign: 'right',
                                fontSize: 13,
                                border: '0.5px solid #d3d1c7',
                                borderRadius: 5,
                                padding: '3px 6px',
                                background: '#fff',
                              }}
                            />
                            <span style={{ marginLeft: 6, fontWeight: 400, color: '#5f5e5a' }}>{r.qtyUnit}</span>
                          </>
                        ) : (
                          <>
                            {qtyStr}{cons === 0 ? '' : ` ${r.qtyUnit}`}
                          </>
                        )}
                      </td>
                      <td className="price-cell">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={Number.isFinite(p) ? p : 0}
                          onChange={e => {
                            const next = Number(e.target.value) || 0
                            setPrices(prev => ({ ...prev, [r.name]: next }))
                          }}
                        />
                      </td>
                      <td className="total-cell">{totStr}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}

        <div className="summary">
          <div className="metric">
            <div className="lbl">Obligatoriu / m²</div>
            <div className="val">{(totalReq / area).toFixed(2)} lei</div>
            <div className="sub">fără opționale</div>
          </div>
          <div className="metric">
            <div className="lbl">Obligatoriu / total</div>
            <div className="val">{totalReq.toFixed(2)} lei</div>
            <div className="sub">{area} m²</div>
          </div>
          <div className="metric vat-total">
            <div className="lbl">Obligatoriu cu TVA (21%) / total</div>
            <div className="val">{totalReqVat.toFixed(2)} lei</div>
            <div className="sub">{area} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Cu opționale / m²</div>
            <div className="val">{(grand / area).toFixed(2)} lei</div>
            <div className="sub">toate materialele</div>
          </div>
          <div className="metric">
            <div className="lbl">Cu opționale / total</div>
            <div className="val">{grand.toFixed(2)} lei</div>
            <div className="sub">{area} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Total cu TVA (21%) / m²</div>
            <div className="val">{(grandVat / area).toFixed(2)} lei</div>
            <div className="sub">incl. TVA 21%</div>
          </div>
          <div className="metric vat-total">
            <div className="lbl">Total cu TVA (21%) / total</div>
            <div className="val">{grandVat.toFixed(2)} lei</div>
            <div className="sub">{area} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Grosime strat</div>
            <div className="val">{thicknessMm} mm</div>
            <div className="sub">{thicknessCm.toFixed(2)} cm</div>
          </div>
        </div>

        <div className="legend">
          <span><span className="req-dot" /> obligatoriu</span>
          <span><span className="opt-dot" /> opțional / situațional</span>
        </div>

        {showSources && (
          <div className="sources">
            <h2>Surse (consum & prețuri)</h2>
            <ul>
              <li><a href="https://knauf.ro/tencuieli/tencuieli-mecanizate-pe-baza-de-ipsos/tencuiala-mecanizata-knauf-mp75" target="_blank" rel="noreferrer">Consum tencuială ipsos: 10 kg/m²/cm</a></li>
              <li><a href="https://www.dedeman.ro/ro/tencuiala-de-ipsos-aplicare-mecanizata-knauf-mp-75-interior-25-kg/p/5019305" target="_blank" rel="noreferrer">Preț tencuială ipsos (sac 25 kg)</a></li>
              <li><a href="https://www.hornbach.ro/p/tencuiala-knauf-mp75-mecanizata-de-interior-alb-25-kg/10711104/" target="_blank" rel="noreferrer">Preț tencuială ipsos (sac 25 kg)</a></li>
              <li><a href="https://www.baumitdistribution.ro/produs/tencuiala-mecanizata-baumit-mpi-25-40-kg/" target="_blank" rel="noreferrer">Consum tencuială var-ciment: ~14 kg/m²/1 cm</a></li>
              <li><a href="https://www.dedeman.ro/ro/tencuiala-aplicare-manuala/mecanizata-baumit-mpi-25-interior-25-kg/p/5016199" target="_blank" rel="noreferrer">Preț tencuială var-ciment (sac 25 kg)</a></li>
              <li><a href="https://www.hornbach.ro/p/tencuiala-baumit-mpi25-pentru-interior-antracit-40kg/7414580/" target="_blank" rel="noreferrer">Preț tencuială var-ciment (sac 40 kg)</a></li>
              <li><a href="https://www.hornbach.ro/p/grund-acrilic-de-profunzime-hornbach-fara-conservanti-10-l/520365/" target="_blank" rel="noreferrer">Consum amorsă/grund: ~6 m²/l (un strat)</a></li>
              <li><a href="https://www.dedeman.ro/ro/amorsa-universala-rigips-prime-interior-4-l/p/5019639" target="_blank" rel="noreferrer">Preț amorsă/grund (recipient 4 L)</a></li>
              <li><a href="https://www.hornbach.ro/p/profil-coltar-profeel-pvc-cu-plasa-10x15x2500-mm/7414020/" target="_blank" rel="noreferrer">Preț profil colț cu plasă (2.5 m)</a></li>
              <li><a href="https://www.dedeman.ro/ro/accesorii-pentru-termoizolatii/c/399?attrs%5Bstatus%5D%5B0%5D=1" target="_blank" rel="noreferrer">Preț profil colț cu plasă (listare)</a></li>
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
