import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Construcții — Ghiduri, Devize și Sfaturi pentru Constructori',
  description:
    'Articole practice despre devize construcții, prețuri materiale 2026, norme tehnice românești, management șantier și sfaturi pentru constructori mici din România.',
  keywords: [
    'blog constructii Romania',
    'ghid deviz constructii',
    'preturi materiale constructii 2026',
    'norme deviz constructii',
    'sfaturi constructor',
    'management santier',
    'articole constructii',
  ],
  alternates: {
    canonical: 'https://santier.app/blog',
  },
  openGraph: {
    title: 'Blog Construcții — Șantier.app',
    description: 'Ghiduri practice despre devize, prețuri materiale și management de șantier pentru constructori din România.',
    url: 'https://santier.app/blog',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
