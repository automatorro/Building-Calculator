-- DB Schema for Building Calculator
-- Execute this in the Supabase SQL Editor

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  house_type TEXT NOT NULL, -- e.g., 'casa', 'bloc'
  surface_area NUMERIC NOT NULL,
  levels INTEGER NOT NULL,
  structure_type TEXT NOT NULL, -- e.g., 'beton', 'lemn', 'metalica'
  roof_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Estimations Table
CREATE TABLE IF NOT EXISTS estimations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  total_cost NUMERIC,
  foundation_cost NUMERIC,
  structure_cost NUMERIC,
  masonry_cost NUMERIC,
  roof_cost NUMERIC,
  installations_cost NUMERIC,
  finishes_cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Materials Table (Catalog)
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'structura', 'zidarie'
  unit TEXT NOT NULL, -- e.g., 'mp', 'mc', 'kg', 'buc'
  default_price NUMERIC NOT NULL
);

-- 4. Project Materials (Calculated quantities)
CREATE TABLE IF NOT EXISTS project_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id),
  quantity NUMERIC NOT NULL,
  estimated_cost NUMERIC NOT NULL,
  category TEXT NOT NULL 
);

-- 5. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_info TEXT,
  rating NUMERIC
);

-- 6. Prices Table (Supplier prices for materials)
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Offers Table (From contractors)
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  contractor_name TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  foundation_amount NUMERIC,
  structure_amount NUMERIC,
  status TEXT DEFAULT 'pending', -- 'subevaluat', 'supraevaluat', 'realist'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. OCR Data Table
CREATE TABLE IF NOT EXISTS ocr_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  extracted_tables JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert some default materials for testing
INSERT INTO materials (name, category, unit, default_price) VALUES
('Beton B250', 'fundatie', 'mc', 350),
('Fier beton PC52', 'structura', 'kg', 4.5),
('BCA', 'zidarie', 'mc', 500),
('Caramida Porotherm', 'zidarie', 'mc', 600),
('Tigla metalica', 'acoperis', 'mp', 45),
('Lemn constructii', 'acoperis', 'mc', 900)
ON CONFLICT DO NOTHING;
