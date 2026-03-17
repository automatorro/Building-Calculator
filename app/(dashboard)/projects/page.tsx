import { Plus, Home, Building2, Calendar, HardHat } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Proiectele mele</h1>
          <p className="text-slate-500 mt-1">Gestionează estimările și devizele lucrărilor.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20 active:scale-95">
          <Plus className="w-5 h-5" />
          Proiect Nou
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Project Card for presentation */}
        <Link href="/estimator/current" className="glass-card p-6 block hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group ring-1 ring-slate-200/50 hover:ring-blue-500/30">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-100/50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold tracking-wide">ACTIV</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Casa Verde (Exemplu)</h3>
          <p className="text-slate-500 text-sm mb-6 line-clamp-2">Locuință unifamilială, P+1E, structură beton armat, acoperiș țiglă ceramică.</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 text-sm text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <HardHat className="w-4 h-4 text-slate-400" /> 165 mp
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" /> Azi
            </div>
          </div>
        </Link>
        
        {/* Placeholder for creating new directly */}
        <button className="glass-card p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-600 hover:bg-slate-50/50 hover:border-blue-200 transition-all duration-300 min-h-[220px] border-dashed border-2 cursor-pointer group">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold">Creează proiect nou</span>
        </button>
      </div>
    </div>
  )
}
