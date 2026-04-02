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

  let projectName: string | null = null
  if (projectId) {
    const { data } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single()
    projectName = data?.name ?? null
  }

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
      <header className="mb-5 md:mb-7">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
          Catalog de Norme & Devize
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
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
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <a
                  key={c}
                  href={`/catalog?cat=${encodeURIComponent(c)}${projectId ? `&projectId=${projectId}` : ''}#results`}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors capitalize ${
                    cat === c
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cat === c ? 'bg-primary' : 'bg-primary/40'}`} />
                  {c}
                </a>
              ))}
              {cat && (
                <a
                  href={`/catalog${projectId ? `?projectId=${projectId}` : ''}#results`}
                  className="inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
                >
                  ✕ Șterge filtrul
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Filtru și rezultate */}
        <CatalogFilter
          initialNorms={norms}
          projectId={projectId}
          projectName={projectName}
          initialSearch={q}
          initialCategory={cat}
          totalCount={totalNorms}
        />
      </div>
    </main>
  )
}
