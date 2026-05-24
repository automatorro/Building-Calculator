/**
 * lib/project-templates.ts
 *
 * Șabloane pre-populate per tipologie de proiect.
 * Fișier izolat — nu modifică niciun flux existent.
 * Funcția applyTemplate() doar inserează rânduri în estimate_lines.
 * După inserare, proiectul urmează cursul normal al oricărui proiect.
 */

interface ResourceOverride {
  id: string
  name: string
  type: 'material' | 'labor' | 'equipment' | 'transport'
  um: string
  consumption: number
  unit_price: number
  waste_percent: number
}

interface TemplateLine {
  stage_name: string
  name: string
  unit: string
  quantity: number
  resources_override: ResourceOverride[]
}

// ─── ETAPE ȘI ARTICOLE PER TIPOLOGIE ──────────────────────────────────────
// stage_name TREBUIE să corespundă exact cu stages[] din PROJECT_TYPES
// definit în app/projects/new/page.tsx

const TEMPLATE_LINES: Record<string, TemplateLine[]> = {

  // ════════════════════════════════════════════════════════════════════
  // BLOC DE APARTAMENTE
  // Etape: 00. Organizare Șantier, 01. Infrastructură, 02. Suprastructură,
  //        03. Arhitectură - Închideri, 04. Arhitectură - Finisaje,
  //        05. Instalații Electrice, 06. Instalații Sanitare/Termice,
  //        07. Fațade, 08. Sistematizare exterioară
  // ════════════════════════════════════════════════════════════════════
  bloc: [
    {
      stage_name: '00. Organizare Șantier',
      name: 'Împrejmuire șantier din panouri metalice provizorii',
      unit: 'ml',
      quantity: 80,
      resources_override: [
        { id: 'bl-01-m1', name: 'Panouri metalice împrejmuire', type: 'material', um: 'ml', consumption: 1, unit_price: 45, waste_percent: 0 },
        { id: 'bl-01-l1', name: 'Manoperă montaj/demontaj împrejmuire', type: 'labor', um: 'ml', consumption: 1, unit_price: 25, waste_percent: 0 },
      ],
    },
    {
      stage_name: '00. Organizare Șantier',
      name: 'Baracă șantier și racorduri provizorii apă/curent',
      unit: 'lp',
      quantity: 1,
      resources_override: [
        { id: 'bl-02-m1', name: 'Baracă metalică modulară șantier', type: 'material', um: 'buc', consumption: 2, unit_price: 3500, waste_percent: 0 },
        { id: 'bl-02-l1', name: 'Manoperă amplasare și racordare barace', type: 'labor', um: 'lp', consumption: 1, unit_price: 1800, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură',
      name: 'Săpătură mecanizată pentru fundații și demisol',
      unit: 'mc',
      quantity: 380,
      resources_override: [
        { id: 'bl-03-u1', name: 'Excavator pe șenile', type: 'equipment', um: 'mc', consumption: 1, unit_price: 28, waste_percent: 0 },
        { id: 'bl-03-l1', name: 'Manoperă coordonare + finisare manuală', type: 'labor', um: 'mc', consumption: 0.12, unit_price: 80, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură',
      name: 'Beton de egalizare C8/10 sub fundații (5cm)',
      unit: 'mc',
      quantity: 18,
      resources_override: [
        { id: 'bl-04-m1', name: 'Beton C8/10', type: 'material', um: 'mc', consumption: 1.02, unit_price: 330, waste_percent: 2 },
        { id: 'bl-04-l1', name: 'Manoperă turnare beton egalizare', type: 'labor', um: 'mc', consumption: 1, unit_price: 90, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură',
      name: 'Fundații continue/radier beton armat C20/25',
      unit: 'mc',
      quantity: 95,
      resources_override: [
        { id: 'bl-05-m1', name: 'Beton C20/25', type: 'material', um: 'mc', consumption: 1.03, unit_price: 450, waste_percent: 3 },
        { id: 'bl-05-m2', name: 'Oțel beton PC52 Ø12-16mm', type: 'material', um: 'kg', consumption: 85, unit_price: 4.8, waste_percent: 2 },
        { id: 'bl-05-m3', name: 'Cofraj din lemn pentru fundații', type: 'material', um: 'mp', consumption: 1.2, unit_price: 22, waste_percent: 5 },
        { id: 'bl-05-l1', name: 'Manoperă cofrare/armare/betonare fundații', type: 'labor', um: 'mc', consumption: 1, unit_price: 280, waste_percent: 0 },
        { id: 'bl-05-u1', name: 'Pompă de beton', type: 'equipment', um: 'mc', consumption: 1, unit_price: 38, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură',
      name: 'Hidroizolație fundații — membrană bituminoasă 2 straturi',
      unit: 'mp',
      quantity: 420,
      resources_override: [
        { id: 'bl-06-m1', name: 'Membrană bituminoasă SBS 4mm', type: 'material', um: 'mp', consumption: 1.1, unit_price: 28, waste_percent: 5 },
        { id: 'bl-06-m2', name: 'Primer bituminos', type: 'material', um: 'mp', consumption: 1, unit_price: 6, waste_percent: 0 },
        { id: 'bl-06-l1', name: 'Manoperă aplicare hidroizolație', type: 'labor', um: 'mp', consumption: 1, unit_price: 22, waste_percent: 0 },
      ],
    },
    {
      stage_name: '02. Suprastructură',
      name: 'Stâlpi din beton armat C25/30',
      unit: 'mc',
      quantity: 42,
      resources_override: [
        { id: 'bl-07-m1', name: 'Beton C25/30', type: 'material', um: 'mc', consumption: 1.03, unit_price: 490, waste_percent: 3 },
        { id: 'bl-07-m2', name: 'Oțel beton PC52 Ø16-25mm', type: 'material', um: 'kg', consumption: 120, unit_price: 4.8, waste_percent: 2 },
        { id: 'bl-07-m3', name: 'Cofraj metalic recuperabil stâlpi', type: 'material', um: 'mp', consumption: 5.5, unit_price: 8, waste_percent: 0 },
        { id: 'bl-07-l1', name: 'Manoperă cofrare/armare/betonare/decofrare stâlpi', type: 'labor', um: 'mc', consumption: 1, unit_price: 420, waste_percent: 0 },
        { id: 'bl-07-u1', name: 'Pompă beton + macara turn', type: 'equipment', um: 'mc', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: '02. Suprastructură',
      name: 'Planșeu beton armat monolit C25/30 (per nivel)',
      unit: 'mp',
      quantity: 620,
      resources_override: [
        { id: 'bl-08-m1', name: 'Beton C25/30', type: 'material', um: 'mc', consumption: 0.14, unit_price: 490, waste_percent: 3 },
        { id: 'bl-08-m2', name: 'Oțel beton PC52 plase și bare', type: 'material', um: 'kg', consumption: 12, unit_price: 4.8, waste_percent: 2 },
        { id: 'bl-08-m3', name: 'Cofraj din panouri tego + echer metalic', type: 'material', um: 'mp', consumption: 1.05, unit_price: 18, waste_percent: 0 },
        { id: 'bl-08-l1', name: 'Manoperă cofrare/armare/betonare planșeu', type: 'labor', um: 'mp', consumption: 1, unit_price: 95, waste_percent: 0 },
        { id: 'bl-08-u1', name: 'Pompă de beton', type: 'equipment', um: 'mp', consumption: 1, unit_price: 8, waste_percent: 0 },
      ],
    },
    {
      stage_name: '02. Suprastructură',
      name: 'Scări interioare beton armat C25/30',
      unit: 'mc',
      quantity: 18,
      resources_override: [
        { id: 'bl-09-m1', name: 'Beton C25/30', type: 'material', um: 'mc', consumption: 1.03, unit_price: 490, waste_percent: 3 },
        { id: 'bl-09-m2', name: 'Oțel beton PC52', type: 'material', um: 'kg', consumption: 95, unit_price: 4.8, waste_percent: 2 },
        { id: 'bl-09-m3', name: 'Cofraj special pentru scări', type: 'material', um: 'mp', consumption: 4, unit_price: 22, waste_percent: 5 },
        { id: 'bl-09-l1', name: 'Manoperă cofrare/armare/betonare scări', type: 'labor', um: 'mc', consumption: 1, unit_price: 480, waste_percent: 0 },
      ],
    },
    {
      stage_name: '03. Arhitectură - Închideri',
      name: 'Zidărie exterioară din BCA 30cm',
      unit: 'mc',
      quantity: 185,
      resources_override: [
        { id: 'bl-10-m1', name: 'Blocuri BCA 30cm (600x250x300mm)', type: 'material', um: 'mc', consumption: 1.05, unit_price: 520, waste_percent: 5 },
        { id: 'bl-10-m2', name: 'Mortar adeziv BCA (sac 25kg)', type: 'material', um: 'sac', consumption: 2.5, unit_price: 32, waste_percent: 5 },
        { id: 'bl-10-l1', name: 'Manoperă zidărie BCA', type: 'labor', um: 'mc', consumption: 1, unit_price: 185, waste_percent: 0 },
      ],
    },
    {
      stage_name: '03. Arhitectură - Închideri',
      name: 'Pereți despărțitori din GKB dublu placat cu fonoizolație',
      unit: 'mp',
      quantity: 480,
      resources_override: [
        { id: 'bl-11-m1', name: 'Placă GKB 12.5mm standard', type: 'material', um: 'mp', consumption: 2.1, unit_price: 28, waste_percent: 5 },
        { id: 'bl-11-m2', name: 'Profil CW75/UW75 galvanizat', type: 'material', um: 'ml', consumption: 1.8, unit_price: 12, waste_percent: 3 },
        { id: 'bl-11-m3', name: 'Vată minerală fonoizolantă 50mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 22, waste_percent: 5 },
        { id: 'bl-11-l1', name: 'Manoperă montaj perete GKB', type: 'labor', um: 'mp', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: '04. Arhitectură - Finisaje',
      name: 'Tencuieli interioare mecanizate pe zidărie și beton',
      unit: 'mp',
      quantity: 2800,
      resources_override: [
        { id: 'bl-12-m1', name: 'Mortar gips mecanic (sac 30kg)', type: 'material', um: 'sac', consumption: 1.2, unit_price: 38, waste_percent: 5 },
        { id: 'bl-12-l1', name: 'Manoperă tencuire mecanizată', type: 'labor', um: 'mp', consumption: 1, unit_price: 28, waste_percent: 0 },
        { id: 'bl-12-u1', name: 'Agregat de tencuit', type: 'equipment', um: 'mp', consumption: 1, unit_price: 4, waste_percent: 0 },
      ],
    },
    {
      stage_name: '04. Arhitectură - Finisaje',
      name: 'Glet finisaj ipsos 2 straturi (pereți + tavan)',
      unit: 'mp',
      quantity: 2800,
      resources_override: [
        { id: 'bl-13-m1', name: 'Glet finisaj ipsos (sac 25kg)', type: 'material', um: 'sac', consumption: 0.7, unit_price: 35, waste_percent: 5 },
        { id: 'bl-13-l1', name: 'Manoperă glet 2 straturi', type: 'labor', um: 'mp', consumption: 1, unit_price: 22, waste_percent: 0 },
      ],
    },
    {
      stage_name: '05. Instalații Electrice',
      name: 'Instalație electrică per apartament (trasee + tablou + prize)',
      unit: 'ap',
      quantity: 32,
      resources_override: [
        { id: 'bl-14-m1', name: 'Conductor CYY-F cupru 3x2.5mm²', type: 'material', um: 'ml', consumption: 45, unit_price: 4.5, waste_percent: 5 },
        { id: 'bl-14-m2', name: 'Tub PVC rigid Ø25mm', type: 'material', um: 'ml', consumption: 30, unit_price: 2.8, waste_percent: 5 },
        { id: 'bl-14-m3', name: 'Tablou electric apartament 20 module', type: 'material', um: 'buc', consumption: 1, unit_price: 380, waste_percent: 0 },
        { id: 'bl-14-l1', name: 'Manoperă instalație electrică per apartament', type: 'labor', um: 'ap', consumption: 1, unit_price: 2800, waste_percent: 0 },
      ],
    },
    {
      stage_name: '06. Instalații Sanitare/Termice',
      name: 'Coloane sanitare comune + distribuție per apartament',
      unit: 'ap',
      quantity: 32,
      resources_override: [
        { id: 'bl-15-m1', name: 'Țeavă PPR PN20 Ø20-32mm izolată', type: 'material', um: 'ml', consumption: 12, unit_price: 22, waste_percent: 5 },
        { id: 'bl-15-m2', name: 'Țeavă canalizare PVC KG Ø110mm', type: 'material', um: 'ml', consumption: 6, unit_price: 32, waste_percent: 3 },
        { id: 'bl-15-l1', name: 'Manoperă instalator sanitar per apartament', type: 'labor', um: 'ap', consumption: 1, unit_price: 2200, waste_percent: 0 },
      ],
    },
    {
      stage_name: '07. Fațade',
      name: 'Sistem termoizolant ETICS — polistiren grafitat 12cm',
      unit: 'mp',
      quantity: 680,
      resources_override: [
        { id: 'bl-16-m1', name: 'Polistiren grafitat EPS 100 — 12cm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 48, waste_percent: 5 },
        { id: 'bl-16-m2', name: 'Adeziv + grund aplicare EPS', type: 'material', um: 'mp', consumption: 1, unit_price: 14, waste_percent: 5 },
        { id: 'bl-16-m3', name: 'Dibluri termice (8 buc/mp)', type: 'material', um: 'buc', consumption: 8, unit_price: 1.2, waste_percent: 0 },
        { id: 'bl-16-m4', name: 'Plasă fibră sticlă 145g/mp', type: 'material', um: 'mp', consumption: 1.1, unit_price: 8, waste_percent: 5 },
        { id: 'bl-16-m5', name: 'Tencuială siloxanică decorativă 1.5mm', type: 'material', um: 'mp', consumption: 1, unit_price: 38, waste_percent: 5 },
        { id: 'bl-16-l1', name: 'Manoperă montaj sistem ETICS complet', type: 'labor', um: 'mp', consumption: 1, unit_price: 85, waste_percent: 0 },
      ],
    },
    {
      stage_name: '08. Sistematizare exterioară',
      name: 'Trotuare și alei din beton C16/20',
      unit: 'mp',
      quantity: 280,
      resources_override: [
        { id: 'bl-17-m1', name: 'Balast compactat 15cm', type: 'material', um: 'mc', consumption: 0.15, unit_price: 85, waste_percent: 5 },
        { id: 'bl-17-m2', name: 'Beton C16/20 pentru trotuare — 10cm', type: 'material', um: 'mc', consumption: 0.1, unit_price: 420, waste_percent: 3 },
        { id: 'bl-17-l1', name: 'Manoperă executare trotuare și alei', type: 'labor', um: 'mp', consumption: 1, unit_price: 35, waste_percent: 0 },
      ],
    },
    {
      stage_name: '08. Sistematizare exterioară',
      name: 'Gard perimetral din panouri metalice și stâlpi',
      unit: 'ml',
      quantity: 80,
      resources_override: [
        { id: 'bl-18-m1', name: 'Panou gard zincat 2.5m înălțime', type: 'material', um: 'ml', consumption: 1, unit_price: 185, waste_percent: 2 },
        { id: 'bl-18-m2', name: 'Stâlp metalic Ø60mm zincat', type: 'material', um: 'buc', consumption: 0.4, unit_price: 220, waste_percent: 0 },
        { id: 'bl-18-l1', name: 'Manoperă montaj gard', type: 'labor', um: 'ml', consumption: 1, unit_price: 45, waste_percent: 0 },
      ],
    },
  ],

  // ════════════════════════════════════════════════════════════════════
  // CASĂ INDIVIDUALĂ
  // Etape: Organizare Șantier, Infrastructură, Suprastructură,
  //        Arhitectură / Compartimentări, Finisaje Interioare,
  //        Instalații, Fațade / Acoperiș
  // ════════════════════════════════════════════════════════════════════
  casa: [
    {
      stage_name: 'Organizare Șantier',
      name: 'Împrejmuire teren și racorduri provizorii',
      unit: 'ml',
      quantity: 60,
      resources_override: [
        { id: 'ca-01-m1', name: 'Panouri metalice împrejmuire', type: 'material', um: 'ml', consumption: 1, unit_price: 40, waste_percent: 0 },
        { id: 'ca-01-l1', name: 'Manoperă montaj/demontaj împrejmuire', type: 'labor', um: 'ml', consumption: 1, unit_price: 22, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Infrastructură',
      name: 'Săpătură manuală și mecanizată pentru fundații',
      unit: 'mc',
      quantity: 65,
      resources_override: [
        { id: 'ca-02-u1', name: 'Miniexcavator', type: 'equipment', um: 'mc', consumption: 0.75, unit_price: 32, waste_percent: 0 },
        { id: 'ca-02-l1', name: 'Manoperă săpătură manuală finisare', type: 'labor', um: 'mc', consumption: 0.25, unit_price: 90, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Infrastructură',
      name: 'Strat de pietriș compactat 20cm sub fundații',
      unit: 'mp',
      quantity: 140,
      resources_override: [
        { id: 'ca-03-m1', name: 'Pietriș sort 16-32mm', type: 'material', um: 'mc', consumption: 0.22, unit_price: 92, waste_percent: 5 },
        { id: 'ca-03-l1', name: 'Manoperă împrăștiere și compactare', type: 'labor', um: 'mp', consumption: 1, unit_price: 12, waste_percent: 0 },
        { id: 'ca-03-u1', name: 'Placa vibratoare', type: 'equipment', um: 'mp', consumption: 1, unit_price: 5, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Infrastructură',
      name: 'Fundații continue beton armat C20/25',
      unit: 'mc',
      quantity: 28,
      resources_override: [
        { id: 'ca-04-m1', name: 'Beton C20/25', type: 'material', um: 'mc', consumption: 1.03, unit_price: 450, waste_percent: 3 },
        { id: 'ca-04-m2', name: 'Oțel beton PC52 Ø12mm', type: 'material', um: 'kg', consumption: 65, unit_price: 4.8, waste_percent: 2 },
        { id: 'ca-04-m3', name: 'Cofraj din dulapi de lemn', type: 'material', um: 'mp', consumption: 2.2, unit_price: 18, waste_percent: 5 },
        { id: 'ca-04-l1', name: 'Manoperă cofrare/armare/betonare fundații', type: 'labor', um: 'mc', consumption: 1, unit_price: 250, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Suprastructură',
      name: 'Zidărie exterioară din BCA 30cm (parter + etaj)',
      unit: 'mc',
      quantity: 48,
      resources_override: [
        { id: 'ca-05-m1', name: 'Blocuri BCA 30cm (600x250x300mm)', type: 'material', um: 'mc', consumption: 1.05, unit_price: 520, waste_percent: 5 },
        { id: 'ca-05-m2', name: 'Mortar adeziv BCA (sac 25kg)', type: 'material', um: 'sac', consumption: 2.5, unit_price: 32, waste_percent: 5 },
        { id: 'ca-05-l1', name: 'Manoperă zidărie BCA', type: 'labor', um: 'mc', consumption: 1, unit_price: 185, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Suprastructură',
      name: 'Stâlpi și centuri din beton armat C20/25',
      unit: 'mc',
      quantity: 8,
      resources_override: [
        { id: 'ca-06-m1', name: 'Beton C20/25', type: 'material', um: 'mc', consumption: 1.03, unit_price: 450, waste_percent: 3 },
        { id: 'ca-06-m2', name: 'Oțel beton PC52 Ø10-14mm', type: 'material', um: 'kg', consumption: 110, unit_price: 4.8, waste_percent: 2 },
        { id: 'ca-06-m3', name: 'Cofraj din panouri tego', type: 'material', um: 'mp', consumption: 6, unit_price: 16, waste_percent: 5 },
        { id: 'ca-06-l1', name: 'Manoperă cofrare/armare/betonare stâlpi + centuri', type: 'labor', um: 'mc', consumption: 1, unit_price: 380, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Suprastructură',
      name: 'Planșeu beton armat monolit C20/25 peste parter',
      unit: 'mp',
      quantity: 145,
      resources_override: [
        { id: 'ca-07-m1', name: 'Beton C20/25', type: 'material', um: 'mc', consumption: 0.13, unit_price: 450, waste_percent: 3 },
        { id: 'ca-07-m2', name: 'Oțel beton PC52 plase sudate', type: 'material', um: 'kg', consumption: 10, unit_price: 4.8, waste_percent: 2 },
        { id: 'ca-07-m3', name: 'Cofraj din panouri tego + susțineri', type: 'material', um: 'mp', consumption: 1.05, unit_price: 16, waste_percent: 5 },
        { id: 'ca-07-l1', name: 'Manoperă cofrare/armare/betonare planșeu', type: 'labor', um: 'mp', consumption: 1, unit_price: 88, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Fațade / Acoperiș',
      name: 'Șarpantă din lemn ecarisat (căpriori, pane, cosoroabă)',
      unit: 'mc',
      quantity: 12,
      resources_override: [
        { id: 'ca-08-m1', name: 'Lemn ecarisat rășinos clasa C24', type: 'material', um: 'mc', consumption: 1.08, unit_price: 1650, waste_percent: 8 },
        { id: 'ca-08-m2', name: 'Cuie și conectori metalici', type: 'material', um: 'kg', consumption: 8, unit_price: 12, waste_percent: 5 },
        { id: 'ca-08-l1', name: 'Manoperă executare șarpantă', type: 'labor', um: 'mc', consumption: 1, unit_price: 650, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Fațade / Acoperiș',
      name: 'Învelitoare din țiglă ceramică cu astereală și șipcuire',
      unit: 'mp',
      quantity: 185,
      resources_override: [
        { id: 'ca-09-m1', name: 'Țiglă ceramică tip solzi sau ondulată', type: 'material', um: 'buc', consumption: 16, unit_price: 3.2, waste_percent: 5 },
        { id: 'ca-09-m2', name: 'Astereală OSB 10mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 28, waste_percent: 5 },
        { id: 'ca-09-m3', name: 'Folie anticondens difuzie', type: 'material', um: 'mp', consumption: 1.1, unit_price: 6, waste_percent: 5 },
        { id: 'ca-09-m4', name: 'Șipcă 24x48mm pentru contrașipcuire', type: 'material', um: 'ml', consumption: 2.5, unit_price: 3.5, waste_percent: 5 },
        { id: 'ca-09-l1', name: 'Manoperă montaj învelitoare complet', type: 'labor', um: 'mp', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Fațade / Acoperiș',
      name: 'Sistem termoizolant ETICS — polistiren grafitat 10cm',
      unit: 'mp',
      quantity: 280,
      resources_override: [
        { id: 'ca-10-m1', name: 'Polistiren grafitat EPS 100 — 10cm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 42, waste_percent: 5 },
        { id: 'ca-10-m2', name: 'Adeziv + grund aplicare EPS', type: 'material', um: 'mp', consumption: 1, unit_price: 14, waste_percent: 5 },
        { id: 'ca-10-m3', name: 'Dibluri termice (8 buc/mp)', type: 'material', um: 'buc', consumption: 8, unit_price: 1.2, waste_percent: 0 },
        { id: 'ca-10-m4', name: 'Plasă fibră sticlă 145g/mp', type: 'material', um: 'mp', consumption: 1.1, unit_price: 8, waste_percent: 5 },
        { id: 'ca-10-m5', name: 'Tencuială siloxanică decorativă 1.5mm', type: 'material', um: 'mp', consumption: 1, unit_price: 38, waste_percent: 5 },
        { id: 'ca-10-l1', name: 'Manoperă montaj ETICS complet', type: 'labor', um: 'mp', consumption: 1, unit_price: 78, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Arhitectură / Compartimentări',
      name: 'Tencuieli interioare pe zidărie (manual)',
      unit: 'mp',
      quantity: 580,
      resources_override: [
        { id: 'ca-11-m1', name: 'Mortar gips interior (sac 30kg)', type: 'material', um: 'sac', consumption: 1.1, unit_price: 36, waste_percent: 5 },
        { id: 'ca-11-l1', name: 'Manoperă tencuire interioară manuală', type: 'labor', um: 'mp', consumption: 1, unit_price: 38, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Glet finisaj ipsos 2 straturi (pereți + tavan)',
      unit: 'mp',
      quantity: 520,
      resources_override: [
        { id: 'ca-12-m1', name: 'Glet finisaj ipsos (sac 25kg)', type: 'material', um: 'sac', consumption: 0.7, unit_price: 35, waste_percent: 5 },
        { id: 'ca-12-l1', name: 'Manoperă glet 2 straturi', type: 'labor', um: 'mp', consumption: 1, unit_price: 20, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Gresie porțelanată 60x60cm (baie + bucătărie + hol)',
      unit: 'mp',
      quantity: 85,
      resources_override: [
        { id: 'ca-13-m1', name: 'Gresie porțelanată 60x60cm', type: 'material', um: 'mp', consumption: 1.07, unit_price: 95, waste_percent: 7 },
        { id: 'ca-13-m2', name: 'Adeziv flex C2 pentru gresie (sac 25kg)', type: 'material', um: 'sac', consumption: 0.4, unit_price: 52, waste_percent: 5 },
        { id: 'ca-13-m3', name: 'Chit rosturi gresie (sac 5kg)', type: 'material', um: 'sac', consumption: 0.1, unit_price: 38, waste_percent: 5 },
        { id: 'ca-13-l1', name: 'Manoperă montaj gresie', type: 'labor', um: 'mp', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Parchet laminat 8mm AC5 (living + dormitoare)',
      unit: 'mp',
      quantity: 95,
      resources_override: [
        { id: 'ca-14-m1', name: 'Parchet laminat 8mm clasa AC5', type: 'material', um: 'mp', consumption: 1.07, unit_price: 85, waste_percent: 7 },
        { id: 'ca-14-m2', name: 'Subpardoseală fonoizolantă burete 3mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 8, waste_percent: 5 },
        { id: 'ca-14-l1', name: 'Manoperă montaj parchet', type: 'labor', um: 'mp', consumption: 1, unit_price: 35, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Instalații',
      name: 'Instalație electrică interioară completă',
      unit: 'mp',
      quantity: 150,
      resources_override: [
        { id: 'ca-15-m1', name: 'Conductor CYY-F cupru 3x2.5mm²', type: 'material', um: 'ml', consumption: 2.5, unit_price: 4.5, waste_percent: 5 },
        { id: 'ca-15-m2', name: 'Tub PVC rigid Ø25mm', type: 'material', um: 'ml', consumption: 2, unit_price: 3.2, waste_percent: 5 },
        { id: 'ca-15-m3', name: 'Tablou electric 48 module + disjunctori', type: 'material', um: 'buc', consumption: 0.01, unit_price: 850, waste_percent: 0 },
        { id: 'ca-15-l1', name: 'Manoperă electrician (trasee + aparataj)', type: 'labor', um: 'mp', consumption: 1, unit_price: 45, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Instalații',
      name: 'Instalație sanitară apă rece/caldă + canalizare',
      unit: 'mp',
      quantity: 150,
      resources_override: [
        { id: 'ca-16-m1', name: 'Țeavă PPR PN20 Ø20-25mm izolată', type: 'material', um: 'ml', consumption: 0.8, unit_price: 18, waste_percent: 5 },
        { id: 'ca-16-m2', name: 'Fitinguri PPR (coturi, mufe, reductii)', type: 'material', um: 'buc', consumption: 0.5, unit_price: 9, waste_percent: 5 },
        { id: 'ca-16-m3', name: 'Țeavă canalizare PVC KG Ø110mm', type: 'material', um: 'ml', consumption: 0.3, unit_price: 32, waste_percent: 3 },
        { id: 'ca-16-l1', name: 'Manoperă instalator sanitar', type: 'labor', um: 'mp', consumption: 1, unit_price: 38, waste_percent: 0 },
      ],
    },
  ],

  // ════════════════════════════════════════════════════════════════════
  // HALĂ INDUSTRIALĂ
  // Etape: 00. Organizare Șantier, 01. Infrastructură / Fundații,
  //        02. Structură Metalică, 03. Închideri Perimetrale,
  //        04. Pardoseli Industriale, 05. Instalații,
  //        06. Platforme exterioare
  // ════════════════════════════════════════════════════════════════════
  hala: [
    {
      stage_name: '00. Organizare Șantier',
      name: 'Împrejmuire șantier și organizare platformă lucru',
      unit: 'ml',
      quantity: 200,
      resources_override: [
        { id: 'ha-01-m1', name: 'Panouri metalice împrejmuire', type: 'material', um: 'ml', consumption: 1, unit_price: 45, waste_percent: 0 },
        { id: 'ha-01-l1', name: 'Manoperă montaj împrejmuire', type: 'labor', um: 'ml', consumption: 1, unit_price: 22, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură / Fundații',
      name: 'Excavații mecanizate pentru fundații izolate',
      unit: 'mc',
      quantity: 320,
      resources_override: [
        { id: 'ha-02-u1', name: 'Excavator pe șenile', type: 'equipment', um: 'mc', consumption: 1, unit_price: 28, waste_percent: 0 },
        { id: 'ha-02-l1', name: 'Manoperă coordonare + finisare manuală', type: 'labor', um: 'mc', consumption: 0.08, unit_price: 80, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură / Fundații',
      name: 'Beton egalizare C8/10 sub cuzineți',
      unit: 'mc',
      quantity: 12,
      resources_override: [
        { id: 'ha-03-m1', name: 'Beton C8/10', type: 'material', um: 'mc', consumption: 1.02, unit_price: 330, waste_percent: 2 },
        { id: 'ha-03-l1', name: 'Manoperă turnare egalizare', type: 'labor', um: 'mc', consumption: 1, unit_price: 85, waste_percent: 0 },
      ],
    },
    {
      stage_name: '01. Infrastructură / Fundații',
      name: 'Fundații izolate cuzineți beton armat C25/30',
      unit: 'mc',
      quantity: 85,
      resources_override: [
        { id: 'ha-04-m1', name: 'Beton C25/30', type: 'material', um: 'mc', consumption: 1.03, unit_price: 490, waste_percent: 3 },
        { id: 'ha-04-m2', name: 'Oțel beton PC52 Ø16-20mm', type: 'material', um: 'kg', consumption: 75, unit_price: 4.8, waste_percent: 2 },
        { id: 'ha-04-m3', name: 'Cofraj din lemn pentru cuzineți', type: 'material', um: 'mp', consumption: 2.5, unit_price: 18, waste_percent: 5 },
        { id: 'ha-04-l1', name: 'Manoperă cofrare/armare/betonare cuzineți', type: 'labor', um: 'mc', consumption: 1, unit_price: 295, waste_percent: 0 },
        { id: 'ha-04-u1', name: 'Pompă de beton', type: 'equipment', um: 'mc', consumption: 1, unit_price: 38, waste_percent: 0 },
      ],
    },
    {
      stage_name: '02. Structură Metalică',
      name: 'Stâlpi metalici HEA/HEB galvanizați la cald',
      unit: 'kg',
      quantity: 18500,
      resources_override: [
        { id: 'ha-05-m1', name: 'Oțel structural S355 (profile HEA/HEB)', type: 'material', um: 'kg', consumption: 1.02, unit_price: 6.8, waste_percent: 2 },
        { id: 'ha-05-m2', name: 'Vopsea anticorozivă grund + email (2 straturi)', type: 'material', um: 'kg', consumption: 0.015, unit_price: 45, waste_percent: 10 },
        { id: 'ha-05-l1', name: 'Manoperă montaj stâlpi cu macara', type: 'labor', um: 'kg', consumption: 1, unit_price: 0.95, waste_percent: 0 },
        { id: 'ha-05-u1', name: 'Macara telescopică', type: 'equipment', um: 'kg', consumption: 1, unit_price: 0.45, waste_percent: 0 },
      ],
    },
    {
      stage_name: '02. Structură Metalică',
      name: 'Ferme și grinzi principale din oțel S355',
      unit: 'kg',
      quantity: 24000,
      resources_override: [
        { id: 'ha-06-m1', name: 'Oțel structural S355 (ferme/grinzi IPE)', type: 'material', um: 'kg', consumption: 1.02, unit_price: 7.2, waste_percent: 2 },
        { id: 'ha-06-m2', name: 'Vopsea anticorozivă', type: 'material', um: 'kg', consumption: 0.012, unit_price: 45, waste_percent: 10 },
        { id: 'ha-06-l1', name: 'Manoperă asamblare și montaj ferme', type: 'labor', um: 'kg', consumption: 1, unit_price: 1.1, waste_percent: 0 },
        { id: 'ha-06-u1', name: 'Macara + utilaje montaj', type: 'equipment', um: 'kg', consumption: 1, unit_price: 0.5, waste_percent: 0 },
      ],
    },
    {
      stage_name: '02. Structură Metalică',
      name: 'Pane de acoperiș profil Z/C zincat',
      unit: 'kg',
      quantity: 8500,
      resources_override: [
        { id: 'ha-07-m1', name: 'Profil Z200/C200 zincat', type: 'material', um: 'kg', consumption: 1.02, unit_price: 6.2, waste_percent: 2 },
        { id: 'ha-07-l1', name: 'Manoperă montaj pane', type: 'labor', um: 'kg', consumption: 1, unit_price: 0.85, waste_percent: 0 },
      ],
    },
    {
      stage_name: '03. Închideri Perimetrale',
      name: 'Panouri sandwich acoperiș PIR 80mm',
      unit: 'mp',
      quantity: 1200,
      resources_override: [
        { id: 'ha-08-m1', name: 'Panou sandwich acoperiș PIR 80mm (0.5/0.4mm)', type: 'material', um: 'mp', consumption: 1.03, unit_price: 145, waste_percent: 3 },
        { id: 'ha-08-m2', name: 'Accesorii fixare și etanșare acoperiș', type: 'material', um: 'mp', consumption: 1, unit_price: 18, waste_percent: 5 },
        { id: 'ha-08-l1', name: 'Manoperă montaj panouri acoperiș', type: 'labor', um: 'mp', consumption: 1, unit_price: 38, waste_percent: 0 },
      ],
    },
    {
      stage_name: '03. Închideri Perimetrale',
      name: 'Panouri sandwich perete PIR 100mm',
      unit: 'mp',
      quantity: 1850,
      resources_override: [
        { id: 'ha-09-m1', name: 'Panou sandwich perete PIR 100mm', type: 'material', um: 'mp', consumption: 1.02, unit_price: 155, waste_percent: 2 },
        { id: 'ha-09-m2', name: 'Accesorii fixare și etanșare perete', type: 'material', um: 'mp', consumption: 1, unit_price: 14, waste_percent: 5 },
        { id: 'ha-09-l1', name: 'Manoperă montaj panouri pereți', type: 'labor', um: 'mp', consumption: 1, unit_price: 42, waste_percent: 0 },
      ],
    },
    {
      stage_name: '04. Pardoseli Industriale',
      name: 'Strat balast compactat 30cm sub pardoseală',
      unit: 'mc',
      quantity: 350,
      resources_override: [
        { id: 'ha-10-m1', name: 'Balast 0-63mm', type: 'material', um: 'mc', consumption: 1.1, unit_price: 82, waste_percent: 5 },
        { id: 'ha-10-l1', name: 'Manoperă împrăștiere și nivelare', type: 'labor', um: 'mc', consumption: 1, unit_price: 18, waste_percent: 0 },
        { id: 'ha-10-u1', name: 'Buldozer + cilindru compactor', type: 'equipment', um: 'mc', consumption: 1, unit_price: 12, waste_percent: 0 },
      ],
    },
    {
      stage_name: '04. Pardoseli Industriale',
      name: 'Pardoseală industrială beton C25/30 cu cuarțare — 15cm',
      unit: 'mp',
      quantity: 1000,
      resources_override: [
        { id: 'ha-11-m1', name: 'Beton C25/30 S3', type: 'material', um: 'mc', consumption: 0.155, unit_price: 490, waste_percent: 3 },
        { id: 'ha-11-m2', name: 'Plasă sudată 150x150x6mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 22, waste_percent: 5 },
        { id: 'ha-11-m3', name: 'Folie polietilenă 0.2mm antiapă', type: 'material', um: 'mp', consumption: 1.1, unit_price: 3.5, waste_percent: 5 },
        { id: 'ha-11-m4', name: 'Cuarț pentru tratament suprafață (3.5kg/mp)', type: 'material', um: 'kg', consumption: 3.5, unit_price: 4.8, waste_percent: 5 },
        { id: 'ha-11-l1', name: 'Manoperă turnare + finisare elicoidare', type: 'labor', um: 'mp', consumption: 1, unit_price: 52, waste_percent: 0 },
        { id: 'ha-11-u1', name: 'Pompă beton + elicoid (helicopter)', type: 'equipment', um: 'mp', consumption: 1, unit_price: 18, waste_percent: 0 },
      ],
    },
    {
      stage_name: '05. Instalații',
      name: 'Instalație electrică industrială (tablouri + iluminat LED)',
      unit: 'mp',
      quantity: 1000,
      resources_override: [
        { id: 'ha-12-m1', name: 'Cablu CYY-F 5x6mm² (coloane principale)', type: 'material', um: 'ml', consumption: 0.15, unit_price: 18, waste_percent: 5 },
        { id: 'ha-12-m2', name: 'Corp iluminat LED industrial 150W IP65', type: 'material', um: 'buc', consumption: 0.015, unit_price: 850, waste_percent: 0 },
        { id: 'ha-12-m3', name: 'Tablou electric general TGBT', type: 'material', um: 'buc', consumption: 0.001, unit_price: 12000, waste_percent: 0 },
        { id: 'ha-12-l1', name: 'Manoperă electrician industrial', type: 'labor', um: 'mp', consumption: 1, unit_price: 42, waste_percent: 0 },
      ],
    },
    {
      stage_name: '06. Platforme exterioare',
      name: 'Platformă betonată exterioară carosabilă C30/37',
      unit: 'mp',
      quantity: 800,
      resources_override: [
        { id: 'ha-13-m1', name: 'Beton C30/37 cu fibră', type: 'material', um: 'mc', consumption: 0.2, unit_price: 540, waste_percent: 3 },
        { id: 'ha-13-m2', name: 'Balast compactat 30cm', type: 'material', um: 'mc', consumption: 0.3, unit_price: 82, waste_percent: 5 },
        { id: 'ha-13-l1', name: 'Manoperă turnare și finisare platformă', type: 'labor', um: 'mp', consumption: 1, unit_price: 45, waste_percent: 0 },
        { id: 'ha-13-u1', name: 'Pompă de beton', type: 'equipment', um: 'mp', consumption: 1, unit_price: 12, waste_percent: 0 },
      ],
    },
  ],

  // ════════════════════════════════════════════════════════════════════
  // FIT-OUT / COMERCIAL
  // Etape: Desfaceri / Demolări, Compartimentări ușoare, Tavane false,
  //        Finisaje Premium, Instalații HVAC, Curenți slabi
  // ════════════════════════════════════════════════════════════════════
  comercial: [
    {
      stage_name: 'Desfaceri / Demolări',
      name: 'Desfacere pardoseală existentă (gresie/parchet/beton)',
      unit: 'mp',
      quantity: 200,
      resources_override: [
        { id: 'co-01-l1', name: 'Manoperă desfacere pardoseală', type: 'labor', um: 'mp', consumption: 1, unit_price: 22, waste_percent: 0 },
        { id: 'co-01-u1', name: 'Container evacuare moloz 5mc', type: 'equipment', um: 'buc', consumption: 0.04, unit_price: 450, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Desfaceri / Demolări',
      name: 'Demontare tavane false și compartimentări existente',
      unit: 'mp',
      quantity: 180,
      resources_override: [
        { id: 'co-02-l1', name: 'Manoperă demontare tavane și pereți existenți', type: 'labor', um: 'mp', consumption: 1, unit_price: 18, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Compartimentări ușoare',
      name: 'Pereți GKB dublu placat cu fonoizolație vată minerală',
      unit: 'mp',
      quantity: 350,
      resources_override: [
        { id: 'co-03-m1', name: 'Placă GKB 12.5mm standard', type: 'material', um: 'mp', consumption: 2.1, unit_price: 28, waste_percent: 5 },
        { id: 'co-03-m2', name: 'Profil CW75/UW75 galvanizat', type: 'material', um: 'ml', consumption: 1.8, unit_price: 12, waste_percent: 3 },
        { id: 'co-03-m3', name: 'Vată minerală fonoizolantă 50mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 22, waste_percent: 5 },
        { id: 'co-03-l1', name: 'Manoperă montaj perete GKB cu fonoizolație', type: 'labor', um: 'mp', consumption: 1, unit_price: 58, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Compartimentări ușoare',
      name: 'Partiții din sticlă securizată 10mm cu feronerie inox',
      unit: 'mp',
      quantity: 85,
      resources_override: [
        { id: 'co-04-m1', name: 'Sticlă securizată 10mm (securit)', type: 'material', um: 'mp', consumption: 1.02, unit_price: 380, waste_percent: 2 },
        { id: 'co-04-m2', name: 'Feronerie inox (clemă podea/tavan, mâner, balama)', type: 'material', um: 'mp', consumption: 1, unit_price: 180, waste_percent: 0 },
        { id: 'co-04-l1', name: 'Manoperă montaj partiție sticlă', type: 'labor', um: 'mp', consumption: 1, unit_price: 95, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Tavane false',
      name: 'Tavan fals GKB pe structură metalică suspendată',
      unit: 'mp',
      quantity: 180,
      resources_override: [
        { id: 'co-05-m1', name: 'Placă GKB 12.5mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 28, waste_percent: 5 },
        { id: 'co-05-m2', name: 'Profil CD60/UD28 + tiranți reglabili', type: 'material', um: 'mp', consumption: 1, unit_price: 22, waste_percent: 3 },
        { id: 'co-05-l1', name: 'Manoperă montaj tavan fals GKB', type: 'labor', um: 'mp', consumption: 1, unit_price: 52, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Tavane false',
      name: 'Tavan casetă Armstrong Dune 600x600mm',
      unit: 'mp',
      quantity: 20,
      resources_override: [
        { id: 'co-06-m1', name: 'Casetă Armstrong Dune 600x600mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 42, waste_percent: 5 },
        { id: 'co-06-m2', name: 'Structură T24 suspendată + tiranți', type: 'material', um: 'mp', consumption: 1, unit_price: 18, waste_percent: 3 },
        { id: 'co-06-l1', name: 'Manoperă montaj tavan Armstrong', type: 'labor', um: 'mp', consumption: 1, unit_price: 35, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Premium',
      name: 'Pardoseală LVT (Luxury Vinyl Tile) 5mm cu subpardoseală',
      unit: 'mp',
      quantity: 140,
      resources_override: [
        { id: 'co-07-m1', name: 'LVT click 5mm cu strat antifonant', type: 'material', um: 'mp', consumption: 1.07, unit_price: 145, waste_percent: 7 },
        { id: 'co-07-m2', name: 'Subpardoseală fonoizolantă 1.5mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 12, waste_percent: 5 },
        { id: 'co-07-l1', name: 'Manoperă montaj LVT', type: 'labor', um: 'mp', consumption: 1, unit_price: 38, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Premium',
      name: 'Glet finit + vopsea lavabilă premium pereți (2 straturi)',
      unit: 'mp',
      quantity: 480,
      resources_override: [
        { id: 'co-08-m1', name: 'Glet premium finisaj (sac 25kg)', type: 'material', um: 'sac', consumption: 0.65, unit_price: 42, waste_percent: 5 },
        { id: 'co-08-m2', name: 'Vopsea lavabilă premium (bidon 10L)', type: 'material', um: 'L', consumption: 0.35, unit_price: 28, waste_percent: 5 },
        { id: 'co-08-l1', name: 'Manoperă glet + grunduire + vopsit 2 straturi', type: 'labor', um: 'mp', consumption: 1, unit_price: 32, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Instalații HVAC',
      name: 'Sistem climatizare casete 4-căi (unități int. + ext.)',
      unit: 'buc',
      quantity: 8,
      resources_override: [
        { id: 'co-09-m1', name: 'Unitate interioară casetă 4-căi 3.5kW', type: 'material', um: 'buc', consumption: 1, unit_price: 3800, waste_percent: 0 },
        { id: 'co-09-m2', name: 'Conducte frigorifice Cu izolate (set)', type: 'material', um: 'ml', consumption: 8, unit_price: 45, waste_percent: 5 },
        { id: 'co-09-l1', name: 'Manoperă instalare + punere în funcțiune', type: 'labor', um: 'buc', consumption: 1, unit_price: 650, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Curenți slabi',
      name: 'Rețea date-voce Cat.6 structurată (prize RJ45 + patch panel)',
      unit: 'punct',
      quantity: 45,
      resources_override: [
        { id: 'co-10-m1', name: 'Cablu UTP Cat.6 (rola 305ml)', type: 'material', um: 'ml', consumption: 8, unit_price: 3.8, waste_percent: 5 },
        { id: 'co-10-m2', name: 'Priză RJ45 Cat.6 keystone + ramă', type: 'material', um: 'buc', consumption: 1, unit_price: 22, waste_percent: 0 },
        { id: 'co-10-l1', name: 'Manoperă tragere cablu + terminare + certificare', type: 'labor', um: 'punct', consumption: 1, unit_price: 180, waste_percent: 0 },
      ],
    },
  ],

  // ════════════════════════════════════════════════════════════════════
  // RENOVARE
  // Etape: Demolări, Consolidări, Zidărie, Instalații,
  //        Finisaje Interioare, Finisaje Exterioare
  // ════════════════════════════════════════════════════════════════════
  renovare: [
    {
      stage_name: 'Demolări',
      name: 'Desfacere gresie și faianță existentă',
      unit: 'mp',
      quantity: 85,
      resources_override: [
        { id: 're-01-l1', name: 'Manoperă desfacere gresie/faianță cu daltă', type: 'labor', um: 'mp', consumption: 1, unit_price: 28, waste_percent: 0 },
        { id: 're-01-u1', name: 'Container evacuare moloz 3mc', type: 'equipment', um: 'buc', consumption: 0.05, unit_price: 380, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Demolări',
      name: 'Desfacere parchet și șapă existentă degradată',
      unit: 'mp',
      quantity: 65,
      resources_override: [
        { id: 're-02-l1', name: 'Manoperă desfacere parchet și șapă', type: 'labor', um: 'mp', consumption: 1, unit_price: 32, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Demolări',
      name: 'Desfacere tencuieli vechi degradate',
      unit: 'mp',
      quantity: 120,
      resources_override: [
        { id: 're-03-l1', name: 'Manoperă ciocănire și desfacere tencuieli', type: 'labor', um: 'mp', consumption: 1, unit_price: 35, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Consolidări',
      name: 'Reparare fisuri și crăpături în pereți (dăltuire + bandă + mortar)',
      unit: 'ml',
      quantity: 45,
      resources_override: [
        { id: 're-04-m1', name: 'Mortar de reparație structurală', type: 'material', um: 'kg', consumption: 1.5, unit_price: 8.5, waste_percent: 10 },
        { id: 're-04-m2', name: 'Bandă fibră sticlă pentru fisuri', type: 'material', um: 'ml', consumption: 1.1, unit_price: 6, waste_percent: 5 },
        { id: 're-04-l1', name: 'Manoperă reparare și consolidare fisuri', type: 'labor', um: 'ml', consumption: 1, unit_price: 45, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Zidărie',
      name: 'Pereți noi din BCA 10cm (compartimentări interioare)',
      unit: 'mp',
      quantity: 35,
      resources_override: [
        { id: 're-05-m1', name: 'Blocuri BCA 10cm (600x250x100mm)', type: 'material', um: 'mp', consumption: 1.05, unit_price: 85, waste_percent: 5 },
        { id: 're-05-m2', name: 'Mortar adeziv BCA (sac 25kg)', type: 'material', um: 'sac', consumption: 0.8, unit_price: 32, waste_percent: 5 },
        { id: 're-05-l1', name: 'Manoperă zidărie BCA compartimentare', type: 'labor', um: 'mp', consumption: 1, unit_price: 95, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Instalații',
      name: 'Instalație electrică nouă (trasee + tablou + prize)',
      unit: 'mp',
      quantity: 70,
      resources_override: [
        { id: 're-06-m1', name: 'Conductor CYY-F cupru 3x2.5mm²', type: 'material', um: 'ml', consumption: 2.8, unit_price: 4.5, waste_percent: 5 },
        { id: 're-06-m2', name: 'Tub PVC rigid Ø25mm', type: 'material', um: 'ml', consumption: 2.2, unit_price: 3.2, waste_percent: 5 },
        { id: 're-06-m3', name: 'Tablou electric 24 module + disjunctori + RCD', type: 'material', um: 'buc', consumption: 0.015, unit_price: 650, waste_percent: 0 },
        { id: 're-06-l1', name: 'Manoperă electrician (trasee + tablou + aparataj)', type: 'labor', um: 'mp', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Instalații',
      name: 'Instalație sanitară nouă (PPR apă + canalizare PVC)',
      unit: 'mp',
      quantity: 18,
      resources_override: [
        { id: 're-07-m1', name: 'Țeavă PPR PN20 Ø20mm izolată', type: 'material', um: 'ml', consumption: 3.5, unit_price: 18, waste_percent: 5 },
        { id: 're-07-m2', name: 'Fitinguri PPR (cot, mufă, reducție)', type: 'material', um: 'buc', consumption: 4, unit_price: 8, waste_percent: 5 },
        { id: 're-07-m3', name: 'Țeavă canalizare PVC KG Ø110mm', type: 'material', um: 'ml', consumption: 1.2, unit_price: 32, waste_percent: 3 },
        { id: 're-07-l1', name: 'Manoperă instalator sanitar', type: 'labor', um: 'mp', consumption: 1, unit_price: 95, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Tencuieli interioare pe suprafețele reparate și noi',
      unit: 'mp',
      quantity: 180,
      resources_override: [
        { id: 're-08-m1', name: 'Mortar gips interior (sac 30kg)', type: 'material', um: 'sac', consumption: 1.1, unit_price: 36, waste_percent: 5 },
        { id: 're-08-l1', name: 'Manoperă tencuire interioară', type: 'labor', um: 'mp', consumption: 1, unit_price: 40, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Șapă autonivelantă 4cm (egalizare pardoseală)',
      unit: 'mp',
      quantity: 70,
      resources_override: [
        { id: 're-09-m1', name: 'Șapă autonivelantă (sac 25kg)', type: 'material', um: 'sac', consumption: 1.6, unit_price: 42, waste_percent: 5 },
        { id: 're-09-m2', name: 'Primer de contact pentru șapă', type: 'material', um: 'mp', consumption: 1, unit_price: 8, waste_percent: 5 },
        { id: 're-09-l1', name: 'Manoperă turnare șapă autonivelantă', type: 'labor', um: 'mp', consumption: 1, unit_price: 22, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Glet finisaj ipsos 2-3 straturi',
      unit: 'mp',
      quantity: 260,
      resources_override: [
        { id: 're-10-m1', name: 'Glet finisaj ipsos (sac 25kg)', type: 'material', um: 'sac', consumption: 0.7, unit_price: 35, waste_percent: 5 },
        { id: 're-10-l1', name: 'Manoperă glet + șmirgheluire', type: 'labor', um: 'mp', consumption: 1, unit_price: 22, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Faianță 30x60cm (baie + bucătărie)',
      unit: 'mp',
      quantity: 65,
      resources_override: [
        { id: 're-11-m1', name: 'Faianță 30x60cm', type: 'material', um: 'mp', consumption: 1.07, unit_price: 75, waste_percent: 7 },
        { id: 're-11-m2', name: 'Adeziv flex C2 (sac 25kg)', type: 'material', um: 'sac', consumption: 0.4, unit_price: 52, waste_percent: 5 },
        { id: 're-11-m3', name: 'Chit rosturi (sac 5kg)', type: 'material', um: 'sac', consumption: 0.1, unit_price: 38, waste_percent: 5 },
        { id: 're-11-l1', name: 'Manoperă montaj faianță', type: 'labor', um: 'mp', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Gresie porțelanată 60x60cm (hol + baie + bucătărie)',
      unit: 'mp',
      quantity: 42,
      resources_override: [
        { id: 're-12-m1', name: 'Gresie porțelanată 60x60cm', type: 'material', um: 'mp', consumption: 1.07, unit_price: 95, waste_percent: 7 },
        { id: 're-12-m2', name: 'Adeziv flex C2 (sac 25kg)', type: 'material', um: 'sac', consumption: 0.4, unit_price: 52, waste_percent: 5 },
        { id: 're-12-l1', name: 'Manoperă montaj gresie', type: 'labor', um: 'mp', consumption: 1, unit_price: 55, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Interioare',
      name: 'Parchet laminat 8mm AC5 (dormitoare + living)',
      unit: 'mp',
      quantity: 55,
      resources_override: [
        { id: 're-13-m1', name: 'Parchet laminat 8mm clasa AC5', type: 'material', um: 'mp', consumption: 1.07, unit_price: 85, waste_percent: 7 },
        { id: 're-13-m2', name: 'Subpardoseală fonoizolantă burete 3mm', type: 'material', um: 'mp', consumption: 1.05, unit_price: 8, waste_percent: 5 },
        { id: 're-13-l1', name: 'Manoperă montaj parchet', type: 'labor', um: 'mp', consumption: 1, unit_price: 35, waste_percent: 0 },
      ],
    },
    {
      stage_name: 'Finisaje Exterioare',
      name: 'Vopsea lavabilă pereți interiori 2 straturi',
      unit: 'mp',
      quantity: 260,
      resources_override: [
        { id: 're-14-m1', name: 'Grund universal pentru vopsit', type: 'material', um: 'mp', consumption: 1, unit_price: 6, waste_percent: 5 },
        { id: 're-14-m2', name: 'Vopsea lavabilă standard (bidon 10L)', type: 'material', um: 'L', consumption: 0.35, unit_price: 18, waste_percent: 5 },
        { id: 're-14-l1', name: 'Manoperă grunduire + zugrăvire 2 straturi', type: 'labor', um: 'mp', consumption: 1, unit_price: 18, waste_percent: 0 },
      ],
    },
  ],

  // ════════════════════════════════════════════════════════════════════
  // LA LIBER (blank) — o singură etapă placeholder, fără articole
  // ════════════════════════════════════════════════════════════════════
  blank: [],
}

// ─── FUNCȚIE PRINCIPALĂ ───────────────────────────────────────────────────────
/**
 * applyTemplate — inserează liniile de deviz pentru tipologia selectată.
 *
 * Apelată O SINGURĂ DATĂ, după crearea proiectului, dacă utilizatorul
 * a bifat "Pornește cu date de exemplu pre-completate".
 *
 * Proiectul urmează ulterior cursul normal al oricărui proiect.
 * Această funcție nu modifică proiectul, nu modifică setările,
 * nu modifică niciun flux existent.
 */
export async function applyTemplate(
  projectId: string,
  projectType: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<{ success: boolean; error?: string }> {
  const lines = TEMPLATE_LINES[projectType]

  // blank sau tip necunoscut → nimic de inserat, succes silențios
  if (!lines || lines.length === 0) {
    return { success: true }
  }

  const toInsert = lines.map((line, idx) => ({
    project_id: projectId,
    user_id: userId,
    stage_name: line.stage_name,
    name: line.name,
    unit: line.unit,
    quantity: line.quantity,
    unit_price: 0,
    resources_override: line.resources_override,
    custom_prices: {},
    excluded_resources: [],
    sort_order: idx,
    metadata: { source: 'template', template_type: projectType },
  }))

  const { error } = await supabase.from('estimate_lines').insert(toInsert)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
