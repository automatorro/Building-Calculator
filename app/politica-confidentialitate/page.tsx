import Link from 'next/link'

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

export default function PoliticaPage() {
  return (
    <main style={{ background: '#FAFAF8', minHeight: '100vh', padding: '120px 32px 80px', fontFamily: sans }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#E8500A', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← Înapoi la prima pagină
        </Link>
        
        <h1 style={{ fontFamily: serif, fontSize: 48, color: '#1E2329', marginBottom: 24, letterSpacing: '-.02em' }}>
          Politică de confidențialitate
        </h1>
        
        <div style={{ fontSize: 16, color: '#374151', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 20 }}>
            Ultima actualizare: 20 aprilie 2026
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            1. Datele colectate
          </h2>
          <p style={{ marginBottom: 20 }}>
            Colectăm informațiile pe care ni le furnizați direct atunci când vă creați un cont: nume, adresă de e-mail și, opțional, datele firmei dumneavoastră. De asemenea, stocăm datele proiectelor și devizelor pe care le creați pentru a vă putea oferi acces la acestea de pe orice dispozitiv.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            2. Utilizarea datelor
          </h2>
          <p style={{ marginBottom: 20 }}>
            Utilizăm datele dumneavoastră pentru:
          </p>
          <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
            <li>Furnizarea și mentenanța serviciilor noastre;</li>
            <li>Comunicarea noutăților tehnice sau a modificărilor de termeni;</li>
            <li>Facturare și suport tehnic;</li>
            <li>Îmbunătățirea algoritmilor de calcul și a catalogului de norme (în formă anonimizată).</li>
          </ul>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            3. Securitatea datelor
          </h2>
          <p style={{ marginBottom: 20 }}>
            Folosim servicii de infrastructură de ultimă generație (Supabase / AWS) și criptare SSL pentru a vă proteja datele. Accesul la datele dumneavoastră este strict limitat și securizat prin proceduri de autentificare robuste.
          </p>

          <h2 style={{ fontSize: 24, color: '#1E2329', marginTop: 40, marginBottom: 16, fontWeight: 700 }}>
            4. Partajarea datelor cu terți
          </h2>
          <p style={{ marginBottom: 20 }}>
            Nu vindem și nu închiriem datele dumneavoastră personale către terți. Putem partaja date doar cu furnizorii de servicii necesari funcționării aplicației (ex: procesatori de plăți) sau dacă suntem obligați prin lege.
          </p>
        </div>
      </div>
    </main>
  )
}
