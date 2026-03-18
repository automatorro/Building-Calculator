export interface EstimateLine {
  id: string
  quantity: number
  custom_prices: Record<string, number>
  excluded_resources: string[]
  metadata?: any
  stage_name?: string
  manual_name?: string
  manual_um?: string
  manual_price?: number
  manual_labor_price?: number
  manual_equipment_price?: number
  manual_transport_price?: number
  resources_override?: Resource[]
  items: {
    id: string
    code: string
    name: string
    um: string
    normatives: { code: string } | null
    resources?: Resource[]
  } | null
}

export interface Resource {
  id: string
  type: 'material' | 'labor' | 'equipment' | 'transport'
  name: string
  um: string
  consumption: number
  unit_price: number
  waste_percent?: number
}

export interface ProjectSettings {
  profit: number
  regie: number
  tva: number
  taxe_manopera: number
}

export function calculateLineCosts(line: EstimateLine, settings: ProjectSettings) {
  let directMaterial = 0
  let directLabor = 0
  let directEquipment = 0
  let directTransport = 0

  // 1. Determine which resources to use (Override vs Catalog)
  const resourcesToUse = line.resources_override && line.resources_override.length > 0
    ? line.resources_override
    : line.items?.resources || []

  if (resourcesToUse.length > 0) {
    resourcesToUse.forEach(res => {
      // Skip if excluded
      if (line.excluded_resources.includes(res.id)) return

      // Use custom price if available, otherwise default
      const price = line.custom_prices[res.id] ?? res.unit_price
      const wasteMultiplier = 1 + ((res.waste_percent || 0) / 100)
      const cost = res.consumption * price * wasteMultiplier

      if (res.type === 'material') directMaterial += cost
      else if (res.type === 'labor') directLabor += cost
      else if (res.type === 'equipment') directEquipment += cost
      else if (res.type === 'transport') directTransport += cost
    })
  } else {
    // Manual item calculation with breakdown
    directMaterial = line.manual_price || 0
    directLabor = line.manual_labor_price || 0
    directEquipment = line.manual_equipment_price || 0
    directTransport = line.manual_transport_price || 0
  }

  const unitDirectCost = directMaterial + directLabor + directEquipment + directTransport
  const totalDirectCost = unitDirectCost * line.quantity

  // Aplicare Coeficienti
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

export function calculateProjectTotals(lines: EstimateLine[], settings: ProjectSettings) {
  return lines.reduce((acc, line) => {
    const costs = calculateLineCosts(line, settings)
    return {
      totalDirect: acc.totalDirect + costs.totalDirectCost,
      totalOfertat: acc.totalOfertat + costs.totalOfertatWithoutTVA,
      totalWithTVA: acc.totalWithTVA + costs.totalWithTVA
    }
  }, { totalDirect: 0, totalOfertat: 0, totalWithTVA: 0 })
}
