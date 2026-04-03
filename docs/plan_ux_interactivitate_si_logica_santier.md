# Roadmap Implementare: Experiență Utilizator Șantier.app (Viziune Globală)

Acest document urmărește pas cu pas transformarea aplicației dintr-un instrument static într-unul interactiv și ghidat, conform planului agreat de utilizator.

## Status General: [ ] Inactiv | [/] În lucru | [x] Finalizat

---

### 1. Etapa: Deviz Interactiv (Editare "Where You See It")
**Obiectiv:** Utilizatorul trebuie să poată modifica cifrele direct în vizualizarea de tip "Deviz Detaliat", păstrând aspectul actual.

- [ ] Adăugarea funcției `onUpdateLine` în `ProjectDevizView`.
- [ ] Transformarea coloanei **Cantitate** în input editabil (stilizat să apară la hover/click).
- [ ] Transformarea coloanei **Preț unitar** (pentru manual) în input editabil.
- [ ] Sincronizarea modificărilor cu state-ul global din `ProjectClientContainer`.

---

### 2. Etapa: Flux Ghidat (Project Assistant)
**Obiectiv:** Ghidarea utilizatorului nou prin proiect cu un stepper vizual.

- [ ] Implementarea componentei `ProjectStepper` în header-ul containerului de proiect.
- [ ] Definirea stărilor automate: Configurare -> Ofertare -> Execuție.
- [ ] Adăugarea sugestiilor de acțiune (Smart CTA) în funcție de datele din proiect.

---

### 3. Etapa: Gestionarea Articolelor "Fără Rețetă"
**Obiectiv:** Eliminarea tabelelor goale și ghidarea spre definirea rețetelor.

- [ ] Detectarea automată a liniilor fără resurse detaliate în `EstimateEditor`.
- [ ] Afișarea unui buton de tip "Adaugă Rețetă" proeminent pentru aceste cazuri.
- [ ] Stilizarea rândurilor simple pentru a nu părea incomplete.

---

### 4. Etapa: Transparență și Intuiție (Finisaje UX)
**Obiectiv:** Explicarea logicilor matematice și îmbunătățirea terminologiei.

- [ ] Implementarea iconiței de `Info` lângă "Total" cu calculul defalcat (Mat + Prof + TVA).
- [ ] Înlocuirea termenilor tehnici (ex: "Smart Link") cu limbaj de șantier.
- [ ] Ajustarea bordurilor și a stărilor de focus pentru toate input-urile (vizibilitate pe mobil).

---

### 5. Etapa: Optimizare și Verificare
- [ ] Testarea tuturor fluxurilor pe simulatorul de mobil.
- [ ] Verificarea integrității exporturilor PDF/CSV după activarea editării interactive.
