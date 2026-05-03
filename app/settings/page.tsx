'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSubscription } from '@/hooks/useSubscription'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  User, CreditCard, KeyRound, ArrowLeft, Loader2, ExternalLink, Shield
} from 'lucide-react'

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const C = {
  black:       '#1E2329',
  orange:      '#E8500A',
  orangeDark:  '#C43F06',
  orangeLight: '#FFF0E8',
  white:       '#FAFAF8',
  gray100:     '#F3F2EF',
  gray200:     '#E5E3DE',
  gray400:     '#A8A59E',
  gray600:     '#6B6860',
  gray800:     '#2E2D2A',
  green:       '#2A7D4F',
  greenLight:  '#E8F5EE',
  serif:       'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
  sans:        'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
} as const

/* ─── Plan badge colors ──────────────────────────────────────────────────── */
const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  gratuit:     { bg: '#F3F2EF', text: '#6B6860' },
  profesional: { bg: '#FFF0E8', text: '#E8500A' },
  echipa:      { bg: '#E8F5EE', text: '#2A7D4F' },
}

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const sub = useSubscription()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setEmail(user.email || '')
      setLoading(false)
    }
    load()
  }, [supabase])

  /* ── Stripe portal redirect ── */
  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Nu s-a putut deschide portalul de facturare.')
      }
    } catch {
      toast.error('Eroare la conectarea cu serviciul de facturare.')
    } finally {
      setPortalLoading(false)
    }
  }

  /* ── Resetare parolă via email ── */
  const handleResetPassword = async () => {
    if (!email) return
    setResetLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) {
      toast.error('Eroare la trimiterea emailului: ' + error.message)
    } else {
      setResetSent(true)
      toast.success('Email de resetare trimis! Verifică inbox-ul.')
    }
    setResetLoading(false)
  }

  /* ── Card wrapper ── */
  const Card = ({ icon: Icon, title, children }: {
    icon: React.ElementType
    title: string
    children: React.ReactNode
  }) => (
    <div style={{
      background: C.white,
      border: `1px solid ${C.gray200}`,
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${C.gray200}`,
        background: C.gray100,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: C.orangeLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} style={{ color: C.orange }} />
        </div>
        <h2 style={{
          fontSize: 14, fontWeight: 700, color: C.black,
          textTransform: 'uppercase', letterSpacing: '.04em',
        }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  )

  const planColors = PLAN_COLORS[sub.plan] || PLAN_COLORS.gratuit

  return (
    <div style={{
      minHeight: '100vh',
      background: C.gray100,
      fontFamily: C.sans,
    }}>
      <main style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 36 }}>
          <Link href="/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: C.gray600, textDecoration: 'none',
            marginBottom: 16,
          }}>
            <ArrowLeft size={14} />
            Înapoi la proiecte
          </Link>
          <h1 style={{
            fontFamily: C.serif,
            fontSize: 32, fontWeight: 400, color: C.black,
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Setări Cont
          </h1>
          <p style={{ fontSize: 14, color: C.gray600, marginTop: 8, fontWeight: 300 }}>
            Gestionează-ți contul, abonamentul și securitatea.
          </p>
        </div>

        {loading ? (
          <div style={{
            display: 'flex', justifyContent: 'center', padding: 60,
            color: C.gray400,
          }}>
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── 1. Datele contului ── */}
            <Card icon={User} title="Datele contului">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: C.gray600,
                  textTransform: 'uppercase', letterSpacing: '.04em',
                }}>
                  Email
                </label>
                <div style={{
                  padding: '12px 16px',
                  background: C.gray100,
                  border: `1px solid ${C.gray200}`,
                  borderRadius: 8,
                  fontSize: 14, color: C.gray800,
                  fontFamily: 'monospace',
                }}>
                  {email}
                </div>
                <p style={{ fontSize: 12, color: C.gray400, marginTop: 4 }}>
                  Emailul nu poate fi modificat din aplicație.
                </p>
              </div>
            </Card>

            {/* ── 2. Planul activ ── */}
            <Card icon={Shield} title="Planul activ">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '6px 16px', borderRadius: 100,
                  background: planColors.bg, color: planColors.text,
                  fontSize: 14, fontWeight: 700,
                  textTransform: 'capitalize',
                }}>
                  {sub.planName}
                </span>
                {sub.isTrial && (
                  <span style={{
                    padding: '4px 10px', borderRadius: 100,
                    background: '#FEF3C7', color: '#92400E',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    TRIAL
                  </span>
                )}
              </div>
              {sub.periodEnd && (
                <p style={{ fontSize: 13, color: C.gray600, marginBottom: 8 }}>
                  Următoarea facturare: <strong>
                    {new Date(sub.periodEnd).toLocaleDateString('ro-RO', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </strong>
                </p>
              )}
              <p style={{ fontSize: 12, color: C.gray400 }}>
                Status: <span style={{
                  color: sub.isActive ? C.green : '#C0392B',
                  fontWeight: 600,
                }}>
                  {sub.isActive ? 'Activ' : 'Inactiv'}
                </span>
              </p>
            </Card>

            {/* ── 3. Gestionare abonament ── */}
            <Card icon={CreditCard} title="Gestionare abonament">
              <p style={{ fontSize: 13, color: C.gray600, marginBottom: 16, lineHeight: 1.6 }}>
                Modifică planul, actualizează metoda de plată sau descarcă facturile
                din portalul Stripe.
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: portalLoading ? C.gray400 : C.orange,
                  color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: 10,
                  fontSize: 14, fontWeight: 600,
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                  fontFamily: C.sans,
                  transition: 'background .15s',
                }}
              >
                {portalLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ExternalLink size={16} />
                )}
                {portalLoading ? 'Se deschide...' : 'Modifică planul'}
              </button>
            </Card>

            {/* ── 4. Schimbare parolă ── */}
            <Card icon={KeyRound} title="Securitate">
              <p style={{ fontSize: 13, color: C.gray600, marginBottom: 16, lineHeight: 1.6 }}>
                Vei primi un email cu un link de resetare a parolei la adresa <strong>{email}</strong>.
              </p>
              {resetSent ? (
                <div style={{
                  background: C.greenLight, border: `1px solid ${C.green}22`,
                  padding: '12px 16px', borderRadius: 8,
                  fontSize: 13, color: C.green, fontWeight: 500,
                }}>
                  ✓ Email de resetare trimis! Verifică inbox-ul (și spam).
                </div>
              ) : (
                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: C.gray100,
                    color: C.gray800, border: `1px solid ${C.gray200}`,
                    padding: '12px 24px', borderRadius: 10,
                    fontSize: 14, fontWeight: 600,
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                    fontFamily: C.sans,
                    transition: 'all .15s',
                  }}
                >
                  {resetLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <KeyRound size={16} />
                  )}
                  {resetLoading ? 'Se trimite...' : 'Trimite email de resetare parolă'}
                </button>
              )}
            </Card>

          </div>
        )}
      </main>
    </div>
  )
}
