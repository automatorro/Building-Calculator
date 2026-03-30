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
    <main className="calc-quick-page" style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .calc-quick-grid { display: grid; gap: 16px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .calc-quick-card-text { min-width: 0; }
        .calc-quick-card-title { word-break: break-word; }
        @media (min-width: 860px) {
          .calc-quick-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 600px) {
          .calc-quick-page { padding: 24px 14px !important; }
          .calc-quick-title { font-size: 28px !important; }
          .calc-quick-desc { font-size: 15px !important; margin-bottom: 18px !important; }
          .calc-quick-card { padding: 14px !important; align-items: flex-start !important; gap: 12px !important; }
          .calc-quick-card-title { font-size: 16px !important; }
          .calc-quick-card-subtitle { font-size: 13px !important; }
          .calc-quick-card-arrow { width: 32px !important; height: 32px !important; border-radius: 10px !important; flex-shrink: 0 !important; }
        }
      `}</style>

      <h1 className="calc-quick-title" style={{
        fontFamily: 'var(--font-dm-serif, serif)',
        fontSize: 36, letterSpacing: '-0.02em', color: '#1E2329', marginBottom: 8,
      }}>
        Calculatoare rapide
      </h1>
      <p className="calc-quick-desc" style={{ color: '#6B6860', fontSize: 16, marginBottom: 28 }}>
        Colecție de calculatoare simple pentru șantier. Fără cont, fără date salvate.
      </p>

      <div className="calc-quick-grid">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="calc-quick-card" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
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
            <div className="calc-quick-card-text">
              <div className="calc-quick-card-title" style={{ fontSize: 18, fontWeight: 600, color: '#1E2329', letterSpacing: '-0.01em' }}>
                {c.title}
              </div>
              <div className="calc-quick-card-subtitle" style={{ marginTop: 6, fontSize: 14, color: '#6B6860' }}>
                {c.subtitle}
              </div>
            </div>
            <div className="calc-quick-card-arrow" style={{
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
