'use client'

import { usePathname } from 'next/navigation'
import LogoMark from './LogoMark'

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'

export default function Footer({ variant = 'public' }: { variant?: 'public' | 'dashboard' }) {
  const pathname = usePathname()

  const isDashboardRoute = pathname.startsWith('/deviz') || 
                           pathname.startsWith('/offers') || 
                           pathname.startsWith('/timeline') || 
                           pathname.startsWith('/procurement') ||
                           pathname.startsWith('/estimator') ||
                           pathname.startsWith('/ocr')

  /* Ascunde footer pe pagini auth şi print */
  if (pathname.startsWith('/auth') || pathname.includes('/print')) return null

  /* Daca e randat in RootLayout dar suntem pe dashboard, hide (il randam manual in DashboardLayout) */
  if (variant === 'public' && isDashboardRoute) return null

  return (
    <footer style={{ 
      background: variant === 'dashboard' ? 'transparent' : '#374151', 
      padding: variant === 'dashboard' ? '40px 0' : '64px 32px', 
      fontFamily: sans,
      borderTop: variant === 'dashboard' ? '1px solid #E5E3DE' : 'none',
      marginTop: variant === 'dashboard' ? '40px' : '0'
    }}>
      <style>{`
        @media (max-width:900px) {
          .footer-inner { grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width:600px) {
          .footer-inner { grid-template-columns:1fr !important; gap:28px !important; }
        }
        .footer-link:hover { color: #E8500A !important; }
      `}</style>
      
      <div className="footer-inner" style={{
        maxWidth:1160, margin:'0 auto',
        display:'grid', gridTemplateColumns: variant === 'dashboard' ? '1.5fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr', gap:48,
      }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <LogoMark />
            <span style={{ fontFamily:sans, fontWeight:600, fontSize:16, color: variant === 'dashboard' ? '#1E2329' : '#FFFFFF',
              letterSpacing:'-.02em' }}>
              Șantier
            </span>
          </div>
          <p style={{ fontSize:15, color: variant === 'dashboard' ? '#6B6860' : '#FFFFFF', lineHeight:1.65,
            marginTop:16, fontWeight:400, maxWidth:280 }}>
            Software de devize gândit pentru echipele care construiesc —
            pe teren sau la birou.
          </p>
        </div>
        {[
          { 
            title:'Produs', 
            links:[
              { label: 'Funcționalități', href: '/#functionalitati' },
              { label: 'Prețuri', href: '/#preturi' },
              { label: 'Catalog norme', href: '/catalog' },
            ] 
          },
          { 
            title:'Suport', 
            links:[
              { label: 'Cum funcționează', href: '/cum-functioneaza' },
              { label: 'Întrebări frecvente', href: '/#faq' },
              { label: 'Contact', href: '/contact' },
            ] 
          },
          { 
            title:'Legal', 
            links:[
              { label: 'Termeni și condiții', href: '/termeni-si-conditii' },
              { label: 'Politică confidențialitate', href: '/politica-confidentialitate' },
              { label: 'GDPR', href: '/gdpr' },
            ] 
          },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize:13, fontWeight:700, color: variant === 'dashboard' ? '#A8A59E' : '#FFFFFF',
              letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>
              {col.title}
            </div>
            {col.links.map(l => (
              <a key={l.label} href={l.href} className="footer-link" style={{
                display:'block', fontSize:15, color: variant === 'dashboard' ? '#6B6860' : '#FFFFFF',
                textDecoration:'none', marginBottom:10, transition:'color .15s' }}>
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth:1160, margin:'40px auto 0', paddingTop:24,
        borderTop: variant === 'dashboard' ? '1px solid #E5E3DE' : '1px solid rgba(255,255,255,0.15)',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize:14, color: variant === 'dashboard' ? '#A8A59E' : 'rgba(255,255,255,0.8)' }}>
          © 2026 Șantier.app. Toate drepturile rezervate.
        </div>
        <div style={{ fontSize:14, color: variant === 'dashboard' ? '#A8A59E' : 'rgba(255,255,255,0.8)' }}>
          Construit în România, pentru România
        </div>
      </div>
    </footer>
  )
}
