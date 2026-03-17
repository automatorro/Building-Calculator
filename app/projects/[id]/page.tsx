import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Plus, Settings, FileText, Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import EstimateEditor from '@/components/EstimateEditor'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  // 1. Preia datele proiectului
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) {
    return notFound()
  }

  // 2. Preia liniile de deviz (estimate lines) cu datele articolelor din catalog
  const { data: estimateLines, error: linesError } = await supabase
    .from('estimate_lines')
    .select(`
      id,
      quantity,
      custom_prices,
      excluded_resources,
      items (
        id,
        code,
        name,
        um,
        normatives (code),
        resources (
          id,
          type,
          name,
          um,
          consumption,
          unit_price
        )
      )
    `)
    .eq('project_id', id)

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header Proiect */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Link href="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Înapoi la toate proiectele
          </Link>
          <h1 className="text-4xl font-black">{project.name}</h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1">
              <FileText size={14} /> ID: {id.slice(0, 8)}
            </span>
            <span>•</span>
            <span>{project.location || 'Locație nespecificată'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary transition-all">
            <Download size={20} />
          </button>
          <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary transition-all">
            <Settings size={20} />
          </button>
          <Link 
            href={`/catalog?projectId=${id}`}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Adaugă Articol
          </Link>
        </div>
      </div>

      <EstimateEditor 
        initialLines={estimateLines || []} 
        settings={project.settings} 
      />
    </main>
  )
}
