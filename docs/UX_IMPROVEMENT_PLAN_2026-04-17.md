# 🏗️ Plan Îmbunătățiri UX — Șantier.app
## Data: 17 Aprilie 2026 | Aprobat de utilizator

> **REGULI ABSOLUTE**
> 1. TVA = 21% — NU SE SCHIMBĂ (este corect din 2025)
> 2. NU se atinge nicio funcționalitate existentă care merge corect
> 3. Fiecare milestone se verifică vizual înainte de a trece la următorul
> 4. Customer journey-ul se reverificqă end-to-end la final

---

## MILESTONE 1: Brand & Trust Fixes (Quick Wins)
**Fișiere:** `register/page.tsx`, `login/page.tsx`
**Timp estimat:** 15 min | **Risc:** Zero

### Task 1.1 — Register: Brand "BuildingCalc" → "Șantier"
- [ ] Linia 149: `Building<span>Calc</span>` → `Șanti<span style={{ color:C.orange }}>er</span>`
- [ ] Linia 194: `Building<span>Calc</span>` → `Șanti<span style={{ color:C.orange }}>er</span>`

### Task 1.2 — Register: Logo SVG (casă → hardhat)
- [ ] Liniile 31-34: Înlocuiește SVG-ul de casă cu hardhat-ul corect (identic cu Navigation.tsx / login)
  - **DE LA:** `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>` + `<polyline>`
  - **CĂTRE:** `<path d="M3 18h18" />` + `<path d="M19 18v-1a7 7 0 0 0-14 0v1" />` + `<path d="M12 10V7" />` + `<path d="M9 11V9" />` + `<path d="M15 11V9" />`
  - Ajustează și `size*.55` → `size*0.7` și `strokeWidth="2.2"` → `strokeWidth="2.5"` (consistent cu Navigation)

### Task 1.3 — Register: Statistici vechi "80+" → "1.100+"
- [ ] Linia 43: `'Catalog cu 80+ norme tehnice românești'` → `'Catalog cu 1.100+ norme tehnice românești'`

### Task 1.4 — Login: Statistici vechi "80+" → "1.100+"
- [ ] Linia 33: `{ num: '80+', label: 'norme tehnice în catalog' }` → `{ num: '1.100+', label: 'norme tehnice în catalog' }`

### Task 1.5 — Login: Preț inconsistent "49 lei" → "69 lei"
- [ ] Linia 32: `{ num: '49 lei', label: 'pe lună, fără contract' }` → `{ num: '69 lei', label: 'pe lună, fără contract' }`

### Task 1.6 — Register: Preț/beneficii consistency
- [ ] Linia 179: verifică dacă scrie "14 zile gratuit" (corect conform landing)

### ✅ VERIFICARE MILESTONE 1:
- [ ] Deschide `/auth/register` — verifică: logo hardhat, brand "Șantier", "1.100+ norme", "14 zile gratuit"
- [ ] Deschide `/auth/login` — verifică: "1.100+", "69 lei", brand "Santier" (existent deja)
- [ ] Deschide landing `/#preturi` — compară cu auth pages (prețuri identice)
- [ ] Screenshot ambele pagini pe mobil (768px)

---

## MILESTONE 2: Claritate Interfață Proiect
**Fișiere:** `ProjectClientContainer.tsx`, `ProjectStepper.tsx`
**Timp estimat:** 10 min | **Risc:** Zero

### Task 2.1 — Rename tab "Planificare" → "Editor Deviz"
- [ ] `ProjectClientContainer.tsx` linia 370: `label: 'Planificare'` → `label: 'Editor Deviz'`

### Task 2.2 — Rename tab "Deviz" → "Vizualizare & Export"
- [ ] `ProjectClientContainer.tsx` linia 371: `label: 'Deviz'` → `label: 'Vizualizare & Export'`

### Task 2.3 — ProjectStepper: Rename "Planificare" → "Editare"
- [ ] `ProjectStepper.tsx` linia 16: `label: 'Planificare'` → `label: 'Editare'`
- [ ] `ProjectStepper.tsx` linia 17: `desc: 'Centralizator Lucrări'` rămâne (corect)

### ✅ VERIFICARE MILESTONE 2:
- [ ] Deschide un proiect → verifică: tab-ul zice "Editor Deviz", nu "Planificare"
- [ ] Al doilea tab zice "Vizualizare & Export", nu "Deviz"
- [ ] Stepper-ul arată "Editare", nu "Planificare"
- [ ] Click pe fiecare tab → funcționalitatea e identică

---

## MILESTONE 3: Tooltips pe Coeficienți (Creare Proiect)
**Fișier:** `app/projects/new/page.tsx`
**Timp estimat:** 20 min | **Risc:** Zero

### Task 3.1 — Tooltip pe "Marjă Profit"
- [ ] Sub label (linia 272), adaugă text explicativ:
  `<p className="text-[10px] text-slate-400 mt-1">Procentul tău de câștig peste costul direct. Constructorii mici: 5-10%. Firmele mari: 10-15%.</p>`

### Task 3.2 — Tooltip pe "Cheltuieli Indirecte" (Regie)
- [ ] Sub label (linia 288), adaugă:
  `<p className="text-[10px] text-slate-400 mt-1">Cheltuieli de firmă: chirie, contabilitate, asigurări, uzura sculelor. Uzual: 7-12%.</p>`

### Task 3.3 — Tooltip pe "Cota TVA"
- [ ] Sub label (linia 304), adaugă:
  `<p className="text-[10px] text-slate-400 mt-1">TVA conform legislației în vigoare. Din 2025: 21% standard.</p>`

### Task 3.4 — Ascunde "Taxe manoperă" sub un collapsed "Avansat"
- [ ] Mută câmpul "taxe_manopera" (2.25%) într-un colapsibil cu label "Setări avansate"
- [ ] Default: collapsed/ascuns

### Task 3.5 — Ascunde "Venit Estimat Proiect" din creare
- [ ] Mută câmpul `total_estimated_revenue` în secțiunea "Avansat" colapsibilă
- [ ] Sau: mută-l direct în proiect (tab Status) unde e contextual relevant

### ✅ VERIFICARE MILESTONE 3:
- [ ] Deschide `/projects/new` — verifică fiecare tooltip vizibil
- [ ] Câmpul "Taxe manoperă" nu e vizibil la prima interacțiune
- [ ] "Venit Estimat" nu e vizibil la prima vizualizare (dar accesibil prin "Avansat")
- [ ] Creează proiect nou → totul merge corect, valorile default sunt: profit=5, regie=10, tva=21

---

## MILESTONE 4: Affordance Editor Deviz
**Fișier:** `EstimateEditor.tsx`
**Timp estimat:** 30 min | **Risc:** Mic

### Task 4.1 — Buton vizibil "Editează rețeta" pe fiecare rând
- [ ] Lângă chevron-ul de expand (linia ~378), adaugă un label vizibil:
  - Text mic: "Rețetă ▸" sau "✏️ Rețetă" 
  - Vizibil permanent, nu doar la hover
  - Înlocuiește chevron-ul solitar cu un buton contextual clar

### Task 4.2 — Preview resurse condensat (fără expand)
- [ ] Sub numele articolului (după linia ~292), adaugă un text mic:
  - Ex: "3 materiale · 1 manoperă · 1 utilaj" — calculat din resourcesOverride
  - Clicabil → expandează rândul

### Task 4.3 — Badge "Rețetă personalizată" pe articole modificate
- [ ] Dacă `line.resources_override?.length > 0` și diferă de varianta din catalog:
  - Badge mic portocaliu: "Modificat" sau "Personalizat"
  - Vizibil lângă cod normativ

### ✅ VERIFICARE MILESTONE 4:
- [ ] Deschide un proiect cu articole → fiecare rând arată: preview resurse + buton "Rețetă"
- [ ] Click pe "Rețetă" → expandează identic cu funcționarea actuală
- [ ] Articolele unde s-au editat resurse arată badge "Personalizat"
- [ ] Pe mobil (375px): totul e accesibil cu degetul (min 44×44 touch target)

---

## MILESTONE 5: Note pe Resurse + Search Deviz
**Fișiere:** `EstimateEditor.tsx`, `ProjectClientContainer.tsx`
**Timp estimat:** 45 min | **Risc:** Mic-Mediu

### Task 5.1 — Câmp "Notă" per resursă
- [ ] În fiecare rând de resursă expandat (după preț unitar, linia ~530):
  - Input text mic: placeholder "Notă: ex. am luat OSB în loc de tego"
  - Salvat în `resources_override[i].note` (câmp nou, string opțional)
  - Afișat în vizualizarea Deviz ca text italic sub numele resursei

### Task 5.2 — Căutare rapidă în tot devizul
- [ ] Deasupra "Centralizator Lucrări" (linia ~237), adaugă un `<input type="search">`
  - Placeholder: "Caută articol sau resursă în deviz..."
  - Filtrează vizual liniile: match pe `name`, `manual_name`, sau oricare `resources_override[].name`
  - La search activ, toate etapele se expandează automat

### ✅ VERIFICARE MILESTONE 5:
- [ ] Expandează o resursă → câmpul "Notă" apare, poate fi completat, se salvează (auto-save)
- [ ] Search "OSB" → se filtrează doar liniile/resursele care conțin "OSB"
- [ ] Clear search → toate liniile reapar
- [ ] Pe mobil: căutarea e funcțională

---

## MILESTONE 6: Alertă Buget Persistentă + WhatsApp
**Fișiere:** `ProjectClientContainer.tsx`, `ProjectDashboard.tsx`
**Timp estimat:** 40 min | **Risc:** Mediu

### Task 6.1 — Alertă buget persistentă (nu dismiss)
- [ ] Înlocuiește alertă dismissible cu jurnal persistent
- [ ] Stochează alertele în state: `budgetAlerts: Array<{stage, exceeded, impact, date, resolved}>`
- [ ] Dashboard: secțiune "Istoric Alerte" cu status Nerezolvat/Rezolvat
- [ ] Badge roșu pe tab-ul "Status" dacă sunt alerte nerezolvate

### Task 6.2 — Link WhatsApp din alertă
- [ ] Buton în alertă: "📱 Trimite pe WhatsApp"
- [ ] Generează link: `https://wa.me/?text=⚠️ Etapa ${stage} a depășit bugetul cu ${exceeded} lei. Detalii: ${shareUrl}`
- [ ] Share URL se ia din `handleShare()` existent (public_token)

### ✅ VERIFICARE MILESTONE 6:
- [ ] Înregistrează o achiziție ce depășește bugetul → apare alertă
- [ ] Alerta NU dispare la refresh
- [ ] Buton WhatsApp funcțional (deschide WhatsApp cu mesajul pre-completat)
- [ ] Tab "Status" arată badge dacă există alerte nerezolvate

---

## MILESTONE 7: Onboarding — Proiect Demo
**Fișiere:** `app/projects/page.tsx`, posibil API route
**Timp estimat:** 60 min | **Risc:** Mediu

### Task 7.1 — Detectare utilizator nou
- [ ] În `/projects/page.tsx`: dacă `projects.length === 0` ȘI este prima vizită (localStorage flag):
  - Arată welcome banner: "Bine ai venit pe Șantier.app! 👷"
  - 3 opțiuni: "Vezi un exemplu de deviz" | "Creează manual" | "Smart Calculator"

### Task 7.2 — Proiect demo pre-populat
- [ ] Buton "Vezi exemplu" → creează proiect:
  - Nume: "Vila P+1 Demo — 150 mp (exemplu)"
  - 10-15 articole pre-populate (din catalog_norms cele mai comune: fundație, zidărie, tencuială etc.)
  - Badge vizibil: "📘 DEMO — Poți șterge oricând"
  - Settings default: profit 10%, regie 10%, tva 21%

### ✅ VERIFICARE MILESTONE 7:
- [ ] Register → redirect la `/projects` → BUN VENIT apare
- [ ] Click "Vezi exemplu" → proiect demo creat cu articole
- [ ] Proiectul demo are badge "DEMO"
- [ ] A doua vizită pe `/projects` → welcomeul NU mai apare

---

## MILESTONE 8: Progressive Tab Disclosure
**Fișier:** `ProjectClientContainer.tsx`
**Timp estimat:** 20 min | **Risc:** Mic

### Task 8.1 — Tab-uri progresive
- [ ] Proiect nou (0 linii, 0 achiziții): arată doar "Editor Deviz"
- [ ] Cu linii (>0 linii): arată "Editor Deviz" + "Vizualizare & Export" + "Cronologie"
- [ ] Cu achiziții (>0): arată toate 5 tab-urile
- [ ] Tab-urile ascunse nu sunt accesibile, dar au un hint „Disponibil după..."

### ✅ VERIFICARE MILESTONE 8:
- [ ] Proiect nou → 1 tab vizibil
- [ ] Adaugă un articol → apar 3 tab-uri
- [ ] Adaugă o achiziție → apar toate 5
- [ ] Funcționalitate intactă

---

## VERIFICARE FINALĂ — CUSTOMER JOURNEY END-TO-END

- [ ] **Landing** → Calculator funcțional → "Creează deviz" → register
- [ ] **Register** → Brand corect, logo corect, stats corecte, preț corect
- [ ] **Login** → Stats corecte, preț corect
- [ ] **Projects (gol)** → Welcome banner cu 3 opțiuni
- [ ] **Proiect Demo** → Badge vizibil, articole pre-populate
- [ ] **Proiect Nou** → Tooltips pe coeficienți, câmpuri avansate ascunse
- [ ] **Editor Deviz** → Preview resurse, buton "Rețetă", badge "Personalizat"
- [ ] **Editare rețetă** → Note per resursă, search rapid
- [ ] **Vizualizare & Export** → PDF/Excel/CSV funcționale
- [ ] **Achiziții** → Alertă persistentă, WhatsApp functional
- [ ] **Tab-uri** → Progressive disclosure funcțional
- [ ] **Mobil (375px)** → Tot flow-ul e utilizabil cu degetul

---

## NOTE TEHNICE

### CE NU SE ATINGE:
- ❌ TVA (21% = corect)
- ❌ Motor de calcul (`estimate.ts`, `financials.ts`)
- ❌ Schema DB Supabase
- ❌ Middleware auth
- ❌ Export PDF/Excel/CSV
- ❌ Smart Calculator logic
- ❌ HeroCalculator (calculatorul de pe landing)
- ❌ Prețurile din HeroCalculator (800/1100/1500 EUR/mp rămân)
- ❌ Navigation component (e corect)
- ❌ Supabase storage / foto achiziții

### CE SE ADAUGĂ (fără a modifica existent):
- Tooltips (text sub câmpuri existente)
- Note resurse (câmp nou opțional în resources_override)
- Search deviz (input nou deasupra listei)
- Alerte persistente (state array, nu single)
- Badge-uri vizuale (CSS/mini-componente)
- Welcome banner (condiționat de projects.length === 0)
