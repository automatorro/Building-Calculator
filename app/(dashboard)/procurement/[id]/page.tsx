import Link from 'next/link'
import { Package } from 'lucide-react'

export default async function ProcurementPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 24 }}>
      <div style={{ width: 64, height: 64, background: '#F3F2EF', borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Package size={32} color="#A8A59E" />
      </div>
      <div>
        <h2 style={{ fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
          fontSize: 24, fontWeight: 400, color: '#1E2329', marginBottom: 8 }}>
          Materiale & Achiziții — Mutat
        </h2>
        <p style={{ fontSize: 14, color: '#6B6860', maxWidth: 360, lineHeight: 1.6 }}>
          Registrul de achiziții este integrat direct în fiecare proiect, tab-ul <strong>Achiziții</strong>.
        </p>
      </div>
      <Link href={`/projects/${id}?tab=purchases`}
        style={{ padding: '10px 24px', background: '#E8500A', color: 'white',
          borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
        Mergi la Achiziții →
      </Link>
    </div>
  )
}
