# Analiză UX/UI și Flux Utilizator - Post-Login

În urma explorării aplicației din perspectiva unui utilizator deja autentificat, am evaluat navigarea, intuitivitatea meniurilor și fluxul general pentru a înțelege și crea un deviz. Mai jos sunt detaliate constatările și propunerile de îmbunătățire (fără a afecta logica sau funcționalitatea de bază).

## Video: Partea 1 - Creare Proiect / Navigare
![Călătoria de testare 1](C:/Users/Utilizator/.gemini/antigravity/brain/c1b32727-9d30-4e2f-a0c1-18065a13f5d8/post_login_ux_analysis_1774770740319.webp)
## 1. Experiența pe Pagina de Pornire (Dashboard / Landing Page)
> [!NOTE]
> Pagina principală acționează similar cu un landing page de prezentare amestecat cu un utilitar de lucru. Calculatorul rapid de estimare (Structură, Finisaje, Instalații) generează o bună rată de implicare din primele secunde.

**Ce funcționează bine:**
- Graficul și sumatorul care răspund în timp real la modificările de input sunt excelente și dau încredere vizuală utilizatorului.

**Arie de confuzie identificată:**
- La finalul calculatorului de estimare se află un buton *"Creează deviz complet — gratuit →"*. Pentru un utilizator care este deja logat, apăsarea butonului duce spre fluxul de Înregistrare (`/auth/register`), ceea ce nu are sens fiind deja în cont.

> [!TIP]
> **Propunere:** Butonul ar trebui să își schimbe destinația inteligent. Dacă utilizatorul e logat, CTA-ul se poate transforma în *"Începe un Proiect Nou"* și să redirecționeze spre `/projects/new`.

---

## 2. Navigare și Claritatea Terminologiei
Meniul principal folosește o terminologie curată și la obiect pentru mediul de construcții (ex: **Proiecte**, **Catalog norme**, **Deviz**).

**Ce funcționează bine:**
- Butonul **`+ Proiect nou`** plasat în Header este vizibil permanent și clarifică principalul flux pe care aplicația îl dorește de la utilizator.
- Structura catalogului pe diviziuni majore (ex. "Acoperiș", "Beton") este foarte clară.

---

## 3. Fluxul de Creare al unui Proiect Nou (Simulare manuală)
Parcurgând procesul valid de creare proiect "Standard (Manual)":
1. Alegerea se face dintr-o pagină unde comparația (Smart/AI vs. Standard) este poziționată clar.
2. Formularul (Nume, Locație, Coeficienți tipici precum CAS, Profit) e ușor de înțeles.
3. Se apasă pe *"Salvează și Începe Devizul"*.

**Blocaj / Problemă de percepție identificată:**
- După apăsarea butonului de Salvare, starea acestuia devine *"Se creează..."*. Totuși, se întâmplă uneori ca fluxul vizual să se blocheze aici. Deși backend-ul creează proiectul efectiv, utilizatorul rămâne pe aceeași pagină și are senzația că "s-a blocat încărcarea".

> [!WARNING]
> **Propunere critică de UI:** Sistemul trebuie să asigure o redirecționare automată (`router.push`) direct în pagina noului proiect (`/projects/[id]`) exact în secunda în care API-ul a răspuns cu succes. 

---

## 4. Gestiunea Proiectului (Adăugarea articolelor)
Tab-urile proiectului (**Dashboard, Planificare, Deviz, Timeline, Achiziții**) sunt logic aranjate și acoperă stadiile reale ale unui șantier.

**Experiența adăugării din Catalog**
- **Flux:** Când ești într-un deviz și se adaugă un articol, se apasă în Catalog butonul `+` de adăugare.
- **Problemă de feedback:** Sistemul are lag vizual sau lipsă de feedback atunci când apeși `+`. Nu există o animație prin care articolul "zboară" spre coș, nici o notificare instantanee sau măcar o schimbare a culorii butonului care să spună ferm *"Adăugat cu succes!"*.
- **Confuzie Planificare vs. Deviz:** În tab-ul *Deviz* există invitația de a adăuga articole din tab-ul *Planificare*. Pentru cineva care tocmai se tot chinuie să bage articole din Catalog direct spre un proiect, pare contradictoriu. 

> [!TIP]
> **Propuneri UI:** 
> 1. Tratează adăugarea în deviz cu un *"Toast notification"* (o mică bară verde temporară: *Normă adăugată cu succes*).
> 2. Oferă un counter visual (o insignă numerică) lângă tab-urile *Planificare* sau *Deviz* pentru a atesta că acolo au apărut articole noi.

---

## 5. Alte aspecte UI
- **Căutarea în Catalog:** Are un ușor delay neintuitiv. Dacă s-a introdus "beton", lipsește un "loading spinner" mic sub bară care să spună utilizatorului că aplicația procesează cuvântul. Alternativ ar trebui îmbunătățit debouncing-ul.
- **Folosirea scheletelor (Skeletons):** Foarte utilă tehnica de a arăta formele paginii până la încărcare; totuși, pe anumite vizualizări ele rămân "blocate" pe ecran un pic cam mult sau pe stări de "zero gol" (adică liste fără nimic adăugat). Este mult mai plăcut să primești un desen (Empty State illustration) care spune sec *"Nu ai niciun proiect încă. Click aici să faci unul."* decât un tabel de loading infinit sau un rând complet gol.

## 6. Blocaje de Flux în Interiorul Proiectului (Deviz, Achiziții, Timeline)

## Video: Partea 2 - Navigarea în Interiorul Proiectului
![Călătoria de testare 2](C:/Users/Utilizator/.gemini/antigravity/brain/c1b32727-9d30-4e2f-a0c1-18065a13f5d8/continue_ux_analysis_1774771890887.webp)

Urmărind "călătoria" utilizatorului direct în interiorul unui proiect deschis, au fost identificate o serie de blocaje ("silent errors") în care interfața permite acțiunea, dar aceasta eșuează în spate.

**A. Articolele Adăugate Nu Apar în Deviz/Planificare**
- **Cum arată:** Utilizatorul apasă `+` în dreptul normei de Beton din tab-ul Catalog. Nu există feedback. Când se întoarce pe tab-ul *Deviz* sau *Planificare*, acestea sunt complet goale.
- **Cauza reală:** Backend-ul refuză acțiunea din cauza unei erori de schemă la nivel de bază de date (`PGRST204 - Could not find the 'resources_override' column of 'estimate_lines'`). 
- **Efect UX:** Utilizatorul crede că nu a apăsat el cum trebuie sau că aplicația e defectă, din cauză că eroarea este vizibilă doar în consola de dezvoltator. Nu i se comunică niciun eșec vizual.

**B. Modulul de Achiziții și Furnizori/Magazine**
- Ai observat foarte bine: deși există buton de Adăugare Achiziție sau meniu pentru Adăugare Furnizor nou, completarea datelor și apăsarea butonului "Salvează" nu are niciun efect vizual.
- **Cauza (Furnizori/Shops):** Eroare de tip `403 Forbidden` la nivelul tabelei `shops`. Aceasta este o problemă de permisiuni (Supabase RLS), care blochează utilizatorul logat să scrie un furnizor nou în baza de date. Efectiv, "nu îi dă voie" să salveze magazinul, dar nici nu îi spune asta.
- **Cauza (Achiziții):** La fel ca la devize, eșuează silențios din cauza lipsei coloanei `date` din tabela `purchases`.

**C. Timeline-ul (Planificarea)**
- Diagrama Gantt (Timeline) arată excelent ca design vizual. Totuși, ea pare momentan a fi **statică/hardcodată**. Chiar și la un proiect nou, fără nicio normă introdusă, apare un grafic prestabilit de 23 de săptămâni cu etape (Fundație, Structură etc.).
- **Propunere (UX):** Ar trebui afișat un mesaj grafic ("Empty State": *Adaugă elemente în planificare pentru a genera graficul*) până când există cu adevărat date reale din proiect.

**D. Finalizarea Proiectului și Exportul**
- **Flux:** Pentru a "termina" un proiect sau a-l descărca, utilizatorul trebuie să găsească meniul ascuns sub butonul **"Operații"** (dreapta sus). Acolo se află "Exportă PDF", "Furnizori" și "Finalizează Proiect".
- **Propunere (UX):** Deoarece *Exportul Devizului* este considerat în mod normal un scop final principal (o acțiune dorită de client), butonul "Print / Export" ar merita să fie afișat prioritar, ca iconiță separată, lângă butonul de Operații, pentru vizibilitate maximă.

---

## 7. Analiză Detaliată: Meniul Operații și Pagina de Rețete (Catalog)

## Video: Partea 3 - Explorare Funcționalități Secundare (Operații & Rețete)
![Călătoria de testare 3](C:/Users/Utilizator/.gemini/antigravity/brain/c1b32727-9d30-4e2f-a0c1-18065a13f5d8/deep_dive_ux_analysis_1774773291993.webp)

Continuând explorarea în profunzime, au fost analizate două componente specifice care generează confuzie:

**A. Meniul Dropdown „Operații” (Header Proiect)**
Acest meniu acționează ca un "sertar" pentru acțiuni diverse, fiind poziționat în dreapta, lângă „Adaugă Articol”. Interacțiunea cu el a scos la iveală comportamente neintuitive:
- **Smart Calc:** Deschide un Wizard („Generator Deviz”) foarte intuitiv. Acesta este evident și bine realizat.
- **Etape Proiect:** Funcționează corect, afișând un modal clar pentru gestionarea etapelor.
- **Furnizori:** Așa cum am stabilit anterior, modalul se deschide, dar salvarea eșuează silențios.
- **Importă Extras (OCR) [Punct de Blocaj]:** La apăsare, se deschide direct browserul (sistemul de fișiere) pentru a alege de pe hard-disk. Utilizatorul nu primește nicio explicație referitoare la ce tip de fișier este acceptat (PDF, poză) sau ce se va întâmpla după selecție.
  - **Propunere UX:** Această opțiune ar trebui să deschidă mai întâi un *Modal explicativ* (tip drag-and-drop zone) care să adauge context acțiunii (Ex: "Încarcă extrasul de la arhitect ca PDF pentru extragere cantități").
- **Salvează ca Șablon & Partajează deviz [Confuzie]:** La click pe oricare, meniul pur și simplu se închide. Nu există niciun mesaj ("Șablon Salvat!", "Link generat/copiat!"). Utilizatorul crede că a dat click greșit sau că butonul e de formă.
- **Descarcă PDF:** Inițiază descărcarea (funcționează), dar ar fi din nou recomandat un feedback de vizual temporar (ex. "Generare PDF în curs...").
- **Setări Proiect:** Funcționează corect.

**B. Detaliile Normelor din Catalog (Rețeta completă)**
La testarea adâncimii Catalogului de Norme (pentru articole complexe), navigăm dincolo de listă:
- **Expansiunea rapidă (Săgeata Jos):** Extinderea cardului (pentru a vedea `Simbol`, `Unitate`, `Categorie`, `Preț referință`) este super utilă. Ajută să parcurgi zeci de rezultate vizual pe aceeași pagină.
- **Pagina "Vezi detalii complet":** Pagina dedicată unei norme specifice (cu Defalcarea Rețetei - manoperă, consum material pe unitate, transport) arată impecabil și e ușor de citit.
- **Punct critic UX (Lipsa butonului Adaugă):** Pe această pagină de dedesubt (în rețetă) se află momentul decisiv. Când inginerul se hotărăște că asta e norma de care are nevoie, **nu există niciun buton de "Adaugă în Deviz"**.
  - **Navigarea existentă:** Există doar butoanele *"Înapoi la catalog"* și *"Mergi la proiect"*. 
  - **Efectul curent:** Utilizatorul este trimis prin "walk of shame": trebuie să dea *"Înapoi"*, să regăsească cardul respectiv din rezultatele căutării, și abia de acolo să apese butonul mic și neînsemnat `+` (care și el uneori dispare în funcție de path-ul url-ului). E un blocaj grozav în fluiditatea muncii.
  - **Propunere Vitală:** Interfata are nevoie urgentă de un buton mare portocaliu **"Adaugă în Deviz"** direct în pagina detaliată a normei (lângă detaliile și prețul de referință).

---

## 8. Analiză Exhaustivă: Timeline, Scenarii, Editare Rețete și Articole Manuale

## Video: Partea 4 - Explorare Completă a Fluxurilor Secundare
![Călătoria de testare 4](C:/Users/Utilizator/.gemini/antigravity/brain/c1b32727-9d30-4e2f-a0c1-18065a13f5d8/exhaustive_ux_analysis_1774781097990.webp)

La o verificare minuțioasă a ultimelor colțuri neexplorate ale interfeței de proiect (la solicitarea ta directă), problemele de UX se împart între *neclaritate a termenilor* și *butoane tip „Placeholder”*:

**A. „Adaugă Articol Manual” vs. „Catalog Norme/Rețete”**
- **Cum funcționează:** Butonul de *Adaugă Articol Manual* adaugă instantaneu (fără modal, in-line) un rând nou direct în deviz, unde poți edita pe rând: `Nume`, `Mat` (Material), `Man` (Manoperă), `Util` (Utilaj), `Trans` (Transport).
- **Problema de Terminologie (Confuzia "What the Hell"):** Cuvântul "Articol" este folosit ambiguu în aplicație. În devizele de construcții, un utilizator vrea uneori să adauge pur și simplu o factură/un produs de-a gata (ex: *Lavoar - 500 RON*). Dar *BuildingCalc* îi cere prin acest buton să își definească propria "mini-rețetă" (adică să pună separat manopera, materialul etc. pentru acel articol manual).
- Când utilizatorul apasă „Adaugă Articol” din Catalog, el importă de fapt o **Rețetă completă** predefinită în baza legii/normativelor (informația aceea care are ciment, nisip, manoperă).
- **Propunere (UX):** Schimbarea denumirilor. Butonul actual de articol manual ar trebui să se numească „Creează Rețetă Custom” sau „Articol Defalcat/Compozit”. Iar pentru produsele simple cumpărate cu bucata (la Găleată/Bucată), ar trebui un buton distinct: „Adaugă Preț Fix/Produs Simplu”.

**B. Editarea Rețetelor (Normelor)**
- Pentru *Articolele manuale*, editarea funcționează direct pe rând (in-line). E ușor și intuitiv să modifici cantitatea și prețurile. Excelent.
- **Pentru Rețetele aduse din Catalog:** Din cauza erorii ascunse din baza de date (`resources_override`), normele din Catalog momentan se opresc la ușa proiectului. Dar problema reală de design este că **lipsește capacitatea de a expandă rândul din deviz** pentru a-i șterge sau adăuga unelte/materiale individuale (ex: să scoți cuiele din rețetă sau să schimbi un fier-beton PC52 cu un OB37). Pentru acest lucru, inginerul are nevoie de o vizualizare drop-down (sub-rânduri) pe normă chiar în pagina de deviz (pe principiul arborescent: Proiect > Etapă > Normă > Materiale/Muncitori).

**C. Timeline (Gantt Chart)**
- Deși vizual arată de parcă ai folosi licențe MS Project scumpe (Timeline profesional), momentan este o componentă **100% Statică**.
- Nu poți face "Drag and Drop" pe blocurile cronologice ca să legi fazele muncii (ex: nu pot să trag faza de „Structură” să înceapă doar după ce se termină „Fundația”). Nu le poți redimensiona, iar calendarul este pur informativ (arată lunile, dar nu poți salva nimic acolo). În stadiul actual, este mai degrabă un demo UI.

**D. Opțiunea „Scenarii”**
- Pe Dashboard există un Call-to-Action excelent marketat: *"Vrei să reduci costul? Rulează un scenariu de tip EPS vs Vată pentru a vedea impactul în profitul final"*.
- La apăsarea butonului uriaș **"Start Scenariu"**, aplicația nu reacționează absolut de loc. Nici măcar un warning în consolă. Este doar un UI pur vizual. Nu funcționează.

**E. Meniuri Lipsă expuse de tine**
- Acțiuni precum salvarea în sine a stadiului timeline-ului, „Echipă” sau „Rapoarte avansate” nu s-au putut testa pentru că nu există cod conectat pe frontend pentru ele („Suntem departe de a fi terminat analiza... Da, suntem departe de a fi terminat dezvoltarea aplicației în primul rând”). 

**F. Meniul Contextual al Articolelor Manuale (Centralizator Lucrări)**
- Când un utilizator adaugă manual o poziție în tab-ul Planificare/Deviz, câmpurile apar editabile, dar zonele de click (hit target-urile) sunt extrem de mici. Pentru lucrul pe un laptop sau o tabletă pe șantier, e nevoie de o precizie obositoare (este o încălcare a Fitts's Law în UI Design).
- **Semnalizarea Editării:** În câmpurile numerice, nu este deloc evident pentru ochiul utilizatorului că acolo se poate da click pentru a modifica o sumă.
  - **Propunere:** Câmpurile editabile „in-line” trebuie semnalizate mai agresiv: fie cu un icon subtil de creion pe fundal, fie printr-o bordură/highlight clar (ex: field-ul să se facă gri-deschis la hover-ul mouse-ului).
- **Iconița de "Link" (Meniul Ascuns):** Pe acel semn mic de link din rândul articolului se ascunde un Meniu Contextual cu opțiuni foarte bine gândite pentru gestionarea la nivel de rând. Dar UX-ul suferă din trei motive:
  1. Iconița aleasă (un link) sugerează de obicei o ancoră web sau o copiere de URL, nu deschiderea unui meniu de operațiuni. Aici ar fi mult mai intuitiv icon-ul clasic de `⋮` (trei puncte verticale - Kebab Menu) sau `≡` (Hamburger/Settings).
  2. Meniul este nefuncțional momentan.
  3. Textele au rămas definite "hardcoded" în limba Engleză (ex: *Delete, Duplicate*), stricând consistența restului platformei. Necesită un efort scurt de traducere și conectare la baza de date.

---

## Concluzie Generală Definitivă
**BuildingCalc** are o interfață vizuală extrem de îngrijită, dar UX-ul principal (crearea efectivă a devizului cu sume reale) este momentan blocat de **erori la nivel de backend** (lipsa unor coloane din structura tabelelor și lipsa polițelor de securitate RLS pentru scriere).
Până la reconectarea completă a interfeței cu baza de date, utilizatorul trăiește o confuzie evidentă lovindu-se de refuzuri tăcute ("silent fails"). **Afișarea erorilor în interfață** (sub formă de notificări roșii: *"Eroare la salvare"*) este absolut vitală chiar și pentru stadiul de dezvoltare, pentru ca un utilizator să nu dea vina pe el sau pe buton înainte să știe că e de fapt problema serverului.
