const settings_default = { profit: 5, regie: 10, tva: 21, taxe_manopera: 2.25 };

function calculateLineCosts(line, settings) {
  let directMaterial = line.manual_price || 0
  let directLabor = line.manual_labor_price || 0
  let directEquipment = line.manual_equipment_price || 0
  let directTransport = line.manual_transport_price || 0

  // The trap is here
  const unitDirectCost = directMaterial + directLabor + directEquipment + directTransport
  const totalDirectCost = unitDirectCost * line.quantity

  const regieAmount = totalDirectCost * (settings.regie / 100)
  const costWithRegie = totalDirectCost + regieAmount
  
  const profitAmount = costWithRegie * (settings.profit / 100)
  const totalOfertatWithoutTVA = costWithRegie + profitAmount
  
  const tvaAmount = totalOfertatWithoutTVA * (settings.tva / 100)
  const totalWithTVA = totalOfertatWithoutTVA + tvaAmount

  return {
    unitDirectCost,
    totalDirectCost,
    totalOfertatWithoutTVA,
    totalWithTVA
  }
}

console.log("--- SCENARIO 1: Pure Numbers (Direct Cost 1) ---");
console.log(calculateLineCosts({ quantity: 1, manual_price: 1, manual_labor_price: 0, manual_equipment_price: 0, manual_transport_price: 0 }, settings_default));

console.log("\n--- SCENARIO 2: String '1' (Concatenation Trap) ---");
const res2 = calculateLineCosts({ quantity: 1, manual_price: "1", manual_labor_price: 0, manual_equipment_price: 0, manual_transport_price: 0 }, settings_default);
console.log(res2);

console.log("\n--- SCENARIO 3: What if settings were 30% and 12%? ---");
const settings_custom = { profit: 12, regie: 30, tva: 21, taxe_manopera: 2.25 };
console.log(calculateLineCosts({ quantity: 1, manual_price: 1, manual_labor_price: 0, manual_equipment_price: 0, manual_transport_price: 0 }, settings_custom));

console.log("\n--- SCENARIO 4: The 1.456 Mystery ---");
// 1.456 / 1.155 (default coefficients) = 1.26...
// 1.456 / (1.1 * 1.05) = 1.26...
// Maybe something else is 26%?
