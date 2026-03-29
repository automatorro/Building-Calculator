BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 285.00,
  material_price = 210.00,
  labor_price = 60.00,
  transport_price = 15.00,
  updated_at = NOW()
WHERE symbol = 'IeB01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeB01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Corp iluminat LED', 'Corp iluminat LED suspendat 40W', 'buc', 1.0000, 185.00, 'material', false, 1),
  ('Accesorii montaj', 'Console, dibluri, cleme (după caz)', 'buc', 1.0000, 25.00, 'material', false, 2),
  ('Manoperă montaj + cablare', 'Montaj, conectare, verificare funcționare', 'buc', 1.0000, 60.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 15.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 95.00,
  labor_price = 40.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'IeB02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeB02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Spot LED', 'Spot LED încastrat 7W', 'buc', 1.0000, 70.00, 'material', false, 1),
  ('Accesorii montaj', 'Cleme, doze, mufe (după caz)', 'buc', 1.0000, 25.00, 'material', false, 2),
  ('Manoperă montaj', 'Decupare, montaj spot, conectare', 'buc', 1.0000, 40.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 10.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 1850.00,
  material_price = 1450.00,
  labor_price = 330.00,
  transport_price = 70.00,
  updated_at = NOW()
WHERE symbol = 'IeA04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeA04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tablou electric', 'Tablou electric echipat, 8 circuite (siguranțe, diferențial, bare)', 'buc', 1.0000, 1250.00, 'material', false, 1),
  ('Materiale conexe', 'Șină DIN, cabluri interne, etichete, conectori', 'buc', 1.0000, 200.00, 'material', false, 2),
  ('Manoperă montaj', 'Fixare, cablare, etichetare, verificări', 'buc', 1.0000, 330.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 70.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
