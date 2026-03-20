Etapa 3: OCR & Smart Calculator 🧠
Această etapă vizează automatizarea introducerii datelor prin extragerea cantităților din planuri (Tabele de Armare/Extrase de fier) și calculul automat al necesarului de materiale pe baza dimensiunilor geometrice ale casei.

User Review Required
IMPORTANT

Motor OCR: Propun folosirea Google Vision API sau Tesseract.js (pentru procesare locală). Google Vision este mult mai precis pentru tabele complexe.
Format Planuri: OCR-ul se va concentra inițial pe extrasele de armare tipizate (tabele de fier).
Proposed Changes
[Backend & Database]
[MODIFY] 
schema.sql
Adăugare suport pentru stocarea metadatelor OCR în estimate_lines.
Extindere coloană dimensions în projects pentru parametri geometrici avansați (grosime placă, înălțime grinzi etc.).
[OCR Integration]
[NEW] 
ocr.ts
Serviciu pentru procesarea imaginilor și maparea textului detectat în structuri de date (Greutate fier, Diametru, Marcă).
[Smart Calculator Component]
[NEW] 
SmartCalculator.tsx
Interfață pentru introducerea dimensiunilor casei.
Algoritmi de calcul pentru: Beton (volum), Cofraje (suprafață), Săpătură.
Verification Plan
Automated Tests
Testarea scriptului de parsing OCR cu mostre de imagini (Tabele de fier).
Validarea formulelor matematice pentru volume și suprafețe.
Manual Verification
Încărcarea unui extras de armare și verificarea auto-completării în deviz.
Modificarea dimensiunilor casei și observarea actualizării cantităților sugerate.
