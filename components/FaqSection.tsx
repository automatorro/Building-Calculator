'use client'

import { useState } from 'react'

const faqs = [
  { q:'Pot folosi aplicația fără să mă înregistrez?',
    a:'Da. Calculatorul de estimare din pagina principală funcționează fără cont. Pentru a salva devize, urmări cheltuieli și genera PDF-uri ai nevoie de un cont gratuit — care se creează în 30 de secunde, fără card.' },
  { q:'Cât de exacte sunt prețurile din catalog?',
    a:'Catalogul folosește normele de deviz republicane (consumuri fizice) și prețuri calibrate la piața din vestul României în 2026. Prețurile materiale și manoperă le poți ajusta în orice moment la valorile tale reale — de la furnizori sau din ofertele primite. Consumurile rămân conforme normativelor standard.' },
  { q:'Pot genera devize conform HG 907/2016 pentru licitații publice?',
    a:'BuildingCalc este optimizat pentru constructorii privați care execută lucrări pentru beneficiari persoane fizice sau companii private. Pentru licitații publice cu cerințe stricte de conformitate (formulare F1-F5, vizare experți), recomandăm WinDoc Deviz sau Deviz 360 care sunt certificate pentru acea utilizare specifică.' },
  { q:'Funcționează pe iPhone și Android?',
    a:'Da, pe orice telefon sau tabletă cu un browser modern (Chrome, Safari, Firefox). Nu necesită instalare. Interfața este optimizată pentru ecrane mici — toate acțiunile frecvente sunt accesibile în maximum 2 tap-uri.' },
  { q:'Ce se întâmplă dacă anulez abonamentul?',
    a:'Datele tale rămân în cont și poți continua să le vizualizezi. Funcționalitățile premium se dezactivează și treci pe planul Gratuit — cu acces la un proiect activ. Poți reactiva abonamentul oricând fără să pierzi nimic din istoricul de proiecte.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom:'1px solid #E5E3DE', padding:'24px 0', cursor:'pointer' }}
      onClick={() => setOpen(!open)}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
        gap:20, fontSize:16, fontWeight:500, color:'#1E2329', letterSpacing:'-.01em' }}>
        {q}
        <div style={{
          width:24, height:24, borderRadius:'50%', flexShrink:0,
          background: open ? '#1E2329' : '#F3F2EF',
          color: open ? '#FAFAF8' : '#A8A59E',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, transition:'all .2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</div>
      </div>
      {open && (
        <div style={{ fontSize:15, color:'#6B6860', lineHeight:1.65,
          fontWeight:300, paddingTop:14 }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FaqSection() {
  return (
    <section style={{ background:'#FAFAF8', padding:'96px 32px',
      fontFamily:'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)' }}>
      <div style={{ maxWidth:1160, margin:'0 auto' }}>
        <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
          color:'#E8500A', marginBottom:14, textAlign:'center' }}>Întrebări frecvente</p>
        <h2 style={{ fontFamily:'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
          fontSize:44, lineHeight:1.1, letterSpacing:'-.02em', color:'#1E2329',
          marginBottom:56, textAlign:'center' }}>
          Ai o întrebare?
        </h2>
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          {faqs.map(faq => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
