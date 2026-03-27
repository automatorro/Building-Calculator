// app/catalog/item/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Box } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface NormComponent {
  id: number
  name: string
  specification: string | null
  unit: string
  qty_per_unit: number
  unit_price: number
  component_type: 'material' | 'manopera' | 'transport' | 'utilaj' | 'taxa'
  is_optional: boolean
  optional_note: string | null
  can_substitute: boolean
  substitute_note: string | null
  sort_order: number
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  material:  { label: 'Material',  color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  manopera:  { label: 'Manoperă',  color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  transport: { label: 'Transport', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  utilaj:    { label: 'Utilaj',    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  taxa:      { label: 'Taxă',      color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20' },
}

export default async function CatalogItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ projectId?: string }>
}) {
  const { id } = await params
  const { projectId } = await searchParams
  const supabase = await createClient()

  const normId = parseInt(id, 10)
  if (isNaN(normId)) return notFound()

  const { data: norm, error: normError } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price, has_components, description')
    .eq('id', normId)
    .single()

  if (normError || !norm) return notFound()

  let components: NormComponent[] = []
  if (norm.has_components) {
    const { data: comps } = await supabase
      .from('norm_components')
      .select('id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, optional_note, can_substitute, substitute_note, sort_order')
      .eq('norm_id', normId)
      .order('component_type')
      .order('is_optional')
      .order('sort_order')
    components = (comps as NormComponent[]) || []
  }

  const required = components.filter((c) => !c.is_optional)
  const optional = components.filter((c) => c.is_optional)
  const totalRequired = required.reduce((s, c) => s + c.qty_per_unit * c.unit_price, 0)
  const totalOptional = optional.reduce((s, c) => s + c.qty_per_unit * c.unit_price, 0)

  const byType = components.reduce<Record<string, number>>((acc, c) => {
    acc[c.component_type] = (acc[c.component_type] || 0) + c.qty_per_unit * c.unit_price
    return acc
  }, {})

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <a
        href={`/catalog${projectId ? `?projectId=${projectId}` : ''}`}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Înapoi la Catalog
      </a>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-primary text-white text-sm font-mono font-bold rounded">
            {norm.symbol}
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded capitalize font-medium">
            {norm.category}
          </span>
          {norm.has_components && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
              ✓ Compus cu articole
            </span>
          )}
        </div>
        <h1 className="text-xl md:text-3xl font-bold mb-3 leading-snug">{norm.name}</h1>
        {norm.description && (
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-3xl">{norm.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Unitate de măsură:</span>
            <span className="font-semibold">{norm.unit}</span>
          </div>
          {norm.unit_price > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Preț referință:</span>
              <span className="font-semibold text-primary">
                {norm.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei/{norm.unit}
              </span>
              <span className="text-xs text-slate-400">(fără TVA)</span>
            </div>
          )}
        </div>
      </div>

      {/* Componente sau normă simplă */}
      {norm.has_components && components.length > 0 ? (
        <>
          {/* Sumar costuri */}
          <section className="glass-card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Structura costului per {norm.unit}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {Object.entries(byType).map(([type, val]) => {
                const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.material
                return (
                  <div key={type} className={`rounded-lg p-3 ${cfg.color}`}>
                    <div className="text-xs font-medium mb-1">{cfg.label}</div>
                    <p className="text-lg font-bold">
                      {val.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs opacity-70">lei/{norm.unit}</p>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-border pt-4 flex flex-wrap justify-between gap-4 text-sm">
              <div>
                <span className="text-slate-400">Total obligatoriu:</span>{' '}
                <span className="font-bold text-base">
                  {totalRequired.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei/{norm.unit}
                </span>
              </div>
              {totalOptional > 0 && (
                <div>
                  <span className="text-slate-400">+ opționale:</span>{' '}
                  <span className="font-semibold text-slate-500">
                    +{totalOptional.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Tabel componente */}
          <section className="glass-card overflow-hidden mb-8">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Articole componente ({components.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="text-left px-6 py-3">Articol</th>
                    <th className="text-center px-4 py-3">Tip</th>
                    <th className="text-right px-4 py-3">Cantitate</th>
                    <th className="text-right px-4 py-3">Preț unitar</th>
                    <th className="text-right px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...required, ...optional].map((comp) => {
                    const lineTotal = comp.qty_per_unit * comp.unit_price
                    const cfg = TYPE_CONFIG[comp.component_type] || TYPE_CONFIG.material
                    return (
                      <tr
                        key={comp.id}
                        className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 ${comp.is_optional ? 'opacity-60' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium leading-snug">
                            {comp.name}
                            {comp.is_optional && (
                              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                opțional
                              </span>
                            )}
                          </div>
                          {comp.specification && (
                            <div className="text-xs text-slate-400 mt-0.5">{comp.specification}</div>
                          )}
                          {comp.optional_note && (
                            <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                              ⓘ {comp.optional_note}
                            </div>
                          )}
                          {comp.can_substitute && comp.substitute_note && (
                            <div className="text-xs text-blue-500 mt-0.5">
                              ↔ {comp.substitute_note}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">
                          {comp.qty_per_unit.toLocaleString('ro-RO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}{' '}
                          <span className="text-slate-400 text-xs">{comp.unit}</span>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">
                          {comp.unit_price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}{' '}
                          <span className="text-slate-400 text-xs">lei</span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-semibold">
                          {lineTotal.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}{' '}
                          <span className="text-slate-400 text-xs font-normal">lei</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                    <td colSpan={4} className="px-6 py-3 text-right text-sm">
                      TOTAL per {norm.unit}:
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-primary">
                      {totalRequired.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="glass-card p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Box className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Normă simplă</h2>
              <p className="text-slate-500 text-sm max-w-lg">
                Această normă nu are articole componente detaliate.
                Prețul de referință de{' '}
                <strong>
                  {norm.unit_price > 0
                    ? `${norm.unit_price.toFixed(2)} lei/${norm.unit}`
                    : 'neconfigurat'}
                </strong>{' '}
                reprezintă costul estimativ total.
              </p>
            </div>
          </div>
        </section>
      )}

      {projectId && (
        <div className="flex gap-4">
          <a
            href={`/catalog?projectId=${projectId}`}
            className="px-6 py-3 border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            ← Înapoi la catalog
          </a>
          <a
            href={`/projects/${projectId}`}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Mergi la proiect →
          </a>
        </div>
      )}
    </main>
  )
}
