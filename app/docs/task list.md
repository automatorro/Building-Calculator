Task Checklist: Supabase Integration & Catalog Development
 Design Supabase Schema (Categories, Normatives, Items, Resources)
 Seed Supabase with mock data
 Create Supabase SSR client utilities
 Verify Supabase Connection
 Create 
.env.local
 with credentials (User action)
 Restart dev server to load environment variables
 Test /catalog page fetching data
 Build Construction Item Details
 Create dynamic route /catalog/item/[id] for detailed item view
 Display resource breakdown (Labor, Materials, Equipment)
 Implement cost calculation logic for items
 Verification & UI Polish
 Verify /catalog lists items correctly
 Verify /catalog/item/[id] shows correct resource breakdown
 Add loading skeletons for data fetching
 Implement search/filter for catalog items
 V2: Management Proiecte & Devize
 Planificare V2 (implementation_plan_v2.md)
 Structură DB: Proiecte, Linii Deviz (Optionality & Price Overrides)
 Interfață Dashboard & Creare Proiect
 Gestiune Detalii Proiect & Linii Deviz
 Mobile Optimization
 Audit & Fix Navigation Mobile UI
 Audit & Fix Catalog & Item Details Mobile View
 Audit & Fix Projects Dashboard & Creation Mobile UI
 Audit & Fix Interactive Estimate Editor for small screens
 Landing Page & General Polish
 Create premium Landing Page on home route
 V3: OCR & Smart Calculator
 Update Database Schema (OCR metadata & Project dimensions)
 Implement Smart Calculator UI for Project Dimensions
 Develop OCR Service (parsing reinforcement tables)
 Integration: Drag & Drop reinforcement table into estimate
 Smart Quantities: Automated calculation for Concrete, Formwork, Excavation
 V4: Professional Procurement & Comparative Analysis
 Update DB Schema (Shops & Vendor Offers)
 Implement Vendor/Shop Management UI
 Create Comparative Price Grid for Resources
 Implement "Cheapest Basket" logic
 Refactor Estimate Editor for Manual/Ad-hoc entries
 Add Direct Labor Cost inputs per stage