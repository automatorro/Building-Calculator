Implementation Plan V4: Professional Procurement & Comparative Analysis
Această etapă transformă aplicația dintr-un calculator teoretic într-un instrument serios de management pentru constructori, concentrându-se pe realitatea achizițiilor și a comparației de prețuri între furnizori.

Problematică
Aplicația actuală calculează totaluri pe baza unor medii sau a unui singur preț din catalog. În realitate:

Firmele cer oferte de la mai mulți distribuitori pentru același set de materiale.
Decizia se bazează pe prețul cel mai mic per produs sau per pachet.
Manopera se negociază fix, nu ca un procent fix din materiale.
Proposed Changes
1. Database Schema Evolution
Avem nevoie de suport pentru furnizori și prețuri multiple.

[NEW] shops table
id (UUID, PK)
name (String)
location (String, Optional)
created_at
[NEW] vendor_offers table
id (UUID, PK)
project_id (UUID, FK)
shop_id (UUID, FK)
resource_id (UUID, FK)
unit_price (Decimal)
is_selected (Boolean) - indică dacă acest preț este cel ales pentru calculul final.
[MODIFY] projects table
Adăugare coloană stages (JSONB) pentru a defini etapele lucrării (ex: Fundație, Termosistem, Finisaje) dacă nu folosim o tabelă separată.
2. UI/UX: Comparative Quote Engine
Vom crea o interfață unde utilizatorul poate vedea o matrice a prețurilor.

[NEW] Comparative Grid
Rânduri: Materialele necesare proiectului.
Coloane: Magazinele (Shop 1, Shop 2, Dedeman, etc.).
Celule: Prețul unitar oferit.
Sistem de semnalizare pentru "Cel mai mic preț".
3. Estimate Editor Refactoring (Unified Data Handling)
Indiferent de sursa datelor (OCR, Manual sau Catalog), comportamentul trebuie să fie identic:

Editabilitate Totală: Toate câmpurile (denumire, cantitate, UM, preț) sunt editabile în orice variantă.
Control Complet: Utilizatorul poate șterge sau adăuga materiale noi în orice etapă, indiferent dacă restul listei a fost scanată.
Manual Entry First: Posibilitatea de a adăuga resurse ad-hoc fără a fi în catalogul global.
Labor Override: Câmp dedicat pentru Manoperă reală (valoare fixă/negociată) per etapă.
Smart Recalculation: Totalul proiectului se bazează pe prețurile selectate din ofertele furnizorilor.
Verification Plan
Automated Tests
Testarea logicii de "Cheapest Basket" (selectarea automată a furnizorului cu prețul minim).
Verificarea integrității între vendor_offers și totalul devizului.
Manual Verification
Introducerea unei liste de materiale pentru un "Termosistem".
Adăugarea a 3 furnizori cu prețuri diferite.
Verificarea faptului că totalul se schimbă în timp real la selectarea unui alt furnizor.