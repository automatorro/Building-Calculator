'use client'
import Link from 'next/link'

export default function Page() {
  const cards = [
    { title: 'Calculator necesar polistiren (EPS)', href: '/calculatoare-rapide/eps', subtitle: 'Termosistem EPS — materiale și cost estimativ' },
    { title: 'Calculator necesar vată minerală', href: '/calculatoare-rapide/vata-minerala', subtitle: 'Termosistem vată minerală — materiale și cost estimativ' },
    { title: 'Calculator necesar BCA', href: '/calculatoare-rapide/bca', subtitle: 'Zidărie BCA — materiale și cost estimativ' },
    { title: 'Calculator necesar cărămidă cu goluri', href: '/calculatoare-rapide/caramida-goluri', subtitle: 'Zidărie cărămidă — materiale și cost estimativ' },
    { title: 'Calculator tencuială', href: '/calculatoare-rapide/tencuiala', subtitle: 'Tencuieli — materiale și cost estimativ' },
    { title: 'Calculator șapă', href: '/calculatoare-rapide/sapa', subtitle: 'Șapă de egalizare și autonivelantă — materiale și cost estimativ' },
    { title: 'Calculator finisaje interioare', href: '/calculatoare-rapide/finisaje-interioare', subtitle: 'Glet și vopsea lavabilă — materiale și cost estimativ' },
    { title: 'Calculator acoperiș', href: '/calculatoare-rapide/acoperis', subtitle: 'Structură lemn și învelitoare — materiale și cost estimativ' },
    { title: 'Calculator beton și armătură fundație', href: '/calculatoare-rapide/beton-armatura-fundatie', subtitle: 'Fundații — materiale și cost estimativ' },
  ]

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
      <h1 className="text-3xl sm:text-4xl font-serif text-[#1E2329] mb-2 tracking-tight">
        Calculatoare rapide
      </h1>
      <p className="text-base text-[#6B6860] mb-8">
        Colecție de calculatoare simple pentru șantier. Fără cont, fără date salvate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="group flex items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-xl bg-white hover:border-gray-300 hover:shadow-md transition-all no-underline">
            <div className="min-w-0 pr-4">
              <div className="text-base sm:text-lg font-semibold text-[#1E2329] tracking-tight break-words">
                {c.title}
              </div>
              <div className="text-sm text-[#6B6860] mt-1">
                {c.subtitle}
              </div>
            </div>
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center text-orange-600 font-bold text-lg group-hover:bg-orange-50 transition-colors">
              →
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
