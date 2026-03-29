# Plan de Implementare și Lansare MVP BuildingCalc

Acest plan aliniază constatările din raportul `ux_ui_analysis.md` cu pretențiile comerciale curente de pe `app/page.tsx` (Homepage). Respectând regula "ZERO Moficări Structurale" (nimic rescris de la zero), strategia de mai jos deblochează strict fluxurile esențiale și „peticiește” zonele nefinalizate, fie prin conectarea lor la API, fie prin convertirea lor în mesaje de tip *"În curând"* pentru a reduce frustrarea utilizatorilor.

## User Review Required

> [!WARNING]
> **Decizii Comerciale vs Tehnice:** Homepage-ul promite lucruri avansate (Scanare Extras / OCR cantități, Scenarii Comparative Automate de Cost EPS vs Vată, Management Conturi Echipă pe Șantier). Deoarece momentan front-end-ul pentru ele fie e static (Scenarii), fie lipsește complet (Echipă), am propus mai jos **ascunderea sau degradarea lor cu grație ("Coming Soon")** pentru MVP, evitând rescrierea aplicației în acest moment. **Aprobă sau contrazice această abordare în Faza 3.**

---

## Propuneri de Implementare (Faze)

### Faza 1: Deblocarea Bazei de Date (Backend Clinic)
Fără a rescrie modele, vom rula strict migrații SQL sau ajustări de tipuri pentru componentele deja scrise, dar blocate de Supabase.

#### [MODIFY] Baza de date (Supabase) / Politici
- **Eroare Catalog/Norme:** Adăugarea coloanei lipsă `resources_override` în tabela `estimate_lines` (Tip: `jsonb`), care momentan absoarbe silențios "Adăugarea articolului din catalog" și dă block (PGRST204).
- **Eroare Achiziții:** Adăugarea coloanei lipsă `date` în tabela `purchases` (Tip: `date` sau `timestamp`).
- **Eroare 403 Furnizori:** Adăugarea unei polițe RLS (Row Level Security) pe tabela `shops` pentru a permite INSERT userilor autentificați (și UPDATE propriilor linii).

---

### Faza 2: Feedback Vizual și Remediere UX Critică (Frontend)
Intervenții locale la nivel de componentă pentru a transforma navigarea confuză (descrisă în UX Report) într-o experiență lină și informativă.

#### [NEW] Componente Utilitare
- **Sistem de Notificări (Toast):** Implementare pachet `sonner` (sau similarul deja instalat) pentru a notifica succesul/eroarea (`"Articol adăugat cu succes!"` sau `"Eroare la conectare"`). Fără notificări, erorile tăcute vor omorî retenția utilizatorilor, fix cum ai semnalat pe șantier.

#### [MODIFY] Fluxuri de Routing & Onboarding
- **Redirect Dashboard:** Modificare pe Landing Page (butonul `"Creează deviz gratuit"`); dacă sessiunea de Supabase indică un user logat, CTA-ul duce la `/projects/new` în loc de `/auth/register`.
- **Redirect Creare Proiect:** În formularul "Creare Proiect Nou", la finalizarea succesului `$fetch`, adăugat rutare imediată: `router.push('/projects/[id]')`.

#### [MODIFY] Deviz / Planificare / Centralizator
- **Hit Targets și Editable Fields:** Pe rândurile de lucrări adăugate manual (Material, Manoperă, Transport), CSS-ul va fi alterat. Lărgirea `padding`-ului pentru touch (conform Fitts's law pentru medii de șantier). Adăugare pseudo-clasă `:hover` pe background-ul numeric (border/fundal light-gray) pentru a sugera natura editabilă din start.
- **Meniul Contextual al Articolelor:** Schimbarea icon-ului de "Lănțișor/Link" cu meniul Kebab (Trei puncte `⋮`). Funcțiile statice englezești din cod (*Delete, Duplicate, Add material*) se traduc și i se leagă funcția simplă de `handleDelete` (ștergere de pe ecran și din backend).
- **Terminologie Adăugare Articol Manual:** Schimbarea etichetei pe ecran din "Adaugă Articol" în "Creează Rețetă Custom" (pentru a evita confuzia cu articolele/rezultatele importate din Catalog).

#### [MODIFY] Catalog Norme
- **Buton de Adăugare Directă:** În interiorul componentei de pagină de produs (pagina detaliată a normei "Vezi Detalii"), se copiază funcția de la butonul `+` din părinte și se instanțiază un Buton Plin: **Adaugă în Deviz**.

---

### Faza 3: Gestionează Promisiunile Mari (Feature-uri complexe vs MVPs)
Pagina de prezentare face promisiuni masive. Să stabilim ce livrăm.

#### [MODIFY] Smart Calc (Generator Devizul Rapid)
- **Status Curent:** Se blochează în loader-ul "Se salvează...".
- **Reparație:** Funcția de submit va fi curățată. Având Faza 1 (Backend deblocat), Smart Calc-ul își va trimite pachetul generat de elemente efectiv spre proiect. Aceasta este core-feature, funcția principală a aplicației! Fixarea este izolată strict pe legătura cu `estimate_lines`.

#### [MODIFY] Meniul Operații (Header Proiect)
- **Partajează Deviz / Șablon (Static):** La onPress, dacă backendul nu generează temporar un link specific, activăm doar o notificare locală `"Link de Share copiat! (În curând în versiunea Finală)"`. 
- **Export PDF:** Ne asigurăm că declanșează un feedback UI adecvat ("Generare PDF...").
- **Import Extras (OCR / Excel):** Deoarece funcția deschide doar exploratorul de fișiere, vom face un Wrapper Modal explicativ, urmat de parsare CSV minimă. Dacă nu este logică completă scrisă pentru "mapare coloane Excel" (așa cum promite homepage-ul), opțiunea va fi dezactivată și ascunsă temporar din dropdown, **pentru a nu asigura minciuni de marketing**.

#### [MODIFY] Timeline-ul Gantt
- **Reparație (Alegere necesară):** Fie îi tăiem complet drag-and-drop-ul din promisiuni și îl forțăm să se genereze vizual *Doar Pe Baza Etapelor* existente din proiect, fie (dacă biblioteca CSS folosită suportă) conectăm handler-ul de "drag" la update-ul datei limită (deadline/startdate) din baza de date pentru etapa respectivă. *A se decide în secțiunea de întrebări deschise.*

#### [MODIFY] Tab-ul Scenarii (EPS vs Vată)
- **Status Curent:** Static. Nu face nimic.
- **Acțiune:** Ascultăm de principiul "Tăiem dacă nu e esențial pentru reușita MVP-ului". Tab-ul de Scenarii dispare temporar din UI-ul de producție vizibil pentru clienți până când core-ul (Adăugarea din catalog, prețurile, și devizele clasice) sunt testate pe număr limitat de oameni.

---

## Open Questions

> [!CAUTION]
> 1. **Timeline (Gantt Chart):** Îl menținem 100% *Read-Only*, populat automat pe baza cantităților lucrate? Sau dorești să investim buget de efort în a lega Drag&Drop-ul de calendare și de data de începere din baza de date? (Sfat: În prima versiune de șantier, Constructorul are nevoie disperată de Bani (costuri corecte), nu de Management Timp avansat. Recomand generare statică).
> 2. **Importul Extraselor Excel / PDF:** Homepage-ul îl vinde agresiv. Ascundem butonul până e o echipă întreagă să facă un Parser OCR avansat? SAU facem un Drag&Drop simplu strict pentru CSV/Excel clasic formatat specific?
> 3. **Faza 1 (Backend-ul pe SQL):** Preferi să îți rulez direct comenzi prin interfața locală/bash sau prin prisma `Supabase.js` ca să adaug coloanele `resources_override` și cele de policy `shops`?

## Verification Plan

### Manual Verification (După implementare)
- Utilizatorul confirmă că Smart Calc finalizează adăugarea normelor generate.
- Verificarea că hit-target-urile manuale pe rândul devizului sunt de minum 44x44px.
- Normele din Catalog se extind și conțin butonul primar portocaliu "Adaugă".
- Polițele RLS nu mai generează `403` la salvarea unui magazin.
