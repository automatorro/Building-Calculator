BEGIN;

-- Recipe for CN13C1 - Vopsitorii la instalaţii cu vopsea de ulei, pe conducte având diametrul exterior peste 34 mm;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CN13C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN13C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN13A1 - Vopsitorii la instalaţii obişnuite, cu vopsea de ulei, pe conducte având diametrul exterior până la 34 mm inclusiv;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CN13A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN13A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN13B1 - Vopsitorii la instalaţii superioare, cu vopsea de ulei, pe conducte având diametrul exterior până la 34 mm inclusiv;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CN13B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN13B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN01A1 - Zugrăveli interioare şi exterioare executate simplu cu lapte de var sau cu adaos de coloranţi şi grăsimi la interior sau exterior, pe orice fel de suprafaţă suport, cu două straturi de lapte de var (spoieli) ;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 39.25,
  material_price = 2.25,
  labor_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CN01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lapte de var / Colorant', 'Calculat conform normativ estimativ 2026', 'l', 0.1500, 15.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 35.00, 'manopera', false, 2),
  ('Schele/Unelte (diverse)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 2.00, 'utilaj', false, 3)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN01B1 - Zugrăveli interioare şi exterioare executate simplu cu lapte de var sau cu adaos de coloranţi şi grăsimi la interior, la pereţi şi tavane, cu două straturi de zugrăveală în culori de apă cu adaos de coloranţi şi grăsimi, pe suprafeţe de beton
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 39.25,
  material_price = 2.25,
  labor_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CN01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lapte de var / Colorant', 'Calculat conform normativ estimativ 2026', 'l', 0.1500, 15.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 35.00, 'manopera', false, 2),
  ('Schele/Unelte (diverse)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 2.00, 'utilaj', false, 3)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN01C1 - Zugrăveli interioare şi exterioare executate simplu cu lapte de var sau cu adaos de coloranţi şi grăsimi la interior, la pereţi şi tavane, cu două straturi de zugrăveală în culori de apă cu adaos de coloranţi şi grăsimi, pe suprafeţe drişcuite sau gletuite
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 39.25,
  material_price = 2.25,
  labor_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CN01C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN01C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lapte de var / Colorant', 'Calculat conform normativ estimativ 2026', 'l', 0.1500, 15.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 35.00, 'manopera', false, 2),
  ('Schele/Unelte (diverse)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 2.00, 'utilaj', false, 3)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN01D1 - Zugrăveli interioare şi exterioare executate simplu cu lapte de var sau cu adaos de coloranţi şi grăsimi la faţade, cu două straturi de zugrăveală în culori de apă şi adaos de coloranţi şi grăsimi, pe suprafeţe de beton
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 39.25,
  material_price = 2.25,
  labor_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CN01D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN01D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lapte de var / Colorant', 'Calculat conform normativ estimativ 2026', 'l', 0.1500, 15.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 35.00, 'manopera', false, 2),
  ('Schele/Unelte (diverse)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 2.00, 'utilaj', false, 3)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN01E1 - Zugrăveli interioare şi exterioare executate simplu cu lapte de var sau cu adaos de coloranţi şi grăsimi la faţade, cu două straturi de zugrăveală în culori de apă şi adaos de coloranţi şi grăsimi, pe suprafeţe drişcuite sau gletuite.
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 39.25,
  material_price = 2.25,
  labor_price = 35.00,
  updated_at = NOW()
WHERE symbol = 'CN01E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN01E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lapte de var / Colorant', 'Calculat conform normativ estimativ 2026', 'l', 0.1500, 15.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 35.00, 'manopera', false, 2),
  ('Schele/Unelte (diverse)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 2.00, 'utilaj', false, 3)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN04H1 - Vopsitorii la interior şi exterior, la pereţi şi tavane, executate manual, cu vopsea pe bază de acetat CPMB, aplicate în două straturi, pe suprafeţele elementelor prefabricate din beton celular autoclavizat, pe glet de netezire existent;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 46.25,
  material_price = 6.25,
  labor_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'CN04H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea lavabilă', 'Calculat conform normativ estimativ 2026', 'l', 0.2500, 25.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 40.00, 'manopera', false, 2)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN04P1 - Vopsitorii la interior şi exterior, la pereţi şi tavane, executate mecanizat, cu vopsea pe bază de acetat CPMB, aplicate în două straturi, pe suprafeţele elementelor prefabricate din beton celular autoclavizat, pe glet de netezire existent;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 46.25,
  material_price = 6.25,
  labor_price = 40.00,
  updated_at = NOW()
WHERE symbol = 'CN04P1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN04P1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea lavabilă', 'Calculat conform normativ estimativ 2026', 'l', 0.2500, 25.00, 'material', false, 1),
  ('Manoperă zugrav', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 40.00, 'manopera', false, 2)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN13F1 - Vopsitorii la instalaţii obişnuite, cu email alchidic (Termolux), pe conducte avind diametrul exterior până la 34 mm inclusiv;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CN13F1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN13F1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN13G1 - Vopsitorii la instalaţii superioare, cu email alchidic (Termolux), pe conducte având diametrul exterior până la 34 mm inclusiv;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CN13G1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN13G1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CN13H1 - Vopsitorii la instalaţii cu email alchidic (Termolux), pe conducte având diametrul exterior peste 34 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'CN13H1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CN13H1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR27A1 - Vopsitorii în culori de ulei pe tâmplărie pe lemn la interior şi exterior executate în 2 straturi   
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR27A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR27A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR27B1 - Vopsitorii în culori de ulei pe tâmplărie pe lemn la interior şi exterior executate în 3 straturi   
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR27B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR27B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR28A1 - Vopsitul in culori de ulei intr-un strat peste vopseaua existentă a tâmplăriei de lemn, la interior şi exterior
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR28A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR28A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR31A1 - Vopsitorie cu email alchidal pe timplarie de lemn la interior si exterioare cu un strat   
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR31A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR31A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR31B1 - Vopsitorie cu email alchidal pe timplarie de lemn la interior si exterioare cu două straturi   
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR31B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR31B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR42A1 - Vopsirea in culori de ulei a tâmplăriei metalice la exterior si inteior, gata grunduită cu miniu de plumb în construcţii existente, executate în 2 straturi
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR42A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR42A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR42B1 - Vopsirea in culori de ulei a tâmplăriei metalice la exterior si inteior, gata grunduită cu miniu de plumb în construcţii existente, executate în 3 straturi
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR42B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR42B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR44A1 - Vopsitul cu email alchidal pe tâmplărie metalică executată în interior si exterior în construcţii existente cu  1 strat
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR44A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR44A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR44B1 - Vopsitul cu email alchidal pe tâmplărie metalică executată în interior si exterior în construcţii existente cu  2 straturi
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR44B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR44B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR52B1 - Revopsitul conductelor la instalaţii cu vopsele de ulei, la conducte cu diametrul exterior peste 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR52B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR52B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR52C1 - Revopsitul conductelor la instalaţii cu email alchidic, la conducte cu diametrul exterior până la 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR52C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR52C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR52A1 - Revopsitul conductelor la instalaţii cu vopsele de ulei, la conducte cu diametrul exterior până la 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR52A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR52A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR51A1 - Vopsitul conductelor la instalaţii cu vopsele de ulei, la conducte cu diametrul exterior până la 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR51A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR51A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR51B1 - Vopsitul conductelor la instalaţii cu vopsele de ulei, la conducte cu diametrul exterior peste 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR51B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR51B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR51C1 - Vopsitul conductelor la instalaţii cu email alchidic, la conducte cu diametrul exterior până la 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR51C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR51C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'm', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR51D1 - Vopsitul conductelor la instalaţii cu email alchidic, la conducte cu diametrul exterior peste 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR51D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR51D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for RPCR52D1 - Revopsitul conductelor la instalaţii cu email alchidic, la conducte cu diametrul exterior peste 60 mm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 56.40,
  material_price = 11.40,
  labor_price = 45.00,
  updated_at = NOW()
WHERE symbol = 'RPCR52D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCR52D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vopsea ulei / Email alchidic', 'Calculat conform normativ estimativ 2026', 'kg', 0.2000, 35.00, 'material', false, 1),
  ('Diluant', 'Calculat conform normativ estimativ 2026', 'l', 0.0500, 18.00, 'material', false, 2),
  ('Manoperă vopsitor', 'Calculat conform normativ estimativ 2026', 'mp', 1.0000, 45.00, 'manopera', false, 3),
  ('Consumabile (pensule/benzi)', 'Calculat conform normativ estimativ 2026', 'lei', 1.0000, 3.50, 'material', true, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD03A1 - Zidărie din piatră cioplită, gata prelucrată, aşezată în mozaic (opus încertum) inclusiv rostuirea fetelor vazute cu mortar marca M 100-T
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 641.50,
  material_price = 251.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatră naturală/cioplită', 'Calculat conform normativ estimativ 2026', 'mc', 1.0500, 180.00, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD04A1 - Zidărie din cărămidă presată arsă pentru protecţia hidroizolatiilor din pereţii subsolurilor, inclusiv aplicarea unei tencuieli de 0,5 - 1,0 cm grosime, executată cu cărămizi calitatea 1 şi mortar marca ...1), în ziduri cu o grosime de 7,5 cm şi o înălţime peste 3 m
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 992.50,
  material_price = 602.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cărămidă plină presată', 'Calculat conform normativ estimativ 2026', 'buc', 450.0000, 1.20, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD04B1 - Zidărie din cărămidă presată arsă pentru protecţia hidroizolatiilor din pereţii subsolurilor, inclusiv aplicarea unei tencuieli de 0,5 - 1,0 cm grosime, executată cu cărămizi calitatea 1 şi mortar marca ...1), în ziduri cu o grosime de 7,5 cm şi o înălţime până la 3 m inclusiv;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 992.50,
  material_price = 602.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD04B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD04B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cărămidă plină presată', 'Calculat conform normativ estimativ 2026', 'buc', 450.0000, 1.20, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD04C1 - Zidărie din cărămidă presată arsă la coşuri de fum izolate, executată obişnuit cu cărămizi calitatea 1, în pod şi aparent la exterior, inclusiv rostuirea;
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 992.50,
  material_price = 602.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD04C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD04C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cărămidă plină presată', 'Calculat conform normativ estimativ 2026', 'buc', 450.0000, 1.20, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD04D1 - Zidărie din cărămidă presată arsă executată cu cărămizi calitatea 1, în ziduri cu o grosime de grosime de 12,5 cm pentru parapete la balcoane, terase, garduri etc, inclusiv rostuirea
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 992.50,
  material_price = 602.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD04D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD04D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cărămidă plină presată', 'Calculat conform normativ estimativ 2026', 'buc', 450.0000, 1.20, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD01A1 - Zidărie din piatră brută de carieră pentru construcţii sau din bolovani de râu in fundatii cu piatra de cariera,roca eruptiva  
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 641.50,
  material_price = 251.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatră naturală/cioplită', 'Calculat conform normativ estimativ 2026', 'mc', 1.0500, 180.00, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD01B1 - Zidărie din piatră brută de carieră pentru construcţii sau din bolovani de râu ,roca eruptivain ziduri,stalpi si cotraforti cu grosime peste 50cm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 641.50,
  material_price = 251.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Piatră naturală/cioplită', 'Calculat conform normativ estimativ 2026', 'mc', 1.0500, 180.00, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD02A1 - Zidărie din moloane grosimea pana la 50 cm
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 992.50,
  material_price = 602.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cărămidă plină presată', 'Calculat conform normativ estimativ 2026', 'buc', 450.0000, 1.20, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

-- Recipe for CD04E1 - Zidărie din cărămidă presată arsă executată cu cărămizi calitatea 1 şi armătură din oţel be - 7,5 cm la închiderea căzilor de baie
UPDATE catalog_norms SET
  has_components = true,
  unit_price = 992.50,
  material_price = 602.50,
  labor_price = 350.00,
  updated_at = NOW()
WHERE symbol = 'CD04E1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CD04E1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Cărămidă plină presată', 'Calculat conform normativ estimativ 2026', 'buc', 450.0000, 1.20, 'material', false, 1),
  ('Mortar zidărie M10', 'Calculat conform normativ estimativ 2026', 'mc', 0.2500, 250.00, 'material', false, 2),
  ('Manoperă zidar', 'Calculat conform normativ estimativ 2026', 'mc', 1.0000, 350.00, 'manopera', false, 3),
  ('Malaxor / Macara (cotă parțială)', 'Calculat conform normativ estimativ 2026', 'ore', 0.5000, 80.00, 'utilaj', false, 4)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
