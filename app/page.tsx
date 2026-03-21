import Link from 'next/link'
import HeroCalculator from '@/components/HeroCalculator'
import FaqSection from '@/components/FaqSection'

/* ─── Shared style helpers ────────────────────────────────────────────────── */
const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

/* ─── Icoane SVG inline (din HTML original) ──────────────────────────────── */
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round">
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  )
}

function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <div style={{ width:size, height:size, background:'#E8500A', borderRadius:7,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
        width={size*0.55} height={size*0.55}>
        <path d="M2 14L8 2L14 14M5 10H11" stroke="white" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

/* ─── Check icon pentru pricing/features ─────────────────────────────────── */
function Check({ orange = false }: { orange?: boolean }) {
  return (
    <div style={{
      width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:1,
      background: orange ? 'rgba(232,80,10,0.2)' : '#E8F5EE',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 3l2 2 4-4" stroke={orange ? '#E8500A' : '#2A7D4F'}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── Scroll + pulse animations ── */}
      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:.5; transform:scale(.8); }
        }
        .reveal {
          opacity:0; transform:translateY(24px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .reveal.visible { opacity:1; transform:none; }
        .reveal-d1 { transition-delay:.1s; }
        .reveal-d2 { transition-delay:.2s; }
        .reveal-d3 { transition-delay:.3s; }
        .reveal-d4 { transition-delay:.4s; }
        .faq-a {
          max-height:0; overflow:hidden;
          transition: max-height .3s ease, padding .3s ease;
          font-size:15px; color:#6B6860; line-height:1.65;
          font-weight:300;
        }
        .faq-item.open .faq-a { max-height:200px; padding-top:14px; }
        .faq-item.open .faq-icon { background:#1E2329; color:#FAFAF8; transform:rotate(45deg); }
        .feat-card:hover { box-shadow:0 8px 32px rgba(0,0,0,0.07); transform:translateY(-2px); }
        .price-card-hover:hover { box-shadow:0 8px 32px rgba(0,0,0,0.07); }
        .tt-item-line:not(:last-child)::before {
          content:''; position:absolute; left:19px; top:40px; bottom:0;
          width:1px; background:#E5E3DE;
        }
        @media (max-width:900px) {
          .hero-grid { grid-template-columns:1fr !important; gap:48px !important; }
          .stats-inner { grid-template-columns:repeat(2,1fr) !important; }
          .contrast-grid { grid-template-columns:1fr !important; }
          .workflow-steps { grid-template-columns:1fr !important; }
          .workflow-line { display:none !important; }
          .features-grid { grid-template-columns:repeat(2,1fr) !important; }
          .terrain-grid { grid-template-columns:1fr !important; }
          .testi-grid { grid-template-columns:1fr !important; }
          .pricing-grid { grid-template-columns:1fr !important; }
          .footer-inner { grid-template-columns:1fr 1fr !important; }
          .hero-h1 { font-size:40px !important; }
          .section-title { font-size:32px !important; }
        }
        @media (max-width:600px) {
          .hero-section { padding:100px 20px 64px !important; }
          .section-pad { padding:64px 20px !important; }
          .footer-inner { grid-template-columns:1fr !important; gap:28px !important; }
          .features-grid { grid-template-columns:1fr !important; }
          .final-h2 { font-size:32px !important; }
        }
        .btn-primary:hover { background:#C43F06 !important; transform:translateY(-1px); }
        .btn-ghost:hover { background:rgba(255,255,255,0.05) !important; color:#FAFAF8 !important; }
        .btn-link-orange:hover { background:#C43F06 !important; }
        .btn-cta-white:hover { transform:translateY(-2px); }
        .footer-link:hover { color:rgba(255,255,255,0.8) !important; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="hero-section" style={{
        background:'#1E2329', minHeight:'100vh',
        display:'flex', flexDirection:'column',
        padding:'120px 32px 80px', position:'relative', overflow:'hidden',
        fontFamily: sans,
      }}>
        {/* BG decoration */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{
            position:'absolute', top:-200, right:-200, width:600, height:600,
            borderRadius:'50%',
            background:'radial-gradient(circle, rgba(232,80,10,0.08) 0%, transparent 70%)',
          }} />
        </div>

        <div className="hero-grid" style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:64,
          maxWidth:1160, margin:'0 auto', width:'100%', alignItems:'center',
          position:'relative', zIndex:1,
        }}>
          {/* Left */}
          <div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:7,
              background:'rgba(232,80,10,0.15)', border:'1px solid rgba(232,80,10,0.35)',
              color:'#F4835A', fontSize:12, fontWeight:500,
              padding:'5px 14px', borderRadius:100, marginBottom:28, letterSpacing:'.03em',
            }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#E8500A',
                animation:'pulse 2s infinite' }} />
              Funcționează pe orice telefon, acum
            </div>

            <h1 className="hero-h1" style={{
              fontFamily: serif, fontSize:58, lineHeight:1.08,
              color:'#FAFAF8', marginBottom:20, letterSpacing:'-.02em',
            }}>
              Știi <em style={{ fontStyle:'italic', color:'#E8500A' }}>exact cât costă</em>{' '}
              înainte să semnezi.
            </h1>

            <p style={{
              fontSize:17, lineHeight:1.65, color:'rgba(255,255,255,0.5)',
              marginBottom:40, maxWidth:420, fontWeight:300,
            }}>
              Devize precise, urmărire cheltuieli reale și oferte pentru beneficiari — de pe telefon,
              de pe șantier. Fără instalare, fără Excel, fără surprize.
            </p>

            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <a href="#calculator" className="btn-primary" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'#E8500A', color:'#FAFAF8', padding:'14px 28px',
                borderRadius:8, fontSize:15, fontWeight:500, textDecoration:'none',
                border:'none', cursor:'pointer', transition:'background .2s, transform .15s',
              }}>
                Calculează acum — gratuit <IconArrow />
              </a>
              <a href="#cum-functioneaza" className="btn-ghost" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'transparent', color:'rgba(255,255,255,0.6)',
                padding:'14px 24px', borderRadius:8, fontSize:15, fontWeight:400,
                textDecoration:'none', border:'1px solid rgba(255,255,255,0.12)',
                transition:'all .2s',
              }}>
                Cum funcționează
              </a>
            </div>

            <div style={{ marginTop:40, display:'flex', alignItems:'center', gap:20 }}>
              {['Fără card la înregistrare','Deviz complet în 5 minute'].map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:7,
                  fontSize:13, color:'rgba(255,255,255,0.35)' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:'#2A7D4F' }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — calculator */}
          <HeroCalculator />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background:'#F3F2EF', borderTop:'1px solid #E5E3DE', borderBottom:'1px solid #E5E3DE', fontFamily:sans }}>
        <div className="stats-inner" style={{
          maxWidth:1160, margin:'0 auto', padding:'36px 32px',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32,
        }}>
          {[
            { num:'2 min',  label:'de la idee la deviz estimativ' },
            { num:'1.100+', label:'articole de deviz în catalog' },
            { num:'0 lei',  label:'pentru primul proiect complet' },
            { num:'100%',   label:'funcțional pe telefon' },
          ].map((s, i) => (
            <div key={s.num} className={`reveal ${i > 0 ? `reveal-d${i}` : ''}`}
              style={{ textAlign:'center' }}>
              <div style={{ fontFamily:serif, fontSize:40, color:'#E8500A', lineHeight:1, marginBottom:6 }}>
                {s.num}
              </div>
              <div style={{ fontSize:13, color:'#6B6860', lineHeight:1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTRAST — DE CE E DIFERIT
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background:'#1E2329', padding:'96px 32px', fontFamily:sans }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'#E8500A', marginBottom:14 }}>De ce e diferit</p>
          <h2 className="section-title" style={{ fontFamily:serif, fontSize:44, lineHeight:1.1,
            letterSpacing:'-.02em', color:'#FAFAF8', marginBottom:18 }}>
            Nu e un alt program<br />de devize pentru birou.
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.45)', lineHeight:1.65,
            maxWidth:520, fontWeight:300 }}>
            Programele clasice au fost construite pentru proiectanți autorizați care stau la birou.
            Noi am construit pentru tine — pe teren, cu telefonul în buzunar.
          </p>

          <div className="contrast-grid reveal" style={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:2,
            marginTop:56, borderRadius:14, overflow:'hidden',
          }}>
            {/* Vechi */}
            <div style={{ padding:40, background:'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em',
                textTransform:'uppercase', marginBottom:24, paddingBottom:14,
                borderBottom:'1px solid rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.3)' }}>
                Deviz 360, WinDoc și restul
              </div>
              {[
                'Instalare pe Windows obligatorie — nu merge pe telefon',
                'Plătești 300–500 lei/lună înainte să vezi dacă ți se potrivește',
                'Interface din 2010 — dificil pe ecran mic, cu degetul',
                'Devizul rămâne captiv în program, greu de trimis cuiva',
                'Afli că ai depășit bugetul abia la sfârșitul lucrării',
                'Construit pentru a participa la licitații, nu pentru a lucra',
              ].map(item => (
                <div key={item} style={{ display:'flex', alignItems:'flex-start', gap:12,
                  marginBottom:18, fontSize:15, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
                    background:'rgba(192,57,43,0.2)', color:'#E57373',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>✕</div>
                  {item}
                </div>
              ))}
            </div>
            {/* BuildingCalc */}
            <div style={{ padding:40, background:'rgba(232,80,10,0.1)',
              border:'1px solid rgba(232,80,10,0.2)', borderRadius:14 }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em',
                textTransform:'uppercase', marginBottom:24, paddingBottom:14,
                borderBottom:'1px solid rgba(255,255,255,0.08)', color:'#E8500A' }}>
                BuildingCalc
              </div>
              {[
                'Funcționează pe orice telefon, direct din browser, acum',
                'Calculezi un deviz complet gratuit — cont opțional',
                'Construit pentru teren: 2 tap-uri pentru orice acțiune frecventă',
                'PDF instant și link pentru beneficiar, trimis pe WhatsApp în 10 secunde',
                'Alertă imediată când o etapă depășește bugetul planificat',
                'Construit pentru constructorul cu 3–15 angajați care execută lucrări',
              ].map(item => (
                <div key={item} style={{ display:'flex', alignItems:'flex-start', gap:12,
                  marginBottom:18, fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.5 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
                    background:'rgba(42,125,79,0.25)', color:'#66BB6A',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CUM FUNCȚIONEAZĂ
      ══════════════════════════════════════════════════════════════ */}
      <section id="cum-functioneaza" className="section-pad"
        style={{ background:'#FAFAF8', padding:'96px 32px', fontFamily:sans }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'#E8500A', marginBottom:14 }}>Cum funcționează</p>
          <h2 className="section-title" style={{ fontFamily:serif, fontSize:44, lineHeight:1.1,
            letterSpacing:'-.02em', color:'#1E2329', marginBottom:18 }}>
            De la suprafață la deviz<br />complet în 3 pași.
          </h2>
          <p style={{ fontSize:17, color:'#6B6860', lineHeight:1.65, maxWidth:520, fontWeight:300 }}>
            Nu trebuie să știi normative sau coduri tehnice. Selectezi lucrările, introduci cantitățile,
            aplici coeficienții tăi de profit.
          </p>

          <div className="workflow-steps" style={{
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:48,
            marginTop:64, position:'relative',
          }}>
            {/* Linia punctată între pași */}
            <div className="workflow-line" style={{
              position:'absolute', top:24,
              left:'calc(16.67% + 24px)', right:'calc(16.67% + 24px)',
              height:1,
              background:'repeating-linear-gradient(90deg, #E5E3DE 0, #E5E3DE 6px, transparent 6px, transparent 12px)',
            }} />
            {[
              { n:'1', active:true, title:'Creezi proiectul',
                desc:'Introduci numele, locația și coeficienții tăi — procent profit, cheltuieli indirecte, TVA. Totul configurat o dată, aplicat automat la orice calcul.' },
              { n:'2', active:false, title:'Adaugi articolele de lucru',
                desc:'Selectezi din catalogul de norme sau adaugi manual. Fiecare articol are rețeta completă de resurse — materiale, manoperă, utilaj — pe care o poți ajusta la prețurile tale reale.' },
              { n:'3', active:false, title:'Urmărești și trimiți',
                desc:'Pe măsură ce lucrarea avansează, înregistrezi achizițiile reale. Aplicația compară automat cu devizul planificat și îți arată profitul în timp real.' },
            ].map((step, i) => (
              <div key={step.n} className={`reveal ${i > 0 ? `reveal-d${i*2}` : ''}`}>
                <div style={{
                  width:48, height:48, borderRadius:'50%',
                  background: step.active ? '#E8500A' : '#1E2329',
                  color:'#FAFAF8', display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:serif, fontSize:20, marginBottom:24, position:'relative', zIndex:1,
                }}>
                  {step.n}
                </div>
                <div style={{ fontSize:18, fontWeight:600, color:'#1E2329',
                  marginBottom:10, letterSpacing:'-.02em' }}>
                  {step.title}
                </div>
                <div style={{ fontSize:15, color:'#6B6860', lineHeight:1.6, fontWeight:300 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PE TEREN
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background:'#F3F2EF', padding:'96px 32px', fontFamily:sans }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'#E8500A', marginBottom:14 }}>Pe teren, în timp real</p>
          <h2 className="section-title" style={{ fontFamily:serif, fontSize:44, lineHeight:1.1,
            letterSpacing:'-.02em', color:'#1E2329', marginBottom:18 }}>
            Ziua unui constructor<br />cu BuildingCalc.
          </h2>
          <p style={{ fontSize:17, color:'#6B6860', lineHeight:1.65, maxWidth:520, fontWeight:300 }}>
            Nu funcționalități abstracte. Situații concrete din ziua ta de lucru.
          </p>

          <div className="terrain-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:48, marginTop:56, alignItems:'center' }}>
            {/* Timeline */}
            <div className="reveal" style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { time:'7:00', active:true, title:'Sosesc muncitorii',
                  desc:'Deschizi aplicația și vezi instant: ce urmează în deviz azi, ce materiale trebuie comandate, cât din buget e consumat pe fiecare etapă.' },
                { time:'9:00', active:true, title:'Furnizorul a scumpit betonul',
                  desc:'Actualizezi prețul în aplicație. Imediat îți arată: impact pe profit −4.800 lei. Decizi dacă renegociezi cu beneficiarul sau absorbi diferența.' },
                { time:'11:00', active:false, title:'Beneficiarul întreabă de situație',
                  desc:'Trimiți un link prin WhatsApp. El vede devizul simplificat, fără coduri tehnice: ce s-a executat, cât a costat, ce urmează.' },
                { time:'14:00', active:false, title:'Sosește factura de la furnizor',
                  desc:'O înregistrezi în 20 de secunde, direct din cameră. Aplicația îți spune instant dacă etapa e în buget sau a depășit limita.' },
                { time:'19:00', active:false, title:'Bilanțul zilei',
                  desc:'Verifici progresul față de deviz. Profitul estimat actualizat. Îți iei mâna de pe telefon știind că totul e înregistrat.' },
              ].map((item, idx, arr) => (
                <div key={item.time} className="tt-item-line"
                  style={{ display:'flex', gap:20, paddingBottom:28, position:'relative' }}>
                  <div style={{
                    width:38, height:38, borderRadius:'50%', flexShrink:0,
                    background: item.active ? '#E8500A' : '#F3F2EF',
                    border: item.active ? '2px solid #E8500A' : '2px solid #E5E3DE',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, fontWeight:600,
                    color: item.active ? '#FAFAF8' : '#6B6860',
                    letterSpacing:'-.02em',
                  }}>
                    {item.time}
                  </div>
                  <div style={{ paddingTop:6 }}>
                    <div style={{ fontSize:15, fontWeight:600, color:'#1E2329',
                      marginBottom:4, letterSpacing:'-.01em' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize:14, color:'#6B6860', lineHeight:1.55, fontWeight:300 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phone mockup */}
            <div className="reveal reveal-d2">
              <div style={{ background:'#1E2329', borderRadius:32, padding:24,
                maxWidth:300, margin:'0 auto', boxShadow:'0 40px 80px rgba(0,0,0,0.25)' }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
                  <div style={{ width:80, height:6, background:'rgba(255,255,255,0.15)', borderRadius:3 }} />
                </div>
                {/* Alert */}
                <div style={{ background:'rgba(232,80,10,0.15)', border:'1px solid rgba(232,80,10,0.3)',
                  borderRadius:8, padding:'14px 16px', marginBottom:12 }}>
                  <div style={{ fontSize:11, color:'#F4835A', fontWeight:600, letterSpacing:'.04em',
                    textTransform:'uppercase', marginBottom:5 }}>⚠ Alertă buget</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.45 }}>
                    Etapa Fundație a depășit bugetul
                  </div>
                  <div style={{ fontFamily:serif, fontSize:22, color:'#E57373', marginTop:6 }}>
                    −4.800 lei profit
                  </div>
                </div>
                {/* Cards */}
                {[
                  { label:'Cheltuit azi', val:'12.400 lei' },
                  { label:'Profit estimat', val:'38.200 lei', green:true },
                ].map(c => (
                  <div key={c.label} style={{ background:'rgba(255,255,255,0.06)', borderRadius:8,
                    padding:'14px 16px', marginBottom:8 }}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize:15, fontWeight:600, color: c.green ? '#66BB6A' : '#FAFAF8' }}>
                      {c.val}
                    </div>
                  </div>
                ))}
                {/* Progress */}
                <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:8, padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:12 }}>
                    <span style={{ color:'rgba(255,255,255,0.45)' }}>Progres deviz</span>
                    <span style={{ color:'#FAFAF8', fontWeight:500 }}>67%</span>
                  </div>
                  <div style={{ height:4, background:'rgba(255,255,255,0.1)', borderRadius:2 }}>
                    <div style={{ height:'100%', width:'67%', background:'#E8500A', borderRadius:2 }} />
                  </div>
                </div>
                <div style={{ marginTop:12, background:'rgba(255,255,255,0.06)', borderRadius:8,
                  padding:'12px 16px' }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>
                    Link beneficiar trimis
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#66BB6A' }}>
                    Văzut · Acum 12 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════ */}
      <section id="functionalitati" className="section-pad"
        style={{ background:'#F3F2EF', padding:'96px 32px', fontFamily:sans }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'#E8500A', marginBottom:14 }}>Funcționalități</p>
          <h2 className="section-title" style={{ fontFamily:serif, fontSize:44, lineHeight:1.1,
            letterSpacing:'-.02em', color:'#1E2329', marginBottom:18 }}>
            Tot ce ai nevoie.<br />Nimic ce nu folosești.
          </h2>
          <p style={{ fontSize:17, color:'#6B6860', lineHeight:1.65, maxWidth:520, fontWeight:300 }}>
            Fiecare funcție a fost gândită dintr-o situație reală de pe șantier,
            nu din specificații tehnice abstracte.
          </p>

          <div className="features-grid" style={{ display:'grid',
            gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:56 }}>
            {[
              { title:'Catalog 1.100+ articole', highlight:false,
                badge:'', badgeText:'',
                desc:'Norme românești complete — fundații, structură, zidărie, finisaje, instalații — cu consumuri precise și prețuri calibrate la piața din 2026.',
                icon:<path d="M9 12h6M9 16h6M3 8V6a2 2 0 012-2h14a2 2 0 012 2v2M3 8h18M3 8v12a2 2 0 002 2h14a2 2 0 002-2V8"/> },
              { title:'Urmărire cheltuieli reale', highlight:false,
                badge:'green', badgeText:'Diferențiator cheie',
                desc:'Înregistrezi fiecare achiziție direct din aplicație. Comparația automată cu devizul planificat îți arată abaterile pe etape și impactul pe profit.',
                icon:<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/> },
              { title:'Alertă depășire buget', highlight:true,
                badge:'green', badgeText:'Exclusiv BuildingCalc',
                desc:'În momentul în care o achiziție duce o etapă peste bugetul planificat, primești alertă cu impactul exact pe profitul final. Nu la sfârșit — acum.',
                icon:<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> },
              { title:'Foto la fiecare achiziție', highlight:false,
                badge:'green', badgeText:'Unic în piață',
                desc:'Atașezi bonul fiscal sau poza materialului direct din cameră. Dovadă pentru bancă sau beneficiar, organizată automat pe etape.',
                icon:<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/> },
              { title:'Link pentru beneficiar', highlight:false,
                badge:'', badgeText:'',
                desc:'Un link trimis pe WhatsApp. Beneficiarul vede devizul tradus în limbaj simplu — fără coduri tehnice, fără să-l plictisești cu TsCA01C1 la telefon.',
                icon:<path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/> },
              { title:'Export PDF și Excel', highlight:false,
                badge:'', badgeText:'',
                desc:'Devizul generat în PDF cu antet, recapitulație și TVA conform standardelor românești. Export Excel pentru a trimite la bancă sau la antreprenorul general.',
                icon:<path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/> },
              { title:'Smart Calculator', highlight:false,
                badge:'', badgeText:'',
                desc:'Introduci dimensiunile casei — lungime, lățime, înălțime, adâncime fundație — și aplicația calculează automat cantitățile de beton, cofraje și armătură.',
                icon:<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/> },
              { title:'Comparator furnizori', highlight:false,
                badge:'', badgeText:'',
                desc:'Adaugi prețurile de la 3 furnizori pentru același material. Aplicația selectează automat cel mai ieftin și recalculează totalul devizului instant.',
                icon:<path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/> },
              { title:'Import extras cantități', highlight:false,
                badge:'', badgeText:'',
                desc:'Proiectantul ți-a dat un extras de cantități în Excel? Îl încarci, mapezi coloanele și articolele intră automat în deviz. Fără tastare manuală rând cu rând.',
                icon:<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/> },
            ].map((f, i) => (
              <div key={f.title}
                className={`feat-card reveal ${i % 3 > 0 ? `reveal-d${i % 3}` : ''}`}
                style={{
                  background: f.highlight ? '#1E2329' : '#FAFAF8',
                  border: f.highlight ? 'none' : '1px solid #E5E3DE',
                  borderRadius:14, padding:28,
                  transition:'box-shadow .2s, transform .2s',
                }}>
                <div style={{ width:44, height:44, borderRadius:10,
                  background: f.highlight ? 'rgba(232,80,10,0.2)' : '#FFF0E8',
                  display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
                    stroke="#E8500A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {f.icon}
                  </svg>
                </div>
                <div style={{ fontSize:16, fontWeight:600, letterSpacing:'-.01em', marginBottom:8,
                  color: f.highlight ? '#FAFAF8' : '#1E2329' }}>
                  {f.title}
                </div>
                <div style={{ fontSize:14, lineHeight:1.6, fontWeight:300,
                  color: f.highlight ? 'rgba(255,255,255,0.45)' : '#6B6860' }}>
                  {f.desc}
                </div>
                {f.badgeText && (
                  <div style={{ display:'inline-block', marginTop:14, fontSize:11, fontWeight:500,
                    padding:'3px 10px', borderRadius:100,
                    background:'rgba(42,125,79,0.1)', color:'#2A7D4F', letterSpacing:'.02em' }}>
                    {f.badgeText}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALE
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background:'#1E2329', padding:'96px 32px', fontFamily:sans }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'#E8500A', marginBottom:14 }}>Ce spun constructorii</p>
          <h2 className="section-title" style={{ fontFamily:serif, fontSize:44, lineHeight:1.1,
            letterSpacing:'-.02em', color:'#FAFAF8', marginBottom:18 }}>
            Din teren, nu din<br />prezentări de vânzări.
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.4)', lineHeight:1.65,
            maxWidth:520, fontWeight:300 }}>
            Feedback real de la constructori care lucrează cu aplicația.
          </p>

          <div className="testi-grid" style={{ display:'grid',
            gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:56 }}>
            {[
              { initials:'MD', name:'Marius D.', role:'Constructor civil, Timiș · 7 lucrări/an', delay:'',
                quote:'"Înainte știam dacă am câștigat sau pierdut abia după ce terminam lucrarea. Acum văd în timp real. Pe fundație am prins că ieșeam în minus și am renegociat."' },
              { initials:'CR', name:'Cosmin R.', role:'Antreprenor finisaje, Arad · 12 lucrări/an', delay:'reveal-d2',
                quote:'"Clientul mă suna zilnic să știe ce s-a executat și cât s-a cheltuit. Acum îi trimit un link și gata. A încetat cu telefoanele, eu am câștigat 2 ore pe săptămână."' },
              { initials:'AV', name:'Alexandru V.', role:'Constructor case individuale, Cluj · 5 lucrări/an', delay:'reveal-d4',
                quote:'"Am instalat Windoc Deviz, am stat 3 ore să înțeleg cum funcționează, am renunțat. Asta am deschis pe telefon și în 20 de minute aveam devizul complet."' },
            ].map(t => (
              <div key={t.name} className={`reveal ${t.delay}`} style={{
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:14, padding:28,
              }}>
                <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ width:14, height:14, background:'#E8500A',
                      clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />
                  ))}
                </div>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.65,
                  marginBottom:20, fontWeight:300, fontStyle:'italic' }}>
                  {t.quote}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#E8500A',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, fontWeight:600, color:'#FAFAF8', flexShrink:0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, color:'#FAFAF8' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════════════ */}
      <section id="preturi" className="section-pad"
        style={{ background:'#F3F2EF', padding:'96px 32px', fontFamily:sans }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'#E8500A', marginBottom:14 }}>Prețuri</p>
          <h2 className="section-title" style={{ fontFamily:serif, fontSize:44, lineHeight:1.1,
            letterSpacing:'-.02em', color:'#1E2329', marginBottom:18 }}>
            Simplu și transparent.
          </h2>
          <p style={{ fontSize:17, color:'#6B6860', lineHeight:1.65, maxWidth:520, fontWeight:300 }}>
            Niciun cost ascuns. Plătești când ești convins că merită.
          </p>

          <div className="pricing-grid" style={{ display:'grid',
            gridTemplateColumns:'1fr 1.1fr 1fr', gap:20, marginTop:56, alignItems:'start' }}>

            {/* Gratuit */}
            <div className="price-card-hover reveal" style={{
              background:'#FAFAF8', border:'1px solid #E5E3DE',
              borderRadius:14, padding:32, transition:'box-shadow .2s',
            }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#6B6860', letterSpacing:'.06em',
                textTransform:'uppercase', marginBottom:20 }}>Gratuit</div>
              <div style={{ fontFamily:serif, fontSize:48, color:'#1E2329', lineHeight:1, marginBottom:4 }}>
                0 <sup style={{ fontSize:24, verticalAlign:'top', marginTop:10, display:'inline-block' }}>lei</sup>
              </div>
              <div style={{ fontSize:13, color:'#A8A59E', marginBottom:28 }}>pentru totdeauna</div>
              <div style={{ height:1, background:'#E5E3DE', marginBottom:24 }} />
              <ul style={{ listStyle:'none', marginBottom:28 }}>
                {['1 proiect activ complet','Calculator estimare rapidă',
                  'Catalog 20 articole standard','Export PDF deviz',
                  'Urmărire cheltuieli de bază'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:10,
                    fontSize:14, color:'#2E2D2A', marginBottom:12, lineHeight:1.45, fontWeight:300 }}>
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" style={{
                display:'block', width:'100%', padding:13, borderRadius:8,
                fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:sans,
                textAlign:'center', textDecoration:'none',
                border:'1px solid #E5E3DE', background:'#FAFAF8', color:'#1E2329',
                transition:'all .2s',
              }}>Începe gratuit</Link>
            </div>

            {/* Constructor — featured */}
            <div className="reveal reveal-d2" style={{
              background:'#1E2329', border:'none', borderRadius:14,
              padding:32, position:'relative',
            }}>
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)',
                background:'#E8500A', color:'#FAFAF8', fontSize:11, fontWeight:600,
                padding:'4px 16px', borderRadius:100, whiteSpace:'nowrap', letterSpacing:'.04em' }}>
                Cel mai ales
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.45)',
                letterSpacing:'.06em', textTransform:'uppercase', marginBottom:20 }}>Constructor</div>
              <div style={{ fontFamily:serif, fontSize:48, color:'#FAFAF8', lineHeight:1, marginBottom:4 }}>
                69 <sup style={{ fontSize:24, verticalAlign:'top', marginTop:10, display:'inline-block' }}>lei</sup>
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:28 }}>
                / lună · facturat lunar
              </div>
              <div style={{ height:1, background:'rgba(255,255,255,0.1)', marginBottom:24 }} />
              <ul style={{ listStyle:'none', marginBottom:28 }}>
                {['Proiecte nelimitate','Catalog complet 1.100+ articole',
                  'Urmărire cheltuieli reale + alerte','Fotografii la achiziții',
                  'Link read-only pentru beneficiar','Import extras cantități Excel',
                  'Comparator prețuri furnizori','Export Excel și PDF profesional'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:10,
                    fontSize:14, color:'rgba(255,255,255,0.65)', marginBottom:12,
                    lineHeight:1.45, fontWeight:300 }}>
                    <Check orange /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-link-orange" style={{
                display:'block', width:'100%', padding:13, borderRadius:8, fontSize:14,
                fontWeight:600, cursor:'pointer', fontFamily:sans, textAlign:'center',
                textDecoration:'none', background:'#E8500A', color:'#FAFAF8',
                border:'none', transition:'background .2s',
              }}>
                14 zile gratuit, apoi 69 lei/lună
              </Link>
            </div>

            {/* Echipă */}
            <div className="price-card-hover reveal reveal-d4" style={{
              background:'#FAFAF8', border:'1px solid #E5E3DE',
              borderRadius:14, padding:32, transition:'box-shadow .2s',
            }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#6B6860', letterSpacing:'.06em',
                textTransform:'uppercase', marginBottom:20 }}>Echipă</div>
              <div style={{ fontFamily:serif, fontSize:48, color:'#1E2329', lineHeight:1, marginBottom:4 }}>
                149 <sup style={{ fontSize:24, verticalAlign:'top', marginTop:10, display:'inline-block' }}>lei</sup>
              </div>
              <div style={{ fontSize:13, color:'#A8A59E', marginBottom:28 }}>/ lună · până la 5 utilizatori</div>
              <div style={{ height:1, background:'#E5E3DE', marginBottom:24 }} />
              <ul style={{ listStyle:'none', marginBottom:28 }}>
                {['Tot din planul Constructor','5 conturi utilizatori',
                  'Jurnal de șantier partajat','Rapoarte avans per utilizator',
                  'Catalog propriu de articole','Suport prioritar'].map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:10,
                    fontSize:14, color:'#2E2D2A', marginBottom:12, lineHeight:1.45, fontWeight:300 }}>
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" style={{
                display:'block', width:'100%', padding:13, borderRadius:8,
                fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:sans,
                textAlign:'center', textDecoration:'none',
                border:'1px solid #E5E3DE', background:'#FAFAF8', color:'#1E2329',
                transition:'all .2s',
              }}>Începe perioada de test</Link>
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:28, fontSize:14, color:'#A8A59E' }}>
            Toate prețurile includ TVA. Poți anula oricând. Fără contracte pe termen lung.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════ */}
      <FaqSection />

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background:'#E8500A', padding:'80px 32px', textAlign:'center', fontFamily:sans }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <h2 className="final-h2" style={{ fontFamily:serif, fontSize:48, color:'#FAFAF8',
            lineHeight:1.1, marginBottom:16, letterSpacing:'-.02em' }}>
            Primul deviz, gratuit.<br />Acum, de pe telefon.
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.7)', marginBottom:36, fontWeight:300 }}>
            Fără instalare. Fără card. Fără să citești un manual.<br />Deviz complet în 5 minute.
          </p>
          <Link href="/auth/register" className="btn-cta-white" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'#FAFAF8', color:'#E8500A', padding:'16px 32px',
            borderRadius:8, fontSize:16, fontWeight:600, textDecoration:'none',
            border:'none', fontFamily:sans, transition:'transform .15s',
          }}>
            Creează cont gratuit <IconArrow />
          </Link>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:16 }}>
            Cont gratuit · Fără card · Deviz complet în 5 minute
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer style={{ background:'#1E2329', padding:'48px 32px', fontFamily:sans }}>
        <div className="footer-inner" style={{
          maxWidth:1160, margin:'0 auto',
          display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48,
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <LogoMark />
              <span style={{ fontFamily:sans, fontWeight:600, fontSize:16, color:'#FAFAF8',
                letterSpacing:'-.02em' }}>
                Building<span style={{ color:'#E8500A' }}>Calc</span>
              </span>
            </div>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', lineHeight:1.65,
              marginTop:16, fontWeight:300, maxWidth:260 }}>
              Devize de construcții pentru oamenii care execută lucrări,
              nu pentru cei care stau la birou.
            </p>
          </div>
          {[
            { title:'Produs', links:['Funcționalități','Prețuri','Catalog norme','Actualizări'] },
            { title:'Suport', links:['Ghid utilizare','Întrebări frecvente','Contact'] },
            { title:'Legal', links:['Termeni și condiții','Politică confidențialitate','GDPR'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)',
                letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>
                {col.title}
              </div>
              {col.links.map(l => (
                <a key={l} href="#" className="footer-link" style={{
                  display:'block', fontSize:14, color:'rgba(255,255,255,0.4)',
                  textDecoration:'none', marginBottom:10, transition:'color .15s' }}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth:1160, margin:'40px auto 0', paddingTop:24,
          borderTop:'1px solid rgba(255,255,255,0.06)',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>
            © 2026 BuildingCalc. Toate drepturile rezervate.
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>
            Construit în România, pentru România
          </div>
        </div>
      </footer>

      {/* Scroll reveal script */}
      <script dangerouslySetInnerHTML={{ __html: `
        var obs = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
        },{threshold:.1});
        document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
      `}} />
    </>
  )
}
