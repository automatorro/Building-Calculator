-- ============================================================
-- Migrare 001: Creare și populare tabel catalog_norms
-- Rulează manual în Supabase Dashboard → SQL Editor
-- ============================================================

-- Șterge tabela dacă există (re-creare curată)
DROP TABLE IF EXISTS catalog_norms CASCADE;

-- Creare tabel cu IDENTITY (modern PostgreSQL, funcționează sigur în Supabase)
CREATE TABLE catalog_norms (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  symbol VARCHAR(50) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit_price NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_catalog_norms_category ON catalog_norms(category);
CREATE INDEX IF NOT EXISTS idx_catalog_norms_symbol ON catalog_norms(symbol);
CREATE INDEX IF NOT EXISTS idx_catalog_norms_active ON catalog_norms(is_active);

-- RLS
ALTER TABLE catalog_norms ENABLE ROW LEVEL SECURITY;

-- Toți utilizatorii autentificați pot citi catalogul
CREATE POLICY "catalog_norms_read" ON catalog_norms
  FOR SELECT TO authenticated USING (is_active = true);

-- ============================================================
-- DATE SEED — norme tehnice românești de construcții
-- ============================================================

INSERT INTO catalog_norms (symbol, name, unit, category, unit_price) VALUES

-- TERASAMENTE (Ts)
('TsA01A1', 'Săpătură manuală în teren categoria I-II, la fundații cu adâncimea până la 0,6 m', 'mc', 'Terasamente', 85.00),
('TsA02A1', 'Săpătură cu excavatorul în teren categoria I-II, de la nivelul terenului natural', 'mc', 'Terasamente', 35.00),
('TsA06A1', 'Umplutură cu pământ bătut manual în straturi de 20 cm', 'mc', 'Terasamente', 65.00),
('TsA07A1', 'Umplutură cu piatră spartă, pietriș sau balast', 'mc', 'Terasamente', 120.00),
('TsB01A1', 'Nivelarea manuală a terenului', 'mp', 'Terasamente', 8.50),
('TsC01A1', 'Sprijiniri de maluri cu dulapi, pe 1 față, H ≤ 2 m', 'mp', 'Terasamente', 55.00),
('TsD01A1', 'Epuisment mecanic, pompe de mică capacitate (Q ≤ 3 mc/h)', 'ore', 'Terasamente', 45.00),

-- BETON SIMPLU ȘI ARMAT (Bc)
('BcA01A1', 'Beton simplu în fundații continue, B100 (C8/10)', 'mc', 'Beton', 580.00),
('BcA01B1', 'Beton simplu în fundații continue, B150 (C12/15)', 'mc', 'Beton', 620.00),
('BcA02A1', 'Beton armat în fundații izolate, C20/25 (B250)', 'mc', 'Beton', 950.00),
('BcA03A1', 'Beton armat în stâlpi, C25/30', 'mc', 'Beton', 1250.00),
('BcA04A1', 'Beton armat în grinzi, C20/25', 'mc', 'Beton', 1100.00),
('BcA05A1', 'Beton armat în planșee, C20/25, grosime 15 cm', 'mc', 'Beton', 1050.00),
('BcA06A1', 'Beton armat în pereți, C20/25, grosime 15-20 cm', 'mc', 'Beton', 1180.00),
('BcA07A1', 'Beton simplu pentru pardoseli, B100, grosime 10 cm', 'mp', 'Beton', 65.00),
('BcB01A1', 'Cofraje din panouri de placaj pentru fundații și grinzi de fundare', 'mp', 'Beton', 95.00),
('BcB02A1', 'Cofraje din panouri de placaj pentru stâlpi cu secțiunea dreptunghiulară', 'mp', 'Beton', 120.00),
('BcB03A1', 'Cofraje din panouri de placaj pentru grinzi', 'mp', 'Beton', 135.00),
('BcB04A1', 'Cofraje din panouri de placaj pentru planșee', 'mp', 'Beton', 115.00),
('BcC01A1', 'Armătură din bare OB37, d ≤ 12 mm, montare în fundații', 'kg', 'Beton', 8.50),
('BcC01B1', 'Armătură din bare PC52, d > 12 mm, montare în stâlpi și grinzi', 'kg', 'Beton', 9.20),
('BcC02A1', 'Plasă sudată STNB, montare în planșee', 'mp', 'Beton', 35.00),

-- ZIDĂRIE (Zd)
('ZdA01A1', 'Zidărie din cărămidă plină presată (CPlP), grosime 25 cm, mortar M10', 'mc', 'Zidărie', 680.00),
('ZdA01B1', 'Zidărie din cărămidă plină presată (CPlP), grosime 30 cm, mortar M10', 'mc', 'Zidărie', 690.00),
('ZdA02A1', 'Zidărie din blocuri BCA, grosime 25 cm, mortar M5', 'mc', 'Zidărie', 520.00),
('ZdA02B1', 'Zidărie din blocuri BCA, grosime 30 cm, mortar M5', 'mc', 'Zidărie', 530.00),
('ZdA03A1', 'Zidărie de umplutură din cărămidă eficientă, grosime 25 cm', 'mc', 'Zidărie', 650.00),
('ZdA04A1', 'Pereți despărțitori din cărămidă, grosime 12 cm, mortar M5', 'mp', 'Zidărie', 145.00),
('ZdA05A1', 'Pereți despărțitori din gips-carton 12.5 mm simplu, structură metalică', 'mp', 'Zidărie', 125.00),
('ZdA05B1', 'Pereți despărțitori din gips-carton dublu, structură metalică, cu vată minerală', 'mp', 'Zidărie', 185.00),
('ZdB01A1', 'Buiandrugi prefabricați din beton armat, până la L = 1,5 m', 'buc', 'Zidărie', 180.00),
('ZdB02A1', 'Centuri din beton armat, b = 25 cm, h = 25 cm', 'ml', 'Zidărie', 125.00),

-- ÎNVELITORI (Cv)
('CvA01A1', 'Șarpantă din lemn ecarisat, acoperișuri cu 2 pante, astereală inclusă', 'mp', 'Acoperiș', 185.00),
('CvA02A1', 'Șarpantă din lemn ecarisat, acoperișuri cu 4 pante, astereală inclusă', 'mp', 'Acoperiș', 210.00),
('CvA03A1', 'Învelitoare din țiglă ceramică pe astereală cu carton bitumat', 'mp', 'Acoperiș', 145.00),
('CvA03B1', 'Învelitoare din tablă ondulată din oțel galvanizat', 'mp', 'Acoperiș', 95.00),
('CvA04A1', 'Învelitoare din membrane bituminoase, sistem dublu strat', 'mp', 'Acoperiș', 165.00),
('CvA05A1', 'Jgheaburi și burlane din PVC, D = 100 mm', 'ml', 'Acoperiș', 65.00),
('CvA06A1', 'Hidroizolație terașe, membrană bituminoasă 4 mm', 'mp', 'Acoperiș', 95.00),

-- TENCUIELI (Tc)
('TcA01A1', 'Tencuială interioară drișcuită pe zidărie, grosime 2 cm', 'mp', 'Finisaje', 55.00),
('TcA01B1', 'Tencuială interioară drișcuită pe beton, grosime 1.5 cm', 'mp', 'Finisaje', 65.00),
('TcA02A1', 'Tencuială exterioară drișcuită pe zidărie, grosime 2.5 cm', 'mp', 'Finisaje', 95.00),
('TcA03A1', 'Gletuire cu glet de ipsos la interior, grosime 2 mm', 'mp', 'Finisaje', 35.00),
('TcA04A1', 'Tencuială decorativă silicatică, structurată, la exterior', 'mp', 'Finisaje', 85.00),
('TcB01A1', 'Placare cu gresie ceramică antiderapantă, dim. 30x30-60x60 cm', 'mp', 'Finisaje', 155.00),
('TcB02A1', 'Placare cu faianță ceramică, dim. 20x30-30x60 cm', 'mp', 'Finisaje', 145.00),
('TcB03A1', 'Pardoseală din parchet laminat 8 mm cu suport fonoizolant', 'mp', 'Finisaje', 145.00),
('TcB04A1', 'Pardoseală din parchet masiv de stejar, lăcuit în fabrică', 'mp', 'Finisaje', 285.00),
('TcB05A1', 'Șapă ciment M150 armată cu plasă, grosime 5 cm', 'mp', 'Finisaje', 75.00),
('TcB06A1', 'Șapă autonivelantă, grosime 4-6 cm', 'mp', 'Finisaje', 95.00),

-- ZUGRĂVELI ȘI VOPSITORII (Zg)
('ZgA01A1', 'Grunduire tavan și pereți, 1 strat', 'mp', 'Finisaje', 8.50),
('ZgA02A1', 'Vopsire lavabilă interior, 2 straturi, pe suprafețe grunduite', 'mp', 'Finisaje', 18.00),
('ZgA03A1', 'Vopsire exterioară fațade cu vopsea siliconică, 2 straturi', 'mp', 'Finisaje', 28.00),
('ZgA04A1', 'Vopsire tâmplărie lemn, grund + 2 straturi vopsea email', 'mp', 'Finisaje', 55.00),
('ZgA05A1', 'Vopsire anticorozivă tâmplărie metalică, 2 straturi', 'mp', 'Finisaje', 45.00),

-- TÂMPLĂRIE (Tm)
('TmA01A1', 'Montaj fereastră PVC cu geam termoizolant, până la 1,5 mp', 'buc', 'Tâmplărie', 180.00),
('TmA01B1', 'Montaj fereastră PVC cu geam termoizolant, 1.5-3 mp', 'buc', 'Tâmplărie', 220.00),
('TmA02A1', 'Montaj ușă interioară, tocul și canatul, dimensiuni standard', 'buc', 'Tâmplărie', 350.00),
('TmA03A1', 'Montaj ușă exterioară metalică cu geam, tocul inclus', 'buc', 'Tâmplărie', 650.00),
('TmA04A1', 'Montaj glafuri fereastră PVC, lățime 20 cm', 'ml', 'Tâmplărie', 45.00),
('TmA05A1', 'Montaj ușă garaj basculantă, suprafață până la 9 mp', 'buc', 'Tâmplărie', 950.00),

-- IZOLAȚII TERMICE (Iz)
('IzA01A1', 'Termoizolație fațade cu polistiren expandat 10 cm, sistem complet', 'mp', 'Izolații', 185.00),
('IzA01B1', 'Termoizolație fațade cu polistiren expandat 15 cm, sistem complet', 'mp', 'Izolații', 215.00),
('IzA02A1', 'Termoizolație planșee cu vată minerală bazaltică 10 cm', 'mp', 'Izolații', 95.00),
('IzA03A1', 'Termoizolație pod cu vată minerală suflată, grosime 20 cm', 'mp', 'Izolații', 75.00),
('IzA04A1', 'Hidroizolație fundații cu bitum aplicat la cald, 2 straturi', 'mp', 'Izolații', 55.00),
('IzA05A1', 'Fonoizolație pardoseli cu rogojini de vată minerală 3 cm', 'mp', 'Izolații', 45.00),

-- INSTALAȚII SANITARE (Is)
('IsA01A1', 'Instalație apă rece, țeavă PP Ø20 montată aparent/îngropat', 'ml', 'Sanitare', 55.00),
('IsA01B1', 'Instalație apă rece, țeavă PP Ø25 montată aparent/îngropat', 'ml', 'Sanitare', 65.00),
('IsA02A1', 'Instalație apă caldă, țeavă PP Ø20, cu izolație', 'ml', 'Sanitare', 75.00),
('IsA03A1', 'Canalizare, țeavă PVC Ø50 montată îngropat', 'ml', 'Sanitare', 55.00),
('IsA03B1', 'Canalizare, țeavă PVC Ø110 montată îngropat', 'ml', 'Sanitare', 75.00),
('IsB01A1', 'Montaj lavoar complet cu robineți, sifon, racorduri', 'buc', 'Sanitare', 450.00),
('IsB02A1', 'Montaj vas WC cu rezervor, complet echipat', 'buc', 'Sanitare', 550.00),
('IsB03A1', 'Montaj cadă de baie acrilică cu robineți și sifon', 'buc', 'Sanitare', 950.00),
('IsB04A1', 'Montaj cabină duș completă cu panou și robineti', 'buc', 'Sanitare', 1250.00),
('IsC01A1', 'Centrală termică în condensație, putere 24-32 kW, montaj complet', 'buc', 'Sanitare', 4500.00),
('IsC02A1', 'Radiatoare oțel tip 22, L = 1000 mm, montaj complet', 'buc', 'Sanitare', 450.00),
('IsC03A1', 'Instalație încălzire în pardoseală, țeavă PEX, complet', 'mp', 'Sanitare', 145.00),

-- INSTALAȚII ELECTRICE (Ie)
('IeA01A1', 'Instalație electrică, cablu CYY 3x1.5 mm², montaj în tuburi', 'ml', 'Electrice', 18.00),
('IeA01B1', 'Instalație electrică, cablu CYY 3x2.5 mm², montaj în tuburi', 'ml', 'Electrice', 22.00),
('IeA02A1', 'Priză simplă încastrată cu capac, montaj complet', 'buc', 'Electrice', 95.00),
('IeA03A1', 'Întrerupător simplu încastrat, montaj complet', 'buc', 'Electrice', 75.00),
('IeA04A1', 'Tablou electric echipat, 8 circuite, montaj complet', 'buc', 'Electrice', 1850.00),
('IeA05A1', 'Aparataj exterior (întreruptor, priză) cu protecție IP55', 'buc', 'Electrice', 145.00),
('IeB01A1', 'Corp iluminat LED suspendat, 40W, montaj și cablare', 'buc', 'Electrice', 285.00),
('IeB02A1', 'Spot încastrat LED 7W, montat în tavan gips-carton', 'buc', 'Electrice', 145.00),
('IeC01A1', 'Instalație paratrăsnet, tije captare cu coborâre și priză de pământ', 'corp', 'Electrice', 3500.00)

ON CONFLICT (symbol) DO NOTHING;
