BEGIN;

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 185.00,
  material_price = 119.00,
  labor_price = 60.00,
  transport_price = 6.00,
  updated_at = NOW()
WHERE symbol = 'CvA01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Lemn ecarisat (incl. pierderi)', 'mc', 0.0550, 1600.00, 'material', false, 1),
  ('Scandura astereala', 'Scandura 24mm (inclusa)', 'mc', 0.0100, 1500.00, 'material', false, 2),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 8.00, 'material', false, 3),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2500, 20.00, 'material', false, 4),
  ('Tratament lemn', 'Impregnant lemn (dupa caz)', 'l', 0.2500, 12.00, 'material', false, 5),
  ('Manopera sarpanta', 'Montaj grinzi + capriori + astereala', 'mp', 1.0000, 60.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 6.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 210.00,
  material_price = 133.00,
  labor_price = 72.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CvA02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Lemn ecarisat (incl. pierderi)', 'mc', 0.0620, 1600.00, 'material', false, 1),
  ('Scandura astereala', 'Scandura 24mm (inclusa)', 'mc', 0.0120, 1500.00, 'material', false, 2),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 9.00, 'material', false, 3),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.3000, 20.00, 'material', false, 4),
  ('Tratament lemn', 'Impregnant lemn (dupa caz)', 'l', 0.3000, 12.00, 'material', false, 5),
  ('Manopera sarpanta', 'Montaj sarpanta (4 pante) + astereala', 'mp', 1.0000, 72.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 155.00,
  material_price = 95.00,
  labor_price = 55.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE17A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE17A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Lemn ecarisat pentru capriori + pane', 'mc', 0.0500, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 7.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2200, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn (dupa caz)', 'l', 0.2000, 12.00, 'material', false, 4),
  ('Manopera sarpanta', 'Montaj sarpanta', 'mp', 1.0000, 55.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 175.00,
  material_price = 105.00,
  labor_price = 65.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE17B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE17B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Lemn ecarisat pentru sarpanta grea', 'mc', 0.0550, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 8.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2500, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn (dupa caz)', 'l', 0.2200, 12.00, 'material', false, 4),
  ('Manopera sarpanta', 'Montaj sarpanta (invelitori grele)', 'mp', 1.0000, 65.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 82.00,
  labor_price = 58.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'RPCH01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCH01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Elemente lemn pentru reparatii (incl. pierderi)', 'mc', 0.0450, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 6.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2000, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn', 'l', 0.2000, 12.00, 'material', false, 4),
  ('Manopera reparatii', 'Montaj sarpanta - reparatii', 'mp', 1.0000, 58.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 160.00,
  material_price = 92.00,
  labor_price = 63.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'RPCH01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCH01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Elemente lemn pentru reparatii (incl. pierderi)', 'mc', 0.0500, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 7.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2200, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn', 'l', 0.2200, 12.00, 'material', false, 4),
  ('Manopera reparatii', 'Montaj sarpanta - reparatii (invelitori grele)', 'mp', 1.0000, 63.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 150.00,
  material_price = 88.00,
  labor_price = 57.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'RPCH02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCH02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Completari lemn pentru reparatii', 'mc', 0.0480, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 6.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2000, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn', 'l', 0.2000, 12.00, 'material', false, 4),
  ('Manopera reparatii', 'Reparatii sarpanta (completari pane/capriori)', 'mp', 1.0000, 57.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 165.00,
  material_price = 96.00,
  labor_price = 64.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'RPCH02C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCH02C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Completari lemn pentru reparatii (invelitori grele)', 'mc', 0.0520, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 7.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2200, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn', 'l', 0.2200, 12.00, 'material', false, 4),
  ('Manopera reparatii', 'Reparatii sarpanta (invelitori grele)', 'mp', 1.0000, 64.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 155.00,
  material_price = 90.00,
  labor_price = 60.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'RPCH03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCH03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Completari/ranforsari lemn', 'mc', 0.0500, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 6.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2200, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn', 'l', 0.2200, 12.00, 'material', false, 4),
  ('Manopera reparatii', 'Ranforsari sarpanta', 'mp', 1.0000, 60.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 170.00,
  material_price = 98.00,
  labor_price = 67.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'RPCH03B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'RPCH03B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Lemn sarpanta', 'Completari/ranforsari lemn (invelitori grele)', 'mc', 0.0540, 1600.00, 'material', false, 1),
  ('Conectori metalici', 'Coltare/placute/prinderi', 'mp', 1.0000, 7.00, 'material', false, 2),
  ('Cuie + suruburi', 'Elemente de fixare', 'kg', 0.2400, 20.00, 'material', false, 3),
  ('Tratament lemn', 'Impregnant lemn', 'l', 0.2400, 12.00, 'material', false, 4),
  ('Manopera reparatii', 'Ranforsari sarpanta (invelitori grele)', 'mp', 1.0000, 67.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 78.00,
  material_price = 52.00,
  labor_price = 24.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CE18A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE18A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Scandura astereala', 'Scandura 24mm (incl. pierderi)', 'mc', 0.0300, 1500.00, 'material', false, 1),
  ('Cuie', 'Cuie pentru scandura', 'kg', 0.1200, 20.00, 'material', false, 2),
  ('Tratament lemn', 'Impregnant lemn (dupa caz)', 'l', 0.1200, 12.00, 'material', false, 3),
  ('Manopera astereala', 'Montaj scandura astereala', 'mp', 1.0000, 24.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 72.00,
  material_price = 50.00,
  labor_price = 20.00,
  transport_price = 2.00,
  updated_at = NOW()
WHERE symbol = 'CE18B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE18B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Placi OSB', 'Placi OSB 18mm (incl. pierderi)', 'mp', 1.0500, 40.00, 'material', false, 1),
  ('Suruburi', 'Suruburi pentru OSB', 'mp', 1.0000, 3.00, 'material', false, 2),
  ('Manopera astereala', 'Montaj placi OSB', 'mp', 1.0000, 20.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 2.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 145.00,
  material_price = 98.00,
  labor_price = 42.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CvA03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tigla ceramica', 'Tigla ceramica (incl. pierderi)', 'mp', 1.1200, 58.00, 'material', false, 1),
  ('Carton bitumat', 'Carton bitumat sub tigla', 'mp', 1.1000, 6.00, 'material', false, 2),
  ('Sipci + contra-sipci', 'Sipci/contra-sipci pentru montaj', 'mp', 1.0000, 10.00, 'material', false, 3),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 9.00, 'material', false, 4),
  ('Elemente fixare', 'Cleme/cuie', 'mp', 1.0000, 3.00, 'material', false, 5),
  ('Manopera tigla', 'Montaj invelitoare tigla', 'mp', 1.0000, 42.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 150.00,
  material_price = 100.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tigla profilata', 'Tigla profilata din argila arsa (incl. pierderi)', 'mp', 1.1200, 60.00, 'material', false, 1),
  ('Sipci + contra-sipci', 'Sipci/contra-sipci pentru montaj', 'mp', 1.0000, 10.00, 'material', false, 2),
  ('Folie anticondens', 'Folie sub invelitoare', 'mp', 1.0500, 4.00, 'material', false, 3),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 12.00, 'material', false, 4),
  ('Elemente fixare', 'Cleme/cuie', 'mp', 1.0000, 3.80, 'material', false, 5),
  ('Manopera tigla', 'Montaj invelitoare tigla profilata', 'mp', 1.0000, 45.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 155.00,
  material_price = 105.00,
  labor_price = 45.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tigla solzi', 'Tigla solzi din argila arsa (incl. pierderi)', 'mp', 1.1500, 62.00, 'material', false, 1),
  ('Sipci + contra-sipci', 'Sipci/contra-sipci pentru montaj', 'mp', 1.0000, 11.00, 'material', false, 2),
  ('Folie anticondens', 'Folie sub invelitoare', 'mp', 1.0500, 4.00, 'material', false, 3),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 13.00, 'material', false, 4),
  ('Elemente fixare', 'Cleme/cuie', 'mp', 1.0000, 4.00, 'material', false, 5),
  ('Manopera tigla', 'Montaj invelitoare tigla solzi', 'mp', 1.0000, 45.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 170.00,
  material_price = 115.00,
  labor_price = 50.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE02B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE02B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tigla solzi dublu', 'Tigla solzi, montaj dublu (incl. pierderi)', 'mp', 1.1800, 65.00, 'material', false, 1),
  ('Sipci + contra-sipci', 'Sipci/contra-sipci pentru montaj', 'mp', 1.0000, 12.00, 'material', false, 2),
  ('Folie anticondens', 'Folie sub invelitoare', 'mp', 1.0500, 4.00, 'material', false, 3),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 15.00, 'material', false, 4),
  ('Elemente fixare', 'Cleme/cuie', 'mp', 1.0000, 4.30, 'material', false, 5),
  ('Manopera tigla', 'Montaj invelitoare tigla solzi dublu', 'mp', 1.0000, 50.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 22.00,
  material_price = 6.00,
  labor_price = 15.00,
  transport_price = 1.00,
  updated_at = NOW()
WHERE symbol = 'CE12A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE12A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Mortar rostuire', 'Mortar/ciment pentru rostuire', 'kg', 2.5000, 0.80, 'material', false, 1),
  ('Apa + aditivi', 'Consumuri auxiliare', 'mp', 1.0000, 4.00, 'material', false, 2),
  ('Manopera rostuire', 'Rostuire tigle in pod', 'mp', 1.0000, 15.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 1.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 175.00,
  material_price = 120.00,
  labor_price = 50.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Olane presa', 'Olane din argila arsa (incl. pierderi)', 'mp', 1.1800, 62.00, 'material', false, 1),
  ('Carton bitumateriale', 'Strat carton bitumat suport', 'mp', 1.0500, 6.00, 'material', false, 2),
  ('Mastic bitum', 'Mastic pentru lipire petreceri', 'kg', 0.8000, 10.00, 'material', false, 3),
  ('Sipci', 'Sipci suport (dupa caz)', 'mp', 1.0000, 12.00, 'material', false, 4),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 16.00, 'material', false, 5),
  ('Manopera olane', 'Montaj invelitoare olane', 'mp', 1.0000, 50.00, 'manopera', false, 6),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 7),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 55.00,
  labor_price = 35.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CvA03B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA03B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tabla ondulata', 'Tabla otel galvanizat (incl. pierderi)', 'mp', 1.0800, 38.00, 'material', false, 1),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 8.00, 'material', false, 2),
  ('Suruburi', 'Suruburi autoforante cu garnitura', 'mp', 1.0000, 6.00, 'material', false, 3),
  ('Manopera tabla', 'Montaj invelitoare tabla ondulata', 'mp', 1.0000, 35.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 105.00,
  material_price = 65.00,
  labor_price = 35.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tabla profilata', 'Tabla zincata profilata (incl. pierderi)', 'mp', 1.0800, 42.00, 'material', false, 1),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 10.00, 'material', false, 2),
  ('Suruburi', 'Suruburi autoforante cu garnitura', 'mp', 1.0000, 9.64, 'material', false, 3),
  ('Manopera tabla', 'Montaj tabla profilata', 'mp', 1.0000, 35.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 110.00,
  material_price = 70.00,
  labor_price = 35.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE05B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE05B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tabla profilata', 'Tabla zincata profilata (incl. pierderi)', 'mp', 1.0800, 44.00, 'material', false, 1),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 10.00, 'material', false, 2),
  ('Elemente fixare', 'Suruburi/sisteme fixare', 'mp', 1.0000, 12.48, 'material', false, 3),
  ('Manopera tabla', 'Montaj tabla profilata', 'mp', 1.0000, 35.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 115.00,
  material_price = 75.00,
  labor_price = 35.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE05D1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE05D1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Tabla profilata', 'Tabla zincata profilata (incl. pierderi)', 'mp', 1.0800, 46.00, 'material', false, 1),
  ('Accesorii', 'Coame/dolii/opriri (medie)', 'mp', 1.0000, 10.00, 'material', false, 2),
  ('Elemente fixare', 'Suruburi/nituri/sisteme fixare', 'mp', 1.0000, 15.32, 'material', false, 3),
  ('Manopera tabla', 'Montaj tabla profilata', 'mp', 1.0000, 35.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 165.00,
  material_price = 110.00,
  labor_price = 45.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'CvA04A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA04A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Membrana bituminoasa 4mm', 'Strat 1 (incl. pierderi)', 'mp', 1.0500, 25.00, 'material', false, 1),
  ('Membrana bituminoasa 4mm', 'Strat 2 (incl. pierderi)', 'mp', 1.0500, 25.00, 'material', false, 2),
  ('Amorsa bituminoasa', 'Amorsa suport', 'l', 0.2500, 18.00, 'material', false, 3),
  ('Gaz + accesorii', 'Consum gaz/arzator (medie)', 'mp', 1.0000, 3.00, 'material', false, 4),
  ('Manopera membrane', 'Montaj membrane bituminoase (2 straturi)', 'mp', 1.0000, 45.00, 'manopera', false, 5),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 10.00, 'transport', false, 6),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 55.00,
  labor_price = 35.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CvA06A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA06A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Membrana bituminoasa 4mm', 'Membrana bituminoasa (incl. pierderi)', 'mp', 1.0500, 25.00, 'material', false, 1),
  ('Amorsa bituminoasa', 'Amorsa suport', 'l', 0.2000, 18.00, 'material', false, 2),
  ('Gaz + accesorii', 'Consum gaz/arzator (medie)', 'mp', 1.0000, 2.15, 'material', false, 3),
  ('Manopera membrana', 'Montaj membrana bituminoasa', 'mp', 1.0000, 35.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'mp', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'mp', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 65.00,
  material_price = 42.00,
  labor_price = 18.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CvA05A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CvA05A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Jgheab PVC', 'Jgheab + accesorii prindere (incl. pierderi)', 'ml', 1.0000, 18.00, 'material', false, 1),
  ('Burlan PVC', 'Burlan + coturi + mufe (medie)', 'ml', 1.0000, 19.00, 'material', false, 2),
  ('Accesorii', 'Coliere, carlige, capace, imbinari', 'ml', 1.0000, 5.00, 'material', false, 3),
  ('Manopera montaj', 'Montaj jgheaburi si burlane PVC', 'ml', 1.0000, 18.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 5.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 85.00,
  material_price = 55.00,
  labor_price = 25.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE13A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE13A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Jgheab zincat', 'Jgheab semirotund D=15cm (incl. pierderi)', 'm', 1.0000, 42.00, 'material', false, 1),
  ('Accesorii', 'Carlige, capace, imbinari', 'm', 1.0000, 13.00, 'material', false, 2),
  ('Manopera montaj', 'Montaj jgheab zincat', 'm', 1.0000, 25.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 88.00,
  material_price = 58.00,
  labor_price = 25.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE13B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE13B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Jgheab zincat', 'Jgheab dreptunghiular 8x14 (incl. pierderi)', 'm', 1.0000, 44.00, 'material', false, 1),
  ('Accesorii', 'Carlige, capace, imbinari', 'm', 1.0000, 14.00, 'material', false, 2),
  ('Manopera montaj', 'Montaj jgheab zincat', 'm', 1.0000, 25.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 95.00,
  material_price = 62.00,
  labor_price = 28.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE14A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE14A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Burlan zincat', 'Burlan rotund D=15.4cm (incl. pierderi)', 'm', 1.0000, 46.00, 'material', false, 1),
  ('Accesorii', 'Coliere, coturi, piese racord', 'm', 1.0000, 16.00, 'material', false, 2),
  ('Manopera montaj', 'Montaj burlan zincat', 'm', 1.0000, 28.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 98.00,
  material_price = 65.00,
  labor_price = 28.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE14B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE14B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Burlan zincat', 'Burlan dreptunghiular 10x14 (incl. pierderi)', 'm', 1.0000, 48.00, 'material', false, 1),
  ('Accesorii', 'Coliere, coturi, piese racord', 'm', 1.0000, 17.00, 'material', false, 2),
  ('Manopera montaj', 'Montaj burlan zincat', 'm', 1.0000, 28.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 92.00,
  material_price = 60.00,
  labor_price = 27.00,
  transport_price = 5.00,
  updated_at = NOW()
WHERE symbol = 'CE14C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CE14C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Burlan zincat', 'Burlan rotund (fabricat) (incl. pierderi)', 'm', 1.0000, 45.00, 'material', false, 1),
  ('Accesorii', 'Coliere, coturi, piese racord', 'm', 1.0000, 15.00, 'material', false, 2),
  ('Manopera montaj', 'Montaj burlan zincat', 'm', 1.0000, 27.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'm', 1.0000, 5.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'm', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 320.00,
  material_price = 190.00,
  labor_price = 120.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'CsA01A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CsA01A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Sistem cos fum ceramic', 'Tub ceramic + manta + vata (kit) (incl. pierderi)', 'ml', 1.0000, 180.00, 'material', false, 1),
  ('Mortar special', 'Mortar refractar/adeziv pentru cos', 'kg', 8.0000, 2.50, 'material', false, 2),
  ('Accesorii', 'Usita vizitare, palarie, elemente racord', 'ml', 1.0000, 10.00, 'material', false, 3),
  ('Manopera cos fum', 'Montaj cos fum ceramic', 'ml', 1.0000, 120.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 10.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 260.00,
  material_price = 150.00,
  labor_price = 100.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'CsA01B1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CsA01B1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Sistem cos fum inox', 'Tubulatura inox izolata + accesorii (incl. pierderi)', 'ml', 1.0000, 140.00, 'material', false, 1),
  ('Accesorii', 'Coliere, suporti, piese racord', 'ml', 1.0000, 10.00, 'material', false, 2),
  ('Manopera cos fum', 'Montaj cos fum inox', 'ml', 1.0000, 100.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 10.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 285.00,
  material_price = 165.00,
  labor_price = 110.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'CsA01C1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CsA01C1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Sistem cos fum ceramic', 'Tub ceramic + manta + vata (kit) (incl. pierderi)', 'ml', 1.0000, 150.00, 'material', false, 1),
  ('Mortar special', 'Mortar refractar/adeziv pentru cos', 'kg', 9.0000, 2.50, 'material', false, 2),
  ('Accesorii', 'Usita vizitare, palarie, elemente racord', 'ml', 1.0000, 12.50, 'material', false, 3),
  ('Manopera cos fum', 'Montaj cos fum ceramic', 'ml', 1.0000, 110.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 10.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 240.00,
  material_price = 150.00,
  labor_price = 80.00,
  transport_price = 10.00,
  updated_at = NOW()
WHERE symbol = 'CsA02A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CsA02A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Sistem cos fum inox', 'Tubulatura inox izolata + accesorii', 'ml', 1.0000, 135.00, 'material', false, 1),
  ('Accesorii', 'Coliere, suporti, piese racord', 'ml', 1.0000, 15.00, 'material', false, 2),
  ('Manopera cos fum', 'Montaj cos fum inox', 'ml', 1.0000, 80.00, 'manopera', false, 3),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 10.00, 'transport', false, 4),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

UPDATE catalog_norms SET
  has_components = true,
  unit_price = 520.00,
  material_price = 360.00,
  labor_price = 140.00,
  transport_price = 20.00,
  updated_at = NOW()
WHERE symbol = 'CsA03A1';

WITH n AS (SELECT id FROM catalog_norms WHERE symbol = 'CsA03A1')
INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)
SELECT n.id, v.*
FROM n
CROSS JOIN (VALUES
  ('Sistem cos fum ceramic', 'Tub ceramic + manta + vata (kit) (incl. pierderi)', 'ml', 1.0000, 320.00, 'material', false, 1),
  ('Mortar special', 'Mortar refractar/adeziv pentru cos', 'kg', 12.0000, 2.50, 'material', false, 2),
  ('Accesorii', 'Usita vizitare, palarie, elemente racord', 'ml', 1.0000, 10.00, 'material', false, 3),
  ('Manopera cos fum', 'Montaj cos fum ceramic (diametru mare)', 'ml', 1.0000, 140.00, 'manopera', false, 4),
  ('Transport materiale', 'Transport aprovizionare', 'ml', 1.0000, 20.00, 'transport', false, 5),
  ('Consumabile/protecții', 'Folie, bandă, curățenie', 'ml', 1.0000, 12.00, 'material', true, 99)
) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);

COMMIT;
