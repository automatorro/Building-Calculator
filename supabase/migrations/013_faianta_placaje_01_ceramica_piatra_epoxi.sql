BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 152.60,
  material_price = 84.60,
  labor_price = 65.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți (incl. pierderi)', 'mp', 1.1000, 55.00, 'material', false, 1),
  ('Adeziv flexibil', 'Adeziv flexibil C2TE pentru faianță', 'kg', 5.5000, 2.80, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.6000, 12.00, 'material', false, 3),
  ('Distanțieri și accesorii', 'Distanțieri + accesorii montaj', 'mp', 1.0000, 1.50, 'material', false, 4),
  ('Manoperă faianță', 'Montaj faianță în încăperi < 10 mp', 'mp', 1.0000, 65.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 138.65,
  material_price = 80.65,
  labor_price = 55.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți (incl. pierderi)', 'mp', 1.0700, 55.00, 'material', false, 1),
  ('Adeziv flexibil', 'Adeziv flexibil C2TE pentru faianță', 'kg', 5.0000, 2.80, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.5500, 12.00, 'material', false, 3),
  ('Distanțieri și accesorii', 'Distanțieri + accesorii montaj', 'mp', 1.0000, 1.20, 'material', false, 4),
  ('Manoperă faianță', 'Montaj faianță în încăperi > 10 mp', 'mp', 1.0000, 55.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 155.95,
  material_price = 85.95,
  labor_price = 67.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți (incl. pierderi)', 'mp', 1.1000, 55.00, 'material', false, 1),
  ('Adeziv cu aracet', 'Mortar ciment cu adaos de aracet EP 25', 'kg', 5.5000, 3.10, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.6000, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1500, 8.00, 'material', false, 4),
  ('Manoperă faianță', 'Montaj faianță în încăperi < 10 mp', 'mp', 1.0000, 67.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 141.91,
  material_price = 81.91,
  labor_price = 57.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți (incl. pierderi)', 'mp', 1.0700, 55.00, 'material', false, 1),
  ('Adeziv cu aracet', 'Mortar ciment cu adaos de aracet EP 25', 'kg', 5.0000, 3.10, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.5500, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1200, 8.00, 'material', false, 4),
  ('Manoperă faianță', 'Montaj faianță în încăperi > 10 mp', 'mp', 1.0000, 57.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 170.76,
  material_price = 107.76,
  labor_price = 60.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți (incl. pierderi)', 'mp', 1.0800, 55.00, 'material', false, 1),
  ('Pastă adezivă', 'Pastă adezivă pe bază de aracet', 'kg', 6.0000, 6.50, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.6000, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1200, 8.00, 'material', false, 4),
  ('Distanțieri și accesorii', 'Distanțieri + accesorii montaj', 'mp', 1.0000, 1.20, 'material', false, 5),
  ('Manoperă faianță', 'Montaj faianță cu pastă adezivă', 'mp', 1.0000, 60.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 164.10,
  material_price = 91.10,
  labor_price = 70.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți în desen (incl. pierderi)', 'mp', 1.1200, 58.00, 'material', false, 1),
  ('Adeziv flexibil', 'Adeziv flexibil C2TE pentru faianță', 'kg', 5.8000, 2.80, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.7000, 12.00, 'material', false, 3),
  ('Distanțieri și accesorii', 'Distanțieri + accesorii montaj', 'mp', 1.0000, 1.50, 'material', false, 4),
  ('Manoperă faianță', 'Montaj faianță în desen (culori diferite)', 'mp', 1.0000, 70.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 167.54,
  material_price = 92.54,
  labor_price = 72.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți în desen (incl. pierderi)', 'mp', 1.1200, 58.00, 'material', false, 1),
  ('Adeziv cu aracet', 'Mortar ciment cu adaos de aracet EP 25', 'kg', 5.8000, 3.10, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.7000, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1500, 8.00, 'material', false, 4),
  ('Manoperă faianță', 'Montaj faianță în desen (culori diferite)', 'mp', 1.0000, 72.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 196.31,
  material_price = 118.31,
  labor_price = 75.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI06H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI06H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci faianță', 'Faianță pereți în desen (incl. pierderi)', 'mp', 1.1200, 58.00, 'material', false, 1),
  ('Pastă adezivă', 'Pastă adezivă pe bază de aracet', 'kg', 6.5000, 6.50, 'material', false, 2),
  ('Chit de rosturi', 'Chit rosturi baie/bucătărie', 'kg', 0.7000, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1500, 8.00, 'material', false, 4),
  ('Distanțieri și accesorii', 'Distanțieri + accesorii montaj', 'mp', 1.0000, 1.50, 'material', false, 5),
  ('Manoperă faianță', 'Montaj faianță în desen (culori diferite)', 'mp', 1.0000, 75.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 190.95,
  material_price = 125.95,
  labor_price = 62.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice (incl. pierderi)', 'mp', 1.1000, 85.00, 'material', false, 1),
  ('Mortar suport', 'Strat suport (grund) mortar M100-T', 'kg', 25.0000, 0.45, 'material', false, 2),
  ('Adeziv flexibil', 'Strat fixare (≈0.5 cm) adeziv pentru plăci', 'kg', 5.0000, 2.80, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.6000, 12.00, 'material', false, 4),
  ('Manoperă placaj ceramic', 'Placaj ceramic pe suprafețe plane', 'mp', 1.0000, 62.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 203.55,
  material_price = 130.55,
  labor_price = 70.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice (incl. pierderi)', 'mp', 1.1200, 85.00, 'material', false, 1),
  ('Mortar suport', 'Strat suport (grund) mortar M100-T', 'kg', 27.0000, 0.45, 'material', false, 2),
  ('Adeziv flexibil', 'Strat fixare (≈0.5 cm) adeziv pentru plăci', 'kg', 5.5000, 2.80, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.6500, 12.00, 'material', false, 4),
  ('Manoperă placaj ceramic', 'Placaj ceramic pe suprafețe curbe', 'mp', 1.0000, 70.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 186.95,
  material_price = 118.95,
  labor_price = 65.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice (incl. pierderi)', 'mp', 1.1000, 85.00, 'material', false, 1),
  ('Adeziv cu aracet', 'Mortar ciment cu adaos de aracet EP 25', 'kg', 5.5000, 3.10, 'material', false, 2),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1500, 8.00, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.6000, 12.00, 'material', false, 4),
  ('Manoperă placaj ceramic', 'Placaj ceramic pe BCA cu mortar + aracet', 'mp', 1.0000, 65.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 206.66,
  material_price = 140.66,
  labor_price = 63.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice (incl. pierderi)', 'mp', 1.1000, 85.00, 'material', false, 1),
  ('Pastă adezivă', 'Pastă adezivă pe bază de aracet CPMB', 'kg', 6.0000, 6.50, 'material', false, 2),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1200, 8.00, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.6000, 12.00, 'material', false, 4),
  ('Manoperă placaj ceramic', 'Placaj ceramic pe BCA cu pastă adezivă', 'mp', 1.0000, 63.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 211.15,
  material_price = 140.15,
  labor_price = 68.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice format mare (incl. pierderi)', 'mp', 1.0800, 95.00, 'material', false, 1),
  ('Mortar suport', 'Strat suport (grund) mortar M100-T', 'kg', 25.0000, 0.45, 'material', false, 2),
  ('Adeziv flexibil', 'Adeziv flexibil C2TE/S1 pentru format mare', 'kg', 6.0000, 2.80, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.5000, 12.00, 'material', false, 4),
  ('Sistem nivelare', 'Clipsuri + pene nivelare', 'mp', 1.0000, 3.50, 'material', false, 5),
  ('Manoperă placaj ceramic', 'Placaj ceramic format mare pe suprafețe plane', 'mp', 1.0000, 68.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 225.95,
  material_price = 144.95,
  labor_price = 78.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice format mare (incl. pierderi)', 'mp', 1.1000, 95.00, 'material', false, 1),
  ('Mortar suport', 'Strat suport (grund) mortar M100-T', 'kg', 27.0000, 0.45, 'material', false, 2),
  ('Adeziv flexibil', 'Adeziv flexibil C2TE/S1 pentru format mare', 'kg', 6.5000, 2.80, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.5500, 12.00, 'material', false, 4),
  ('Sistem nivelare', 'Clipsuri + pene nivelare', 'mp', 1.0000, 3.50, 'material', false, 5),
  ('Manoperă placaj ceramic', 'Placaj ceramic format mare pe suprafețe curbe', 'mp', 1.0000, 78.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 206.90,
  material_price = 131.90,
  labor_price = 72.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice format mare (incl. pierderi)', 'mp', 1.0800, 95.00, 'material', false, 1),
  ('Adeziv cu aracet', 'Mortar ciment cu adaos de aracet EP 25', 'kg', 6.0000, 3.10, 'material', false, 2),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1500, 8.00, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.5000, 12.00, 'material', false, 4),
  ('Sistem nivelare', 'Clipsuri + pene nivelare', 'mp', 1.0000, 3.50, 'material', false, 5),
  ('Manoperă placaj ceramic', 'Placaj ceramic format mare pe BCA cu mortar + aracet', 'mp', 1.0000, 72.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 231.56,
  material_price = 158.56,
  labor_price = 70.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'CI05H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI05H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci ceramice glazurate', 'Plăci ceramice format mare (incl. pierderi)', 'mp', 1.0800, 95.00, 'material', false, 1),
  ('Pastă adezivă', 'Pastă adezivă pe bază de aracet CPMB', 'kg', 7.0000, 6.50, 'material', false, 2),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.1200, 8.00, 'material', false, 3),
  ('Chit de rosturi', 'Chit rosturi', 'kg', 0.5000, 12.00, 'material', false, 4),
  ('Sistem nivelare', 'Clipsuri + pene nivelare', 'mp', 1.0000, 3.50, 'material', false, 5),
  ('Manoperă placaj ceramic', 'Placaj ceramic format mare pe BCA cu pastă adezivă', 'mp', 1.0000, 70.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 440.60,
  material_price = 310.60,
  labor_price = 120.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'CI02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Placaj piatră naturală', 'Marmură/travertin/piatră (incl. pierderi)', 'mp', 1.0500, 240.00, 'material', false, 1),
  ('Adeziv piatră', 'Adeziv pentru piatră naturală', 'kg', 8.0000, 3.20, 'material', false, 2),
  ('Dibluri/ancore', 'Fixări mecanice (după caz)', 'buc', 6.0000, 2.50, 'material', false, 3),
  ('Chit/rosturi', 'Material rostuire piatră', 'kg', 1.0000, 18.00, 'material', false, 4),
  ('Manoperă placaj piatră', 'Montaj placaj piatră naturală ≤ 5 cm', 'mp', 1.0000, 120.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 10.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 571.60,
  material_price = 409.60,
  labor_price = 150.00,
  transport_price = 12.00,
  updated_at = NOW()
WHERE symbol = 'CI02B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI02B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Placaj piatră naturală', 'Marmură/travertin/piatră (incl. pierderi)', 'mp', 1.0500, 320.00, 'material', false, 1),
  ('Adeziv piatră', 'Adeziv pentru piatră naturală', 'kg', 10.0000, 3.20, 'material', false, 2),
  ('Dibluri/ancore', 'Fixări mecanice (după caz)', 'buc', 8.0000, 2.50, 'material', false, 3),
  ('Chit/rosturi', 'Material rostuire piatră', 'kg', 1.2000, 18.00, 'material', false, 4),
  ('Manoperă placaj piatră', 'Montaj placaj piatră naturală > 5 cm', 'mp', 1.0000, 150.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 12.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 244.60,
  material_price = 180.60,
  labor_price = 60.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'CI09A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CI09A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Foi flexibile', 'Foi prefabricate tip MARMOROC (incl. pierderi)', 'mp', 1.0500, 150.00, 'material', false, 1),
  ('Adeziv flexibil', 'Adeziv flexibil pentru foi/piatră subțire', 'kg', 4.5000, 3.20, 'material', false, 2),
  ('Amorsă', 'Amorsă suport înainte de placare', 'l', 0.2000, 8.00, 'material', false, 3),
  ('Finisaj rosturi', 'Finisaj/etanșare rosturi (după caz)', 'kg', 0.2000, 18.00, 'material', false, 4),
  ('Impregnant', 'Impregnant/Protecție placaj', 'l', 0.1000, 35.00, 'material', false, 5),
  ('Manoperă placaj', 'Montaj foi flexibile tip MARMOROC', 'mp', 1.0000, 60.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 144.00,
  material_price = 70.00,
  labor_price = 70.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'H1E22A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'H1E22A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund epoxidic', 'Amorsă epoxidică pentru suport beton', 'kg', 0.3000, 35.00, 'material', false, 1),
  ('Rășină epoxidică', 'Strat epoxidic de uzură', 'kg', 1.2000, 45.00, 'material', false, 2),
  ('Nisip cuarț', 'Nisip cuarț pentru antiderapare (după caz)', 'kg', 1.0000, 3.00, 'material', false, 3),
  ('Materiale auxiliare', 'Role, diluant, accesorii aplicare', 'mp', 1.0000, 2.50, 'material', false, 4),
  ('Manoperă epoxidic', 'Pregătire suport + aplicare sistem epoxidic', 'mp', 1.0000, 70.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
