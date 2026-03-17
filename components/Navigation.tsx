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
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg text-primary">Navigație</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-bold transition-all
                        ${isActive 
                          ? 'bg-primary/10 text-primary shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <Icon size={24} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <div className="pt-6 border-t border-border/50">
                <Link 
                  href="/projects/new"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all text-lg"
                >
                  <Calculator size={20} />
                  Proiect Nou
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
