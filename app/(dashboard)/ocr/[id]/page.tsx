"use client"

import { useState } from "react"
import { ScanText, UploadCloud, FileText, CheckCircle2, ChevronRight, Loader2, Link2 } from "lucide-react"

export default function OCRPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<any | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    setFile(file)
    setIsProcessing(true)
    setResults(null)
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setResults({
        document: file.name,
        confidence: 94.2,
        tablesExtracted: 2,
        data: [
          { diametru: 'Φ10', tip: 'OB37', cantitate_kg: 1250, lungime_bare_m: 2016 },
          { diametru: 'Φ14', tip: 'PC52', cantitate_kg: 3400, lungime_bare_m: 2814 },
          { diametru: 'Φ8', tip: 'OB37', cantitate_kg: 890, lungime_bare_m: 2260 },
        ]
      })
    }, 2500)
  }

  const handleAutoFill = () => {
    alert("Cantitățile de fier beton au fost sincronizate cu modulul de Deviz & Procurement!")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <ScanText className="w-8 h-8 text-blue-600" />
            Extragere Planșe (OCR)
          </h1>
          <p className="text-slate-500 mt-1">Încarcă planșele structurale (PDF) pentru a extrage automat extrasele de armare.</p>
        </div>
      </div>

      {!results && !isProcessing && (
        <label 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`glass-card flex flex-col items-center justify-center border-2 border-dashed p-16 cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className={`w-16 h-16 mb-6 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Trage planul PDF aici</h3>
          <p className="text-slate-500 text-sm mb-8">sau dă click pentru a alege fișierul manual</p>
          <input type="file" className="hidden" accept=".pdf,.png,.jpg" onChange={handleFileChange} />
          <span className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
            Răsfoiește computerul
          </span>
        </label>
      )}

      {isProcessing && (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Procesare OCR Document...</h3>
          <p className="text-sm">Se identifică extrasele de armare pentru <strong className="text-slate-700">{file?.name}</strong></p>
        </div>
      )}

      {results && !isProcessing && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="glass-card p-6 bg-green-50/50 border-green-200 flex items-start gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-full shrink-0">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-1">Extragere Finalizată cu Succes!</h3>
              <p className="text-sm text-green-800/80 mb-4">
                Sistemul nostru OCR structural a analizat <strong className="font-semibold">{results.document}</strong> cu o precizie de {results.confidence}% și a detectat {results.tablesExtracted} tabele de armare.
              </p>
              
              <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-600">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Tip/Marcă</th>
                      <th className="py-3 px-4 font-semibold">Diametru</th>
                      <th className="py-3 px-4 font-semibold text-right">Cantitate Extrasă (Kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {results.data.map((row: any, i: number) => (
                       <tr key={i} className="hover:bg-slate-50/50">
                         <td className="py-3 px-4 font-medium text-slate-800">{row.tip}</td>
                         <td className="py-3 px-4">{row.diametru}</td>
                         <td className="py-3 px-4 text-right font-bold text-blue-600">{row.cantitate_kg.toLocaleString('ro-RO')}</td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-green-200/60">
                <button onClick={handleAutoFill} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-green-600/20 active:scale-95">
                  <Link2 className="w-4 h-4" />
                  Sincronizează &amp; Completează Cantitățile
                </button>
              </div>
            </div>
          </div>
          
          <button onClick={() => setResults(null)} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
             <UploadCloud className="w-4 h-4" /> Scanează un document nou
          </button>
        </div>
      )}
    </div>
  )
}
