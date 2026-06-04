import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cum funcționează Șantier.app — Ghid complet pas cu pas',
  description:
    'Cum funcționează Șantier.app: de la cererea de ofertă la bilanțul zilnic. Fluxul complet al unui proiect de construcții — devize, achiziții, urmărire cheltuieli, jurnal de șantier și export PDF.',
  alternates: {
    canonical: 'https://santier.app/cum-functioneaza',
  },
  openGraph: {
    title: 'Cum funcționează Șantier.app — Ghid complet',
    description:
      'De la cererea de ofertă la bilanțul zilnic. Fluxul complet al unui proiect de construcții cu Șantier.app.',
    url: 'https://santier.app/cum-functioneaza',
    type: 'website',
  },
}

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cum să creezi un deviz de construcții cu Șantier.app',
  description:
    'Ghid pas cu pas pentru crearea unui deviz profesional de construcții, urmărirea cheltuielilor reale și exportul PDF folosind Șantier.app.',
  inLanguage: 'ro',
  totalTime: 'PT10M',
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Șantier.app',
      url: 'https://santier.app',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Creează proiectul',
      text: 'Introduci numele proiectului, locația și coeficienții financiari: procent profit, cheltuieli indirecte (regie), TVA. Se configurează o singură dată și se aplică automat la orice calcul ulterior.',
      url: 'https://santier.app/cum-functioneaza#proiect',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Compune devizul din norme românești',
      text: 'Selectezi articolele din catalogul de 1.100+ norme românești de deviz sau le adaugi manual. Fiecare articol are rețeta completă de resurse — materiale, manoperă, utilaje — cu prețuri calibrate la piața din 2026.',
      url: 'https://santier.app/cum-functioneaza#deviz',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Ajustează rețetele cu prețurile tale',
      text: 'Aplici prețurile reale de la furnizorii tăi. Poți modifica consumurile, dezactiva resurse sau adăuga materiale proprii. Totul se recalculează instant prin tot lanțul.',
      url: 'https://santier.app/cum-functioneaza#retete',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Exportă și trimite beneficiarului',
      text: 'Generezi PDF-ul tehnic pentru arhiva ta și un link simplificat pentru beneficiar — fără coduri normative, fără prețuri unitare, fără procent de profit. Trimis pe WhatsApp în 10 secunde.',
      url: 'https://santier.app/cum-functioneaza#export',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Urmărești cheltuielile zilnic pe șantier',
      text: 'Pe măsură ce lucrarea avansează, înregistrezi achizițiile reale (manual sau prin scanarea facturii cu camera). Aplicația compară automat cu devizul planificat și îți arată profitul în timp real. La depășirea bugetului pe orice etapă, primești alertă instantă.',
      url: 'https://santier.app/cum-functioneaza#urmarire',
    },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://santier.app' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Cum funcționează',
      item: 'https://santier.app/cum-functioneaza',
    },
  ],
}

const steps = [
  {
    id: 'proiect',
    num: '01',
    title: 'Fluxul complet al unui proiect',
    desc: 'Din perspectiva constructorului român — de la momentul în care primești o cerere de ofertă până la finalizarea lucrării. Două faze mari: pregătirea (la birou) și execuția (pe șantier).',
    details: [
      {
        phase: 'FAZA 1 — PREGĂTIRE (birou / acasă)',
        color: '#2A7D4F',
        bgColor: '#E8F5EE',
        items: [
          { title: 'Cerere de ofertă', sub: 'Clientul trimite planuri' },
          { title: 'Creezi proiect', sub: 'Nume, coeficienți, TVA' },
          { title: 'Compui devizul', sub: 'Catalog norme + manual' },
          { title: 'Ajustezi rețetele', sub: 'Prețuri reale, pierderi' },
        ],
        outputs: ['→ Trimiți ofertă beneficiar', '→ Export PDF / Excel', '→ Link WhatsApp beneficiar'],
      },
      {
        phase: 'FAZA 2 — EXECUȚIE (pe șantier, zilnic)',
        color: '#E8500A',
        bgColor: '#FFF0E8',
        items: [
          { title: 'Dashboard dimineață', sub: 'Ce urmează, ce lipsește' },
          { title: 'Înregistrezi achiziții', sub: 'Sumă + etapă + poză bon' },
          { title: 'Alertă depășire buget', sub: 'Impact imediat pe profit', alert: true },
          { title: 'Bilanț zilnic', sub: 'Cheltuit vs planificat' },
        ],
        outputs: ['→ Jurnal de șantier', '→ Raport progres echipă'],
      },
    ],
  },
  {
    id: 'deviz',
    num: '02',
    title: 'Coeficienții care contează',
    desc: 'Fiecare proiect are propriii coeficienți financiari: cheltuieli indirecte (regie), procent profit și TVA. Configurezi o singură dată — aplicația le propagă automat prin formula completă de recapitulație la fiecare calcul.',
    content: `Recapitulația unui deviz de 100.000 lei cost direct, cu regie 10%, profit 5% și TVA 21%:

• Cost direct (materiale + manoperă + utilaje): 100.000 lei
• Cheltuieli indirecte — regie 10%: +10.000 lei  
• Profit 5% (aplicat la cost direct + regie): +5.500 lei
• Total fără TVA: 115.500 lei
• TVA 21%: +24.255 lei
• Total general (ofertă beneficiar): 139.755 lei
• Profit net constructor: 5.500 lei (3,9% din ofertă)

Poți modifica oricând coeficienții per proiect — nu per articol.`,
  },
  {
    id: 'retete',
    num: '03',
    title: 'Rețeta fiecărei lucrări, sub control total',
    desc: 'Fiecare articol de deviz are o rețetă completă de resurse — materiale, manoperă, utilaje. Editezi orice câmp, dezactivezi o resursă, schimbi un preț — totul se recalculează instant prin tot lanțul.',
    content: `Exemplu — articol CA04A+: Turnare beton armat fundații — beton marfă (18 mc):

Materiale:
• Beton C25/30 marfă — consum 1,02 mc, preț 380 lei, pierderi 3% → 399,11 lei/mc

Manoperă:
• Betonist calificat — 0,45 ore, 55 lei/oră → 24,75 lei/mc

Utilaje:
• Vibrator beton — 0,25 ore, 25 lei/oră → 6,25 lei/mc

Cost unitar total: 430,11 lei/mc
Cost direct 18 mc: 7.742 lei
Cu regie 10% + profit 5% + TVA 21%: 10.812 lei (total linie)

Poți ajusta oricând prețurile, consumurile și pierderile cu valorile reale de la furnizorii tăi.`,
  },
  {
    id: 'urmarire',
    num: '04',
    title: 'Urmărire cheltuieli în timp real',
    desc: 'Pe măsură ce lucrarea avansează, înregistrezi achizițiile reale. Aplicația compară automat fiecare cheltuială cu devizul planificat și îți arată profitul în timp real — pe telefon, de oriunde de pe șantier.',
    content: `Dashboard-ul constructorului afișează în timp real:
    
• Cât ai cheltuit total până acum
• Bugetul rămas pe fiecare etapă
• Profitul estimat la finalizarea lucrării (recalculat la fiecare achiziție)
• Status per etapă: în buget / în risc / depășit

Înregistrarea unei achiziții durează 30 de secunde: introduci suma, selectezi etapa, opțional faci o poză la bon. Înainte de salvare, aplicația îți arată exact impactul pe bugetul etapei și pe profitul final.

Alertă automată: când o etapă depășește bugetul planificat, primești notificare instantă cu suma exactă și impactul pe profitul final.`,
  },
  {
    id: 'export',
    num: '05',
    title: 'Două documente, două audiențe',
    desc: 'Devizul tehnic (PDF cu coduri normative și prețuri unitare) rămâne la constructor. Beneficiarul primește un link pe WhatsApp cu devizul tradus în limbaj simplu — fără coduri, fără prețuri unitare, fără procent de profit.',
    content: `PDF tehnic pentru constructor:
• Simbol normă, descriere completă, cantitate, preț unitar, total
• Recapitulație cu regie, profit, TVA
• Date firmă constructor, date proiect, dată emitere

Link simplificat pentru beneficiar (santier.app/share/...):
• Titlul etapei și descrierea în cuvinte simple
• Totalul pe fiecare etapă
• Totalul general cu TVA inclus
• Fără coduri normative, fără prețuri unitare, fără procent profit
• Actualizat automat când adaugi cheltuieli noi`,
  },
]

export default function CumFunctioneazaPage() {
  return (
    <>
      <script
        id="schema-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        id="schema-breadcrumb-cum"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          background: '#374151',
          padding: '120px 32px 80px',
          textAlign: 'center',
          fontFamily: sans,
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 52,
              lineHeight: 1.1,
              letterSpacing: '-.02em',
              color: '#FFFFFF',
              marginBottom: 20,
            }}
          >
            Tot ce faci pe șantier.{' '}
            <em style={{ color: '#E8500A', fontStyle: 'italic' }}>Pas cu pas.</em>
          </h1>
          <p
            style={{
              fontSize: 19,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.6,
              maxWidth: 620,
              margin: '0 auto',
              fontWeight: 400,
            }}
          >
            De la cererea de ofertă până la bilanțul zilnic — cum te ajută Șantier.app în fiecare
            moment al zilei de constructor.
          </p>
        </div>
      </section>

      {/* ── Secțiuni ── */}
      {steps.map((step, idx) => (
        <section
          key={step.id}
          id={step.id}
          style={{
            background: idx % 2 === 0 ? '#FAFAF8' : '#F3F2EF',
            padding: '80px 32px',
            fontFamily: sans,
          }}
        >
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: 14,
                color: '#E8500A',
                marginBottom: 8,
              }}
            >
              {step.num}
            </p>
            <h2
              style={{
                fontFamily: serif,
                fontSize: 34,
                lineHeight: 1.2,
                letterSpacing: '-.02em',
                color: '#1E2329',
                marginBottom: 16,
              }}
            >
              {step.title}
            </h2>
            <p
              style={{
                fontSize: 17,
                color: '#4A4744',
                lineHeight: 1.7,
                maxWidth: 680,
                marginBottom: 32,
                fontWeight: 400,
              }}
            >
              {step.desc}
            </p>

            {/* Flux vizual pentru secțiunea 01 */}
            {step.details && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
                }}
              >
                {step.details.map((phase) => (
                  <div
                    key={phase.phase}
                    style={{
                      background: phase.bgColor,
                      borderRadius: 12,
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: phase.color,
                        fontSize: 12,
                        marginBottom: 16,
                        letterSpacing: '.04em',
                      }}
                    >
                      {phase.phase}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {phase.items.map((item) => (
                        <div
                          key={item.title}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: 8,
                            padding: '12px 14px',
                            borderLeft: `3px solid ${item.alert ? '#C0392B' : phase.color}`,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: item.alert ? '#C0392B' : '#1E2329',
                            }}
                          >
                            {item.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#6B6860', marginTop: 2 }}>
                            {item.sub}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}
                    >
                      {phase.outputs.map((out) => (
                        <div
                          key={out}
                          style={{
                            background: `rgba(${phase.color === '#2A7D4F' ? '42,125,79' : '232,80,10'},0.1)`,
                            borderRadius: 6,
                            padding: '8px 12px',
                            fontSize: 12,
                            color: phase.color,
                          }}
                        >
                          {out}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Conținut text pentru celelalte secțiuni */}
            {step.content && (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E3DE',
                  borderRadius: 12,
                  padding: '28px 32px',
                }}
              >
                <pre
                  style={{
                    fontFamily: sans,
                    fontSize: 15,
                    color: '#4A4744',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}
                >
                  {step.content}
                </pre>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── CTA final ── */}
      <section
        style={{
          background: '#E8500A',
          padding: '80px 32px',
          textAlign: 'center',
          fontFamily: sans,
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 44,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: '-.02em',
            }}
          >
            Primul deviz, gratuit.
            <br />
            Acum, de pe telefon.
          </h2>
          <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 32, fontWeight: 400 }}>
            Fără instalare. Fără card. Fără să citești un manual.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/auth/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                color: '#E8500A',
                padding: '14px 28px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Creează cont gratuit
            </Link>
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              Demo fără cont
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>
            Cont gratuit · Fără card · Deviz complet în 10 minute
          </p>
        </div>
      </section>
    </>
  )
}
