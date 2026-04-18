import * as fs from 'fs';

const norms = JSON.parse(fs.readFileSync('tmp/39_norms.json', 'utf8'));

let sql = `BEGIN;\n\n`;

for (const norm of norms) {
  let matPrice = 0;
  let labPrice = 0;
  let comps = [];

  // Determine basic recipe
  if (norm.symbol.startsWith('CN01')) {
    // Zugraveli lapte de var
    comps = [
       { name: 'Lapte de var / Colorant', unit: 'l', qty: 0.15, price: 15.00, type: 'material' },
       { name: 'Manoperă zugrav', unit: 'mp', qty: 1.0, price: 35.00, type: 'manopera' },
       { name: 'Schele/Unelte (diverse)', unit: 'lei', qty: 1.0, price: 2.00, type: 'utilaj' },
    ];
  } else if (norm.symbol.startsWith('CN04')) {
    // Vopsitorii lavabile/acetat
    comps = [
       { name: 'Vopsea lavabilă', unit: 'l', qty: 0.25, price: 25.00, type: 'material' },
       { name: 'Manoperă zugrav', unit: 'mp', qty: 1.0, price: 40.00, type: 'manopera' },
    ];
  } else if (norm.symbol.startsWith('CN13') || norm.symbol.startsWith('RPCR')) {
    // Vopsitorii ulei/email/conducte
    comps = [
       { name: 'Vopsea ulei / Email alchidic', unit: 'kg', qty: 0.20, price: 35.00, type: 'material' },
       { name: 'Diluant', unit: 'l', qty: 0.05, price: 18.00, type: 'material' },
       { name: 'Manoperă vopsitor', unit: norm.unit, qty: 1.0, price: 45.00, type: 'manopera' },
       { name: 'Consumabile (pensule/benzi)', unit: 'lei', qty: 1.0, price: 3.50, type: 'material', opt: true },
    ];
  } else if (norm.symbol.startsWith('CD')) {
    // Zidarie (cărămizi / piatră)
    const baseMat = norm.name.toLowerCase().includes('piatră') ? 'Piatră naturală/cioplită' : 'Cărămidă plină presată';
    const numBase = norm.name.toLowerCase().includes('piatră') ? 1.05 : 450;
    const baseP = norm.name.toLowerCase().includes('piatră') ? 180.00 : 1.20;
    const baseU = norm.name.toLowerCase().includes('piatră') ? 'mc' : 'buc';
    
    comps = [
       { name: baseMat, unit: baseU, qty: numBase, price: baseP, type: 'material' },
       { name: 'Mortar zidărie M10', unit: 'mc', qty: 0.25, price: 250.00, type: 'material' },
       { name: 'Manoperă zidar', unit: 'mc', qty: 1.0, price: 350.00, type: 'manopera' },
       { name: 'Malaxor / Macara (cotă parțială)', unit: 'ore', qty: 0.5, price: 80.00, type: 'utilaj' },
    ];
  } else {
    // Fallback just in case
    comps = [
       { name: 'Material generic', unit: norm.unit, qty: 1.0, price: 50.00, type: 'material' },
       { name: 'Manoperă generică', unit: norm.unit, qty: 1.0, price: 50.00, type: 'manopera' },
    ];
  }

  // Calc prices
  for (const c of comps) {
    const val = c.qty * c.price;
    if (c.type === 'manopera') labPrice += val;
    else if (c.type === 'material') matPrice += val;
  }
  const total = matPrice + labPrice + (comps.filter(c => c.type === 'utilaj' || c.type === 'transport').reduce((sum,c)=>sum+c.qty*c.price, 0));

  sql += `-- Recipe for ${norm.symbol} - ${norm.name.replace(/'/g, "''")}\n`;
  sql += `UPDATE catalog_norms SET\n`;
  sql += `  has_components = true,\n`;
  sql += `  unit_price = ${total.toFixed(2)},\n`;
  sql += `  material_price = ${matPrice.toFixed(2)},\n`;
  sql += `  labor_price = ${labPrice.toFixed(2)},\n`;
  sql += `  updated_at = NOW()\n`;
  sql += `WHERE symbol = '${norm.symbol}';\n\n`;

  sql += `WITH n AS (SELECT id FROM catalog_norms WHERE symbol = '${norm.symbol}')\n`;
  sql += `INSERT INTO norm_components (norm_id, name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order)\n`;
  sql += `SELECT n.id, v.*\n`;
  sql += `FROM n\n`;
  sql += `CROSS JOIN (VALUES\n`;
  
  const vals = comps.map((c, idx) => {
    return `  ('${c.name}', 'Calculat conform normativ estimativ 2026', '${c.unit}', ${c.qty.toFixed(4)}, ${c.price.toFixed(2)}, '${c.type}', ${c.opt ? 'true' : 'false'}, ${idx + 1})`;
  });
  
  sql += vals.join(',\n') + '\n';
  sql += `) AS v(name, specification, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order);\n\n`;
}

sql += `COMMIT;\n`;

fs.writeFileSync('supabase/migrations/033_missing_recipes.sql', sql);
console.log('Migration generated successfully');
