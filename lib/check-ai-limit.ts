// Verifică limita zilnică de cereri AI per utilizator, bazat pe planul de abonament.
// Returnează { allowed, plan, remaining } sau aruncă un NextResponse dacă e blocat.

import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { PLANS, type PlanKey } from './plan-limits'

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export interface AiLimitResult {
  allowed: true
  plan: PlanKey
  remaining: number | null
}

export async function checkAndIncrementAiLimit(
  userId: string
): Promise<AiLimitResult | NextResponse> {
  const supabase = getAdminClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_plan, ai_requests_today, ai_requests_reset_at')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    // Dacă nu găsim profilul, tratăm ca gratuit
    return { allowed: true, plan: 'gratuit', remaining: null }
  }

  const plan = (profile.subscription_plan ?? 'gratuit') as PlanKey
  const limit = PLANS[plan]?.aiRequestsPerDay ?? PLANS.gratuit.aiRequestsPerDay
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // Reset dacă e o zi nouă
  const resetAt = profile.ai_requests_reset_at
  const needsReset = !resetAt || resetAt < today
  const currentCount = needsReset ? 0 : (profile.ai_requests_today ?? 0)

  if (currentCount >= limit) {
    return NextResponse.json(
      {
        error: `Ai atins limita zilnică de ${limit} cereri AI pentru planul ${PLANS[plan].name}. Limita se resetează la miezul nopții.`,
        upgradeRequired: plan === 'gratuit' || plan === 'constructor',
        currentPlan: plan,
      },
      { status: 429 }
    )
  }

  // Incrementăm contorul
  await supabase
    .from('profiles')
    .update({
      ai_requests_today: currentCount + 1,
      ai_requests_reset_at: today,
    })
    .eq('id', userId)

  return {
    allowed: true,
    plan,
    remaining: limit - currentCount - 1,
  }
}
