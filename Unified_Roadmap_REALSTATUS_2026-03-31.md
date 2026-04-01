# Unified Roadmap (REAL STATUS) — BuildingCalc / santier.app
Data: 2026-03-31

Acest document reconciliază două planuri existente și statusul real observabil în repo, fără să rescrie sau să înlocuiască nimic:
- `CLAUDE_CODE_MASTER.md` (milestone-uri M0–M18, orientat pe execuție granulară)
- `Master_Implementation_Plan.md` (Faze A–D, orientat pe MVP + arhitectură V4)

Scopul este să evităm suprapuneri, contradicții și muncă duplicată, folosind ca referință statusul real din cod și schema locală (`supabase/schema.sql`).

---

## 1) Surse și “REAL STATUS” înseamnă

### Surse citite pentru status
- `app/page.tsx` (promisiuni landing)
- `components/EstimateEditor.tsx`, `components/ProjectClientContainer.tsx`, `components/ProjectActions.tsx`, `components/SmartCalculator.tsx`, `components/ProjectTimeline.tsx`
- `supabase/schema.sql` + `supabase/migrations/*` (diferențe între schema locală și migrații)

### Definiție “REAL STATUS”
- “Există în repo” = e implementat în cod / definit în `schema.sql`.
- “Livrat în Supabase live” = necesită confirmare manuală, deoarece migrațiile nu acoperă tot ce e în `schema.sql` și planurile cer rollout manual.

---

## 2) Snapshot: ce e LIVRAT azi (observabil în repo)

### Promisiuni landing: livrate
- Deviz + editare rețete/resurse/prețuri în UI (EstimateEditor).
- Achiziții reale per etapă + calcul deviații (ProjectClientContainer + motor financiar protejat).
- Export PDF (print page).
- Export Excel/CSV (funcționalitate prezentă în UI, nu neapărat ca buton dedicat în “Operații”).
- Link public read-only beneficiar (token + pagină publică + buton de share în ProjectActions).
- Smart Calc: wizard + bulk insert în `estimate_lines`, plus buton promovat separat (nu doar în dropdown).
- Timeline (Gantt simplu): read-only, fără drag&drop, durate calculate dintr-un set de durate default.
- Comparator prețuri furnizori (nivel “picker” pe resursă): există `vendor_offers` + UI de selecție.

### Promisiuni landing: nelivrate / parțial livrate
- Foto la fiecare achiziție: nu există câmp dedicat “photos” în `purchases` în schema locală și nu există flow de upload în UI.
- Import “Extras” generic CSV/Excel cu mapare + tabel intermediar de revizie: există OCR pentru un caz specific (armare) dar nu un parser general cu “revizie”.
- “Alerte depășire buget” ca workflow persistent (modal cu decizie + audit): în cod există alertare, dar nu modalul persistent cu 3 opțiuni cerut în M12.
- “Planuri” (Free/Constructor/Echipă) ca gating runtime: sunt prezentate pe landing, dar nu există enforcement identificat în cod.

---

## 3) Comparația dintre cele două planuri (fără suprapuneri)

### 3.1 Ce este deja depășit (DONE în repo) și apare ca TODO în planuri
Acestea nu trebuie planificate din nou:
- Catalog “real” (query pe `catalog_norms`) și seed-ul de norme: implementate în repo (există migrarea seed + pagină catalog).
- Sidebar conectat la proiect: implementat (dinamic, pe projectId).
- Export PDF: implementat (print route).
- Auth: implementat (login/înregistrare/forgot există în app).
- Link public beneficiar: implementat (003 + UI + public page).
- Export Excel/CSV: există în UI de proiect (chiar dacă în planul vechi era ca task separat).
- Smart Calc “promovat”: implementat ca buton separat în ProjectActions (aliniat cu Master Plan Faza C).
- Timeline “read-only”: implementat (aliniat cu Master Plan Faza C).

### 3.2 Suprapuneri directe: cum le tratăm ca să nu antagonizeze
Regulă: păstrăm o singură “sursă de execuție” pe fiecare subiect; cealaltă devine referință.

#### (A) Stabilizare DB
- În `Master_Implementation_Plan.md`: Faza A cere 3 intervenții SQL (resources_override, purchases.date, shops RLS).
- În `CLAUDE_CODE_MASTER.md`: există secțiune “Migrări SQL necesare”, dar nu enumeră explicit cele 3 puncte din Faza A.
Decizie: folosim Faza A ca “cadru”, iar în execuție etichetăm task-urile ca “A.*” (nu ca milestone M), pentru că sunt prerechizite operaționale și se rulează manual în Supabase.

#### (B) UX Deviz (hit target / affordance)
- În `Master_Implementation_Plan.md`: Faza B cere 44x44 și affordance edit.
- În `CLAUDE_CODE_MASTER.md`: există multe milestone-uri de UX, dar nu tratează explicit “hit target 44x44” ca task separat.
Decizie: păstrăm Faza B ca sursă unică pentru acest subiect și îl implementăm punctual în EstimateEditor (fără refactor).

#### (C) Promisiuni comerciale: Smart Calc / Import / Timeline
- Smart Calc și Timeline sunt deja în repo, dar pot avea bug-uri sau lipsuri (ex: “Se salvează…”).
- Import “nativ” este încă lipsă.
Decizie: păstrăm Faza C ca sursă unică de obiective, iar CLAUDE_CODE_MASTER e folosit doar pentru constrângeri și verificări (build/guard etc).

#### (D) V4 Comparator
- În `Master_Implementation_Plan.md`: Faza D descrie Comparative Grid Engine + “Cheapest Basket” injectat în Deviz.
- În repo există o versiune parțială (vendor_offers + picker).
Decizie: Faza D rămâne direcția, dar actualizăm sub-task-urile ca să pornească de la statusul existent (nu “creăm vendor_offers”, îl extindem).

---

## 4) Divergențe importante (unde planurile duc în direcții diferite)

### 4.1 RLS “public access” vs “bazat pe auth”
- `schema.sql` definește RLS permisiv (“Allow public access ... FOR ALL USING true WITH CHECK true”) pe mai multe tabele.
- `Master_Implementation_Plan.md` cere RLS specific pe `shops` bazat pe sesiune (pentru a evita 403 la INSERT/UPDATE).
Reconciliere: tratăm “RLS live” ca adevăr, nu schema locală. În execuție, verificăm efectiv ce politici există în Supabase live și ajustăm minimul necesar pentru a elimina blocajele (fără să stricăm flow-ul curent).

### 4.2 Timeline: “deadlines/startdates per etapă” vs “durate default”
- Master Plan cere regenerare pe date setate text în Deviz (deadline/startdate).
- Implementarea actuală calculează durate secvențiale din durate default și activitate (linii/achiziții).
Reconciliere: păstrăm implementarea actuală ca MVP (read-only), iar “deadlines” devine un upgrade ulterior (nu prerechizit pentru promisiuni landing).

---

## 5) Backlog unificat (fără duplicări), ordonat după impact

### P0 — Verificare/rollout DB (Supabase LIVE)
Scop: eliminarea erorilor “silențioase” și diferențelor dintre schema locală și DB live.
- A.1 Confirmă `estimate_lines.resources_override` în DB live (plan: Faza A.1).
- A.2 Confirmă `purchases.date` în DB live și tipul corect (plan: Faza A.2).
- A.3 Confirmă/ajustează RLS pentru `shops` ca să permită INSERT/UPDATE fără 403 (plan: Faza A.3).
- A.4 Verifică operațiile de DELETE pe `projects` (UI deja avertizează despre blocaj RLS).

### P1 — Onorare promisiuni comerciale (landing → product)
Scop: eliminăm gap-urile vizibile din landing.
- C.1 “Foto la achiziție”: bucket + coloană `photos` + upload UI + afișare listă.
- C.2 “Import extras nativ”: upload CSV/Excel → tabel intermediar de revizie (UI) → confirm bulk insert în `estimate_lines`.
- C.3 “Alerte depășire buget ca workflow”: modal persistent cu 3 opțiuni + salvarea deciziei (audit).

### P2 — UX Deviz pentru teren (micro-ergonomie)
Scop: reducere fricțiune în editarea cantităților și a câmpurilor numerice.
- B.1 Hit target 44x44 pe numeric inputs (cantități și prețuri).
- B.2 Affordance editabilitate (hover/focus + icon discret) fără a afecta layout-ul.

### P3 — V4 Comparator (extensie peste Deviz)
Scop: trecerea de la “picker pe resursă” la “grid comparativ”.
- D.1 “Comparative Grid Engine”: rânduri materiale, coloane magazine selectate, selecție “coș” minim.
- D.2 “Cheapest Basket”: injectare în `custom_prices`/coloane matematice fără a polua introducerea datelor.

---

## 6) Mapare cross-plan (ca să nu repetăm task-uri)

### Master Plan → CLAUDE milestones (unde există echivalențe)
- Faza A (DB) → nu are milestone dedicat; se tratează ca “A.* prerequisite”.
- Faza B (UX Deviz) → aproximativ în zona M11/M12 ca “UX pe șantier”, dar nu există task explicit 44x44.
- Faza C (Promisiuni) → suprapune parțial M7 (Smart Calc), M15 (Timeline), M16 (Import Excel), M18 (Foto achiziții), M12.alert (modal persistent).
- Faza D (V4) → se aliniază la ideea “motor comparativ” din milestone-uri noi, dar repo are deja o implementare parțială.

### Principiul de evitare a suprapunerii
În execuție folosim etichete unice:
- “A.*” = DB Live (manual în Supabase)
- “B.*” = UX Deviz
- “C.*” = Promisiuni comerciale
- “D.*” = Comparator V4
Milestone-urile M# rămân doar referință istorică / check-list secundar.

---

## 7) Plan de execuție recomandat (următoarele funcționalități)

1) A.* — DB Live verificat și corectat minimal (fără schimbări de structură, doar ADD COLUMN / policy fixes).
2) C.1 — Foto achiziții (închide o promisiune landing foarte concretă).
3) C.2 — Import extras nativ (flow de revizie, fără investiție grea în OCR).
4) C.3 — Alertă buget ca workflow (modal persistent + decizie).
5) B.* — UX Deviz 44x44 + affordance.
6) D.* — Grid comparativ V4 și Cheapest Basket.

---

## 8) Verification plan (actualizat la statusul din repo)

1) DB Live: aplicare SQL manual + confirmare că operațiile relevante nu mai dau 403/204 (shops insert/update, estimate_lines insert cu resources_override, purchases insert cu date).
2) E2E Deviz: proiect nou → adăugare norme → edit cantități → export PDF/Excel → share link.
3) Promisiuni: achiziție cu poze; import extras cu revizie; alertă buget cu modal persistent.

