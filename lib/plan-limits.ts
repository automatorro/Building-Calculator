// Sursa de adevăr pentru capabilitățile fiecărui plan.
// Folosit la gating AI (acum: rate limiting), viitor: verificare plan Stripe.

export type PlanId = 'free' | 'constructor' | 'team'

export interface PlanLimits {
  aiEnabled: boolean
  maxProjects: number        // Infinity = nelimitat
  catalogItems: number       // Infinity = catalog complet
  maxUsers: number
  // Rate limits lunare (aplicare viitoare post-Stripe)
  aiAnalyzePerMonth: number
  aiChatMessagesPerMonth: number
  aiEditorMessagesPerMonth: number
  aiRecipeSuggestionsPerMonth: number
  aiPhotoOcrPerMonth: number
  // Rate limiting per minut (aplicat acum, per IP)
  aiRequestsPerMinute: number
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    aiEnabled: false,
    maxProjects: 1,
    catalogItems: 20,
    maxUsers: 1,
    aiAnalyzePerMonth: 0,
    aiChatMessagesPerMonth: 0,
    aiEditorMessagesPerMonth: 0,
    aiRecipeSuggestionsPerMonth: 0,
    aiPhotoOcrPerMonth: 0,
    aiRequestsPerMinute: 0,
  },
  constructor: {
    aiEnabled: true,
    maxProjects: Infinity,
    catalogItems: Infinity,
    maxUsers: 1,
    aiAnalyzePerMonth: 50,
    aiChatMessagesPerMonth: 200,
    aiEditorMessagesPerMonth: 100,
    aiRecipeSuggestionsPerMonth: 100,
    aiPhotoOcrPerMonth: 30,
    aiRequestsPerMinute: 5,
  },
  team: {
    aiEnabled: true,
    maxProjects: Infinity,
    catalogItems: Infinity,
    maxUsers: 5,
    aiAnalyzePerMonth: 250,
    aiChatMessagesPerMonth: 1000,
    aiEditorMessagesPerMonth: 500,
    aiRecipeSuggestionsPerMonth: 500,
    aiPhotoOcrPerMonth: 150,
    aiRequestsPerMinute: 10,
  },
}

// Features vizibile în UI (pricing cards + comparator)
export const PLAN_FEATURES = {
  free: [
    '1 proiect activ complet',
    'Calculator estimare rapidă',
    'Catalog 20 articole standard',
    'Export PDF deviz',
    'Urmărire cheltuieli de bază',
  ],
  constructor: [
    'Proiecte nelimitate',
    'Catalog complet 1.100+ articole',
    'Urmărire cheltuieli reale + alerte depășire buget',
    'Fotografii la achiziții',
    'Link read-only pentru beneficiar',
    'Import extras cantități Excel',
    'Comparator prețuri furnizori',
    'Export Excel și PDF profesional',
    'AI Consultant tehnic (chat în deviz)',
    'AI Generare rețete resurse automat',
    'AI Analiză și optimizare deviz',
  ],
  team: [
    'Tot din planul Constructor',
    '5 utilizatori — manager + maiștri',
    'Jurnal de șantier partajat în timp real',
    'Raport progres per utilizator și etapă',
    'Catalog propriu al firmei cu prețuri personalizate',
    'Asignare proiecte pe responsabili',
    'AI pentru toți utilizatorii (limite extinse)',
    'Suport prioritar — răspuns în 24h',
  ],
} satisfies Record<PlanId, string[]>
