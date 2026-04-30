'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { X, CheckCircle2, ChevronRight, Plus, Box, Layers, Hammer } from 'lucide-react'
import { EstimateLine } from '@/utils/calculators/estimate'

interface PlanData {
  tip_plan: string
  element: string
  scara: string
  faza: string
  categorii: any[]
  note: string
}

interface PlanToEstimateModalProps {
  planData: PlanData
  stages: string[]
  onClose: () => void
  onImport: (lines: EstimateLine[]) => void
}

interface ExtractedItem {
  id: string
  sourceTitle: string
  originalName: string
  name: string
  quantity: number
  unit: string
  stage: string
  selected: boolean
}

export default function PlanToEstimateModal({ planData, stages, onClose, onImport }: PlanToEstimateModalProps) {
  const [items, setItems] = useState<ExtractedItem[]>([])

  useEffect(() => {
    const extracted: ExtractedItem[] = []

    if (!planData || !Array.isArray(planData.categorii)) {
      setItems([])
      return
    }

    // Extragere din câmpuri (Campuri singulare)
    planData.categorii.forEach(cat => {
      if (cat.tip === 'campuri' && Array.isArray(cat.campuri)) {
        cat.campuri.forEach((camp: any, idx: number) => {
          const valStr = camp?.valoare !== undefined && camp?.valoare !== null ? String(camp.valoare) : ''
          const numVal = parseFloat(valStr.replace(/,/g, ''))
          if (!isNaN(numVal) && numVal > 0) {
            extracted.push({
              id: `camp-${cat.id}-${idx}`,
              sourceTitle: cat.titlu,
              originalName: camp.label,
              name: `${planData.tip_plan} - ${camp.label}`,
              quantity: numVal,
              unit: camp.unitate || 'buc',
              stage: stages[0] || 'Lucrări Generale',
              selected: false
            })
          }
        })
      }

      // Extragere din tabele (Sume pe coloane numerice relevante)
      if (cat.tip === 'tabel' && Array.isArray(cat.coloane) && Array.isArray(cat.randuri)) {
        // Căutăm coloane care par a fi cantități/totaluri
        const quantityKeywords = ['total', 'cantitat', 'masa', 'greutat', 'volum', 'suprafata', 'lungime']
        const relevantCols = cat.coloane.filter((col: any) => 
          col?.tip === 'numar' && 
          quantityKeywords.some(kw => (col.label || '').toLowerCase().includes(kw) || (col.cheie || '').toLowerCase().includes(kw))
        )

        relevantCols.forEach((col: any) => {
          let sum = 0
          cat.randuri!.forEach((rand: any) => {
            const val = parseFloat(String(rand[col.cheie]).replace(/,/g, ''))
            if (!isNaN(val)) sum += val
          })

          if (sum > 0) {
            // Încercăm să deducem unitatea de măsură din cheie sau label (ex: masa_totala_kg -> kg)
            let um = 'buc'
            if (col.cheie.toLowerCase().includes('kg')) um = 'kg'
            else if (col.cheie.toLowerCase().includes('mc') || col.label.toLowerCase().includes('m³')) um = 'mc'
            else if (col.cheie.toLowerCase().includes('mp') || col.label.toLowerCase().includes('m²')) um = 'mp'
            else if (col.cheie.toLowerCase().includes('m') || col.label.toLowerCase().includes('ml')) um = 'ml'
            else if (col.cheie.toLowerCase().includes('ton')) um = 'to'

            extracted.push({
              id: `tabel-${cat.id}-${col.cheie}`,
              sourceTitle: cat.titlu,
              originalName: `Total ${col.label}`,
              name: `${cat.titlu} - Total ${col.label}`,
              quantity: parseFloat(sum.toFixed(3)),
              unit: um,
              stage: stages[0] || 'Lucrări Generale',
              selected: false
            })
          }
        })
      }
    })

    setItems(extracted)
  }, [planData, stages])

  const toggleSelect = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item))
  }

  const updateItem = (id: string, field: keyof ExtractedItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleConfirm = () => {
    const selectedItems = items.filter(i => i.selected)
    if (selectedItems.length === 0) return

    const lines: EstimateLine[] = selectedItems.map(item => {
      let uid = ''
      try {
        uid = crypto.randomUUID()
      } catch {
        uid = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      }
      return {
        id: uid,
        quantity: item.quantity,
        custom_prices: {},
        excluded_resources: [],
        metadata: { source: 'plan_ocr', plan_type: planData.tip_plan, autoExpand: true },
        stage_name: item.stage,
        name: item.name,
        code: 'OCR',
        unit: item.unit,
        unit_price: 0,
        resources_override: [],
        items: null
      }
    })

    onImport(lines)
  }

  const selectedCount = items.filter(i => i.selected).length

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(30,35,41,0.6)', backdropFilter: 'blur(4px)', padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: 800, background: '#FAFAF8',
        borderRadius: 16, padding: 0, boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E5E3DE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)', fontSize: 24, fontWeight: 400, color: '#1E2329', marginBottom: 4 }}>
              Trimite în Deviz
            </h3>
            <p style={{ fontSize: 13, color: '#6B6860', margin: 0 }}>
              Sistemul a extras automat următoarele cantități din planul <strong>{planData.tip_plan}</strong>. Selectează și editează rândurile pe care dorești să le imporți în proiect.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#A8A59E', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#F9F8F6' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 64, height: 64, background: '#F3F2EF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#A8A59E' }}>
                <Box size={32} />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1E2329', marginBottom: 8 }}>Nu s-au detectat cantități agregate</h4>
              <p style={{ fontSize: 14, color: '#6B6860', maxWidth: 400, margin: '0 auto' }}>
                Acest plan nu pare să conțină tabele cu totaluri (ex: greutate, volum, suprafață) pe care sistemul să le poată agrega automat.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: item.selected ? '#FFF' : '#F3F2EF',
                  border: `1px solid ${item.selected ? '#E8500A' : '#E5E3DE'}`,
                  borderRadius: 12, padding: '16px', transition: 'all 0.2s',
                  boxShadow: item.selected ? '0 4px 12px rgba(232,80,10,0.08)' : 'none',
                  display: 'flex', gap: 16, alignItems: 'flex-start'
                }}>
                  <div style={{ paddingTop: 4 }}>
                    <input 
                      type="checkbox" 
                      checked={item.selected} 
                      onChange={() => toggleSelect(item.id)}
                      style={{ width: 18, height: 18, accentColor: '#E8500A', cursor: 'pointer' }}
                    />
                  </div>
                  
                  <div style={{ flex: 1, opacity: item.selected ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>
                      {item.sourceTitle} · {item.originalName}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 12, alignItems: 'start' }}>
                      {/* Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#6B6860', marginBottom: 4 }}>Nume Articol</label>
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          disabled={!item.selected}
                          style={{
                            width: '100%', padding: '8px 12px', background: item.selected ? '#F9F8F6' : 'transparent',
                            border: `1px solid ${item.selected ? '#E5E3DE' : 'transparent'}`, borderRadius: 8,
                            fontSize: 13, fontWeight: 600, color: '#1E2329', outline: 'none'
                          }}
                        />
                      </div>
                      
                      {/* Quantity */}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#6B6860', marginBottom: 4 }}>Cantitate</label>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          disabled={!item.selected}
                          style={{
                            width: '100%', padding: '8px 12px', background: item.selected ? '#FFF0E8' : 'transparent',
                            border: `1px solid ${item.selected ? '#FDBA74' : 'transparent'}`, borderRadius: 8,
                            fontSize: 13, fontWeight: 700, color: '#C2410C', outline: 'none', fontFamily: 'monospace'
                          }}
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#6B6860', marginBottom: 4 }}>U.M.</label>
                        <input 
                          type="text" 
                          value={item.unit} 
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          disabled={!item.selected}
                          style={{
                            width: '100%', padding: '8px 12px', background: item.selected ? '#F9F8F6' : 'transparent',
                            border: `1px solid ${item.selected ? '#E5E3DE' : 'transparent'}`, borderRadius: 8,
                            fontSize: 13, fontWeight: 600, color: '#1E2329', outline: 'none'
                          }}
                        />
                      </div>

                      {/* Stage */}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#6B6860', marginBottom: 4 }}>Etapă Deviz</label>
                        <select 
                          value={item.stage} 
                          onChange={(e) => updateItem(item.id, 'stage', e.target.value)}
                          disabled={!item.selected}
                          style={{
                            width: '100%', padding: '8px 12px', background: item.selected ? '#F9F8F6' : 'transparent',
                            border: `1px solid ${item.selected ? '#E5E3DE' : 'transparent'}`, borderRadius: 8,
                            fontSize: 13, fontWeight: 600, color: '#1E2329', outline: 'none', cursor: item.selected ? 'pointer' : 'default'
                          }}
                        >
                          {stages.map(s => <option key={s} value={s}>{s}</option>)}
                          <option value="Lucrări Generale">O Etapă Nouă</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid #E5E3DE', background: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#6B6860', fontWeight: 500 }}>
            {selectedCount} rânduri selectate
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{
              padding: '10px 16px', background: 'transparent', border: '1px solid #E5E3DE',
              borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#6B6860', cursor: 'pointer'
            }}>
              Anulează
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', background: selectedCount > 0 ? '#E8500A' : '#F3F2EF', 
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, 
                color: selectedCount > 0 ? '#FFF' : '#A8A59E', cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              <CheckCircle2 size={16} />
              Importă în Deviz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
