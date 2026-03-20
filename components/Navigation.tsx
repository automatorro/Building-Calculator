'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#E8500A',
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.53)}
        height={Math.round(size * 0.53)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  )
}

const NAV_LINKS = [
  { label: 'Proiecte',      href: '/projects' },
  { label: 'Catalog norme', href: '/catalog' },
]

export default function Navigation() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [open, setOpen]   = useState(false)
  const [user, setUser]   = useState<any>(null)
  const [ready, setReady] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Ascunde nav pe pagini auth şi print */
  if (pathname.startsWith('/auth') || pathname.includes('/print')) return null

  const logout = async () => {
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  const S = {
    nav: {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: 60,
      background: 'rgba(14,16,19,0.96)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
    } as React.CSSProperties,

    link: (active: boolean): React.CSSProperties => ({
      color: active ? '#FAFAF8' : 'rgba(255,255,255,0.55)',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: active ? 500 : 400,
      transition: 'color .2s',
    }),

    ctaBtn: {
      background: '#E8500A',
      color: '#FAFAF8',
      padding: '8px 20px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'background .2s',
    } as React.CSSProperties,

    ghostBtn: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'rgba(255,255,255,0.55)',
      padding: '7px 10px',
      borderRadius: 8,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      transition: 'all .2s',
      fontFamily: 'inherit',
    } as React.CSSProperties,

    loginLink: {
      color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none',
      fontSize: 14,
      transition: 'color .2s',
    } as React.CSSProperties,
  }

  return (
    <>
      <div style={{ height: 60 }} /> {/* spacer */}

      <nav style={S.nav}>
        {/* ── Logo ── */}
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <LogoMark />
          <span style={{ fontWeight:600, fontSize:15, color:'#FAFAF8', letterSpacing:'-0.02em' }}>
            Building<span style={{ color:'#E8500A' }}>Calc</span>
          </span>
        </Link>

        {/* ── Links desktop ── */}
        <ul style={{ display:'flex', alignItems:'center', gap:28, listStyle:'none', margin:0, padding:0 }}
            className="bc-nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={S.link(pathname.startsWith(l.href))}
                onMouseEnter={e => (e.currentTarget.style.color = '#FAFAF8')}
                onMouseLeave={e => (e.currentTarget.style.color = pathname.startsWith(l.href) ? '#FAFAF8' : 'rgba(255,255,255,0.55)')}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── CTA desktop ── */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }} className="bc-nav-cta">
          {ready && (user ? (
            <>
              <Link href="/projects/new" style={S.ctaBtn as any}
                onMouseEnter={e=>(e.currentTarget.style.background='#C43F06')}
                onMouseLeave={e=>(e.currentTarget.style.background='#E8500A')}>
                + Proiect nou
              </Link>
              <button style={S.ghostBtn} onClick={logout} title="Ieşi din cont"
                onMouseEnter={e=>{e.currentTarget.style.color='#FAFAF8';e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}}
                onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.55)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={S.loginLink}
                onMouseEnter={e=>(e.currentTarget.style.color='#FAFAF8')}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.55)')}>
                Intră în cont
              </Link>
              <Link href="/auth/register" style={S.ctaBtn as any}
                onMouseEnter={e=>(e.currentTarget.style.background='#C43F06')}
                onMouseLeave={e=>(e.currentTarget.style.background='#E8500A')}>
                Încearcă gratuit
              </Link>
            </>
          ))}

          {/* ── Hamburger (vizibil doar pe mobile via CSS) ── */}
          <button onClick={()=>setOpen(true)} className="bc-hamburger"
            style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', padding:6, display:'none' }}
            aria-label="Meniu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      {open && (
        <>
          <div onClick={()=>setOpen(false)} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(14,16,19,0.75)', backdropFilter:'blur(4px)' }} />
          <div style={{
            position:'fixed', top:0, right:0, bottom:0, width:280, zIndex:201,
            background:'#1E2329', borderLeft:'1px solid rgba(255,255,255,0.07)',
            display:'flex', flexDirection:'column', padding:'24px 24px 32px',
            fontFamily:'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
          }}>
            {/* drawer header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
              <Link href="/" onClick={()=>setOpen(false)} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
                <LogoMark />
                <span style={{ fontWeight:600, fontSize:15, color:'#FAFAF8', letterSpacing:'-0.02em' }}>
                  Building<span style={{ color:'#E8500A' }}>Calc</span>
                </span>
              </Link>
              <button onClick={()=>setOpen(false)} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:8, color:'rgba(255,255,255,0.55)', cursor:'pointer', padding:8, display:'flex' }}>
                <X size={18} />
              </button>
            </div>

            {/* drawer links */}
            <nav style={{ flex:1 }}>
              {NAV_LINKS.map(l => {
                const active = pathname.startsWith(l.href)
                return (
                  <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} style={{
                    display:'block', padding:'14px 16px', borderRadius:10,
                    color: active ? '#FAFAF8' : 'rgba(255,255,255,0.55)',
                    textDecoration:'none', fontSize:16, fontWeight: active ? 500 : 400,
                    background: active ? 'rgba(232,80,10,0.12)' : 'transparent', marginBottom:4,
                  }}>
                    {l.label}
                  </Link>
                )
              })}
            </nav>

            {/* drawer CTA */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {user ? (
                <>
                  <Link href="/projects/new" onClick={()=>setOpen(false)} style={{
                    display:'block', background:'#E8500A', color:'#FAFAF8',
                    padding:'14px 20px', borderRadius:8, fontSize:15, fontWeight:500,
                    textDecoration:'none', textAlign:'center',
                  }}>+ Proiect nou</Link>
                  <button onClick={logout} style={{
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    background:'transparent', border:'1px solid rgba(255,255,255,0.12)',
                    color:'rgba(255,255,255,0.55)', padding:'12px 20px', borderRadius:8,
                    fontSize:14, cursor:'pointer', fontFamily:'inherit',
                  }}>
                    <LogOut size={15} /> Ieşi din cont
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/register" onClick={()=>setOpen(false)} style={{
                    display:'block', background:'#E8500A', color:'#FAFAF8',
                    padding:'14px 20px', borderRadius:8, fontSize:15, fontWeight:500,
                    textDecoration:'none', textAlign:'center',
                  }}>Încearcă gratuit</Link>
                  <Link href="/auth/login" onClick={()=>setOpen(false)} style={{
                    display:'block', background:'transparent',
                    border:'1px solid rgba(255,255,255,0.12)',
                    color:'rgba(255,255,255,0.55)', padding:'13px 20px',
                    borderRadius:8, fontSize:14, textDecoration:'none', textAlign:'center',
                  }}>Intră în cont</Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Mobile CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .bc-nav-links { display: none !important; }
          .bc-nav-cta > a, .bc-nav-cta > button:first-child { display: none !important; }
          .bc-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .bc-hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}
