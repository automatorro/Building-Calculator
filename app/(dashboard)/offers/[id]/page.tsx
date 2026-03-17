"use client"

import { useState } from "react"
import { TrendingUp, AlertTriangle, CheckCircle2, AlertCircle, Plus } from "lucide-react"

// Internal Cost Base (Mock from Deviz module)
const INTERNAL_ESTIMATION = 65000 // EUR

export default function OffersPage() {
  const [offers, setOffers] = useState([
    { id: 1, name: "Constructor A SRL", amount: 50000 },
    { id: 2, name: "Echipa B (Meșteri)", amount: 66500 },
    { id: 3, name: "Premium Construct SRL", amount: 95000 },
  ])

  const [newOfferName, setNewOfferName] = useState("")
  const [newOfferAmount, setNewOfferAmount] = useState("")

  const handleAddOffer = () => {
    if (newOfferName && newOfferAmount) {
      setOffers([...offers, { id: Date.now(), name: newOfferName, amount: Number(newOfferAmount) }])
      setNewOfferName("")
      setNewOfferAmount("")
    }
  }

  const handleDeleteOffer = (id: number) => {
    setOffers(offers.filter(o => o.id !== id))
  }

  const getAnalysisInfo = (amount: number) => {
    const deviation = ((amount - INTERNAL_ESTIMATION) / INTERNAL_ESTIMATION) * 100
    
    if (deviation < -15) {
      return {
        label: "Subevaluat",
        color: "red",
        bgColor: "bg-red-50 text-red-700 border-red-200",
        icon: AlertTriangle,
        desc: `Deviație de ${deviation.toFixed(1)}%. Oferta este suspicios de mică. Risc ridicat de costuri ascunse sau rabat la calitatea materialelor.`
      }
    } else if (deviation > 15) {
      return {
        label: "Supraevaluat",
        color: "orange",
        bgColor: "bg-orange-50 text-orange-700 border-orange-200",
        icon: AlertCircle,
        desc: `Deviație de +${deviation.toFixed(1)}%. Oferta este peste prețul pieței. Recomandăm negocierea sau cererea justificărilor.`
      }
    } else {
      return {
        label: "Realist",
        color: "green",
        bgColor: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
        desc: `Deviație de ${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%. Oferta este aliniată cu devizul intern de referință.`
      }
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Analiză Oferte Constructori
          </h1>
          <p className="text-slate-500 mt-1">Compară automat ofertele primite cu estimarea internă pentru a detecta anomalii.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Estimare Internă Box */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-900/10">
            <div className="text-blue-100 font-medium mb-1">Estimare Internă (Referință)</div>
            <div className="text-4xl font-bold tracking-tight mb-4">
              {INTERNAL_ESTIMATION.toLocaleString('ro-RO')} <span className="text-2xl text-blue-200">EUR</span>
            </div>
            <p className="text-sm text-blue-50/80 leading-relaxed pt-4 border-t border-blue-500/30">
              Acesta este bugetul ideal calculat în modulul <strong className="text-white">Deviz Detaliat</strong>, incluzând materiale (60%) și manoperă (40%).
            </p>
          </div>

          <div className="glass-card p-6 mt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Adaugă Ofertă Nouă</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Nume Constructor</label>
                <input 
                  type="text" 
                  value={newOfferName}
                  onChange={(e) => setNewOfferName(e.target.value)}
                  placeholder="ex: Firma Construct SRL" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Suma Ofertată (EUR)</label>
                <input 
                  type="number" 
                  value={newOfferAmount}
                  onChange={(e) => setNewOfferAmount(e.target.value)}
                  placeholder="ex: 72000" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
              <button 
                onClick={handleAddOffer}
                disabled={!newOfferName || !newOfferAmount}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Adaugă Ofertă
              </button>
            </div>
          </div>
        </div>

        {/* Oferte List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Oferte Primite ({offers.length})</h2>
          
          {offers.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              Nu există oferte introduse.
            </div>
          ) : (
            offers.map((offer) => {
              const analysis = getAnalysisInfo(offer.amount)
              const Icon = analysis.icon
              
              return (
                <div key={offer.id} className="glass-card flex flex-col md:flex-row overflow-hidden relative group">
                  <button onClick={() => handleDeleteOffer(offer.id)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    &times;
                  </button>
                  <div className="p-6 md:w-2/5 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{offer.name}</h3>
                    <div className="text-2xl font-bold text-slate-700">
                      {offer.amount.toLocaleString('ro-RO')} <span className="text-base font-medium text-slate-400">EUR</span>
                    </div>
                  </div>
                  <div className={`p-6 md:w-3/5 flex flex-col justify-center border-l-4 ${analysis.color === 'red' ? 'border-red-500' : analysis.color === 'orange' ? 'border-orange-500' : 'border-green-500'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${analysis.bgColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {analysis.label}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {analysis.desc}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
