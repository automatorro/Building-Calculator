-- ==========================================
-- PHASE 1: CORE CATALOG
-- ==========================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS normatives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    normative_id UUID REFERENCES normatives(id) ON DELETE SET NULL,
    code VARCHAR(100) NOT NULL,
    name TEXT NOT NULL,
    um VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES auth.users(id), -- NULL = public/seed data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- material, labor, equipment, transport
    name VARCHAR(255) NOT NULL,
    um VARCHAR(50) NOT NULL,
    quantity NUMERIC(15, 6) NOT NULL,
    default_price NUMERIC(15, 4) DEFAULT 0,
    waste_percent NUMERIC(5, 2) DEFAULT 0,
    user_id UUID REFERENCES auth.users(id), -- NULL = public/seed data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- SEED DATA FOR BUILDING CALCULATOR
-- Ruleaza acest script in Supabase SQL Editor
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
    stages JSONB DEFAULT '[]'::jsonb, -- Etapele proiectului (ex: ["Fundație", "Zidărie"])
    total_estimated_revenue NUMERIC(15, 4) DEFAULT 0, -- Venit estimat (vânzare)
    target_completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Magazine / Furnizori
CREATE TABLE IF NOT EXISTS shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Linii Deviz (Articolele selectate pentru un proiect)
CREATE TABLE IF NOT EXISTS estimate_lines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL, -- Facut optional pentru intrari manuale
    stage_name VARCHAR(255), -- Asocierea cu o etapa din proiect
    manual_name VARCHAR(255), -- Numele articolului daca este introdus manual
    manual_um VARCHAR(50),   -- UM daca este introdus manual
    quantity NUMERIC(15, 4) DEFAULT 0,
    manual_price NUMERIC(15, 4) DEFAULT 0,
    manual_labor_price NUMERIC(15, 4) DEFAULT 0,
    manual_equipment_price NUMERIC(15, 4) DEFAULT 0,
    manual_transport_price NUMERIC(15, 4) DEFAULT 0,
    resources_override JSONB DEFAULT '[]'::jsonb, -- map de resource_id -> full resource object local copy
    -- Dacă utilizatorul schimbă prețul generic pentru acest proiect specific
    custom_prices JSONB DEFAULT '{}'::jsonb, -- map de resource_id -> price
    -- Resursele dezactivate (opționale)
    excluded_resources UUID[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb, -- Informații suplimentare (ex: source: 'ocr', 'smart_link', etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Oferte Furnizori (Preturi comparative per resursa)
CREATE TABLE IF NOT EXISTS vendor_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    resource_id UUID, -- Referinta la o resursa din catalog sau o resursa manuala
    manual_resource_name VARCHAR(255), -- Daca resursa nu e in catalog
    unit_price NUMERIC(15, 4) NOT NULL,
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Achiziții (Input real de costuri)
CREATE TABLE IF NOT EXISTS purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    stage_name VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    amount_total NUMERIC(15, 4) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(100), -- Material, Manopera, Utilaj, Transport, Altele
    supplier_id UUID REFERENCES shops(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabel Șabloane de Proiect
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stages JSONB DEFAULT '[]'::jsonb,
    lines_snapshot JSONB DEFAULT '[]'::jsonb, -- Snapshot al liniilor de deviz (rețete complete)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE normatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
DO $$ 
BEGIN
    -- Public Read for Catalog (Seed Data)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to categories') THEN
        CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to normatives') THEN
        CREATE POLICY "Allow public read access to normatives" ON normatives FOR SELECT USING (true);
    END IF;
    
    -- Items & Resources: Public Read if user_id is null, otherwise owner only
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to items') THEN
        CREATE POLICY "Allow read access to items" ON items FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner CRUD on items') THEN
        CREATE POLICY "Allow owner CRUD on items" ON items FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to resources') THEN
        CREATE POLICY "Allow read access to resources" ON resources FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner CRUD on resources') THEN
        CREATE POLICY "Allow owner CRUD on resources" ON resources FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Templates
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow owner CRUD on templates') THEN
        CREATE POLICY "Allow owner CRUD on templates" ON project_templates FOR ALL USING (auth.uid() = user_id);
    END IF;
    -- Projects
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to projects') THEN
        CREATE POLICY "Allow public access to projects" ON projects FOR ALL USING (true);
    END IF;

    -- Shops
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to shops') THEN
        CREATE POLICY "Allow public access to shops" ON shops FOR ALL USING (true);
    END IF;

    -- Estimate Lines
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to estimate_lines') THEN
        CREATE POLICY "Allow public access to estimate_lines" ON estimate_lines FOR ALL USING (true);
    END IF;

    -- Vendor Offers
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to vendor_offers') THEN
        CREATE POLICY "Allow public access to vendor_offers" ON vendor_offers FOR ALL USING (true);
    END IF;

    -- Purchases
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to purchases') THEN
        CREATE POLICY "Allow public access to purchases" ON purchases FOR ALL USING (true);
    END IF;
END $$;
