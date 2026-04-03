'use client'

import React from 'react'
import { Settings, ClipboardList, HardHat, CheckCircle2, FileEdit } from 'lucide-react'

interface ProjectStepperProps {
  globalPhase: 'setup' | 'offer' | 'execution' // Progresul real
  activePhase: 'setup' | 'offer' | 'execution' // Ce vede userul acum
  onPhaseClick?: (phase: 'setup' | 'offer' | 'execution') => void
}

export default function ProjectStepper({ globalPhase, activePhase, onPhaseClick }: ProjectStepperProps) {
  const phases = [
    { 
      id: 'setup' as const, 
      label: 'Planificare', 
      desc: 'Centralizator Lucrări', 
      icon: ClipboardList,
      color: '#A8A59E'
    },
    { 
      id: 'offer' as const, 
      label: 'Ofertare', 
      desc: 'Generare Deviz', 
      icon: FileEdit,
      color: '#E8500A' 
    },
    { 
      id: 'execution' as const, 
      label: 'Status & Execuție', 
      desc: 'Achiziții & Monitorizare', 
      icon: HardHat,
      color: '#2A7D4F' 
    },
  ]

  const getGlobalIndex = () => {
    if (globalPhase === 'setup') return 0
    if (globalPhase === 'offer') return 1
    return 2
  }

  const globalIndex = getGlobalIndex()

  return (
    <div style={{ 
      background: '#FAFAF8', 
      border: '1px solid #E5E3DE', 
      borderRadius: 16, 
      padding: '20px 24px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }}>
      {phases.map((phase, idx) => {
        const Icon = phase.icon
        const isCompleted = idx < globalIndex
        const isActive = phase.id === activePhase
        const isFuture = idx > globalIndex

        return (
          <React.Fragment key={phase.id}>
            <button 
              onClick={() => onPhaseClick?.(phase.id)}
              disabled={!onPhaseClick}
              className="group"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                flex: '1 1 180px',
                opacity: (isFuture && !isActive) ? 0.5 : 1,
                transition: 'all 0.3s',
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                cursor: onPhaseClick ? 'pointer' : 'default'
              }}
            >
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                background: isCompleted ? '#2A7D4F' : (isActive ? '#E8500A' : '#F3F2EF'),
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: (isCompleted || isActive) ? 'white' : '#A8A59E',
                boxShadow: isActive ? '0 4px 12px rgba(232, 80, 10, 0.2)' : 'none',
                position: 'relative',
                transition: 'all 0.3s'
              }} className="group-hover:scale-110">
                {/* Pictograma: Bifa doar daca e gata si NU e selectata. Altfel Icon original */}
                {isCompleted && !isActive ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                
                {/* Punctul portocaliu: Doar daca e gata SI selectat */}
                {isCompleted && isActive && (
                  <div style={{ 
                    position: 'absolute', 
                    top: -2, 
                    right: -2, 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    background: '#E8500A',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                )}
              </div>
              <div>
                <div style={{ 
                  fontSize: 13, 
                  fontWeight: 700, 
                  color: isActive ? '#E8500A' : '#1E2329' 
                }} className="group-hover:text-primary">
                  {phase.label}
                </div>
                <div style={{ 
                  fontSize: 11, 
                  color: '#6B6860',
                  fontWeight: 400
                }}>
                  {phase.desc}
                </div>
              </div>
            </button>
            {idx < phases.length - 1 && (
              <div style={{ 
                flex: '0 1 40px', 
                height: 2, 
                background: isCompleted ? '#2A7D4F' : '#E5E3DE',
                borderRadius: 1
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
