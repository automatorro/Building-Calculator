import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { ArrowLeft, Plus, Settings, FileText, Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import EstimateEditor from '@/components/EstimateEditor'
import ProjectActions from '@/components/ProjectActions'

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

        <ProjectActions 
          projectId={id} 
          initialDimensions={project.dimensions || {}} 
        />
      </div>

      <EstimateEditor 
        initialLines={estimateLines || []} 
        settings={project.settings} 
        dimensions={project.dimensions || {}}
      />
    </main>
  )
}
