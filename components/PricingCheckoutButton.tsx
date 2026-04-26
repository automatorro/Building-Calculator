'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Props {
  plan: 'constructor' | 'echipa'
  label: string
  style?: React.CSSProperties
  className?: string
}

export default function PricingCheckoutButton({ plan, label, style, className }: Props) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleClick() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Neutentificat → trimitem la register cu planul în query
      if (!user) {
        window.location.href = `/auth/register?plan=${plan}`
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        alert(data.error ?? 'Eroare la inițializarea plății. Încearcă din nou.')
        setLoading(false)
        return
      }

      window.location.href = data.url
    } catch {
      alert('Eroare de rețea. Verifică conexiunea și încearcă din nou.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{ cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, ...style }}
    >
      {loading ? 'Se pregătește...' : label}
    </button>
  )
}
