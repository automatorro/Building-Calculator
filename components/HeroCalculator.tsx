'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

/* ─── Logica de calcul — identică cu JS-ul din HTML ──────────────────────── */
const REGIM_MULT = [1.0, 1.07, 1.13]
const FIN_BASE   = [4000, 5500, 7500]   // lei/mp fără TVA
const FIN_LABEL  = ['~800 EUR/mp', '~1.100 EUR/mp', '~1.500 EUR/mp']
const EUR_RATE   = 5.0

function fmt(n: number) {
  return Math.round(n).toLocaleString('ro-RO')
}

export default function HeroCalculator() {
  const [mp,     setMp]     = useState(150)
  const [regim,  setRegim]  = useState(0)   // 0=Parter, 1=P+1, 2=P+2
  const [fin,    setFin]    = useState(1)   // 0=Economic, 1=Standard, 2=Premium

  /* Calcul live */
  const perMp    = Math.round(FIN_BASE[fin] * REGIM_MULT[regim])
  const total    = mp * perMp
  const struct   = total * 0.38
  const finCost  = total * 0.42
  const inst     = total * 0.20
  const perMpEur = Math.round(perMp / EUR_RATE)

  /* Stiluri inline refolosibile */
  const S = {
    wrapper: {
      background: '#FAFAF8',
      borderRadius: 20,
      padding: 32,
      boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
    } as React.CSSProperties,

    label: {
      fontSize: 12,
      fontWeight: 500,
      color: '#6B6860',
      marginBottom: 8,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
    } as React.CSSProperties,

    btnGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 6,
    } as React.CSSProperties,
  }

  function bgBtn(active: boolean): React.CSSProperties {
    return {
      padding: '9px 4px',
      border: `1px solid ${active ? '#E8500A' : '#E5E3DE'}`,
      borderRadius: 8,
      fontSize: 13,
      fontWeight: active ? 500 : 400,
      color: active ? '#FAFAF8' : '#6B6860',
      background: active ? '#E8500A' : '#FAFAF8',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all .15s',
      fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
    }
  }

  return (
    <div style={S.wrapper} id="calculator">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:'#1E2329', letterSpacing:'-.01em' }}>
          Calculator estimare rapidă
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#2A7D4F', fontWeight:500 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#2A7D4F',
            animation:'pulse 2s infinite' }} />
          Calculează live
        </div>
      </div>

      {/* Slider suprafață */}
      <div style={{ marginBottom:20 }}>
        <div style={S.label}>Suprafață desfășurată (mp)</div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <input
            type="range" min={60} max={500} step={5} value={mp}
            onChange={e => setMp(parseInt(e.target.value))}
            style={{
              flex:1, WebkitAppearance:'none', appearance:'none',
              height:4, background:'#E5E3DE', borderRadius:2, outline:'none', cursor:'pointer',
            }}
          />
          <span style={{ fontSize:14, fontWeight:600, color:'#1E2329', minWidth:64, textAlign:'right' }}>
            {mp} mp
          </span>
        </div>
      </div>

      {/* Regim înălțime */}
      <div style={{ marginBottom:16 }}>
        <div style={S.label}>Regim înălțime</div>
        <div style={S.btnGroup}>
          {(['Parter','P+1','P+2'] as const).map((label, i) => (
            <button key={i} onClick={() => setRegim(i)} style={bgBtn(regim === i)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel finisaje */}
      <div style={{ marginBottom:0 }}>
        <div style={S.label}>Nivel finisaje</div>
        <div style={S.btnGroup}>
          {(['Economic','Standard','Premium'] as const).map((label, i) => (
            <button key={i} onClick={() => setFin(i)} style={bgBtn(fin === i)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Result display */}
      <div style={{ background:'#1E2329', borderRadius:8, padding:20, margin:'20px 0 16px' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:500,
          letterSpacing:'.06em', textTransform:'uppercase', marginBottom:8 }}>
          Cost estimat total
        </div>
        <div style={{
          fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
          fontSize:38, color:'#FAFAF8', lineHeight:1, marginBottom:4,
        }}>
          {fmt(total)} lei
        </div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
          {fmt(perMp)} lei / mp · ~{perMpEur.toLocaleString('ro-RO')} EUR/mp · fără TVA
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:20 }}>
        {[
          { label:'Structură',  value: fmt(struct)  },
          { label:'Finisaje',   value: fmt(finCost)  },
          { label:'Instalații', value: fmt(inst)     },
        ].map(({ label, value }) => (
          <div key={label} style={{ background:'#F3F2EF', borderRadius:8, padding:'10px 12px' }}>
            <div style={{ fontSize:11, color:'#A8A59E', marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1E2329' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/auth/register" style={{
        display:'block', width:'100%', background:'#E8500A', color:'#FAFAF8',
        border:'none', borderRadius:8, padding:14, fontSize:14, fontWeight:600,
        cursor:'pointer', fontFamily:'inherit', letterSpacing:'-.01em',
        textAlign:'center', textDecoration:'none', transition:'background .2s',
      }}
        onMouseEnter={e=>(e.currentTarget.style.background='#C43F06')}
        onMouseLeave={e=>(e.currentTarget.style.background='#E8500A')}>
        Creează deviz complet — gratuit →
      </Link>
      <p style={{ textAlign:'center', fontSize:12, color:'#A8A59E', marginTop:10 }}>
        Cont gratuit · Fără card · Deviz detaliat în câteva minute
      </p>

      {/* Slider thumb CSS */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #E8500A;
          box-shadow: 0 2px 6px rgba(232,80,10,0.4);
          cursor: pointer;
          transition: transform .1s;
        }
        input[type=range]::-webkit-slider-thumb:active { transform: scale(1.2); }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #E8500A;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
