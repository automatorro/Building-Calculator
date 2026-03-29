BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 192.35,
  material_price = 134.35,
  labor_price = 55.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet lemn (stejar/fag)', 'Parchet masiv, montaj la 45° (incl. pierderi)', 'mp', 1.0500, 120.00, 'material', false, 1),
  ('Cuie parchet', 'Cuie pentru montaj parchet', 'kg', 0.0500, 20.00, 'material', false, 2),
  ('Folie/underlay', 'Strat suport parchet', 'mp', 1.0500, 7.00, 'material', false, 3),
  ('Manoperă parchet', 'Montaj parchet prin batere în cuie', 'mp', 1.0000, 55.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 187.35,
  material_price = 134.35,
  labor_price = 50.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG02B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG02B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet lemn (stejar/fag)', 'Parchet masiv, montaj la 45° (incl. pierderi)', 'mp', 1.0500, 120.00, 'material', false, 1),
  ('Cuie parchet', 'Cuie pentru montaj parchet', 'kg', 0.0500, 20.00, 'material', false, 2),
  ('Folie/underlay', 'Strat suport parchet', 'mp', 1.0500, 7.00, 'material', false, 3),
  ('Manoperă parchet', 'Montaj parchet prin batere în cuie', 'mp', 1.0000, 50.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 207.95,
  material_price = 154.95,
  labor_price = 50.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG02C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG02C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet lemn (stejar/fag)', 'Parchet masiv, montaj la 45° (incl. pierderi)', 'mp', 1.0500, 120.00, 'material', false, 1),
  ('Adeziv parchet', 'Adeziv/Aracet pentru lipire parchet', 'kg', 1.2000, 18.00, 'material', false, 2),
  ('Folie/underlay', 'Strat suport parchet', 'mp', 1.0500, 7.00, 'material', false, 3),
  ('Manoperă parchet', 'Montaj parchet prin lipire', 'mp', 1.0000, 50.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 203.95,
  material_price = 154.95,
  labor_price = 46.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG02D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG02D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet lemn (stejar/fag)', 'Parchet masiv, montaj la 45° (incl. pierderi)', 'mp', 1.0500, 120.00, 'material', false, 1),
  ('Adeziv parchet', 'Adeziv/Aracet pentru lipire parchet', 'kg', 1.2000, 18.00, 'material', false, 2),
  ('Folie/underlay', 'Strat suport parchet', 'mp', 1.0500, 7.00, 'material', false, 3),
  ('Manoperă parchet', 'Montaj parchet prin lipire', 'mp', 1.0000, 46.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 171.00,
  material_price = 123.00,
  labor_price = 45.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG02E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG02E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet mozaic (panouri)', 'Panouri parchet mozaic stejar (incl. pierderi)', 'mp', 1.0500, 95.00, 'material', false, 1),
  ('Adeziv parchet', 'Adeziv/Aracet pentru lipire panouri', 'kg', 1.0000, 18.00, 'material', false, 2),
  ('Strat suport', 'Strat suport / folie', 'mp', 1.0500, 5.00, 'material', false, 3),
  ('Manoperă parchet', 'Montaj parchet mozaic prin lipire', 'mp', 1.0000, 45.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 168.00,
  material_price = 123.00,
  labor_price = 42.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CG02F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG02F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet mozaic (panouri)', 'Panouri parchet mozaic stejar (incl. pierderi)', 'mp', 1.0500, 95.00, 'material', false, 1),
  ('Adeziv parchet', 'Adeziv/Aracet pentru lipire panouri', 'kg', 1.0000, 18.00, 'material', false, 2),
  ('Strat suport', 'Strat suport / folie', 'mp', 1.0500, 5.00, 'material', false, 3),
  ('Manoperă parchet', 'Montaj parchet mozaic prin lipire', 'mp', 1.0000, 42.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 113.00,
  material_price = 76.00,
  labor_price = 35.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Covor PVC', 'Covor PVC pe suport textil (incl. pierderi)', 'mp', 1.0500, 55.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.3500, 25.00, 'material', false, 2),
  ('Pervaz PVC', 'Pervaz PVC (inclus)', 'm', 0.3500, 20.00, 'material', false, 3),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă PVC', 'Montaj covor PVC', 'mp', 1.0000, 35.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 110.00,
  material_price = 76.00,
  labor_price = 32.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG03B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Covor PVC', 'Covor PVC pe suport textil (incl. pierderi)', 'mp', 1.0500, 55.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.3500, 25.00, 'material', false, 2),
  ('Pervaz PVC', 'Pervaz PVC (inclus)', 'm', 0.3500, 20.00, 'material', false, 3),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă PVC', 'Montaj covor PVC', 'mp', 1.0000, 32.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 105.75,
  material_price = 70.75,
  labor_price = 33.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG03C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Covor PVC', 'Covor PVC fără suport textil (incl. pierderi)', 'mp', 1.0500, 50.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.3500, 25.00, 'material', false, 2),
  ('Pervaz PVC', 'Pervaz PVC (inclus)', 'm', 0.3500, 20.00, 'material', false, 3),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă PVC', 'Montaj covor PVC', 'mp', 1.0000, 33.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 102.75,
  material_price = 70.75,
  labor_price = 30.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG03D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Covor PVC', 'Covor PVC fără suport textil (incl. pierderi)', 'mp', 1.0500, 50.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.3500, 25.00, 'material', false, 2),
  ('Pervaz PVC', 'Pervaz PVC (inclus)', 'm', 0.3500, 20.00, 'material', false, 3),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă PVC', 'Montaj covor PVC', 'mp', 1.0000, 30.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
