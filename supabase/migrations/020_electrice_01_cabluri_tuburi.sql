BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 18.00,
  material_price = 10.00,
  labor_price = 7.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'IeA01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeA01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cablu CYY 3x1.5 mm²', 'Cablu electric cu cupru, izolat, pentru circuite iluminat', 'ml', 1.0000, 10.00, 'material', false, 1),
  ('Manoperă montaj cablu', 'Pozare în tuburi, conexiuni, fixări', 'ml', 1.0000, 7.00, 'manopera', false, 2),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 1.00, 'transport', false, 3),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 22.00,
  material_price = 12.00,
  labor_price = 9.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'IeA01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IeA01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cablu CYY 3x2.5 mm²', 'Cablu electric cu cupru, izolat, pentru circuite prize', 'ml', 1.0000, 12.00, 'material', false, 1),
  ('Manoperă montaj cablu', 'Pozare în tuburi, conexiuni, fixări', 'ml', 1.0000, 9.00, 'manopera', false, 2),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 1.00, 'transport', false, 3),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
