'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type RowBase = 'm2' | 'm3'

type Row = {
  name: string
  unit: string
  base: RowBase
  consMin: number
  consMax: number
  optional: boolean
  note?: string
}

type Section = {
  title: string
  rows: Row[]
}

type BlockFormat = {
  id: string
  label: string
  lengthMm: number
  heightMm: number
  defaultPriceLeiPerM3: number
  thicknessOptionsCm: number[]
}

const blockFormats: BlockFormat[] = [
  {
    id: '625x250',
    label: 'Format față 625×250 mm',
    lengthMm: 625,
    heightMm: 250,
    defaultPriceLeiPerM3: 420.17,
    thicknessOptionsCm: [10, 12.5, 15, 20, 25, 30],
  },
  {
    id: '625x240',
    label: 'Format față 625×240 mm',
    lengthMm: 625,
    heightMm: 240,
    defaultPriceLeiPerM3: 420.17,
    thicknessOptionsCm: [10, 12.5, 15, 20, 25, 30],
  },
  {
    id: '600x250',
    label: 'Format față 600×250 mm',
    lengthMm: 600,
    heightMm: 250,
    defaultPriceLeiPerM3: 420.17,
    thicknessOptionsCm: [10, 12.5, 15, 20, 25, 30],
  },
  {
    id: '600x200',
    label: 'Format față 600×200 mm',
    lengthMm: 600,
    heightMm: 200,
    defaultPriceLeiPerM3: 420.17,
    thicknessOptionsCm: [10, 12.5, 15, 20, 25, 30],
  },
  {
    id: '599x199',
    label: 'Format față 599×199 mm',
    lengthMm: 599,
    heightMm: 199,
    defaultPriceLeiPerM3: 420.17,
    thicknessOptionsCm: [10, 12.5, 15, 20, 25, 30],
  },
]

const sections: Section[] = [
  {
    title: 'Zidărie',
    rows: [
      { name: 'BCA (blocuri zidărie)', unit: 'm³', base: 'm3', consMin: 1, consMax: 1, optional: false },
      { name: 'Adeziv zidărie BCA (sac 25 kg)', unit: 'sac', base: 'm3', consMin: 1, consMax: 1, optional: false },
    ],
  },
  {
    title: 'Accesorii (opțional / situațional)',
    rows: [
      { name: 'Mortar ciment-nisip (primul rând)', unit: 'kg', base: 'm2', consMin: 0, consMax: 0, optional: true, note: 'introdu manual' },
      { name: 'Plasă / armare zidărie (rosturi / zone armate)', unit: 'm', base: 'm2', consMin: 0, consMax: 0, optional: true, note: 'introdu manual' },
      { name: 'Buiandrugi / U-blocuri BCA', unit: 'buc', base: 'm2', consMin: 0, consMax: 0, optional: true, note: 'introdu manual' },
    ],
  },
]

function midCons(r: Row) {
  if (r.consMin === 0 && r.consMax === 0) return 0
  return (r.consMin + r.consMax) / 2
}

function n0(n: number) {
  return n.toLocaleString('ro-RO', { maximumFractionDigits: 0 })
}

function n2(n: number) {
  return n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function consStr(r: Row) {
  if (r.note) return r.note
  if (r.consMin === r.consMax) return n2(r.consMin)
  return `${n2(r.consMin)} – ${n2(r.consMax)}`
}

function fmt(format: BlockFormat, thicknessCm: number) {
  return `${format.lengthMm}×${format.heightMm}×${thicknessCm * 10} mm`
}

export default function Page() {
  const [area, setArea] = useState<number>(1)
  const [formatId, setFormatId] = useState<string>(blockFormats[0]?.id ?? '625x250')
  const format = blockFormats.find(f => f.id === formatId) ?? blockFormats[0]
  const [thicknessCm, setThicknessCm] = useState<number>(format?.thicknessOptionsCm[0] ?? 25)
  const [edgeType, setEdgeType] = useState<'PL' | 'NF'>('PL')
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
  const [prices, setPrices] = useState<Record<string, number>>({
    'BCA (blocuri zidărie)': format?.defaultPriceLeiPerM3 ?? 0,
    'Adeziv zidărie BCA (sac 25 kg)': 21.43,
    'Mortar ciment-nisip (primul rând)': 0,
    'Plasă / armare zidărie (rosturi / zone armate)': 0,
    'Buiandrugi / U-blocuri BCA': 0,
  })

  const { volumeM3, pieces, rowsComputed, totalReq, totalOpt, grand, grandVat, totalReqVat } = useMemo(() => {
    const vatRate = 0.21
    const thicknessM = thicknessCm / 100
    const vM3 = area * thicknessM
    const faceAreaM2 = (format.lengthMm / 1000) * (format.heightMm / 1000)
    const pcs = faceAreaM2 > 0 ? area / faceAreaM2 : 0
    const adhesivePerM3Base = 1 // sac / m³ pentru muchii plane (PL)
    const adhesiveFactor = edgeType === 'NF' ? 0.7 : 1 // NF ≈ -30% adeziv (fără muchii verticale)

    let req = 0
    let opt = 0
    const computed = sections.flatMap(sec =>
      sec.rows.map(r => {
        const isIncluded = !r.optional || included[r.name] !== false
        let cons = midCons(r)
        if (r.name === 'Adeziv zidărie BCA (sac 25 kg)' && r.base === 'm3') {
          cons = adhesivePerM3Base * adhesiveFactor
        }
        const baseVal = r.base === 'm3' ? vM3 : area
        const qty = cons === 0 ? (manualQty[r.name] ?? 0) : cons * baseVal
        const p = prices[r.name] ?? 0
        const tot = qty * p
        if (qty !== 0 && isIncluded) {
          if (r.optional) opt += tot
          else req += tot
        }
        return { sectionTitle: sec.title, row: r, cons, qty, price: p, tot, baseVal, isIncluded }
      }),
    )

    const g = req + opt
    return { volumeM3: vM3, pieces: pcs, rowsComputed: computed, totalReq: req, totalOpt: opt, grand: g, grandVat: g * (1 + vatRate), totalReqVat: req * (1 + vatRate) }
  }, [area, thicknessCm, format.heightMm, format.lengthMm, prices, edgeType, included, manualQty])

  return (
    <main style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        h1 { font-size: 18px; font-weight: 500; margin-bottom: 1.5rem; color: #1a1a18; }
        .controls { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 1rem; }
        .control { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fff; border-radius: 12px; border: 0.5px solid #d3d1c7; }
        .control label { font-size: 14px; color: #5f5e5a; white-space: nowrap; }
        .control input[type=number] { width: 110px; font-size: 15px; font-weight: 500; border: 0.5px solid #d3d1c7; border-radius: 6px; padding: 4px 8px; }
        .control select { font-size: 14px; border: 0.5px solid #d3d1c7; border-radius: 6px; padding: 5px 8px; background: #fff; max-width: 320px; }
        .hint { margin-left: auto; font-size: 12px; color: #888780; }
        .kpis { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-bottom: 1.25rem; }
        .kpi { background: #fff; border-radius: 8px; padding: 12px 14px; border: 0.5px solid #d3d1c7; }
        .kpi .lbl { font-size: 11px; color: #888780; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
        .kpi .val { font-size: 18px; font-weight: 500; color: #1a1a18; }
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
        td.price-cell { text-align: right; width: 110px; }
        td.price-cell input { width: 90px; text-align: right; font-size: 13px; border: 0.5px solid #d3d1c7; border-radius: 5px; padding: 3px 6px; }
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
        @media (max-width: 700px) {
          .kpis { grid-template-columns: 1fr; }
          .summary { grid-template-columns: 1fr 1fr; }
          td { padding: 6px 6px; }
          td.mat { max-width: 180px; }
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
        <h1>Calculator necesar — BCA</h1>

        <div className="controls">
          <div className="control">
            <label>Suprafață totală pereți</label>
            <input
              type="number"
              value={area}
              min={1}
              step={1}
              onChange={e => setArea(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
            />
            <span style={{ fontSize: 14, color: '#5f5e5a' }}>m²</span>
          </div>

          <div className="control">
            <label>Tip bloc</label>
            <select
              value={formatId}
              onChange={e => {
                const nextId = e.target.value
                setFormatId(nextId)
                const nextFormat = blockFormats.find(f => f.id === nextId) ?? blockFormats[0]
                const nextTh = nextFormat?.thicknessOptionsCm[0] ?? thicknessCm
                setThicknessCm(nextTh)
                setPrices(prev => ({ ...prev, 'BCA (blocuri zidărie)': nextFormat?.defaultPriceLeiPerM3 ?? prev['BCA (blocuri zidărie)'] ?? 0 }))
              }}
            >
              {blockFormats.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Grosime zid</label>
            <select value={thicknessCm} onChange={e => setThicknessCm(Number(e.target.value) || thicknessCm)}>
              {(format?.thicknessOptionsCm ?? [thicknessCm]).map(v => (
                <option key={v} value={v}>{v} cm</option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Tip muchii</label>
            <select value={edgeType} onChange={e => setEdgeType((e.target.value as 'PL' | 'NF') || 'PL')}>
              <option value="PL">Plane (PL)</option>
              <option value="NF">Nut și feder (NF)</option>
            </select>
          </div>

          <span className="hint">Prețuri în RON (fără TVA)</span>
        </div>

        <div className="kpis">
          <div className="kpi">
            <div className="lbl">Format bloc</div>
            <div className="val">{fmt(format, thicknessCm)}</div>
          </div>
          <div className="kpi">
            <div className="lbl">Volum zidărie</div>
            <div className="val">{n2(volumeM3)} m³</div>
          </div>
          <div className="kpi">
            <div className="lbl">Blocuri (estimativ)</div>
            <div className="val">{n0(Math.ceil(pieces))} buc</div>
          </div>
        </div>

        {sections.map(sec => (
          <div key={sec.title}>
            <div className="section-title">{sec.title}</div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 10 }} />
                  <th>Material</th>
                  <th className="num">Consum</th>
                  <th className="num">Cantitate</th>
                  <th className="num" style={{ width: 110 }}>Preț/unitate</th>
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
                  const qtyStr = isManual ? '' : (cons === 0 ? '—' : n2(qty))
                  const totStr = cons === 0 ? (hasQty ? `${n2(tot)} lei` : '—') : `${n2(tot)} lei`
                  const baseLabel = r.base === 'm3' ? `${n2(volumeM3)} m³` : `${n0(area)} m²`
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
                      <td className="cons">{cons === 0 ? (r.note ?? '—') : `${n2(cons)} ${r.unit} / ${r.base === 'm3' ? 'm³' : 'm²'}`}</td>
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
                                width: 90,
                                textAlign: 'right',
                                fontSize: 13,
                                border: '0.5px solid #d3d1c7',
                                borderRadius: 5,
                                padding: '3px 6px',
                                background: '#fff',
                              }}
                            />
                            <span style={{ marginLeft: 6, fontWeight: 400, color: '#5f5e5a' }}>{r.unit}</span>
                          </>
                        ) : (
                          <>
                            {qtyStr}{cons === 0 ? '' : ` ${r.unit}`}
                            <span style={{ color: '#888780', fontWeight: 400 }}>{cons === 0 ? '' : ` (din ${baseLabel})`}</span>
                          </>
                        )}
                      </td>
                      <td className="price-cell">
                        <input
                          type="number"
                          min={0}
                          step={0.1}
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
            <div className="val">{n2(totalReq / area)} lei</div>
            <div className="sub">fără opționale</div>
          </div>
          <div className="metric">
            <div className="lbl">Obligatoriu / total</div>
            <div className="val">{n2(totalReq)} lei</div>
            <div className="sub">{n0(area)} m²</div>
          </div>
          <div className="metric vat-total">
            <div className="lbl">Obligatoriu cu TVA (21%) / total</div>
            <div className="val">{n2(totalReqVat)} lei</div>
            <div className="sub">{n0(area)} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Cu opționale / m²</div>
            <div className="val">{n2(grand / area)} lei</div>
            <div className="sub">toate materialele</div>
          </div>
          <div className="metric">
            <div className="lbl">Cu opționale / total</div>
            <div className="val">{n2(grand)} lei</div>
            <div className="sub">{n0(area)} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Total cu TVA (21%) / m²</div>
            <div className="val">{n2(grandVat / area)} lei</div>
            <div className="sub">incl. TVA 21%</div>
          </div>
          <div className="metric vat-total">
            <div className="lbl">Total cu TVA (21%) / total</div>
            <div className="val">{n2(grandVat)} lei</div>
            <div className="sub">{n0(area)} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Grosime zid</div>
            <div className="val">{thicknessCm} cm</div>
            <div className="sub">{fmt(format, thicknessCm)}</div>
          </div>
        </div>

        <div className="legend">
          <span><span className="req-dot" /> obligatoriu</span>
          <span><span className="opt-dot" /> opțional / situațional</span>
        </div>
      </div>
    </main>
  )
}
