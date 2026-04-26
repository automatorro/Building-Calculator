// Sursă unică de adevăr pentru toate planurile și limitele lor.
// Orice referință la planuri din cod trebuie să vină de aici.

export const PLANS = {
  gratuit: {
    name: 'Gratuit',
    price: 0,
    maxProjects: 1,
    aiRequestsPerDay: 5,
    catalogArticles: null as null, // acces complet la catalog, limitat la 1 proiect
    teamMembers: 1,
    stripePriceId: null as null,
  },
  constructor: {
    name: 'Constructor',
    price: 89,
    maxProjects: null as null, // nelimitat
    aiRequestsPerDay: 50,
    catalogArticles: null as null, // nelimitat (1100+)
    teamMembers: 1,
    stripePriceId: process.env.STRIPE_PRICE_CONSTRUCTOR ?? null as null,
  },
  echipa: {
    name: 'Echipă',
    price: 169,
    maxProjects: null as null,
    aiRequestsPerDay: 200,
    catalogArticles: null as null,
    teamMembers: 5,
    stripePriceId: process.env.STRIPE_PRICE_ECHIPA ?? null as null,
  },
}

export type PlanKey = keyof typeof PLANS

export function getPlanForPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceId === priceId) return key as PlanKey
  }
  return null
}
