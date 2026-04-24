import { EstimateLine, ProjectSettings, calculateLineCosts } from './estimate'

export interface Purchase {
  id: string
  project_id: string
  stage_name: string | null
  name: string
  amount_total: number
  date: string
  category: string
  supplier_id?: string
}

export interface FinancialsSummary {
  totalBudget: number       // What we planned (direct + margin + tva)
  totalPlannedDirect: number // Direct material + labor + eq + trans
  totalSpent: number        // Actual money out
  remainingBudget: number    // Budget - Spent
  projectedMargin: number   // Profit defined in settings + any savings
  totalEstimatedRevenue: number
  netProfit: number         // Revenue - Total Real Cost
  percentSpent: number
  deviations: {
    stage: string
    planned: number
    spent: number
    diff: number
    percent: number
  }[]
  upcomingCosts: {
    stage: string
    amount: number
    description: string
  }[]
  alerts: {
    type: 'warning' | 'danger' | 'info'
    message: string
    impact?: number
  }[]
}

export function calculateFinancials(
  lines: EstimateLine[],
  purchases: Purchase[],
  settings: ProjectSettings,
  totalEstimatedRevenue: number = 0
): FinancialsSummary {
  // 1. Calculate Budget from Estimate Lines
  let totalCostBudget = 0 // Cheltuielile estimate (fără profit)
  let totalSalePrice = 0  // Totalul devizului (inclusiv profit și TVA)
  let totalPlannedDirect = 0
  let totalBudget = 0
  
  const stagePlanned: Record<string, number> = {}
  const stageItems: Record<string, string[]> = {}

  lines.forEach(line => {
    const costs = calculateLineCosts(line, settings)
    const stage = line.stage_name || 'Lucrări Generale'
    
    totalPlannedDirect += costs.totalDirectCost
    
    // Costul cu regie reprezintă limita maximă de cheltuieli (fără profit)
    const costBudgetForLine = costs.totalDirectCost + costs.regieAmount

    totalCostBudget += costBudgetForLine
    totalSalePrice += costs.totalWithTVA
    totalBudget += costs.totalWithTVA
    
    // Alocăm bugetul de cheltuieli (fără TVA, pentru comparație cu achiziții nete)
    stagePlanned[stage] = (stagePlanned[stage] || 0) + costBudgetForLine
    
    if (!stageItems[stage]) stageItems[stage] = []
    const itemName = line.name || line.items?.name || 'Articol'
    if (!stageItems[stage].includes(itemName)) stageItems[stage].push(itemName)
  })

  // 2. Calculate Actual Spent from Purchases
  let totalSpent = 0
  const stageSpent: Record<string, number> = {}

  purchases.forEach(p => {
    const amount = Number(p.amount_total) || 0
    const stage = p.stage_name || 'Lucrări Generale'
    
    totalSpent += amount
    stageSpent[stage] = (stageSpent[stage] || 0) + amount
  })

  // 3. Calculate Deviations per Stage
  const allStages = Array.from(new Set([...Object.keys(stagePlanned), ...Object.keys(stageSpent)]))
  const deviations = allStages.map(stage => {
    const planned = stagePlanned[stage] || 0
    const spent = stageSpent[stage] || 0
    const diff = spent - planned
    const percent = planned > 0 ? (diff / planned) * 100 : 0
    
    return {
      stage,
      planned,
      spent,
      diff,
      percent
    }
  })

  // 4. Forecast & Alerts
  const upcomingCosts = deviations
    .filter(d => d.spent === 0 && d.planned > 0)
    .map(d => ({
      stage: d.stage,
      amount: d.planned,
      description: `Urmează etapa ${d.stage} (${(stageItems[d.stage] || []).slice(0, 2).join(', ')}...)`
    }))

  const alerts: FinancialsSummary['alerts'] = []
  
  deviations.forEach(d => {
    if (d.percent > 5) {
      alerts.push({
        type: 'danger',
        message: `Depășire bugetară în etapa ${d.stage}: +${d.percent.toFixed(1)}%`,
        impact: d.diff
      })
    } else if (d.percent > 0) {
      alerts.push({
        type: 'warning',
        message: `Etapa ${d.stage} este ușor peste buget: +${d.percent.toFixed(1)}%`,
        impact: d.diff
      })
    }
  })

  // Dacă utilizatorul nu a introdus un venit ferm (sau l-a lăsat 0), venitul estimat este egal cu devizul (Sale Price)
  const effectiveRevenue = totalEstimatedRevenue > 0 ? totalEstimatedRevenue : totalSalePrice
  
  // Profitul este Venitul (efectiv) minus totalul cheltuit minus estimatul de cheltuit rămas (din totalCostBudget)
  const netProfit = effectiveRevenue - totalSpent - Math.max(0, totalCostBudget - totalSpent)
  const marginPercent = effectiveRevenue > 0 ? (netProfit / effectiveRevenue) * 100 : 0
  
  if (marginPercent < 5 && effectiveRevenue > 0) {
    alerts.push({
      type: 'danger',
      message: `Profitabilitate critică: Marja a scăzut sub 5% (${marginPercent.toFixed(1)}%)`,
      impact: netProfit
    })
  }

  const percentSpent = totalCostBudget > 0 ? (totalSpent / totalCostBudget) * 100 : 0

  return {
    totalBudget: totalCostBudget, // Limita reală de cheltuieli
    totalPlannedDirect,
    totalSpent,
    remainingBudget: Math.max(0, totalCostBudget - totalSpent),
    projectedMargin: totalSalePrice - totalCostBudget,
    totalEstimatedRevenue: effectiveRevenue,
    netProfit,
    percentSpent,
    deviations,
    upcomingCosts,
    alerts
  }
}
