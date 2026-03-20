"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calculator, Save, ChevronRight, Settings2, ArrowLeft } from 'lucide-react'

// Base values for MVP estimation
const BASE_COST_PER_MP = 500 // EUR

export default function EstimatorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const projectId = params?.id

  // Redirect /estimator/current → /projects (no active project context)
  useEffect(() => {
    if (projectId === 'current') {
      router.replace('/projects')
    }
  }, [projectId, router])

  const [formData, setFormData] = useState({
    tip_casa: 'casa',
    suprafata: 100,
    niveluri: 1,
    structura: 'beton',
    acoperis: 'tigla',
    finisaje: 'standard'
  })

  const [estimatedCost, setEstimatedCost] = useState(0)

  // Logică estimare cost total de bază
  useEffect(() => {
    let multiplier = 1

    if (formData.tip_casa === 'bloc') multiplier *= 1.2
    if (formData.niveluri > 1) multiplier *= (1 + (formData.niveluri - 1) * 0.05)
    
    if (formData.structura === 'lemn') multiplier *= 0.8
    else if (formData.structura === 'metalica') multiplier *= 1.1
    
    if (formData.acoperis === 'tabla') multiplier *= 0.9
    else if (formData.acoperis === 'tigla') multiplier *= 1.1

    if (formData.finisaje === 'premium') multiplier *= 1.3

    const total = formData.suprafata * BASE_COST_PER_MP * multiplier
    setEstimatedCost(Math.round(total))
  }, [formData])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'suprafata' || name === 'niveluri' ? Number(value) : value }))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          {projectId && projectId !== 'current' && (
            <Link
              href={`/projects/${projectId}`}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-2"
            >
              <ArrowLeft size={12} /> Înapoi la proiect
            </Link>
          )}
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Calculator className="w-8 h-8 text-blue-600" />
            Estimator Construcție
          </h1>
          <p className="text-slate-500 mt-1">Calculator rapid de cost — pentru deviz complet folosește Deviz Detaliat.</p>
        </div>
        {projectId && projectId !== 'current' && (
          <Link
            href={`/deviz/${projectId}`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20"
          >
            <ChevronRight className="w-5 h-5" />
            Deviz detaliat
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-blue-500">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-500" />
              Parametri Proiect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tip Construcție</label>
                <select name="tip_casa" value={formData.tip_casa} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="casa">Casă Unifamilială</option>
                  <option value="bloc">Bloc Rezidențial</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Suprafață Desfășurată (mp)</label>
                <input type="number" name="suprafata" value={formData.suprafata} onChange={handleChange} min="10" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Regim de Înălțime (Niveluri)</label>
                <input type="number" name="niveluri" value={formData.niveluri} onChange={handleChange} min="1" max="50" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tip Structură</label>
                <select name="structura" value={formData.structura} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="beton">Cadre Beton Armat</option>
                  <option value="lemn">Structură Lemn</option>
                  <option value="metalica">Structură Metalică</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tip Acoperiș</label>
                <select name="acoperis" value={formData.acoperis} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="tigla">Țiglă Ceramică</option>
                  <option value="tabla">Tablă tip țiglă</option>
                  <option value="terasa">Acoperiș Terasă (Drept)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nivel Finisaje</label>
                <select name="finisaje" value={formData.finisaje} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Total Cost Column */}
        <div className="space-y-6">
          <div className="glass-card p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-xl shadow-blue-900/20">
            <h3 className="text-blue-100 font-medium mb-2">Cost Total Estimat</h3>
            <div className="text-5xl font-bold tracking-tight mb-2">
              {estimatedCost.toLocaleString('ro-RO')} <span className="text-2xl text-blue-200">EUR</span>
            </div>
            <p className="text-sm border-t border-blue-500/30 pt-4 text-blue-100 mt-6">
              Acuratețe estimare: ~85%. Pentru un cost exact, accesați modulul de Deviz Detaliat.
            </p>
            <div className="mt-6 flex justify-end">
               <button className="text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-md transition-colors flex items-center gap-1">
                 Calculează Deviz <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
