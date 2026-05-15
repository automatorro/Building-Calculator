import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Vată Minerală — Termosistem Vată Bazaltică 2026',
  description:
    'Calculator gratuit necesar vată minerală (bazaltică sau de sticlă) pentru termosistem. Introdu suprafața — obții cantitatea și costul estimativ cu prețuri 2026.',
  keywords: [
    'calculator vata minerala',
    'necesar vata bazaltica',
    'termosistem vata minerala',
    'pret vata minerala 2026',
    'calculator izolatie vata',
    'vata minerala vs EPS',
    'vata bazaltica termosistem pret',
  ],
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide/vata-minerala',
  },
  openGraph: {
    title: 'Calculator Vată Minerală — Termosistem 2026',
    description: 'Calculează cantitatea de vată minerală și costul izolației termice. Prețuri 2026.',
    url: 'https://santier.app/calculatoare-rapide/vata-minerala',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
