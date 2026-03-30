'use client'

import { useState } from 'react'
import { X, Check, FileSearch, Trash2, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { ReinforcementRow } from '@/utils/ocr'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OcrPreviewModalProps {
  projectId: string
  initialData: ReinforcementRow[]
  onClose: () => void
}

export default function OcrPreviewModal({ projectId, initialData, onClose }: OcrPreviewModalProps) {
  const [rows, setRows] = useState<ReinforcementRow[]>(initialData)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleRemove = (index: number) => {
    setRows(r => r.filter((_, i) => i !== index))
  }

  const handleUpdate = (index: number, field: keyof ReinforcementRow, val: string) => {
    const num = parseFloat(val) || 0
    setRows(r => r.map((row, i) => i === index ? { ...row, [field]: num } : row))
  }

  const handleSave = async () => {
    if (rows.length === 0) return onClose()
    setSaving(true)
    
    const toInsert = rows.map(r => ({
      project_id: projectId,
      item_id: null,
      manual_name: `Oțel beton fasonat ø${r.diameter} mm (Marca ${r.mark})`,
      manual_um: 'kg',
      manual_price: 0,
      quantity: r.totalWeight || 0,
      stage_name: 'Fier / Armare',
      custom_prices: {},
      excluded_resources: [],
      resources_override: [],
      metadata: { source: 'ocr', mark: r.mark, diameter: r.diameter, length: r.length, pcs: r.quantity }
    }))

    const { error } = await supabase.from('estimate_lines').insert(toInsert)
    if (error) {
      toast.error('Eroare la transferul datelor: ' + error.message)
      console.error(error)
    } else {
      toast.success(`${rows.length} rânduri extrase prin OCR adăugate în deviz!`)
      router.refresh()
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="bg-slate-900 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileSearch size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Verificare Extras de Armare</h2>
              <p className="text-xs text-slate-400 font-medium">Validare manuală a datelor citite de algoritm</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-950">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Diametru (ø)</th>
                  <th className="px-4 py-3">Bucăți</th>
                  <th className="px-4 py-3">Lungime (m)</th>
                  <th className="px-4 py-3 text-right">Greutate Totală (kg)</th>
                  <th className="px-4 py-3 text-center">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Niciun rând recunoscut. Vă rugăm să reluați procedura.
                    </td>
                  </tr>
                )}
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={r.mark} 
                        onChange={(e) => {
                          const val = e.target.value
                          setRows(prev => prev.map((row, idx) => idx === i ? { ...row, mark: val } : row))
                        }}
                        className="w-16 bg-transparent border-b border-border/50 focus:border-primary outline-none py-1 font-mono text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" value={r.diameter} 
                        onChange={(e) => handleUpdate(i, 'diameter', e.target.value)}
                        className="w-16 bg-transparent border-b border-border/50 focus:border-primary outline-none py-1 font-mono text-center text-blue-600 font-bold"
                      /> mm
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" value={r.quantity} 
                        onChange={(e) => handleUpdate(i, 'quantity', e.target.value)}
                        className="w-16 bg-transparent border-b border-border/50 focus:border-primary outline-none py-1 font-mono text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" value={r.length} 
                        onChange={(e) => handleUpdate(i, 'length', e.target.value)}
                        className="w-20 bg-transparent border-b border-border/50 focus:border-primary outline-none py-1 font-mono text-center"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input 
                        type="number" value={r.totalWeight} 
                        onChange={(e) => handleUpdate(i, 'totalWeight', e.target.value)}
                        className="w-24 bg-transparent border-b border-primary/30 focus:border-primary outline-none py-1 font-mono text-right text-primary font-black text-lg"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button 
                        onClick={() => handleRemove(i)}
                        className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Șterge rând"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500">
            Total Oțel Beton: <span className="text-primary">{rows.reduce((sum, r) => sum + (r.totalWeight || 0), 0).toFixed(2)}</span> kg
          </span>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-border bg-white hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-600 transition-colors"
            >
              Anulează
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
            >
              {saving ? <><Loader2 size={16} className="animate-spin"/> Transfer...</> : <><Check size={16}/> Confirmă și Adaugă</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
