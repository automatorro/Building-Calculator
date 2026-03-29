BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 155.00,
  material_price = 97.00,
  labor_price = 55.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'TcB01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TcB01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Gresie antiderapantă', 'Plăci gresie antiderapantă (incl. pierderi)', 'mp', 1.1000, 60.00, 'material', false, 1),
  ('Adeziv C2TE', 'Adeziv flexibil pentru gresie', 'kg', 6.0000, 2.80, 'material', false, 2),
  ('Chit rosturi', 'Chit de rost pentru gresie', 'kg', 0.3500, 12.00, 'material', false, 3),
  ('Amorsă', 'Amorsă suport mineral', 'l', 0.1500, 10.00, 'material', false, 4),
  ('Distanțiere/nivelare', 'Distanțiere + consumabile montaj', 'mp', 1.0000, 3.00, 'material', false, 5),
  ('Accesorii antiderapante', 'Profile/benzi antiderapante (după caz)', 'mp', 1.0000, 5.50, 'material', false, 6),
  ('Manoperă gresie', 'Montaj gresie antiderapantă', 'mp', 1.0000, 55.00, 'manopera', false, 7),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 8),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 81.00,
  labor_price = 60.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'TcB03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TcB03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet laminat 8mm', 'Parchet laminat (incl. pierderi)', 'mp', 1.0500, 55.00, 'material', false, 1),
  ('Suport fonoizolant', 'Underlay fonoizolant', 'mp', 1.0500, 7.00, 'material', false, 2),
  ('Folie barieră vapori', 'Folie PE sub parchet', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Plintă', 'Plintă MDF/PVC (inclus)', 'm', 0.3500, 25.00, 'material', false, 4),
  ('Profile trecere', 'Profile trecere/terminație', 'm', 0.1000, 35.00, 'material', false, 5),
  ('Accesorii montaj', 'Clipsuri, colțare, consumabile', 'mp', 1.0000, 1.55, 'material', false, 6),
  ('Manoperă parchet', 'Montaj parchet laminat flotant', 'mp', 1.0000, 60.00, 'manopera', false, 7),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 8),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 285.00,
  material_price = 233.00,
  labor_price = 48.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'TcB04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TcB04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Parchet masiv stejar', 'Parchet masiv lăcuit în fabrică (incl. pierderi)', 'mp', 1.0500, 170.00, 'material', false, 1),
  ('Adeziv parchet', 'Adeziv pentru parchet masiv', 'kg', 1.2000, 28.00, 'material', false, 2),
  ('Amorsă', 'Amorsă suport mineral', 'l', 0.1500, 10.00, 'material', false, 3),
  ('Plintă lemn', 'Plintă lemn (inclus)', 'm', 0.3500, 35.00, 'material', false, 4),
  ('Profile trecere', 'Profile trecere/terminație', 'm', 0.1000, 45.00, 'material', false, 5),
  ('Accesorii montaj', 'Dibluri/șuruburi, consumabile', 'mp', 1.0000, 2.65, 'material', false, 6),
  ('Manoperă parchet', 'Montaj parchet masiv', 'mp', 1.0000, 48.00, 'manopera', false, 7),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 8),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 75.00,
  material_price = 48.00,
  labor_price = 25.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'TcB05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TcB05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Mortar șapă M150', 'Șapă ciment M150, 5 cm (material)', 'kg', 100.0000, 0.35, 'material', false, 1),
  ('Plasă sudată', 'Plasă sudată armare (incl. pierderi)', 'mp', 1.0500, 8.00, 'material', false, 2),
  ('Folie PE', 'Folie separație/antivapori', 'mp', 1.0500, 1.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă dilatație perimetrală', 'm', 1.0000, 0.70, 'material', false, 4),
  ('Aditiv plastifiant', 'Aditiv pentru lucrabilitate', 'l', 0.1500, 19.00, 'material', false, 5),
  ('Manoperă șapă', 'Turnare + nivelare șapă ciment', 'mp', 1.0000, 25.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 58.00,
  labor_price = 35.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'TcB06A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'TcB06A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Mortar autonivelant', 'Șapă autonivelantă 4–6 cm (material)', 'kg', 90.0000, 0.62, 'material', false, 1),
  ('Amorsă', 'Amorsă suport mineral', 'l', 0.1500, 10.00, 'material', false, 2),
  ('Bandă perimetrală', 'Bandă dilatație perimetrală', 'm', 1.0000, 0.70, 'material', false, 3),
  ('Manoperă șapă autonivelantă', 'Turnare + nivelare', 'mp', 1.0000, 35.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
