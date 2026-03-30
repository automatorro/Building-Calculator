'use client'
import Link from 'next/link'

export default function Page() {
  const cards = [
    { title: 'Calculator necesar polistiren (EPS)', href: '/calculatoare-rapide/eps', subtitle: 'Termosistem EPS — materiale și cost estimativ' },
    { title: 'Calculator necesar vată minerală', href: '/calculatoare-rapide/vata-minerala', subtitle: 'Termosistem vată minerală — materiale și cost estimativ' },
    { title: 'Calculator necesar BCA', href: '/calculatoare-rapide/bca', subtitle: 'Zidărie BCA — în curând' },
    { title: 'Calculator necesar cărămidă cu goluri', href: '/calculatoare-rapide/caramida-goluri', subtitle: 'Zidărie cărămidă — în curând' },
    { title: 'Calculator tencuială', href: '/calculatoare-rapide/tencuiala', subtitle: 'Tencuieli — în curând' },
    { title: 'Calculator beton și armătură fundație', href: '/calculatoare-rapide/beton-armatura-fundatie', subtitle: 'Beton & oțel — în curând' },
  ]

  return (
    <main style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-dm-serif, serif)',
        fontSize: 36, letterSpacing: '-0.02em', color: '#1E2329', marginBottom: 8,
      }}>
        Calculatoare rapide
      </h1>
      <p style={{ color: '#6B6860', fontSize: 16, marginBottom: 28 }}>
        Colecție de calculatoare simple pentru șantier. Fără cont, fără date salvate.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
        gap: 16,
      }}>
        {cards.map(c => (
          <Link key={c.href} href={c.href} style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            border: '1px solid var(--gray-200)',
            borderRadius: 12,
            background: 'var(--white)',
            transition: 'transform .06s ease, box-shadow .12s ease, border-color .12s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(14,16,19,0.08)'
            e.currentTarget.style.borderColor = 'var(--gray-300)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = 'var(--gray-200)'
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#1E2329', letterSpacing: '-0.01em' }}>
                {c.title}
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: '#6B6860' }}>
                {c.subtitle}
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#F2F1EF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#E8500A', fontWeight: 700, fontSize: 16,
            }}>
              →
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
