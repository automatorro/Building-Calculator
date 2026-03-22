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

  /* 1. Preia proiectul */
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) return notFound()

  /* 2. Preia liniile de deviz */
  const { data: estimateLines } = await supabase
    .from('estimate_lines')
    .select(`
      *,
      items (
        *,
        category_id,
        normative_id,
        normatives (code),
        resources (*)
      )
    `)
    .eq('project_id', id)

  /* 3. Preia achizițiile */
  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  /* 4. Formatare linii */
  const formattedLines = (estimateLines || []).map((line: any) => {
    const item = Array.isArray(line.items) ? line.items[0] : line.items
    const norm = item && Array.isArray(item.normatives) ? item.normatives[0] : item?.normatives
    return {
      ...line,
      items: item ? { ...item, normatives: norm || null, resources: item.resources || [] } : null,
    }
  })

  /* 5. Etapele proiectului — din Supabase, nu hardcodate */
  const stages: string[] = Array.isArray(project.stages) && project.stages.length > 0
    ? project.stages
    : ['Fundație', 'Structură', 'Zidărie', 'Acoperiș', 'Instalații', 'Finisaje']

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/projects"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 group text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Proiecte
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize: 26, fontWeight: 400, color: '#1E2329', letterSpacing: '-0.02em',
          }}>
            {project.name}
          </h1>
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
          initialStages={stages}
        />
      </div>

      {/* ── Container principal ── */}
      <ProjectClientContainer
        projectId={id}
        projectName={project.name}
        projectLocation={project.location}
        initialLines={formattedLines as any}
        initialPurchases={purchases || []}
        settings={project.settings || { profit: 5, regie: 10, tva: 21, taxe_manopera: 2.25 }}
        dimensions={project.dimensions || {}}
        totalEstimatedRevenue={project.total_estimated_revenue || 0}
        stages={stages}
      />
    </main>
  )
}
