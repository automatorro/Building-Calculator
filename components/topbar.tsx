import { Bell, Search, UserCircle } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/40 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 shadow-sm">
      <div className="flex items-center relative flex-1 max-w-xs md:max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3" />
        <input 
          type="text" 
          placeholder="Caută în proiecte..." 
          className="w-full pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          <UserCircle className="w-8 h-8 text-slate-400" />
          <span className="hidden sm:inline">Contul meu</span>
        </button>
      </div>
    </header>
  )
}
