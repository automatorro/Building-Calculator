'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Briefcase, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import ProjectCard from '@/components/ProjectCard'

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const [projects, setProjects] = useState<any[] | null>(null)
  const [error, setError] = useState<{ message: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    const load = async () => {
      setLoading(true)

      // Get current user for explicit filter (defense-in-depth, alongside RLS)
      const { data: { user } } = await supabase.auth.getUser()

      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      // Filtru explicit pe user_id — previne expunere date dacă RLS e dezactivat accidental
      if (user) {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query

      if (!alive) return
      if (error) setError({ message: error.message })
      else setError(null)
      setProjects((data as any[]) || [])
      setLoading(false)
    }

    load()

    return () => { alive = false }
  }, [supabase])

  const handleDeleteProject = async (project: { id: string; name?: string }) => {
    const { data: deletedRows, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)
      .select('id')

    if (error) {
      console.error('Supabase delete error:', error)
      window.alert(`Eroare la ștergere (Server): ${error.message}\n\nDetalii: ${error.details || 'N/A'}`)
      return
    }

    if (!deletedRows || deletedRows.length === 0) {
      console.warn('No rows deleted - RLS check failed')
      window.alert(
        'Ștergerea nu a fost permisă de bază (RLS).\n\n' +
        'Acest lucru se întâmplă dacă proiectul aparține altui utilizator sau dacă sesiunea a expirat.'
      )
      return
    }

    // Success: Update local state and refresh router
    setProjects(prev => (prev || []).filter(p => p.id !== project.id))
    router.refresh()
    // toast.success('Proiect șters!')
  }

  const handleCreateDemo = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Trebuie să fii autentificat pentru a crea un proiect demo.')
      setLoading(false)
      return
    }

    // 1. Create project
    const { data: project, error: pError } = await supabase
      .from('projects')
      .insert([{
        name: '📘 PROIECT DEMO - Vilă P+1 (Exemplu)',
        location: 'Cluj-Napoca (Demo)',
        user_id: user.id,
        stages: ['Infrastructură', 'Suprastructură', 'Finisaje', 'Instalații']
      }])
      .select()
      .single()

    if (pError) {
      toast.error('Eroare proiect demo: ' + pError.message)
      setLoading(false)
      return
    }

    // 2. Create sample lines using the modern schema
    // Note: We use resources_override to simulate a real recipe with Material, Labor, etc.
    const demoLines = [
      { 
        project_id: project.id, 
        stage_name: 'Infrastructură', 
        name: 'Săpătură manuală de pământ în spații înguste', 
        unit: 'mc', 
        quantity: 24, 
        user_id: user.id,
        unit_price: 0,
        resources_override: [
          { id: 'res-1', name: 'Manoperă săpătură', type: 'labor', um: 'mc', consumption: 1, unit_price: 85 }
        ]
      },
      { 
        project_id: project.id, 
        stage_name: 'Infrastructură', 
        name: 'Fundații continue din beton C16/20', 
        unit: 'mc', 
        quantity: 18, 
        user_id: user.id,
        unit_price: 0,
        resources_override: [
          { id: 'res-2', name: 'Beton C16/20', type: 'material', um: 'mc', consumption: 1.02, unit_price: 450 },
          { id: 'res-3', name: 'Manoperă turnare', type: 'labor', um: 'mc', consumption: 1, unit_price: 120 }
        ]
      },
      { 
        project_id: project.id, 
        stage_name: 'Suprastructură', 
        name: 'Zidărie din blocuri BCA 25cm', 
        unit: 'mc', 
        quantity: 42, 
        user_id: user.id,
        unit_price: 0,
        resources_override: [
          { id: 'res-4', name: 'Blocuri BCA 25cm', type: 'material', um: 'mc', consumption: 1.05, unit_price: 580 },
          { id: 'res-5', name: 'Manoperă zidărie', type: 'labor', um: 'mc', consumption: 1, unit_price: 180 }
        ]
      },
      { 
        project_id: project.id, 
        stage_name: 'Suprastructură', 
        name: 'Beton în stâlpi, grinzi și centuri', 
        unit: 'mc', 
        quantity: 12, 
        user_id: user.id,
        unit_price: 0,
        resources_override: [
          { id: 'res-6', name: 'Beton C20/25', type: 'material', um: 'mc', consumption: 1.05, unit_price: 480 },
          { id: 'res-7', name: 'Manoperă cofrare/turnare', type: 'labor', um: 'mc', consumption: 1, unit_price: 350 },
          { id: 'res-8', name: 'Utilaj (pompă beton)', type: 'equipment', um: 'mc', consumption: 1, unit_price: 45 }
        ]
      },
      { 
        project_id: project.id, 
        stage_name: 'Finisaje', 
        name: 'Tencuială interior (manuală)', 
        unit: 'mp', 
        quantity: 180, 
        user_id: user.id,
        unit_price: 0,
        resources_override: [
          { id: 'res-9', name: 'Multibat/Nisip', type: 'material', um: 'mp', consumption: 1, unit_price: 15 },
          { id: 'res-10', name: 'Manoperă tencuială', type: 'labor', um: 'mp', consumption: 1, unit_price: 35 }
        ]
      },
      { 
        project_id: project.id, 
        stage_name: 'Finisaje', 
        name: 'Glet de ipsos (2 straturi)', 
        unit: 'mp', 
        quantity: 180, 
        user_id: user.id,
        unit_price: 0,
        resources_override: [
          { id: 'res-11', name: 'Glet de ipsos', type: 'material', um: 'mp', consumption: 1, unit_price: 12 },
          { id: 'res-12', name: 'Manoperă glet', type: 'labor', um: 'mp', consumption: 1, unit_price: 25 }
        ]
      }
    ]

    const { error: lError } = await supabase.from('estimate_lines').insert(demoLines)
    
    if (lError) {
      console.error('Demo lines insertion failed:', lError)
      toast.error('Eroare la generarea rândurilor: ' + lError.message)
      // Cleanup: Ștergem proiectul dacă nu am putut genera liniile pentru a evita starea inconsistentă
      await supabase.from('projects').delete().eq('id', project.id)
      setLoading(false)
    } else {
      toast.success('Proiect Demo creat cu succes!')
      router.push(`/projects/${project.id}`)
      router.refresh()
    }
  }

  const S = {
    page: {
      minHeight: '100vh',
      background: '#FAFAF8',
      fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
    } as React.CSSProperties,
    main: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '48px 32px',
    } as React.CSSProperties,
  }

  return (
    <div style={S.page}>
      <main style={S.main}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
              fontSize: 36, fontWeight: 400, color: '#1E2329',
              letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
            }}>
              Proiectele Mele
            </h1>
            <p style={{ fontSize: 15, color: '#6B6860', fontWeight: 300 }}>
              Gestionează aici toate calculele și devizele tale active.
            </p>
          </div>
          <Link href="/projects/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#E8500A', color: '#FAFAF8',
            padding: '11px 22px', borderRadius: 9,
            fontSize: 14, fontWeight: 500, textDecoration: 'none',
            transition: 'background .2s',
          }}>
            <Plus size={16} />
            Proiect Nou
          </Link>
        </div>

        {/* ── Eroare ── */}
        {error && (
          <div style={{ background: '#FCECEA', border: '1px solid #C0392B22',
            color: '#C0392B', padding: '14px 20px', borderRadius: 10,
            fontSize: 14, marginBottom: 24 }}>
            <strong>Eroare la încărcare:</strong> {error.message}
          </div>
        )}

        {/* ── Grid proiecte ── */}
        {loading ? (
          <div style={{ fontSize: 14, color: '#6B6860' }}>Se încarcă proiectele…</div>
        ) : !error && projects && projects.length > 0 ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : !error && (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '80px 32px',
            background: '#FAFAF8', border: '1px dashed #E5E3DE',
            borderRadius: 14 }}>
            <div style={{ width: 60, height: 60, background: '#F3F2EF',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px' }}>
              <Briefcase size={28} color="#A8A59E" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
              fontSize: 24, fontWeight: 400, color: '#1E2329', marginBottom: 10 }}>
              Nu ai niciun proiect încă
            </h2>
            <p style={{ fontSize: 14, color: '#6B6860', maxWidth: 340,
              margin: '0 auto 28px', lineHeight: 1.6, fontWeight: 300 }}>
              Începe prin a crea primul tău proiect pentru a genera devize
              și a calcula costurile de construcție.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/projects/new" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#E8500A', color: '#FAFAF8',
                padding: '12px 24px', borderRadius: 9,
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
              }}>
                <Plus size={16} />
                Creează Primul Proiect
              </Link>
              <button 
                onClick={handleCreateDemo}
                disabled={loading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#F3F2EF', color: '#1E2329',
                  padding: '12px 24px', borderRadius: 9,
                  fontSize: 14, fontWeight: 500, border: '1px solid #E5E3DE',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                <Rocket size={16} />
                {loading ? 'Se generează...' : 'Creează Proiect Demo'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
