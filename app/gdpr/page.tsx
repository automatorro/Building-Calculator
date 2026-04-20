import Link from 'next/link'

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

export default function GdprPage() {
  return (
    <main style={{ background: '#FAFAF8', minHeight: '100vh', padding: '120px 32px 80px', fontFamily: sans }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#E8500A', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← Înapoi la prima pagină
        </Link>
        
        <h1 style={{ fontFamily: serif, fontSize: 48, color: '#1E2329', marginBottom: 24, letterSpacing: '-.02em' }}>
          GDPR
        </h1>
        
        <div style={{ fontSize: 16, color: '#374151', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 20 }}>
            Conform Regulamentului General privind Protecția Datelor (GDPR), avem obligația de a gestiona în condiții de siguranță și numai pentru scopurile specificate datele dumneavoastră cu caracter personal.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            Drepturile dumneavoastră
          </h2>
          <p style={{ marginBottom: 20 }}>
            În calitate de utilizator al Șantier.app, beneficiați de următoarele drepturi conform GDPR:
          </p>
          <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
            <li style={{ marginBottom: 12 }}><strong>Dreptul de acces:</strong> Puteți solicita o copie a datelor pe care le deținem despre dumneavoastră.</li>
            <li style={{ marginBottom: 12 }}><strong>Dreptul la rectificare:</strong> Puteți solicita corectarea oricăror date inexacte.</li>
            <li style={{ marginBottom: 12 }}><strong>Dreptul la ștergere ("dreptul de a fi uitat"):</strong> Puteți solicita ștergerea contului și a datelor asociate.</li>
            <li style={{ marginBottom: 12 }}><strong>Dreptul la portabilitatea datelor:</strong> Puteți solicita exportul datelor dumneavoastră într-un format structurat (Excel/PDF).</li>
            <li style={{ marginBottom: 12 }}><strong>Dreptul de opoziție:</strong> Vă puteți opune prelucrării datelor în scopuri de marketing.</li>
          </ul>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            Contact DPO
          </h2>
          <p style={{ marginBottom: 20 }}>
            Pentru orice solicitare legată de protecția datelor personale, ne puteți contacta la adresa de e-mail: <a href="mailto:office@santier.app" style={{ color: '#E8500A', textDecoration: 'none', fontWeight: 600 }}>office@santier.app</a>. Ne obligăm să răspundem la orice solicitare în termen de maximum 30 de zile.
          </p>
        </div>
      </div>
    </main>
  )
}
