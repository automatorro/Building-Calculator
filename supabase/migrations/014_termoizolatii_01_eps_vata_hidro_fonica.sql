BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 143.05,
  material_price = 104.05,
  labor_price = 36.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IzA01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IzA01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Polistiren EPS 15cm', 'Plăci EPS 15 cm (incl. pierderi)', 'mp', 1.0600, 42.00, 'material', false, 1),
  ('Adeziv + masă șpaclu', 'Adeziv/masă șpaclu pentru termosistem', 'kg', 6.5000, 3.00, 'material', false, 2),
  ('Dibluri', 'Dibluri termosistem cu cui', 'buc', 6.0000, 1.15, 'material', false, 3),
  ('Plasă fibră sticlă', 'Plasă fibră 160 g/mp (incl. suprapuneri)', 'mp', 1.1000, 4.80, 'material', false, 4),
  ('Profile', 'Șină start + profile colțuri (echivalent/mp)', 'mp', 1.0000, 3.50, 'material', false, 5),
  ('Grund', 'Grund de amorsare pentru tencuială decorativă', 'l', 0.2000, 8.00, 'material', false, 6),
  ('Tencuială decorativă', 'Tencuială decorativă exterior (granulație 1.5–2.0)', 'kg', 3.5000, 6.50, 'material', false, 7),
  ('Manoperă termosistem', 'Montaj sistem termoizolant complet', 'mp', 1.0000, 36.00, 'manopera', false, 8),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 9),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 72.52,
  material_price = 45.02,
  labor_price = 25.00,
  transport_price = 2.50,
  updated_at = NOW()
WHERE symbol = 'IzA02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IzA02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vată minerală bazaltică 10cm', 'Plăci vată bazaltică 10 cm (incl. pierderi)', 'mp', 1.0600, 32.00, 'material', false, 1),
  ('Folie barieră vapori', 'Folie PE barieră vapori', 'mp', 1.0000, 2.50, 'material', false, 2),
  ('Folie protecție', 'Folie protecție/difuzie', 'mp', 1.0000, 3.00, 'material', false, 3),
  ('Bandă adezivă', 'Bandă etanșare îmbinări', 'mp', 1.0000, 0.80, 'material', false, 4),
  ('Sistem fixare', 'Dibluri/agrafe fixare', 'buc', 6.0000, 0.80, 'material', false, 5),
  ('Manoperă izolație planșeu', 'Montaj izolație planșeu cu vată minerală', 'mp', 1.0000, 25.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.50, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 44.75,
  material_price = 24.75,
  labor_price = 18.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IzA03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IzA03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Vată minerală suflată', 'Vată minerală suflată (densitate medie) 20 cm', 'kg', 4.5000, 4.50, 'material', false, 1),
  ('Folie barieră vapori', 'Folie PE barieră vapori', 'mp', 1.0000, 2.50, 'material', false, 2),
  ('Plasă/rigle suport', 'Elemente suport (după caz)', 'mp', 1.0000, 2.00, 'material', false, 3),
  ('Manoperă izolație pod', 'Aplicare vată suflată (inclusiv pregătire)', 'mp', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 53.90,
  material_price = 26.90,
  labor_price = 25.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IzA04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IzA04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Bitum oxidat', 'Bitum aplicat la cald (2 straturi)', 'kg', 3.0000, 3.50, 'material', false, 1),
  ('Amorsă bituminoasă', 'Amorsă suport înainte de aplicare', 'l', 0.2500, 9.00, 'material', false, 2),
  ('Mastic bituminos', 'Chit/mastic bituminos pentru hidroizolații', 'kg', 2.0000, 6.00, 'material', false, 3),
  ('Combustibil', 'Combustibil/gaz pentru topire', 'l', 0.2000, 7.00, 'material', false, 4),
  ('Nisip protecție', 'Nisip fin pentru protecție', 'kg', 3.0000, 0.25, 'material', false, 5),
  ('Manoperă hidroizolație', 'Aplicare hidroizolație bitum la cald, 2 straturi', 'mp', 1.0000, 25.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 46.25,
  material_price = 26.25,
  labor_price = 18.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IzA05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IzA05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Rogojini vată minerală 3cm', 'Rogojini fonoizolante (incl. pierderi)', 'mp', 1.0500, 18.00, 'material', false, 1),
  ('Folie PE', 'Folie separație/antifon', 'mp', 1.0500, 2.00, 'material', false, 2),
  ('Bandă perimetrală', 'Bandă perimetrală antifon', 'm', 0.5000, 3.00, 'material', false, 3),
  ('Adeziv fixare', 'Adeziv/prenadez (după caz)', 'kg', 0.1500, 25.00, 'material', false, 4),
  ('Manoperă fonoizolație', 'Montaj rogojini fonoizolante', 'mp', 1.0000, 18.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 99.05,
  material_price = 64.05,
  labor_price = 32.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF06A';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF06A')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă bituminoasă', 'Amorsaj cu suspensie bituminoasă', 'l', 0.3500, 9.00, 'material', false, 1),
  ('Pânză bitumată', 'Pânză bitumată (2 straturi, incl. suprapuneri)', 'mp', 2.2000, 12.00, 'material', false, 2),
  ('Emulsie bituminoasă', 'Bitum filerizat/suspensie (straturi multiple)', 'kg', 4.0000, 5.00, 'material', false, 3),
  ('Chit bituminos', 'Chit bitum filerizat (celochit)', 'kg', 2.0000, 6.50, 'material', false, 4),
  ('Nisip protecție', 'Nisip fin fixat în stratul de protecție', 'kg', 6.0000, 0.25, 'material', false, 5),
  ('Manoperă hidroizolație', 'Execuție hidroizolație la rece (pânză + straturi bitum)', 'mp', 1.0000, 32.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 107.60,
  material_price = 64.60,
  labor_price = 35.00,
  transport_price = 8.00,
  updated_at = NOW()
WHERE symbol = 'IZF08A';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF08A')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Pânză bitumată', 'Pânză bitumată petice (incl. suprapuneri)', 'mp', 0.6000, 12.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum tip H 80/90', 'kg', 1.0000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj local', 'l', 0.1000, 9.00, 'material', false, 3),
  ('Guler + ștuț', 'Guler și ștuț din tablă plumb 2mm (D 50–100)', 'buc', 1.0000, 45.00, 'material', false, 4),
  ('Accesorii', 'Fixare și etanșare', 'buc', 1.0000, 5.00, 'material', false, 5),
  ('Manoperă hidroizolație', 'Hidroizolare gură scurgere', 'buc', 1.0000, 35.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 8.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 117.60,
  material_price = 74.60,
  labor_price = 35.00,
  transport_price = 8.00,
  updated_at = NOW()
WHERE symbol = 'IZF08B';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF08B')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Pânză bitumată', 'Pânză bitumată petice (incl. suprapuneri)', 'mp', 0.6000, 12.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum tip H 80/90', 'kg', 1.0000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj local', 'l', 0.1000, 9.00, 'material', false, 3),
  ('Guler + ștuț', 'Guler și ștuț din tablă plumb 2mm (D 150)', 'buc', 1.0000, 55.00, 'material', false, 4),
  ('Accesorii', 'Fixare și etanșare', 'buc', 1.0000, 5.00, 'material', false, 5),
  ('Manoperă hidroizolație', 'Hidroizolare gură scurgere', 'buc', 1.0000, 35.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 8.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 127.60,
  material_price = 84.60,
  labor_price = 35.00,
  transport_price = 8.00,
  updated_at = NOW()
WHERE symbol = 'IZF08C';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF08C')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Pânză bitumată', 'Pânză bitumată petice (incl. suprapuneri)', 'mp', 0.6000, 12.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum tip H 80/90', 'kg', 1.0000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj local', 'l', 0.1000, 9.00, 'material', false, 3),
  ('Guler + ștuț', 'Guler și ștuț din tablă plumb 2mm (D 200)', 'buc', 1.0000, 65.00, 'material', false, 4),
  ('Accesorii', 'Fixare și etanșare', 'buc', 1.0000, 5.00, 'material', false, 5),
  ('Manoperă hidroizolație', 'Hidroizolare gură scurgere', 'buc', 1.0000, 35.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 8.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 117.60,
  material_price = 74.60,
  labor_price = 35.00,
  transport_price = 8.00,
  updated_at = NOW()
WHERE symbol = 'IZF08D';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF08D')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Pânză bitumată', 'Pânză bitumată petice (incl. suprapuneri)', 'mp', 0.6000, 12.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum tip H 80/90', 'kg', 1.0000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj local', 'l', 0.1000, 9.00, 'material', false, 3),
  ('Guler + ștuț', 'Guler și ștuț din tablă plumb 2mm (D 150)', 'buc', 1.0000, 55.00, 'material', false, 4),
  ('Accesorii', 'Fixare și etanșare', 'buc', 1.0000, 5.00, 'material', false, 5),
  ('Manoperă hidroizolație', 'Hidroizolare gură scurgere', 'buc', 1.0000, 35.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 8.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 102.60,
  material_price = 59.60,
  labor_price = 35.00,
  transport_price = 8.00,
  updated_at = NOW()
WHERE symbol = 'IZF08E';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF08E')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Pânză bitumată', 'Pânză bitumată petice (incl. suprapuneri)', 'mp', 0.6000, 12.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum tip H 80/90', 'kg', 1.0000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj local', 'l', 0.1000, 9.00, 'material', false, 3),
  ('Guler + ștuț', 'Guler și ștuț (pe sifon pardoseală)', 'buc', 1.0000, 40.00, 'material', false, 4),
  ('Accesorii', 'Fixare și etanșare', 'buc', 1.0000, 5.00, 'material', false, 5),
  ('Manoperă hidroizolație', 'Hidroizolare gură scurgere', 'buc', 1.0000, 35.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'buc', 1.0000, 8.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'buc', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 85.65,
  material_price = 55.65,
  labor_price = 28.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF10B';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF10B')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren termoizolație (incl. pierderi)', 'mp', 1.0500, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 2.5000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 3),
  ('Strat separație', 'Folie/carton separație (după caz)', 'mp', 1.0000, 3.00, 'material', false, 4),
  ('Manoperă termoizolație', 'Montaj strat termoizolator (pante până la 40%)', 'mp', 1.0000, 28.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 89.65,
  material_price = 55.65,
  labor_price = 32.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF10C';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF10C')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren termoizolație (incl. pierderi)', 'mp', 1.0500, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 2.5000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 3),
  ('Strat separație', 'Folie/carton separație (după caz)', 'mp', 1.0000, 3.00, 'material', false, 4),
  ('Manoperă termoizolație', 'Montaj strat termoizolator (pante > 40% / vertical)', 'mp', 1.0000, 32.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 90.80,
  material_price = 60.80,
  labor_price = 28.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF10F';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF10F')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci vată minerală', 'Plăci vată minerală termoizolație (incl. pierderi)', 'mp', 1.0500, 35.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 2.5000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 3),
  ('Strat separație', 'Folie/carton separație (după caz)', 'mp', 1.0000, 3.00, 'material', false, 4),
  ('Manoperă termoizolație', 'Montaj strat termoizolator (pante până la 40%)', 'mp', 1.0000, 28.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 94.80,
  material_price = 60.80,
  labor_price = 32.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF10G';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF10G')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci vată minerală', 'Plăci vată minerală termoizolație (incl. pierderi)', 'mp', 1.0500, 35.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 2.5000, 6.50, 'material', false, 2),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 3),
  ('Strat separație', 'Folie/carton separație (după caz)', 'mp', 1.0000, 3.00, 'material', false, 4),
  ('Manoperă termoizolație', 'Montaj strat termoizolator (pante > 40% / vertical)', 'mp', 1.0000, 32.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 49.00,
  material_price = 29.00,
  labor_price = 18.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'RPCXE02A';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCXE02A')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 1),
  ('Carton bituminat', 'Carton bituminat (incl. suprapuneri)', 'mp', 1.1000, 10.00, 'material', false, 2),
  ('Bitum', 'Bitum topit pentru lipire', 'kg', 2.5000, 5.00, 'material', false, 3),
  ('Mastic bitum', 'Mastic/etanșare locală', 'kg', 0.5000, 6.50, 'material', false, 4),
  ('Manoperă hidroizolație', 'Aplicare hidroizolație cu carton bituminat', 'mp', 1.0000, 18.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 61.40,
  material_price = 37.40,
  labor_price = 22.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'RPCXE02B';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCXE02B')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 1),
  ('Pânză bitumată', 'Pânză bitumată (incl. suprapuneri)', 'mp', 1.2000, 12.00, 'material', false, 2),
  ('Bitum', 'Bitum topit (straturi multiple)', 'kg', 3.5000, 5.00, 'material', false, 3),
  ('Mastic bitum', 'Mastic/etanșare locală', 'kg', 0.5000, 6.50, 'material', false, 4),
  ('Manoperă hidroizolație', 'Aplicare hidroizolație cu pânză bitumată', 'mp', 1.0000, 22.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 42.25,
  material_price = 24.25,
  labor_price = 16.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'RPCXE02C';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCXE02C')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 1),
  ('Bitum', 'Bitum topit aplicat cu peria/gletuitor', 'kg', 4.0000, 5.00, 'material', false, 2),
  ('Filer', 'Umplutură/filer (după caz)', 'kg', 1.0000, 2.00, 'material', false, 3),
  ('Manoperă hidroizolație', 'Aplicare hidroizolație bitum', 'mp', 1.0000, 16.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 93.65,
  material_price = 60.65,
  labor_price = 30.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF12A';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12A')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren celular (1 strat, incl. pierderi)', 'mp', 1.0500, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 3.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1000, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.2000, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.1500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (pereți)', 'mp', 1.0000, 30.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 109.30,
  material_price = 74.30,
  labor_price = 32.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF12B';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12B')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (1 strat, incl. pierderi)', 'mp', 1.0500, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 3.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1000, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.2000, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.1500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (pereți)', 'mp', 1.0000, 32.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 154.05,
  material_price = 112.05,
  labor_price = 38.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZF12C';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12C')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren celular (2 straturi, incl. pierderi)', 'mp', 2.1000, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 5.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1500, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.3500, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (pereți)', 'mp', 1.0000, 38.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 214.45,
  material_price = 163.45,
  labor_price = 46.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IZF12D';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12D')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren celular (3 straturi, incl. pierderi)', 'mp', 3.1500, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 7.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.2000, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.5000, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (pereți)', 'mp', 1.0000, 46.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 183.35,
  material_price = 139.35,
  labor_price = 40.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZF12E';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12E')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (2 straturi, incl. pierderi)', 'mp', 2.1000, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 5.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1500, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.3500, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (pereți)', 'mp', 1.0000, 40.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 257.40,
  material_price = 204.40,
  labor_price = 48.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IZF12F';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12F')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (3 straturi, incl. pierderi)', 'mp', 3.1500, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 7.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.2000, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.5000, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (pereți)', 'mp', 1.0000, 48.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.85,
  material_price = 64.85,
  labor_price = 28.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF12G';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12G')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren (pardoseală, incl. pierderi)', 'mp', 1.0500, 35.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 3.0000, 6.50, 'material', false, 2),
  ('Folie PE', 'Folie separație', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă perimetrală', 'm', 0.5000, 3.00, 'material', false, 4),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.2000, 25.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (pardoseală)', 'mp', 1.0000, 28.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 158.95,
  material_price = 118.95,
  labor_price = 36.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZF12H';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12H')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren (pardoseală, 2 straturi, incl. pierderi)', 'mp', 2.1000, 35.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 5.0000, 6.50, 'material', false, 2),
  ('Folie PE', 'Folie separație', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă perimetrală', 'm', 0.7000, 3.00, 'material', false, 4),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.3500, 25.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (pardoseală)', 'mp', 1.0000, 36.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 222.35,
  material_price = 173.35,
  labor_price = 44.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IZF12I';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12I')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren (pardoseală, 3 straturi, incl. pierderi)', 'mp', 3.1500, 35.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 7.0000, 6.50, 'material', false, 2),
  ('Folie PE', 'Folie separație', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă perimetrală', 'm', 1.0000, 3.00, 'material', false, 4),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.5000, 25.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (pardoseală)', 'mp', 1.0000, 44.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 108.35,
  material_price = 75.35,
  labor_price = 30.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF12J';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12J')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (pardoseală, 1 strat, incl. pierderi)', 'mp', 1.0500, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 3.0000, 6.50, 'material', false, 2),
  ('Folie PE', 'Folie separație', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă perimetrală', 'm', 0.5000, 3.00, 'material', false, 4),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.2000, 25.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (pardoseală)', 'mp', 1.0000, 30.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 181.95,
  material_price = 139.95,
  labor_price = 38.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZF12K';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12K')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (pardoseală, 2 straturi, incl. pierderi)', 'mp', 2.1000, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 5.0000, 6.50, 'material', false, 2),
  ('Folie PE', 'Folie separație', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă perimetrală', 'm', 0.7000, 3.00, 'material', false, 4),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.3500, 25.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (pardoseală)', 'mp', 1.0000, 38.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 255.85,
  material_price = 204.85,
  labor_price = 46.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IZF12L';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12L')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (pardoseală, 3 straturi, incl. pierderi)', 'mp', 3.1500, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 7.0000, 6.50, 'material', false, 2),
  ('Folie PE', 'Folie separație', 'mp', 1.0500, 2.00, 'material', false, 3),
  ('Bandă perimetrală', 'Bandă perimetrală', 'm', 1.0000, 3.00, 'material', false, 4),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.5000, 25.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (pardoseală)', 'mp', 1.0000, 46.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 102.39,
  material_price = 65.39,
  labor_price = 34.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF12M';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12M')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren celular (tavan, 1 strat, incl. pierderi)', 'mp', 1.0500, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 3.5000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1200, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.2500, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.1500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (tavan)', 'mp', 1.0000, 34.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 168.16,
  material_price = 120.16,
  labor_price = 44.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZF12N';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12N')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren celular (tavan, 2 straturi, incl. pierderi)', 'mp', 2.1000, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 6.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1800, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.4000, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (tavan)', 'mp', 1.0000, 44.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 230.68,
  material_price = 171.68,
  labor_price = 54.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IZF12O';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12O')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci polistiren', 'Plăci polistiren celular (tavan, 3 straturi, incl. pierderi)', 'mp', 3.1500, 32.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 8.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.2400, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.5500, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci polistiren (tavan)', 'mp', 1.0000, 54.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 118.04,
  material_price = 79.04,
  labor_price = 36.00,
  transport_price = 3.00,
  updated_at = NOW()
WHERE symbol = 'IZF12P';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12P')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (tavan, 1 strat, incl. pierderi)', 'mp', 1.0500, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 3.5000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1200, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.2500, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.1500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (tavan)', 'mp', 1.0000, 36.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 3.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 197.46,
  material_price = 147.46,
  labor_price = 46.00,
  transport_price = 4.00,
  updated_at = NOW()
WHERE symbol = 'IZF12Q';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12Q')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (tavan, 2 straturi, incl. pierderi)', 'mp', 2.1000, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 6.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.1800, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.4000, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2000, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (tavan)', 'mp', 1.0000, 46.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 4.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 273.63,
  material_price = 212.63,
  labor_price = 56.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'IZF12R';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF12R')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci plută', 'Plăci plută expandată (tavan, 3 straturi, incl. pierderi)', 'mp', 3.1500, 45.00, 'material', false, 1),
  ('Mastic bitum', 'Mastic bitum pentru lipire', 'kg', 8.0000, 6.50, 'material', false, 2),
  ('Sârmă zincată', 'Mustăți fixare', 'kg', 0.2400, 12.00, 'material', false, 3),
  ('Chit rosturi', 'Chituire/etanșare rosturi plăci', 'kg', 0.5500, 25.00, 'material', false, 4),
  ('Amorsă bituminoasă', 'Amorsaj suport', 'l', 0.2500, 9.00, 'material', false, 5),
  ('Manoperă termoizolație', 'Montaj plăci plută (tavan)', 'mp', 1.0000, 56.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 61.75,
  material_price = 37.75,
  labor_price = 22.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF14A';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF14A')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci vată minerală', 'Vată minerală (incl. pierderi)', 'mp', 1.0500, 26.00, 'material', false, 1),
  ('Prenadez', 'Adeziv contact pentru lipire', 'kg', 0.2500, 25.00, 'material', false, 2),
  ('Dibluri/agrafe', 'Fixări mecanice (după caz)', 'buc', 4.0000, 0.80, 'material', false, 3),
  ('Accesorii', 'Bandă/etanșări', 'mp', 1.0000, 1.00, 'material', false, 4),
  ('Manoperă fonoizolație', 'Montaj strat fonoizolant', 'mp', 1.0000, 22.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 54.46,
  material_price = 32.46,
  labor_price = 20.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF14B';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF14B')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci vată minerală', 'Vată minerală (incl. pierderi)', 'mp', 1.0500, 26.00, 'material', false, 1),
  ('Sârmă zincată', 'Sârmă susținere', 'kg', 0.0800, 12.00, 'material', false, 2),
  ('Dibluri/agrafe', 'Fixări mecanice (după caz)', 'buc', 4.0000, 0.80, 'material', false, 3),
  ('Accesorii', 'Bandă/etanșări', 'mp', 1.0000, 1.00, 'material', false, 4),
  ('Manoperă fonoizolație', 'Montaj strat fonoizolant', 'mp', 1.0000, 20.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 59.50,
  material_price = 33.50,
  labor_price = 24.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF14C';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF14C')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci vată minerală', 'Vată minerală (incl. pierderi)', 'mp', 1.0500, 26.00, 'material', false, 1),
  ('Sârmă zincată', 'Sârmă susținere', 'kg', 0.1000, 12.00, 'material', false, 2),
  ('Dibluri/agrafe', 'Fixări mecanice (după caz)', 'buc', 5.0000, 0.80, 'material', false, 3),
  ('Accesorii', 'Bandă/etanșări', 'mp', 1.0000, 1.00, 'material', false, 4),
  ('Manoperă fonoizolație', 'Montaj strat fonoizolant (tavan)', 'mp', 1.0000, 24.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 50.80,
  material_price = 30.80,
  labor_price = 18.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'IZF14D';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'IZF14D')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Plăci vată minerală', 'Vată minerală (incl. pierderi)', 'mp', 1.0500, 26.00, 'material', false, 1),
  ('Folie separație', 'Folie separație/protecție', 'mp', 1.0000, 2.50, 'material', false, 2),
  ('Accesorii', 'Bandă/etanșări', 'mp', 1.0000, 1.00, 'material', false, 3),
  ('Manoperă fonoizolație', 'Montaj strat fonoizolant (simplu așezat)', 'mp', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
