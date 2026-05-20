-- Sterge produsele sample fictive inserare in 049_dedeman_sample_products.sql
DELETE FROM public.dedeman_catalog
WHERE cod_produs IN (
  '5303020', '5303021', '5308010',
  '1204001', '1201010', '1205100',
  '3101005', '3102001',
  '4201010', '4203001',
  '6101001',
  '7201001',
  '8101001',
  '9101001',
  '2101001'
);
