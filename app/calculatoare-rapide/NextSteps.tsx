import Link from 'next/link'

const calculators = [
  { id: 'fundatie', title: 'Fundație', href: '/calculatoare-rapide/beton-armatura-fundatie' },
  { id: 'bca', title: 'Zidărie BCA', href: '/calculatoare-rapide/bca' },
  { id: 'caramida', title: 'Zidărie Cărămidă', href: '/calculatoare-rapide/caramida-goluri' },
  { id: 'acoperis', title: 'Acoperiș', href: '/calculatoare-rapide/acoperis' },
  { id: 'eps', title: 'Termosistem EPS', href: '/calculatoare-rapide/eps' },
  { id: 'vata', title: 'Termosistem Vată', href: '/calculatoare-rapide/vata-minerala' },
  { id: 'tencuiala', title: 'Tencuială', href: '/calculatoare-rapide/tencuiala' },
  { id: 'sapa', title: 'Șapă', href: '/calculatoare-rapide/sapa' },
  { id: 'finisaje', title: 'Finisaje Interioare', href: '/calculatoare-rapide/finisaje-interioare' },
]

export default function NextSteps({ currentId }: { currentId: string }) {
  const currentIndex = calculators.findIndex(c => c.id === currentId)
  
  // Try to suggest logically related next steps.
  // We ordered the array roughly in the order of construction: fundatie -> zidarie -> acoperis -> termosistem -> tencuiala -> sapa -> finisaje.
  // So taking the next 3 elements is a very good heuristic.
  const next3 = []
  if (currentIndex !== -1) {
    for (let i = 1; i <= 3; i++) {
      const idx = (currentIndex + i) % calculators.length
      if (calculators[idx].id !== currentId) {
        next3.push(calculators[idx])
      }
    }
  }

  if (next3.length === 0) return null

  return (
    <div style={{ marginTop: '2rem', padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px solid var(--gray-200)', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a18', marginBottom: '16px' }}>Ce urmează să construiești?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {next3.map(c => (
          <Link key={c.id} href={c.href} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px', 
            background: '#f9f8f5', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            color: '#1a1a18',
            fontSize: '15px',
            fontWeight: 500,
            border: '1px solid #e8e7e2',
            transition: 'background 0.2s'
          }}>
            {c.title}
            <span style={{ color: '#e28b30', fontWeight: 'bold' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
