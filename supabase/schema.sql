-- ==========================================
-- SEED DATA FOR BUILDING CALCULATOR
-- Ruleaza acest script in Supabase SQL Editor
-- DUPA ce ai rulat scriptul de creare a tabelelor.
-- ==========================================

-- 1. Inseram Categoriile (Pastram ID-urile in variabile pentru a le folosi mai jos)
DO $$
DECLARE
    cat_struct_id UUID;
    cat_arh_id UUID;
    norm_ts_id UUID;
    norm_rpc_id UUID;
    
    item_beton_id UUID;
    item_cofraj_id UUID;
    item_armatura_id UUID;
    item_zidarie_id UUID;
    item_tencuiala_id UUID;
BEGIN
    -- Inserare Categorii
    INSERT INTO categories (name, description) 
    VALUES ('Structură', 'Lucrări de rezistență, fundații, stâlpi, planșee')
    RETURNING id INTO cat_struct_id;

    INSERT INTO categories (name, description) 
    VALUES ('Arhitectură', 'Zidării, compartimentări, finisaje, izolații')
    RETURNING id INTO cat_arh_id;

    -- Inserare Normative
    INSERT INTO normatives (code, name, description) 
    VALUES ('Ts', 'Indicator Ts', 'Lucrări de terasamente')
    RETURNING id INTO norm_ts_id;

    INSERT INTO normatives (code, name, description) 
    VALUES ('Rpc', 'Indicator Rpc', 'Reparații și construcții')
    RETURNING id INTO norm_rpc_id;

    INSERT INTO normatives (code, name, description) 
    VALUES ('Cz', 'Indicator Cz', 'Construcții civile și industriale');
    -- (Nu retinem ID-ul pentru Cz deoarece folosim doar primele 2 in exemplul de jos)

    -- ==========================================
    -- Inserare Articole de Deviz (Items)
    -- ==========================================
    
    -- Articol 1: Turnare Beton
    INSERT INTO items (category_id, normative_id, code, name, um)
    VALUES (cat_struct_id, norm_ts_id, 'TsCA01C1', 'Turnare beton armat clasa C20/25 (B250) în fundații, continuu', 'mc')
    RETURNING id INTO item_beton_id;

    -- Articol 2: Cofraje
    INSERT INTO items (category_id, normative_id, code, name, um)
    VALUES (cat_struct_id, norm_ts_id, 'TsCB01A1', 'Cofraje din panouri de tego pentru fundații și grinzi de fundare', 'mp')
    RETURNING id INTO item_cofraj_id;

    -- Articol 3: Armătură
    INSERT INTO items (category_id, normative_id, code, name, um)
    VALUES (cat_struct_id, norm_ts_id, 'TsCC01A1', 'Fasonare și montare armătură din oțel BST500', 'kg')
    RETURNING id INTO item_armatura_id;

    -- Articol 4: Zidărie Cărămidă
    INSERT INTO items (category_id, normative_id, code, name, um)
    VALUES (cat_arh_id, norm_rpc_id, 'RpcCD01A', 'Zidărie din blocuri ceramice cu goluri, grosime 25 cm, mortar M50', 'mc')
    RETURNING id INTO item_zidarie_id;

    -- Articol 5: Tencuială
    INSERT INTO items (category_id, normative_id, code, name, um)
    VALUES (cat_arh_id, norm_rpc_id, 'RpcCF01A', 'Tencuieli interioare driscuite, aplicate manual, grosime 2.5 cm', 'mp')
    RETURNING id INTO item_tencuiala_id;


    -- ==========================================
    -- Inserare Resurse pentru fiecare Articol
    -- ==========================================

    -- Resurse pentru Turnare Beton (1 mc)
    INSERT INTO resources (item_id, type, name, um, quantity, default_price) VALUES
    (item_beton_id, 'material', 'Beton clasa C20/25', 'mc', 1.015, 450.00),
    (item_beton_id, 'material', 'Apă', 'mc', 0.05, 5.00),
    (item_beton_id, 'labor', 'Betonist', 'h', 1.20, 45.00),
    (item_beton_id, 'labor', 'Muncitor necalificat', 'h', 0.80, 25.00),
    (item_beton_id, 'equipment', 'Vibrator de beton', 'h', 0.40, 15.00);

    -- Resurse pentru Cofraje (1 mp)
    INSERT INTO resources (item_id, type, name, um, quantity, default_price) VALUES
    (item_cofraj_id, 'material', 'Panoutego 21mm (uzură 10%)', 'mp', 0.15, 120.00),
    (item_cofraj_id, 'material', 'Cuie construcții', 'kg', 0.10, 8.00),
    (item_cofraj_id, 'material', 'Rigle lemn/Dulapi', 'mc', 0.008, 1200.00),
    (item_cofraj_id, 'labor', 'Dulgher', 'h', 0.85, 45.00);

    -- Resurse pentru Armătură (1 kg)
    INSERT INTO resources (item_id, type, name, um, quantity, default_price) VALUES
    (item_armatura_id, 'material', 'Oțel beton BST 500', 'kg', 1.02, 4.20),
    (item_armatura_id, 'material', 'Sârmă neagră', 'kg', 0.015, 6.00),
    (item_armatura_id, 'labor', 'Fierar betonist', 'h', 0.08, 45.00);

    -- Resurse pentru Zidărie Cărămidă (1 mc)
    INSERT INTO resources (item_id, type, name, um, quantity, default_price) VALUES
    (item_zidarie_id, 'material', 'Cărămidă Porotherm 25', 'buc', 43.00, 7.50),
    (item_zidarie_id, 'material', 'Mortar zidărie M50 (la sac)', 'kg', 85.00, 0.40),
    (item_zidarie_id, 'material', 'Apă', 'mc', 0.15, 5.00),
    (item_zidarie_id, 'labor', 'Zidar', 'h', 3.50, 45.00),
    (item_zidarie_id, 'labor', 'Muncitor necalificat', 'h', 1.50, 25.00),
    (item_zidarie_id, 'equipment', 'Malaxor/Betonieră', 'h', 0.50, 20.00);

    -- Resurse pentru Tencuială (1 mp)
    INSERT INTO resources (item_id, type, name, um, quantity, default_price) VALUES
    (item_tencuiala_id, 'material', 'Mortar tencuială uscat', 'kg', 35.00, 0.45),
    (item_tencuiala_id, 'material', 'Apă', 'mc', 0.01, 5.00),
    (item_tencuiala_id, 'labor', 'Tencuitor', 'h', 0.65, 45.00),
    (item_tencuiala_id, 'labor', 'Muncitor necalificat', 'h', 0.25, 25.00);

END $$;
-- ==========================================
-- PHASE 2: PROJECTS & ESTIMATES
-- ==========================================

-- 1. Tabel Proiecte
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    -- Coeficienți stocați ca JSONB (profit, regie, tva, taxe_manopera)
    settings JSONB DEFAULT '{"profit": 5, "regie": 10, "tva": 21, "taxe_manopera": 2.25}'::jsonb,
    dimensions JSONB DEFAULT '{}'::jsonb, -- Dimensiunile casei pentru Smart Calculator
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Linii Deviz (Articolele selectate pentru un proiect)
CREATE TABLE IF NOT EXISTS estimate_lines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE RESTRICT,
    quantity NUMERIC(15, 4) DEFAULT 0,
    -- Dacă utilizatorul schimbă prețul generic pentru acest proiect specific
    custom_prices JSONB DEFAULT '{}'::jsonb, -- map de resource_id -> price
    -- Resursele dezactivate (opționale)
    excluded_resources UUID[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb, -- Informații suplimentare (ex: source: 'ocr', 'smart_calc', etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_lines ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Using DO blocks to avoid "already exists" errors)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to projects') THEN
        CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert to projects') THEN
        CREATE POLICY "Allow public insert to projects" ON projects FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update to projects') THEN
        CREATE POLICY "Allow public update to projects" ON projects FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to estimate_lines') THEN
        CREATE POLICY "Allow public read access to estimate_lines" ON estimate_lines FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert to estimate_lines') THEN
        CREATE POLICY "Allow public insert to estimate_lines" ON estimate_lines FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update to estimate_lines') THEN
        CREATE POLICY "Allow public update to estimate_lines" ON estimate_lines FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete to estimate_lines') THEN
        CREATE POLICY "Allow public delete to estimate_lines" ON estimate_lines FOR DELETE USING (true);
    END IF;
END $$;
