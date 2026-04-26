import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { getPlanForPriceId } from '@/lib/plan-limits'
import type Stripe from 'stripe'

// Client cu service_role key pentru scriere webhook (fără RLS)
function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function updateProfileSubscription(
  supabase: ReturnType<typeof getAdminClient>,
  customerId: string,
  updates: Record<string, unknown>
) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId)

  if (error) console.error('[webhook] profile update error:', error)
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Lipsă semnătură Stripe' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[webhook] semnătură invalidă:', err.message)
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 })
  }

  const supabase = getAdminClient()

  switch (event.type) {
    // ── Checkout finalizat (prima plată sau trial activat) ──────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const userId = session.metadata?.supabase_user_id
      const plan = session.metadata?.plan ?? 'constructor'
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      // Obținem data de expirare a trial-ului / perioadei
      const sub = await stripe.subscriptions.retrieve(subscriptionId)
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null
      const trialEnd = sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_plan: plan,
            subscription_status: sub.status,
            subscription_period_end: periodEnd,
            trial_end: trialEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
      }
      break
    }

    // ── Abonamentul actualizat (upgrade, downgrade, reînnoire) ──────────
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const priceId = sub.items.data[0]?.price.id ?? ''
      const plan = getPlanForPriceId(priceId) ?? 'constructor'
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null
      const trialEnd = sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null

      await updateProfileSubscription(supabase, customerId, {
        stripe_subscription_id: sub.id,
        subscription_plan: sub.status === 'active' || sub.status === 'trialing' ? plan : 'gratuit',
        subscription_status: sub.status,
        subscription_period_end: periodEnd,
        trial_end: trialEnd,
      })
      break
    }

    // ── Abonamentul anulat ──────────────────────────────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      await updateProfileSubscription(supabase, customerId, {
        subscription_plan: 'gratuit',
        subscription_status: 'canceled',
        subscription_period_end: null,
        trial_end: null,
        stripe_subscription_id: null,
      })
      break
    }

    // ── Plată eșuată ────────────────────────────────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await updateProfileSubscription(supabase, customerId, {
        subscription_status: 'past_due',
      })
      break
    }

    // ── Plată reușită (reînnoire) ───────────────────────────────────────
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const subscriptionId = (invoice as any).subscription as string | null

      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null
        await updateProfileSubscription(supabase, customerId, {
          subscription_status: 'active',
          subscription_period_end: periodEnd,
        })
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
