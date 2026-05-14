
import { calculateLineCosts, ProjectSettings, EstimateLine } from '../utils/calculators/estimate';

const settings: ProjectSettings = {
    profit: 15,
    regie: 10,
    tva: 19,
    taxe_manopera: 0
};

const line: EstimateLine = {
    id: 'test',
    quantity: 10,
    unit_price: 100, // Direct cost per unit
    custom_prices: {},
    excluded_resources: [],
    metadata: { resource_type: 'material' },
    items: null
};

const costs = calculateLineCosts(line, settings);

console.log('--- Test Calculation ---');
console.log('Quantity:', line.quantity);
console.log('Unit Price (Direct):', line.unit_price);
console.log('Total Direct Cost:', costs.totalDirectCost); // Expected: 1000
console.log('Regie Amount (10%):', costs.regieAmount); // Expected: 100
console.log('Profit Amount (15% of Direct+Regie):', costs.profitAmount); // Expected: (1000+100)*0.15 = 165
console.log('Total Ofertat (w/o TVA):', costs.totalOfertatWithoutTVA); // Expected: 1265
console.log('TVA Amount (19%):', costs.tvaAmount); // Expected: 1265 * 0.19 = 240.35
console.log('Total with TVA:', costs.totalWithTVA); // Expected: 1505.35

if (costs.totalDirectCost === 1000 && 
    costs.regieAmount === 100 && 
    costs.profitAmount === 165 && 
    costs.totalOfertatWithoutTVA === 1265) {
    console.log('SUCCESS: Core math is correct.');
} else {
    console.log('FAILURE: Math mismatch.');
}
