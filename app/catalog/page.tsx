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
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="page-title mb-3" style={{ fontSize: 36 }}>
          Catalog de Norme & Devize
        </h1>
        <p style={{ color: '#6B6860', maxWidth: 560, lineHeight: 1.6, fontWeight: 300, fontSize: 15 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 0, background: 'white',
        border: '1px solid #E5E3DE', borderRadius: 14, overflow: 'hidden' }}
        className="block lg:grid">

        {/* Sidebar */}
        <div style={{ borderRight: '1px solid #E5E3DE', background: '#FAFAF8', padding: '24px 20px' }}
          className="space-y-5">

          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E',
              marginBottom: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Categorii
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categories.map((cat) => (
                <li key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: '#6B6860', padding: '5px 8px', borderRadius: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8500A', flexShrink: 0 }} />
                  {cat}
                </li>
              ))}
            </ul>
          </section>

          <div style={{ height: 1, background: '#E5E3DE' }} />

          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E',
              marginBottom: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Indicatoare
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {normativePrefixes.map((prefix) => (
                <span key={prefix} style={{
                  padding: '4px 9px', background: '#FFF0E8',
                  border: '1px solid #E8500A33', borderRadius: 6,
                  fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#E8500A',
                }}>
                  {prefix}
                </span>
              ))}
            </div>
          </section>

          <div style={{ height: 1, background: '#E5E3DE' }} />

          <p style={{ fontSize: 13, color: '#A8A59E', lineHeight: 1.6 }}>
            <strong style={{ color: '#1E2329', fontSize: 18, fontWeight: 700 }}>{norms?.length ?? 0}</strong>
            {' '}norme disponibile
          </p>
        </div>

        {/* Conținut principal */}
        <div style={{ padding: '24px' }}>
          <CatalogFilter initialNorms={(norms as any) || []} projectId={projectId} />
        </div>
      </div>
    </main>
  )
}
