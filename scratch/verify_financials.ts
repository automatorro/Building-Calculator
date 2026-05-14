
import { calculateFinancials, Purchase } from '../utils/calculators/financials';
import { EstimateLine, ProjectSettings } from '../utils/calculators/estimate';

const settings: ProjectSettings = {
    profit: 15,
    regie: 10,
    tva: 19,
    taxe_manopera: 0
};

const lines: EstimateLine[] = [
    {
        id: 'line1',
        quantity: 10,
        unit_price: 100, // Direct unit cost
        custom_prices: {},
        excluded_resources: [],
        stage_name: 'Fundație',
        items: null
    }
];

// Initial state (No purchases)
const summary0 = calculateFinancials(lines, [], settings, 0);

console.log('--- Summary: No Purchases ---');
console.log('Total Budget (Spend Limit = Direct + Regie):', summary0.totalBudget); // Expected: 1100
console.log('Total Spent:', summary0.totalSpent); // Expected: 0
console.log('Remaining Budget:', summary0.remainingBudget); // Expected: 1100
console.log('Projected Margin:', summary0.projectedMargin); // Expected: Total Ofertat - Budget = 1265 - 1100 = 165
console.log('Net Profit:', summary0.netProfit); // Expected: Revenue (1265) - Spent (0) - (Budget - Spent) (1100) = 165

// Purchase state (1000 Lei including TVA 19%? Wait, financials uses total_amount directly)
// If purchase is 1000 Lei total, it reduces budget by 1000.
const purchases: Purchase[] = [
    {
        id: 'p1',
        project_id: 'test',
        stage_name: 'Fundație',
        name: 'Materiale',
        amount_total: 1000,
        date: '2026-05-14',
        category: 'Materiale'
    }
];

const summary1 = calculateFinancials(lines, purchases, settings, 0);

console.log('--- Summary: 1000 Lei Purchase ---');
console.log('Total Spent:', summary1.totalSpent); // Expected: 1000
console.log('Remaining Budget:', summary1.remainingBudget); // Expected: 1100 - 1000 = 100
console.log('Net Profit:', summary1.netProfit); // Expected: 1265 - 1000 - 100 = 165

if (summary1.totalSpent === 1000 && 
    summary1.remainingBudget === 100 && 
    summary1.netProfit === 165) {
    console.log('SUCCESS: Financials math is consistent.');
} else {
    console.log('FAILURE: Financials math mismatch.');
}
