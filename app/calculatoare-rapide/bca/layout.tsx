import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Necesar BCA — Cantitate și Cost Zidărie BCA 2026',
  description:
    'Calculator gratuit necesar BCA pentru zidărie. Introdu suprafața și grosimea peretelui — obții instant cantitatea de blocuri BCA, mortar și costul estimativ cu prețuri 2026.',
  keywords: [
    'calculator BCA',
    'necesar BCA',
    'calculator zidarie BCA',
    'cat BCA trebuie pentru 1mp',
    'pret BCA 2026',
    'calculator blocuri BCA',
    'zidarie BCA cantitate',
  ],
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide/bca',
  },
  openGraph: {
    title: 'Calculator Necesar BCA 2026 — Cantitate și Cost Estimativ',
    description: 'Calculează instant cantitatea de blocuri BCA și costul pentru zidăria ta. Prețuri actualizate 2026.',
    url: 'https://santier.app/calculatoare-rapide/bca',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
