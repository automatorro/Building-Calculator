BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 450.00,
  material_price = 320.00,
  labor_price = 110.00,
  transport_price = 20.00,
  updated_at = NOW()
WHERE symbol = 'IsB01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsB01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lavoar ceramic', 'Lavoar + set prinderi', 'buc', 1.0000, 150.00, 'material', false, 1),
  ('Baterie lavoar', 'Baterie monocomandă + ventil', 'buc', 1.0000, 120.00, 'material', false, 2),
  ('Sifon + racorduri', 'Sifon, flexibile, robineți trecere, etanșări', 'buc', 1.0000, 50.00, 'material', false, 3),
  ('Accesorii montaj', 'Dibluri, silicon sanitar, garnituri', 'buc', 1.0000, 0.00, 'material', false, 4),
  ('Manoperă montaj', 'Montaj, racordare, etanșare, probe', 'buc', 1.0000, 110.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 20.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 550.00,
  material_price = 400.00,
  labor_price = 130.00,
  transport_price = 20.00,
  updated_at = NOW()
WHERE symbol = 'IsB02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsB02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vas WC', 'Vas WC ceramic', 'buc', 1.0000, 220.00, 'material', false, 1),
  ('Rezervor + mecanism', 'Rezervor WC + mecanism acționare', 'buc', 1.0000, 140.00, 'material', false, 2),
  ('Racord + accesorii', 'Racord flexibil, cot/țeavă evacuare, garnituri', 'buc', 1.0000, 40.00, 'material', false, 3),
  ('Manoperă montaj', 'Fixare, racordare, etanșare, probe', 'buc', 1.0000, 130.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 20.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 950.00,
  material_price = 720.00,
  labor_price = 200.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'IsB03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsB03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cadă acrilică', 'Cadă acrilică + set picioare', 'buc', 1.0000, 430.00, 'material', false, 1),
  ('Sifon cadă', 'Sifon + preaplin', 'buc', 1.0000, 110.00, 'material', false, 2),
  ('Baterie cadă/duș', 'Baterie + racorduri', 'buc', 1.0000, 180.00, 'material', false, 3),
  ('Accesorii montaj', 'Suport, silicon sanitar, garnituri', 'buc', 1.0000, 0.00, 'material', false, 4),
  ('Manoperă montaj', 'Montaj, poziționare, racordare, etanșare', 'buc', 1.0000, 200.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 30.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1250.00,
  material_price = 950.00,
  labor_price = 250.00,
  transport_price = 50.00,
  updated_at = NOW()
WHERE symbol = 'IsB04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsB04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cabină duș', 'Cabină duș completă', 'buc', 1.0000, 650.00, 'material', false, 1),
  ('Panou + baterie duș', 'Panou duș + baterie/termostat (după caz)', 'buc', 1.0000, 250.00, 'material', false, 2),
  ('Sifon + racorduri', 'Sifon, flexibile, etanșări', 'buc', 1.0000, 50.00, 'material', false, 3),
  ('Manoperă montaj', 'Montaj, reglaje, racordare, etanșare, probe', 'buc', 1.0000, 250.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 50.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
