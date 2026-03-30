'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Row = {
  name: string
  unit: string
  consMin: number
  consMax: number
  optional: boolean
  note?: string
  info?: string
}

type Section = {
  title: string
  rows: Row[]
}

const sections: Section[] = [
  {
    title: 'Pregătire suprafață',
    rows: [
      { name: 'Amorsa de contact', unit: 'kg', consMin: 0.15, consMax: 0.3, optional: false },
      { name: 'Mortar de reprofilare', unit: 'kg/cm', consMin: 1.5, consMax: 2.0, optional: true },
    ],
  },
  {
    title: 'Lipire și fixare vată minerală',
    rows: [
      { name: 'Adeziv pentru vată minerală', unit: 'kg', consMin: 5, consMax: 8, optional: false, info: 'acoperire 100% — obligatorie la vată' },
      { name: 'Vată minerală placă rigidă (MW)', unit: 'm²', consMin: 1.05, consMax: 1.05, optional: false },
      { name: 'Dibluri cu șaibă termică', unit: 'buc', consMin: 8, consMax: 10, optional: false, info: 'mai multe față de EPS — material mai greu' },
    ],
  },
  {
    title: 'Armare (tencuială de bază)',
    rows: [
      { name: 'Mortar de armare (masă șpaclu)', unit: 'kg', consMin: 5, consMax: 7, optional: false, info: 'strat ușor mai gros față de EPS' },
      { name: 'Plasă fibră de sticlă 160 g/mp', unit: 'm²', consMin: 1.1, consMax: 1.2, optional: false },
      { name: 'Profil de colț PVC cu plasă', unit: 'ml', consMin: 0, consMax: 0, optional: true, note: 'per ml colț' },
      { name: 'Profil de soclu (start)', unit: 'ml', consMin: 0, consMax: 0, optional: true, note: 'per ml soclu' },
      { name: 'Profil fereastră cu picurător', unit: 'ml', consMin: 0, consMax: 0, optional: true, note: 'per ml gol' },
      { name: 'Bandă etanșare expandabilă', unit: 'ml', consMin: 0, consMax: 0, optional: true, note: 'per ml rost' },
      { name: 'Profil de dilatație', unit: 'ml', consMin: 0, consMax: 0, optional: true, note: 'la suprafețe mari' },
    ],
  },
  {
    title: 'Finisaj exterior',
    rows: [
      { name: 'Grund pentru tencuială decorativă', unit: 'kg', consMin: 0.2, consMax: 0.3, optional: false },
      { name: 'Tencuială decorativă siliconică', unit: 'kg', consMin: 2.0, consMax: 3.5, optional: false, info: 'preferată față de acrilică — permeabilitate vapori' },
      { name: 'Tencuială decorativă silicatică', unit: 'kg', consMin: 2.5, consMax: 3.5, optional: true, info: 'alternativă respirabilă' },
    ],
  },
  {
    title: 'Specificități vată minerală',
    rows: [
      { name: 'Vată minerală lamelă (fibre ⊥ față)', unit: 'm²', consMin: 1.05, consMax: 1.05, optional: true, info: 'rezistență superioară la smulgere' },
      { name: 'Grund de impregnare pentru vată', unit: 'kg', consMin: 0.1, consMax: 0.2, optional: true, info: 'recomandat de unii producători înainte de masă' },
      { name: 'Plasă specială 200+ g/mp la soclu', unit: 'm²', consMin: 2.1, consMax: 2.2, optional: true },
      { name: 'Tencuială dură soclu / mozaic', unit: 'kg', consMin: 3.0, consMax: 5.0, optional: true },
    ],
  },
]

const defaultPrices: Record<string, number> = {
  'Amorsa de contact': 8,
  'Mortar de reprofilare': 4,
  'Adeziv pentru vată minerală': 4,
  'Vată minerală placă rigidă (MW)': 55,
  'Dibluri cu șaibă termică': 1.4,
  'Mortar de armare (masă șpaclu)': 4,
  'Plasă fibră de sticlă 160 g/mp': 6,
  'Profil de colț PVC cu plasă': 4,
  'Profil de soclu (start)': 6,
  'Profil fereastră cu picurător': 5,
  'Bandă etanșare expandabilă': 8,
  'Profil de dilatație': 12,
  'Grund pentru tencuială decorativă': 12,
  'Tencuială decorativă siliconică': 11,
  'Tencuială decorativă silicatică': 10,
  'Vată minerală lamelă (fibre ⊥ față)': 70,
  'Grund de impregnare pentru vată': 15,
  'Plasă specială 200+ g/mp la soclu': 9,
  'Tencuială dură soclu / mozaic': 7,
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
  const [area, setArea] = useState<number>(1)
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

  const { rowsComputed, totalReq, totalOpt, grand, grandVat } = useMemo(() => {
    const vatRate = 0.21
    let req = 0
    let opt = 0
    const computed = sections.flatMap(sec =>
      sec.rows.map(r => {
        const isIncluded = !r.optional || included[r.name] !== false
        const cons = midCons(r)
        const qty = cons === 0 ? (manualQty[r.name] ?? 0) : cons * area
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
    return { rowsComputed: computed, totalReq: req, totalOpt: opt, grand: g, grandVat: g * (1 + vatRate) }
  }, [area, prices, included, manualQty])

  return (
    <main style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        h1 { font-size: 18px; font-weight: 500; margin-bottom: 1.5rem; color: #1a1a18; }
        .area-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; padding: 12px 16px; background: #fff; border-radius: 12px; border: 0.5px solid #d3d1c7; }
        .area-row label { font-size: 14px; color: #5f5e5a; white-space: nowrap; }
        .area-row input[type=number] { width: 90px; font-size: 15px; font-weight: 500; border: 0.5px solid #d3d1c7; border-radius: 6px; padding: 4px 8px; }
        .area-row span { font-size: 14px; color: #5f5e5a; }
        .area-note { margin-left: auto; font-size: 12px; color: #888780; }
        .section-title { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #888780; margin: 1.5rem 0 0.5rem; padding: 0 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 12px; overflow: hidden; border: 0.5px solid #d3d1c7; margin-bottom: 0.5rem; }
        thead th { font-size: 11px; font-weight: 500; color: #888780; text-align: left; padding: 8px 10px; border-bottom: 0.5px solid #d3d1c7; letter-spacing: 0.04em; background: #f9f8f5; }
        thead th.num { text-align: right; }
        tbody tr { border-bottom: 0.5px solid #e8e7e2; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr.opt td { color: #888780; }
        tbody tr.excluded td { opacity: 0.45; }
        td { padding: 7px 10px; vertical-align: middle; }
        td.mat { font-size: 13px; color: #1a1a18; max-width: 220px; }
        tbody tr.opt td.mat { color: #5f5e5a; }
        td.cons { text-align: right; font-size: 12px; color: #5f5e5a; white-space: nowrap; }
        td.qty { text-align: right; font-size: 12px; font-weight: 500; white-space: nowrap; }
        td.price-cell { text-align: right; width: 95px; }
        td.price-cell input { width: 82px; text-align: right; font-size: 13px; border: 0.5px solid #d3d1c7; border-radius: 5px; padding: 3px 6px; }
        td.total-cell { text-align: right; font-weight: 500; font-size: 13px; white-space: nowrap; }
        td.opt-badge { width: 20px; text-align: center; }
        .opt-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #d3d1c7; }
        .req-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #e28b30; }
        .mat-info { font-size: 10px; color: #888780; display: block; margin-top: 2px; }
        .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 1.5rem; }
        .metric { background: #fff; border-radius: 8px; padding: 12px 14px; border: 0.5px solid #d3d1c7; }
        .metric .lbl { font-size: 11px; color: #888780; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
        .metric .val { font-size: 20px; font-weight: 500; color: #1a1a18; }
        .metric .sub { font-size: 11px; color: #888780; margin-top: 2px; }
        .legend { display: flex; gap: 16px; margin-top: 1rem; font-size: 11px; color: #888780; }
        .legend span { display: flex; align-items: center; gap: 5px; }
        @media (max-width: 600px) {
          .summary { grid-template-columns: 1fr 1fr; }
          table { font-size: 12px; }
          td { padding: 6px 6px; }
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
        <h1>Calculator materiale — termosistem vată minerală</h1>

        <div className="area-row">
          <label>Suprafață totală</label>
          <input
            type="number"
            value={area}
            min={1}
            step={1}
            onChange={e => setArea(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          />
          <span>m²</span>
          <span className="area-note">Prețuri în RON (fără TVA)</span>
        </div>

        {sections.map(sec => (
          <div key={sec.title}>
            <div className="section-title">{sec.title}</div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 10 }} />
                  <th>Material</th>
                  <th className="num">Consum/m²</th>
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
                      <td className="mat">
                        {r.name}
                        {r.info ? <span className="mat-info">{r.info}</span> : null}
                      </td>
                      <td className="cons">{consStr(r)} {r.unit}</td>
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
                            <span style={{ marginLeft: 6, fontWeight: 400, color: '#5f5e5a' }}>{r.unit}</span>
                          </>
                        ) : (
                          <>
                            {qtyStr}{cons === 0 ? '' : ` ${r.unit}`}
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
            <div className="val">{(totalReq / area).toFixed(2)} lei</div>
            <div className="sub">fără opționale</div>
          </div>
          <div className="metric">
            <div className="lbl">Obligatoriu / total</div>
            <div className="val">{totalReq.toFixed(2)} lei</div>
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
          <div className="metric">
            <div className="lbl">Total cu TVA (21%) / total</div>
            <div className="val">{grandVat.toFixed(2)} lei</div>
            <div className="sub">{area} m²</div>
          </div>
          <div className="metric">
            <div className="lbl">Suprafață</div>
            <div className="val">{area} m²</div>
            <div className="sub">modifică sus</div>
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
