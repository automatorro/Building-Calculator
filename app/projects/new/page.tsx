'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Save, Building2, MapPin, Percent, TrendingUp, Info, LayoutTemplate, Check } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    profit: 5,
    regie: 10,
    tva: 19,
    taxe_manopera: 2.25,
    total_estimated_revenue: 0
  })

  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from('project_templates').select('*').order('created_at', { ascending: false })
      if (data) setTemplates(data)
    }
    fetchTemplates()
  }, [])

  const DEFAULT_STAGES = ["Organizare Șantier", "Fundație", "Structură", "Zidărie", "Instalații", "Finisaje Interioare", "Finisaje Exterioare"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let finalStages = DEFAULT_STAGES
    let templateLines: any[] = []

    if (selectedTemplateId) {
      const t = templates.find(tpl => tpl.id === selectedTemplateId)
      if (t) {
        finalStages = t.stages
        templateLines = t.lines_snapshot
      }
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        { 
          name: formData.name, 
          location: formData.location,
          settings: {
            profit: formData.profit,
            regie: formData.regie,
            tva: formData.tva,
            taxe_manopera: formData.taxe_manopera
          },
          stages: finalStages,
          total_estimated_revenue: formData.total_estimated_revenue
        }
      ])
      .select()
      .single()

    if (projectError) {
      setError(projectError.message)
      setLoading(false)
      return
    }

    if (project && templateLines.length > 0) {
      const { error: linesError } = await supabase
        .from('estimate_lines')
        .insert(templateLines.map(l => ({
          project_id: project.id,
          manual_name: l.manual_name,
          manual_um: l.manual_um,
          quantity: l.quantity,
          stage_name: l.stage_name,
          resources_override: l.resources || [],
          category_id: l.category_id,
          normative_id: l.normative_id
        })))
      if (linesError) console.error('Error cloning template lines:', linesError)
    }

    if (project) {
      router.push(`/projects/${project.id}`)
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-3xl mx-auto text-slate-900 dark:text-white">
      <Link href="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-6 sm:mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Înapoi la Proiecte
      </Link>

      <div className="mb-8 sm:mb-12">
        <h1 className="page-title" style={{ fontSize: 32, marginBottom: 8 }}>Creează Proiect Nou</h1>
        <p style={{ color: '#6B6860', fontSize: 15, fontWeight: 300 }}>Configurează datele de bază pentru noul tău deviz.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Sectiune Informatii Generale */}
        <div className="glass-card p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6" style={{ color: '#E8500A' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1E2329' }}>Informații Generale</h2>
          </div>
          
          <div className="grid gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Nume Proiect *
              </label>
              <input
                required
                type="text"
                placeholder="ex: Vila P+1 Tunari"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all text-base sm:text-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Locație
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Localitate / Județ"
                  className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all text-sm sm:text-base"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sectiune Alegere Sablon */}
        <div className="glass-card p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-6" style={{ color: '#E8500A' }}>
            <LayoutTemplate className="w-6 h-6" />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1E2329' }}>Alege un Șablon</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedTemplateId(null)}
              style={{
                padding: 16, borderRadius: 10, textAlign: 'left', transition: 'all .15s',
                border: !selectedTemplateId ? '2px solid #E8500A' : '2px solid #E5E3DE',
                background: !selectedTemplateId ? '#FFF0E8' : '#FAFAF8',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ padding: 6, background: '#F3F2EF', borderRadius: 7 }}><Building2 size={16} color="#A8A59E" /></div>
                {!selectedTemplateId && <Check size={18} color="#E8500A" />}
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#1E2329', marginBottom: 4 }}>Standard (Goluț)</h4>
              <p style={{ fontSize: 11, color: '#A8A59E' }}>Doar etapele de bază, fără articole pre-configurate.</p>
            </button>

            {templates.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplateId(t.id)}
                style={{
                  padding: 16, borderRadius: 10, textAlign: 'left', transition: 'all .15s',
                  border: selectedTemplateId === t.id ? '2px solid #E8500A' : '2px solid #E5E3DE',
                  background: selectedTemplateId === t.id ? '#FFF0E8' : '#FAFAF8',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ padding: 6, background: '#FFF0E8', borderRadius: 7 }}><LayoutTemplate size={16} color="#E8500A" /></div>
                  {selectedTemplateId === t.id && <Check size={18} color="#E8500A" />}
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#1E2329', marginBottom: 4 }}>{t.name}</h4>
                <p style={{ fontSize: 11, color: '#A8A59E' }}>{t.lines_snapshot?.length || 0} articole salvate.</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sectiune Setări Economice (Coeficienți) */}
        <div className="glass-card p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" style={{ color: '#E8500A' }} />
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1E2329' }}>Coeficienți & Recapitație</h2>
            </div>
            <div style={{ padding: 6, background: '#FFF0E8', borderRadius: 7 }}
              title="Aceste valori vor fi folosite pentru calculul prețului final de ofertă.">
              <Info className="w-4 h-4" style={{ color: '#E8500A' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl">
              <label className="block text-[10px] sm:text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                Marjă Profit (%)
              </label>
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="number"
                  step="0.1"
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent focus:outline-none"
                  value={formData.profit}
                  onChange={(e) => setFormData({ ...formData, profit: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl">
              <label className="block text-[10px] sm:text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                Cheltuieli Indirecte (%)
              </label>
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="number"
                  step="0.1"
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent focus:outline-none"
                  value={formData.regie}
                  onChange={(e) => setFormData({ ...formData, regie: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl">
              <label className="block text-[10px] sm:text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                Cota TVA (%)
              </label>
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="number"
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent focus:outline-none"
                  value={formData.tva}
                  onChange={(e) => setFormData({ ...formData, tva: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl ring-2 ring-primary/20">
              <label className="block text-[10px] sm:text-xs font-black text-primary mb-2 uppercase tracking-widest">
                Venit Estimat Proiect (Vânzare)
              </label>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="number"
                  placeholder="ex: 500000"
                  className="w-full text-xl sm:text-2xl font-black bg-transparent focus:outline-none"
                  value={formData.total_estimated_revenue}
                  onChange={(e) => setFormData({ ...formData, total_estimated_revenue: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 italic">Crucial pentru calculul ROI și Cashflow</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl text-lg sm:text-xl font-black transition-all shadow-xl active:scale-[0.98]
            ${loading 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
              : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40'
            }
          `}
        >
          {loading ? 'Se creează...' : (
            <>
              <Save className="w-6 h-6" />
              Salvează și Începe Devizul
            </>
          )}
        </button>
      </form>
    </main>
  )
}
