Walkthrough - Phase 6: Cost & Cashflow Control Panel (MVP)
The application has been successfully pivoted from a material calculator into a Real-Time Cost & Cashflow Control Panel specifically designed for small developers.

New Financial Command Center
1. Real-Time Dashboard
The project view now opens directly to a financial dashboard that answers 4 critical questions in 5 seconds:

Cât am cheltuit?: Real-time total from all integrated purchases.
Cât mai am?: Remaining planned budget vs. actual spending.
Profit Estimat: Dynamic calculation of ROI based on "Revenue - Actual Costs - Planned Future Costs".
Status Buget: Visual indicators of project health (In Graphic vs. Overrun).
2. Purchase Entry (Registru Achiziții)
We've added an ultra-fast recording flow for on-site use:

Input a sum, pick a stage, and save.
Automatic Sync: Every purchase instantly updates the global project totals, stage deviations, and profit forecasts.
3. Smart Alerts & Forecast
Impact Alerts: The system detects if a stage (e.g., Foundation) has exceeded its planned budget and flags the specific impact on your final profit.
30-Day Forecast: Automatically identifies upcoming stages with zero spending and estimates the cash needed to cover them in the next month.
4. ROI Configuration
Developers can now set a "Total Estimated Revenue" for each project, allowing the app to track the Net Profit Margin as the construction progresses.

Technical Foundation
Financial Engine: A new centralized utility (
financials.ts
) that bridges the gap between the professional recipes (The Plan) and the purchases (The Reality).
Multi-View UI: Seamless switching between Dashboard (Control), Planning (Edit Recipes), and Purchases (Log).
Proof of Work
The project builds successfully with npm run build.

TIP

Use the "Achiziții Reale" tab to log every invoice on the spot. The dashboard will tell you immediately if that purchase is within your planned profit margin.