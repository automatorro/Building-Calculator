'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Save, Building2, MapPin, Percent, TrendingUp, Info } from 'lucide-react'
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
    tva: 21,
    taxe_manopera: 2.25
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
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
          }
        }
      ])
      .select()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data) {
      router.push(`/projects/${data[0].id}`)
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-3xl mx-auto">
      <Link href="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-6 sm:mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Înapoi la Proiecte
      </Link>

      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-black mb-3">Creează Proiect Nou</h1>
        <p className="text-slate-500 text-sm sm:text-base">Configurează datele de bază pentru noul tău deviz.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Sectiune Informatii Generale */}
        <div className="glass-card p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Informații Generale</h2>
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

        {/* Sectiune Setări Economice (Coeficienți) */}
        <div className="glass-card p-5 sm:p-8 bg-primary/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-primary">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Coeficienți & Recapitație</h2>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg" title="Aceste valori vor fi folosite pentru calculul prețului final de ofertă.">
              <Info className="w-4 h-4 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 bg-white dark:bg-slate-900 border border-border rounded-xl">
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

            <div className="p-4 bg-white dark:bg-slate-900 border border-border rounded-xl">
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

            <div className="p-4 bg-white dark:bg-slate-900 border border-border rounded-xl">
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

            <div className="p-4 bg-white dark:bg-slate-900 border border-border rounded-xl opacity-60">
              <label className="block text-[10px] sm:text-xs font-black text-slate-400 mb-1 uppercase tracking-widest">
                CAM (Manoperă %)
              </label>
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  disabled
                  type="number"
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent focus:outline-none cursor-not-allowed"
                  value={formData.taxe_manopera}
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 italic">Legislație 2024</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl text-lg sm:text-xl font-black transition-all shadow-xl active:scale-[0.98]
            ${loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
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
