"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Calculator,
  ListTree,
  Package,
  TrendingUp,
  ScanText,
  Settings,
  Building2,
  CalendarDays,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Extrage projectId din pathname ────────────────────────────────────────
   /projects/abc-123/deviz  → "abc-123"
   /projects/abc-123        → "abc-123"
   /projects                → null
   ─────────────────────────────────────────────────────────────────────────── */
function getProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/projects\/([^/]+)/)
  if (!match) return null
  const id = match[1]
  // Exclude sub-rute care nu sunt ID-uri (new, templates etc.)
  if (['new', 'templates'].includes(id)) return null
  return id
}

/* ─── Definiție nav items ───────────────────────────────────────────────────
   href e un template: {id} va fi înlocuit cu projectId-ul activ
   fallback e ruta mock (când nu există proiect activ în context)
   ─────────────────────────────────────────────────────────────────────────── */
const PROJECT_NAV = [
  {
    name: 'Dashboard',
    icon: Home,
    // Tab-ul dashboard e în /projects/[id] direct (primul tab)
    href: (id: string) => `/projects/${id}`,
    matchSegment: null, // activ când suntem pe /projects/[id] fără sub-rută
    fallback: '/projects',
  },
  {
    name: 'Estimator',
    icon: Calculator,
    href: (id: string) => `/projects/${id}?tab=planning`,
    matchSegment: 'planning',
    fallback: '/estimator/current',
  },
  {
    name: 'Deviz Detaliat',
    icon: ListTree,
    href: (id: string) => `/projects/${id}?tab=deviz`,
    matchSegment: 'deviz',
    fallback: '/deviz/current',
  },
  {
    name: 'Timeline Lucrări',
    icon: CalendarDays,
    href: (id: string) => `/projects/${id}?tab=timeline`,
    matchSegment: 'timeline',
    fallback: '/timeline/current',
  },
  {
    name: 'Materiale',
    icon: Package,
    href: (id: string) => `/projects/${id}?tab=procurement`,
    matchSegment: 'procurement',
    fallback: '/procurement/current',
  },
  {
    name: 'Analiză Oferte',
    icon: TrendingUp,
    href: (id: string) => `/projects/${id}?tab=offers`,
    matchSegment: 'offers',
    fallback: '/offers/current',
  },
  {
    name: 'Extragere OCR',
    icon: ScanText,
    href: (id: string) => `/projects/${id}?tab=ocr`,
    matchSegment: 'ocr',
    fallback: '/ocr/current',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const projectId = getProjectId(pathname)

  // Tab activ din query string (ex: ?tab=deviz)
  // Pe server-side rendering nu avem acces la searchParams, dar usePathname
  // nu include query string, deci pentru highlight folosim pathname + un
  // trick simplu: verificăm dacă URL-ul curent e o pagină mock
  const isMockRoute = [
    '/estimator/', '/deviz/', '/timeline/',
    '/procurement/', '/offers/', '/ocr/',
  ].some(p => pathname.startsWith(p))

  return (
    <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-slate-200/60 bg-white/60 backdrop-blur-xl z-20 flex-col p-4 shadow-sm">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div style={{
          width: 32, height: 32,
          background: '#E8500A',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span style={{
          fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
          fontWeight: 600, fontSize: 15,
          color: '#1E2329',
          letterSpacing: '-0.02em',
        }}>
          Building<span style={{ color: '#E8500A' }}>Calc</span>
        </span>
      </div>

      {/* ── Context proiect activ ── */}
      {projectId && (
        <div className="mx-2 mb-4 px-3 py-2 rounded-lg border border-orange-200/60 bg-orange-50/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-0.5">
                Proiect activ
              </p>
              <p className="text-xs text-orange-600 font-mono truncate max-w-[140px]">
                #{projectId.slice(0, 8)}
              </p>
            </div>
            <Link href="/projects" className="text-orange-400 hover:text-orange-600 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Navigație ── */}
      <nav className="flex-1 space-y-1">
        {/* Link spre lista de proiecte */}
        <Link
          href="/projects"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
            !projectId && pathname === '/projects'
              ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          )}
        >
          <Home className={cn(
            "w-5 h-5 transition-colors",
            !projectId && pathname === '/projects'
              ? "text-orange-600"
              : "text-slate-400 group-hover:text-slate-600"
          )} />
          Proiectele Mele
        </Link>

        {/* Separator */}
        {projectId && (
          <div className="pt-2 pb-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Proiect curent
            </p>
          </div>
        )}

        {/* Nav items proiect */}
        {PROJECT_NAV.map((item) => {
          const Icon = item.icon
          const href = projectId ? item.href(projectId) : item.fallback

          // Determină dacă e activ
          let isActive = false
          if (projectId) {
            if (item.matchSegment === null) {
              // Dashboard: activ când suntem pe /projects/[id] fără alt tab în URL
              isActive = pathname === `/projects/${projectId}`
            } else {
              // Alte tab-uri: le marcăm ca active dacă e sub-ruta corespunzătoare
              isActive = pathname.startsWith(`/projects/${projectId}/${item.matchSegment}`)
            }
          } else {
            // Fără proiect activ: activ dacă suntem pe ruta mock
            isActive = pathname.startsWith(item.fallback.replace('/current', ''))
          }

          return (
            <Link
              key={item.name}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive
                  ? "text-orange-600"
                  : "text-slate-400 group-hover:text-slate-600"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="mt-auto pt-4 border-t border-slate-200/60">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          Setări Cont
        </Link>
      </div>
    </aside>
  )
}
