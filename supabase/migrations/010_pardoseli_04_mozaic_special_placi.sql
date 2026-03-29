BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 271.70,
  material_price = 137.70,
  labor_price = 130.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CG08A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG08A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Spărturi marmură', 'Spărturi plăci marmură colorată (incl. pierderi)', 'mp', 1.0500, 90.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 18.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 45.0000, 0.20, 'material', false, 3),
  ('Mortar ciment colorat', 'Mortar umplere interspații', 'kg', 6.0000, 1.50, 'material', false, 4),
  ('Ciment alb', 'Ciment alb pentru finisaj', 'kg', 3.0000, 1.50, 'material', false, 5),
  ('Pigment', 'Pigment colorare', 'kg', 0.1500, 30.00, 'material', false, 6),
  ('Manoperă mozaic special', 'Montaj + finisaj mozaic special', 'mp', 1.0000, 130.00, 'manopera', false, 7),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 8),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 344.20,
  material_price = 190.20,
  labor_price = 150.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CG08B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG08B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci marmură', 'Plăci marmură 3–4 cm (incl. pierderi)', 'mp', 1.0500, 140.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 18.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 45.0000, 0.20, 'material', false, 3),
  ('Mortar alb + mozaic', 'Mortar rosturi cu ciment alb și mozaic marmură', 'kg', 6.0000, 2.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic special', 'Montaj + finisaj plăci mozaic special', 'mp', 1.0000, 150.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 318.20,
  material_price = 169.20,
  labor_price = 145.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CG08C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG08C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci marmură semifinite', 'Plăci marmură 150–300mm (incl. pierderi)', 'mp', 1.0500, 120.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 18.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 45.0000, 0.20, 'material', false, 3),
  ('Mortar alb + mozaic', 'Mortar rosturi cu ciment alb și mozaic marmură', 'kg', 6.0000, 2.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic special', 'Montaj + finisaj plăci semifinite', 'mp', 1.0000, 145.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 167.55,
  material_price = 104.55,
  labor_price = 60.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG09A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG09A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci beton mozaicate', 'Plăci beton mozaicate (incl. pierderi)', 'mp', 1.0500, 75.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 15.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 40.0000, 0.20, 'material', false, 3),
  ('Lapte de ciment', 'Material rosturi/umpleri', 'kg', 2.0000, 0.90, 'material', false, 4),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 5),
  ('Manoperă montaj', 'Montaj plăci mozaicate + rosturi', 'mp', 1.0000, 60.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 172.55,
  material_price = 104.55,
  labor_price = 65.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG09B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG09B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci beton mozaicate', 'Plăci beton mozaicate (incl. pierderi)', 'mp', 1.0500, 75.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 15.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 40.0000, 0.20, 'material', false, 3),
  ('Lapte de ciment', 'Material rosturi/umpleri', 'kg', 2.0000, 0.90, 'material', false, 4),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 5),
  ('Manoperă montaj', 'Montaj plăci mozaicate + rosturi', 'mp', 1.0000, 65.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 167.05,
  material_price = 99.05,
  labor_price = 65.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG09C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG09C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci beton mozaicate', 'Plăci beton mozaicate (incl. pierderi)', 'mp', 1.0500, 75.00, 'material', false, 1),
  ('Adeziv flexibil', 'Adeziv flexibil pentru montaj plăci', 'kg', 5.0000, 2.80, 'material', false, 2),
  ('Amorsă', 'Amorsă suport', 'l', 0.2000, 10.00, 'material', false, 3),
  ('Lapte de ciment', 'Material rosturi/umpleri', 'kg', 2.0000, 0.90, 'material', false, 4),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 5),
  ('Manoperă montaj', 'Montaj pe șapă ipsos + rosturi', 'mp', 1.0000, 65.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
