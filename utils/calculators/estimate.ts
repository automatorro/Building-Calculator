export interface EstimateLine {
  id: string
  quantity: number
  custom_prices: Record<string, number>
  excluded_resources: string[]
  metadata?: any
  stage_name?: string
  // Deprecated - păstrate doar pentru backward compatibility în baza de date la parsarea JSON-urilor antice.
  manual_name?: string
  manual_um?: string
  manual_price?: number
  manual_labor_price?: number
  manual_equipment_price?: number
  manual_transport_price?: number
  
  resources_override?: Resource[]
  
  // Modelul Unic de Articol Deviz
  catalog_norm_id?: number
  name?: string
  code?: string
  unit?: string
  unit_price?: number
  category?: string
  sort_order?: number
  notes?: string
  items: {
    id: string
    code: string
    name: string
    um: string
    category_id?: string
    normative_id?: string
    normatives: { code: string } | null
    resources?: Resource[]
  } | null
}

export type EstimateLineStatus =
  | 'Calculabil'
  | 'Fără rețetă'
  | 'Rețetă incompletă'
  | 'Cost neconfigurat'
  | 'Preț orientativ'
  | 'Incomplet'

export type Origin = 'Normativ' | 'Adăugat manual'
export type CostSource = 'Din rețetă' | 'Preț catalog' | 'Cost manual'

export interface EstimateLineAnalysis {
  status: EstimateLineStatus
  origin: Origin
  source: CostSource
  isCalculable: boolean
  issueMessage?: string
}

export function analyzeEstimateLine(line: EstimateLine): EstimateLineAnalysis {
  // Verificăm dacă e introdus manual (uneori code e MANUAL sau lipsesc detaliile de normativ)
  const isManual = (!line.items && !line.catalog_norm_id && !line.code) || line.code === 'MANUAL' || line.id.startsWith('manual');
  const origin: Origin = isManual ? 'Adăugat manual' : 'Normativ'
  
  const resourcesToUse = line.resources_override && line.resources_override.length > 0
    ? line.resources_override
    : line.items?.resources || []

  // Preț manual sau definit în catalog pe întregul obiect (când nu folosește rețetă)
  const hasManualCost = (line.unit_price || 0) > 0 || (line.manual_price || 0) > 0;

  if (resourcesToUse.length > 0) {
    const activeResources = resourcesToUse.filter(r => !(line.excluded_resources || []).includes(r.id));
    if (activeResources.length === 0) {
      if (hasManualCost) {
        return { status: 'Calculabil', origin, source: 'Cost manual', isCalculable: true }
      }
      return { status: 'Rețetă incompletă', origin, source: 'Din rețetă', isCalculable: false, issueMessage: 'Toate resursele sunt excluse și nu există preț de rezervă.' }
    }
    
    // Check if any active resource has no price
    const hasMissingPrices = activeResources.some(res => {
      const price = line.custom_prices?.[res.id] ?? res.unit_price;
      return price == null || price === 0;
    });

    if (hasMissingPrices) {
      return { status: 'Rețetă incompletă', origin, source: 'Din rețetă', isCalculable: false, issueMessage: 'Unele resurse active au prețul zero.' }
    }

    return { status: 'Calculabil', origin, source: 'Din rețetă', isCalculable: true }
  } else if ((line.unit_price != null && line.unit_price > 0) || hasManualCost) {
    return { status: 'Calculabil', origin, source: isManual ? 'Cost manual' : 'Preț catalog', isCalculable: true }
  } else if (!isManual) {
     return { status: 'Fără rețetă', origin, source: 'Din rețetă', isCalculable: false, issueMessage: 'Acest normativ nu are o rețetă validă.' }
  }

  return { status: 'Cost neconfigurat', origin, source: 'Cost manual', isCalculable: false, issueMessage: 'Nu a fost completat niciun cost.' }
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
  const analysis = analyzeEstimateLine(line)
  if (!analysis.isCalculable) {
    return {
      unitDirectCost: 0,
      totalDirectCost: 0,
      totalOfertatWithoutTVA: 0,
      totalWithTVA: 0,
      regieAmount: 0,
      profitAmount: 0,
      tvaAmount: 0
    }
  }

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
    // Linie fără rețetă — se aplică direct unit_price global al normei/articolului
    directMaterial = line.unit_price || line.manual_price || 0
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
    tvaAmount,
    breakdown: {
      material: directMaterial * line.quantity,
      labor: directLabor * line.quantity,
      equipment: directEquipment * line.quantity,
      transport: directTransport * line.quantity
    }
  }
}

export function calculateProjectTotals(lines: EstimateLine[], settings: ProjectSettings) {
  if (!lines || !Array.isArray(lines)) {
    return { totalDirect: 0, totalOfertat: 0, totalWithTVA: 0 }
  }
  return lines.reduce((acc, line) => {
    const costs = calculateLineCosts(line, settings)
    return {
      totalDirect: acc.totalDirect + costs.totalDirectCost,
      totalOfertat: acc.totalOfertat + costs.totalOfertatWithoutTVA,
      totalWithTVA: acc.totalWithTVA + costs.totalWithTVA
    }
  }, { totalDirect: 0, totalOfertat: 0, totalWithTVA: 0 })
}
