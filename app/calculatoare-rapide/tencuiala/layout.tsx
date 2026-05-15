import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Tencuială — Cantitate și Cost Tencuire 2026',
  description:
    'Calculator gratuit necesar tencuială pentru pereți interiori și exteriori. Introdu suprafața — obții cantitatea de mortar, nisip, ciment și costul manoperei cu prețuri 2026.',
  keywords: [
    'calculator tencuiala',
    'necesar tencuiala',
    'cat mortar tencuiala trebuie',
    'pret tencuiala 2026',
    'calculator mortar tencuiala',
    'tencuiala manuala pret mp',
    'tencuiala mecanizata pret',
  ],
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide/tencuiala',
  },
  openGraph: {
    title: 'Calculator Tencuială 2026 — Cantitate și Cost',
    description: 'Calculează cantitatea de mortar și costul tencuielii. Prețuri manoperă actualizate 2026.',
    url: 'https://santier.app/calculatoare-rapide/tencuiala',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
