BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 114.75,
  material_price = 77.75,
  labor_price = 35.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG03E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Covor PVC', 'Covor PVC pe suport textil (incl. pierderi)', 'mp', 1.0500, 55.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.3500, 25.00, 'material', false, 2),
  ('Pervaz lemn', 'Pervaz lemn (inclus)', 'm', 0.3500, 25.00, 'material', false, 3),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă PVC', 'Montaj covor PVC', 'mp', 1.0000, 35.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 108.50,
  material_price = 72.50,
  labor_price = 34.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG03F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Covor PVC', 'Covor PVC fără suport textil (incl. pierderi)', 'mp', 1.0500, 50.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.3500, 25.00, 'material', false, 2),
  ('Pervaz lemn', 'Pervaz lemn (inclus)', 'm', 0.3500, 25.00, 'material', false, 3),
  ('Accesorii', 'Materiale auxiliare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă PVC', 'Montaj covor PVC', 'mp', 1.0000, 34.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 150.30,
  material_price = 99.80,
  labor_price = 48.00,
  transport_price = 2.50,
  updated_at = NOW()
WHERE symbol = 'CG03G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Dale PVC', 'Dale PVC flexibile (incl. pierderi)', 'mp', 1.0500, 65.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.4500, 25.00, 'material', false, 2),
  ('Glet subțire', 'Mortar cu aracet pentru strat suport', 'kg', 2.5000, 2.80, 'material', false, 3),
  ('Mortar ciment M100-T', 'Strat finisare 3 mm', 'kg', 7.0000, 0.90, 'material', false, 4),
  ('Pervaz PVC', 'Pervaz PVC (inclus)', 'm', 0.3500, 20.00, 'material', false, 5),
  ('Manoperă PVC', 'Montaj dale PVC + pregătire suport', 'mp', 1.0000, 48.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.50, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 154.05,
  material_price = 101.55,
  labor_price = 50.00,
  transport_price = 2.50,
  updated_at = NOW()
WHERE symbol = 'CG03H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG03H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Dale PVC', 'Dale PVC flexibile (incl. pierderi)', 'mp', 1.0500, 65.00, 'material', false, 1),
  ('Adeziv PVC', 'Adeziv contact / prenadez', 'kg', 0.4500, 25.00, 'material', false, 2),
  ('Glet subțire', 'Mortar cu aracet pentru strat suport', 'kg', 2.5000, 2.80, 'material', false, 3),
  ('Mortar ciment M100-T', 'Strat finisare 3 mm', 'kg', 7.0000, 0.90, 'material', false, 4),
  ('Pervaz lemn', 'Pervaz lemn (inclus)', 'm', 0.3500, 25.00, 'material', false, 5),
  ('Manoperă PVC', 'Montaj dale PVC + pregătire suport', 'mp', 1.0000, 50.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.50, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 144.60,
  material_price = 82.60,
  labor_price = 60.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG11B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG11B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Gresie porțelanată', 'Plăci gresie (2 culori) incl. pierderi', 'mp', 1.1000, 55.00, 'material', false, 1),
  ('Adeziv C2TE', 'Adeziv flexibil pentru gresie', 'kg', 5.0000, 2.80, 'material', false, 2),
  ('Chit rosturi', 'Chit de rost pentru gresie', 'kg', 0.3000, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport mineral', 'l', 0.1500, 10.00, 'material', false, 4),
  ('Distanțiere/nivelare', 'Distanțiere + consumabile montaj', 'mp', 1.0000, 3.00, 'material', false, 5),
  ('Manoperă gresie', 'Montaj gresie după desen (2 culori)', 'mp', 1.0000, 60.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 154.86,
  material_price = 87.86,
  labor_price = 65.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CG11C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CG11C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Gresie porțelanată', 'Plăci gresie cu pișcoturi incl. pierderi', 'mp', 1.1200, 55.00, 'material', false, 1),
  ('Adeziv C2TE', 'Adeziv flexibil pentru gresie', 'kg', 5.2000, 2.80, 'material', false, 2),
  ('Chit rosturi', 'Chit de rost pentru gresie', 'kg', 0.3500, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport mineral', 'l', 0.1500, 10.00, 'material', false, 4),
  ('Accesorii', 'Profil/pișcoturi + consumabile', 'mp', 1.0000, 6.00, 'material', false, 5),
  ('Manoperă gresie', 'Montaj gresie cu pișcoturi', 'mp', 1.0000, 65.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
