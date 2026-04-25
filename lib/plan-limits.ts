// Sursă unică de adevăr pentru toate planurile și limitele lor.
// Orice referință la planuri din cod trebuie să vină de aici.

export const PLANS = {
  gratuit: {
    name: 'Gratuit',
    price: 0,
    maxProjects: 1,
    aiRequestsPerDay: 5,
    catalogArticles: 20,
    teamMembers: 1,
  },
  constructor: {
    name: 'Constructor',
    price: 89,
    maxProjects: null, // nelimitat
    aiRequestsPerDay: 50,
    catalogArticles: null, // nelimitat (1100+)
    teamMembers: 1,
  },
  echipa: {
    name: 'Echipă',
    price: 169,
    maxProjects: null,
    aiRequestsPerDay: 200,
    catalogArticles: null,
    teamMembers: 5,
  },
} as const

export type PlanKey = keyof typeof PLANS
