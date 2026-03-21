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

  // Preia normele din catalog_norms
  const { data: norms, error: normsError } = await supabase
    .from('catalog_norms')
    .select('id, symbol, name, unit, category, unit_price')
    .eq('is_active', true)
    .order('category')
    .order('symbol')

  // Extrage categoriile unice
  const categories = [...new Set(norms?.map(n => n.category) || [])].sort()

  // Extrage prefixele normativelor unice (primele litere din symbol, fără cifre)
  const normativePrefixes = [...new Set(
    norms?.map(n => n.symbol.replace(/[0-9%]/g, '').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')) || []
  )].filter(Boolean).sort()

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="page-title text-4xl mb-3">
          Catalog de Norme & Devize
        </h1>
        <p style={{ color: '#6B6860', maxWidth: 560, lineHeight: 1.6, fontWeight: 300 }}>
          Explorează baza de date de norme tehnice pentru construcții.
          Alege o normă pentru a o adăuga direct în devizul proiectului.
        </p>
      </header>

      {normsError && (
        <div style={{ background: '#FCECEA', border: '1px solid #C0392B22', color: '#C0392B',
          padding: '12px 18px', borderRadius: 10, marginBottom: 24, fontSize: 14 }}>
          <strong>Eroare la conectarea cu baza de date:</strong>{' '}
          {normsError.message}
          {normsError.message.includes('does not exist') && (
            <span> — Rulează fișierul <code>supabase/migrations/001_catalog_norms_seed.sql</code> în Supabase Dashboard → SQL Editor.</span>
          )}
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
              {categories.map((cat) => (
                <li key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: '#6B6860' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8500A', flexShrink: 0 }} />
                  {cat}
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
              {normativePrefixes.map((prefix) => (
                <span key={prefix} style={{
                  padding: '3px 8px', background: '#FFF0E8',
                  border: '1px solid #E8500A33', borderRadius: 5,
                  fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#E8500A',
                }}>
                  {prefix}
                </span>
              ))}
            </div>
          </section>

          <section className="glass-card p-5">
            <p style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.6 }}>
              <strong style={{ color: '#1E2329' }}>{norms?.length ?? 0}</strong> norme disponibile
            </p>
          </section>
        </div>

        <CatalogFilter initialNorms={(norms as any) || []} projectId={projectId} />
      </div>
    </main>
  )
}
