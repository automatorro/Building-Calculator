# Raport Analiză UX/UI: Fricțiuni și Probleme de Logică (Pagina Proiect)

Acest raport prezintă experiența brută a unui utilizator nou în cadrul paginii de proiect, evidențiind elementele de interfață neintuitive și lipsa de feedback vizual.

## 1. Catalog -> Proiect: Lipsa Feedback-ului
*   **Acțiune:** Utilizatorul caută o normă în Catalog și apasă butonul `+` pentru adăugare.
*   **Problema:** Interfața nu oferă nicio confirmare (notificare, bifă, animație). Utilizatorul nu știe dacă acțiunea a reușit.
*   **Rezultat:** Norma este adăugată "silențios" în secțiunea **„Alte Lucrări”** din proiect, dar poartă eticheta **„MANUAL”**, ceea ce creează confuzie (de ce o normă oficială este marcată ca manuală?).

## 2. Planificare: Enigma Valorilor (0) și a Totalului
*   **Acțiune:** În secțiunea „Centralizator Lucrări”, utilizatorul extinde o lucrare (săgeată jos) și vede câmpurile: `Material`, `Manoperă`, `Utilaje`, `Transport` (toate fiind inițial `0`).
*   **Problema:** Când introduci o valoare (ex: `580` la Material), Totalul rândului sare la o cifră mult mai mare (ex: `797,50`).
*   **Fricțiune:** Nu există nicio explicație pentru acest calcul. Utilizatorul nu vede cotele de profit, regie sau TVA aplicate. Cifra pare „umflată” fără justificare legală sau matematică vizibilă.

## 3. Meniul Contextual (3 Puncte Verticale)
*   **Acțiune:** Utilizatorul apasă pe cele 3 puncte din dreptul totalului unei lucrări.
*   **Problema:** Apar opțiuni precum „Beton fundații (m3)” sau „Beton placă”. La selectare, totalul se modifică brusc.
*   **Fricțiune:** Nu este clar ce reprezintă aceste opțiuni (sunt rețete rapide? sunt modele de calcul?). Modificarea valorilor „în tăcere” fără a evidenția ce s-a schimbat în spate îi dă utilizatorului senzația de pierdere a controlului.

## 4. „Creează propria rețetă” și Editabilitatea Ascunsă
*   **Acțiune:** Utilizatorul apasă butonul pentru o rețetă nouă.
*   **Problema:** Elementul „Articol nou” apare la finalul listei „Alte Lucrări”, adesea sub „fold” (necesită scroll).
*   **UX Critic (Mobile):** Câmpul pentru denumire („Articol nou”) nu arată ca un câmp de introducere date (input). Nu are borduri sau fundal specific. Utilizatorul trebuie să ghicească faptul că textul este editabil prin click direct.

## 5. Butoane „Oarbe” și Stări de Placeholder
*   În meniul **Operații**, butoane precum „Partajează deviz” sau „Salvează ca șablon” nu produc niciun efect vizual. Meniul se închide și nimic nu se confirmă.
*   **Timeline (Cronologie):** Arată ca un grafic interactiv, dar este 100% static. Nu poți modifica durate sau muta etape, fiind doar o reprezentare vizuală fără funcționalitate reală de planificare.

---

## Concluzie Generală: Minimalismul care Încurcă
Interfața este „curată” vizual, dar **„muta”** funcțional. Lipsa elementelor vizuale de control (input-uri clare, tooltips explicative pentru calcule) și a confirmărilor de succes transformă utilizarea aplicației într-un proces de încercare și eroare. Logica financiară este opacă, ceea ce este critic pentru un instrument de calcul bugete.
