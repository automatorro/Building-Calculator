import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <Link href="/calculatoare-rapide" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'none',
        color: '#6B6860',
        border: '1px solid var(--gray-200)',
        padding: '8px 12px',
        borderRadius: 10,
        background: 'var(--white)',
        marginBottom: 14,
      }}>
        ← Înapoi
      </Link>
      <h1 style={{ fontFamily: 'var(--font-dm-serif, serif)', fontSize: 32, letterSpacing: '-0.02em', color: '#1E2329', marginBottom: 8 }}>
        Calculator beton și armătură fundație
      </h1>
      <div style={{ color: '#6B6860', fontSize: 14, marginBottom: 10 }}>
        Toate prețurile sunt fără TVA.
      </div>
      <p style={{ color: '#6B6860', marginBottom: 20 }}>În curând — lucrăm la acest calculator.</p>
      <div style={{
        border: '1px dashed var(--gray-300)',
        borderRadius: 12, padding: 24, background: '#FAFAF8',
        color: '#6B6860', fontSize: 14,
      }}>
        Volum beton, cofraj și greutăți oțel pe diametre, în funcție de dimensiuni.
      </div>
    </main>
  )
}
