import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Necesar Polistiren EPS — Termosistem 2026',
  description:
    'Calculator gratuit necesar polistiren EPS pentru termosistem. Introdu suprafața fațadei — obții cantitatea de plăci EPS, adeziv, dibluri și costul total estimativ cu prețuri 2026.',
  keywords: [
    'calculator polistiren EPS',
    'necesar EPS termosistem',
    'cat polistiren trebuie',
    'calculator termosistem',
    'pret polistiren 2026',
    'calculator izolatie termica',
    'EPS 10cm cantitate',
  ],
  alternates: {
    canonical: 'https://santier.app/calculatoare-rapide/eps',
  },
  openGraph: {
    title: 'Calculator Necesar Polistiren EPS — Termosistem 2026',
    description: 'Calculează cantitatea de polistiren EPS și costul termosistemului. Prețuri actualizate 2026.',
    url: 'https://santier.app/calculatoare-rapide/eps',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
