import type { Metadata } from 'next'
import Link from 'next/link'

/* ─── Metadata per slug ───────────────────────────────────────────────────── */
const pagesData: Record<
  string,
  {
    title: string
    metaDesc: string
    h1: string
    intro: string
    sections: { heading: string; body: string }[]
    related: { href: string; label: string }[]
  }
> = {
  'devize-constructii': {
    title: 'Devize Construcții Online — Catalog 1.100+ Norme Românești | Șantier.app',
    metaDesc:
      'Creează devize de construcții profesionale din catalogul de 1.100+ norme românești. Calculul automat al rețetelor de resurse, prețuri calibrate la 2026, export PDF instant. Gratuit pentru primul proiect.',
    h1: 'Devize de construcții din norme românești, în 10 minute',
    intro:
      'Crearea unui deviz de construcții corect și complet este una dintre cele mai consumatoare de timp activități pentru un antreprenor. Șantier.app automatizează acest proces cu un catalog de peste 1.100 norme românești de deviz, prețuri calibrate la piața din 2026 și calculul automat al rețetelor de resurse.',
    sections: [
      {
        heading: 'Catalogul de 1.100+ norme românești de deviz',
        body: `Catalogul Șantier.app conține articolele de deviz cele mai utilizate în construcțiile românești, organizate pe categorii: fundații, structură portantă, zidărie, finisaje interioare, finisaje exterioare, instalații, acoperiș.

Fiecare articol include:
• Simbolul normei (ex: CA04A+, TsA04XA, CF08A)
• Descrierea completă a lucrării
• Rețeta de resurse: materiale, manoperă, utilaje cu consumuri precise
• Prețuri de referință actualizate la piața din 2026

Poți filtra după categorie, căuta după cuvânt cheie sau simbol de normă. Dacă nu găsești un articol specific, îl poți adăuga manual cu rețeta proprie de resurse.`,
      },
      {
        heading: 'Rețete de resurse editabile',
        body: `Fiecare articol de deviz are o rețetă completă de resurse pe care o poți personaliza complet:

Materiale: schimbi prețul cu prețul real de la furnizorul tău, ajustezi consumul sau procentul de pierderi.
Manoperă: modifici tariful orar în funcție de zona geografică și sezon.
Utilaje: activezi sau dezactivezi echipamentele, ajustezi costul de închiriere.

Orice modificare se propagă instant prin tot devizul — nu trebuie să recalculezi manual.`,
      },
      {
        heading: 'Calculul automat cu AI',
        body: `Funcția AI din Șantier.app reduce și mai mult timpul de creare a unui deviz:

• Calculul cantităților din dimensiuni: introduci lungimea, lățimea și înălțimea casei și aplicația calculează automat cantitățile de beton, cofraj, armătură, zidărie pentru fiecare etapă.
• Completarea din descriere: descrii lucrarea în cuvinte simple ("tencuială exterioară 200mp") și AI-ul găsește normele potrivite din catalog.
• Generarea rețetelor lipsă: dacă o normă nu are rețetă completă, AI-ul propune o rețetă de resurse bazată pe normativele tehnice românești.`,
      },
      {
        heading: 'Coeficienți financiari per proiect',
        body: `Fiecare proiect are propriii coeficienți configurabili o singură dată:

• Cheltuieli indirecte (regie): de regulă 8-15% din costul direct, acoperă costurile de administrare a firmei.
• Procent profit: marja brută dorită pe lucrare, calculată la cost direct + regie.
• TVA: 5%, 11% sau 21% în funcție de tipul beneficiarului și natura lucrării.

Formula de recapitulație este aplicată automat la orice articol din deviz. Un deviz cu cost direct 100.000 lei, regie 10%, profit 5% și TVA 21% va genera o ofertă de 139.755 lei pentru beneficiar, cu profit net de 5.500 lei pentru constructor.`,
      },
      {
        heading: 'Export PDF profesional și link beneficiar',
        body: `Devizul finalizat poate fi exportat în două formate:

PDF tehnic pentru constructor: include simbolul normei, descrierea completă, cantitățile, prețurile unitare, totalul pe articol, recapitulația cu regie, profit și TVA. Structurat conform standardelor românești de deviz.

Link simplificat pentru beneficiar: generezi un link (ex: santier.app/share/abc123) pe care îl trimiți pe WhatsApp sau email. Beneficiarul vede titlul etapei, descrierea în limbaj simplu și totalul per etapă — fără coduri normative, fără prețuri unitare, fără procent de profit.`,
      },
    ],
    related: [
      { href: '/functionalitati/urmarire-cheltuieli', label: 'Urmărire cheltuieli reale' },
      { href: '/functionalitati/jurnal-santier', label: 'Jurnal de șantier' },
      { href: '/functionalitati/export-pdf', label: 'Export PDF și partajare' },
    ],
  },

  'urmarire-cheltuieli': {
    title: 'Urmărire Cheltuieli Construcții în Timp Real — Alerte Buget | Șantier.app',
    metaDesc:
      'Urmărește cheltuielile reale de pe șantier față de devizul planificat. Alertă automată la depășirea bugetului pe orice etapă. Profitul actualizat la fiecare achiziție. Funcționează pe telefon.',
    h1: 'Urmărire cheltuieli reale față de deviz, cu alertă automată la depășire',
    intro:
      'Cea mai frecventă problemă a constructorilor mici din România: știu că au depășit bugetul abia la finalul lucrării. Șantier.app rezolvă exact asta — fiecare achiziție este comparată instant cu devizul planificat, iar profitul estimat este recalculat în timp real.',
    sections: [
      {
        heading: 'Înregistrarea rapidă a achizițiilor — 30 de secunde',
        body: `Înregistrezi o achiziție direct de pe telefon, cu o singură mână, în 3 pași:

1. Introduci suma totală (cu tastatura numerică mare, optimizată pentru telefon)
2. Selectezi etapa cu un singur tap (Fundație, Structură, Zidărie etc.)
3. Alegi categoria (material, manoperă, utilaj) și opțional faci o poză la bon

Înainte de salvare, aplicația îți arată exact:
• Noul total cheltuit pe etapa respectivă
• Devierea față de bugetul planificat (în lei și procente)
• Profitul estimat actualizat după această achiziție`,
      },
      {
        heading: 'Dashboard-ul de dimineață — 5 secunde pentru situația completă',
        body: `La deschiderea aplicației dimineața, constructorul vede fără niciun tap:

• Cât s-a cheltuit total până acum vs. bugetul total
• Bugetul rămas per etapă activă
• Profitul estimat la finalizarea lucrării (și marja procentuală)
• Status per etapă: verde (în grafic), galben (în risc, sub 10% buget rămas), roșu (depășit)
• Lista activităților planificate pentru ziua curentă

Informațiile sunt sincronizate în timp real — dacă un maistru înregistrează o achiziție de pe teren, managerul o vede instant pe dashboardul lui.`,
      },
      {
        heading: 'Alerta de depășire buget — instantă și precisă',
        body: `Când o achiziție duce o etapă peste bugetul planificat, primești alertă imediată care include:

• Etapa depășită și suma exactă a depășirii
• Procentul de depășire față de bugetul planificat
• Impactul exact pe profitul final (în lei)
• Sugestia aplicației: renegociezi cu beneficiarul sau absorbi diferența

Exemplu real: etapa Structură are buget planificat 58.000 lei. Ai cheltuit 54.390 lei. Înregistrezi o achiziție de 8.580 lei. Aplicația îți arată: "Această achiziție duce Structura cu 4.970 lei (+8,6%) peste buget. Impact pe profit: −4.970 lei."`,
      },
      {
        heading: 'Scanarea facturilor cu camera telefonului',
        body: `În loc să introduci manual datele de pe factură, faci o fotografie și aplicația extrage automat:

• Numele furnizorului
• Suma totală
• TVA-ul

Funcție disponibilă în planul Constructor. Elimină erorile de tastare și reduce timpul de înregistrare de la 2 minute la 10 secunde.`,
      },
      {
        heading: 'Rapoarte și exporturi pentru contabilitate',
        body: `La finalul lunii sau al lucrării, poți exporta:

• Lista completă a achizițiilor cu dată, furnizor, sumă, TVA și etapă
• Comparativul deviz planificat vs. cheltuieli reale per etapă și per categorie de resursă
• Profitul real calculat după toate cheltuielile înregistrate

Exportul este disponibil în format Excel, compatibil cu programele contabile utilizate frecvent în România.`,
      },
    ],
    related: [
      { href: '/functionalitati/devize-constructii', label: 'Devize construcții' },
      { href: '/functionalitati/jurnal-santier', label: 'Jurnal de șantier' },
      { href: '/functionalitati/export-pdf', label: 'Export PDF și partajare' },
    ],
  },

  'jurnal-santier': {
    title: 'Jurnal de Șantier Digital Partajat — Manager și Maiștri | Șantier.app',
    metaDesc:
      'Jurnal de șantier digital partajat pentru manager și echipă. Operațiunile zilnice centralizate într-un singur loc. Asignare proiecte pe responsabili, raport progres per utilizator. Plan Echipă.',
    h1: 'Jurnal de șantier partajat — managerul și echipa, în același proiect',
    intro:
      'Coordonarea unei echipe de construcții pe mai multe șantiere simultan este una dintre cele mai complexe operațiuni pentru un antreprenor. Șantier.app centralizeaza operațiunile zilnice, asignează responsabilități și oferă vizibilitate completă managerului, fără a genera birocrație suplimentară pentru maiștri.',
    sections: [
      {
        heading: 'Lucru simultan al echipei în același proiect',
        body: `Planul Echipă permite până la 5 utilizatori simultani (1 manager + 4 maiștri) să lucreze în același proiect fără conflicte:

• Managerul vede în timp real toate înregistrările făcute de maiștri
• Fiecare maistru vede doar proiectele care i-au fost asignate
• Modificările se sincronizează instant — fără refresh manual

Exemplu: maistrul de pe șantierul din Timișoara înregistrează o achiziție la 14:15. Managerul, aflat la biroul din Cluj, vede alertă de depășire buget la 14:15:03.`,
      },
      {
        heading: 'Asignarea proiectelor pe responsabili',
        body: `Managerul poate asigna fiecare proiect unuia sau mai multor maiștri:

• Maistrul asignat vede proiectul în lista lui de proiecte active
• Poate înregistra achiziții, nota operațiuni și actualiza starea etapelor
• Nu are acces la proiectele neasignate lui sau la setările financiare ale firmei (procent profit, coeficienți)

Asignarea se poate modifica oricând — util când maistrul se mută de pe un șantier pe altul.`,
      },
      {
        heading: 'Jurnalul zilnic de operațiuni',
        body: `Fiecare zi pe șantier poate fi documentată în jurnalul de operațiuni:

• Ce s-a executat (etapă, articol, cantitate)
• Cine a lucrat (număr de muncitori, ore)
• Ce s-a achiziționat (materiale, furnizor, sumă)
• Observații și probleme întâmpinate
• Fotografii atașate

Jurnalul este vizibil atât pentru maistru cât și pentru manager. Poate fi exportat ca raport zilnic sau săptămânal.`,
      },
      {
        heading: 'Raportul de progres per utilizator și etapă',
        body: `Managerul are acces la un raport centralizat care arată:

• Progresul fiecărui proiect activ față de devizul planificat
• Achizițiile înregistrate de fiecare maistru (cu sumele și datele)
• Etapele cu risc de depășire buget sau deja depășite
• Profitul estimat actualizat pentru toate proiectele active

Raportul este util pentru ședințele de analiză săptămânală sau pentru justificarea situațiilor de plată intermediare.`,
      },
      {
        heading: 'Catalogul propriu al firmei',
        body: `Planul Echipă include funcția de catalog propriu: poți adăuga articole de deviz specifice firmei tale, cu prețurile tale personalizate la furnizorii cu care lucrezi frecvent.

Catalogul propriu se adaugă peste catalogul standard de 1.100+ norme și este vizibil tuturor utilizatorilor din contul firmei. Elimina nevoia de a introduce manual prețurile de fiecare dată.`,
      },
    ],
    related: [
      { href: '/functionalitati/devize-constructii', label: 'Devize construcții' },
      { href: '/functionalitati/urmarire-cheltuieli', label: 'Urmărire cheltuieli' },
      { href: '/functionalitati/export-pdf', label: 'Export PDF și partajare' },
    ],
  },

  'export-pdf': {
    title: 'Export PDF Deviz Construcții și Link Beneficiar | Șantier.app',
    metaDesc:
      'Exportă devizul în PDF profesional sau trimite un link simplificat beneficiarului pe WhatsApp. Două formate: tehnic pentru constructor, în limbaj simplu pentru client. Fără coduri normative vizibile.',
    h1: 'Export PDF deviz și link partajare beneficiar — două documente, două audiențe',
    intro:
      'Comunicarea cu beneficiarul în construcții are o problemă clasică: devizul tehnic (plin de coduri normative și prețuri unitare) este incomprehensibil pentru client, dar nu poți trimite un deviz simplificat fără să-ți expui marja de profit. Șantier.app rezolvă asta cu două formate distincte, generate din același deviz.',
    sections: [
      {
        heading: 'PDF-ul tehnic — pentru arhiva constructorului',
        body: `PDF-ul tehnic generat de Șantier.app conține toate informațiile necesare constructorului și, dacă e cazul, dirigintelui de șantier:

• Antetul firmei (nume, CUI, adresă)
• Datele proiectului (beneficiar, locație, dată emitere)
• Tabelul articolelor: număr, simbol normă, descriere completă, unitate de măsură, cantitate, preț unitar, total per articol
• Organizare pe etape (Fundație, Structură, Finisaje etc.)
• Recapitulație: cost direct, cheltuieli indirecte, profit, total fără TVA, TVA, total general

Format: A4, portret sau landscape, importabil în orice program contabil.`,
      },
      {
        heading: 'Link-ul pentru beneficiar — fără coduri, fără prețuri unitare',
        body: `Generezi un link unic (ex: santier.app/share/a7f3b2c1) pe care îl trimiți pe WhatsApp sau email. Beneficiarul vede:

• Numele proiectului și data actualizării
• Lista etapelor în limbaj simplu: "Fundație — Săpătură, beton armat, cofraj, hidroizolație"
• Totalul per etapă (suma cu TVA)
• Totalul general cu TVA inclus

Nu vede:
• Simbolurile normelor (CA04A+, TsA04XA etc.)
• Prețurile unitare per resursă
• Procentul de profit sau de regie
• Rețeta de resurse (materiale, manoperă, utilaje)

Link-ul se actualizează automat când adaugi noi cheltuieli — nu trebuie să trimiți un nou link de fiecare dată.`,
      },
      {
        heading: 'Exportul Excel pentru contabilitate',
        body: `Pe lângă PDF, devizul poate fi exportat în format Excel cu:

• Toate articolele cu coloanele standard (simbol, descriere, cantitate, preț, total)
• Recapitulația cu formulele calculate
• Lista achizițiilor înregistrate (pentru reconciliere cu facturile)

Formatul este compatibil cu programele de contabilitate utilizate frecvent de firmele mici din România (Saga, WinMentor etc.).`,
      },
      {
        heading: 'Importul extras de cantități din Excel',
        body: `Dacă proiectantul ți-a trimis extrasul de cantități în Excel, nu trebuie să-l introduci manual articol cu articol:

1. Încarci fișierul Excel în aplicație
2. Mapezi coloanele (descriere, unitate, cantitate)
3. Aplicația identifică automat normele corespunzătoare din catalog
4. Articolele intră direct în deviz cu rețetele de resurse complete

Funcție disponibilă în planul Constructor.`,
      },
      {
        heading: 'Comparatorul de furnizori',
        body: `Înainte de a finaliza devizul, poți compara prețurile aceluiași material de la mai mulți furnizori:

1. Adaugi prețurile de la 2-3 furnizori pentru un material (ex: beton C25/30: 380 lei/mc de la Holcim, 395 lei/mc de la Lafarge, 370 lei/mc de la furnizorul local)
2. Aplicația selectează automat cel mai avantajos preț
3. Devizul este recalculat instant cu noul preț

Utilă pentru achiziții mari (beton, oțel, cărămidă) unde diferența de preț are impact semnificativ pe deviz.`,
      },
    ],
    related: [
      { href: '/functionalitati/devize-constructii', label: 'Devize construcții' },
      { href: '/functionalitati/urmarire-cheltuieli', label: 'Urmărire cheltuieli' },
      { href: '/functionalitati/jurnal-santier', label: 'Jurnal de șantier' },
    ],
  },
}

/* ─── Generare metadata ───────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = pagesData[slug]
  if (!page) return {}
  return {
    title: page.title,
    description: page.metaDesc,
    alternates: { canonical: `https://santier.app/functionalitati/${slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDesc,
      url: `https://santier.app/functionalitati/${slug}`,
      type: 'website',
    },
  }
}

export function generateStaticParams() {
  return Object.keys(pagesData).map((slug) => ({ slug }))
}

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

export default async function FunctionalitatiPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = pagesData[slug]

  if (!page) {
    return (
      <div style={{ padding: '120px 32px', textAlign: 'center', fontFamily: sans }}>
        <h1>Pagina nu a fost găsită</h1>
      </div>
    )
  }

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://santier.app/functionalitati/${slug}#webpage`,
    url: `https://santier.app/functionalitati/${slug}`,
    name: page.h1,
    description: page.metaDesc,
    inLanguage: 'ro',
    isPartOf: { '@id': 'https://santier.app/#website' },
    about: { '@id': 'https://santier.app/#software' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://santier.app' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Funcționalități',
          item: 'https://santier.app/functionalitati',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.h1,
          item: `https://santier.app/functionalitati/${slug}`,
        },
      ],
    },
  }

  return (
    <>
      <script
        id={`schema-webpage-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          background: '#374151',
          padding: '120px 32px 80px',
          fontFamily: sans,
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <Link
              href="/#functionalitati"
              style={{ fontSize: 13, color: '#E8500A', textDecoration: 'none' }}
            >
              ← Toate funcționalitățile
            </Link>
          </div>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 46,
              lineHeight: 1.1,
              letterSpacing: '-.02em',
              color: '#FFFFFF',
              marginBottom: 24,
            }}
          >
            {page.h1}
          </h1>
          <p
            style={{
              fontSize: 19,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.65,
              maxWidth: 640,
              fontWeight: 400,
            }}
          >
            {page.intro}
          </p>
        </div>
      </section>

      {/* ── Secțiuni ── */}
      {page.sections.map((section, idx) => (
        <section
          key={section.heading}
          style={{
            background: idx % 2 === 0 ? '#FAFAF8' : '#F3F2EF',
            padding: '64px 32px',
            fontFamily: sans,
            borderTop: '1px solid #E5E3DE',
          }}
        >
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: serif,
                fontSize: 30,
                lineHeight: 1.2,
                letterSpacing: '-.02em',
                color: '#1E2329',
                marginBottom: 20,
              }}
            >
              {section.heading}
            </h2>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E3DE',
                borderRadius: 12,
                padding: '24px 28px',
              }}
            >
              <pre
                style={{
                  fontFamily: sans,
                  fontSize: 15,
                  color: '#4A4744',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                }}
              >
                {section.body}
              </pre>
            </div>
          </div>
        </section>
      ))}

      {/* ── Related pages ── */}
      <section
        style={{
          background: '#F3F2EF',
          padding: '64px 32px',
          fontFamily: sans,
          borderTop: '1px solid #E5E3DE',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: '#E8500A',
              marginBottom: 20,
            }}
          >
            Alte funcționalități
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {page.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E3DE',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1E2329',
                  textDecoration: 'none',
                }}
              >
                {r.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: '#E8500A',
          padding: '72px 32px',
          textAlign: 'center',
          fontFamily: sans,
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 40,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: 14,
              letterSpacing: '-.02em',
            }}
          >
            Încearcă gratuit.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>
            Primul proiect complet, fără card, fără instalare.
          </p>
          <Link
            href="/auth/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
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
        </div>
      </section>
    </>
  )
}
