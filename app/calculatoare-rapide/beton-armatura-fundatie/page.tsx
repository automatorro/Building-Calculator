 'use client'
 
import Link from 'next/link'
 import { useMemo, useState } from 'react'
 
 type DiaMm = 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 25
 
 type RowKind =
   | 'beton-talpa'
   | 'beton-elevatie'
   | 'cofraj-elevatie'
   | 'cofraj-talpa'
   | 'armatura-long-talpa'
   | 'armatura-long-elevatie'
   | 'armatura-etrieri-elevatie'
   | 'sarma-legat'
   | 'distantieri'
 
 type Row = {
   name: string
   qtyUnit: string
   optional: boolean
   kind: RowKind
   consLabel: string
 }
 
 type Section = {
   title: string
   rows: Row[]
 }
 
 const DIA_OPTIONS: DiaMm[] = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25]
 const KG_PER_M: Record<DiaMm, number> = {
   6: 0.222,
   8: 0.395,
   10: 0.617,
   12: 0.888,
   14: 1.21,
   16: 1.58,
   18: 2.0,
   20: 2.47,
   22: 2.98,
   25: 3.85,
 }
 
 const sections: Section[] = [
   {
     title: 'Beton',
     rows: [
       { name: 'Beton talpă fundație', qtyUnit: 'm³', optional: false, kind: 'beton-talpa', consLabel: 'V = L×l×h' },
       { name: 'Beton elevație / grinzi fundație', qtyUnit: 'm³', optional: false, kind: 'beton-elevatie', consLabel: 'V = L×l×h' },
     ],
   },
   {
     title: 'Cofraj (situațional)',
     rows: [
       { name: 'Cofraj elevație (2 fețe)', qtyUnit: 'm²', optional: true, kind: 'cofraj-elevatie', consLabel: 'A = L×h×2' },
       { name: 'Cofraj talpă (2 fețe)', qtyUnit: 'm²', optional: true, kind: 'cofraj-talpa', consLabel: 'A = L×h×2' },
     ],
   },
   {
     title: 'Armătură',
     rows: [
       { name: 'Oțel beton bare longitudinale talpă', qtyUnit: 'kg', optional: false, kind: 'armatura-long-talpa', consLabel: '4 bare × L (cu suprapuneri)' },
       { name: 'Oțel beton bare longitudinale elevație', qtyUnit: 'kg', optional: false, kind: 'armatura-long-elevatie', consLabel: '4 bare × L (cu suprapuneri)' },
       { name: 'Oțel beton etrieri elevație', qtyUnit: 'kg', optional: false, kind: 'armatura-etrieri-elevatie', consLabel: 'nr. etrieri × perimetru (cu suprapuneri)' },
       { name: 'Sârmă de legat (2% din armătură)', qtyUnit: 'kg', optional: true, kind: 'sarma-legat', consLabel: '2% din kg oțel' },
       { name: 'Distanțieri / consumabile (manual)', qtyUnit: 'lei', optional: true, kind: 'distantieri', consLabel: 'introdu manual' },
     ],
   },
 ]
 
 const defaultPrices: Record<string, number> = {
   'Beton talpă fundație': 420,
   'Beton elevație / grinzi fundație': 420,
   'Cofraj elevație (2 fețe)': 45,
   'Cofraj talpă (2 fețe)': 45,
   'Oțel beton bare longitudinale talpă': 4.8,
   'Oțel beton bare longitudinale elevație': 4.8,
   'Oțel beton etrieri elevație': 4.8,
   'Sârmă de legat (2% din armătură)': 7,
   'Distanțieri / consumabile (manual)': 0,
 }
 
 function n0(n: number) {
   return n.toLocaleString('ro-RO', { maximumFractionDigits: 0 })
 }
 
 function n2(n: number) {
   return n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 }
 
 function mmKey(d: number) {
   return `Ø${Math.round(d)}`
 }

export default function Page() {
   const [lengthM, setLengthM] = useState<number>(40)
   const [talpaWidthCm, setTalpaWidthCm] = useState<number>(60)
   const [talpaHeightCm, setTalpaHeightCm] = useState<number>(40)
   const [elevWidthCm, setElevWidthCm] = useState<number>(30)
   const [elevHeightCm, setElevHeightCm] = useState<number>(60)
   const [coverCm, setCoverCm] = useState<number>(5)
   const [lapPct, setLapPct] = useState<number>(5)
 
   const [diaLongTalpa, setDiaLongTalpa] = useState<DiaMm>(12)
   const [diaLongElev, setDiaLongElev] = useState<DiaMm>(12)
   const [diaStirr, setDiaStirr] = useState<DiaMm>(8)
   const [stirrSpacingCm, setStirrSpacingCm] = useState<number>(20)
 
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
         if (r.consLabel === 'introdu manual') init[r.name] = 0
       })
     })
     return init
   })
 
   const lapFactor = useMemo(() => 1 + Math.max(0, Number(lapPct) || 0) / 100, [lapPct])
 
   const { rowsComputed, totalReq, totalOpt, grand, grandVat, totalReqVat, volumeTalpaM3, volumeElevM3, steelKgTotal } = useMemo(() => {
     const vatRate = 0.21
 
     const L = Math.max(0, Number(lengthM) || 0)
     const talpaWm = Math.max(0, Number(talpaWidthCm) || 0) / 100
     const talpaHm = Math.max(0, Number(talpaHeightCm) || 0) / 100
     const elevWm = Math.max(0, Number(elevWidthCm) || 0) / 100
     const elevHm = Math.max(0, Number(elevHeightCm) || 0) / 100
     const coverM = Math.max(0, Number(coverCm) || 0) / 100
     const stirrStepM = Math.max(0.01, (Number(stirrSpacingCm) || 0) / 100)
 
     const vTalpa = L * talpaWm * talpaHm
     const vElev = L * elevWm * elevHm
 
     const barsTalpaCount = 4
     const barsElevCount = 4
 
     const longTalpaLenM = L * barsTalpaCount * lapFactor
     const longElevLenM = L * barsElevCount * lapFactor
 
     const stirrCount = elevHm > 0 && elevWm > 0 ? Math.ceil(L / stirrStepM) + 1 : 0
     const innerWm = Math.max(0, elevWm - 2 * coverM)
     const innerHm = Math.max(0, elevHm - 2 * coverM)
     const stirrPerimM = innerWm > 0 && innerHm > 0 ? 2 * innerWm + 2 * innerHm : 0
     const stirrLenM = stirrCount * stirrPerimM * lapFactor
 
     const steelLongTalpaKg = longTalpaLenM * (KG_PER_M[diaLongTalpa] ?? 0)
     const steelLongElevKg = longElevLenM * (KG_PER_M[diaLongElev] ?? 0)
     const steelStirrKg = stirrLenM * (KG_PER_M[diaStirr] ?? 0)
     const steelTotalKg = steelLongTalpaKg + steelLongElevKg + steelStirrKg
 
     let req = 0
     let opt = 0
 
     const computed = sections.flatMap(sec =>
       sec.rows.map(r => {
         const isIncluded = !r.optional || included[r.name] !== false
 
         let qty = 0
         if (r.kind === 'beton-talpa') qty = vTalpa
         else if (r.kind === 'beton-elevatie') qty = vElev
         else if (r.kind === 'cofraj-elevatie') qty = L * elevHm * 2
         else if (r.kind === 'cofraj-talpa') qty = L * talpaHm * 2
         else if (r.kind === 'armatura-long-talpa') qty = steelLongTalpaKg
         else if (r.kind === 'armatura-long-elevatie') qty = steelLongElevKg
         else if (r.kind === 'armatura-etrieri-elevatie') qty = steelStirrKg
         else if (r.kind === 'sarma-legat') qty = steelTotalKg * 0.02
         else if (r.kind === 'distantieri') qty = manualQty[r.name] ?? 0
 
         const p = prices[r.name] ?? 0
         const tot = qty * p
 
         if (qty !== 0 && isIncluded) {
           if (r.optional) opt += tot
           else req += tot
         }
 
         return { sectionTitle: sec.title, row: r, qty, price: p, tot, isIncluded }
       }),
     )
 
     const g = req + opt
     return {
       rowsComputed: computed,
       totalReq: req,
       totalOpt: opt,
       grand: g,
       grandVat: g * (1 + vatRate),
       totalReqVat: req * (1 + vatRate),
       volumeTalpaM3: vTalpa,
       volumeElevM3: vElev,
       steelKgTotal: steelTotalKg,
     }
   }, [
     coverCm,
     diaLongElev,
     diaLongTalpa,
     diaStirr,
     elevHeightCm,
     elevWidthCm,
     included,
     lapFactor,
     lengthM,
     manualQty,
     prices,
     stirrSpacingCm,
     talpaHeightCm,
     talpaWidthCm,
   ])
 
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
         .control .inline { display: flex; align-items: center; gap: 10px; width: 100%; }
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
         td.mat { font-size: 13px; color: #1a1a18; max-width: 330px; }
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
         @media (max-width: 900px) {
           .control { grid-column: span 6; }
           .control.wide { grid-column: span 12; }
           .summary { grid-template-columns: 1fr 1fr; }
           td.mat { max-width: 220px; }
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
         <h1>Calculator materiale — beton și armătură fundație (estimare)</h1>
         <div style={{ color: '#6B6860', fontSize: 13, marginBottom: 12 }}>
           Toate prețurile sunt fără TVA.
         </div>
 
         <div className="controls">
           <div className="control">
             <label>Lungime fundație</label>
             <div className="inline">
               <input type="number" min={0} step={1} value={Number.isFinite(lengthM) ? lengthM : 0} onChange={e => setLengthM(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">m</span>
             </div>
           </div>
 
           <div className="control">
             <label>Lățime talpă</label>
             <div className="inline">
               <input type="number" min={0} step={1} value={Number.isFinite(talpaWidthCm) ? talpaWidthCm : 0} onChange={e => setTalpaWidthCm(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">cm</span>
             </div>
           </div>
 
           <div className="control">
             <label>Înălțime talpă</label>
             <div className="inline">
               <input type="number" min={0} step={1} value={Number.isFinite(talpaHeightCm) ? talpaHeightCm : 0} onChange={e => setTalpaHeightCm(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">cm</span>
             </div>
           </div>
 
           <div className="control">
             <label>Lățime elevație</label>
             <div className="inline">
               <input type="number" min={0} step={1} value={Number.isFinite(elevWidthCm) ? elevWidthCm : 0} onChange={e => setElevWidthCm(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">cm</span>
             </div>
           </div>
 
           <div className="control">
             <label>Înălțime elevație</label>
             <div className="inline">
               <input type="number" min={0} step={1} value={Number.isFinite(elevHeightCm) ? elevHeightCm : 0} onChange={e => setElevHeightCm(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">cm</span>
             </div>
           </div>
 
           <div className="control">
             <label>Acoperire</label>
             <div className="inline">
               <input type="number" min={0} step={0.5} value={Number.isFinite(coverCm) ? coverCm : 0} onChange={e => setCoverCm(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">cm</span>
             </div>
           </div>
 
           <div className="control">
             <label>Suprapuneri</label>
             <div className="inline">
               <input type="number" min={0} step={1} value={Number.isFinite(lapPct) ? lapPct : 0} onChange={e => setLapPct(Math.max(0, Number(e.target.value) || 0))} />
               <span className="unit">%</span>
             </div>
           </div>
 
           <div className="control">
             <label>Ø long. talpă</label>
             <select value={diaLongTalpa} onChange={e => setDiaLongTalpa((Number(e.target.value) as DiaMm) || diaLongTalpa)}>
               {DIA_OPTIONS.map(d => <option key={d} value={d}>{mmKey(d)} ({n2(KG_PER_M[d])} kg/m)</option>)}
             </select>
           </div>
 
           <div className="control">
             <label>Ø long. elevație</label>
             <select value={diaLongElev} onChange={e => setDiaLongElev((Number(e.target.value) as DiaMm) || diaLongElev)}>
               {DIA_OPTIONS.map(d => <option key={d} value={d}>{mmKey(d)} ({n2(KG_PER_M[d])} kg/m)</option>)}
             </select>
           </div>
 
           <div className="control">
             <label>Ø etrieri</label>
             <select value={diaStirr} onChange={e => setDiaStirr((Number(e.target.value) as DiaMm) || diaStirr)}>
               {DIA_OPTIONS.map(d => <option key={d} value={d}>{mmKey(d)} ({n2(KG_PER_M[d])} kg/m)</option>)}
             </select>
           </div>
 
           <div className="control wide">
             <div className="inline">
               <label style={{ minWidth: 100 }}>Pas etrieri</label>
               <input type="number" min={5} step={1} value={Number.isFinite(stirrSpacingCm) ? stirrSpacingCm : 0} onChange={e => setStirrSpacingCm(Math.max(5, Number(e.target.value) || 0))} style={{ width: 120 }} />
               <span className="unit">cm</span>
             </div>
             <span className="note">Prețuri în RON (fără TVA)</span>
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
                   const qty = item?.qty ?? 0
                   const p = item?.price ?? 0
                   const tot = item?.tot ?? 0
                   const isIncluded = item?.isIncluded ?? true
 
                   const isManual = r.consLabel === 'introdu manual'
                   const hasQty = qty !== 0
                   const qtyStr = isManual ? '' : (hasQty ? n2(qty) : '—')
                   const totStr = hasQty ? `${n2(tot)} lei` : '—'
 
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
                       <td className="cons">{r.consLabel}</td>
                       <td className="qty">
                         {isManual ? (
                           <>
                             <input
                               type="number"
                               min={0}
                               step={1}
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
                             <span style={{ marginLeft: 6, fontWeight: 400, color: '#5f5e5a' }}>{r.qtyUnit}</span>
                           </>
                         ) : (
                           <>
                             {qtyStr}{hasQty ? ` ${r.qtyUnit}` : ''}
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
             <div className="lbl">Obligatoriu / m</div>
             <div className="val">{lengthM > 0 ? n2(totalReq / lengthM) : n2(0)} lei</div>
             <div className="sub">fără opționale</div>
           </div>
           <div className="metric">
             <div className="lbl">Obligatoriu / total</div>
             <div className="val">{n2(totalReq)} lei</div>
             <div className="sub">{n2(lengthM)} m</div>
           </div>
           <div className="metric vat-total">
             <div className="lbl">Obligatoriu cu TVA (21%) / total</div>
             <div className="val">{n2(totalReqVat)} lei</div>
             <div className="sub">{n2(lengthM)} m</div>
           </div>
           <div className="metric">
             <div className="lbl">Cu opționale / m</div>
             <div className="val">{lengthM > 0 ? n2(grand / lengthM) : n2(0)} lei</div>
             <div className="sub">toate materialele</div>
           </div>
           <div className="metric">
             <div className="lbl">Cu opționale / total</div>
             <div className="val">{n2(grand)} lei</div>
             <div className="sub">{n2(lengthM)} m</div>
           </div>
           <div className="metric">
             <div className="lbl">Total cu TVA (21%) / m</div>
             <div className="val">{lengthM > 0 ? n2(grandVat / lengthM) : n2(0)} lei</div>
             <div className="sub">incl. TVA 21%</div>
           </div>
           <div className="metric vat-total">
             <div className="lbl">Total cu TVA (21%) / total</div>
             <div className="val">{n2(grandVat)} lei</div>
             <div className="sub">{n2(lengthM)} m</div>
           </div>
           <div className="metric">
             <div className="lbl">Cantități cheie</div>
             <div className="val">{n2(volumeTalpaM3 + volumeElevM3)} m³</div>
             <div className="sub">{n2(steelKgTotal)} kg oțel</div>
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
