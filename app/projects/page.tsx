'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, MapPin, Calendar, ArrowRight, Briefcase, Trash2 } from 'lucide-react'

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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

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
    const confirmed = window.confirm(
      `Ești sigur că vrei să ștergi proiectul „${project.name || 'fără nume'}”?\n\nȘtergerea este permanentă. Nu vei mai avea acces la nicio dată din acest proiect.`
    )
    if (!confirmed) return

    setDeletingId(project.id)
    const { data: deletedRows, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)
      .select('id')

    if (error) {
      setDeletingId(null)
      window.alert('Eroare la ștergere: ' + error.message)
      return
    }

    if (!deletedRows || deletedRows.length === 0) {
      setDeletingId(null)
      window.alert(
        'Ștergerea nu a fost permisă de baza de date (RLS). Proiectul nu a fost șters.\n\n' +
        'Trebuie adăugată în Supabase o policy de DELETE pe tabela projects (cel puțin pentru rolul authenticated).'
      )
      return
    }

    setProjects(prev => (prev || []).filter(p => p.id !== project.id))
    setDeletingId(null)
    router.refresh()
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
              <div key={project.id} className="project-card" style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(project)}
                  disabled={deletingId === project.id}
                  aria-label="Șterge proiect"
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: '1px solid #E5E3DE',
                    background: deletingId === project.id ? '#F3F2EF' : '#FAFAF8',
                    color: '#C0392B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: deletingId === project.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Trash2 size={16} />
                </button>

                <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  {/* Card header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: '#FFF0E8',
                      borderRadius: 9, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0 }}>
                      <Briefcase size={18} color="#E8500A" />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'monospace',
                      color: '#A8A59E', background: '#F3F2EF',
                      padding: '3px 8px', borderRadius: 6 }}>
                      ID: {project.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Nume */}
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1E2329',
                    marginBottom: 12, lineHeight: 1.3 }}>
                    {project.name}
                  </h3>

                  {/* Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 13, color: '#6B6860' }}>
                      <MapPin size={13} color="#A8A59E" />
                      {project.location || 'Locație nespecificată'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 13, color: '#6B6860' }}>
                      <Calendar size={13} color="#A8A59E" />
                      Creat la {new Date(project.created_at).toLocaleDateString('ro-RO')}
                    </div>
                  </div>

                  {/* Footer card */}
                  <div style={{ paddingTop: 16, borderTop: '1px solid #F3F2EF',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#A8A59E',
                      textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Deschide Devizul
                    </span>
                    <ArrowRight size={15} color="#E8500A" />
                  </div>
                </Link>
              </div>
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
            <Link href="/projects/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#E8500A', color: '#FAFAF8',
              padding: '12px 24px', borderRadius: 9,
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
            }}>
              <Plus size={16} />
              Creează Primul Proiect
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
