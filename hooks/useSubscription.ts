'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PLANS, type PlanKey } from '@/lib/plan-limits'

export interface SubscriptionInfo {
  plan: PlanKey
  planName: string
  status: string
  periodEnd: string | null
  trialEnd: string | null
  isActive: boolean
  isTrial: boolean
  loading: boolean
}

const DEFAULT: SubscriptionInfo = {
  plan: 'gratuit',
  planName: 'Gratuit',
  status: 'active',
  periodEnd: null,
  trialEnd: null,
  isActive: true,
  isTrial: false,
  loading: true,
}

export function useSubscription(): SubscriptionInfo {
  const [info, setInfo] = useState<SubscriptionInfo>(DEFAULT)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (mounted) setInfo({ ...DEFAULT, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, subscription_period_end, trial_end, is_admin')
        .eq('id', user.id)
        .single()

      if (!mounted) return

      let plan = (profile?.subscription_plan ?? 'gratuit') as PlanKey
      if (profile?.is_admin) {
        plan = 'echipa'
      }
      const status = profile?.subscription_status ?? 'active'
      const isTrial = status === 'trialing'
      const isActive = status === 'active' || status === 'trialing'

      setInfo({
        plan,
        planName: PLANS[plan]?.name ?? 'Gratuit',
        status,
        periodEnd: profile?.subscription_period_end ?? null,
        trialEnd: profile?.trial_end ?? null,
        isActive,
        isTrial,
        loading: false,
      })
    }

    load()
    return () => { mounted = false }
  }, [])

  return info
}
