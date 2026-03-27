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
    <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">

      {/* ── Header ── */}
      <div style={{
        background: 'white', border: '1px solid #E5E3DE',
        borderRadius: 14, padding: 'clamp(16px, 4vw, 28px)',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Rândul 1: breadcrumb + acțiuni */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#A8A59E', textDecoration: 'none',
              fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            }}>
            <ArrowLeft size={12} />
            Proiecte
          </Link>
          <ProjectActions
            projectId={id}
            initialDimensions={project.dimensions || {}}
            initialStages={stages}
          />
        </div>

        {/* Rândul 2: titlu + meta */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
            fontSize: 28, fontWeight: 400, color: '#1E2329', letterSpacing: '-0.02em',
            marginBottom: 6,
          }}>
            {project.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#F3F2EF', padding: '3px 10px', borderRadius: 100,
              fontSize: 11, fontWeight: 600, color: '#A8A59E', fontFamily: 'monospace',
            }}>
              <FileText size={11} /> {id.slice(0, 8).toUpperCase()}
            </span>
            {project.location && (
              <span style={{ fontSize: 13, color: '#6B6860', fontWeight: 400 }}>
                {project.location}
              </span>
            )}
          </div>
        </div>
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
