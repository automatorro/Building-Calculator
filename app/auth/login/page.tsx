'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

/* ─── Token-uri de design (identice cu landing page) ─────────────────────── */
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
  redLight:    '#FCECEA',
  red:         '#C0392B',
  serif:       'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
  sans:        'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
} as const

/* ─── Statistici afișate pe panoul stânga ─────────────────────────────────── */
const STATS = [
  { num: '3 min',  label: 'să creezi un deviz complet' },
  { num: '49 lei', label: 'pe lună, fără contract' },
  { num: '80+',    label: 'norme tehnice în catalog' },
]

/* ─── Logo ─────────────────────────────────────────────────────────────────── */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width:size, height:size, background:C.orange, borderRadius:7,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <svg width={Math.round(size*.55)} height={Math.round(size*.55)} viewBox="0 0 24 24"
        fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
  )
}

/* ─── Formular (are nevoie de useSearchParams → Suspense) ─────────────────── */
function LoginForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Email sau parolă incorecte.'
          : err.message === 'Email not confirmed'
          ? 'Confirmă emailul înainte de a te autentifica.'
          : 'Eroare la autentificare. Încearcă din nou.'
      )
      setLoading(false)
      return
    }

    router.push(searchParams.get('redirectedFrom') || '/projects')
    router.refresh()
  }

  /* ── Stiluri refolosibile ── */
  const inputWrap: React.CSSProperties = { display:'flex', flexDirection:'column', gap:6 }
  const label: React.CSSProperties = { fontSize:13, fontWeight:500, color:C.gray800 }
  const input: React.CSSProperties = {
    width:'100%', padding:'12px 16px', background:C.gray100,
    border:`1px solid ${C.gray200}`, borderRadius:8,
    fontSize:14, color:C.gray800, fontFamily:C.sans, outline:'none',
    transition:'border-color .15s', boxSizing:'border-box',
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', width:'100%', maxWidth:380 }}>

      {/* Logo + titlu */}
      <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:36 }}>
        <LogoMark />
        <span style={{ fontFamily:C.sans, fontWeight:600, fontSize:15, color:C.black, letterSpacing:'-0.02em' }}>
          Building<span style={{ color:C.orange }}>Calc</span>
        </span>
      </Link>

      <h1 style={{ fontFamily:C.serif, fontSize:30, fontWeight:400, color:C.black,
        lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:8 }}>
        Bine ai revenit
      </h1>
      <p style={{ fontSize:15, color:C.gray600, marginBottom:32, lineHeight:1.5 }}>
        Intră în contul tău BuildingCalc.
      </p>

      {/* Eroare */}
      {error && (
        <div style={{ background:C.redLight, border:`1px solid ${C.red}22`,
          color:C.red, padding:'10px 16px', borderRadius:8, fontSize:13,
          marginBottom:20, lineHeight:1.4 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
        {/* Email */}
        <div style={inputWrap}>
          <label style={label}>Email</label>
          <input type="email" required autoComplete="email"
            placeholder="ana.ionescu@firma.ro"
            value={email} onChange={e=>setEmail(e.target.value)}
            style={input}
            onFocus={e=>(e.target.style.borderColor=C.orange)}
            onBlur={e=>(e.target.style.borderColor=C.gray200)} />
        </div>

        {/* Parolă */}
        <div style={inputWrap}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <label style={label}>Parolă</label>
            <Link href="/auth/forgot-password" style={{ fontSize:12, color:C.orange, textDecoration:'none' }}>
              Ai uitat parola?
            </Link>
          </div>
          <div style={{ position:'relative' }}>
            <input type={showPass ? 'text' : 'password'} required autoComplete="current-password"
              placeholder="••••••••"
              value={password} onChange={e=>setPassword(e.target.value)}
              style={{ ...input, paddingRight:44 }}
              onFocus={e=>(e.target.style.borderColor=C.orange)}
              onBlur={e=>(e.target.style.borderColor=C.gray200)} />
            <button type="button" onClick={()=>setShowPass(!showPass)}
              style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:C.gray400,
                display:'flex', alignItems:'center', padding:0 }}
              aria-label={showPass ? 'Ascunde parola' : 'Arată parola'}>
              {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          style={{ width:'100%', padding:'13px', background:loading ? C.gray400 : C.orange,
            color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:500,
            fontFamily:C.sans, cursor:loading ? 'not-allowed' : 'pointer',
            transition:'background .15s, transform .15s', marginTop:4 }}
          onMouseEnter={e=>{ if(!loading) e.currentTarget.style.background=C.orangeDark }}
          onMouseLeave={e=>{ if(!loading) e.currentTarget.style.background=C.orange }}>
          {loading ? 'Se conectează...' : 'Intră în cont'}
        </button>
      </form>

      <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:C.gray600 }}>
        Nu ai cont?{' '}
        <Link href="/auth/register" style={{ color:C.orange, fontWeight:500, textDecoration:'none' }}>
          Înregistrează-te gratuit
        </Link>
      </p>
    </div>
  )
}

/* ─── Page export ─────────────────────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
    }}>
      {/* ── Stânga: panel dark cu stats ──────────────────────────────────── */}
      <div style={{
        background: C.black,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
      }} className="auth-left-panel">

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <LogoMark />
          <span style={{ fontFamily:C.sans, fontWeight:600, fontSize:15, color:C.white, letterSpacing:'-0.02em' }}>
            Building<span style={{ color:C.orange }}>Calc</span>
          </span>
        </Link>

        {/* Tagline central */}
        <div>
          <h2 style={{
            fontFamily: C.serif,
            fontSize: 42,
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}>
            Devize profesionale<br />
            <em style={{ color: C.orange, fontStyle: 'italic' }}>în 3 minute</em>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', lineHeight:1.65, maxWidth:340 }}>
            Tot ce ai nevoie pentru a gestiona un proiect de construcții, de pe şantier, de pe telefon.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {STATS.map(s => (
            <div key={s.num} style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span style={{
                fontFamily: C.serif,
                fontSize: 28,
                color: C.orange,
                minWidth: 80,
                lineHeight: 1,
              }}>{s.num}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.4 }}>
                {s.label}
              </span>
            </div>
          ))}
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)', marginTop:8 }}>
            Fără card de credit · Anulezi oricând
          </p>
        </div>
      </div>

      {/* ── Dreapta: formular ─────────────────────────────────────────────── */}
      <div style={{
        background: C.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 56px',
      }}>
        <Suspense fallback={<div style={{ height: 400 }} />}>
          <LoginForm />
        </Suspense>
      </div>

      {/* ── Mobile: ascunde panoul stânga ─────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
