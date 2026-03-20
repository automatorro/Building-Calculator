'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const C = {
  black:      '#1E2329',
  orange:     '#E8500A',
  orangeDark: '#C43F06',
  white:      '#FAFAF8',
  gray100:    '#F3F2EF',
  gray200:    '#E5E3DE',
  gray400:    '#A8A59E',
  gray600:    '#6B6860',
  gray800:    '#2E2D2A',
  green:      '#2A7D4F',
  greenLight: '#E8F5EE',
  redLight:   '#FCECEA',
  red:        '#C0392B',
  serif:      'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
  sans:       'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
} as const

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

/* Avantaje afișate pe panoul stânga */
const BENEFITS = [
  'Deviz complet în mai puțin de 5 minute',
  'Catalog cu 80+ norme tehnice românești',
  'Export PDF profesional instant',
  'Link de vizualizare pentru beneficiar',
  'Alertă automată la depășire buget',
  'Mobile-first, funcționează pe șantier',
]

export default function RegisterPage() {
  const [fullName,        setFullName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass,        setShowPass]        = useState(false)
  const [showConf,        setShowConf]        = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [success,         setSuccess]         = useState(false)

  const router   = useRouter()
  const supabase = createClient()

  /* Indicator putere parolă */
  const passStrength = password.length === 0 ? null
    : password.length < 6  ? { label:'Prea scurtă', pct: 25, color: C.red }
    : password.length < 8  ? { label:'Slabă',       pct: 50, color: '#D97706' }
    : password.length < 12 ? { label:'Bună',        pct: 75, color: C.green }
    :                        { label:'Excelentă',   pct:100, color: C.green }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) { setError('Parolele nu coincid.'); return }
    if (password.length < 8)          { setError('Parola trebuie să aibă minim 8 caractere.'); return }

    setLoading(true)

    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    })

    setLoading(false)

    if (err) {
      setError(
        err.message.includes('already registered')
          ? 'Există deja un cont cu acest email.'
          : 'Eroare la înregistrare. Încearcă din nou.'
      )
      return
    }

    setSuccess(true)
    /* Dacă email confirmation e dezactivat în Supabase, redirect automat */
    setTimeout(() => { router.push('/projects'); router.refresh() }, 2500)
  }

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'12px 16px', background:C.gray100,
    border:`1px solid ${C.gray200}`, borderRadius:8,
    fontSize:14, color:C.gray800, fontFamily:C.sans, outline:'none',
    transition:'border-color .15s', boxSizing:'border-box',
  }
  const labelStyle: React.CSSProperties = { fontSize:13, fontWeight:500, color:C.gray800 }

  /* ── Ecran succes ── */
  if (success) {
    return (
      <div style={{ minHeight:'100vh', background:C.gray100, display:'flex',
        alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`,
          borderRadius:14, padding:'40px 36px', maxWidth:400, width:'100%', textAlign:'center' }}>
          <div style={{ width:56, height:56, background:C.greenLight, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <CheckCircle2 size={28} color={C.green} />
          </div>
          <h2 style={{ fontFamily:C.serif, fontSize:26, fontWeight:400,
            color:C.black, marginBottom:10 }}>Cont creat!</h2>
          <p style={{ fontSize:14, color:C.gray600, lineHeight:1.6, marginBottom:24 }}>
            Verifică emailul dacă e nevoie de confirmare, sau vei fi redirecționat automat.
          </p>
          <Link href="/projects" style={{ display:'inline-block', background:C.orange,
            color:'white', padding:'11px 28px', borderRadius:8, textDecoration:'none',
            fontSize:14, fontWeight:500 }}>
            Mergi la proiecte →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr',
      fontFamily: C.sans,
    }}>
      {/* ── Stânga: panel dark ───────────────────────────────────────────── */}
      <div style={{ background:C.black, display:'flex', flexDirection:'column',
        justifyContent:'space-between', padding:'48px 56px' }}
        className="auth-left-panel">

        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <LogoMark />
          <span style={{ fontFamily:C.sans, fontWeight:600, fontSize:15, color:C.white, letterSpacing:'-0.02em' }}>
            Building<span style={{ color:C.orange }}>Calc</span>
          </span>
        </Link>

        <div>
          <h2 style={{ fontFamily:C.serif, fontSize:38, fontWeight:400, color:C.white,
            lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:16 }}>
            Totul pentru<br />
            <em style={{ color:C.orange, fontStyle:'italic' }}>devizul tău</em>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', lineHeight:1.65, maxWidth:340, marginBottom:32 }}>
            Instrumente profesionale pentru constructori, fără complexitatea software-urilor scumpe.
          </p>

          <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:12 }}>
            {BENEFITS.map(b => (
              <li key={b} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(42,125,79,0.2)',
                  border:'1px solid rgba(42,125,79,0.4)', display:'flex', alignItems:'center',
                  justifyContent:'center', flexShrink:0 }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.55)' }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>
          14 zile gratuit · Fără card de credit · Anulezi oricând
        </p>
      </div>

      {/* ── Dreapta: formular ─────────────────────────────────────────────── */}
      <div style={{ background:C.white, display:'flex', alignItems:'center',
        justifyContent:'center', padding:'48px 56px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:380 }}>

          {/* Logo (vizibil pe mobile când panoul stânga e ascuns) */}
          <Link href="/" className="auth-mobile-logo"
            style={{ display:'none', alignItems:'center', gap:10, textDecoration:'none', marginBottom:36 }}>
            <LogoMark />
            <span style={{ fontFamily:C.sans, fontWeight:600, fontSize:15, color:C.black, letterSpacing:'-0.02em' }}>
              Building<span style={{ color:C.orange }}>Calc</span>
            </span>
          </Link>

          <h1 style={{ fontFamily:C.serif, fontSize:28, fontWeight:400, color:C.black,
            lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:8 }}>
            Creează cont gratuit
          </h1>
          <p style={{ fontSize:14, color:C.gray600, marginBottom:28, lineHeight:1.5 }}>
            Primele 14 zile fără restricții, fără card.
          </p>

          {error && (
            <div style={{ background:C.redLight, border:`1px solid ${C.red}22`,
              color:C.red, padding:'10px 16px', borderRadius:8, fontSize:13,
              marginBottom:20, lineHeight:1.4 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Nume */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={labelStyle}>Nume complet</label>
              <input type="text" required autoComplete="name" placeholder="Ion Ionescu"
                value={fullName} onChange={e=>setFullName(e.target.value)}
                style={inputStyle}
                onFocus={e=>(e.target.style.borderColor=C.orange)}
                onBlur={e=>(e.target.style.borderColor=C.gray200)} />
            </div>

            {/* Email */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={labelStyle}>Email</label>
              <input type="email" required autoComplete="email" placeholder="ion@firma.ro"
                value={email} onChange={e=>setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e=>(e.target.style.borderColor=C.orange)}
                onBlur={e=>(e.target.style.borderColor=C.gray200)} />
            </div>

            {/* Parolă */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={labelStyle}>Parolă (minim 8 caractere)</label>
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} required autoComplete="new-password"
                  placeholder="Minim 8 caractere"
                  value={password} onChange={e=>setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight:44 }}
                  onFocus={e=>(e.target.style.borderColor=C.orange)}
                  onBlur={e=>(e.target.style.borderColor=C.gray200)} />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:C.gray400, display:'flex', padding:0 }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
              {/* Indicator putere */}
              {passStrength && (
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2 }}>
                  <div style={{ flex:1, height:3, background:C.gray200, borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:passStrength.color,
                      width:`${passStrength.pct}%`, transition:'width .3s' }} />
                  </div>
                  <span style={{ fontSize:11, color:passStrength.color, fontWeight:500, minWidth:60, textAlign:'right' }}>
                    {passStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmare parolă */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={labelStyle}>Confirmă parola</label>
              <div style={{ position:'relative' }}>
                <input type={showConf ? 'text' : 'password'} required autoComplete="new-password"
                  placeholder="Repetă parola"
                  value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight:44,
                    borderColor: confirmPassword && confirmPassword !== password ? C.red : C.gray200 }}
                  onFocus={e=>(e.target.style.borderColor=C.orange)}
                  onBlur={e=>(e.target.style.borderColor=
                    confirmPassword && confirmPassword !== password ? C.red : C.gray200)} />
                <button type="button" onClick={()=>setShowConf(!showConf)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:C.gray400, display:'flex', padding:0 }}>
                  {showConf ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <span style={{ fontSize:12, color:C.red }}>Parolele nu coincid.</span>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', background:loading ? C.gray400 : C.orange,
                color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:500,
                fontFamily:C.sans, cursor:loading ? 'not-allowed' : 'pointer',
                transition:'background .15s', marginTop:6 }}
              onMouseEnter={e=>{ if(!loading) e.currentTarget.style.background=C.orangeDark }}
              onMouseLeave={e=>{ if(!loading) e.currentTarget.style.background=C.orange }}>
              {loading ? 'Se creează contul...' : 'Creează cont gratuit'}
            </button>

            <p style={{ fontSize:11, color:C.gray400, textAlign:'center', lineHeight:1.5 }}>
              Prin înregistrare ești de acord cu{' '}
              <Link href="/termeni" style={{ color:C.gray600, textDecoration:'underline' }}>Termenii</Link>
              {' '}și{' '}
              <Link href="/confidentialitate" style={{ color:C.gray600, textDecoration:'underline' }}>Confidențialitatea</Link>.
            </p>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:C.gray600 }}>
            Ai deja cont?{' '}
            <Link href="/auth/login" style={{ color:C.orange, fontWeight:500, textDecoration:'none' }}>
              Intră în cont
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          .auth-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
