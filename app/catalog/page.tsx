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
      <header className="mb-10">
        <h1 className="page-title text-4xl mb-3">
          Catalog de Norme & Devize
        </h1>
        <p style={{ color: '#6B6860', maxWidth: 560, lineHeight: 1.6, fontWeight: 300 }}>
          Explorează baza de date de norme tehnice și resurse pentru construcții.
          Alege un articol pentru a vedea detaliile de consum și preț.
        </p>
      </header>

      {(catError || normError || itemError) && (
        <div style={{ background: '#FCECEA', border: '1px solid #C0392B22', color: '#C0392B',
          padding: '12px 18px', borderRadius: 10, marginBottom: 24, fontSize: 14 }}>
          <strong>Eroare la conectarea cu baza de date:</strong>{' '}
          {catError?.message || normError?.message || itemError?.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <section className="glass-card p-5">
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1E2329',
              marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #E5E3DE' }}>
              Categorii
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories?.map((cat) => (
                <li key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: '#6B6860' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8500A', flexShrink: 0 }} />
                  {cat.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-5">
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1E2329',
              marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #E5E3DE' }}>
              Indicatoare
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {normatives?.map((norm) => (
                <span key={norm.id} style={{
                  padding: '3px 8px', background: '#FFF0E8',
                  border: '1px solid #E8500A33', borderRadius: 5,
                  fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#E8500A',
                }}>
                  {norm.code}
                </span>
              ))}
            </div>
          </section>
        </div>

        <CatalogFilter initialItems={(items as any) || []} projectId={projectId} />
      </div>
    </main>
  )
}
