import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Necesar Cărămidă cu Goluri — Zidărie 2026',
  description:
    'Calculator gratuit necesar cărămidă cu goluri pentru zidărie. Introdu suprafața și grosimea peretelui — obții cantitatea de cărămizi, mortar și costul estimativ cu prețuri 2026.',
  keywords: [
    'calculator caramida',
    'necesar caramida cu goluri',
    'cat caramida trebuie pentru 1mp',
    'pret caramida 2026',
    'calculator zidarie caramida',
    'caramida goluri 25cm',
    'zidarie caramida cantitate',
  ],
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide/caramida-goluri',
  },
  openGraph: {
    title: 'Calculator Necesar Cărămidă cu Goluri 2026',
    description: 'Calculează cantitatea de cărămizi și costul zidăriei. Prețuri actualizate 2026.',
    url: 'https://santier.app/calculatoare-rapide/caramida-goluri',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
