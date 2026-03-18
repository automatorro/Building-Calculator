'use client'

import { useState } from 'react'
import { Plus, Minus, Ruler, Layers, Square, Box, Save, X, Lightbulb } from 'lucide-react'

interface Dimensions {
  length: number
  width: number
  height: number
  foundation_depth: number
  foundation_width: number
  slab_thickness: number
  wall_thickness: number
  [key: string]: number
}

interface SmartCalculatorProps {
  projectId: string
  initialDimensions: Dimensions
  onSave: (dimensions: Dimensions) => Promise<void>
  onClose: () => void
}

export default function SmartCalculator({ projectId, initialDimensions, onSave, onClose }: SmartCalculatorProps) {
  const [dims, setDims] = useState<Dimensions>({
    length: 10,
    width: 8,
    height: 3,
    foundation_depth: 0.8,
    foundation_width: 0.6,
    slab_thickness: 0.15,
    wall_thickness: 0.25,
    ...initialDimensions
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (key: keyof Dimensions, value: string) => {
    const num = parseFloat(value) || 0
    setDims(prev => ({ ...prev, [key]: num }))
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(dims)
    setSaving(false)
    onClose()
  }

  // Calculatate derivate
  const area = dims.length * dims.width
  const perimeter = (dims.length + dims.width) * 2
  const foundationVolume = perimeter * dims.foundation_depth * dims.foundation_width
  const slabVolume = area * dims.slab_thickness
  const wallArea = perimeter * dims.height
  const wallVolume = wallArea * dims.wall_thickness

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-right-8 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2 bg-primary text-white rounded-xl">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">Smart Calculator</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Configurează dimensiunile casei</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Amprenta la sol */}
            <DimensionGroup title="Amprentă la Sol & Perimetru" icon={<Ruler size={18} />}>
              <DimensionInput label="Lungime (m)" value={dims.length} onChange={(v) => handleChange('length', v)} />
              <DimensionInput label="Lățime (m)" value={dims.width} onChange={(v) => handleChange('width', v)} />
            </DimensionGroup>

            {/* Structura */}
            <DimensionGroup title="Structură & Pereți" icon={<Layers size={18} />}>
              <DimensionInput label="Înălțime Parter (m)" value={dims.height} onChange={(v) => handleChange('height', v)} />
              <DimensionInput label="Grosime Pereți (m)" value={dims.wall_thickness} onChange={(v) => handleChange('wall_thickness', v)} />
            </DimensionGroup>

            {/* Fundatie */}
            <DimensionGroup title="Fundație" icon={<Square size={18} />}>
              <DimensionInput label="Adâncime (m)" value={dims.foundation_depth} onChange={(v) => handleChange('foundation_depth', v)} />
              <DimensionInput label="Lățime (m)" value={dims.foundation_width} onChange={(v) => handleChange('foundation_width', v)} />
            </DimensionGroup>

            {/* Placa */}
            <DimensionGroup title="Placă" icon={<Box size={18} />}>
              <DimensionInput label="Grosime Placă (m)" value={dims.slab_thickness} onChange={(v) => handleChange('slab_thickness', v)} />
            </DimensionGroup>
          </div>

          {/* Rezultate Calculate */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-border">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Estimări Cantități Directe</h3>
            <div className="grid grid-cols-2 gap-4">
              <ResultCard label="Beton Fundație" value={`${foundationVolume.toFixed(2)} m³`} />
              <ResultCard label="Beton Placă" value={`${slabVolume.toFixed(2)} m³`} />
              <ResultCard label="Suprafață Cofraj" value={`${(perimeter * 0.5 + perimeter * dims.height).toFixed(2)} m²`} />
              <ResultCard label="Săpătură (V)" value={`${(foundationVolume * 1.2).toFixed(2)} m³`} />
            </div>
            <p className="mt-4 text-[10px] text-slate-400 italic">
              * Estimările includ un coeficient de pierdere tehnologică de 5-10%.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4">
          <p className="text-xs text-slate-500 flex-1">
            Modificarea acestor valori poate actualiza sugestiile de cantități în rândurile de deviz marcate ca "Smart".
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-8 rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Se salvează...' : 'Salvează Dimensiuni'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DimensionGroup({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

function DimensionInput({ label, value, onChange }: { label: string, value: number, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</label>
      <input 
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-slate-50 dark:bg-white/5 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-mono font-bold"
      />
    </div>
  )
}

function ResultCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-xl font-black text-primary">{value}</div>
    </div>
  )
}
