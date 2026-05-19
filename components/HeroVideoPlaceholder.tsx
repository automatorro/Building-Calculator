'use client'

import Link from 'next/link'

/* ─────────────────────────────────────────────────────────────────────────────
   Placeholder video hero.

   Când fișierul video este gata:
   1. Pune fișierul MP4 la: /public/hero-demo.mp4
   2. Pune thumbnail-ul la: /public/hero-demo-thumb.jpg
   3. Înlocuiește <PlaceholderVisual /> cu:

   <video
     src="/hero-demo.mp4"
     poster="/hero-demo-thumb.jpg"
     autoPlay muted loop playsInline
     style={{ width:'100%', borderRadius:16, display:'block' }}
   />

───────────────────────────────────────────────────────────────────────────── */

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

function IconPlay() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

function PlaceholderVisual() {
  return (
    <div style={{
      position: 'relative',
      background: '#1E2329',
      borderRadius: 16,
      overflow: 'hidden',
      aspectRatio: '16/10',
      cursor: 'pointer',
    }}>
      {/* Simulare interfață app */}
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E57373' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFD54F' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#81C784' }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: sans }}>
            santier.app · Proiect: Vila Floreasca
          </div>
        </div>

        {/* Header proiect */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: serif, fontSize: 15, color: '#FFFFFF', marginBottom: 2 }}>
              Vila Floreasca · Deviz #3
            </div>
            <div style={{ fontSize: 10, color: '#2A7D4F', fontWeight: 600, fontFamily: sans }}>
              ● Activ · Actualizat acum
            </div>
          </div>
          <div style={{
            background: '#E8500A', color: '#FFFFFF', fontSize: 10, fontWeight: 700,
            padding: '3px 10px', borderRadius: 6, fontFamily: sans,
          }}>
            Profit: 38.200 lei
          </div>
        </div>

        {/* Alertă buget */}
        <div style={{
          background: 'rgba(232,80,10,0.15)', border: '1px solid rgba(232,80,10,0.35)',
          borderRadius: 8, padding: '8px 12px',
        }}>
          <div style={{ fontSize: 10, color: '#F4835A', fontWeight: 700, fontFamily: sans, marginBottom: 2 }}>
            ⚠ ALERTĂ BUGET — Fundații
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: sans }}>
            Depășit cu 4.800 lei · Impact profit: −12%
          </div>
        </div>

        {/* Etape deviz */}
        {[
          { label: 'Fundații', prog: 100, spent: '28.400', budget: '23.600', over: true },
          { label: 'Structură',  prog: 67,  spent: '41.200', budget: '68.000', over: false },
          { label: 'Finisaje',   prog: 0,   spent: '0',      budget: '54.000', over: false },
        ].map(row => (
          <div key={row.label} style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#FFFFFF', fontFamily: sans, fontWeight: 500 }}>
                {row.label}
              </span>
              <span style={{ fontSize: 10, color: row.over ? '#E57373' : 'rgba(255,255,255,0.5)', fontFamily: sans }}>
                {row.spent} / {row.budget} lei
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${row.prog}%`,
                background: row.over ? '#E57373' : row.prog > 0 ? '#E8500A' : 'transparent',
              }} />
            </div>
          </div>
        ))}

        {/* Bottom row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>TOTAL CHELTUIT</div>
            <div style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 700, fontFamily: serif }}>69.600 lei</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(42,125,79,0.15)', border: '1px solid rgba(42,125,79,0.3)', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 9, color: '#2A7D4F', fontFamily: sans, fontWeight: 600 }}>PROFIT ESTIMAT</div>
            <div style={{ fontSize: 13, color: '#81C784', fontWeight: 700, fontFamily: serif }}>38.200 lei</div>
          </div>
        </div>
      </div>

      {/* Play button overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(1px)',
        transition: 'background .2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
      >
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: '#E8500A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(232,80,10,0.5)',
          marginLeft: 4,
          transition: 'transform .15s',
        }}>
          <IconPlay />
        </div>
        <div style={{
          marginTop: 14, fontSize: 13, color: '#FFFFFF', fontFamily: sans,
          fontWeight: 500, letterSpacing: '.02em',
          background: 'rgba(0,0,0,0.4)', padding: '4px 14px', borderRadius: 100,
        }}>
          Video demo — în curând
        </div>
      </div>
    </div>
  )
}

export default function HeroVideoPlaceholder() {
  return (
    <div style={{
      background: '#FAFAF8',
      borderRadius: 20,
      padding: 24,
      boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1E2329', fontFamily: sans }}>
          Cum funcționează în practică
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, color: '#6B6860', fontFamily: sans,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6860" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ~45 sec.
        </div>
      </div>

      <PlaceholderVisual />

      {/* Bullet-uri rapide */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16, marginBottom: 18,
      }}>
        {[
          'Deviz complet din dimensiuni',
          'Cheltuieli vs. buget în timp real',
          'Alertă depășire pe etapă',
          'PDF și link pentru beneficiar',
        ].map(item => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 12, color: '#4A4744', fontFamily: sans,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
              background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                <path d="M1 3l2 2 4-4" stroke="#2A7D4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {item}
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/demo" style={{
        display: 'block', width: '100%', background: '#E8500A', color: '#FFFFFF',
        border: 'none', borderRadius: 8, padding: 14, fontSize: 15, fontWeight: 700,
        cursor: 'pointer', fontFamily: sans, letterSpacing: '-.01em',
        textAlign: 'center', textDecoration: 'none', transition: 'background .2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#C43F06')}
        onMouseLeave={e => (e.currentTarget.style.background = '#E8500A')}
      >
        Încearcă demo — fără cont →
      </Link>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#A8A59E', marginTop: 10, fontFamily: sans }}>
        Fără cont · Fără card · Cont gratuit când vrei să salvezi
      </p>
    </div>
  )
}
