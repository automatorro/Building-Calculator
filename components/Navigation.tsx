'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, LayoutDashboard, Bookmark, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Catalog Norme', href: '/catalog', icon: Bookmark },
  { name: 'Proiectele Mele', href: '/projects', icon: Calculator },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
            <Calculator size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Building<span className="text-primary font-black">Calc</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex p-2 text-slate-500 hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
          <Link 
            href="/projects/new"
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            Proiect Nou
          </Link>
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 py-4 space-y-2 animate-in fade-in slide-in-from-top-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600'}
                `}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
