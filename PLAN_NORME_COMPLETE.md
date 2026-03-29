# Plan: Norme Complete cu Rețete — BuildingCalc

# ═══════════════════════════════════════════════════════════════════

# Nou chat în cadrul proiectului BuildingCalc

# Scope: Construiește rețete complete (materiale + manoperă + transport)

# pentru toate normele relevante din catalog\_norms.

# NU se atinge codul aplicației. DOAR date în Supabase.

# ═══════════════════════════════════════════════════════════════════

## 1. CONTEXT ȘI OBIECTIV

**Aplicație:** BuildingCalc — devize construcții, România
**DB:** Supabase `vwcwsxvmkxmcwjtlikcq.supabase.co`
**Tabele relevante:**

- `catalog_norms` — 27.260 norme, câmpul `has_components` (bool)
- `norm_components` — rețetele detaliate, \~733 rânduri existente deja

**Obiectiv:** Construiește rețete complete pentru \~600 tipuri distincte de lucrări,
acoperind rezidențial (case, vile, blocuri) ȘI nerezidențial (birouri, hale, comercial).

**Ce înseamnă "rețetă completă":**

```
O normă (ex: IzA01A1 — Termosistem EPS 10cm, 1mp) = suma componentelor:
  ├── Polistiren EPS grafitat 10cm   → 1.05 mp × 28.00 lei  = 29.40 lei  [material]
  ├── Adeziv + șpaclu de bază       → 6.00 kg × 2.80 lei   = 16.80 lei  [material]
  ├── Dibluri cu cui metalic        → 6.00 buc × 0.90 lei  =  5.40 lei  [material]
  ├── Plasă fibră sticlă 160g       → 1.10 mp × 4.50 lei   =  4.95 lei  [material]
  ├── Grund de amorsare             → 0.20 l × 8.00 lei    =  1.60 lei  [material]
  ├── Tencuială decorativă          → 3.50 kg × 6.00 lei   = 21.00 lei  [material]
  └── Manoperă montaj sistem        → 1.00 mp × 32.00 lei  = 32.00 lei  [manoperă]
                                                    TOTAL = 111.15 lei/mp
```

**Prețuri:** Piață România 2026 (fără TVA). Manoperă = prețuri reale negociate.
**Consumuri:** Norme tehnice românești + pierderi reale din execuție.

***

## 2. STRUCTURA TABELULUI norm\_components

```sql
norm_components (
  id              BIGSERIAL PRIMARY KEY,
  norm_id         BIGINT REFERENCES catalog_norms(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,           -- "Polistiren EPS grafitat 10cm"
  specification   TEXT,                   -- "densitate 15kg/m³, λ=0.031"
  unit            VARCHAR(20) NOT NULL,   -- "mp", "kg", "buc", "ml", "l", "ore"
  qty_per_unit    NUMERIC(10,4) NOT NULL, -- cantitate per unitate de normă
  unit_price      NUMERIC(10,2) NOT NULL, -- preț per unitate componentă (lei, fără TVA)
  component_type  VARCHAR(20) NOT NULL,   -- 'material' | 'manopera' | 'transport' | 'utilaj'
  is_optional     BOOLEAN DEFAULT false,  -- poate fi debifat de user
  optional_note   TEXT,                   -- "necesar doar la colțuri"
  can_substitute  BOOLEAN DEFAULT false,  -- există alternativă
  substitute_note TEXT,                   -- "alternativ: vată minerală +30%"
  sort_order      SMALLINT DEFAULT 0      -- ordinea în UI
)
```

**La fiecare normă cu componente, actualizează și catalog\_norms:**

```sql
UPDATE catalog_norms SET
  has_components = true,
  unit_price = [total calculat din componente obligatorii],
  labor_price = [suma componente tip 'manopera'],
  material_price = [suma componente tip 'material'],
  transport_price = [suma componente tip 'transport'],
  description = '[descriere scurtă a lucrării]'
WHERE symbol = '[SYMBOL]';
```

***

## 3. REGULI DE BAZĂ

### Prețuri materiale 2026 (referință)

| Material                     | Preț orientativ             |
| ---------------------------- | --------------------------- |
| Beton C20/25 gata preparat   | 420–480 lei/mc              |
| Oțel beton PC52/S500         | 4.20–4.80 lei/kg            |
| BCA Ytong 30cm               | 42–48 lei/buc (600×240×300) |
| Cărămidă Porotherm 25cm      | 8.50–9.50 lei/buc           |
| EPS grafitat 10cm            | 26–32 lei/mp                |
| Vată minerală bazaltică 10cm | 28–34 lei/mp                |
| Gips-carton 12.5mm           | 8–10 lei/mp                 |
| Gresie porțelanată 60×60     | 40–65 lei/mp                |
| Adeziv flexibil C2TE         | 2.50–3.00 lei/kg            |
| Ciment Portland 42.5         | 0.80–0.95 lei/kg            |
| Nisip 0-4mm                  | 0.18–0.22 lei/kg            |
| Pietriș 4-16mm               | 0.15–0.20 lei/kg            |
| Cofraj PERI/DOKA             | 12–18 lei/mp/utilizare      |

### Prețuri manoperă 2026 (referință)

| Tip lucrare            | Preț orientativ  |
| ---------------------- | ---------------- |
| Săpătură manuală       | 65–80 lei/mc     |
| Turnare beton cu pompa | 90–120 lei/mc    |
| Montaj armătură        | 3.50–4.50 lei/kg |
| Cofraje plane          | 45–60 lei/mp     |
| Zidărie BCA            | 55–70 lei/mp     |
| Tencuieli manuale      | 35–45 lei/mp     |
| Gresie/faianță         | 45–65 lei/mp     |
| Termosistem EPS        | 30–40 lei/mp     |
| Instalator sanitar     | 180–250 lei/oră  |
| Electrician            | 160–220 lei/oră  |
| Tinichigiu             | 140–180 lei/oră  |

### Pierderi tehnologice standard

| Material       | Pierdere |
| -------------- | -------- |
| Gresie/faianță | 8–12%    |
| Tencuieli      | 5%       |
| Vopsitorii     | 10%      |
| Beton          | 2–3%     |
| Cofraj         | 5%       |
| Zidărie        | 3–5%     |
| Izolații       | 5–8%     |

***

## 4. STRUCTURA SESIUNILOR — 59 sesiuni × 10 norme

### FAZA 1 — Fundație și structură (prioritate maximă)

Sesiunile 1–25 · \~250 norme

**Sesiunea 1 — Terasamente (15 tipuri)**

- Săpătură manuală teren normal/stâncos
- Săpătură mecanică excavator
- Umplutură compactată
- Îndepărtare teren vegetal
- Sprijiniri maluri
- Colmatare cu beton

**Sesiunile 2–8 — Beton și armătură (80 tipuri)**

- Beton simplu fundații continue/izolate
- Beton armat fundații (C12 → C30)
- Stâlpi beton armat (C20/25, C25/30)
- Grinzi beton armat
- Planșee beton armat
- Scări beton armat
- Pereți beton armat (diafragme)
- Armătură OB/PC diferite diametre

**Sesiunile 9–10 — Cofraje (20 tipuri)**

- Cofraje plane (fundații, pereți, planșee)
- Cofraje speciale (stâlpi, grinzi, scări)

**Sesiunile 11–13 — Zidărie (25 tipuri)**

- Zidărie BCA 30cm, 20cm, 15cm
- Zidărie Tip Porotherm 25cm, 30cm, 38cm
- Zidărie cărămidă plină
- Pereți despărțitori gips-carton

***

### FAZA 2 — Finisaje (sesiunile 26–45)

\~200 norme

**Sesiunile 26–30 — Tencuieli și gleturi (30 tipuri)**

- Tencuieli interioare clasice (var-ciment)
- Tencuieli interioare mecanizate
- Tencuieli ipsos manual/proiectat
- Tencuieli exterioare clasice
- Tencuieli exterioare mecanizate
- Gleturi ipsos/acrilic
- Reparații locale
- Sape autonivelante

**Sesiunile 31–35 — Pardoseli (35 tipuri)**

- Gresie porțelanată format mic/mare
- Parchet laminat/stratificat/SPC
- Parchet masiv
- Mozaic
- Epoxidice industriale
- Covor PVC
- Screed autonivelant
- Microciment

**Sesiunile 36–38 — Vopsitorii (20 tipuri)**

- Vopsea lavabilă interior
- Vopsea lavabilă exterior
- Grunduire
- Email pe tâmplărie
- Vopsea epoxidică

**Sesiunile 39–41 — Faianță și placaje (20 tipuri)**

- Faianță baie/bucătărie
- Placaj exterior ceramică
- Placaj piatră naturală
- Mozaic ceramic
- Podea din rasini epoxidice

**Sesiunile 42–45 — Termoizolații (40 tipuri)**

- Termosistem EPS 10/15/20cm
- Termosistem EPS grafitat
- Termosistem Polistiren extrudat
- Termosistem vată minerală
- Izolație planșee (vată/EPS)
- Hidroizolații membrane
- Izolație fonică

***

### FAZA 3 — Acoperișuri și tâmplărie (sesiunile 46–52)

\~75 norme

**Sesiunile 46–48 — Acoperiș (35 tipuri)**

- Șarpantă lemn (grinzi + căpriori)
- Astereală OSB/scândură
- Învelitoare țiglă ceramică/beton
- Învelitoare tablă profilată
- Învelitoare bituminoasă
- Coș fum ceramic/inox
- Jgheaburi și burlane

**Sesiunile 49–52 — Tâmplărie (40 tipuri)**

- Ferestre PVC/aluminiu (tipodimensiuni)
- Uși interior (căptușeală, toc, canate)
- Uși exterior (metalice, lemn)
- Glafuri interior/exterior
- Gard metalic/beton
- Porți

***

### FAZA 4 — Instalații (sesiunile 53–59)

\~100 norme suplimentare

**Sesiunile 53–55 — Instalații sanitare completare**

- Țevi PP/PEX/cupru montaj
- Coloane canalizare PVC
- Obiecte sanitare (completare față de ce există)

**Sesiunile 56–57 — Instalații electrice completare**

- Cabluri și tuburi
- Prize/întrerupătoare
- Corpuri iluminat
- Tablouri electrice

**Sesiunile 58–59 — Instalații termice completare**

- Radiatoare oțel
- Distribuitoare
- Coș fum

***

## 5. FORMATUL SQL PER SESIUNE

Fiecare sesiune produce un bloc SQL de forma:

```sql
BEGIN;

-- NORMA 1: [SYMBOL] — [Denumire scurtă]
UPDATE catalog_norms SET
  has_components = true,
  unit_price = [TOTAL],
  labor_price = [MANOPERA],
  material_price = [MATERIALE],
  transport_price = [TRANSPORT],
  description = '[Descriere 1-2 propoziții]'
WHERE symbol = '[SYMBOL]';

INSERT INTO norm_components
  (norm_id, name, specification, unit, qty_per_unit, unit_price,
   component_type, is_optional, optional_note, can_substitute, substitute_note, sort_order)
SELECT n.id, v.nm, v.sp, v.un, v.qt, v.pr, v.ct, v.op, v.on2, v.cs, v.sn, v.so
FROM catalog_norms n,
(VALUES
  ('Denumire material 1', 'specificație', 'mp', 1.05, 28.00, 'material', false, NULL, false, NULL, 1),
  ('Denumire material 2', 'specificație', 'kg', 6.00,  2.80, 'material', false, NULL, false, NULL, 2),
  ('Manoperă lucrare',    'inclusiv pregătire', 'mp', 1.00, 32.00, 'manopera', false, NULL, false, NULL, 9)
) AS v(nm, sp, un, qt, pr, ct, op, on2, cs, sn, so)
WHERE n.symbol = '[SYMBOL]';

-- NORMA 2: ... (repeat)

COMMIT;
```

***

## 6. REGULI SESIUNE

1. **10 norme per sesiune** — nu mai puțin, nu mai mult.
2. **Fiecare normă are minim:**
   - Materiale principale (cu consumuri reale + pierderi incluse în qty)
   - Manoperă (ore × tarif sau total per unitate)
   - Transport (dacă e relevant)
3. **Prețuri sursă:** piață România 2026, verificate cu web search la nevoie.
4. **Consumurile** se bazează pe: norme tehnice românești, STAS-uri, practica curentă.
5. **Componentele opționale** (is\_optional=true) = materiale auxiliare sau variante.
6. **Nu duplica norme existente** — verifică mai întâi cu:
   ```sql
   SELECT symbol, has_components FROM catalog_norms
   WHERE symbol IN ('TsA01A1', 'TsA02A1', ...) ORDER BY symbol;
   ```
7. **Format commit:** `NORME.S[nr]: [categorie] sesiunea [nr] — [lista simboluri]`

***

## 7. VERIFICARE DUPĂ FIECARE SESIUNE

```sql
-- Câte norme au rețete acum
SELECT has_components, COUNT(*) FROM catalog_norms GROUP BY has_components;

-- Detalii ultima sesiune adăugată
SELECT cn.symbol, cn.name, COUNT(nc.id) AS componente,
       SUM(nc.qty_per_unit * nc.unit_price) AS pret_total
FROM catalog_norms cn
JOIN norm_components nc ON nc.norm_id = cn.id
WHERE cn.symbol IN ('[S1]', '[S2]', ...)
GROUP BY cn.id ORDER BY cn.symbol;
```

***

## 8. TRACKER PROGRES

| Sesiune   | Categorie                                 | Tipuri    | Status |
| --------- | ----------------------------------------- | --------- | ------ |
| S01       | Terasamente                               | 15        | ⏳      |
| S02       | Beton — fundații                          | 10        | ⏳      |
| S03       | Beton — stâlpi, grinzi                    | 10        | ⏳      |
| S04       | Beton — planșee, scări                    | 10        | ⏳      |
| S05       | Beton — pereți, diverse                   | 10        | ⏳      |
| S06       | Armătură OB/PC                            | 10        | ⏳      |
| S07       | Cofraje plane                             | 10        | ⏳      |
| S08       | Cofraje speciale                          | 10        | ⏳      |
| S09       | Zidărie BCA                               | 10        | ⏳      |
| S10       | Zidărie TIP Porotherm + cărămidă cu gauri | 10        | ⏳      |
| S11       | Pereți GC despărțitori                    | 10        | ⏳      |
| S12       | Tencuieli interioare                      | 10        | ⏳      |
| S13       | Tencuieli exterioare                      | 10        | ⏳      |
| S14       | Gleturi și reparații                      | 10        | ⏳      |
| S15       | Gresie format mic/mediu                   | 10        | ⏳      |
| S16       | Gresie format mare + epoxidice            | 10        | ⏳      |
| S17       | Parchet                                   | 10        | ⏳      |
| S18       | Alte pardoseli                            | 10        | ⏳      |
| S19       | Vopsitorii interior                       | 10        | ⏳      |
| S20       | Vopsitorii exterior                       | 10        | ⏳      |
| S21       | Faianță                                   | 10        | ⏳      |
| S22       | Placaje speciale                          | 10        | ⏳      |
| S23       | Termosistem EPS                           | 10        | ⏳      |
| S24       | Termosistem vată + hidroizolații          | 10        | ⏳      |
| S25       | Izolații planșee + fonice                 | 10        | ⏳      |
| S26       | Șarpantă lemn                             | 10        | ⏳      |
| S27       | Învelitoare țiglă + bitum                 | 10        | ⏳      |
| S28       | Tablă + jgheaburi + coș fum               | 10        | ⏳      |
| S29       | Ferestre PVC                              | 10        | ⏳      |
| S30       | Ferestre aluminiu + uși interior          | 10        | ⏳      |
| S31       | Uși exterior + garduri                    | 10        | ⏳      |
| S32       | Glafuri + tâmplărie specială              | 10        | ⏳      |
| S33       | Instalații sanitare — țevi                | 10        | ⏳      |
| S34       | Instalații sanitare — canalizare          | 10        | ⏳      |
| S35       | Instalații sanitare — obiecte             | 10        | ⏳      |
| S36       | Instalații electrice — cabluri            | 10        | ⏳      |
| S37       | Instalații electrice — prize/corp.        | 10        | ⏳      |
| S38       | Instalații electrice — tablouri           | 10        | ⏳      |
| S39       | Instalații termice completare             | 10        | ⏳      |
| S40–S59   | Completări nerezidențial + speciale       | 200       | ⏳      |
| **TOTAL** | <br />                                    | **\~598** | <br /> |

***

## 9. ACOPERIRE REZIDENȚIAL vs. NEREZIDENȚIAL

### Rezidențial acoperit (case, vile, blocuri):

- Fundații și structură beton armat ✓
- Zidărie și compartimentări ✓
- Toate finisajele uzuale ✓
- Acoperiș țiglă + tablă ✓
- Instalații sanitare complete ✓
- Instalații electrice standard ✓
- Instalații termice (centrale, radiatoare, pardoseală radiantă) ✓
- Termosistem + hidroizolații ✓

### Nerezidențial adăugat față de rezidențial:

- Cofraje glisante și speciale pentru înălțimi mari
- Planșee industriale (epoxidice, durcit)
- Pereți cortină (aluminiu + sticlă) — S40–42
- Acoperișuri plate (membrane EPDM, TPO) — S43–44
- Instalații ventiloconvectoare — S45–46
- Rampe + platforme de încărcare — S47
- Iluminat industrial (LED high-bay) — S48
- Structuri metalice (elemente uzuale) — S49–52

***

## 10. CUM SE FOLOSEȘTE ACEST PLAN

**La fiecare sesiune nouă:**

1. Specifică: "Execută sesiunea S\[X] — \[categorie]"
2. Sistemul verifică mai întâi ce simboluri există în catalog pentru acea categorie
3. Selectează 10 norme reprezentative (nealese anterior)
4. Generează SQL complet cu componente, consumuri, prețuri 2026
5. Tu rulezi SQL-ul în Supabase
6. Bifezi sesiunea în tracker

**Comandă de start sesiune:**

```
Execută sesiunea S01 — Terasamente.
Verifică mai întâi ce simboluri există în catalog_norms pentru categoria
'Terasamente'. Selectează 10 norme reprezentative și generează SQL complet
cu toate componentele, consumuri reale și prețuri piață România 2026.
```

***

*Plan generat: 27 martie 2026*
*BuildingCalc — Norme Complete cu Rețete*
*Estimare totală: \~60 sesiuni × 10 norme = \~600 tipuri distincte*
