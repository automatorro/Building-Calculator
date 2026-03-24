# CLAUDE_CODE_MASTER.md — BuildingCalc v3 Final
# ══════════════════════════════════════════════════════════════
# CITEȘTE ACEST FIȘIER COMPLET ÎNAINTE DE ORICE ACȚIUNE.
# DUPĂ FIECARE TASK COMPLETAT, BIFEAZĂ [x] ÎN PROGRESS TRACKER.
# ══════════════════════════════════════════════════════════════
# Consolidat din 3 surse: "Verificarea promisiunilor" (23 mar),
# "Integrarea instrucțiunilor" (24 mar), "Fluxul UX pe șantier" (24 mar)
# ══════════════════════════════════════════════════════════════

## 1. IDENTITATE PROIECT

- **Produs:** BuildingCalc — devize construcții pentru constructori mici din România
- **Repo:** https://github.com/automatorro/building-calculator
- **Stack:** Next.js 16 App Router · TypeScript · Supabase · Tailwind CSS v4 · Framer Motion · Lucide React
- **Deploy:** Netlify (buildingcalculator.netlify.app)
- **Target:** Constructori 3-15 angajați, rezidențial, România

---

## 2. REGULI ABSOLUTE — ÎNCALCAREA = OPRIRE IMEDIATĂ

### ⛔ NU MODIFICA aceste fișiere:
```
utils/calculators/estimate.ts      ← motor calcul deviz, CORECT ȘI COMPLET
utils/calculators/financials.ts    ← motor financiar, CORECT ȘI COMPLET
middleware.ts                      ← protecție rute, COMPLET
supabase/schema.sql                ← doar CITEȘTE, nu modifica direct
```

### ⛔ NU FACE niciodată:
- NU rescrie componente mari (ProjectClientContainer, EstimateEditor) — le EXTINDE
- NU schimba structura tabelelor existente — doar ADD COLUMN cu IF NOT EXISTS
- NU șterge nicio pagină sau componentă existentă
- NU adăuga dependențe npm fără să verifici dacă există deja o soluție
- NU face push la Supabase — SQL-urile se scriu în `supabase/migrations/` și se rulează manual
- NU rescrie CSS când task-ul e despre logică și invers
- NU combina mai multe task-uri într-o singură sesiune

### Workflow OBLIGATORIU per task:
```
1. bash scripts/guard.sh pre          ← vezi unde ești
2. cat [fișierele din task]           ← citește ÎNAINTE de a scrie
3. [fă DOAR modificarea descrisă]    ← nimic extra
4. npm run build                      ← obligatoriu
5. bash scripts/guard.sh post         ← verifică tot automat
6. [dacă PASS] → bifează [x] + git commit -m "M1.bug2: fix order column"
7. [dacă FAIL] → fix build → post din nou → nu trece la alt task
```

### Reguli de sesiune:
- **Un task per commit.** Format: `M[n].[task]: descriere — fișiere atinse`
- **Ordinea e SACRĂ.** Nu sări la M3 dacă M2.V nu e bifat `[x]`.
- **Dacă durează >30 min:** Oprește-te. Commitează ce ai. Documentează ce lipsește.
- **Dacă nu ești sigur:** Întreabă utilizatorul. NU presupune. NU inventa.
- **Build eșuat = prioritate maximă.** Nu trece la alt task cu build-ul spart.

---

## 3. VALORI FIXE — NU MODIFICA

```
TVA standard (România, din 1 aug 2025):  21%   ← NU 19%!
TVA redus (locuințe sociale):             11%   ← NU 5% sau 9%!
TVA tranzitoriu (până 1 aug 2026):         9%   ← doar cu avans plătit înainte 1 aug 2025
Stack: Next.js 16, Supabase, Tailwind v4, Framer Motion
Supabase: vwcwsxvmkxmcwjtlikcq.supabase.co
```

---

## 4. STRUCTURA REPO CONFIRMATĂ

```
app/
├── (dashboard)/                     ← rute mock, se reconectează la M3
├── auth/login, register, forgot     ← EXISTĂ, verifică dacă e conectat
├── catalog/page.tsx                 ← citește din tabelele VECHI → fix la M2
├── projects/[id]/page.tsx           ← proiect real cu toate componentele
├── projects/[id]/print/             ← verifică dacă are conținut
├── projects/new/page.tsx            ← creare proiect cu coeficienți
├── share/[token]/page.tsx           ← DE CREAT la M8
└── page.tsx                         ← landing page

components/
├── EstimateEditor.tsx               ← editor deviz — NU RESCRIE, EXTINDE
├── ProjectClientContainer.tsx       ← container tabs — NU RESCRIE, EXTINDE
├── ProjectDashboard.tsx             ← financiar live
├── SmartCalculator.tsx              ← calculator dimensiuni
├── VendorOfferPicker.tsx            ← comparator furnizori
├── sidebar.tsx                      ← ⚠️ LINK-URI HARDCODATE → fix la M3
└── [restul componentelor]

utils/calculators/
├── estimate.ts                      ← ⛔ NU ATINGE
└── financials.ts                    ← ⛔ NU ATINGE

supabase/
├── schema.sql                       ← citește, nu modifica
└── migrations/                      ← SQL-uri generate, rulate manual de utilizator

CLAUDE.md                            ← citit automat de Claude Code
CLAUDE_CODE_MASTER.md                ← EȘTI AICI
FIXES_CLAUDE_CODE.md                 ← bug-uri detaliate
scripts/guard.sh                     ← verificare pre/post task
.githooks/pre-commit                 ← blochează commit pe fișiere protejate
```

---

## 5. PROGRESS TRACKER

> Format commit: `M[milestone].[task]: descriere — fișiere atinse`

### MILESTONE 0 — Audit inițial (OBLIGATORIU PRIMUL)
- [ ] **M0.audit** — Citire fișiere critice FĂRĂ modificări: sidebar.tsx, topbar.tsx, ProjectClientContainer.tsx, projects/[id]/page.tsx, auth/login/page.tsx, schema.sql, middleware.ts, catalog/page.tsx, CatalogFilter.tsx

### MILESTONE 1 — Bug-uri blocante (din FIXES_CLAUDE_CODE.md)
- [ ] **M1.bug2** — Fix `.order('created_at')` în `projects/[id]/page.tsx` (1 linie)
- [ ] **M1.bug1** — Fix UUID complet în `projects/page.tsx` (1 linie)
- [ ] **M1.bug3** — Fix `key={activeTab}` în `ProjectClientContainer.tsx` (1 linie)
- [ ] **M1.bug5** — Standardizare settings {tva: 21, regie, profit, taxe_manopera} pretutindeni
- [ ] **M1.bug4** — Fix flux estimate_lines: CatalogFilter → insert cu catalog_norm_id → EstimateEditor citește corect
- [ ] **M1.seed** — Generare `supabase/seed_catalog_full.sql` backup
- [ ] **M1.V** — ✅ VERIFICARE: Proiect se deschide, tab-uri funcționează, catalog arată norme, deviz primește linii

### MILESTONE 2 — Catalog real funcțional
- [ ] **M2.sql** — Generează `supabase/migrations/001_catalog_norms_seed.sql` (dacă nu există deja în DB)
- [ ] **M2.page** — Actualizează `catalog/page.tsx`: query pe `catalog_norms` în loc de `items`/`categories`
- [ ] **M2.filter** — Actualizează `CatalogFilter.tsx`: props aliniate la catalog_norms (symbol, unit, unit_price, category)
- [ ] **M2.V** — ✅ VERIFICARE: Catalogul arată norme reale, search funcționează, categorii corecte

### MILESTONE 3 — Sidebar conectat la proiecte reale
- [ ] **M3.sidebar** — Modifică `sidebar.tsx`: link-uri dinamice bazate pe `usePathname()` + projectId
- [ ] **M3.layout** — Verifică/actualizează `(dashboard)/layout.tsx`: sidebar primește context proiect
- [ ] **M3.V** — ✅ VERIFICARE: Din `/projects/[id]`, sidebar-ul duce la tab-uri reale, nu la mock-uri

### MILESTONE 4 — Export PDF real
- [ ] **M4.print** — Creează/completează `projects/[id]/print/page.tsx`: Server Component, layout A4, tabel deviz standard românesc, recapitulație cu coeficienți (regie, profit, TVA 21%), antet firmă
- [ ] **M4.css** — Stiluri `@media print` în globals.css (fără navbar/sidebar la print)
- [ ] **M4.btn** — Buton "Export PDF" în `ProjectActions.tsx` care deschide `/projects/[id]/print`
- [ ] **M4.V** — ✅ VERIFICARE: Pagina print se deschide, arată corect pe A4, browser print dă PDF util

### MILESTONE 5 — Auth complet
- [ ] **M5.audit** — Citește `auth/login/page.tsx` și `register/page.tsx` — verifică dacă sunt conectate la Supabase Auth
- [ ] **M5.login** — Dacă incomplet: conectează `supabase.auth.signInWithPassword()`, redirect `/projects`, erori
- [ ] **M5.register** — Dacă incomplet: conectează `supabase.auth.signUp()`, creare profil automată
- [ ] **M5.sql** — Generează `supabase/migrations/002_user_profiles.sql`: CREATE TABLE profiles + trigger
- [ ] **M5.V** — ✅ VERIFICARE: Login/register funcționează end-to-end

### MILESTONE 6 — Discount B2B + Pierderi tehnologice
- [ ] **M6.audit** — Citește `ProjectDevizView.tsx` și `EstimateEditor.tsx`
- [ ] **M6.slider** — Adaugă slider discount B2B (0-40%) și toggle pierderi în componenta de deviz
- [ ] **M6.calc** — Funcția `pretEfectiv(linie)` cu PIERDERI per categorie: faianta 8%, tencuiala 5%, beton 3%, etc.
- [ ] **M6.V** — ✅ VERIFICARE: Slider modifică totaluri vizibil, toggle pierderi adaugă/elimină coeficienți
- **CE NU SE SCHIMBĂ:** estimate.ts, financials.ts. Discountul e DOAR UI local, nu modifică DB.

### MILESTONE 7 — SmartCalculator / Generator deviz din lucrare
- [ ] **M7.audit** — Citește `SmartCalculator.tsx` și `ProjectStagesManager.tsx`
- [ ] **M7.wizard** — Wizard cu: Ce devizezi? (casă/renovare/specific) → Parametri (suprafață, etaje) → Preview etape
- [ ] **M7.calc** — Conectează dimensiuni la `HOUSE_TEMPLATE_SYMBOLS` din `catalog-integration.ts` → generare automată linii deviz
- [ ] **M7.V** — ✅ VERIFICARE: Introduci 120mp → generează fundație+structură+zidărie cu cantități corecte

### MILESTONE 8 — Link public beneficiar
- [ ] **M8.sql** — `supabase/migrations/003_public_share.sql`: ALTER TABLE projects ADD public_token UUID, public_share_enabled BOOLEAN
- [ ] **M8.share** — Creează `app/share/[token]/page.tsx`: pagină publică fără auth, deviz simplificat (FĂRĂ coduri, FĂRĂ prețuri unitare, FĂRĂ profit)
- [ ] **M8.btn** — Buton "Partajează cu beneficiarul" în ProjectActions.tsx
- [ ] **M8.V** — ✅ VERIFICARE: Link funcționează fără login, arată deviz simplificat cu etape+totaluri

### MILESTONE 9 — Export Excel/CSV
- [ ] **M9.excel** — Funcție `exportToExcel` în ProjectActions.tsx cu SheetJS: Nr, Cod, Descriere, UM, Cantitate, Preț, Total + rând TOTAL
- [ ] **M9.V** — ✅ VERIFICARE: Buton exportă .xlsx cu toate liniile devizului

### MILESTONE 10 — Curățare module mock
- [ ] **M10.redirects** — Paginile mock (/estimator/current, /deviz/current, etc.) redirecționează la `/projects` cu mesaj "Selectează un proiect"
- [ ] **M10.V** — ✅ VERIFICARE: Nicio rută mock nu mai arată date hardcodate

### MILESTONE 11 — Design system unificat
- [ ] **M11.css** — Variables noi în globals.css (fără glassmorphism), font DM Sans + DM Serif Display, portocaliu #E8500A
- [ ] **M11.nav** — Navigation.tsx: nav profesional cu fundal --black
- [ ] **M11.projects** — Lista proiecte cu carduri noi
- [ ] **M11.auth** — Layout split auth (dark/light)
- [ ] **M11.V** — ✅ VERIFICARE: Design consistent, fonturi corecte, zero glassmorphism
- **CE NU SE SCHIMBĂ:** Logica din nicio componentă. DOAR CSS/layout.

---

## 6. MILESTONE-URI NOI (din sesiunea UX pe șantier)

### MILESTONE 12 — Dashboard dimineață + Alerte depășire buget
- [ ] **M12.kpi** — Adaugă delta zilnic pe cele 4 KPI-uri din ProjectDashboard.tsx (cât s-a schimbat azi vs. ieri)
- [ ] **M12.todo** — Tab nou "Azi pe șantier" în ProjectClientContainer: lucrări programate, materiale de comandat, echipa zilei
- [ ] **M12.alert** — În `handleAddPurchase` din ProjectClientContainer.tsx: după insert, verifică dacă noua deviere pe etapă trece un prag (>5% → danger, >0% → warning), afișează modal persistent cu 3 opțiuni: ajustează deviz / renegociază / accept depășirea
- [ ] **M12.forecast** — Secțiune "Forecast 30 zile" cu etapele cu zero cheltuieli → cât mai trebuie cheltuit
- [ ] **M12.V** — ✅ VERIFICARE: Dashboard arată delta zilnic, alerta apare la depășire, tab "Azi" funcționează
- **CE NU SE SCHIMBĂ:** financials.ts (alertele se calculează DEJA acolo, doar afișarea lipsește)

### MILESTONE 13 — Actualizare masivă prețuri
- [ ] **M13.modal** — Creează `BulkPriceUpdateModal.tsx`: selectează tip resursă (beton/fier/lemn/material/manoperă) → introduce % → preview resurse afectate → aplică pe tot proiectul
- [ ] **M13.apply** — Aplică prin iterare estimate_lines → resources_override → custom_prices[res.id] = res.unit_price * (1 + pct/100)
- [ ] **M13.btn** — Buton "Actualizează prețuri în masă" în ProjectActions.tsx sau EstimateEditor.tsx
- [ ] **M13.V** — ✅ VERIFICARE: Selectezi "beton" +10%, vezi preview, aplici, totalul devizului crește
- **CE NU SE SCHIMBĂ:** estimate.ts. Prețurile se scriu în custom_prices (client-side), recalcularea e prin calculateLineCosts existent.

### MILESTONE 14 — Comparator variante constructive
- [ ] **M14.comp** — Creează `VariantComparator.tsx`: selectează 2 articole din catalog → side-by-side cu cost/mp, durată, termoizolație
- [ ] **M14.norms** — Fișier `execution-norms.ts` cu norme productivitate/om/zi: BCA 3.2mp, Porotherm 2.1mp, tencuială manuală 6mp, etc.
- [ ] **M14.swap** — Buton "Înlocuiește în deviz" care face swap articol vechi → articol nou în estimate_lines
- [ ] **M14.V** — ✅ VERIFICARE: Compari BCA vs Porotherm, vezi diferența de cost+timp, poți face swap în deviz

### MILESTONE 15 — Calculator timp execuție + Gantt simplu
- [ ] **M15.calc** — Componenta `ExecutionTimeCalculator.tsx`: per etapă → input nr. muncitori → `zile = ceil(cantitate / (norma * muncitori))` → total zile proiect
- [ ] **M15.gantt** — Gantt automat generat din duratele calculate (bare orizontale secvențiale per etapă)
- [ ] **M15.stages** — Stochează nr. muncitori per etapă în JSONB `stages` din projects (câmp `crew_size`)
- [ ] **M15.V** — ✅ VERIFICARE: Schimbi nr. muncitori → durata se recalculează → Gantt se actualizează

### MILESTONE 16 — Import Excel complet
- [ ] **M16.modal** — Creează `ImportExtrasModal.tsx`: upload fișier → parsare SheetJS → preview primelor 10 rânduri
- [ ] **M16.map** — Auto-detectare coloane (descriere, cantitate, UM) + mapare manuală
- [ ] **M16.match** — Matching cu catalog_norms: caută simbolul sau denumirea → pre-selectează norma
- [ ] **M16.insert** — Bulk insert în estimate_lines cu `metadata.source = 'import'`
- [ ] **M16.V** — ✅ VERIFICARE: Upload Excel cu 10 rânduri → mapare → preview → confirmare → 10 linii în deviz

### MILESTONE 17 — Jurnal de șantier
- [ ] **M17.sql** — `supabase/migrations/004_journal_entries.sql`: CREATE TABLE journal_entries (id, project_id, date, entry_type ENUM crew/work/weather/note/problem, stage_name, estimate_line_id, data JSONB, photos TEXT[], created_at)
- [ ] **M17.ui** — Creează `SiteJournal.tsx` cu 4 tab-uri: Echipă (prezență), Lucrări (legate de deviz cu progress %), Cronologic (timeline), Export
- [ ] **M17.link** — Legătură bidirecțională: lucrare marcată completă → articol deviz actualizat cu progress_pct
- [ ] **M17.export** — Export situație de lucrări PDF: rezumat pe zile, lucrări grupate pe etape, fotografii
- [ ] **M17.V** — ✅ VERIFICARE: Adaugi intrare jurnal → apare în cronologie → articolul deviz arată progresul

### MILESTONE 18 — Foto achiziții
- [ ] **M18.bucket** — Creare bucket Supabase Storage `purchase-photos` (public read, auth write)
- [ ] **M18.sql** — ALTER TABLE purchases ADD photos TEXT[] DEFAULT '{}'
- [ ] **M18.upload** — Modifică PurchaseFormModal: câmp upload imagini (max 3), upload la Storage, salvare URLs
- [ ] **M18.V** — ✅ VERIFICARE: Înregistrezi achiziție cu 2 poze → apar în lista de achiziții

---

## 7. INSTRUCȚIUNI DETALIATE PER MILESTONE

### M1 — Bug-uri blocante
Citește `FIXES_CLAUDE_CODE.md` pentru detalii exacte per bug.
**Ordinea e importantă:** bug2 → bug1 → bug3 → bug5 → bug4 → seed.
Bug4 e cel mai complex (flux catalog → estimate_lines). Restul sunt fix-uri de 1 linie.

### M2 — Catalog real
**Ce citești mai întâi:**
```bash
cat app/catalog/page.tsx
cat components/CatalogFilter.tsx
cat supabase/schema.sql | grep -A 20 "catalog_norms"
```
**Ce faci:** Înlocuiești query-urile pe `items`/`categories`/`normatives` cu query pe `catalog_norms`.
**Ce NU faci:** Nu atingi estimate.ts, nu schimbi structura catalog_norms.

### M4 — Export PDF
**Layout obligatoriu:**
1. Antet: nume firmă, CUI, adresă | "Deviz de lucrări" + nume proiect + dată
2. Tabel: Nr | Simbol | Descriere | UM | Cantitate | Preț unitar | Total
3. Grupat pe etape (header colorat per etapă)
4. Recapitulație: Cost direct → Regie X% → Profit X% → TVA 21% → TOTAL
5. Footer: loc semnătură

### M6 — Discount B2B
```typescript
const PIERDERI: Record<string, number> = {
  'faianta': 0.08, 'gresie': 0.08, 'tencuiala': 0.05,
  'vopsitorie': 0.10, 'beton armat': 0.03, 'cofraj': 0.05,
  'zidarie': 0.04, 'BCA': 0.04, 'acoperis': 0.06,
  'tamplarie': 0.02, 'default': 0.05,
}
// Discountul se aplică DOAR pe materiale, nu pe manoperă
function pretEfectiv(linie) {
  const pierdereFactor = includePierderi ? (1 + (PIERDERI[linie.category] ?? 0.05)) : 1
  const discountFactor = 1 - (discountB2B / 100)
  if (linie.resource_type === 'material') return linie.unit_price * pierdereFactor * discountFactor
  return linie.unit_price * pierdereFactor
}
```

### M8 — Link beneficiar
**Pagina publică NU include:** coduri normative, prețuri unitare, rețete resurse, procent profit, procent regie.
**Include:** titlu proiect, etape cu totaluri, recapitulație simplificată, total general cu TVA.

### M12 — Alertă depășire buget
**Praguri (din financials.ts existent):**
- `spent/planned > 0.90` → info (aproape de limită)
- `percent > 0 && <= 5` → warning (ușor peste buget)
- `percent > 5` → danger (depășire)
- `marginPercent < 5` → critic (profitabilitate critică)
**Modalul e PERSISTENT** — nu auto-dismiss. 3 opțiuni: Ajustează devizul / Renegociază / Accept.

### M15 — Norme productivitate
```typescript
const EXECUTION_NORMS = {
  'sapatura_manuala': { norm_per_day: 2.5, unit: 'mc' },
  'cofraj_fundatii': { norm_per_day: 4.0, unit: 'mp' },
  'armatura_6_10': { norm_per_day: 120, unit: 'kg' },
  'turnare_beton_pompa': { norm_per_day: 12, unit: 'mc' },
  'zidarie_BCA_30': { norm_per_day: 3.2, unit: 'mp' },
  'zidarie_porotherm': { norm_per_day: 2.1, unit: 'mp' },
  'tencuiala_manuala': { norm_per_day: 6, unit: 'mp' },
  'tencuiala_mecanizata': { norm_per_day: 18, unit: 'mp' },
  'montare_gresie': { norm_per_day: 5, unit: 'mp' },
  'sarpanta': { norm_per_day: 0.8, unit: 'mc' },
  'invelitoare_tabla': { norm_per_day: 10, unit: 'mp' },
  'termosistem_EPS': { norm_per_day: 4, unit: 'mp' },
}
// Formula: zile = Math.ceil(cantitate / (norma * nr_muncitori))
```

---

## 8. MIGRĂRI SQL NECESARE (rulate manual de utilizator)

| Fișier | Conținut | Când |
|---|---|---|
| `001_catalog_norms_seed.sql` | CREATE TABLE + INSERT norme | M2 |
| `002_user_profiles.sql` | profiles + trigger on_auth_user_created | M5 |
| `003_public_share.sql` | public_token, public_share_enabled pe projects | M8 |
| `004_journal_entries.sql` | CREATE TABLE journal_entries | M17 |

Verifică cu `IF NOT EXISTS` peste tot. Nu rescrie tabele existente.

---

## 9. ORDINE RECOMANDATĂ PE ZILE

```
Ziua 1 (4-5h):
  M0.audit → M1.bug2 → M1.bug1 → M1.bug3 → M1.bug5 → M1.bug4 → M1.seed → M1.V

Ziua 2 (4-5h):
  M2.sql → M2.page → M2.filter → M2.V → M3.sidebar → M3.layout → M3.V

Ziua 3 (5-6h):
  M4.print → M4.css → M4.btn → M4.V → M5.audit → M5.login → M5.register → M5.sql → M5.V

Ziua 4 (5-6h):
  M6.audit → M6.slider → M6.calc → M6.V → M7.audit → M7.wizard → M7.calc → M7.V

Ziua 5 (4-5h):
  M8.sql → M8.share → M8.btn → M8.V → M9.excel → M9.V

Ziua 6 (4-5h):
  M10.redirects → M10.V → M11.css → M11.nav → M11.projects → M11.auth → M11.V

Ziua 7 (5-6h):
  M12.kpi → M12.todo → M12.alert → M12.forecast → M12.V

Ziua 8 (4-5h):
  M13.modal → M13.apply → M13.btn → M13.V → M14.comp → M14.norms → M14.swap → M14.V

Ziua 9 (5-6h):
  M15.calc → M15.gantt → M15.stages → M15.V → M16.modal → M16.map → M16.match → M16.insert → M16.V

Ziua 10 (4-5h):
  M17.sql → M17.ui → M17.link → M17.export → M17.V → M18.bucket → M18.sql → M18.upload → M18.V
```

---

## 10. OBICEIURI RECOMANDATE PENTRU UTILIZATOR (Lucian)

1. **Sesiuni scurte.** Nu "implementează M7 complet". Ci "fă M7.wizard". Verifici. Apoi "fă M7.calc".
2. **`git diff` înainte de accept.** Dacă vezi fișiere pe care nu le așteptai → întreabă.
3. **Branch per milestone:** `feat/m1-bugfixes`, `feat/m2-catalog`. Revert ușor dacă ceva dă peste cap.
4. **La task-urile de verificare (M1.V, M2.V):** TU testezi în browser, nu Claude Code.
5. **Comanda de start sesiune:** "Citește CLAUDE.md și continuă cu următorul task nebifat."

---

*Document generat 24 martie 2026. Consolidează: BUILDINGCALC_CLAUDE_CODE_PLAN.md,
sistemul de protecție din "Verificarea promisiunilor", funcționalitățile UX din
"Fluxul logic pe șantier", și corecțiile TVA (21%/11%) din Legea 141/2025.*
