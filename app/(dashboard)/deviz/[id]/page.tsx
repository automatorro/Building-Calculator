import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { calculateLineCosts, EstimateLine, ProjectSettings } from '@/utils/calculators/estimate'
import Link from 'next/link'
import { ListTree, FileText, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DevizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Handle /deviz/current → redirect to user's most recent project
  if (id === 'current') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login?redirect=/projects')

    const { data: latest } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    redirect(latest ? `/deviz/${latest.id}` : '/projects')
  }

  // Load project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) return notFound()

  // Load estimate lines with resources
  const { data: rawLines } = await supabase
    .from('estimate_lines')
    .select('*, items(*, resources(*), normatives(code))')
    .eq('project_id', id)

  // Normalize to EstimateLine shape (handle array vs object Supabase quirk)
  const lines: EstimateLine[] = (rawLines || []).map((line: any) => {
    const item = Array.isArray(line.items) ? line.items[0] : line.items
    return {
      ...line,
      items: item
        ? {
            ...item,
            resources: item.resources || [],
            normatives:
              (Array.isArray(item.normatives) ? item.normatives[0] : item.normatives) ??
              null,
          }
        : null,
    }
  })

  const settings: ProjectSettings = project.settings ?? {
    profit: 15,
    regie: 10,
    tva: 19,
    taxe_manopera: 0,
  }

  // Group lines by stage_name, accumulate costs
  type StageEntry = {
    name: string
    totalDirect: number
    totalOfertat: number
    totalWithTVA: number
    rows: { name: string; unit: string; quantity: number; totalOfertat: number }[]
  }

  const stageMap: Record<string, StageEntry> = {}

  lines.forEach((line) => {
    const stage = line.stage_name || 'Diverse'
    if (!stageMap[stage]) {
      stageMap[stage] = { name: stage, totalDirect: 0, totalOfertat: 0, totalWithTVA: 0, rows: [] }
    }
    const costs = calculateLineCosts(line, settings)
    stageMap[stage].totalDirect  += costs.totalDirectCost
    stageMap[stage].totalOfertat += costs.totalOfertatWithoutTVA
    stageMap[stage].totalWithTVA += costs.totalWithTVA
    stageMap[stage].rows.push({
      name:         line.manual_name ?? line.items?.name ?? 'Articol',
      unit:         line.manual_um   ?? line.items?.um   ?? 'buc',
      quantity:     line.quantity,
      totalOfertat: costs.totalOfertatWithoutTVA,
    })
  })

  const stages       = Object.values(stageMap)
  const grandDirect  = stages.reduce((s, st) => s + st.totalDirect,  0)
  const grandOfertat = stages.reduce((s, st) => s + st.totalOfertat, 0)
  const grandWithTVA = stages.reduce((s, st) => s + st.totalWithTVA, 0)
  const grandTVA     = grandWithTVA - grandOfertat
  const regieAmt     = grandDirect * (settings.regie  / 100)
  const profitAmt    = (grandDirect + regieAmt) * (settings.profit / 100)

  const fmt = (n: number) =>
    n.toLocaleString('ro-RO', { maximumFractionDigits: 0 })

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href={`/projects/${id}`}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-2"
          >
            <ArrowLeft size={12} /> {project.name}
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ListTree className="w-7 h-7 text-blue-600" />
            Deviz Detaliat pe Etape
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Coeficienți aplicați: profit {settings.profit}% · regie {settings.regie}% · TVA {settings.tva}%
          </p>
        </div>
        <Link
          href={`/projects/${id}/print`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <FileText size={16} />
          Export PDF
        </Link>
      </div>

      {lines.length === 0 ? (
        <div className="glass-card p-12 text-center border border-slate-200">
          <p className="text-slate-400 text-sm mb-4">
            Niciun articol de deviz. Adaugă lucrări în Planificare.
          </p>
          <Link href={`/projects/${id}`} className="text-blue-600 font-medium hover:underline text-sm">
            → Deschide Planificarea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stages accordion (HTML details — no JS needed) */}
          <div className="lg:col-span-3 space-y-3">
            {stages.map((stage, idx) => (
              <details
                key={stage.name}
                className="glass-card overflow-hidden border border-slate-200"
                open={idx === 0}
              >
                <summary className="flex items-center justify-between p-5 bg-white/50 hover:bg-blue-50/50 cursor-pointer select-none list-none">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{stage.name}</h3>
                      <p className="text-xs text-slate-400">
                        {stage.rows.length} art. ·{' '}
                        {grandOfertat > 0
                          ? ((stage.totalOfertat / grandOfertat) * 100).toFixed(1)
                          : 0}
                        % din total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{fmt(stage.totalOfertat)} lei</div>
                    <div className="text-xs text-slate-400">fără TVA</div>
                  </div>
                </summary>

                <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Direct',         value: fmt(stage.totalDirect),  cls: 'text-slate-700' },
                      { label: 'Ofertat (f.TVA)', value: fmt(stage.totalOfertat), cls: 'text-blue-700' },
                      { label: 'Cu TVA',          value: fmt(stage.totalWithTVA), cls: 'text-slate-700' },
                    ].map(c => (
                      <div key={c.label} className="bg-white p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 mb-1">{c.label}</div>
                        <div className={`font-semibold text-sm ${c.cls}`}>{c.value} lei</div>
                      </div>
                    ))}
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-slate-200">
                        <th className="text-left pb-2 font-medium">Articol</th>
                        <th className="text-center pb-2 font-medium w-16">U.M.</th>
                        <th className="text-right pb-2 font-medium w-20">Cant.</th>
                        <th className="text-right pb-2 font-medium w-32">Ofertat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.rows.map((row, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-white/60">
                          <td className="py-2 text-slate-700 font-medium">{row.name}</td>
                          <td className="py-2 text-center text-slate-500">{row.unit}</td>
                          <td className="py-2 text-right font-mono text-slate-600">{row.quantity}</td>
                          <td className="py-2 text-right font-mono font-semibold text-slate-700">
                            {fmt(row.totalOfertat)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>

          {/* Summary sticky column */}
          <div>
            <div className="glass-card p-5 border-t-4 border-t-blue-500 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Recapitulație</h3>
              <div className="space-y-3 text-sm">
                <SumRow label="Cost direct"              value={`${fmt(grandDirect)} lei`} />
                <SumRow label={`Regie (${settings.regie}%)`}   value={`${fmt(regieAmt)} lei`} />
                <SumRow label={`Profit (${settings.profit}%)`} value={`${fmt(profitAmt)} lei`} />

                <div className="border-t border-slate-200 pt-3">
                  <SumRow label="Total fără TVA" value={`${fmt(grandOfertat)} lei`} bold />
                  <SumRow label={`TVA (${settings.tva}%)`} value={`${fmt(grandTVA)} lei`} muted />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-3">
                <div className="text-xs text-slate-400 mb-1">Total cu TVA</div>
                <div className="text-2xl font-bold text-slate-900">
                  {fmt(grandWithTVA)}{' '}
                  <span className="text-base font-normal text-slate-400">lei</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SumRow({
  label,
  value,
  bold,
  muted,
}: {
  label: string
  value: string
  bold?: boolean
  muted?: boolean
}) {
  return (
    <div className={`flex justify-between ${muted ? 'text-slate-400' : ''}`}>
      <span className={bold ? 'font-semibold text-slate-900' : 'text-slate-500'}>{label}</span>
      <span className={bold ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}>{value}</span>
    </div>
  )
}
