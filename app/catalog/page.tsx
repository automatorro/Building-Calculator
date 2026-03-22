import { createClient } from '@/utils/supabase/server'
import CatalogFilter from '@/components/CatalogFilter'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const projectId =
    typeof resolvedParams.projectId === 'string' ? resolvedParams.projectId : null

  // ─── 1. Categorii distincte din catalog_norms (nu din tabela 'categories' veche) ───
  const { data: catRows } = await supabase
    .from('catalog_norms')
    .select('category')
    .eq('is_active', true)

  const categories: string[] = [
    ...new Set((catRows ?? []).map((r) => r.category as string)),
  ].sort()

  // ─── 2. Prima pagină de norme (50 articole) — restul se încarcă client-side ───
  const { data: initialNorms, count } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price', { count: 'exact' })
    .eq('is_active', true)
    .order('category')
    .order('symbol')
    .range(0, PAGE_SIZE - 1)

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
          Catalog de Norme Tehnice
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
          {count?.toLocaleString('ro-RO') ?? '—'} norme din{' '}
          {categories.length} categorii · Sursa: Deviz 360
        </p>
      </header>

      <CatalogFilter
        initialNorms={initialNorms ?? []}
        categories={categories}
        totalCount={count ?? 0}
        pageSize={PAGE_SIZE}
        projectId={projectId}
      />
    </main>
  )
}
