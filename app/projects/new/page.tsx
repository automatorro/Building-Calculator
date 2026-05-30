'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Building2, Factory, Home, Store, Wrench, LayoutTemplate, ExternalLink, Loader2 } from 'lucide-react'

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

const PROJECT_TYPES = [
  { 
    key: 'bloc', 
    label: 'Bloc de Apartamente', 
    icon: <Building2 size={28} strokeWidth={1.5} />, 
    stages: ['00. Organizare Șantier', '01. Infrastructură', '02. Suprastructură', '03. Arhitectură - Închideri', '04. Arhitectură - Finisaje', '05. Instalații Electrice', '06. Instalații Sanitare/Termice', '07. Fațade', '08. Sistematizare exterioară'] 
  },
  { 
    key: 'hala', 
    label: 'Hală Industrială', 
    icon: <Factory size={28} strokeWidth={1.5} />, 
    stages: ['00. Organizare Șantier', '01. Infrastructură / Fundații', '02. Structură Metalică', '03. Închideri Perimetrale', '04. Pardoseli Industriale', '05. Instalații', '06. Platforme exterioare'] 
  },
  { 
    key: 'casa', 
    label: 'Casă Individuală', 
    icon: <Home size={28} strokeWidth={1.5} />, 
    stages: ['Organizare Șantier', 'Infrastructură', 'Suprastructură', 'Arhitectură / Compartimentări', 'Finisaje Interioare', 'Instalații', 'Fațade / Acoperiș'] 
  },
  { 
    key: 'comercial', 
    label: 'Fit-out / Comercial', 
    icon: <Store size={28} strokeWidth={1.5} />, 
    stages: ['Desfaceri / Demolări', 'Compartimentări ușoare', 'Tavane false', 'Finisaje Premium', 'Instalații HVAC', 'Curenți slabi'] 
  },
  { 
    key: 'renovare', 
    label: 'Renovare', 
    icon: <Wrench size={28} strokeWidth={1.5} />, 
    stages: ['Demolări', 'Consolidări', 'Zidărie', 'Instalații', 'Finisaje Interioare', 'Finisaje Exterioare'] 
  },
  { 
    key: 'blank', 
    label: 'Personalizat / La liber', 
    icon: <LayoutTemplate size={28} strokeWidth={1.5} />, 
    stages: ['Deviz General'] 
  },
]

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep]           = useState(1)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [recentProject, setRecentProject] = useState<{ id: string; name: string } | null>(null)

  // Detectează dacă utilizatorul a revenit pe această pagină după ce a creat deja un proiect
  useEffect(() => {
    const stored = sessionStorage.getItem('bc_recent_project')
    if (stored) {
      try { setRecentProject(JSON.parse(stored)) } catch { /* ignoră */ }
    }
  }, [])

  const [projectType, setProjectType] = useState<string | null>(null)
  const [name,        setName]        = useState('')
  const [location,    setLocation]    = useState('')

  // Coeficienți cu valori implicite — editabili oricând din setările proiectului
  const regie  = 15
  const profit = 10
  const tva    = 21

  const selectedType = PROJECT_TYPES.find(t => t.key === projectType) ?? PROJECT_TYPES[3]

  const handleCreate = async () => {
    setLoading(true)
    setError(null)

    const finalName = name.trim() || selectedType.label + ' nou'

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single()

      const plan = profile?.subscription_plan ?? 'gratuit'

      if (plan === 'gratuit') {
        const { count } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if ((count ?? 0) >= 1) {
          setError('Planul Gratuit permite un singur proiect activ. Fă upgrade la Constructor pentru proiecte nelimitate.')
          setLoading(false)
          return
        }
      }
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        name: finalName,
        user_id: user?.id,
        location: location.trim(),
        settings: { profit, regie, tva, taxe_manopera: 2.25, project_type: selectedType.key },
        stages: selectedType.stages,
        total_estimated_revenue: 0,
      }])
      .select()
      .single()

    setLoading(false)

    if (projectError) {
      const msg = projectError.message.includes('PLAN_LIMIT:')
        ? projectError.message.replace('PLAN_LIMIT:', '').trim()
        : projectError.message
      setError(msg)
      return
    }

    if (project) {
      // Stochează proiectul creat recent — protecție la apăsarea Back
      sessionStorage.setItem('bc_recent_project', JSON.stringify({ id: project.id, name: project.name }))
      router.push(`/projects/${project.id}?tab=planning&new=1`)
      router.refresh()
    }
  }

  const canGoStep2 = !!projectType
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: '#F3F2EF',
    border: '1px solid #E5E3DE', borderRadius: 8,
    fontSize: 15, color: '#1E2329', fontFamily: sans, outline: 'none',
    transition: 'border-color .15s', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F2EF', fontFamily: sans }}>
      <style>{`
        .wiz-type-btn:hover { border-color: #E8500A !important; background: #FFF8F5 !important; }
        .wiz-input:focus { border-color: #E8500A !important; }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @media (max-width: 600px) {
          .wiz-types { grid-template-columns: 1fr 1fr !important; }
          .wiz-coef  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Overlay loading creare proiect ── */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(243,242,239,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 20,
            padding: '40px 48px', textAlign: 'center',
            boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
            animation: 'slideUp 0.25s ease',
            maxWidth: 340, width: '90%',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#FFF0E8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Loader2 size={26} style={{ color: '#E8500A', animation: 'spin 0.8s linear infinite' }} />
            </div>
            <p style={{
              fontFamily: serif, fontSize: 22, color: '#1E2329',
              letterSpacing: '-.02em', marginBottom: 8,
            }}>
              Se creează proiectul...
            </p>
            <p style={{ fontSize: 13, color: '#A8A59E', fontFamily: sans, lineHeight: 1.5 }}>
              Configurăm etapele și structura proiectului.<br />
              Te ducem imediat în editor.
            </p>
          </div>
        </div>
      )}

      {/* Banner proiect creat recent (protecție la Back) */}
      {recentProject && (
        <div style={{
          background: '#FFF8F0', borderBottom: '1px solid #E8500A33',
          padding: '12px 24px', display: 'flex', alignItems: 'center',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#FFF0E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Check size={16} style={{ color: '#E8500A' }} />
          </div>
          <p style={{ fontSize: 13, color: '#C43F06', fontWeight: 500, flex: 1 }}>
            Ai deja un proiect creat recent:{' '}
            <strong>{recentProject.name}</strong>.
            Vrei să-l deschizi?
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link
              href={`/projects/${recentProject.id}?tab=planning`}
              onClick={() => sessionStorage.removeItem('bc_recent_project')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#E8500A', color: '#FFFFFF', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}
            >
              <ExternalLink size={14} /> Deschide proiectul
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem('bc_recent_project')
                setRecentProject(null)
              }}
              style={{
                background: 'none', border: '1px solid #E8500A44', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, color: '#C43F06', cursor: 'pointer',
                fontFamily: sans, fontWeight: 500,
              }}
            >
              Continuă cu un proiect nou
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E3DE', padding: '16px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/projects" style={{ display: 'flex', alignItems: 'center', gap: 6,
            color: '#6B6860', textDecoration: 'none', fontSize: 14 }}>
            <ArrowLeft size={16} /> Proiecte
          </Link>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step > s ? '#2A7D4F' : step === s ? '#E8500A' : '#E5E3DE',
                  color: step >= s ? '#FFFFFF' : '#A8A59E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {step > s ? <Check size={13} /> : s}
                </div>
                {s < 2 && <div style={{ width: 32, height: 1, background: step > s ? '#2A7D4F' : '#E5E3DE' }} />}
              </div>
            ))}
          </div>
          <Link href="/projects" style={{ fontSize: 13, color: '#A8A59E', textDecoration: 'none' }}>
            Sari peste →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
              color: '#E8500A', marginBottom: 10 }}>Pasul 1 din 3</p>
            <h1 style={{ fontFamily: serif, fontSize: 32, color: '#1E2329', lineHeight: 1.1,
              letterSpacing: '-.02em', marginBottom: 8 }}>
              Selectați tipologia proiectului
            </h1>
            <p style={{ fontSize: 15, color: '#6B6860', marginBottom: 32, lineHeight: 1.5 }}>
              Etapele (WBS) se configurează automat conform practicilor din industrie.
            </p>

            <div className="wiz-types" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 28 }}>
              {PROJECT_TYPES.map(t => (
                <button key={t.key} type="button" className="wiz-type-btn" onClick={() => setProjectType(t.key)}
                  style={{
                    padding: '20px 16px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                    fontFamily: sans, transition: 'all .15s',
                    border: projectType === t.key ? '2px solid #E8500A' : '2px solid #E5E3DE',
                    background: projectType === t.key ? '#FFF0E8' : '#FFFFFF',
                    position: 'relative',
                  }}>
                  {projectType === t.key && (
                    <div style={{ position: 'absolute', top: 10, right: 10,
                      width: 18, height: 18, borderRadius: '50%', background: '#E8500A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={11} color="white" />
                    </div>
                  )}
                  <div style={{ color: projectType === t.key ? '#E8500A' : '#6B6860', marginBottom: 12 }}>{t.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1E2329' }}>{t.label}</div>
                </button>
              ))}
            </div>

            {/* Nume proiect */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#1E2329', display: 'block', marginBottom: 6 }}>
                Nume proiect
              </label>
              <input type="text" className="wiz-input"
                placeholder={projectType ? `${selectedType.label} — ${new Date().getFullYear()}` : 'ex: Casă nouă P+1, Florești'}
                value={name} onChange={e => setName(e.target.value)}
                style={inputStyle} />
            </div>

            {/* Locație */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#1E2329', display: 'block', marginBottom: 6 }}>
                Locație <span style={{ color: '#A8A59E', fontWeight: 400 }}>(opțional)</span>
              </label>
              <input type="text" className="wiz-input"
                placeholder="ex: Florești, Cluj"
                value={location} onChange={e => setLocation(e.target.value)}
                style={inputStyle} />
            </div>

            <button type="button" disabled={!canGoStep2} onClick={() => setStep(2)}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                background: canGoStep2 ? '#E8500A' : '#E5E3DE',
                color: canGoStep2 ? '#FFFFFF' : '#A8A59E',
                border: 'none', fontSize: 15, fontWeight: 600,
                fontFamily: sans, cursor: canGoStep2 ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              Continuă <ArrowRight size={16} />
            </button>
          </div>
        )}


        {/* ── Step 2 — Sumar și creare ── */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
              color: '#E8500A', marginBottom: 10 }}>Pasul 2 din 2</p>
            <h1 style={{ fontFamily: serif, fontSize: 32, color: '#1E2329', lineHeight: 1.1,
              letterSpacing: '-.02em', marginBottom: 8 }}>
              Totul e pregătit.
            </h1>
            <p style={{ fontSize: 15, color: '#6B6860', marginBottom: 28, lineHeight: 1.5 }}>
              Verifică datele și creează proiectul.
            </p>

            {/* Summary card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 14,
              padding: '24px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
                paddingBottom: 20, borderBottom: '1px solid #F3F2EF' }}>
                <div style={{ color: '#E8500A' }}>{selectedType.icon}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1E2329' }}>
                    {name.trim() || `${selectedType.label} nou`}
                  </div>
                  {location && <div style={{ fontSize: 13, color: '#6B6860', marginTop: 3 }}>{location}</div>}
                  <div style={{ fontSize: 12, color: '#A8A59E', marginTop: 3 }}>{selectedType.label}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#A8A59E', textTransform: 'uppercase',
                  letterSpacing: '.06em', marginBottom: 10 }}>Etape incluse</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedType.stages.map(s => (
                    <span key={s} style={{ fontSize: 12, background: '#F3F2EF', color: '#6B6860',
                      padding: '3px 10px', borderRadius: 100 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FCECEA', border: '1px solid #C0392B22',
                color: '#C0392B', padding: '10px 16px', borderRadius: 8, fontSize: 13,
                marginBottom: 20, lineHeight: 1.4 }}>
                {error}
              </div>
            )}

            <button type="button" disabled={loading} onClick={handleCreate}
              style={{
                width: '100%', padding: '15px', borderRadius: 8,
                background: loading ? '#C43F06' : '#E8500A',
                color: '#FFFFFF',
                border: 'none', fontSize: 16, fontWeight: 700,
                fontFamily: sans, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                marginBottom: 12,
                transition: 'background .2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(232,80,10,0.3)',
              }}>
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                  Se crează proiectul...
                </>
              ) : (
                <>Creează și deschide proiectul <ArrowRight size={16} /></>
              )}
            </button>

            <button type="button" onClick={() => setStep(1)}
              style={{ width: '100%', padding: '12px', borderRadius: 8,
                border: '1px solid #E5E3DE', background: 'transparent', color: '#6B6860',
                fontSize: 14, fontFamily: sans, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> Înapoi
            </button>
          </div>
        )}



      </div>
    </div>
  )
}
