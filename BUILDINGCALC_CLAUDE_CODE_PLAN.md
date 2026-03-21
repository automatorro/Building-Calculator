# BuildingCalc — Plan complet de implementare pentru Claude Code
**Versiune:** 1.0 | **Data:** 2026-03-21  
**Repo:** https://github.com/automatorro/building-calculator  
**Stack:** Next.js 16 App Router · TypeScript · Supabase · Tailwind CSS v4 · Framer Motion

---

## ⚠️ REGULI OBLIGATORII ÎNAINTE DE ORICE

1. **NU rescrie arhitectura.** Construiești incremental peste ce există.
2. **NU modifica** `utils/calculators/estimate.ts`, `utils/calculators/financials.ts`, schema Supabase existentă (doar extinde cu ALTER TABLE / CREATE TABLE noi).
3. **NU schimba** stiva tehnologică (Next.js, Supabase, Tailwind, Framer Motion).
4. **Supabase = manual.** Orice modificare SQL (CREATE TABLE, ALTER TABLE, INSERT, index) se scrie în fișiere SQL separate numerotate `supabase/migrations/XXX_descriere.sql` și NU se execută automat. Utilizatorul le rulează manual prin Supabase Dashboard → SQL Editor.
5. **Citește înainte de a scrie.** La fiecare pas, citește fișierele existente relevante înainte de a le modifica.
6. **Mobile-first.** Orice element interactiv nou trebuie să funcționeze cu degetul mare, pe ecran de 5.5 inch.

---

## 📂 STAREA ACTUALĂ CONFIRMATĂ A REPO-ULUI

```
app/
├── (dashboard)/
│   ├── deviz/[id]/page.tsx          ← mock, neconectat
│   ├── estimator/[id]/page.tsx      ← mock, neconectat
│   ├── ocr/[id]/page.tsx            ← mock cu timeout fake
│   ├── offers/[id]/page.tsx         ← mock
│   ├── procurement/[id]/page.tsx    ← mock
│   ├── timeline/[id]/page.tsx       ← mock
│   └── layout.tsx
├── auth/
│   ├── login/                       ← EXISTĂ dar verifică dacă e conectat la Supabase Auth
│   ├── register/                    ← EXISTĂ dar verifică dacă e conectat
│   ├── forgot-password/             ← EXISTĂ
│   └── layout.tsx
├── catalog/
│   ├── item/[id]/page.tsx
│   ├── loading.tsx
│   └── page.tsx                     ← citește din tabele VECHI (items/categories/normatives)
├── docs/
├── projects/
│   ├── [id]/
│   │   ├── print/                   ← EXISTĂ director, verifică conținut
│   │   └── page.tsx
│   ├── new/
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx                         ← 'use client' adăugat Mar 21

components/
├── CatalogFilter.tsx
├── EstimateEditor.tsx               ← editor deviz cu resurse
├── FaqSection.tsx
├── HeroCalculator.tsx               ← calculator hero landing
├── Navigation.tsx
├── ProjectActions.tsx               ← acțiuni proiect (export, import etc.)
├── ProjectClientContainer.tsx       ← container principal cu tabs
├── ProjectDashboard.tsx             ← financiar live
├── ProjectDevizView.tsx             ← view deviz în proiect
├── ProjectStagesManager.tsx         ← etape + rețete
├── ProjectTimeline.tsx              ← timeline (verifică dacă e mock sau real)
├── ShopManager.tsx                  ← achizitii
├── SmartCalculator.tsx              ← calculator dimensiuni → cantități
├── VendorOfferPicker.tsx            ← comparator furnizori
├── sidebar.tsx                      ← sidebar cu link-uri MOCK hardcodate ← PROBLEMA PRINCIPALĂ
└── topbar.tsx

utils/
├── calculators/
│   ├── estimate.ts                  ← NU ATINGE
│   └── financials.ts               ← NU ATINGE
├── supabase/
│   ├── client.ts
│   └── server.ts
└── ocr.ts                           ← structură există, implementare mock

supabase/
└── schema.sql                       ← schema completă cu RLS

middleware.ts                        ← COMPLET și CORECT, NU modifica
```

---

## 🗃️ FIȘIERE SQL SEPARATE — le rulezi tu manual în Supabase

> **La fiecare pas care necesită schimbări DB, Claude Code va genera fișierul SQL corespunzător în `supabase/migrations/`. NU le executa automat. Rulează-le în Supabase Dashboard → SQL Editor în ordinea numerotată.**

---

## 🚀 ORDINEA DE IMPLEMENTARE

---

### PASUL 0 — Citire și audit (OBLIGATORIU PRIMUL)

**Înainte de orice altceva, citește aceste fișiere:**

```bash
# Citește fișierele critice în această ordine:
cat components/sidebar.tsx
cat components/topbar.tsx
cat components/ProjectClientContainer.tsx
cat app/projects/\[id\]/page.tsx
cat app/projects/\[id\]/print/page.tsx   # sau verifică dacă există conținut
cat app/auth/login/page.tsx
cat app/auth/register/page.tsx
cat app/(dashboard)/layout.tsx
cat app/catalog/page.tsx
cat supabase/schema.sql
cat middleware.ts
```

**Ce cauți:**
- În `sidebar.tsx`: link-urile hardcodate `/estimator/current`, `/deviz/current` etc. → aceasta e problema principală
- În `ProjectClientContainer.tsx`: structura taburilor existente și cum primesc datele
- În `print/page.tsx`: dacă directorul există dar e gol sau are conținut
- În `auth/login/page.tsx`: dacă formularul e conectat la Supabase Auth sau e static
- În `schema.sql`: dacă există tabela `catalog_norms` sau doar `items`/`categories`/`normatives`

---

### PASUL 1 — Seed catalog_norms în Supabase

**Context:** Există 1.155 norme extrase din Deviz 360 în fișierul `seed_catalog_v2__1_.sql` din proiect (sau echivalentul). Catalogul UI citește din tabelele vechi și vede 5 articole.

**1a. Generează fișierul SQL de migrare:**

Creează `supabase/migrations/001_catalog_norms_seed.sql`:

```sql
-- ============================================================
-- Migrare 001: Creare și populare tabel catalog_norms
-- Rulează manual în Supabase Dashboard → SQL Editor
-- ============================================================

-- Creare tabel dacă nu există
CREATE TABLE IF NOT EXISTS catalog_norms (
  id INTEGER PRIMARY KEY,
  symbol VARCHAR(50) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_catalog_norms_category ON catalog_norms(category);
CREATE INDEX IF NOT EXISTS idx_catalog_norms_symbol ON catalog_norms(symbol);
CREATE INDEX IF NOT EXISTS idx_catalog_norms_active ON catalog_norms(is_active);

-- Full-text search în română
CREATE INDEX IF NOT EXISTS idx_catalog_norms_fts 
  ON catalog_norms USING gin(to_tsvector('romanian', name));

-- RLS
ALTER TABLE catalog_norms ENABLE ROW LEVEL SECURITY;

-- Toți utilizatorii autentificați pot citi catalogul
CREATE POLICY "catalog_norms_read" ON catalog_norms
  FOR SELECT TO authenticated USING (is_active = true);

-- [CONȚINUTUL INSERT din seed_catalog_v2__1_.sql se inserează DUPĂ acest header]
-- Copiază toate liniile INSERT din seed_catalog_v2__1_.sql
```

**1b. Actualizează `app/catalog/page.tsx`:**

Înlocuiește query-urile pe `categories`, `normatives`, `items` cu query pe `catalog_norms`:

```typescript
// ÎNLOCUIEȘTE query-urile existente cu:
const { data: norms, error: normsError } = await supabase
  .from('catalog_norms')
  .select('id, symbol, name, unit, category, unit_price')
  .eq('is_active', true)
  .order('category')
  .order('symbol')

// Extrage categoriile unice din norme (nu mai ai nevoie de tabela categories)
const categories = [...new Set(norms?.map(n => n.category) || [])].sort()

// Extrage prefixele normativelor unice (primele 2-3 caractere din symbol)
const normativePrefixes = [...new Set(
  norms?.map(n => n.symbol.replace(/[0-9%]/g, '').substring(0,4).toUpperCase()) || []
)].sort()
```

**1c. Actualizează `components/CatalogFilter.tsx`:**

Adaptează props și tipurile să lucreze cu structura `catalog_norms` în loc de `items`:
- `symbol` în loc de `code`
- `unit` în loc de `um`  
- `category` direct (string) în loc de `categories.name` (relație)
- `unit_price` disponibil direct

**Niciun alt fișier nu se atinge în acest pas.**

---

### PASUL 2 — Rezolvarea GAP-ului sidebar (problema arhitecturală principală)

**Context:** `sidebar.tsx` are link-uri hardcodate spre `/estimator/current`, `/deviz/current` etc. Acestea sunt complet deconectate de proiectul real al utilizatorului.

**Strategia:** Transformă sidebar-ul să fie context-aware — când utilizatorul e în `/projects/[id]`, link-urile duc la tab-urile reale ale proiectului, nu la paginile mock.

**2a. Modifică `components/sidebar.tsx`:**

```typescript
'use client'
import { usePathname } from 'next/navigation'

// Detectează dacă suntem în contextul unui proiect
const pathname = usePathname()
const projectMatch = pathname.match(/\/projects\/([^\/]+)/)
const projectId = projectMatch ? projectMatch[1] : null

// Generează link-urile dinamic
const navLinks = projectId ? [
  { href: `/projects/${projectId}`, label: 'Dashboard', icon: LayoutDashboard },
  { href: `/projects/${projectId}?tab=deviz`, label: 'Deviz', icon: FileText },
  { href: `/projects/${projectId}?tab=planificare`, label: 'Planificare', icon: Calendar },
  { href: `/projects/${projectId}?tab=achizitii`, label: 'Achiziții', icon: ShoppingCart },
  { href: `/projects/${projectId}/print`, label: 'Export PDF', icon: Printer },
] : [
  { href: '/projects', label: 'Proiectele mele', icon: FolderOpen },
  { href: '/catalog', label: 'Catalog norme', icon: BookOpen },
]
```

**2b. Verifică `app/(dashboard)/layout.tsx`:**

Asigură-te că layout-ul dashboard folosește sidebar-ul și topbar-ul. Dacă paginile mock (deviz/current, estimator/current etc.) mai există în nav, ascunde-le din sidebar (nu le șterge din filesystem — pot fi reconectate mai târziu).

---

### PASUL 3 — Export PDF real

**Context:** `app/projects/[id]/print/` există ca director. Verifică dacă are conținut. Dacă nu, creează pagina.

**3a. Citește mai întâi:**
```bash
cat app/projects/\[id\]/print/page.tsx  # sau ls pentru a vedea dacă există
cat components/ProjectDevizView.tsx      # pentru a înțelege structura datelor devizului
```

**3b. Creează/completează `app/projects/[id]/print/page.tsx`:**

Server Component care:
1. Preia proiectul din Supabase după `id`
2. Preia liniile de deviz ale proiectului
3. Calculează recapitulația (cost direct → regie → profit → TVA)
4. Redă un layout A4 optimizat pentru print

```typescript
// Structura paginii:
export default async function PrintPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Verifică autentificarea
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  // Preia proiectul (adaptează la schema ta reală după ce citești schema.sql)
  const { data: project } = await supabase
    .from('projects')
    .select('*, estimate_lines(*)')  // sau structura reală din schema ta
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()
  
  if (!project) notFound()
  
  // Calculează totaluri folosind utils/calculators/financials.ts existent
  
  return (
    <div className="print-layout">
      {/* Buton print - se ascunde la print cu @media print { display: none } */}
      <button onClick={() => window.print()} className="no-print">
        Descarcă / Printează PDF
      </button>
      
      {/* Antet deviz */}
      <header className="deviz-header">
        <div className="firma-info">/* date firmă din settings utilizator */</div>
        <div className="proiect-info">
          <h1>{project.name}</h1>
          <p>Locație: {project.location}</p>
          <p>Data: {new Date().toLocaleDateString('ro-RO')}</p>
        </div>
      </header>
      
      {/* Tabel deviz conform standard românesc */}
      <table className="deviz-table">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Cod normativ</th>
            <th>Descriere lucrare</th>
            <th>UM</th>
            <th>Cantitate</th>
            <th>Preț unitar (lei)</th>
            <th>Total (lei)</th>
          </tr>
        </thead>
        <tbody>
          {/* liniile de deviz */}
        </tbody>
      </table>
      
      {/* Recapitulație */}
      <section className="recapitulatie">
        <div>Cost direct: {costDirect} lei</div>
        <div>Regie ({regieProc}%): {regie} lei</div>
        <div>Profit ({profitProc}%): {profit} lei</div>
        <div>Total fără TVA: {totalFaraTVA} lei</div>
        <div>TVA ({tvaProc}%): {tva} lei</div>
        <div className="total-general">TOTAL GENERAL: {totalGeneral} lei</div>
      </section>
      
      {/* Semnături */}
      <section className="semnaturi">
        <div>Întocmit: _______________</div>
        <div>Verificat: _______________</div>
        <div>Aprobat: _______________</div>
      </section>
    </div>
  )
}
```

**3c. Adaugă stiluri print în `app/globals.css`:**

```css
@media print {
  .no-print { display: none !important; }
  .print-layout { 
    font-family: 'Times New Roman', serif;
    font-size: 11pt;
    color: #000;
    background: white;
    margin: 0;
    padding: 1.5cm;
  }
  .deviz-table { 
    width: 100%;
    border-collapse: collapse;
    page-break-inside: auto;
  }
  .deviz-table th, .deviz-table td {
    border: 1px solid #000;
    padding: 4pt 6pt;
    font-size: 9pt;
  }
  .recapitulatie {
    margin-top: 20pt;
    float: right;
    width: 40%;
  }
  .total-general {
    font-weight: bold;
    font-size: 12pt;
    border-top: 2px solid #000;
    padding-top: 4pt;
  }
}
```

**3d. Adaugă buton în `components/ProjectActions.tsx`:**

```typescript
// Adaugă lângă butoanele existente:
<Link href={`/projects/${projectId}/print`} target="_blank">
  <button>Export PDF</button>
</Link>
```

---

### PASUL 4 — Verificarea și completarea Auth

**Context:** Auth pages există (login, register, forgot-password). Middleware-ul e corect. Trebuie verificat dacă formularele sunt conectate la Supabase Auth.

**4a. Citește și verifică:**
```bash
cat app/auth/login/page.tsx
cat app/auth/register/page.tsx
cat app/auth/layout.tsx
```

**Ce verifici:**
- Formularul de login apelează `supabase.auth.signInWithPassword()` ?
- Formularul de register apelează `supabase.auth.signUp()` ?
- Există redirect după login spre `/projects` ?
- Există handling de erori (parolă greșită, email inexistent) ?

**4b. Dacă formularele sunt incomplete, implementează:**

```typescript
// app/auth/login/page.tsx — form client component
'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    
    if (error) {
      // Afișează eroarea în UI
      setError(error.message)
      return
    }
    
    router.push('/projects')
    router.refresh()
  }
  
  // Layout split: stânga dark cu mesaj, dreapta formular
  return (
    <div className="auth-layout">
      <div className="auth-left"> {/* fundal --black */}
        <h2>Devize profesionale<br/>pentru oameni de șantier</h2>
        <p>Generează un deviz complet în sub 5 minute.</p>
      </div>
      <div className="auth-right"> {/* formular */}
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Parolă" required />
          <button type="submit">Intră în cont</button>
        </form>
        <Link href="/auth/register">Nu ai cont? Înregistrează-te</Link>
      </div>
    </div>
  )
}
```

**4c. Migrare SQL necesară (dacă nu există profiles):**

Creează `supabase/migrations/002_user_profiles.sql`:

```sql
-- Migrare 002: Tabel profile utilizatori
-- Rulează manual în Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  county TEXT,  -- județul din România
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own" ON profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: creare automată profil la înregistrare
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### PASUL 5 — Slider discount B2B + Pierderi tehnologice

**Context:** Ambele sunt adăugiri la `ProjectDevizView.tsx` sau `EstimateEditor.tsx`. State local, fără schimbări DB.

**5a. Citește mai întâi:**
```bash
cat components/ProjectDevizView.tsx
cat components/EstimateEditor.tsx
```

**5b. Adaugă în componenta de deviz (oricare dintre ele afișează tabelul cu prețuri):**

```typescript
// State local — nu necesită DB
const [discountB2B, setDiscountB2B] = useState(0)          // 0-40%
const [includePierderi, setIncludePierderi] = useState(true)

// Coeficienți pierderi per categorie
const PIERDERI: Record<string, number> = {
  'faianta': 0.08,
  'gresie': 0.08,
  'tencuiala': 0.05,
  'vopsitorie': 0.10,
  'beton armat': 0.03,
  'cofraj': 0.05,
  'zidarie': 0.04,
  'BCA': 0.04,
  'acoperis': 0.06,
  'tamplarie': 0.02,
  'default': 0.05,
}

// Calcul preț efectiv per linie
function pretEfectiv(linie: EstimateLine): number {
  const pierdereFactor = includePierderi 
    ? (1 + (PIERDERI[linie.category] ?? PIERDERI.default))
    : 1
  const discountFactor = 1 - (discountB2B / 100)
  
  // Discountul se aplică DOAR pe materiale, nu pe manoperă
  if (linie.resource_type === 'material') {
    return linie.unit_price * pierdereFactor * discountFactor
  }
  return linie.unit_price * pierdereFactor
}

// UI — adaugă deasupra tabelului de deviz:
<div className="deviz-controls">
  <div className="control-group">
    <label>Discount B2B la materiale</label>
    <div className="slider-wrapper">
      <input
        type="range" min={0} max={40} value={discountB2B}
        onChange={e => setDiscountB2B(Number(e.target.value))}
      />
      <span className="discount-value">{discountB2B}%</span>
    </div>
    <small>Preț listă → Prețul tău (negociat cu furnizorul)</small>
  </div>
  
  <label className="toggle-label">
    <input
      type="checkbox"
      checked={includePierderi}
      onChange={e => setIncludePierderi(e.target.checked)}
    />
    Include pierderi tehnologice automate
  </label>
</div>

// Afișează diferența în footer-ul tabelului:
<tfoot>
  <tr>
    <td colSpan={4}>Preț fără discount: {totalFaraDiscount} lei</td>
  </tr>
  {discountB2B > 0 && (
    <tr className="discount-row">
      <td colSpan={4}>
        Economie discount B2B ({discountB2B}%): -{economieDiscount} lei
      </td>
    </tr>
  )}
  <tr className="total-row">
    <td colSpan={4}><strong>Total cu discountul tău: {totalCuDiscount} lei</strong></td>
  </tr>
</tfoot>
```

---

### PASUL 6 — Generatorul de deviz din lucrare (feature principal)

**Context:** `SmartCalculator.tsx` există și probabil face deja ceva cu dimensiuni → cantități. Verifică conținutul. `HOUSE_TEMPLATE_SYMBOLS` există în `catalog-integration.ts`. Acesta e cel mai mare feature nou.

**6a. Citește mai întâi:**
```bash
cat components/SmartCalculator.tsx
cat components/ProjectStagesManager.tsx
```

**6b. Dacă SmartCalculator e incomplet, extinde-l:**

Adaugă în `SmartCalculator.tsx` un wizard cu pași:

```
Pas 1: "Ce vrei să devizezi?"
  → Casă individuală
  → Renovare apartament  
  → Lucrare specifică (fundație / acoperiș / baie / etc.)

Pas 2: Parametrii (max 5 câmpuri, în funcție de alegere)
  Casa: suprafață construită (mp), nr. niveluri, tip structură (BCA / cărămidă / beton armat)
  Renovare baie: suprafață (mp), include instalații (da/nu)
  Fundație: suprafață (mp), adâncime (m), tip (izolată / continuă / radier)

Pas 3: Previzualizare linii generate
  → Tabel cu toate articolele calculate automat
  → Fiecare linie editabilă (cantitate)
  → Checkbox per linie (include/exclude)

Pas 4: "Adaugă în deviz" → POST la API sau direct setState în ProjectClientContainer
```

**Logica de calcul** (în `SmartCalculator.tsx` sau `utils/calculators/estimate.ts`):

```typescript
// Exemplu pentru casă P+E:
function generateHouseLines(params: HouseParams): EstimateLine[] {
  const { suprafata, niveluri, structura } = params
  const suprafataDesfasurata = suprafata * niveluri
  const perimetruFundatie = Math.sqrt(suprafata) * 4  // aproximare

  return [
    // Terasamente
    { symbol: 'TsC01A1', name: 'Săpătură fundații', quantity: suprafata * 0.8, unit: 'mc' },
    
    // Fundație
    { symbol: 'CZ01A', name: 'Beton fundații C12/15', quantity: suprafata * 0.5, unit: 'mc' },
    { symbol: 'CZ01B', name: 'Beton fundații C20/25', quantity: suprafata * 0.3, unit: 'mc' },
    
    // Structură (în funcție de tip)
    ...(structura === 'BCA' ? [
      { symbol: 'CB01A', name: 'Zidărie BCA 25cm', quantity: perimetruFundatie * niveluri * 2.8, unit: 'mp' },
    ] : [
      { symbol: 'CB02A', name: 'Beton armat stâlpi C25/30', quantity: suprafataDesfasurata * 0.05, unit: 'mc' },
      { symbol: 'CB02B', name: 'Beton armat planșee C25/30', quantity: suprafataDesfasurata * 0.18, unit: 'mc' },
    ]),
    
    // ... etc pentru fiecare categorie
  ]
}
```

---

### PASUL 7 — Link public read-only pentru beneficiar

**7a. Migrare SQL:**

Creează `supabase/migrations/003_public_share.sql`:

```sql
-- Migrare 003: Token public pentru partajare deviz
-- Rulează manual în Supabase Dashboard → SQL Editor

-- Adaugă coloane la tabelul projects (verifică mai întâi că există)
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS public_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS public_share_enabled BOOLEAN DEFAULT false;

-- Index pe token pentru lookup rapid
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_public_token 
  ON projects(public_token);

-- Policy: oricine poate citi un proiect dacă are token-ul și share-ul e activat
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT TO anon
  USING (public_share_enabled = true);
```

**7b. Creează `app/share/[token]/page.tsx`:**

```typescript
// Pagină publică — NU necesită autentificare
export default async function SharePage({ params }: { params: { token: string } }) {
  // Folosește supabase client FĂRĂ auth (anon key)
  const supabase = createClient()  // sau createServerClient cu anon key
  
  const { data: project } = await supabase
    .from('projects')
    .select('name, location, created_at, estimate_lines(*)')
    .eq('public_token', params.token)
    .eq('public_share_enabled', true)
    .single()
  
  if (!project) return notFound()
  
  // Afișaj SIMPLIFICAT — fără coduri normative, fără prețuri unitare
  // Grupat pe categorii mari, doar totaluri
  return (
    <div className="share-page">
      <header>
        <h1>{project.name}</h1>
        <p>Deviz orientativ generat cu BuildingCalc</p>
        <p>Data: {formatDate(project.created_at)}</p>
      </header>
      
      {/* Grupat pe categorii, nu pe linii individuale */}
      {groupedCategories.map(cat => (
        <div key={cat.name} className="category-group">
          <h3>{cat.name}</h3>
          <span>{cat.total} lei</span>
        </div>
      ))}
      
      <div className="total-share">
        Total estimativ: {totalGeneral} lei (fără TVA)
      </div>
      
      <footer>
        <small>Prețuri orientative. Pentru deviz definitiv, contactați constructorul.</small>
      </footer>
    </div>
  )
}
```

**7c. Adaugă buton în `ProjectActions.tsx`:**

```typescript
// Buton "Partajează cu beneficiarul"
async function handleShare() {
  // Activează public_share_enabled = true
  await supabase.from('projects')
    .update({ public_share_enabled: true })
    .eq('id', projectId)
  
  // Afișează link-ul
  const shareUrl = `${window.location.origin}/share/${project.public_token}`
  // Copy to clipboard + toast
  navigator.clipboard.writeText(shareUrl)
}
```

---

### PASUL 8 — Curățarea modulelor mock din (dashboard)

**Context:** Paginile din `(dashboard)/` (deviz/[id], estimator/[id], etc.) sunt deconectate. Acum că sidebar-ul e reconectat la proiectele reale, aceste pagini pot fi fie reconectate, fie marcate ca "coming soon".

**8a. Pentru fiecare pagină mock, alege una din variante:**

**Varianta A — Redirect la proiectul real** (recomandat pentru deviz):
```typescript
// app/(dashboard)/deviz/[id]/page.tsx
import { redirect } from 'next/navigation'
export default function DevizPage({ params }) {
  // Redirect la devizul real în projects/[id]
  redirect(`/projects/${params.id}?tab=deviz`)
}
```

**Varianta B — Coming soon** (pentru ocr, offers, procurement):
```typescript
export default function OcrPage() {
  return (
    <div className="coming-soon">
      <h2>OCR pentru planșe</h2>
      <p>Această funcționalitate va fi disponibilă în curând.</p>
      <Link href="/projects">Înapoi la proiecte</Link>
    </div>
  )
}
```

---

### PASUL 9 — Aplicarea design system-ului nou (UI refresh)

**Context:** Design system-ul din `BuildingCalc_LandingPage_v3.html` trebuie aplicat consistent. **NU rescrie logica — doar UI-ul.**

**Paleta de culori obligatorie:**
```css
--black: #1E2329;
--orange: #E8500A;
--orange-dark: #C43F06;
--orange-light: #FFF0E8;
--white: #FAFAF8;
--gray-100: #F3F2EF;
--gray-200: #E5E3DE;
--gray-400: #A8A59E;
--gray-600: #6B6860;
--gray-800: #2E2D2A;
--green: #2A7D4F;
--green-light: #E8F5EE;
--red-light: #FCECEA;
--red: #C0392B;
--serif: 'DM Serif Display', Georgia, serif;
--sans: 'DM Sans', system-ui, sans-serif;
```

**9a. Actualizează `app/globals.css`:**
- Adaugă variabilele de mai sus în `:root`
- Înlocuiește `.glass-card` cu `.card` (fără glassmorphism)
- Adaugă `.btn-primary`, `.btn-ghost`, `.badge-*`
- Importă fonturile DM Serif Display + DM Sans în `app/layout.tsx`

**9b. Ordinea de aplicare UI (una câte una, nu toate odată):**
1. `components/Navigation.tsx` — fundal `--black`, logo, link-uri
2. `app/projects/page.tsx` — lista proiecte cu carduri noi
3. `app/projects/[id]/page.tsx` + `ProjectClientContainer.tsx` — tab switcher
4. `app/catalog/page.tsx` — sidebar filtru + grid articole
5. `app/auth/login` + `register` — layout split dark/light

---

### PASUL 10 — Export CSV/Excel

**Context:** SheetJS e disponibil în proiect. Adaugă în `ProjectActions.tsx`.

```typescript
import * as XLSX from 'xlsx'

function exportToExcel(lines: EstimateLine[], projectName: string) {
  const wsData = [
    ['Nr.', 'Cod normativ', 'Descriere', 'UM', 'Cantitate', 'Preț unitar', 'Total'],
    ...lines.map((line, i) => [
      i + 1,
      line.symbol || line.code,
      line.name,
      line.unit || line.um,
      line.quantity,
      line.unit_price,
      line.quantity * line.unit_price
    ]),
    [],
    ['', '', '', '', '', 'TOTAL', lines.reduce((s, l) => s + l.quantity * l.unit_price, 0)]
  ]
  
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Deviz')
  XLSX.writeFile(wb, `deviz-${projectName}-${new Date().toISOString().split('T')[0]}.xlsx`)
}
```

---

## 📋 SUMAR FIȘIERE SQL DE GENERAT (rulezi tu manual)

| Fișier | Conținut | Când |
|---|---|---|
| `supabase/migrations/001_catalog_norms_seed.sql` | CREATE TABLE catalog_norms + toate INSERT-urile din seed_catalog_v2__1_.sql | Pasul 1 |
| `supabase/migrations/002_user_profiles.sql` | CREATE TABLE profiles + trigger creare automată | Pasul 4 |
| `supabase/migrations/003_public_share.sql` | ALTER TABLE projects ADD public_token, public_share_enabled | Pasul 7 |

> **Notă:** Verifică înainte de a rula fiecare SQL dacă tabelul/coloana nu există deja în `supabase/schema.sql`. Dacă există, adaptează migrarea să folosească `IF NOT EXISTS` / `IF NOT EXISTS (SELECT ...)`.

---

## 📊 ORDINEA FINALĂ DE EXECUȚIE (rezumat)

```
Ziua 1 (4-5h):
  ✅ Pasul 0 — Audit complet cod existent
  ✅ Pasul 1 — Seed catalog_norms + update catalog/page.tsx
  ✅ Pasul 2 — Fix sidebar (GAP arhitectural)

Ziua 2 (4-5h):
  ✅ Pasul 3 — Export PDF
  ✅ Pasul 4 — Verificare/completare Auth
  ✅ Pasul 5 — Slider discount B2B + pierderi tehnologice

Ziua 3 (6-8h):
  ✅ Pasul 6 — Generator deviz din lucrare (cel mai complex)
  ✅ Pasul 8 — Curățare module mock

Ziua 4 (4-5h):
  ✅ Pasul 7 — Link public beneficiar
  ✅ Pasul 10 — Export Excel/CSV

Ziua 5 (4-6h):
  ✅ Pasul 9 — Design system nou (UI refresh, fară modificări logică)
```

---

## 🔍 ÎNTREBĂRI DE VERIFICAT ÎNAINTE DE FIECARE PAS

Înainte de fiecare pas, Claude Code trebuie să verifice:

1. **Schema Supabase** — rulează `cat supabase/schema.sql` și confirmă că tabelele pe care le accesezi există
2. **Tipurile TypeScript** — dacă există fișiere de tipuri separate (ex: `types/` sau tipuri definite în `utils/`)
3. **Variabilele de mediu** — `.env.local` trebuie să aibă `NEXT_PUBLIC_SUPABASE_URL` și `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Client vs Server** — componentele care folosesc `useState`/`useEffect` trebuie să aibă `'use client'` la început

---

## ⛔ CE NU FACE CLAUDE CODE

- Nu șterge nicio pagină sau componentă existentă
- Nu modifică `utils/calculators/estimate.ts` sau `utils/calculators/financials.ts`
- Nu schimbă structura tabelelor existente în Supabase (doar ADD COLUMN cu IF NOT EXISTS)
- Nu face push direct la Supabase prin CLI sau API — toate schimbările DB sunt SQL-uri separate
- Nu adaugă noi dependențe npm fără a verifica mai întâi că nu există deja o soluție în proiect
- Nu rescrie componentele mari (ProjectClientContainer, EstimateEditor) — le extinde

---

*Plan generat pe baza analizei complete a repo-ului (18 commits, Mar 17–21, 2026)*  
*Ultima actualizare: Mar 21, 2026*
