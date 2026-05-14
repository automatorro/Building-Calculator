'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2, Save, X } from 'lucide-react'

interface ProjectSettingsPanelProps {
  settings: any
  onSave: (settings: any) => void
  variant?: 'minimal' | 'full'
}

export default function ProjectSettingsPanel({ settings, onSave, variant = 'full' }: ProjectSettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSave = () => {
    onSave(tempSettings)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setTempSettings(settings)
          setIsOpen(!isOpen)
        }}
        className={`flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all ${variant === 'minimal' ? 'p-1 bg-transparent hover:bg-slate-100' : ''}`}
      >
        <Settings2 size={16} /> {variant === 'full' && 'Coeficienți'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border/50 p-6 z-[101] ring-1 ring-black/5"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Setări Recapitulație</h4>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Regie (%)</label>
                  <input 
                    type="number" 
                    value={tempSettings.regie}
                    onChange={e => setTempSettings({ ...tempSettings, regie: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border/50 rounded-lg outline-none font-bold text-sm focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Profit (%)</label>
                  <input 
                    type="number" 
                    value={tempSettings.profit}
                    onChange={e => setTempSettings({ ...tempSettings, profit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border/50 rounded-lg outline-none font-bold text-sm focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Taxe Manoperă (%)</label>
                  <input 
                    type="number" 
                    value={tempSettings.taxe_manopera || 0}
                    onChange={e => setTempSettings({ ...tempSettings, taxe_manopera: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border/50 rounded-lg outline-none font-bold text-sm focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5 pb-2 border-b border-border/30">
                  <label className="text-[10px] font-black uppercase text-slate-500">TVA (%)</label>
                  <input 
                    type="number" 
                    value={tempSettings.tva}
                    onChange={e => setTempSettings({ ...tempSettings, tva: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border/50 rounded-lg outline-none font-bold text-sm focus:border-primary"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                  <Save size={14} /> Salvează
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
