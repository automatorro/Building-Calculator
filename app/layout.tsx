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
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Șantier.app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  description:
    'Program online de devize construcții pentru constructori mici și mijlocii din România. Creează devize profesionale, urmărește cheltuielile reale pe șantier și exportă PDF.',
  url: 'https://santier.app',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RON',
      description: 'Plan gratuit — 1 proiect complet',
    },
    {
      '@type': 'Offer',
      price: '89',
      priceCurrency: 'RON',
      description: 'Plan Constructor — proiecte nelimitate',
    },
  ],
  featureList: [
    'Calculator deviz construcții',
    'Catalog 1100+ norme românești',
    'Urmărire cheltuieli reale',
    'Alertă depășire buget',
    'Export PDF profesional',
    'Link deviz pentru beneficiar',
    'Import extras cantități Excel',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '47',
  },
  inLanguage: 'ro',
  availableLanguage: 'Romanian',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Șantier.app',
  url: 'https://santier.app',
  description: 'Program online de devize construcții pentru constructori din România',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: 'Romanian',
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
