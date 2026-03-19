Implementation Plan - Phase 7: Personal Library & Project Templates
Enable users to build their own "Secret Sauce" library of construction norms and jumpstart projects using templates.

User Review Required
NOTE

Catalog Independence: Users can now add new items directly to the catalog. These will be linked to their user_id to keep their "competitive edge" private. Templates: We will implement a simplified "Clone Project as Template" feature.

Proposed Changes
1. Database Schema (
supabase/schema.sql
)
[MODIFY] items & resources tables:
Add user_id (nullable, NULL = public/seed data).
[NEW] project_templates table:
id
, user_id, name, description, stages (JSONB), lines (JSONB - snapshot of items/recipes).
2. Personal Library Management (app/catalog)
[MODIFY] app/catalog/page.tsx:
Add "Add New Item" button.
Show "My Items" vs "Public Library".
[NEW] components/ItemEditor.tsx:
A modal to create/edit master items and their default resource recipes.
3. "Save to Library" Logic
[MODIFY] components/EstimateEditor.tsx:
Add a "Save to Library" button on each estimate line.
Logic: Clones the estimate_line (with its resources_override) back into the items and resources tables with the current user's ID.
4. Project Templates
[MODIFY] app/projects/new/page.tsx:
Add a "Start from Template" section.
Logic: On creation, if a template is selected, auto-insert all estimate_lines from the template snapshot.
Verification Plan
Automated Tests
Validate that items with user_id are only visible to the owner.
Test the cloning logic from estimate_line to items.
Manual Verification
Open a project, customize a recipe (e.g., change price/materials).
Click "Save to Library".
Go to Catalog and verify the new item exists with the custom recipe.
Start a new project using a "Standard" template and verify all stages and items are gata (ready).
