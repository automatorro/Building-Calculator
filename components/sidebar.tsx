"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calculator, ListTree, Package, TrendingUp, ScanText, Settings, Building2, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Proiecte', href: '/projects', icon: Home },
  { name: 'Estimator', href: '/estimator/current', icon: Calculator },
  { name: 'Deviz Detaliat', href: '/deviz/current', icon: ListTree },
  { name: 'Timeline Lucrări', href: '/timeline/current', icon: CalendarDays },
  { name: 'Materiale', href: '/procurement/current', icon: Package },
  { name: 'Analiză Oferte', href: '/offers/current', icon: TrendingUp },
  { name: 'Extragere OCR', href: '/ocr/current', icon: ScanText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-slate-200/60 bg-white/60 backdrop-blur-xl z-20 flex flex-col p-4 shadow-sm">
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="bg-blue-600 p-2 text-white rounded-xl shadow-md shadow-blue-500/20">
          <Building2 className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">BuildCalc</span>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href.replace('/current', ''))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 ring-1 ring-blue-200/50" 
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200/60">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all">
          <Settings className="w-5 h-5 text-slate-400" />
          Setări Cont
        </Link>
      </div>
    </aside>
  )
}
