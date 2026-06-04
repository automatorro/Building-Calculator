import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'

/* ─── Fonturi ─────────────────────────────────────────────────────────────
   DM Sans → tot UI-ul: labels, butoane, inputuri, tabele
   DM Serif Display → titluri mari h1, headings de impact
   ───────────────────────────────────────────────────────────────────────── */
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://santier.app'),
  title: {
    default: 'Șantier.app — Program Devize Construcții pentru Constructori Mici',
    template: '%s | Șantier.app',
  },
  description:
    'Program online de devize construcții pentru constructori mici și mijlocii din România. Creează devize profesionale în 5 minute, urmărește cheltuielile reale, exportă PDF. Gratuit pentru primul proiect.',
  keywords: [
    'devize constructii',
    'program devize constructii',
    'calculator deviz constructii',
    'deviz online Romania',
    'software constructii Romania',
    'aplicatie santier',
    'management santier',
    'deviz lucrari constructii',
    'calculator constructii',
    'deviz renovare',
    'antreprenor constructii',
    'constructori mici Romania',
    'urmărire cheltuieli constructii',
    'deviz gratuit constructii',
    'norme deviz constructii',
  ],
  authors: [{ name: 'Șantier.app' }],
  creator: 'Șantier.app',
  publisher: 'Șantier.app',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://santier.app',
    siteName: 'Șantier.app',
    title: 'Șantier.app — Program Devize Construcții pentru Constructori Mici',
    description:
      'Program online de devize construcții pentru constructori mici din România. Devize precise în 5 minute, urmărire cheltuieli reale, alerte depășire buget. Gratuit.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Șantier.app — Program Devize Construcții',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Șantier.app — Program Devize Construcții pentru Constructori Mici',
    description:
      'Devize construcții în 5 minute. Urmărire cheltuieli reale. Alerte depășire buget. Gratuit pentru primul proiect.',
    images: ['/og-image.png'],
    creator: '@santierapp',
  },
  alternates: {
    canonical: 'https://santier.app',
    languages: {
      'ro-RO': 'https://santier.app',
    },
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
}

// ── BLOC 1: Organization ──────────────────────────────────────────────────────
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://santier.app/#organization',
  name: 'Șantier.app',
  alternateName: 'Santier App',
  legalName: 'Șantier.app',
  url: 'https://santier.app',
  logo: {
    '@type': 'ImageObject',
    url: 'https://santier.app/og-image.png',
    width: 1200,
    height: 630,
  },
  description:
    'Platformă SaaS românească de management complet al șantierelor pentru firme mici și mijlocii de construcții. Devize digitale, urmărire cheltuieli în timp real, alerte de buget și jurnal de șantier partajat. Folosită de peste 324 de constructori din România.',
  foundingDate: '2026',
  foundingLocation: {
    '@type': 'Place',
    name: 'Timișoara, România',
  },
  founder: {
    '@type': 'Person',
    name: 'Lucian Cebuc',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Strada Diaconu Coresi 3/A',
    addressLocality: 'Timișoara',
    addressRegion: 'Timiș',
    addressCountry: 'RO',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Romania',
  },
  sameAs: ['https://x.com/santierapp'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://santier.app/contact',
    availableLanguage: 'Romanian',
  },
}

// ── BLOC 2: SoftwareApplication ───────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': 'https://santier.app/#software',
  name: 'Șantier.app',
  alternateName: ['Santier App', 'Program devize construcții online'],
  url: 'https://santier.app',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Construction Management Software',
  operatingSystem: 'Web, iOS, Android',
  browserRequirements: 'Requires JavaScript. Works in all modern browsers.',
  description:
    'Aplicație de management complet al șantierelor pentru firme mici și mijlocii de construcții din România. Permite gestionarea nelimitată a proiectelor, devizelor, achizițiilor și operațiunilor zilnice de către întreaga echipă, într-o interfață simplă și intuitivă, adaptată realității de pe șantierele românești.',
  featureList: [
    'Generare deviz din norme românești (catalog 1.100+ articole)',
    'Urmărire cheltuieli reale vs. deviz planificat',
    'Alertă automată la depășirea bugetului pe etape',
    'Export PDF și Excel conform standardelor românești',
    'AI pentru calculul automat al cantităților din planuri',
    'Scanare factură prin cameră — extracție automată furnizor, sumă, TVA',
    'Link partajare beneficiar (deviz în limbaj simplu, fără coduri tehnice)',
    'Comparator prețuri furnizori',
    'Import extras cantități din Excel',
    'Jurnal de șantier partajat pentru echipe',
    'Funcționare pe orice dispozitiv, fără instalare',
  ],
  screenshot: 'https://santier.app/og-image.png',
  softwareVersion: '2026',
  datePublished: '2026-01-01',
  inLanguage: 'ro',
  isAccessibleForFree: true,
  offers: [
    {
      '@type': 'Offer',
      name: 'Gratuit',
      price: '0',
      priceCurrency: 'RON',
      description:
        '1 proiect activ complet, catalog 20 articole standard, urmărire cheltuieli, 20 tokeni AI/an',
      eligibleRegion: { '@type': 'Country', name: 'Romania' },
    },
    {
      '@type': 'Offer',
      name: 'Constructor',
      price: '89',
      priceCurrency: 'RON',
      billingIncrement: 'P1M',
      description:
        'Proiecte nelimitate, catalog complet 1.100+ articole, AI consultant tehnic, export PDF/Excel profesional, comparator furnizori',
      eligibleRegion: { '@type': 'Country', name: 'Romania' },
    },
    {
      '@type': 'Offer',
      name: 'Echipă',
      price: '169',
      priceCurrency: 'RON',
      billingIncrement: 'P1M',
      description:
        'Manager + până la 4 maiștri, jurnal de șantier partajat, raport progres per utilizator, catalog propriu cu prețuri personalizate',
      eligibleRegion: { '@type': 'Country', name: 'Romania' },
    },
  ],
  audience: {
    '@type': 'Audience',
    audienceType:
      'Constructori, antreprenori de construcții, ingineri de șantier, manageri de proiect din România',
    geographicArea: { '@type': 'Country', name: 'Romania' },
  },
  provider: { '@id': 'https://santier.app/#organization' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '3',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Marius D.' },
      reviewBody:
        'Înainte știam dacă am câștigat sau pierdut abia după ce terminam lucrarea. Acum văd în timp real. Pe fundație am prins că ieșeam în minus și am renegociat.',
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Cosmin R.' },
      reviewBody:
        'Clientul mă suna zilnic să știe ce s-a executat și cât s-a cheltuit. Acum îi trimit un link și gata. A încetat cu telefoanele, eu am câștigat 2 ore pe săptămână.',
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Alexandru V.' },
      reviewBody:
        'Am instalat Windoc Deviz, am stat 3 ore să înțeleg cum funcționează, am renunțat. Asta am deschis pe telefon și în 20 de minute aveam devizul complet.',
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
    },
  ],
}

// ── BLOC 3: WebSite ───────────────────────────────────────────────────────────
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://santier.app/#website',
  url: 'https://santier.app',
  name: 'Șantier.app',
  description: 'Program de management complet al șantierelor pentru constructori mici din România',
  inLanguage: 'ro',
  publisher: { '@id': 'https://santier.app/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://santier.app/catalog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        <script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          id="schema-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", system-ui, sans-serif)' }}>
        <Navigation />
        <Toaster position="top-center" richColors />
        {children}
        <Footer />
      </body>
    </html>
  )
}
