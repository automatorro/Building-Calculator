import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculatoare Rapide Construcții — BCA, Beton, Tencuială, EPS',
  description:
    'Calculatoare gratuite pentru construcții: necesar BCA, beton și armătură fundație, tencuială, polistiren EPS, vată minerală, cărămidă. Calcul instant cu prețuri actualizate 2026.',
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide',
  },
  openGraph: {
    title: 'Calculatoare Rapide Construcții — Șantier.app',
    description:
      'Calculatoare gratuite: BCA, beton fundație, tencuială, EPS, vată minerală. Calcul instant cu prețuri 2026.',
    url: 'https://santier.app/calculatoare-rapide',
  },
}

export default function CalculatoareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
