import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Beton și Armătură Fundație — Deviz Fundație 2026',
  description:
    'Calculator gratuit beton și armătură pentru fundație. Introdu dimensiunile fundației — obții cubajul de beton, cantitatea de armătură OB/PC și costul estimativ cu prețuri 2026.',
  keywords: [
    'calculator beton fundatie',
    'necesar beton fundatie',
    'calculator armatura fundatie',
    'cat beton trebuie pentru fundatie',
    'deviz fundatie',
    'pret fundatie casa 2026',
    'calculator fundatie izolata',
  ],
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide/beton-armatura-fundatie',
  },
  openGraph: {
    title: 'Calculator Beton și Armătură Fundație 2026',
    description: 'Calculează cantitatea de beton și armătură pentru fundație. Deviz estimativ instant.',
    url: 'https://santier.app/calculatoare-rapide/beton-armatura-fundatie',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
