-- ============================================================
-- Produse sample Dedeman pentru testarea drawer-ului
-- Ruleaza in Supabase SQL Editor dupa 048_dedeman_catalog.sql
-- ============================================================

INSERT INTO public.dedeman_catalog
  (cod_produs, ean, nume, brand, categorie, subcategorie,
   pret, pret_vechi, discount_procent, moneda,
   disponibilitate, unitate_masura, descriere_scurta,
   specificatii, imagini, rating, nr_review, url, activ)
VALUES

-- Adezivi si chituri
('5303020', '5901000121405', 'Adeziv gresie si faianta Weber for C1 25 kg gri',
 'Weber', 'Adezivi si chituri', 'Adezivi gresie',
 29.99, 34.99, 14.3, 'RON', 'In stoc', 'sac',
 'Adeziv ciment pentru fixarea placilor ceramice pe pereti si pardoseli.',
 '{"Greutate": "25 kg", "Timp deschis": "20 min", "Clasa": "C1", "Culoare": "gri"}',
 ARRAY['https://www.dedeman.ro/medias/Adeziv-pentru-gresie-si-faianta-Weber-for-C1-25-kg-gri-5303020.jpg'],
 4.6, 312,
 'https://www.dedeman.ro/ro/adeziv-gresie-si-faianta-weber-for-c1-25-kg-gri/p/5303020', true),

('5303021', '5901000121412', 'Adeziv flexibil Weber Flex C2TE 25 kg alb',
 'Weber', 'Adezivi si chituri', 'Adezivi flexibili',
 54.99, 64.99, 15.4, 'RON', 'In stoc', 'sac',
 'Adeziv flexibil pentru gresie si faianta, rezistent la apa.',
 '{"Greutate": "25 kg", "Timp deschis": "30 min", "Clasa": "C2TE", "Culoare": "alb"}',
 ARRAY['https://www.dedeman.ro/medias/Adeziv-flexibil-Weber-Flex-C2TE-25-kg-alb-5303021.jpg'],
 4.8, 541,
 'https://www.dedeman.ro/ro/adeziv-flexibil-weber-flex-c2te-25-kg-alb/p/5303021', true),

('5308010', '5901234567890', 'Chit acrilic Bostik alb 280 ml',
 'Bostik', 'Adezivi si chituri', 'Chituri',
 14.99, NULL, NULL, 'RON', 'In stoc', 'buc',
 'Chit acrilic lavabil pentru rosturi si crapaturi interioare.',
 '{"Volum": "280 ml", "Culoare": "alb", "Aplicare": "interior", "Timp uscare": "24h"}',
 ARRAY['https://www.dedeman.ro/medias/Chit-acrilic-Bostik-alb-280-ml.jpg'],
 4.3, 187,
 'https://www.dedeman.ro/ro/chit-acrilic-bostik-alb-280-ml/p/5308010', true),

-- Materiale de constructii
('1204001', '5904000111111', 'BCA Macon 625x240x240 mm G 50',
 'Macon', 'Materiale de constructii', 'BCA',
 7.49, NULL, NULL, 'RON', 'In stoc', 'buc',
 'Blocuri BCA pentru zidarie interioara si exterioara.',
 '{"Dimensiuni": "625x240x240 mm", "Clasa rezistenta": "G50", "Greutate": "12.5 kg", "Lambda": "0.14 W/mK"}',
 ARRAY['https://www.dedeman.ro/medias/BCA-Macon-625x240x240-mm-G50.jpg'],
 4.5, 892,
 'https://www.dedeman.ro/ro/bca-macon-625x240x240-mm-g50/p/1204001', true),

('1201010', '5904000222222', 'Ciment Portland CEM I 42.5R Lafarge 25 kg',
 'Lafarge', 'Materiale de constructii', 'Ciment',
 32.99, 35.99, 8.3, 'RON', 'In stoc', 'sac',
 'Ciment Portland de inalta rezistenta pentru structuri si betoane.',
 '{"Greutate": "25 kg", "Clasa": "CEM I 42.5R", "Standard": "SR EN 197-1"}',
 ARRAY['https://www.dedeman.ro/medias/Ciment-Portland-CEM-I-425R-Lafarge-25-kg.jpg'],
 4.7, 1243,
 'https://www.dedeman.ro/ro/ciment-portland-cem-i-425r-lafarge-25-kg/p/1201010', true),

('1205100', '5904000333333', 'Gips-carton Rigips RB 12.5 mm 120x250 cm',
 'Rigips', 'Materiale de constructii', 'Gips carton',
 42.99, 47.99, 10.4, 'RON', 'In stoc', 'buc',
 'Placa gips-carton standard pentru pereti si plafoane interioare.',
 '{"Dimensiuni": "1200x2500 mm", "Grosime": "12.5 mm", "Greutate": "24.3 kg", "Tip": "RB - standard"}',
 ARRAY['https://www.dedeman.ro/medias/Gips-carton-Rigips-RB-125-mm-120x250.jpg'],
 4.6, 2341,
 'https://www.dedeman.ro/ro/gips-carton-rigips-rb-125-mm-120x250-cm/p/1205100', true),

-- Izolatie
('3101005', '5901777111111', 'Polistiren expandat Austrotherm EPS 60 100mm 100x50 cm',
 'Austrotherm', 'Izolatie', 'Polistiren expandat',
 34.99, 39.99, 12.5, 'RON', 'In stoc', 'buc',
 'Polistiren expandat pentru termoizolarea peretilor exteriori (termosistem).',
 '{"Grosime": "100 mm", "Dimensiuni": "1000x500 mm", "Lambda": "0.036 W/mK", "Rezistenta termica": "2.78 m2K/W"}',
 ARRAY['https://www.dedeman.ro/medias/Polistiren-expandat-Austrotherm-EPS60-100mm.jpg'],
 4.5, 678,
 'https://www.dedeman.ro/ro/polistiren-expandat-austrotherm-eps60-100mm/p/3101005', true),

('3102001', '5901777222222', 'Vata minerala bazaltica Rockwool Frontrock MAX E 10cm',
 'Rockwool', 'Izolatie', 'Vata bazaltica',
 89.99, 99.99, 10.0, 'RON', 'In stoc', 'mp',
 'Placi din vata minerala bazaltica pentru fatade ventilate si termosisteme.',
 '{"Grosime": "100 mm", "Lambda": "0.036 W/mK", "Clasa foc": "A1 - incombustibil", "Dimensiuni": "1200x200 mm"}',
 ARRAY['https://www.dedeman.ro/medias/Vata-minerala-Rockwool-Frontrock-MAX-E-10cm.jpg'],
 4.8, 423,
 'https://www.dedeman.ro/ro/vata-minerala-rockwool-frontrock-max-e-10cm/p/3102001', true),

-- Tencuieli
('4201010', '5904111111111', 'Tencuiala gletuire Knauf Rotband 30 kg',
 'Knauf', 'Tencuieli si gleturi', 'Tencuiala gips',
 52.99, 57.99, 8.6, 'RON', 'In stoc', 'sac',
 'Tencuiala de interior din ipsos pentru pereti si plafoane.',
 '{"Greutate": "30 kg", "Grosime aplicare": "5-50 mm", "Timp prelucrare": "25 min", "Consum": "8.5 kg/mp la 10mm"}',
 ARRAY['https://www.dedeman.ro/medias/Tencuiala-gletuire-Knauf-Rotband-30-kg.jpg'],
 4.7, 1876,
 'https://www.dedeman.ro/ro/tencuiala-gletuire-knauf-rotband-30-kg/p/4201010', true),

('4203001', '5904111222222', 'Glet de finisaj Knauf Multifinish 25 kg',
 'Knauf', 'Tencuieli si gleturi', 'Glet finisaj',
 38.99, NULL, NULL, 'RON', 'In stoc', 'sac',
 'Masa de spaclu pentru finisarea suprafetelor din gips-carton si beton.',
 '{"Greutate": "25 kg", "Grosime aplicare": "0-3 mm", "Timp prelucrare": "45 min"}',
 ARRAY['https://www.dedeman.ro/medias/Glet-finisaj-Knauf-Multifinish-25-kg.jpg'],
 4.6, 943,
 'https://www.dedeman.ro/ro/glet-finisaj-knauf-multifinish-25-kg/p/4203001', true),

-- Vopsele
('6101001', '5906750111111', 'Vopsea lavabila Baumit interior alba 15L',
 'Baumit', 'Vopsele si lacuri', 'Vopsele lavabile',
 89.99, 99.99, 10.0, 'RON', 'In stoc', 'galeata',
 'Vopsea lavabila alba mata pentru interior, acoperire excelenta.',
 '{"Volum": "15 L", "Culoare": "alb", "Consum": "8-10 mp/L", "Diluare": "10-15% apa", "Straturi": "2"}',
 ARRAY['https://www.dedeman.ro/medias/Vopsea-lavabila-Baumit-interior-alba-15L.jpg'],
 4.4, 567,
 'https://www.dedeman.ro/ro/vopsea-lavabila-baumit-interior-alba-15l/p/6101001', true),

-- Pardoseli
('7201001', '5904500111111', 'Parchet laminat Tarkett Woodstock 832 8mm Stejar natur',
 'Tarkett', 'Pardoseli', 'Parchet laminat',
 79.99, 89.99, 11.1, 'RON', 'In stoc', 'mp',
 'Parchet laminat AC4 pentru utilizare rezidentiala intensa.',
 '{"Grosime": "8 mm", "Clasa utilizare": "AC4/32", "Format": "1292x159 mm", "Aspect": "Stejar natur", "Click": "da"}',
 ARRAY['https://www.dedeman.ro/medias/Parchet-laminat-Tarkett-Woodstock-832-8mm-Stejar-natur.jpg'],
 4.5, 734,
 'https://www.dedeman.ro/ro/parchet-laminat-tarkett-woodstock-832-8mm-stejar-natur/p/7201001', true),

-- Sanitare
('8101001', '5901600111111', 'Teava PPR Heliroma PN20 32mm 4m',
 'Heliroma', 'Instalatii sanitare', 'Tevi PPR',
 24.99, NULL, NULL, 'RON', 'In stoc', 'buc',
 'Teava din polipropilena pentru instalatii de apa calda si rece.',
 '{"Diametru": "32 mm", "Lungime": "4 m", "Presiune nominala": "PN20", "Material": "PPR"}',
 ARRAY['https://www.dedeman.ro/medias/Teava-PPR-Heliroma-PN20-32mm-4m.jpg'],
 4.6, 312,
 'https://www.dedeman.ro/ro/teava-ppr-heliroma-pn20-32mm-4m/p/8101001', true),

-- Electrice
('9101001', '5901900111111', 'Cablu electric CYY-F 3x2.5 mmp cupru',
 'Cablebel', 'Instalatii electrice', 'Cabluri',
 8.99, NULL, NULL, 'RON', 'In stoc', 'ml',
 'Cablu electric rigid cu izolatie PVC pentru instalatii fixe.',
 '{"Sectiune": "3x2.5 mmp", "Material conductor": "cupru", "Tensiune": "0.6/1kV", "Standard": "SR EN 60228"}',
 ARRAY['https://www.dedeman.ro/medias/Cablu-electric-CYY-F-3x25-mmp-cupru.jpg'],
 4.7, 1234,
 'https://www.dedeman.ro/ro/cablu-electric-cyy-f-3x25-mmp-cupru/p/9101001', true),

-- Usi si ferestre
('2101001', '5904800111111', 'Fereastra PVC 2 canate 120x120 cm alb cu geam termopan',
 'Veka', 'Usi si ferestre', 'Ferestre PVC',
 899.99, 1049.99, 14.3, 'RON', 'In stoc', 'buc',
 'Fereastra PVC cu profil 5 camere si geam termopan low-e.',
 '{"Dimensiuni": "1200x1200 mm", "Profile": "5 camere", "Geam": "4-16-4 mm low-e", "Ug": "1.1 W/m2K", "Culoare": "alb"}',
 ARRAY['https://www.dedeman.ro/medias/Fereastra-PVC-2-canate-120x120-cm-alb.jpg'],
 4.3, 234,
 'https://www.dedeman.ro/ro/fereastra-pvc-2-canate-120x120-cm-alb/p/2101001', true)

ON CONFLICT (cod_produs) DO UPDATE SET
  pret          = EXCLUDED.pret,
  pret_vechi    = EXCLUDED.pret_vechi,
  disponibilitate = EXCLUDED.disponibilitate,
  sync_at       = NOW(),
  activ         = TRUE;
