import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe, STRIPE_PRICE_IDS } from '@/lib/stripe'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://buildingcalculator.netlify.app'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: 'constructor' | 'echipa' }
  const priceId = STRIPE_PRICE_IDS[plan]

  if (!priceId) {
    return NextResponse.json(
      { error: `Prețul Stripe pentru planul "${plan}" nu e configurat. Adaugă STRIPE_PRICE_${plan.toUpperCase()} în .env.local` },
      { status: 400 }
    )
  }

  // Găsim sau creăm customer Stripe
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, full_name, subscription_plan')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  // Creăm sesiunea Checkout cu trial 14 zile
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    },
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
    success_url: `${APP_URL}/projects?upgraded=true&plan=${plan}`,
    cancel_url: `${APP_URL}/#preturi`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    locale: 'ro',
  })

  return NextResponse.json({ url: session.url })
}
