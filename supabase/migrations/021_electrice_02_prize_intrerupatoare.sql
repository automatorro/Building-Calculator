BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 55.00,
  labor_price = 35.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IeA02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeA02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Priză încastrată', 'Mecanism + ramă + capac (simplă)', 'buc', 1.0000, 40.00, 'material', false, 1),
  ('Doză + accesorii', 'Doză aparat, șuruburi, cleme, mufe (după caz)', 'buc', 1.0000, 15.00, 'material', false, 2),
  ('Manoperă montaj', 'Montaj, conectare, fixare, verificare', 'buc', 1.0000, 35.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 75.00,
  material_price = 40.00,
  labor_price = 30.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IeA03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeA03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Întrerupător încastrat', 'Mecanism + ramă + clapetă (simplu)', 'buc', 1.0000, 25.00, 'material', false, 1),
  ('Doză + accesorii', 'Doză aparat, șuruburi, cleme, mufe (după caz)', 'buc', 1.0000, 15.00, 'material', false, 2),
  ('Manoperă montaj', 'Montaj, conectare, fixare, verificare', 'buc', 1.0000, 30.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 95.00,
  labor_price = 40.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'IeA05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeA05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Aparataj IP55', 'Priză/întrerupător exterior cu protecție IP55', 'buc', 1.0000, 65.00, 'material', false, 1),
  ('Cutie + accesorii etanșe', 'Cutie, presetupe, garnituri, șuruburi', 'buc', 1.0000, 30.00, 'material', false, 2),
  ('Manoperă montaj', 'Montaj, conectare, fixare, verificare', 'buc', 1.0000, 40.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 10.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
