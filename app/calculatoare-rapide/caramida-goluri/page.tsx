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

type BrickCategory = 'normal' | 'nf'

type LayingType = 'mortar' | 'rostSubtire'

type BrickFormat = {
  id: string
  category: BrickCategory
  label: string
  lengthMm: number
  heightMm: number
  thicknessOptionsCm: number[]
  defaultPriceLeiPerBucByThicknessCm: Partial<Record<string, number>>
}

const brickFormats: BrickFormat[] = [
  {
    id: 'fmt-290x188',
    category: 'normal',
    label: 'Format față 290×188 mm',
    lengthMm: 290,
    heightMm: 188,
    thicknessOptionsCm: [24],
    defaultPriceLeiPerBucByThicknessCm: { '24': 8.2 },
  },
  {
    id: 'fmt-290x238',
    category: 'normal',
    label: 'Format față 290×238 mm',
    lengthMm: 290,
    heightMm: 238,
    thicknessOptionsCm: [24],
    defaultPriceLeiPerBucByThicknessCm: {},
  },
  {
    id: 'fmt-375x238',
    category: 'nf',
    label: 'Format față 375×238 mm',
    lengthMm: 375,
    heightMm: 238,
    thicknessOptionsCm: [25],
    defaultPriceLeiPerBucByThicknessCm: { '25': 12.71 },
  },
  {
    id: 'fmt-250x238',
    category: 'normal',
    label: 'Format față 250×238 mm',
    lengthMm: 250,
    heightMm: 238,
    thicknessOptionsCm: [38],
    defaultPriceLeiPerBucByThicknessCm: { '38': 13.71 },
  },
  {
    id: 'fmt-500x238',
    category: 'normal',
    label: 'Format față 500×238 mm',
    lengthMm: 500,
    heightMm: 238,
    thicknessOptionsCm: [11.5, 20],
    defaultPriceLeiPerBucByThicknessCm: { '11.5': 10.6, '20': 18.2 },
  },
  {
    id: 'fmt-250x249',
    category: 'nf',
    label: 'Format față 250×249 mm',
    lengthMm: 250,
    heightMm: 249,
    thicknessOptionsCm: [30],
    defaultPriceLeiPerBucByThicknessCm: { '30': 12.3 },
  },
  {
    id: 'fmt-430x238',
    category: 'nf',
    label: 'Format față 430×238 mm',
    lengthMm: 430,
    heightMm: 238,
    thicknessOptionsCm: [24],
    defaultPriceLeiPerBucByThicknessCm: {},
  },
]

const sections: Section[] = [
  {
    title: 'Zidărie',
    rows: [
      { name: 'Cărămidă cu goluri', unit: 'buc', base: 'm2', consMin: 0, consMax: 0, optional: false },
      { name: 'Mortar zidărie pentru cărămidă (sac 25 kg)', unit: 'sac', base: 'm3', consMin: 156 / 25, consMax: 156 / 25, optional: false },
      { name: 'Mortar rost subțire / adeziv Porotherm Profi (sac 25 kg)', unit: 'sac', base: 'm2', consMin: (1 / 1.6) / 25, consMax: (1 / 1.4) / 25, optional: false },
    ],
  },
  {
    title: 'Consumabile / auxiliare (opțional / situațional)',
    rows: [
      { name: 'Plasă sudată armare locală (m²)', unit: 'm²', base: 'm2', consMin: 0, consMax: 0, optional: true, note: 'introdu manual' },
      { name: 'Buiandrugi (situațional)', unit: 'buc', base: 'm2', consMin: 0, consMax: 0, optional: true, note: 'introdu manual' },
      { name: 'Ancore / bandă / spumă (situațional)', unit: 'buc', base: 'm2', consMin: 0, consMax: 0, optional: true, note: 'introdu manual' },
    ],
  },
]

const defaultPrices: Record<string, number> = {
  'Cărămidă cu goluri': 0,
  'Mortar zidărie pentru cărămidă (sac 25 kg)': 13.85,
  'Mortar rost subțire / adeziv Porotherm Profi (sac 25 kg)': 54.53,
  'Plasă sudată armare locală (m²)': 39.92,
  'Buiandrugi (situațional)': 0,
  'Ancore / bandă / spumă (situațional)': 0,
}

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

function fmt(format: BrickFormat, thicknessCm: number) {
  return `${format.lengthMm}×${format.heightMm}×${Math.round(thicknessCm * 10)} mm`
}

export default function Page() {
  const [area, setArea] = useState<number>(1)
  const [formatId, setFormatId] = useState<string>(brickFormats[0]?.id ?? 'fmt-290x188')
  const format = brickFormats.find(f => f.id === formatId) ?? brickFormats[0]
  const [thicknessCm, setThicknessCm] = useState<number>(format?.thicknessOptionsCm[0] ?? 24)
  const [layingType, setLayingType] = useState<LayingType>('mortar')
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
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const init = { ...defaultPrices }
    const firstFormat = brickFormats[0]
    const firstThickness = firstFormat?.thicknessOptionsCm[0]
    const auto = firstThickness != null ? (firstFormat?.defaultPriceLeiPerBucByThicknessCm[String(firstThickness)] ?? 0) : 0
    init['Cărămidă cu goluri'] = auto
    return init
  })

  const { volumeM3, piecesRaw, piecesCeil, faceAreaM2, rowsComputed, totalReq, totalOpt, grand, grandVat } = useMemo(() => {
    const vatRate = 0.21
    const thicknessM = thicknessCm / 100
    const vM3 = area * thicknessM
    const faceM2 = (format.lengthMm / 1000) * (format.heightMm / 1000)
    const raw = faceM2 > 0 ? area / faceM2 : 0
    const ceil = Math.ceil(raw)

    let req = 0
    let opt = 0

    const computed = sections.flatMap(sec =>
      sec.rows.map(r => {
        const isIncluded = !r.optional || included[r.name] !== false
        const cons = midCons(r)
        const baseVal = r.base === 'm3' ? vM3 : area
        let qty = 0

        if (r.name === 'Cărămidă cu goluri') qty = ceil
        else if (r.name === 'Mortar zidărie pentru cărămidă (sac 25 kg)') qty = layingType === 'mortar' ? cons * vM3 : 0
        else if (r.name === 'Mortar rost subțire / adeziv Porotherm Profi (sac 25 kg)') qty = layingType === 'rostSubtire' ? cons * area : 0
        else qty = cons === 0 ? (manualQty[r.name] ?? 0) : cons * baseVal

        const p = prices[r.name] ?? 0
        const tot = qty * p

        if (qty > 0 && isIncluded) {
          if (r.optional) opt += tot
          else req += tot
        }

        return { sectionTitle: sec.title, row: r, cons, qty, price: p, tot, isIncluded }
      }),
    )

    const g = req + opt
    return { volumeM3: vM3, piecesRaw: raw, piecesCeil: ceil, faceAreaM2: faceM2, rowsComputed: computed, totalReq: req, totalOpt: opt, grand: g, grandVat: g * (1 + vatRate) }
  }, [area, thicknessCm, format.heightMm, format.lengthMm, layingType, prices, included, manualQty])

  return (
    <main style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        h1 { font-size: 18px; font-weight: 500; margin-bottom: 1.5rem; color: #1a1a18; }
        .controls { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 1rem; }
        .control { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fff; border-radius: 12px; border: 0.5px solid #d3d1c7; }
        .control label { font-size: 14px; color: #5f5e5a; white-space: nowrap; }
        .control input[type=number] { width: 110px; font-size: 15px; font-weight: 500; border: 0.5px solid #d3d1c7; border-radius: 6px; padding: 4px 8px; }
        .control select { font-size: 14px; border: 0.5px solid #d3d1c7; border-radius: 6px; padding: 5px 8px; background: #fff; max-width: 420px; }
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
        td.mat { font-size: 13px; color: #1a1a18; max-width: 300px; }
        tbody tr.opt td.mat { color: #5f5e5a; }
        td.cons { text-align: right; font-size: 12px; color: #5f5e5a; white-space: nowrap; }
        td.qty { text-align: right; font-size: 12px; font-weight: 500; white-space: nowrap; }
        td.price-cell { text-align: right; width: 125px; }
        td.price-cell input { width: 90px; text-align: right; font-size: 13px; border: 0.5px solid #d3d1c7; border-radius: 5px; padding: 3px 6px; }
        td.total-cell { text-align: right; font-weight: 500; font-size: 13px; white-space: nowrap; }
        td.opt-badge { width: 20px; text-align: center; }
        .opt-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #d3d1c7; }
        .req-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #378add; }
        .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 1.5rem; }
        .metric { background: #fff; border-radius: 8px; padding: 12px 14px; border: 0.5px solid #d3d1c7; }
        .metric .lbl { font-size: 11px; color: #888780; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
        .metric .val { font-size: 20px; font-weight: 500; color: #1a1a18; }
        .metric .sub { font-size: 11px; color: #888780; margin-top: 2px; }
        .legend { display: flex; gap: 16px; margin-top: 1rem; font-size: 11px; color: #888780; }
        .legend span { display: flex; align-items: center; gap: 5px; }
        @media (max-width: 700px) {
          .kpis { grid-template-columns: 1fr; }
          .summary { grid-template-columns: 1fr 1fr; }
          td { padding: 6px 6px; }
          td.mat { max-width: 190px; }
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
        <h1>Calculator necesar — Cărămidă cu goluri</h1>

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
            <label>Dimensiune cărămidă</label>
            <select
              value={formatId}
              onChange={e => {
                const nextId = e.target.value
                setFormatId(nextId)
                const nextFormat = brickFormats.find(f => f.id === nextId) ?? brickFormats[0]
                const nextTh = nextFormat?.thicknessOptionsCm[0] ?? thicknessCm
                setThicknessCm(nextTh)
                const auto = nextTh != null ? (nextFormat?.defaultPriceLeiPerBucByThicknessCm[String(nextTh)] ?? 0) : 0
                setPrices(prev => ({ ...prev, 'Cărămidă cu goluri': auto }))
              }}
            >
              <optgroup label="Normale">
                {brickFormats.filter(f => f.category === 'normal').map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </optgroup>
              <optgroup label="NF (Nut & Feder)">
                {brickFormats.filter(f => f.category === 'nf').map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="control">
            <label>Grosime zid</label>
            <select
              value={thicknessCm}
              onChange={e => {
                const next = Number(e.target.value)
                if (!Number.isFinite(next) || next <= 0) return
                setThicknessCm(next)
                const auto = format?.defaultPriceLeiPerBucByThicknessCm[String(next)] ?? 0
                setPrices(prev => ({ ...prev, 'Cărămidă cu goluri': auto }))
              }}
            >
              {(format?.thicknessOptionsCm ?? [thicknessCm]).map(v => (
                <option key={v} value={v}>{Number.isInteger(v) ? `${v} cm` : `${v} cm`}</option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Punere în operă</label>
            <select value={layingType} onChange={e => setLayingType((e.target.value as LayingType) || layingType)}>
              <option value="mortar">Normal (mortar)</option>
              <option value="rostSubtire">Rost subțire (thin-bed)</option>
            </select>
          </div>

          <span className="hint">Prețuri în RON (fără TVA)</span>
        </div>

        <div className="kpis">
          <div className="kpi">
            <div className="lbl">Format cărămidă</div>
            <div className="val">{fmt(format, thicknessCm)} · {format.category === 'nf' ? 'NF' : 'normal'} · {layingType === 'rostSubtire' ? 'rost subțire' : 'mortar'}</div>
          </div>
          <div className="kpi">
            <div className="lbl">Volum zidărie</div>
            <div className="val">{n2(volumeM3)} m³</div>
          </div>
          <div className="kpi">
            <div className="lbl">Cărămizi (rotunjit)</div>
            <div className="val">{n0(piecesCeil)} buc</div>
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
                  <th className="num" style={{ width: 125 }}>Preț/unitate</th>
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
                  const hasQty = qty > 0

                  const brickPerM2 = faceAreaM2 > 0 ? 1 / faceAreaM2 : 0
                  const isBrick = r.name === 'Cărămidă cu goluri'
                  const isMortar = r.name === 'Mortar zidărie pentru cărămidă (sac 25 kg)'
                  const isAdeziv = r.name === 'Mortar rost subțire / adeziv Porotherm Profi (sac 25 kg)'
                  const isApplicable = isBrick || (isMortar && layingType === 'mortar') || (isAdeziv && layingType === 'rostSubtire') || (!isMortar && !isAdeziv)

                  const consLabel = isBrick
                    ? `${n2(brickPerM2)} buc / m²`
                    : !isApplicable
                      ? '—'
                      : cons === 0
                        ? (r.note ?? '—')
                        : `${n2(cons)} ${r.unit} / ${r.base === 'm3' ? 'm³' : 'm²'}`

                  const qtyLabel = isManual
                    ? ''
                    : !isApplicable
                      ? '—'
                      : cons === 0 && !isBrick
                        ? '—'
                        : isBrick
                          ? `${n0(qty)} buc`
                          : `${n2(qty)} ${r.unit}`

                  const totLabel = !isApplicable ? '—' : (hasQty ? `${n2(tot)} lei` : '—')

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
                      <td className="cons">{consLabel}</td>
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
                          qtyLabel
                        )}
                      </td>
                      <td className="price-cell">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
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
                          {p === 0 ? <span style={{ fontSize: 11, color: '#888780' }}>manual</span> : null}
                        </div>
                      </td>
                      <td className="total-cell">{totLabel}</td>
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
          <div className="metric">
            <div className="lbl">Total cu TVA (21%) / total</div>
            <div className="val">{n2(grandVat)} lei</div>
            <div className="sub">{n0(area)} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Suprafață</div>
            <div className="val">{n0(area)} m²</div>
            <div className="sub">modifică sus</div>
          </div>
          <div className="metric">
            <div className="lbl">Volum</div>
            <div className="val">{n2(volumeM3)} m³</div>
            <div className="sub">{thicknessCm} cm</div>
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
