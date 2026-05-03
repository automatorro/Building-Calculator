PLAN DE IMPLEMENTARE — SANTIER.APP
Versiune: Post-audit, bazat pe starea reală a codebase-ului
Principiu central: Zero regresii. Fiecare task este izolat și reversibil.
________________________________________
CONTEXT ARHITECTURAL
Ce NU se atinge (funcționează corect, risc prea mare)
utils/calculators/estimate.ts     — motor calcul, verificat aritmetic
utils/calculators/financials.ts   — motor financiar, logic corect
middleware.ts                      — protecție rute, funcțional
supabase/migrations/039-044.sql   — RLS reparat, multi-user funcțional
ProjectClientContainer.tsx         — logica principală app, NU rescrie
EstimateEditor.tsx                 — editor deviz, NU rescrie
Starea reală confirmată după citirea tuturor migrărilor
Problemă din audit	Stare reală
RLS vulnerabilitate critică	REZOLVATĂ — migrations 040-041 cu SECURITY DEFINER
Multi-user acces proiect	REZOLVAT — project_members + check_project_access_v4
Mobile funcțional	CONFIRMAT — sidebar există pe desktop, taburi funcționează via tab params
Export CSV require()	BUG REAL — rămâne în plan
Settings page 404	BUG REAL — rămâne în plan
AI routes fără auth	BUG REAL — rămâne în plan
________________________________________
STRUCTURA PLANULUI
FAZA A — Securitate & Stabilitate (fără UI, risc zero)
FAZA B — Pagini Lipsă (izolate, fără impact pe cod existent)
FAZA C — Fix-uri UX Punctuale (chirurgicale, 1-5 linii fiecare)
FAZA D — Features cu Impact pe Retenție (construite peste ce există)
FAZA E — Calitate & Performanță (nu schimbă comportament)
________________________________________
FAZA A — SECURITATE & STABILITATE
Risc de regresie: ZERO (nu atinge UI, nu atinge logică existentă)
Durată estimată: 3-4 ore
________________________________________
A1. Autentificare pe toate rutele AI
Problema: /api/ai/analyze, /api/ai/chat, /api/ai/editor-chat, /api/ai/suggest-recipe, /api/ai/process-purchase — nu verifică sesiunea Supabase. Orice request neautentificat consumă cota Gemini.
Soluție: Helper comun de autentificare, aplicat la începutul fiecărei rute.
Fișiere: app/api/ai/analyze/route.ts, chat/route.ts, editor-chat/route.ts, suggest-recipe/route.ts, process-purchase/route.ts
Pattern de implementare:
// La începutul fiecărei rute POST, ÎNAINTE de orice altceva:
import { createClient } from '@/utils/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
}
Dependențe: Niciuna. Autoconținut.
Risc: Zero — adaugă un check în plus, nu schimbă logica existentă.
________________________________________
A2. Fix export CSV — require() → import
Problema: components/ProjectClientContainer.tsx:100 — require('@/utils/calculators/estimate') în ESM.
Fișier: components/ProjectClientContainer.tsx:99-119
Fix:
// ÎNAINTE:
function exportCSV(...) {
  const { calculateLineCosts } = require('@/utils/calculators/estimate')
  
// DUPĂ:
import { calculateLineCosts as calcLineCosts } from '@/utils/calculators/estimate'
// (importul există deja în fișier pentru exportExcel, se refolosește)
function exportCSV(...) {
  // folosește direct calcLineCosts importat la nivel de modul
Dependențe: calculateLineCosts deja importat în același fișier (linia 47 în exportExcel).
Risc: Minim — doar schimbare de mecanism import, același cod.
________________________________________
A3. Fix text „69 lei" → „89 lei" pe pagina de login
Fișier: app/auth/login/page.tsx:33
Fix: { num: '89 lei', label: 'pe lună, fără contract' }
Durată: 30 secunde.
Risc: Zero.
________________________________________
FAZA B — PAGINI LIPSĂ
Risc de regresie: SCĂZUT (pagini noi, nu modifică existente)
Durată estimată: 1-2 zile
________________________________________
B1. Pagina Settings (/settings)
Problema: Link activ în sidebar → 404. Utilizatorul nu poate gestiona contul din aplicație.
Arhitectură: Server Component cu 4 secțiuni independente:
app/settings/
├── page.tsx          — layout cu 4 carduri
└── (nu e nevoie de sub-rute pentru prima versiune)
Conținut minimal livrat:
1.	Datele contului — email curent (readonly), afișat din supabase.auth.getUser()
2.	Planul activ — citit din profiles.subscription_plan, afișat cu badge
3.	Gestionare abonament — buton "Modifică planul" → apelează /api/stripe/portal (deja există)
4.	Schimbare parolă — form cu email + buton "Trimite email resetare" → supabase.auth.resetPasswordForEmail()
Ce NU include (reduce riscul primei versiuni):
•	Nu se modifică profilul (nume firmă, CUI) — e o funcție separată
•	Nu se ating planurile de abonament sau prețurile
Dependențe: hooks/useSubscription.ts (deja există), /api/stripe/portal (există).
________________________________________
B2. Pagina Settings — Extensie: Date Firmă (opțional B1+)
Dacă există timp după B1, același fișier primește un card suplimentar:
•	Câmpuri: Nume firmă, CUI, Adresă, Telefon → salvate în profiles (tabel existent)
•	Aceste date vor fi folosite la print pentru personalizarea antetului PDF
Dependențe B2: B1 complet + verificarea că tabelul profiles are coloanele necesare.
________________________________________
FAZA C — FIX-URI UX CHIRURGICALE
Risc de regresie: MINIM (modificări de 1-10 linii per task)
Durată estimată: 4-6 ore total
________________________________________
C1. Fix highlight tab activ în sidebar
Problema: Sidebar verifică pathname.startsWith('/projects/[id]/segment') dar tab-urile sunt ?tab=segment (query params, nu path segments).
Fișier: components/sidebar.tsx:147-221
Soluție — fără a rescrie sidebar-ul:
// Sidebar e 'use client', are acces la window.location
// Adaugă un hook simplu:
const [activeTab, setActiveTab] = useState<string>('')
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  setActiveTab(params.get('tab') || '')
}, [])

// În isActive logic:
if (item.matchSegment === null) {
  isActive = pathname === `/projects/${projectId}` && !activeTab
} else {
  isActive = activeTab === item.matchSegment
}
Dependențe: Niciuna.
Risc: Zero — adaugă state local, nu schimbă structura.
Notă arhitecturală: Nu folosim useSearchParams() din Next.js deoarece ar necesita Suspense boundary. window.location.search e mai simplu și sufficient pentru highlight vizual.
________________________________________
C2. Buton WhatsApp Share
Problema: Promisiunea "trimis pe WhatsApp în 10 secunde" nu are buton dedicat.
Fișier: app/share/[token]/page.tsx și components/ProjectActions.tsx
Implementare:
// În share/[token]/page.tsx, după total:
const whatsappMsg = encodeURIComponent(
  `Deviz proiect "${project.name}"\nTotal estimativ: ${fmtRon(totalFaraTVA)} lei (fără TVA)\nVezi detalii: ${shareUrl}`
)
// Buton:
<a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
  Trimite pe WhatsApp
</a>
Dependențe: URL-ul de share trebuie construit. Pagina share rulează Server-Side, deci URL-ul se construiește din request.headers.get('host') sau din variabila de env NEXT_PUBLIC_APP_URL.
Risc: Minim — link extern nou, nu modifică logica.
________________________________________
C3. Calibrare valori HeroCalculator
Problema: 4.000 lei/mp Economic supraestimează cu ~50% față de piața 2026.
Fișier: components/HeroCalculator.tsx:8
Valori recomandate (bazate pe prețuri medii piață 2026 România):
const FIN_BASE = [2800, 4200, 6500]  // lei/mp fără TVA
// Economic: ~560 EUR/mp, Standard: ~840 EUR/mp, Premium: ~1300 EUR/mp
Adaugă disclaimer explicit sub rezultat:
<p style={{ fontSize:11, color:'#A8A59E', textAlign:'center', marginTop:6 }}>
  Estimare orientativă ±20%. Nu include TVA, branșamente sau autorizații.
</p>
Dependențe: Niciuna.
Risc: Zero — modificare de constante, nu de logică.
________________________________________
C4. Fix „Niciun rezultat" în catalog search
Problema: Căutare fără rezultate → lista goală fără feedback vizual.
Fișier: components/CatalogFilter.tsx
Fix: Adaugă condiție după {norms.length === 0 && q.length >= 2} → afișează empty state cu textul căutat.
Dependențe: Niciuna.
________________________________________
C5. Fix ștergere linie deviz — optimistic update corect
Problema: handleDeleteLine → șterge din state ÎNAINTE de confirmare DB. La eroare DB, linia dispare din UI dar e în DB.
Fișier: components/ProjectClientContainer.tsx:193-203
Pattern fix:
const handleDeleteLine = async (id: string) => {
  // Nu ștergem din state imediat
  const { error } = await supabase.from('estimate_lines').delete().eq('id', id)
  if (error) {
    toast.error('Eroare la ștergerea rândului.')
    return
  }
  // Ștergem din state DUPĂ confirmare
  setLines(lines.filter(l => l.id !== id))
  toast.success('Rând șters.')
}
Risc: Minim. UX-ul devine ușor mai lent (waiting pentru confirm) dar corect. Adaugă opțional un loading state local pe butonul de delete.
________________________________________
FAZA D — FEATURES CU IMPACT PE RETENȚIE
Risc de regresie: MEDIU (construite peste componente existente)
Durată estimată: 3-5 zile
________________________________________
D1. Date firmă în PDF (Print personalizat)
Problema: PDF-ul generat are antet cu logo Santier, dar fără datele firmei antreprenorului.
Dependență: B2 (câmpuri firmă în profiles) sau poate fi implementat direct cu date din proiect.
Arhitectură:
1.	Pagina print/page.tsx citește profiles pentru userul autentificat
2.	Dacă există date firmă → le afișează în antet în locul/lângă logo Santier
3.	Dacă nu → afișează placeholder "Completați datele firmei în Setări"
Fișier: app/projects/[id]/print/page.tsx:8-16 — adaugă query pentru profiles.
________________________________________
D2. Notificări email la depășire buget
Dependență critică: D2 necesită ca resend să fie configurat cu API key și domeniu verificat.
Arhitectură:
app/api/notifications/budget-alert/route.ts  (nou)
Flow:
1.	handleAddPurchase → detectează depășire buget (logica există deja la linia 300-313)
2.	Apelează /api/notifications/budget-alert cu payload: { projectName, stage, exceeded, userEmail }
3.	Endpoint-ul trimite email via resend cu template simplu
Template email:
Subiect: ⚠️ Depășire buget: etapa [X] pe proiect [Y]
Corp: Etapa [X] a depășit bugetul planificat cu [Z] lei.
      Accesează proiectul: [link direct]
Risc: Mediu — depinde de configurarea corectă a Resend. Testați în dev cu email propriu înainte de deploy.
________________________________________
D3. Dashboard dimineață — "Azi pe șantier"
Aceasta este M12 din CLAUDE_CODE_MASTER.md. Implement per instrucțiunile deja documentate.
Arhitectură: Tab nou în ProjectClientContainer.tsx — tip 'today', conținut din ProjectDashboard.tsx extins.
Conținut:
•	Ce etape au achiziții zero + sunt planificate → "De comandat azi"
•	Alertele active (depășiri buget existente)
•	Buton rapid "Înregistrează achiziție" fără a schimba tab-ul
Dependențe: calculateFinancials (deja calculează upcomingCosts) — datele există, lipsește doar UI-ul.
________________________________________
D4. Index GIN pentru căutare catalog
Acesta este o migrare SQL pură, fără modificări de cod.
-- supabase/migrations/045_catalog_search_indexes.sql
CREATE INDEX IF NOT EXISTS idx_catalog_norms_name_gin 
  ON catalog_norms USING gin(to_tsvector('romanian', name));

CREATE INDEX IF NOT EXISTS idx_catalog_norms_symbol 
  ON catalog_norms(symbol);

CREATE INDEX IF NOT EXISTS idx_catalog_norms_category_active 
  ON catalog_norms(category, is_active);
Risc: Zero — adaugă indecși, nu modifică date sau logică.
Impact: Căutarea ILIKE devine ~10x mai rapidă la 1.100+ rânduri.
________________________________________
FAZA E — CALITATE & HOUSEKEEPING
Risc: MINIM (nu schimbă comportament funcțional)
Durată: 2-3 ore
________________________________________
E1. Curățare console.log din producție
Fișiere: projects/page.tsx:53, ProjectClientContainer.tsx:197,199, api/ai/analyze/route.ts:131
Fix: Înlocuiește console.error/log cu gestionare silențioasă sau toast, după caz.
________________________________________
E2. Query proiecte cu filtru user_id explicit
Fișier: app/projects/page.tsx:27-31
Chiar dacă RLS este acum corect și filtrează automat, adaugă explicit .eq('user_id', userId) pentru claritate și pentru cazul în care RLS ar fi cumva bypass-at în dev/test:
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId)  // Explicit, chiar dacă RLS o face oricum
  .order('created_at', { ascending: false })
Dependență: Necesită userId disponibil în ProjectsPage. Deoarece pagina e client-side, adaugă un supabase.auth.getUser() call la începutul load().
________________________________________
MATRIX RISC / IMPACT / EFORT
Task	Impact	Efort	Risc regresie	Prioritate
A1 — Auth AI routes	Înalt (securitate)	2h	Zero	Imediat
A2 — Fix require()	Mediu	30min	Zero	Imediat
A3 — Fix 69 lei	Minim	5min	Zero	Imediat
B1 — Settings page	Înalt (UX)	4h	Scăzut	Săptămâna 1
C1 — Sidebar active	Mediu (UX)	1h	Zero	Săptămâna 1
C2 — WhatsApp button	Mediu (promisiune)	1h	Zero	Săptămâna 1
C3 — HeroCalc valori	Mediu (credibilitate)	30min	Zero	Săptămâna 1
C4 — Empty state catalog	Minor	30min	Zero	Săptămâna 1
C5 — Delete optimistic	Mediu	30min	Scăzut	Săptămâna 1
D1 — PDF date firmă	Mediu	2h	Scăzut	Săptămâna 2
D2 — Email notificări	Înalt (retenție)	4h	Mediu	Săptămâna 2
D3 — Dashboard azi	Înalt (retenție)	1 zi	Mediu	Săptămâna 2-3
D4 — Index GIN	Mediu (perf)	30min	Zero	Săptămâna 2
E1 — Console cleanup	Minor	1h	Zero	Oricând
E2 — Query userId	Minor	30min	Zero	Oricând
________________________________________
REGULI DE IMPLEMENTARE (risk management)
Regula 1: Un task = un commit
Fiecare item din plan este un commit separat. Nicio combinare de task-uri în același commit.
Regula 2: Build verde obligatoriu
npm run build PASS înainte de orice commit. Un build spart blochează tot.
Regula 3: Ordinea fazelor este sacră
A → C1,C2,C3,C4,C5 → B1 → D4 → D1 → D2 → D3 → E
Fazele B, D depind de A (mai ales B1 depinde de A1 pentru securitate). D4 e independent și merge oricând.
Regula 4: Nicio componentă majoră nu se rescrie
EstimateEditor, ProjectClientContainer, ProjectDashboard — se EXTIND, nu se rescriu. Orice feature nouă e o componentă separată sau o extensie izolată.
Regula 5: SQL-urile merg în supabase/migrations/
Nicio migrare nu se rulează direct în Supabase SQL Editor fără a fi salvată mai întâi în repo.
Regula 6: Testare mobilă obligatorie pentru orice change UI
DevTools → 375px (iPhone SE) → verificare vizuală înainte de commit.
________________________________________
CE RĂMÂNE DELIBERAT ÎN AFARA PLANULUI
Item	Motivul excluderii
Offline / PWA	Complexitate ridicată, nu există fundație (Service Worker, IndexedDB). Risc de regresie pe funcționalitatea curentă.
Catalog propriu firmă	Feature majoră din planul Echipă — necesită arhitectură separată, migrare tabel nou, UI complet. Merită milestone propriu.
Gantt / ExecutionTimeCalculator	M15 din roadmap — feature nouă complexă, nu un fix.
Comparator variante constructive	M14 — feature nouă, nu bug.
Rescrierea testimonialelor	Conținut editorial, nu cod. Decizie comercială, nu tehnică.
________________________________________
Primul pas recomandat: Faza A, task A1 — autentificare AI routes. Este izolat, ireversibil în sens pozitiv, și protejează costurile Gemini imediat.

