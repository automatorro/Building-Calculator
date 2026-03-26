// app/catalog/page.tsx
import { createClient } from '@/utils/supabase/server'
import CatalogFilter from '@/components/CatalogFilter'

export const dynamic = 'force-dynamic'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const projectId =
    typeof resolvedParams.projectId === 'string' ? resolvedParams.projectId : null

  const { data: norms, error: normsError } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price')
    .eq('is_active', true)
    .order('category')
    .order('symbol')
    .limit(2000)

  const categories = [...new Set(norms?.map((n) => n.category) || [])].sort()

  const normativePrefixes = [
    ...new Set(
      norms
        ?.map((n) => {
          const match = n.symbol.match(/^[A-Za-z]+/)
          return match ? match[0].substring(0, 4).toUpperCase() : null
        })
        .filter(Boolean) || []
    ),
  ].sort()

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
          Catalog de Norme & Devize
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          {norms?.length.toLocaleString('ro-RO') || '0'} norme tehnice pentru
          construcții. Alege o normă pentru a o adăuga în devizul proiectului.
        </p>
      </header>

      {normsError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
          <p className="font-bold">Eroare la conectarea cu baza de date:</p>
          <p>{normsError.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">
              Categorii
            </h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300 capitalize"
                >
                  <span className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
                  {cat}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">
              Indicatoare
            </h2>
            <div className="flex flex-wrap gap-2">
              {normativePrefixes.slice(0, 30).map((prefix) => (
                <span
                  key={prefix}
                  className="px-2 py-1 bg-primary/5 text-primary border border-primary/20 rounded text-xs font-mono font-bold"
                >
                  {prefix}
                </span>
              ))}
              {normativePrefixes.length > 30 && (
                <span className="text-xs text-slate-400 self-center">
                  +{normativePrefixes.length - 30} altele
                </span>
              )}
            </div>
          </section>
        </div>

        <CatalogFilter
          initialNorms={(norms as any) || []}
          projectId={projectId}
        />
      </div>
    </main>
  )
}
