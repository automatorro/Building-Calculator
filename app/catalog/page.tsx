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
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.trim() : ''
  const cat = typeof resolvedParams.cat === 'string' ? resolvedParams.cat : ''

  // Statistici pentru landing (fără să încarci toate normele)
  const { data: statsData } = await supabase
    .from('catalog_norms')
    .select('category')
    .eq('is_active', true)

  const totalNorms = statsData?.length || 0
  const categories = [...new Set(statsData?.map((n) => n.category) || [])].sort()

  // Norme: doar dacă există search sau filtru categorie
  let norms: any[] = []
  let searchError = null

  if (q.length >= 2 || cat) {
    let query = supabase
      .from('catalog_norms')
      .select('id, symbol, name, unit, category, unit_price')
      .eq('is_active', true)

    if (cat) {
      query = query.eq('category', cat)
    }

    if (q.length >= 2) {
      query = query.or(
        `name.ilike.%${q}%,symbol.ilike.%${q}%`
      )
    }

    const { data, error } = await query
      .order('category')
      .order('symbol')
      .limit(200)

    norms = data || []
    searchError = error
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
          Catalog de Norme & Devize
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          {totalNorms.toLocaleString('ro-RO')} norme tehnice pentru construcții.
          Caută o normă pentru a o adăuga în devizul proiectului.
        </p>
      </header>

      {searchError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
          <p className="font-bold">Eroare:</p>
          <p>{searchError.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar categorii */}
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">
              Categorii
            </h2>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c}>
                  <a
                    href={`/catalog?cat=${encodeURIComponent(c)}${projectId ? `&projectId=${projectId}` : ''}`}
                    className={`flex items-center gap-2 text-sm py-1 px-2 rounded transition-colors capitalize
                      ${cat === c
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
                    {c}
                  </a>
                </li>
              ))}
              {cat && (
                <li>
                  <a
                    href={`/catalog${projectId ? `?projectId=${projectId}` : ''}`}
                    className="flex items-center gap-2 text-xs py-1 px-2 text-slate-400 hover:text-primary transition-colors"
                  >
                    ✕ Șterge filtrul
                  </a>
                </li>
              )}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-3 border-b border-border pb-2">
              Statistici
            </h2>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Total norme</span>
                <span className="font-bold text-primary">
                  {totalNorms.toLocaleString('ro-RO')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Categorii</span>
                <span className="font-bold">{categories.length}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Filtru și rezultate */}
        <CatalogFilter
          initialNorms={norms}
          projectId={projectId}
          initialSearch={q}
          initialCategory={cat}
          totalCount={totalNorms}
        />
      </div>
    </main>
  )
}
