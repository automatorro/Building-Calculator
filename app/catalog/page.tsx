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
  const projectId = typeof resolvedParams.projectId === 'string' ? resolvedParams.projectId : null

  // Preia categoriile din Supabase
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Preia normativele
  const { data: normatives, error: normError } = await supabase
    .from('normatives')
    .select('*')
    .order('code')

  // Preia articolele (items) cu relatii
  const { data: items, error: itemError } = await supabase
    .from('items')
    .select(`
      id,
      code,
      name,
      um,
      user_id,
      categories (name),
      normatives (code)
    `)
    .order('name')

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
          Catalog de Norme & Devize
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Explorează baza de date de norme tehnice și resurse pentru construcții. 
          Alege un articol pentru a vedea detaliile de consum și preț.
        </p>
      </header>

      {(catError || normError || itemError) && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
          <p className="font-bold">Eroare la conectarea cu baza de date:</p>
          <p>{catError?.message || normError?.message || itemError?.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar cu Categorii & Normative */}
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Categorii</h2>
            <ul className="space-y-2">
              {categories?.map((cat) => (
                <li key={cat.id} className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-primary/40" />
                  {cat.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Indicatoare</h2>
            <div className="flex flex-wrap gap-2">
              {normatives?.map((norm) => (
                <span key={norm.id} className="px-2 py-1 bg-primary/5 text-primary border border-primary/20 rounded text-xs font-mono font-bold">
                  {norm.code}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Componenta de Filtrare si Lista de Articole */}
        <CatalogFilter initialItems={(items as any) || []} projectId={projectId} />
      </div>
    </main>
  )
}
