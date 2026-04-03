const settings = { profit: 5, regie: 10, tva: 21, taxe_manopera: 2.25 };

function calculateLineCosts(line, settings) {
  let directMaterial = line.manual_price || 0
  let directLabor = line.manual_labor_price || 0
  let directEquipment = line.manual_equipment_price || 0
  let directTransport = line.manual_transport_price || 0

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
    totalWithTVA,
    regieAmount,
    profitAmount,
    tvaAmount
  }
}

const line1 = { 
  quantity: 1, 
  manual_price: 1, 
  manual_labor_price: 0, 
  manual_equipment_price: 0, 
  manual_transport_price: 0 
};

console.log("TEST STRING 1");
console.log(calculateLineCosts(line1, settings));

const lineString = { 
  quantity: 1, 
  manual_price: "1", 
  manual_labor_price: 0, 
  manual_equipment_price: 0, 
  manual_transport_price: 0 
};
console.log("TEST STRING CONCATENATION");
console.log(calculateLineCosts(lineString, settings));

const lineStringBlank = { 
  quantity: 1, 
  manual_price: "1", 
  manual_labor_price: "", 
  manual_equipment_price: "", 
  manual_transport_price: "" 
};
console.log("TEST STRING CONCATENATION WITH BLANKS");
console.log(calculateLineCosts(lineStringBlank, settings));
