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
  let totalPlannedDirect = 0
  let totalBudget = 0
  
  const stagePlanned: Record<string, number> = {}
  const stageItems: Record<string, string[]> = {}

  lines.forEach(line => {
    const costs = calculateLineCosts(line, settings)
    const stage = line.stage_name || 'Lucrări Generale'
    
    totalPlannedDirect += costs.totalDirectCost
    totalBudget += costs.totalWithTVA
    
    stagePlanned[stage] = (stagePlanned[stage] || 0) + costs.totalWithTVA
    
    if (!stageItems[stage]) stageItems[stage] = []
    const itemName = line.manual_name || line.items?.name || 'Articol'
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

  // Alertă profitabilitate
  const netProfit = totalEstimatedRevenue - totalSpent - Math.max(0, totalBudget - totalSpent)
  const marginPercent = totalEstimatedRevenue > 0 ? (netProfit / totalEstimatedRevenue) * 100 : 0
  
  if (marginPercent < 5 && totalEstimatedRevenue > 0) {
    alerts.push({
      type: 'danger',
      message: `Profitabilitate critică: Marja a scăzut sub 5% (${marginPercent.toFixed(1)}%)`,
      impact: netProfit
    })
  }

  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return {
    totalBudget,
    totalPlannedDirect,
    totalSpent,
    remainingBudget: Math.max(0, totalBudget - totalSpent),
    projectedMargin: totalBudget - totalPlannedDirect,
    totalEstimatedRevenue,
    netProfit,
    percentSpent,
    deviations,
    upcomingCosts,
    alerts
  }
}
