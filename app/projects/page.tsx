import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent mb-2">
            Proiectele Mele
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestionează aici toate calculele și devizele tale active.
          </p>
        </div>
        <Link 
          href="/projects/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all"
        >
          <Plus size={20} />
          Proiect Nou
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl mb-8">
          <p className="font-bold">Eroare la încărcarea proiectelor:</p>
          <p>{error.message}</p>
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block glass-card p-6 border-transparent hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Briefcase size={24} />
                </div>
                <div className="text-xs font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                  ID: {project.id.slice(0, 8)}
                </div>
              </div>

              <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                {project.name}
              </h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={14} />
                  {project.location || 'Locație nespecificată'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  Creat la {new Date(project.created_at).toLocaleDateString('ro-RO')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Deschide Devizul
                </span>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center glass-card border-dashed">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Briefcase size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Nu ai niciun proiect creat încă</h2>
          <p className="text-slate-500 max-w-sm mb-8">
            Începe prin a crea primul tău proiect pentru a genera devize și a calcula costurile de construcție.
          </p>
          <Link 
            href="/projects/new"
            className="bg-primary/10 text-primary px-8 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all"
          >
            Creează Primul Proiect
          </Link>
        </div>
      )}
    </main>
  )
}
