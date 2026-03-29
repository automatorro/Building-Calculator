BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 158.40,
  material_price = 65.40,
  labor_price = 90.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (calcar)', 'Piatra de mozaic din calcar (incl. pierderi)', 'kg', 22.0000, 1.80, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.0000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire', 'mp', 1.0000, 90.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 153.40,
  material_price = 65.40,
  labor_price = 85.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (calcar)', 'Piatra de mozaic din calcar (incl. pierderi)', 'kg', 22.0000, 1.80, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.0000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire', 'mp', 1.0000, 85.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 189.80,
  material_price = 91.80,
  labor_price = 95.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (marmură)', 'Piatra de mozaic din marmură (incl. pierderi)', 'kg', 22.0000, 3.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.0000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire', 'mp', 1.0000, 95.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 184.80,
  material_price = 91.80,
  labor_price = 90.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (marmură)', 'Piatra de mozaic din marmură (incl. pierderi)', 'kg', 22.0000, 3.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.0000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire', 'mp', 1.0000, 90.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 173.35,
  material_price = 70.35,
  labor_price = 100.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (calcar)', 'Piatra de mozaic din calcar (incl. pierderi)', 'kg', 24.0000, 1.80, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.5000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1200, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire + bordură', 'mp', 1.0000, 100.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 168.35,
  material_price = 70.35,
  labor_price = 95.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (calcar)', 'Piatra de mozaic din calcar (incl. pierderi)', 'kg', 24.0000, 1.80, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.5000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1200, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire + bordură', 'mp', 1.0000, 95.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 207.15,
  material_price = 99.15,
  labor_price = 105.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (marmură)', 'Piatra de mozaic din marmură (incl. pierderi)', 'kg', 24.0000, 3.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.5000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1200, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire + bordură', 'mp', 1.0000, 105.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 202.15,
  material_price = 99.15,
  labor_price = 100.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (marmură)', 'Piatra de mozaic din marmură (incl. pierderi)', 'kg', 24.0000, 3.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.5000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1200, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + șlefuire + lustruire + bordură', 'mp', 1.0000, 100.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 221.65,
  material_price = 103.65,
  labor_price = 115.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06I1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06I1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (marmură)', 'Piatra de mozaic din marmură (incl. pierderi)', 'kg', 24.0000, 3.00, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.5000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (extra)', 'kg', 0.1700, 30.00, 'material', false, 5),
  ('Profile separare', 'Separatoare pentru fâșii/imitare plăci', 'm', 1.0000, 3.00, 'material', false, 6),
  ('Manoperă mozaic', 'Execuție fâșii/imitare plăci + finisaj', 'mp', 1.0000, 115.00, 'manopera', false, 7),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 8),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 187.90,
  material_price = 74.90,
  labor_price = 110.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06J1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06J1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (calcar)', 'Piatra de mozaic din calcar (incl. pierderi)', 'kg', 22.0000, 1.80, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.0000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (extra)', 'kg', 0.1500, 30.00, 'material', false, 5),
  ('Straifuri sticlă', 'Straifuri sticlă 5mm pentru rosturi', 'm', 1.0000, 8.00, 'material', false, 6),
  ('Manoperă mozaic', 'Execuție fâșii + finisaj', 'mp', 1.0000, 110.00, 'manopera', false, 7),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 8),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 163.40,
  material_price = 65.40,
  labor_price = 95.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG06K1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG06K1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatra mozaic (calcar)', 'Piatra de mozaic din calcar (incl. pierderi)', 'kg', 22.0000, 1.80, 'material', false, 1),
  ('Ciment gri', 'Ciment Portland 42.5', 'kg', 12.0000, 0.90, 'material', false, 2),
  ('Nisip', 'Nisip 0-4mm', 'kg', 30.0000, 0.20, 'material', false, 3),
  ('Ciment alb', 'Ciment alb pentru strat finisaj', 'kg', 4.0000, 1.50, 'material', false, 4),
  ('Pigment', 'Pigment colorare (după caz)', 'kg', 0.1000, 30.00, 'material', false, 5),
  ('Manoperă mozaic', 'Turnare + spălare jet apă + finisaj', 'mp', 1.0000, 95.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
