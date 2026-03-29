BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 85.00,
  material_price = 40.00,
  labor_price = 40.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IsA01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsA01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă PP Ø20', 'Țeavă PP-R pentru apă rece', 'ml', 1.0000, 24.00, 'material', false, 1),
  ('Fitinguri PP', 'Coturi, mufe, teuri, robineți de trecere (echivalent/ml)', 'ml', 1.0000, 16.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Montaj în tubulatură/șanț, prinderi, probe', 'ml', 1.0000, 40.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 45.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IsA01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsA01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă PP Ø25', 'Țeavă PP-R pentru apă rece', 'ml', 1.0000, 28.00, 'material', false, 1),
  ('Fitinguri PP', 'Coturi, mufe, teuri, robineți de trecere (echivalent/ml)', 'ml', 1.0000, 17.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Montaj în tubulatură/șanț, prinderi, probe', 'ml', 1.0000, 45.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 105.00,
  material_price = 55.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IsA02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsA02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă PP Ø20', 'Țeavă PP-R pentru apă caldă', 'ml', 1.0000, 25.00, 'material', false, 1),
  ('Fitinguri PP', 'Coturi, mufe, teuri, robineți de trecere (echivalent/ml)', 'ml', 1.0000, 15.00, 'material', false, 2),
  ('Izolație țeavă', 'Tub izolație elastomerică (echivalent/ml)', 'ml', 1.0000, 15.00, 'material', false, 3),
  ('Manoperă montaj țeavă', 'Montaj în tubulatură/șanț, prinderi, probe', 'ml', 1.0000, 45.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 95.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IsC03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsC03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă PEX', 'Țeavă PEX pentru încălzire în pardoseală (echivalent/mp)', 'mp', 1.0000, 60.00, 'material', false, 1),
  ('Izolație + folie', 'Panouri izolație + folie (echivalent/mp)', 'mp', 1.0000, 25.00, 'material', false, 2),
  ('Accesorii fixare', 'Agrafe, bandă perimetrală (echivalent/mp)', 'mp', 1.0000, 10.00, 'material', false, 3),
  ('Manoperă montaj', 'Pozare țeavă, fixare, probe', 'mp', 1.0000, 45.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 115.00,
  material_price = 70.00,
  labor_price = 40.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'FE03B2';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'FE03B2')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă cupru 12x1', 'Țeavă cupru (diametru exterior 12 mm)', 'm', 1.0000, 45.00, 'material', false, 1),
  ('Fitinguri + lipire', 'Fitinguri, cositor, flux (echivalent/ml)', 'm', 1.0000, 25.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Debitare, îmbinare, prinderi', 'm', 1.0000, 40.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 125.00,
  material_price = 78.00,
  labor_price = 42.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'FE03C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'FE03C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă cupru 14x1', 'Țeavă cupru (diametru exterior 14 mm)', 'm', 1.0000, 50.00, 'material', false, 1),
  ('Fitinguri + lipire', 'Fitinguri, cositor, flux (echivalent/ml)', 'm', 1.0000, 28.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Debitare, îmbinare, prinderi', 'm', 1.0000, 42.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 135.00,
  material_price = 85.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'FE03C2';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'FE03C2')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă cupru 16x1', 'Țeavă cupru (diametru exterior 16 mm)', 'm', 1.0000, 55.00, 'material', false, 1),
  ('Fitinguri + lipire', 'Fitinguri, cositor, flux (echivalent/ml)', 'm', 1.0000, 30.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Debitare, îmbinare, prinderi', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 92.00,
  labor_price = 48.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'FE03C3';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'FE03C3')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă cupru 18x1', 'Țeavă cupru (diametru exterior 18 mm)', 'm', 1.0000, 60.00, 'material', false, 1),
  ('Fitinguri + lipire', 'Fitinguri, cositor, flux (echivalent/ml)', 'm', 1.0000, 32.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Debitare, îmbinare, prinderi', 'm', 1.0000, 48.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 155.00,
  material_price = 100.00,
  labor_price = 50.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'FE03D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'FE03D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă cupru 20x1', 'Țeavă cupru (diametru exterior 20 mm)', 'm', 1.0000, 65.00, 'material', false, 1),
  ('Fitinguri + lipire', 'Fitinguri, cositor, flux (echivalent/ml)', 'm', 1.0000, 35.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Debitare, îmbinare, prinderi', 'm', 1.0000, 50.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 185.00,
  material_price = 125.00,
  labor_price = 55.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'FE03D2';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'FE03D2')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Țeavă cupru 25x1.5', 'Țeavă cupru (diametru exterior 25 mm)', 'm', 1.0000, 80.00, 'material', false, 1),
  ('Fitinguri + lipire', 'Fitinguri, cositor, flux (echivalent/ml)', 'm', 1.0000, 45.00, 'material', false, 2),
  ('Manoperă montaj țeavă', 'Debitare, îmbinare, prinderi', 'm', 1.0000, 55.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
