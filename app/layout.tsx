import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
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
  title: 'BuildingCalc — Devize de construcții pentru oameni de pe șantier',
  description:
    'Platformă mobilă de management devize pentru constructori mici și mijlocii din România. Creează devize în 5 minute, urmărește costurile real-time, exportă PDF profesional.',
  keywords: ['devize constructii', 'calculator deviz', 'software constructii Romania'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", system-ui, sans-serif)' }}>
        <Navigation />
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  )
}
