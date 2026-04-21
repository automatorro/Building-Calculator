'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Check, ArrowRight, Loader2, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

interface EstimateImporterProps {
  onImport: (lines: any[]) => void
  onClose: () => void
}

export default function EstimateImporter({ onImport, onClose }: EstimateImporterProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [fileData, setFileData] = useState<any[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, number>>({
    name: -1,
    quantity: -1,
    unit: -1,
    unit_price: -1,
    stage_name: -1,
    code: -1
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]
      
      if (data.length > 0) {
        setFileData(data)
        // Find first non-empty row as headers
        const firstRow = data.find(row => row.length > 0) || []
        setHeaders(firstRow.map((h, i) => h?.toString() || `Coloana ${i + 1}`))
        
        // Auto-select based on keywords
        const newMapping = { ...mapping }
        firstRow.forEach((h, i) => {
          const val = h?.toString().toLowerCase() || ''
          if (val.includes('num') || val.includes('desc') || val.includes('art')) newMapping.name = i
          if (val.includes('cant') || val.includes('qty')) newMapping.quantity = i
          if (val.includes('u.m') || val.includes('um') || val.includes('unit')) newMapping.unit = i
          if (val.includes('pret') || val.includes('price')) newMapping.unit_price = i
          if (val.includes('etap') || val.includes('faz') || val.includes('stag')) newMapping.stage_name = i
          if (val.includes('cod') || val.includes('simb')) newMapping.code = i
        })
        setMapping(newMapping)
        setStep(2)
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleFinishImport = () => {
    if (mapping.name === -1 || mapping.quantity === -1) {
      toast.error('Te rugăm să selectezi coloanele obligatorii: Nume și Cantitate.')
      return
    }

    setIsProcessing(true)
    // Skip first row (headers)
    const rowsToProcess = fileData.slice(1).filter(row => row[mapping.name] && row[mapping.quantity])
    
    const importedLines = rowsToProcess.map(row => ({
      id: crypto.randomUUID(),
      name: row[mapping.name]?.toString() || 'Articol fără nume',
      quantity: parseFloat(row[mapping.quantity]) || 0,
      unit: mapping.unit !== -1 ? row[mapping.unit]?.toString() || 'buc' : 'buc',
      unit_price: mapping.unit_price !== -1 ? parseFloat(row[mapping.unit_price]) || 0 : 0,
      stage_name: mapping.stage_name !== -1 ? row[mapping.stage_name]?.toString() || 'Lucrări Generale' : 'Lucrări Generale',
      code: mapping.code !== -1 ? row[mapping.code]?.toString() || 'MANUAL' : 'MANUAL',
      custom_prices: {},
      excluded_resources: [],
      resources_override: [],
      metadata: { source: 'excel_import' },
      items: null
    }))

    onImport(importedLines)
    setIsProcessing(false)
    toast.success(`Succes! Am importat ${importedLines.length} articole.`)
    onClose()
  }

  const S = {
    orange: '#E8500A',
    black: '#1E2329',
    white: '#FAFAF8',
    gray100: '#F3F2EF',
    gray200: '#E5E3DE'
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-border/30 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center text-slate-900 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Importă Deviz din Excel</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">Suportă WinDoc, Deviz360, Intersoft etc.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center h-full py-12"
              >
                <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                  <Upload size={32} />
                </div>
                <h4 className="text-xl font-black mb-2">Alege fișierul pentru import</h4>
                <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">Încarcă orice fișier Excel (.xlsx) sau CSV exportat de programul tău de devize.</p>
                
                <label className="cursor-pointer bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all scale-110 active:scale-95">
                  Selectează Fișier
                  <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                </label>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-border/50">
                    <div className="text-[10px] font-black text-primary uppercase mb-1">Pasul 1</div>
                    <div className="text-xs font-bold">Încarcă fișierul exportat</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-border/50">
                    <div className="text-[10px] font-black text-primary uppercase mb-1">Pasul 2</div>
                    <div className="text-xs font-bold">Mapează coloanele (Nume, Cant.)</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-border/50">
                    <div className="text-[10px] font-black text-primary uppercase mb-1">Pasul 3</div>
                    <div className="text-xs font-bold">Finalizează importul în deviz</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-black text-xs text-amber-900 dark:text-amber-500 uppercase tracking-tight">Sisteme detectate automat</h5>
                    <p className="text-xs text-amber-700 dark:text-amber-600/80">Am încercat să mapăm coloanele automat. Te rugăm să verifici mai jos dacă sunt corecte.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'name', label: 'Nume / Descriere Articol *' },
                    { key: 'quantity', label: 'Cantitate *' },
                    { key: 'unit', label: 'Unitate de măsură (UM)' },
                    { key: 'unit_price', label: 'Preț Unitar Direct' },
                    { key: 'stage_name', label: 'Etapă (ex: Fundație)' },
                    { key: 'code', label: 'Cod Normativ / Simbol' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                      <select 
                        className={`w-full p-3 rounded-xl border font-bold text-sm outline-none transition-all ${mapping[field.key] !== -1 ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-slate-50 dark:bg-slate-800 border-border/50 text-slate-500'}`}
                        value={mapping[field.key]}
                        onChange={(e) => setMapping({ ...mapping, [field.key]: parseInt(e.target.value) })}
                      >
                        <option value={-1}>— Ignoră acest câmp —</option>
                        {headers.map((h, i) => (
                          <option key={i} value={i}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 px-1">Previzualizare primele date (Top 5)</h4>
                  <div className="overflow-x-auto rounded-2xl border border-border/50">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border/50">
                        <tr>
                          {headers.map((h, i) => (
                            <th key={i} className={`p-3 font-black uppercase tracking-tighter ${Object.values(mapping).includes(i) ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fileData.slice(1, 6).map((row, i) => (
                          <tr key={i} className="border-b border-border/20 last:border-0">
                            {headers.map((_, j) => (
                              <td key={j} className={`p-3 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] ${Object.values(mapping).includes(j) ? 'bg-primary/5 text-slate-900 dark:text-white font-bold' : 'text-slate-400'}`}>
                                {row[j]?.toString() || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between gap-4">
          <button 
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-6 py-3 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            {step === 1 ? 'Anulează' : 'Înapoi la fișier'}
          </button>
          
          {step === 2 && (
            <button 
              onClick={handleFinishImport}
              disabled={isProcessing || mapping.name === -1 || mapping.quantity === -1}
              className={`flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 ${(!mapping.name || !mapping.quantity) && 'opacity-50 cursor-not-allowed'}`}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={18} /> Se procesează...</>
              ) : (
                <><Check size={18} /> Finalizează Import ({fileData.length - 1} rânduri)</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
