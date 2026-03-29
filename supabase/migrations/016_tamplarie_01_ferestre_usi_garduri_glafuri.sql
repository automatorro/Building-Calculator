BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1360.00,
  material_price = 1035.00,
  labor_price = 280.00,
  transport_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'TmA01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TmA01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră PVC cu geam termoizolant', 'Fereastră completă PVC + termopan (tipodimensiune ≤ 1.5 mp)', 'buc', 1.0000, 950.00, 'material', false, 1),
  ('Kit montaj fereastră', 'Spumă, dibluri, benzi etanșare, distanțiere', 'buc', 1.0000, 85.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj, reglaje, etanșări', 'buc', 1.0000, 280.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 45.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1740.00,
  material_price = 1345.00,
  labor_price = 340.00,
  transport_price = 55.00,
  updated_at = NOW()
WHERE symbol = 'TmA01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TmA01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră PVC cu geam termoizolant', 'Fereastră completă PVC + termopan (tipodimensiune 1.5–3 mp)', 'buc', 1.0000, 1250.00, 'material', false, 1),
  ('Kit montaj fereastră', 'Spumă, dibluri, benzi etanșare, distanțiere', 'buc', 1.0000, 95.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj, reglaje, etanșări', 'buc', 1.0000, 340.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 55.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1310.00,
  material_price = 1040.00,
  labor_price = 240.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'CK11A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (≤ 3 mp)', 'mp', 1.0000, 980.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 60.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj manual, reglaje', 'mp', 1.0000, 240.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 30.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1285.00,
  material_price = 1050.00,
  labor_price = 200.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK11B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (≤ 3 mp)', 'mp', 1.0000, 980.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări, utilizare mecanizată', 'mp', 1.0000, 70.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj mecanizat, reglaje', 'mp', 1.0000, 200.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1253.00,
  material_price = 1005.00,
  labor_price = 220.00,
  transport_price = 28.00,
  updated_at = NOW()
WHERE symbol = 'CK11C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (3–9 mp)', 'mp', 1.0000, 950.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 55.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj manual, reglaje', 'mp', 1.0000, 220.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 28.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1230.00,
  material_price = 1015.00,
  labor_price = 185.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'CK11D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (3–9 mp)', 'mp', 1.0000, 950.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări, utilizare mecanizată', 'mp', 1.0000, 65.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj mecanizat, reglaje', 'mp', 1.0000, 185.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 30.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1620.00,
  material_price = 1325.00,
  labor_price = 260.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK11G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră aluminiu cu geam termoizolant', 'Fereastră aluminiu completă (≤ 3 mp)', 'mp', 1.0000, 1250.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 75.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 260.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1585.00,
  material_price = 1300.00,
  labor_price = 250.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK11H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră aluminiu cu geam termoizolant', 'Fereastră aluminiu completă (3–4.5 mp)', 'mp', 1.0000, 1220.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 80.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 250.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1565.00,
  material_price = 1285.00,
  labor_price = 245.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK11I1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11I1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră aluminiu cu geam termoizolant', 'Fereastră aluminiu completă (4.5–6 mp)', 'mp', 1.0000, 1200.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 85.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 245.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1545.00,
  material_price = 1270.00,
  labor_price = 240.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK11J1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11J1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră aluminiu cu geam termoizolant', 'Fereastră aluminiu completă (> 6 mp)', 'mp', 1.0000, 1180.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 90.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 240.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1250.00,
  material_price = 990.00,
  labor_price = 230.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'CK11E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (> 9 mp)', 'mp', 1.0000, 930.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări', 'mp', 1.0000, 60.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj manual, reglaje', 'mp', 1.0000, 230.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 30.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1225.00,
  material_price = 1000.00,
  labor_price = 190.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK11F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (> 9 mp)', 'mp', 1.0000, 930.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări, utilizare mecanizată', 'mp', 1.0000, 70.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj mecanizat, reglaje', 'mp', 1.0000, 190.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1385.00,
  material_price = 1085.00,
  labor_price = 260.00,
  transport_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'CK11K1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11K1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (35–60 m, ≤ 3 mp)', 'mp', 1.0000, 1000.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări, lucru la înălțime', 'mp', 1.0000, 85.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj mecanizat, reglaje', 'mp', 1.0000, 260.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 40.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1360.00,
  material_price = 1070.00,
  labor_price = 250.00,
  transport_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'CK11L1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11L1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (35–60 m, 3–9 mp)', 'mp', 1.0000, 980.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări, lucru la înălțime', 'mp', 1.0000, 90.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj mecanizat, reglaje', 'mp', 1.0000, 250.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 40.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1340.00,
  material_price = 1055.00,
  labor_price = 245.00,
  transport_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'CK11M1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK11M1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Fereastră metalică cu geam termoizolant', 'Fereastră metalică completă (35–60 m, > 9 mp)', 'mp', 1.0000, 960.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, calaje, etanșări, lucru la înălțime', 'mp', 1.0000, 95.00, 'material', false, 2),
  ('Manoperă montaj fereastră', 'Montaj mecanizat, reglaje', 'mp', 1.0000, 245.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 40.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 765.00,
  material_price = 580.00,
  labor_price = 160.00,
  transport_price = 25.00,
  updated_at = NOW()
WHERE symbol = 'CK02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Oblon rulant', 'Oblon rulant complet (inclusiv accesorii)', 'mp', 1.0000, 520.00, 'material', false, 1),
  ('Accesorii montaj', 'Șuruburi, console, etanșări', 'mp', 1.0000, 60.00, 'material', false, 2),
  ('Manoperă montaj oblon', 'Montaj, reglaj, probe', 'mp', 1.0000, 160.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 25.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1010.00,
  material_price = 720.00,
  labor_price = 260.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'CK03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Canat ușă interioară', 'Ușă interioară lemn (foaie ușă)', 'mp', 1.0000, 380.00, 'material', false, 1),
  ('Toc + căptușeli', 'Toc + căptușeli/pereți (set)', 'mp', 1.0000, 220.00, 'material', false, 2),
  ('Feronerie', 'Balamale, broască, clanță', 'mp', 1.0000, 120.00, 'material', false, 3),
  ('Manoperă montaj ușă', 'Montaj toc + canat, reglaje', 'mp', 1.0000, 260.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 30.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1085.00,
  material_price = 770.00,
  labor_price = 280.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK03B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK03B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Canat ușă interioară', 'Ușă interioară lemn (foaie ușă)', 'mp', 1.0000, 400.00, 'material', false, 1),
  ('Toc', 'Toc complet (set)', 'mp', 1.0000, 240.00, 'material', false, 2),
  ('Feronerie', 'Balamale, broască, clanță', 'mp', 1.0000, 130.00, 'material', false, 3),
  ('Manoperă montaj ușă', 'Montaj pe toc, reglaje', 'mp', 1.0000, 280.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1155.00,
  material_price = 860.00,
  labor_price = 260.00,
  transport_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CK03E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK03E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Canat ușă interioară', 'Ușă interioară finisată (tip CIL) — foaie ușă', 'mp', 1.0000, 450.00, 'material', false, 1),
  ('Toc + căptușeli', 'Toc + căptușeli/pereți (set)', 'mp', 1.0000, 260.00, 'material', false, 2),
  ('Feronerie', 'Balamale, broască, clanță', 'mp', 1.0000, 150.00, 'material', false, 3),
  ('Manoperă montaj ușă', 'Montaj toc + canat, reglaje', 'mp', 1.0000, 260.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 35.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1210.00,
  material_price = 890.00,
  labor_price = 280.00,
  transport_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'CK03F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK03F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Canat ușă interioară', 'Ușă interioară finisată (tip CIL) — foaie ușă', 'mp', 1.0000, 450.00, 'material', false, 1),
  ('Toc', 'Toc complet (set)', 'mp', 1.0000, 280.00, 'material', false, 2),
  ('Feronerie', 'Balamale, broască, clanță', 'mp', 1.0000, 160.00, 'material', false, 3),
  ('Manoperă montaj ușă', 'Montaj pe toc, reglaje', 'mp', 1.0000, 280.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 40.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1535.00,
  material_price = 1170.00,
  labor_price = 320.00,
  transport_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CK14A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK14A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă metalică', 'Ușă metalică completă (≤ 5 mp)', 'mp', 1.0000, 950.00, 'material', false, 1),
  ('Toc + feronerie', 'Toc, broască, balamale, accesorii', 'mp', 1.0000, 220.00, 'material', false, 2),
  ('Manoperă montaj ușă', 'Montaj, ancorare, reglaje', 'mp', 1.0000, 320.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 45.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1550.00,
  material_price = 1170.00,
  labor_price = 330.00,
  transport_price = 50.00,
  updated_at = NOW()
WHERE symbol = 'CK14B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK14B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă metalică', 'Ușă metalică completă (5–7 mp)', 'mp', 1.0000, 940.00, 'material', false, 1),
  ('Toc + feronerie', 'Toc, broască, balamale, accesorii', 'mp', 1.0000, 230.00, 'material', false, 2),
  ('Manoperă montaj ușă', 'Montaj, ancorare, reglaje', 'mp', 1.0000, 330.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 50.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1725.00,
  material_price = 1310.00,
  labor_price = 360.00,
  transport_price = 55.00,
  updated_at = NOW()
WHERE symbol = 'CK14C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK14C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă metalică 2 canaturi', 'Ușă metalică completă (2 canaturi, ≤ 5 mp)', 'mp', 1.0000, 1050.00, 'material', false, 1),
  ('Toc + feronerie', 'Toc, broască, balamale, accesorii', 'mp', 1.0000, 260.00, 'material', false, 2),
  ('Manoperă montaj ușă', 'Montaj, ancorare, reglaje', 'mp', 1.0000, 360.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 55.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1750.00,
  material_price = 1310.00,
  labor_price = 380.00,
  transport_price = 60.00,
  updated_at = NOW()
WHERE symbol = 'CK14D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK14D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă metalică 2 canaturi', 'Ușă metalică completă (2 canaturi, 5–7 mp)', 'mp', 1.0000, 1030.00, 'material', false, 1),
  ('Toc + feronerie', 'Toc, broască, balamale, accesorii', 'mp', 1.0000, 280.00, 'material', false, 2),
  ('Manoperă montaj ușă', 'Montaj, ancorare, reglaje', 'mp', 1.0000, 380.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 60.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1950.00,
  material_price = 1530.00,
  labor_price = 360.00,
  transport_price = 60.00,
  updated_at = NOW()
WHERE symbol = 'CK14I1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK14I1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă aluminiu cu geam termoizolant', 'Ușă aluminiu completă (≤ 5 mp)', 'mp', 1.0000, 1250.00, 'material', false, 1),
  ('Toc + feronerie', 'Toc, broască, balamale, accesorii', 'mp', 1.0000, 280.00, 'material', false, 2),
  ('Manoperă montaj ușă', 'Montaj, ancorare, reglaje', 'mp', 1.0000, 360.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 60.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1980.00,
  material_price = 1530.00,
  labor_price = 380.00,
  transport_price = 70.00,
  updated_at = NOW()
WHERE symbol = 'CK14J1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK14J1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă aluminiu cu geam termoizolant', 'Ușă aluminiu completă (5–7 mp)', 'mp', 1.0000, 1230.00, 'material', false, 1),
  ('Toc + feronerie', 'Toc, broască, balamale, accesorii', 'mp', 1.0000, 300.00, 'material', false, 2),
  ('Manoperă montaj ușă', 'Montaj, ancorare, reglaje', 'mp', 1.0000, 380.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 70.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 370.00,
  material_price = 235.00,
  labor_price = 120.00,
  transport_price = 15.00,
  updated_at = NOW()
WHERE symbol = 'RPCS16A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCS16A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Panou gard plasă zincată', 'Panou gard H=2.0 m (per metru liniar)', 'm', 1.0000, 150.00, 'material', false, 1),
  ('Stâlpi metalici + capace', 'Stâlpi + capace + prinderi (echivalent/ml)', 'm', 1.0000, 65.00, 'material', false, 2),
  ('Coliere + elemente fixare', 'Coliere, șuruburi, bride', 'm', 1.0000, 20.00, 'material', false, 3),
  ('Manoperă montaj gard', 'Montaj panouri + stâlpi, aliniere', 'm', 1.0000, 120.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 15.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 333.00,
  material_price = 208.00,
  labor_price = 110.00,
  transport_price = 15.00,
  updated_at = NOW()
WHERE symbol = 'RPCS16B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCS16B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Panou gard plasă zincată', 'Panou gard H=1.5 m (per metru liniar)', 'm', 1.0000, 130.00, 'material', false, 1),
  ('Stâlpi metalici + capace', 'Stâlpi + capace + prinderi (echivalent/ml)', 'm', 1.0000, 60.00, 'material', false, 2),
  ('Coliere + elemente fixare', 'Coliere, șuruburi, bride', 'm', 1.0000, 18.00, 'material', false, 3),
  ('Manoperă montaj gard', 'Montaj panouri + stâlpi, aliniere', 'm', 1.0000, 110.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 15.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 298.00,
  material_price = 186.00,
  labor_price = 100.00,
  transport_price = 12.00,
  updated_at = NOW()
WHERE symbol = 'RPCS16C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCS16C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Panou gard plasă zincată', 'Panou gard H=1.0 m (per metru liniar)', 'm', 1.0000, 115.00, 'material', false, 1),
  ('Stâlpi metalici + capace', 'Stâlpi + capace + prinderi (echivalent/ml)', 'm', 1.0000, 55.00, 'material', false, 2),
  ('Coliere + elemente fixare', 'Coliere, șuruburi, bride', 'm', 1.0000, 16.00, 'material', false, 3),
  ('Manoperă montaj gard', 'Montaj panouri + stâlpi, aliniere', 'm', 1.0000, 100.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 12.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 259.00,
  material_price = 159.00,
  labor_price = 90.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'RPCS16D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCS16D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Panou gard plasă zincată', 'Panou gard H=0.5 m (per metru liniar)', 'm', 1.0000, 95.00, 'material', false, 1),
  ('Stâlpi metalici + capace', 'Stâlpi + capace + prinderi (echivalent/ml)', 'm', 1.0000, 50.00, 'material', false, 2),
  ('Coliere + elemente fixare', 'Coliere, șuruburi, bride', 'm', 1.0000, 14.00, 'material', false, 3),
  ('Manoperă montaj gard', 'Montaj panouri + stâlpi, aliniere', 'm', 1.0000, 90.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 10.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 63.00,
  material_price = 42.00,
  labor_price = 18.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'TmA04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TmA04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Glaf PVC interior', 'Glaf PVC lățime 20 cm', 'ml', 1.0000, 32.00, 'material', false, 1),
  ('Capace + accesorii', 'Capace laterale, elemente fixare', 'ml', 1.0000, 6.00, 'material', false, 2),
  ('Silicon/spumă', 'Etanșare și fixare (echivalent/ml)', 'ml', 1.0000, 4.00, 'material', false, 3),
  ('Manoperă montaj glaf', 'Debitare, montaj, etanșare', 'ml', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 82.00,
  material_price = 56.00,
  labor_price = 22.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CK09A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK09A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Glaf din cherestea', 'Glaf lemn rășinoase (debitat și finisat)', 'm', 1.0000, 45.00, 'material', false, 1),
  ('Lac/protecție', 'Tratament/finisaj lemn (echivalent/m)', 'm', 1.0000, 7.00, 'material', false, 2),
  ('Accesorii montaj', 'Șuruburi, dibluri, adeziv', 'm', 1.0000, 4.00, 'material', false, 3),
  ('Manoperă montaj glaf', 'Montaj și reglaje', 'm', 1.0000, 22.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 4.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 58.00,
  material_price = 37.00,
  labor_price = 18.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CK09B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK09B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Pervazuri/baghete', 'Baghete și pervazuri din cherestea rășinoase', 'm', 1.0000, 28.00, 'material', false, 1),
  ('Lac/protecție', 'Tratament/finisaj lemn (echivalent/m)', 'm', 1.0000, 5.00, 'material', false, 2),
  ('Accesorii montaj', 'Cuie, adeziv, elemente fixare', 'm', 1.0000, 4.00, 'material', false, 3),
  ('Manoperă montaj', 'Montaj și ajustări', 'm', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 61.00,
  material_price = 39.00,
  labor_price = 18.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CE15A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE15A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Glaf tablă zincată', 'Tablă zincată 0.5mm, debitare + îndoire (≤ 15 cm desfășurat)', 'm', 1.0000, 34.00, 'material', false, 1),
  ('Carton bitumat', 'Strat suport carton bitumat', 'm', 1.0000, 2.00, 'material', false, 2),
  ('Elemente fixare', 'Șuruburi/cuie, etanșări', 'm', 1.0000, 3.00, 'material', false, 3),
  ('Manoperă montaj glaf', 'Montaj, etanșare', 'm', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 4.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 72.00,
  material_price = 48.00,
  labor_price = 20.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CE15B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE15B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Glaf tablă zincată', 'Tablă zincată 0.5mm, debitare + îndoire (15–30 cm desfășurat)', 'm', 1.0000, 42.00, 'material', false, 1),
  ('Carton bitumat', 'Strat suport carton bitumat', 'm', 1.0000, 2.50, 'material', false, 2),
  ('Elemente fixare', 'Șuruburi/cuie, etanșări', 'm', 1.0000, 3.50, 'material', false, 3),
  ('Manoperă montaj glaf', 'Montaj, etanșare', 'm', 1.0000, 20.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 4.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1270.00,
  material_price = 905.00,
  labor_price = 320.00,
  transport_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CK06A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK06A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Glasvand din lemn + geam', 'Panouri fixe + geam (montaj pe parapet)', 'mp', 1.0000, 820.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, etanșări, baghete', 'mp', 1.0000, 85.00, 'material', false, 2),
  ('Manoperă montaj', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 320.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 45.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1410.00,
  material_price = 995.00,
  labor_price = 360.00,
  transport_price = 55.00,
  updated_at = NOW()
WHERE symbol = 'CK06C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK06C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Glasvand din lemn + geam', 'Panouri fixe + foi de ușă + geam', 'mp', 1.0000, 900.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, etanșări, baghete', 'mp', 1.0000, 95.00, 'material', false, 2),
  ('Manoperă montaj', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 360.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 55.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 2060.00,
  material_price = 1570.00,
  labor_price = 420.00,
  transport_price = 70.00,
  updated_at = NOW()
WHERE symbol = 'CK13A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK13A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vitrină metalică', 'Vitrină metalică completă', 'mp', 1.0000, 1450.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, etanșări, baghete', 'mp', 1.0000, 120.00, 'material', false, 2),
  ('Manoperă montaj vitrină', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 420.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 70.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 2320.00,
  material_price = 1790.00,
  labor_price = 450.00,
  transport_price = 80.00,
  updated_at = NOW()
WHERE symbol = 'CK13B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK13B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vitrină aluminiu', 'Vitrină aluminiu completă (7.5–10 mp)', 'mp', 1.0000, 1650.00, 'material', false, 1),
  ('Accesorii montaj', 'Prinderi, etanșări, baghete', 'mp', 1.0000, 140.00, 'material', false, 2),
  ('Manoperă montaj vitrină', 'Montaj, reglaje, etanșări', 'mp', 1.0000, 450.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 80.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1720.00,
  material_price = 1280.00,
  labor_price = 380.00,
  transport_price = 60.00,
  updated_at = NOW()
WHERE symbol = 'CK15A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CK15A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Ușă/poartă metalică', 'Ușă/poartă metalică glisantă sau pliantă (≤ 7 mp)', 'mp', 1.0000, 1100.00, 'material', false, 1),
  ('Accesorii montaj', 'Role, șine, feronerie, prinderi', 'mp', 1.0000, 180.00, 'material', false, 2),
  ('Manoperă montaj', 'Montaj, aliniere, reglaje', 'mp', 1.0000, 380.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 60.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
