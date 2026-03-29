BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 8.50,
  material_price = 2.00,
  labor_price = 5.50,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'ZgA01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ZgA01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică interior, 1 strat', 'l', 0.1500, 8.00, 'material', false, 1),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.80, 'material', false, 2),
  ('Manoperă grunduire', 'Aplicare amorsă 1 strat', 'mp', 1.0000, 5.50, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 18.00,
  material_price = 5.00,
  labor_price = 12.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'ZgA02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ZgA02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică interior, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă interior', 'Vopsea lavabilă interior, 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, reparații minore', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă lavabilă', 'Grunduire + 2 straturi lavabilă', 'mp', 1.0000, 12.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 28.00,
  material_price = 8.00,
  labor_price = 17.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'ZgA03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ZgA03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă fațadă', 'Amorsă acrilică exterior, 1 strat', 'l', 0.1500, 8.00, 'material', false, 1),
  ('Vopsea lavabilă exterior', 'Vopsea lavabilă fațadă, 2 straturi', 'l', 0.3500, 16.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 1.20, 'material', false, 3),
  ('Manoperă lavabilă exterior', 'Grunduire + 2 straturi lavabilă exterior', 'mp', 1.0000, 17.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 55.00,
  material_price = 12.00,
  labor_price = 40.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'ZgA04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ZgA04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund alchidic lemn', 'Grund pentru lemn', 'l', 0.1000, 20.00, 'material', false, 1),
  ('Email alchidic lemn', 'Email alchidic (grund + 2 straturi)', 'l', 0.2500, 35.00, 'material', false, 2),
  ('Materiale auxiliare', 'Șmirghel, pensule/role, bandă', 'mp', 1.0000, 1.25, 'material', false, 3),
  ('Manoperă tâmplărie lemn', 'Șlefuire + grund + email', 'mp', 1.0000, 40.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 45.00,
  material_price = 11.00,
  labor_price = 31.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'ZgA05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'ZgA05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund anticoroziv', 'Grund anticoroziv metal', 'l', 0.1200, 25.00, 'material', false, 1),
  ('Vopsea metal', 'Vopsea metal (2 straturi)', 'l', 0.2400, 30.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, perii, bandă', 'mp', 1.0000, 0.80, 'material', false, 3),
  ('Manoperă tâmplărie metal', 'Curățare + grund + vopsire', 'mp', 1.0000, 31.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 18.00,
  material_price = 5.00,
  labor_price = 12.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă', 'Vopsea lavabilă (Vinarom), 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 2 straturi', 'mp', 1.0000, 12.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 19.00,
  material_price = 5.00,
  labor_price = 13.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă', 'Vopsea lavabilă (Vinarom), 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 2 straturi', 'mp', 1.0000, 13.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 20.00,
  material_price = 5.00,
  labor_price = 14.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă', 'Vopsea lavabilă (Vinarom), 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 2 straturi', 'mp', 1.0000, 14.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 30.00,
  material_price = 12.00,
  labor_price = 16.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CN04D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1000, 8.00, 'material', false, 1),
  ('Vopsea de ulei', 'Vopsea de ulei, 2 straturi', 'l', 0.4000, 25.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, bandă, folie', 'mp', 1.0000, 1.20, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 2 straturi', 'mp', 1.0000, 16.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 37.00,
  material_price = 17.00,
  labor_price = 18.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CN04E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1000, 8.00, 'material', false, 1),
  ('Vopsea de ulei', 'Vopsea de ulei, 3 straturi', 'l', 0.6000, 25.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, bandă, folie', 'mp', 1.0000, 1.20, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 3 straturi', 'mp', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 22.00,
  material_price = 7.00,
  labor_price = 14.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund alchidic', 'Grund pentru email alchidic', 'l', 0.1000, 20.00, 'material', false, 1),
  ('Email alchidic', 'Email alchidic, 1 strat', 'l', 0.1200, 35.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, pensule/role, bandă', 'mp', 1.0000, 0.80, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 1 strat', 'mp', 1.0000, 14.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 30.00,
  material_price = 12.00,
  labor_price = 17.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund alchidic', 'Grund pentru email alchidic', 'l', 0.1000, 20.00, 'material', false, 1),
  ('Email alchidic', 'Email alchidic, 2 straturi', 'l', 0.2400, 35.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, pensule/role, bandă', 'mp', 1.0000, 1.60, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare manuală, 2 straturi', 'mp', 1.0000, 17.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 16.00,
  material_price = 5.00,
  labor_price = 10.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04I1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04I1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă', 'Vopsea lavabilă (Vinarom), 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 2 straturi', 'mp', 1.0000, 10.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 17.00,
  material_price = 5.00,
  labor_price = 11.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04J1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04J1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă', 'Vopsea lavabilă (Vinarom), 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 2 straturi', 'mp', 1.0000, 11.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 18.00,
  material_price = 5.00,
  labor_price = 12.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04K1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04K1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1200, 8.00, 'material', false, 1),
  ('Vopsea lavabilă', 'Vopsea lavabilă (Vinarom), 2 straturi', 'l', 0.3000, 12.00, 'material', false, 2),
  ('Materiale auxiliare', 'Bandă, folie, protecții', 'mp', 1.0000, 0.44, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 2 straturi', 'mp', 1.0000, 12.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 28.00,
  material_price = 12.00,
  labor_price = 14.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CN04L1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04L1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1000, 8.00, 'material', false, 1),
  ('Vopsea de ulei', 'Vopsea de ulei, 2 straturi', 'l', 0.4000, 25.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, bandă, folie', 'mp', 1.0000, 1.20, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 2 straturi', 'mp', 1.0000, 14.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 35.00,
  material_price = 17.00,
  labor_price = 16.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CN04M1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04M1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă acrilică', 'Amorsă acrilică, 1 strat', 'l', 0.1000, 8.00, 'material', false, 1),
  ('Vopsea de ulei', 'Vopsea de ulei, 3 straturi', 'l', 0.6000, 25.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, bandă, folie', 'mp', 1.0000, 1.20, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 3 straturi', 'mp', 1.0000, 16.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 20.00,
  material_price = 7.00,
  labor_price = 12.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04N1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04N1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund alchidic', 'Grund pentru email alchidic', 'l', 0.1000, 20.00, 'material', false, 1),
  ('Email alchidic', 'Email alchidic, 1 strat', 'l', 0.1200, 35.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, pensule/role, bandă', 'mp', 1.0000, 0.80, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 1 strat', 'mp', 1.0000, 12.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 28.00,
  material_price = 12.00,
  labor_price = 15.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CN04O1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04O1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund alchidic', 'Grund pentru email alchidic', 'l', 0.1000, 20.00, 'material', false, 1),
  ('Email alchidic', 'Email alchidic, 2 straturi', 'l', 0.2400, 35.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, pensule/role, bandă', 'mp', 1.0000, 1.60, 'material', false, 3),
  ('Manoperă vopsitorie', 'Aplicare mecanizată, 2 straturi', 'mp', 1.0000, 15.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 60.00,
  material_price = 28.00,
  labor_price = 28.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZA06E';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZA06E')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Grund epoxidic', 'Grund epoxidic seria 3100, 1 strat', 'kg', 0.1500, 35.00, 'material', false, 1),
  ('Email epoxidic', 'Email epoxidic seria 3100, 3 straturi', 'kg', 0.4500, 45.00, 'material', false, 2),
  ('Materiale auxiliare', 'Diluant, consumabile aplicare', 'mp', 1.0000, 2.50, 'material', false, 3),
  ('Manoperă vopsire epoxidică', 'Pregătire suport + aplicare sistem epoxidic', 'mp', 1.0000, 28.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
