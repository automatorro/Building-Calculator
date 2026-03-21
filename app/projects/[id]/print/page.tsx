import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { calculateLineCosts, EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import PrintButton from './PrintButton'

export const dynamic = 'force-dynamic'

export default async function PrintPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  /* Verifică autentificarea */
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) return notFound()

  const { data: rawLines } = await supabase
    .from('estimate_lines')
    .select(`*, items(*, normatives(code), resources(*))`)
    .eq('project_id', id)

  const lines: EstimateLine[] = (rawLines || []).map((line: any) => {
    const item = Array.isArray(line.items) ? line.items[0] : line.items
    const norm = item && Array.isArray(item.normatives) ? item.normatives[0] : item?.normatives
    return {
      ...line,
      items: item ? { ...item, normatives: norm || null, resources: item.resources || [] } : null,
    }
  })

  const settings: ProjectSettings = project.settings ?? {
    profit: 15, regie: 10, tva: 19, taxe_manopera: 0,
  }

  // Group by stage
  const grouped = new Map<string, EstimateLine[]>()
  lines.forEach(line => {
    const stage = line.stage_name || 'Alte Lucrări'
    if (!grouped.has(stage)) grouped.set(stage, [])
    grouped.get(stage)!.push(line)
  })

  // Compute totals
  let totalDirect = 0, totalRegie = 0, totalProfit = 0, totalTVA = 0, totalFinal = 0
  lines.forEach(line => {
    const c = calculateLineCosts(line, settings)
    totalDirect += c.totalDirectCost
    totalRegie  += c.regieAmount
    totalProfit += c.profitAmount
    totalTVA    += c.tvaAmount
    totalFinal  += c.totalWithTVA
  })

  const fmt = (n: number) => n.toLocaleString('ro-RO', { maximumFractionDigits: 2 })
  const today = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <>
      {/* Butoane acțiuni — se ascund la print */}
      <div className="no-print" style={{
        position: 'fixed', top: 16, right: 16, zIndex: 100,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <PrintButton />
        <a href={`/projects/${id}`} style={{
          padding: '10px 20px', background: '#F3F2EF',
          border: '1px solid #E5E3DE', borderRadius: 8,
          fontSize: 14, fontWeight: 500, color: '#6B6860',
          textDecoration: 'none', fontFamily: 'DM Sans, system-ui, sans-serif',
        }}>
          ← Înapoi la proiect
        </a>
      </div>

      <div style={{ fontFamily: 'DM Sans, sans-serif', color: '#1E2329', padding: '20mm', maxWidth: '210mm', margin: '0 auto', fontSize: 11 }}>

        {/* Antet */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '2px solid #1E2329', paddingBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 20, height: 20, background: '#E8500A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 10 }}>B</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Building<span style={{ color: '#E8500A' }}>Calc</span></span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{project.name}</div>
            {project.location && <div style={{ color: '#6B6860', fontSize: 11, marginTop: 2 }}>{project.location}</div>}
          </div>
          <div style={{ textAlign: 'right', color: '#6B6860', fontSize: 10 }}>
            <div style={{ fontWeight: 600, color: '#1E2329', fontSize: 12 }}>DEVIZ OFERTĂ</div>
            <div>Data: {today}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, marginTop: 4 }}># {id.slice(0, 8).toUpperCase()}</div>
          </div>
        </div>

        {/* Deviz Table */}
        {Array.from(grouped.entries()).map(([stage, stageLines], idx) => {
          const stageTotals = stageLines.reduce((acc, line) => {
            const c = calculateLineCosts(line, settings)
            return { direct: acc.direct + c.totalDirectCost, total: acc.total + c.totalWithTVA }
          }, { direct: 0, total: 0 })

          return (
            <div key={stage} style={{ marginBottom: 16, pageBreakInside: 'avoid' }}>
              <div style={{ background: '#1E2329', color: '#fff', padding: '6px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                <span>{idx + 1}. {stage}</span>
                <span>{fmt(stageTotals.total)} Lei</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 4 }}>
                <thead>
                  <tr style={{ background: '#F3F2EF', borderBottom: '1px solid #E5E3DE' }}>
                    {['Cod', 'Denumire Lucrare', 'UM', 'Cant.', 'Cost unit. (Lei)', 'Total + TVA (Lei)'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', fontSize: 9, fontWeight: 600, color: '#6B6860', textAlign: h.includes('Total') || h.includes('Cost') || h.includes('Cant') ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stageLines.map((line, i) => {
                    const c = calculateLineCosts(line, settings)
                    const name = line.manual_name || line.items?.name || '—'
                    const um   = line.manual_um   || line.items?.um   || '—'
                    const code = line.items?.normatives?.code || line.items?.code || '—'
                    return (
                      <tr key={line.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8', borderBottom: '1px solid #E5E3DE' }}>
                        <td style={{ padding: '4px 8px', fontFamily: 'monospace', fontSize: 9, color: '#A8A59E' }}>{code}</td>
                        <td style={{ padding: '4px 8px', fontSize: 10 }}>{name}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: 9 }}>{um}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'monospace', fontSize: 9 }}>{line.quantity}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'monospace', fontSize: 9 }}>{fmt(c.unitDirectCost)}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#E8500A' }}>{fmt(c.totalWithTVA)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}

        {/* Recapitulație */}
        <div style={{ marginTop: 24, pageBreakInside: 'avoid', border: '1px solid #E5E3DE', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#1E2329', color: '#fff', padding: '8px 14px', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Recapitulație Deviz
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'Cost direct (materiale + manoperă)', value: totalDirect },
                { label: `Regie (${settings.regie}%)`, value: totalRegie },
                { label: `Profit (${settings.profit}%)`, value: totalProfit },
                { label: 'Total fără TVA', value: totalDirect + totalRegie + totalProfit, bold: true },
                { label: `TVA (${settings.tva}%)`, value: totalTVA },
              ].map(row => (
                <tr key={row.label} style={{ borderBottom: '1px solid #E5E3DE' }}>
                  <td style={{ padding: '6px 14px', fontSize: 10, fontWeight: row.bold ? 700 : 400, color: '#6B6860' }}>{row.label}</td>
                  <td style={{ padding: '6px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 10, fontWeight: row.bold ? 700 : 400 }}>{fmt(row.value)} Lei</td>
                </tr>
              ))}
              <tr style={{ background: '#FFF0E8' }}>
                <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#1E2329' }}>TOTAL GENERAL (incl. TVA)</td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color: '#E8500A' }}>{fmt(totalFinal)} Lei</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Semnături */}
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {['Beneficiar', 'Antreprenor'].map(role => (
            <div key={role}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#6B6860', marginBottom: 32 }}>{role}</div>
              <div style={{ borderTop: '1px solid #1E2329', paddingTop: 6, fontSize: 9, color: '#A8A59E' }}>Semnătură și ștampilă</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid #E5E3DE', paddingTop: 8, fontSize: 8, color: '#A8A59E', textAlign: 'center' }}>
          Document generat automat de BuildingCalc · {today}
        </div>
      </div>
    </>
  )
}
