import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY nu e setat în variabilele de mediu.')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia' as any,
    })
  }
  return _stripe
}

// Alias pentru compatibilitate cu codul existent
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop]
  },
})

export const STRIPE_PRICE_IDS: Record<string, string | null> = {
  constructor: process.env.STRIPE_PRICE_CONSTRUCTOR ?? null,
  echipa: process.env.STRIPE_PRICE_ECHIPA ?? null,
}
