import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProjectClientContainer from '@/components/ProjectClientContainer'
import ProjectActions from '@/components/ProjectActions'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  // 1. Preia datele proiectului (inclusiv noul venit estimat)
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) {
    return notFound()
  }

  // 2. Preia liniile de deviz (Planificare)
  const { data: estimateLines } = await supabase
    .from('estimate_lines')
    .select(`
      *,
      items (
        *,
        normatives (code),
        resources (
          *
        )
      )
    `)
    .eq('project_id', id)

  // 3. Preia achizițiile reale (Realizat)
  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('project_id', id)
    .order('date', { ascending: false })

  // 4. Mapăm datele pentru a corespunde interfeței EstimateLine (compatibilitate cu Phase 5)
  const formattedLines = (estimateLines || []).map((line: any) => {
    const item = Array.isArray(line.items) ? line.items[0] : line.items
    const norm = item && Array.isArray(item.normatives) ? item.normatives[0] : item?.normatives
    
    return {
      ...line,
      items: item ? {
        ...item,
        normatives: norm || null,
        resources: item.resources || []
      } : null
    }
  })

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Minimalist */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 group text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Proiecte
          </Link>
          <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-tighter">
            <span className="flex items-center gap-1">
              <FileText size={12} /> {id.slice(0, 8)}
            </span>
            <span>•</span>
            <span>{project.location || 'Locație nespecificată'}</span>
          </div>
        </div>

        <ProjectActions 
          projectId={id} 
          initialDimensions={project.dimensions || {}} 
          initialStages={project.stages || []}
        />
      </div>

      <ProjectClientContainer 
        projectId={id}
        projectName={project.name}
        initialLines={formattedLines as any}
        initialPurchases={purchases || []}
        settings={project.settings}
        dimensions={project.dimensions || {}}
        totalEstimatedRevenue={project.total_estimated_revenue || 0}
      />
    </main>
  )
}
