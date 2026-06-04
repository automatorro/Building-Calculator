import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Despre Șantier.app — Cine suntem și ce construim',
  description:
    'Șantier.app este o platformă SaaS de management al șantierelor fondată în 2026 la Timișoara, România, de Lucian Cebuc. Folosită de peste 324 de constructori din România pentru devize, urmărire cheltuieli și coordonarea echipei.',
  alternates: {
    canonical: 'https://santier.app/despre',
  },
  openGraph: {
    title: 'Despre Șantier.app — Cine suntem și ce construim',
    description:
      'Platformă SaaS de management al șantierelor fondată în 2026 la Timișoara. Folosită de peste 324 de constructori din România.',
    url: 'https://santier.app/despre',
    type: 'website',
  },
}

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://santier.app/despre#webpage',
  url: 'https://santier.app/despre',
  name: 'Despre Șantier.app',
  description:
    'Șantier.app este o platformă SaaS de management al șantierelor fondată în 2026 la Timișoara, România, de Lucian Cebuc. Folosită de peste 324 de constructori.',
  inLanguage: 'ro',
  isPartOf: { '@id': 'https://santier.app/#website' },
  about: { '@id': 'https://santier.app/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: 'https://santier.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Despre',
        item: 'https://santier.app/despre',
      },
    ],
  },
}

export default function DesprePage() {
  return (
    <>
      <script
        id="schema-webpage-despre"
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
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#E8500A',
              marginBottom: 16,
            }}
          >
            Despre noi
          </p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 52,
              lineHeight: 1.1,
              letterSpacing: '-.02em',
              color: '#FFFFFF',
              marginBottom: 24,
            }}
          >
            Construim instrumentul pe care{' '}
            <em style={{ fontStyle: 'italic', color: '#E8500A' }}>
              constructorii români îl merită.
            </em>
          </h1>
          <p
            style={{
              fontSize: 19,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.65,
              maxWidth: 620,
              fontWeight: 400,
            }}
          >
            Șantier.app simplifică managementul complet al șantierelor pentru IMM-urile de
            construcții din România. Devize, achiziții, operațiuni și coordonarea echipei — totul
            într-un singur loc, accesibil pentru oricine din firmă, pe oricâte proiecte.
          </p>
        </div>
      </section>

      {/* ── Fapte cheie ── */}
      <section
        style={{
          background: '#F3F2EF',
          padding: '80px 32px',
          fontFamily: sans,
          borderBottom: '1px solid #E5E3DE',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 2,
              borderRadius: 14,
              overflow: 'hidden',
              background: '#E5E3DE',
            }}
          >
            {[
              { num: '2026', label: 'An fondare' },
              { num: '324+', label: 'Constructori activi' },
              { num: '1.100+', label: 'Norme de deviz în catalog' },
            ].map((s) => (
              <div
                key={s.label}
                style={{ background: '#FAFAF8', padding: '32px 24px', textAlign: 'center' }}
              >
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 44,
                    color: '#E8500A',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.num}
                </div>
                <div style={{ fontSize: 14, color: '#6B6860' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Misiune ── */}
      <section style={{ background: '#FAFAF8', padding: '80px 32px', fontFamily: sans }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#E8500A',
              marginBottom: 16,
            }}
          >
            Misiunea noastră
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 36,
              lineHeight: 1.15,
              letterSpacing: '-.02em',
              color: '#1E2329',
              marginBottom: 24,
            }}
          >
            Management complet de șantier, pentru echipele care construiesc România.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: '#4A4744',
              lineHeight: 1.75,
              marginBottom: 20,
              fontWeight: 400,
              maxWidth: 680,
            }}
          >
            Șantier.app oferă firmelor mici și mijlocii de construcții un instrument unic prin care
            întreaga echipă poate gestiona simultan și fără limită orice număr de șantiere — de la
            devize și achiziții până la operațiunile zilnice. Construit pe realitatea șantierelor
            românești, nu pe teorie.
          </p>
          <p style={{ fontSize: 17, color: '#6B6860', lineHeight: 1.75, maxWidth: 680 }}>
            Programele de devize existente în România au fost concepute cu zeci de ani în urmă,
            pentru fluxuri rigide și utilizare exclusiv la birou. Constructorii mici — care reprezintă
            peste 90% din piață — nu aveau niciun instrument adaptat realității lor: șantiere la
            distanță, facturi înregistrate pe telefon, echipe de 3-15 oameni. Santier.app a fost
            construit pentru ei.
          </p>
        </div>
      </section>

      {/* ── Date organizație ── */}
      <section
        style={{
          background: '#F3F2EF',
          padding: '80px 32px',
          fontFamily: sans,
          borderTop: '1px solid #E5E3DE',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#E8500A',
              marginBottom: 32,
            }}
          >
            Date organizație
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Produs', value: 'Șantier.app' },
              { label: 'Fondator', value: 'Lucian Cebuc' },
              { label: 'An înființare', value: '2026' },
              { label: 'Sediu', value: 'Strada Diaconu Coresi 3/A, Timișoara, Timiș, România' },
              { label: 'Domeniu de activitate', value: 'Software SaaS pentru construcții' },
              { label: 'Piață deservită', value: 'România' },
              {
                label: 'Utilizatori activi',
                value: 'Peste 324 de constructori și firme de construcții',
              },
              {
                label: 'Categorie produs',
                value: 'Construction Management Software / Business Application',
              },
              { label: 'Platforme', value: 'Web, iOS (browser), Android (browser)' },
              { label: 'Limbă', value: 'Română' },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  gap: 24,
                  padding: '16px 0',
                  borderBottom: i < 9 ? '1px solid #E5E3DE' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: '#A8A59E',
                    fontWeight: 500,
                    minWidth: 180,
                    flexShrink: 0,
                  }}
                >
                  {row.label}
                </span>
                <span style={{ fontSize: 15, color: '#1E2329', lineHeight: 1.5 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce construim ── */}
      <section style={{ background: '#FAFAF8', padding: '80px 32px', fontFamily: sans }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#E8500A',
              marginBottom: 16,
            }}
          >
            Produsul
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 36,
              lineHeight: 1.15,
              letterSpacing: '-.02em',
              color: '#1E2329',
              marginBottom: 24,
            }}
          >
            O singură aplicație pentru tot ce se întâmplă pe șantier.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 40,
            }}
          >
            {[
              {
                title: 'Devize din norme românești',
                desc: 'Catalog cu peste 1.100 norme de deviz calibrate la piața din România 2026. Generezi un deviz complet în 10 minute.',
              },
              {
                title: 'Urmărire cheltuieli în timp real',
                desc: 'Fiecare achiziție este comparată automat cu devizul planificat. Primești alertă exactă la depășirea bugetului pe orice etapă.',
              },
              {
                title: 'Jurnal de șantier partajat',
                desc: 'Managerul și maiștrii lucrează simultan în același proiect. Operațiunile zilnice sunt centralizate într-un singur loc.',
              },
              {
                title: 'Export și partajare',
                desc: 'PDF profesional pentru constructor, link simplificat pentru beneficiar (fără coduri tehnice, fără prețuri unitare). Trimis pe WhatsApp în 10 secunde.',
              },
              {
                title: 'AI integrat',
                desc: 'Calculul automat al cantităților din dimensiunile casei, scanarea facturilor prin cameră, completarea normelor din descriere în cuvinte simple.',
              },
              {
                title: 'Comparator furnizori',
                desc: 'Adaugi prețurile de la mai mulți furnizori pentru același material. Aplicația selectează automat cel mai avantajos și recalculează devizul.',
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: '#F3F2EF',
                  borderRadius: 12,
                  padding: '24px',
                  border: '1px solid #E5E3DE',
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1E2329',
                    marginBottom: 8,
                    letterSpacing: '-.01em',
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href="/auth/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#E8500A',
                color: '#FFFFFF',
                padding: '13px 24px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Creează cont gratuit
            </Link>
            <Link
              href="/cum-functioneaza"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                color: '#1E2329',
                padding: '13px 24px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(30,35,41,0.35)',
              }}
            >
              Cum funcționează
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        style={{
          background: '#374151',
          padding: '64px 32px',
          fontFamily: sans,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 32,
              color: '#FFFFFF',
              marginBottom: 16,
              lineHeight: 1.15,
            }}
          >
            Ai întrebări?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
            Suntem la Timișoara și răspundem în mai puțin de 24 de ore.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#E8500A',
              color: '#FFFFFF',
              padding: '13px 28px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Contactează-ne
          </Link>
        </div>
      </section>
    </>
  )
}
