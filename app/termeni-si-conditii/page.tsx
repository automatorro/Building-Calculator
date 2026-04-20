import Link from 'next/link'

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

export default function TermeniPage() {
  return (
    <main style={{ background: '#FAFAF8', minHeight: '100vh', padding: '120px 32px 80px', fontFamily: sans }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#E8500A', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← Înapoi la prima pagină
        </Link>
        
        <h1 style={{ fontFamily: serif, fontSize: 48, color: '#1E2329', marginBottom: 24, letterSpacing: '-.02em' }}>
          Termeni și condiții
        </h1>
        
        <div style={{ fontSize: 16, color: '#374151', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 20 }}>
            Ultima actualizare: 20 aprilie 2026
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            1. Acceptarea termenilor
          </h2>
          <p style={{ marginBottom: 20 }}>
            Prin accesarea și utilizarea aplicației Șantier.app, sunteți de acord să respectați acești termeni și condiții. Dacă nu sunteți de acord cu oricare parte a acestor termeni, vă rugăm să nu utilizați serviciile noastre.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            2. Descrierea serviciului
          </h2>
          <p style={{ marginBottom: 20 }}>
            Șantier.app oferă o platformă software pentru estimarea costurilor în construcții, generarea de devize și urmărirea cheltuielilor pe șantier. Serviciul este oferit "așa cum este", cu scopul de a facilita procesul de ofertare și management financiar pentru constructori.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            3. Responsabilitatea utilizatorului
          </h2>
          <p style={{ marginBottom: 20 }}>
            Sunteți responsabil pentru acuratețea datelor introduse în aplicație. Estimările generate sunt bazate pe input-ul utilizatorului și pe datele din catalogul nostru, însă decizia finală privind prețurile ofertate beneficiarilor revine exclusiv utilizatorului. Șantier.app nu își asumă răspunderea pentru pierderi financiare cauzate de erori de calcul sau omiterea unor articole de deviz.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            4. Proprietate intelectuală
          </h2>
          <p style={{ marginBottom: 20 }}>
            Toate materialele conținute în aplicație, inclusiv design-ul, codul sursă, logo-urile și catalogul de norme de deviz, sunt proprietatea Șantier.app și sunt protejate de legile dreptului de autor. Este interzisă copierea sau redistribuirea acestora fără acord scris.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            5. Modificări ale serviciului
          </h2>
          <p style={{ marginBottom: 20 }}>
            Ne rezervăm dreptul de a modifica sau întrerupe serviciul (sau orice parte a acestuia) în orice moment, cu sau fără preaviz. Prețurile abonamentelor pot fi modificate, cu o notificare prealabilă de minimum 30 de zile.
          </p>
        </div>
      </div>
    </main>
  )
}
