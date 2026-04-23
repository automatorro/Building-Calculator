# Analiza Promisiuni vs. Realitate (Santier.app)

Această analiză compară funcționalitățile promise pe **Homepage** și simulările interactive din pagina **Cum funcționează** cu starea actuală a implementării în cod.

## 1. Analiza "Carduri Active" (Simulări interactive)
Pagina [Cum funcționează](file:///public/cum-functioneaza.html) promite o experiență extrem de interactivă. Iată ce lipsește pentru a egala promisiunea:

| Widget / Card | Funcționalitate Promisă | Stare Actuală | Observații |
| :--- | :--- | :--- | :--- |
| **Widget 05: Achiziție** | Calcul impact profit *înainte* de salvare (Live feedback). | **Parțial / Lipsește** | Aplicația înregistrează achiziția, dar UX-ul de "Impact după această achiziție" prezent în simulare nu este complet implementat în fluxul de salvare. |
| **Widget 06: Comparator** | Comparare strategică "BCA vs Cărămidă" (Cost + Timp). | **Lipsește (Coming Soon)** | În Dashboard, modulul de scenarii este marcat ca "Modul indisponibil / În curând". |
| **Widget 08: Alerte** | Alertă dinamică cu 3 praguri (OK, Warning, Danger) în funcție de sumă. | **Parțial** | Calculul există în `financials.ts`, dar afișarea este statică în Dashboard, nu reactivă în timpul introducerii datelor. |
| **Widget 09: Timp** | Recalculare durată proiect prin modificarea nr. de muncitori. | **Realizat** | Componenta `ProjectTimeline` implementează această logică de calcul. |

## 2. Promisiuni pe Homepage
Analiza secțiunilor de marketing vs. codul sursă:

### ✅ Realizate (Total)
- **Smart Calculator**: Generarea cantităților din dimensiuni (Fundație, Structură etc.) este complet funcțională în `SmartCalculator.tsx`.
- **Editare Rețete**: Utilizatorul poate extinde orice articol și modifica Materiale/Manoperă (`EstimateEditor.tsx`).
- **Link Beneficiar**: Fluxul de share și vizualizarea simplificată pentru client sunt implementate.
- **Export PDF/Excel**: Infrastructura de print este prezentă.

### ⚠️ Realizate Parțial / În Lucru
- **Alerte Depășire Buget**: "Alertă imediată când o achiziție duce o etapă peste buget". Logică există, dar UX-ul nu este la fel de "agresiv" și preventiv ca în promisiuni.
- **Foto la Achiziții**: Există `OcrPreviewModal`, dar integrarea automată a datelor din bon în formularul de achiziție pare a fi în stadiu experimental.
- **Comparator Furnizori**: Există `VendorOfferPicker`, dar nu sub forma unui tabel comparativ (Supplier A vs B vs C) menționat pe homepage.

### ❌ Nerealizate (Missing)
- **Catalog 1.100+ Articole**: Catalogul actual este sub pragul de 1.100 de norme românești complete (necesită verificare de date/seed).
- **Modul Echipă (Multi-user)**: Promis în planul de prețuri "Echipă", dar interfața de gestionare a echipei și jurnalul partajat nu au fost găsite.
- **Import Extras Cantități**: Promisiunea de a încărca un Excel și a mapa coloanele automat nu are încă o implementare vizibilă în UI.

## 3. Recomandări de Prioritizare
Pentru a nu dezamăgi utilizatorii care vin din pagina de marketing:

1. **Urgent**: Implementarea feedback-ului de "Impact Buget" direct în fereastra de adăugare achiziție (Widget 05). Este promisiunea centrală de "control total".
2. **Mediu**: Finalizarea Comparatorului Strategic (BCA vs Cărămidă), deoarece este vizibil în Dashboard ca fiind "În curând".
3. **Draft**: Curățarea catalogului pentru a asigura calitatea normelor promise.

> [!IMPORTANT]
> Cel mai mare gap de UX este între **simularea de achiziție** (care te avertizează *înainte* să cheltui banii) și **fluxul real** (care te anunță în Dashboard *după* ce ai salvat achiziția).
