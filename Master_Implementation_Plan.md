# Master Implementation Plan: BuildingCalc (Adevărul Absolut)

Acest document este sursa unică de adevăr (Single Source of Truth) pentru finalizarea aplicației **BuildingCalc**. El îmbină reparațiile tehnice esențiale (fundația MVP-ului) cu arhitectura pe termen lung (Comparatorul de Furnizori), asigurând că nicio muncă nu este aruncată și arhitectura de bază nu este compromisă.

### Filosofia Arhitecturală Asumată
- **Devizul (Centralizatorul) Rămâne Sfințenia Proiectului:** Este componenta esențială unde se importă rețete, se defalcă materiale și se ajustează cantitățile fizice ale lucrării (`resources_override`). Rămâne neschimbat la nivel structural.
- **Motorul Comparativ (V4) este o Funcție Adițională:** Se va construi ulterior, ca un strat analitic pus *peste* Deviz, citind necestul de materiale și aplicând ofertele furnizorilor deasupra, pentru a nu polua introducerea datelor.
- **Protocolul Bazei de Date:** Scripturile SQL se execută de către Utilizator în consola Supabase. AI-ul furnizează codul, se oprește și așteaptă confirmarea execuției cu succes.

---

## Faza A: Stabilizarea Bazei de Date (Baza MVP-ului curent)
Remedierea erorilor "silențioase" care blochează complet utilizarea primară a aplicației.

#### [SQL] Intervenții Supabase (Așteaptă Roll-out Manual)
1. **Tabela `estimate_lines`:** `ALTER TABLE` pentru a adăuga coloana `resources_override` (`jsonb`). Vitală pentru importul normelor din catalog și personalizarea conținutului materialelor (ștergerea/adăugarea la nivel de rând din deviz). Rezolvă eroarea `PGRST204`.
2. **Tabela `purchases`:** `ALTER TABLE` pentru adăugarea coloanei `date` (`timestamp with time zone`). Permite salvarea reală a chitanțelor/achizițiilor.
3. **Tabela `shops` (Furnizori):** Implementarea politicilor esențiale **RLS (Row Level Security)** care blochează momentan crearea de noi magazine cu un `403 Forbidden`. Acordarea drepturilor de `INSERT` și `UPDATE` pe baza sesiunii de autentificare.

---

## Faza B: UX Deviz & "Quality of Life" Pe Șantier
Transformarea modulelor actuale construite corect într-unele utilizabile confortabil, direct din teren (Tablete/Telefoane).

#### [MODIFY] Deviz / Centralizator Listă Lucrări
- **Editarea Cantităților in-line:** Extinderea invizibilă a „Hit Target-ului” (zona dând click) - minim 44x44px padding pe câmpurile numerice. Adăugarea indicatoarelor vizuale de editabilitate (`:hover` background gri + iconiță fină de creion). Fără aceste modificări se încalcă reguli de ergonomie (Fitts's Law).
- **Meniul Contextual al Articolelor:** Schimbarea iconiței curente (Link/Lănțișor) care cauzează mare confuzie cu iconița universală Kebab (`⋮`). Traducerea opțiunilor statice (Duplicate -> *Duplicare*, Delete -> *Șterge*) și legarea lor la trigger-urile API de distrugere sau copiere a rândului curent.
- **Nomenclatură Clară:** Schimbarea etichetei butonului din "Adaugă Articol Manual" în "Creează Rețetă Custom" ca să reflecte cerința lui de a defalca Manoperă/Material.

#### [MODIFY] Fluxuri Globale și Catalog
- Sistem Global **Toast Notifications (`sonner`)**: Interfața nu comunică succesul în prezent. Se vor emite notificări pozitive / roșii la fiecare interacțiune pe server ("Salvată", "Normă adaugată", "Eroare!").
- Adăugarea butonului primar `"Adaugă în Deviz"` în sub-pagina detaliată a normelor din catalog (pentru inserție directă după expunerea totală a consumurilor, rupând ciclul inutil de "Înapoi").

---

## Faza C: Onorarea Promisiunilor Comerciale (Marketing vs Funcțional)
Asigurarea că ceea ce este livrat utilizatorilor promovați prin landing page funcționează decent.

#### [MODIFY] Extractia Smart Calc (Wizard-ul de Deviz)
Smart Calc va fi nucleul „Lansării Rapide”.
1. Repararea blocajului final ("Se salvează...") care eșuează în salvarea bulk a elementelor generate.
2. Scoaterea sa din dropdown-ul ascuns ("Operații") și plasarea UI ca buton *Erou/Primar* în pagina unui Proiect Gol ("🪄 Generează cu Smart Calc"), fiind un "candidat ideal pentru începerea unui proiect nou".

#### [NEW] Parser Import Nativ (Extras OCR/Excel)
Nu se va investi extrem de greu în AI OCR momentan, ci într-un flow impecabil de validare.
- Utilizatorul încarcă fișierul.
- Datele (CSV/Tabelare Simple) sunt importate într-un **Tabel Intermediar de Revizie**.
- Aici, utilizatorul poate edita/completa valorile scurte mapate defectuos, înainte de a da `"Confirmă Încărcarea în Ofertă"`.

#### [MODIFY] Timeline-ul (Gantt Graph)
Reconversia sa de la stadiul de "Mockup Fix" la "Dashboard Reactiv".
- Eliminarea funcției de Drag&Drop (out of scope pentru MVP) și a celor 23 săptămâni hardcodate.
- Se va regenera grafic (Read-Only) folosind direct datele (deadlines/startdates per etapă) setate text în Deviz. Arată clientului exclusiv stadiul realist, fixat.

#### [MODIFY] Așteptări Gestionate (Scenarii / Echipe)
Tabul de Scenarii (funcția "EPS vs Vată"), Rapoarte Complexe și Echipe Multi-utilizator primesc flagul de UI `[În curând]`.

---

## Faza D (Viitorul): Motorul de Comparare a Prețurilor (V4)
Această funcție se va adăuga curat *numai după testarea Fazei A-C*, pe baza Devizului curent. Va respecta documentul V4.
1. Crearea extensiilor viitoare de DB: `vendor_offers` care pointează către `estimate_lines.resources_override`.
2. Dezvoltarea *Comparative Grid Engine-ului* (rânduri = materiale, coloane = supermarket-uri alese) ca un "TAB" total diferit.
3. Injectarea prețului unitar per `"Cheapest Basket"` înapoi și silențios în coloanele matematice ale Devizului stabil de mai sus.

---

## Verification Plan

Vei regăsi acești 3 pași în logul meu de execuție, odată aprobat.

**1. Intervenții Supabase (Manual + Verificare):** Îți furnizez codul. Aplici. Aștept poza completării, rulez comenzi API backend în cod pentru a verifica permeabilitatea permisiunilor `[Success/Faillure]`.
**2. End-to-end Test Deviz:** Deschid browser-ul intern să generez un fișier, adaug rețetă din catalog, folosesc Hover și observ schimbările de formă a editabilului.
**3. Component Test:** Navigare până la finalizarea Smart Calc-ului ("Se Salvează..." trebuie să devină `Proiect finalizat - Redirect`). Confirmarea de prezență a butonului "Smart Calc" extras pe prima privire.

---
**Status curent: Așteaptă comanda de începere a execuției (`"Implementăm Faza A - Dă-mi SQL-ul"`).**
