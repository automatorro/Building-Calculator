import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, FileText, Maximize, Ruler, Layers, MoveDiagonal2 } from 'lucide-react'
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
    
    // Scrub db legacy naming
    let safeStageName = line.stage_name;
    if (safeStageName === 'Alte Lucrări' || safeStageName === 'Alte lucrari') {
      safeStageName = '';
    }

    return {
      ...line,
      stage_name: safeStageName,
      items: item ? { ...item, normatives: norm || null, resources: item.resources || [] } : null,
    }
  })

  /* 5. Etapele proiectului — din Supabase, nu hardcodate */
  const stages: string[] = Array.isArray(project.stages) && project.stages.length > 0
    ? project.stages
    : ['Fundație', 'Structură', 'Zidărie', 'Acoperiș', 'Instalații', 'Finisaje']

  return (
    <main className="min-h-screen w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">

      {/* ── Header ── */}
      <div style={{
        background: 'white', border: '1px solid #E5E3DE',
        borderRadius: 14, padding: 'clamp(16px, 4vw, 28px)',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Rândul 1: breadcrumb + acțiuni */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#A8A59E', textDecoration: 'none',
              fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            }}>
            <ArrowLeft size={12} />
            Proiecte
          </Link>
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

        {/* Rândul 3: Dimensiuni proiect */}
        {project.dimensions && Object.keys(project.dimensions).length > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            flexWrap: 'wrap',
            padding: '12px 16px',
            background: '#FAFAF8',
            border: '1px solid #E5E3DE',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.04em', marginRight: 4 }}>
              Configurație:
            </div>
            
            {project.dimensions.suprafata && (
              <DimensionChip 
                icon={<Maximize size={12} />} 
                label="Suprafață" 
                value={`${project.dimensions.suprafata.toLocaleString('ro-RO')} mp`} 
              />
            )}
            
            {(project.dimensions.niveluri || project.dimensions.levels) && (
              <DimensionChip 
                icon={<Layers size={12} />} 
                label="Regim" 
                value={`${project.dimensions.niveluri || project.dimensions.levels} niv`} 
              />
            )}
            
            {(project.dimensions.inaltime || project.dimensions.height) && (
              <DimensionChip 
                icon={<Ruler size={12} />} 
                label="Înălțime" 
                value={`${(project.dimensions.inaltime || project.dimensions.height).toLocaleString('ro-RO')} m`} 
              />
            )}

            {project.dimensions.perimetru && (
              <DimensionChip 
                icon={<MoveDiagonal2 size={12} />} 
                label="Perimetru" 
                value={`${project.dimensions.perimetru.toLocaleString('ro-RO')} ml`} 
              />
            )}

            {/* Alte dimensiuni specifice dacă există și sunt relevante */}
            {project.dimensions.adancime && (
              <DimensionChip 
                icon={<ArrowLeft size={10} style={{ transform: 'rotate(-90deg)' }} />} 
                label="Adâncime" 
                value={`${project.dimensions.adancime.toLocaleString('ro-RO')} m`} 
              />
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProjectActions
            projectId={id}
            initialDimensions={project.dimensions || {}}
            initialStages={stages}
          />
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

function DimensionChip({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 6,
      padding: '4px 10px',
      background: 'white',
      border: '1px solid #E5E3DE',
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
    }}>
      <span style={{ color: '#E8500A', display: 'flex' }}>{icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: 9, color: '#A8A59E', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1E2329' }}>{value}</span>
      </div>
    </div>
  )
}
