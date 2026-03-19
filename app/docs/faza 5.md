Phase 5: Professional Recipes & Live Customization
We have successfully transformed the "Building Calculator" into a professional-grade procurement and management tool. This phase focused on giving contractors complete control over the "recipe" of every work item and providing granular cost insights.

Professional Features Implemented
1. Granular Cost Breakdown
For manual entries and catalog items, costs are now categorized into four professional categories:

Material (Materiale)
Labor (Manoperă)
Equipment (Utilaje)
Transport (Transport)
This allows for precise budget tracking and vendor comparison beyond just a "total price."

2. Professional Recipe Editor
Within the 
EstimateEditor
, each line now features an expansion panel for deep customization:

Add/Delete Resources: Users can add new materials, labor hours, or equipment rentals to any task.
Resource Toggling: Easily exclude certain materials from a recipe to see how it affects the total cost (ideal for "what-if" scenarios).
Edit Normatives: Change consumption norms (e.g., how many kg of adhesive per m²) and units on the fly.
Material Swapping: Seamlessly update prices using the 
VendorOfferPicker
 to find the best deal.
3. Technological Waste Calculation
Materials now include a Waste % (Pierderi) field.

The system automatically calculates the required procurement quantity by applying the waste factor to the base consumption.
Different materials can have different waste profiles (e.g., 5% for tiles, 10% for polystyrene).
4. Live Recalculation Engine
Every change—whether it's adjusting a waste percentage, swapping a material, or deleting a labor resource—triggers an immediate, project-wide recalculation. Total project costs (Direct, Mark-up, and VAT) are updated in real-time.

Technical Improvements
Database Architecture: The estimate_lines table now supports resources_override (JSONB), ensuring that project-specific recipes are persistent and private to that project.
Build Stability: Fixed a TypeScript duplication error in 
SmartCalculator.tsx
 to ensure a stable production build.
Proof of Work
The project builds successfully with npm run build.

NOTE

The application is now ready for professional procurement workflows. Contractors can start comparing vendor offers and fine-tuning their material recipes for maximum profitability.