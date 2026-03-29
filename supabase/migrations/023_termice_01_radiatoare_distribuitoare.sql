BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 450.00,
  material_price = 290.00,
  labor_price = 140.00,
  transport_price = 20.00,
  updated_at = NOW()
WHERE symbol = 'IsC02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IsC02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Radiator oțel tip 22', 'Radiator oțel tip panou 22, L=1000 mm', 'buc', 1.0000, 260.00, 'material', false, 1),
  ('Set robineți + racorduri', 'Robinet tur/retur, aerisitor, niplu, racorduri', 'buc', 1.0000, 20.00, 'material', false, 2),
  ('Console + accesorii prindere', 'Console, dibluri, șuruburi, distanțiere', 'buc', 1.0000, 10.00, 'material', false, 3),
  ('Manoperă montaj radiator', 'Fixare, racordare, aerisire, probe', 'buc', 1.0000, 140.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 20.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 850.00,
  material_price = 650.00,
  labor_price = 170.00,
  transport_price = 30.00,
  updated_at = NOW()
WHERE symbol = 'IB10A01';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IB10A01')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Distribuitor/colector', 'Distribuitor încălzire în pardoseală 8-10 circuite, debitmetre + robineți', 'buc', 1.0000, 450.00, 'material', false, 1),
  ('Cabinet distribuitor', 'Cutie încastrată/aparentă pentru distribuitor', 'buc', 1.0000, 120.00, 'material', false, 2),
  ('Accesorii racordare', 'Olandezi, niplu, aerisitor, golire, suporturi', 'buc', 1.0000, 80.00, 'material', false, 3),
  ('Manoperă montaj', 'Fixare, racordare, etanșare, probe', 'buc', 1.0000, 170.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 30.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
