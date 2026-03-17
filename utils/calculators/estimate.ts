export interface EstimateLine {
  id: string
  quantity: number
  custom_prices: Record<string, number>
  excluded_resources: string[]
  items: {
    id: string
    code: string
    name: string
    um: string
    normatives: { code: string } | null
    resources?: Array<{
      id: string
      type: 'material' | 'labor' | 'equipment'
      name: string
      um: string
      consumption: number
      unit_price: number
    }>
  }
}

export interface ProjectSettings {
  profit: number
  regie: number
  tva: number
  taxe_manopera: number
}

export function calculateLineCosts(line: EstimateLine, settings: ProjectSettings) {
  const resources = line.items.resources || []
  
  let directMaterial = 0
  let directLabor = 0
  let directEquipment = 0

  resources.forEach(res => {
    // Skip if excluded
    if (line.excluded_resources.includes(res.id)) return

    // Use custom price if available, otherwise default
    const price = line.custom_prices[res.id] ?? res.unit_price
    const cost = res.consumption * price

    if (res.type === 'material') directMaterial += cost
    if (res.type === 'labor') directLabor += cost
    if (res.type === 'equipment') directEquipment += cost
  })

  const unitDirectCost = directMaterial + directLabor + directEquipment
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

export function calculateProjectTotal(lines: EstimateLine[], settings: ProjectSettings) {
  return lines.reduce((acc, line) => {
    const costs = calculateLineCosts(line, settings)
    return {
      totalDirect: acc.totalDirect + costs.totalDirectCost,
      totalOfertat: acc.totalOfertat + costs.totalOfertatWithoutTVA,
      totalWithTVA: acc.totalWithTVA + costs.totalWithTVA
    }
  }, { totalDirect: 0, totalOfertat: 0, totalWithTVA: 0 })
}
