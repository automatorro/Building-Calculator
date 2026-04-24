export type SuggestionType = 'material' | 'labor' | 'process' | 'price_audit' | 'recipe_error'

export interface AIAction {
  type: 'correct_qty' | 'replace_material' | 'add_resource'
  lineId: string | null
  payload: Record<string, unknown>
}

export interface OptimizationSuggestion {
  title: string
  description: string
  impactPrice: number
  impactTime: number
  reasoning: string
  actionLabel: string
  type: SuggestionType
  marketRefPrice?: number
  action?: AIAction | null
}
