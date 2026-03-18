'use client'

import { useState } from 'react'
import { Plus, Settings, Download, Lightbulb, FileSearch, ClipboardList, Store } from 'lucide-react'
import Link from 'next/link'
import SmartCalculator from './SmartCalculator'
import ProjectStagesManager from './ProjectStagesManager'
import ShopManager from './ShopManager'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { processReinforcementTable } from '@/utils/ocr'

interface ProjectActionsProps {
  projectId: string
  initialDimensions: any
  initialStages: string[]
}

export default function ProjectActions({ projectId, initialDimensions, initialStages }: ProjectActionsProps) {
  const [showSmartCalc, setShowSmartCalc] = useState(false)
  const [showStages, setShowStages] = useState(false)
  const [showShops, setShowShops] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSaveDimensions = async (dimensions: any) => {
    const { error } = await supabase
      .from('projects')
      .update({ dimensions })
      .eq('id', projectId)

    if (error) {
      alert('Eroare la salvarea dimensiunilor: ' + error.message)
    } else {
      router.refresh()
    }
  }

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const results = await processReinforcementTable(file)
      console.log('OCR Results:', results)
      alert(`Am detectat ${results.length} rânduri în extrasul de armare. (Funcționalitate în curs de finalizare)`)
      // Aici vom adăuga logica de inserare în DB
    } catch (err) {
      alert('Eroare la procesarea OCR')
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary transition-all" title="Descarcă PDF">
          <Download size={20} />
        </button>
        
        <button 
          onClick={() => setShowSmartCalc(true)}
          className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-all font-bold"
          title="Smart Calculator"
        >
          <Lightbulb size={20} />
          <span className="hidden sm:inline text-sm">Smart Calc</span>
        </button>

        <button 
          onClick={() => setShowStages(true)}
          className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 transition-all font-bold"
          title="Etape Proiect"
        >
          <ClipboardList size={20} />
          <span className="hidden lg:inline text-sm">Etape Proiect</span>
        </button>

        <button 
          onClick={() => setShowShops(true)}
          className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-100 transition-all font-bold"
          title="Furnizori / Magazine"
        >
          <Store size={20} />
          <span className="hidden xl:inline text-sm">Furnizori</span>
        </button>

        <label className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 transition-all font-bold cursor-pointer" title="Importă Extras Armare (OCR)">
          <FileSearch size={20} />
          <span className="hidden sm:inline text-sm">Importă Extras</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleOcrUpload} 
          />
        </label>

        <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary transition-all" title="Setări Proiect">
          <Settings size={20} />
        </button>

        <Link 
          href={`/catalog?projectId=${projectId}`}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Adaugă Articol</span>
          <span className="sm:hidden">Adaugă</span>
        </Link>
      </div>

      {showSmartCalc && (
        <SmartCalculator 
          projectId={projectId}
          initialDimensions={initialDimensions}
          onSave={handleSaveDimensions}
          onClose={() => setShowSmartCalc(false)}
        />
      )}
      {showStages && (
        <ProjectStagesManager 
          projectId={projectId}
          initialStages={initialStages}
          onClose={() => setShowStages(false)}
        />
      )}
      {showShops && (
        <ShopManager 
          onClose={() => setShowShops(false)}
        />
      )}
    </>
  )
}
