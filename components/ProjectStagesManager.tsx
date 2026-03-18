'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Check, ClipboardList } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface ProjectStagesManagerProps {
  projectId: string
  initialStages: string[]
  onClose: () => void
}

export default function ProjectStagesManager({ projectId, initialStages, onClose }: ProjectStagesManagerProps) {
  const [stages, setStages] = useState<string[]>(initialStages || [])
  const [newStage, setNewStage] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAddStage = () => {
    if (!newStage.trim()) return
    if (stages.includes(newStage.trim())) return
    setStages([...stages, newStage.trim()])
    setNewStage('')
  }

  const handleRemoveStage = (stage: string) => {
    setStages(stages.filter(s => s !== stage))
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('projects')
      .update({ stages })
      .eq('id', projectId)

    if (error) {
      alert('Eroare la salvarea etapelor: ' + error.message)
    } else {
      router.refresh()
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <ClipboardList size={24} />
            <h2 className="text-xl font-black">Etape Proiect</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Ex: Fundație, Etaj 1, Finisaje..."
              className="flex-1 p-3 bg-slate-50 dark:bg-white/5 border border-border rounded-xl focus:border-primary/50 outline-none"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
            />
            <button 
              onClick={handleAddStage}
              className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-2">
            {stages.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-sm italic">Nu ai definit nicio etapă încă.</p>
            ) : (
              stages.map((stage) => (
                <div key={stage} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-border transition-all group">
                  <span className="font-bold">{stage}</span>
                  <button 
                    onClick={() => handleRemoveStage(stage)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-800/50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
          >
            {saving ? 'Se salvează...' : <><Check size={20} /> Salvează Etape</>}
          </button>
        </div>
      </div>
    </div>
  )
}
