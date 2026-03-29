BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 45.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IsA03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsA03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă PVC Ø50', 'Țeavă PVC canalizare (SN4/SN8) Ø50', 'ml', 1.0000, 16.00, 'material', false, 1),
  ('Fitinguri PVC', 'Coturi, mufe, teuri, reducții (echivalent/ml)', 'ml', 1.0000, 14.00, 'material', false, 2),
  ('Coliere + prinderi', 'Coliere, dibluri, elemente fixare (echivalent/ml)', 'ml', 1.0000, 8.00, 'material', false, 3),
  ('Manoperă montaj', 'Montaj, pante, etanșări, probe', 'ml', 1.0000, 45.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 135.00,
  material_price = 65.00,
  labor_price = 60.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'IsA03B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsA03B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă PVC Ø110', 'Țeavă PVC canalizare (SN4/SN8) Ø110', 'ml', 1.0000, 32.00, 'material', false, 1),
  ('Fitinguri PVC', 'Coturi, mufe, teuri, reducții (echivalent/ml)', 'ml', 1.0000, 20.00, 'material', false, 2),
  ('Coliere + prinderi', 'Coliere, dibluri, elemente fixare (echivalent/ml)', 'ml', 1.0000, 13.00, 'material', false, 3),
  ('Manoperă montaj', 'Montaj, pante, etanșări, probe', 'ml', 1.0000, 60.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 10.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 380.00,
  material_price = 230.00,
  labor_price = 130.00,
  transport_price = 20.00,
  updated_at = NOW()
WHERE symbol = 'ACA16A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACA16A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tub canalizare DN200', 'Tub PVC/PE pentru canalizare (DN200)', 'm', 1.0000, 165.00, 'material', false, 1),
  ('Garnituri + piese îmbinare', 'Garnituri, mufe, piese speciale (echivalent/ml)', 'm', 1.0000, 25.00, 'material', false, 2),
  ('Pat nisip + material înconjurare', 'Nisip spălat pentru pat (echivalent/ml)', 'm', 1.0000, 40.00, 'material', false, 3),
  ('Manoperă montaj', 'Așezare, aliniere, etanșare îmbinări', 'm', 1.0000, 130.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 20.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 450.00,
  material_price = 275.00,
  labor_price = 150.00,
  transport_price = 25.00,
  updated_at = NOW()
WHERE symbol = 'ACA16B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACA16B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tub canalizare DN250', 'Tub PVC/PE pentru canalizare (DN250)', 'm', 1.0000, 195.00, 'material', false, 1),
  ('Garnituri + piese îmbinare', 'Garnituri, mufe, piese speciale (echivalent/ml)', 'm', 1.0000, 30.00, 'material', false, 2),
  ('Pat nisip + material înconjurare', 'Nisip spălat pentru pat (echivalent/ml)', 'm', 1.0000, 50.00, 'material', false, 3),
  ('Manoperă montaj', 'Așezare, aliniere, etanșare îmbinări', 'm', 1.0000, 150.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 25.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 520.00,
  material_price = 315.00,
  labor_price = 175.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'ACA16C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACA16C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tub canalizare DN300', 'Tub PVC/PE pentru canalizare (DN300)', 'm', 1.0000, 225.00, 'material', false, 1),
  ('Garnituri + piese îmbinare', 'Garnituri, mufe, piese speciale (echivalent/ml)', 'm', 1.0000, 35.00, 'material', false, 2),
  ('Pat nisip + material înconjurare', 'Nisip spălat pentru pat (echivalent/ml)', 'm', 1.0000, 55.00, 'material', false, 3),
  ('Manoperă montaj', 'Așezare, aliniere, etanșare îmbinări', 'm', 1.0000, 175.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 30.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 680.00,
  material_price = 415.00,
  labor_price = 225.00,
  transport_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'ACA16D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACA16D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tub canalizare DN400', 'Tub PVC/PE pentru canalizare (DN400)', 'm', 1.0000, 300.00, 'material', false, 1),
  ('Garnituri + piese îmbinare', 'Garnituri, mufe, piese speciale (echivalent/ml)', 'm', 1.0000, 45.00, 'material', false, 2),
  ('Pat nisip + material înconjurare', 'Nisip spălat pentru pat (echivalent/ml)', 'm', 1.0000, 70.00, 'material', false, 3),
  ('Manoperă montaj', 'Așezare, aliniere, etanșare îmbinări', 'm', 1.0000, 225.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 40.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 820.00,
  material_price = 510.00,
  labor_price = 260.00,
  transport_price = 50.00,
  updated_at = NOW()
WHERE symbol = 'ACA16E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACA16E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tub canalizare DN500', 'Tub PVC/PE pentru canalizare (DN500)', 'm', 1.0000, 370.00, 'material', false, 1),
  ('Garnituri + piese îmbinare', 'Garnituri, mufe, piese speciale (echivalent/ml)', 'm', 1.0000, 55.00, 'material', false, 2),
  ('Pat nisip + material înconjurare', 'Nisip spălat pentru pat (echivalent/ml)', 'm', 1.0000, 85.00, 'material', false, 3),
  ('Manoperă montaj', 'Așezare, aliniere, etanșare îmbinări', 'm', 1.0000, 260.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 50.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 980.00,
  material_price = 690.00,
  labor_price = 260.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'ACE02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACE02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Gură de scurgere carosabilă', 'Gură scurgere cu sifon și depozit (tip carosabil)', 'buc', 1.0000, 520.00, 'material', false, 1),
  ('Racorduri + piese', 'Racorduri, garnituri, adaptări', 'buc', 1.0000, 170.00, 'material', false, 2),
  ('Manoperă montaj', 'Așezare, racordare, etanșare, probe', 'buc', 1.0000, 260.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 30.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1030.00,
  material_price = 720.00,
  labor_price = 280.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'ACE02B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACE02B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Gură de scurgere carosabilă', 'Gură scurgere cu sifon și depozit (tip carosabil)', 'buc', 1.0000, 560.00, 'material', false, 1),
  ('Racorduri + piese', 'Racorduri, garnituri, adaptări', 'buc', 1.0000, 160.00, 'material', false, 2),
  ('Manoperă montaj', 'Așezare, racordare, etanșare, probe', 'buc', 1.0000, 280.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 30.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 910.00,
  material_price = 650.00,
  labor_price = 230.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'ACE02C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ACE02C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Gură de scurgere necarosabilă', 'Gură scurgere cu sifon și depozit (tip necarosabil)', 'buc', 1.0000, 480.00, 'material', false, 1),
  ('Racorduri + piese', 'Racorduri, garnituri, adaptări', 'buc', 1.0000, 170.00, 'material', false, 2),
  ('Manoperă montaj', 'Așezare, racordare, etanșare, probe', 'buc', 1.0000, 230.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 30.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
