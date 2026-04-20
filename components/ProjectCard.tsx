'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react'

interface ProjectCardProps {
  project: any
  onDelete: (project: any) => Promise<void>
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Asigură-te că componenta este montată pe client pentru a evita erorile de hidratare
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isMounted) return

    const confirmed = window.confirm(
      `Ești sigur că vrei să ștergi proiectul „${project.name || 'fără nume'}”?\n\nȘtergerea este permanentă.`
    )
    
    if (confirmed) {
      setIsDeleting(true)
      try {
        await onDelete(project)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: '#FAFAF8',
    border: '1px solid #E5E3DE',
    borderRadius: 14,
    padding: 24,
    transition: 'all .2s',
    cursor: 'pointer',
  }

  return (
    <div 
      className="project-card-container" 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(232, 80, 10, 0.4)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(232, 80, 10, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E3DE'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Buton ștergere - Ridicat cu z-index și handler protejat */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Șterge proiect"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 34,
          height: 34,
          borderRadius: 10,
          border: '1px solid #E5E3DE',
          background: isDeleting ? '#F3F2EF' : '#FAFAF8',
          color: '#C0392B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          zIndex: 50, // Foarte sus pentru a fi sigur
          transition: 'all .15s',
          opacity: 0.8,
        }}
        onMouseEnter={(e) => {
          if (!isDeleting) {
            e.currentTarget.style.background = '#FCECEA'
            e.currentTarget.style.opacity = '1'
          }
        }}
        onMouseLeave={(e) => {
          if (!isDeleting) {
            e.currentTarget.style.background = '#FAFAF8'
            e.currentTarget.style.opacity = '0.8'
          }
        }}
      >
        <Trash2 size={16} pointerEvents="none" />
      </button>

      <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
        {/* Card header */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: '#FFF0E8',
            borderRadius: 9, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={18} color="#E8500A" />
          </div>
          <span style={{ fontSize: 11, fontFamily: 'monospace',
            color: '#A8A59E', background: '#F3F2EF',
            padding: '3px 8px', borderRadius: 6 }}>
            ID: {project.id.slice(0, 8)}
          </span>
        </div>

        {/* Nume */}
        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1E2329',
          marginBottom: 12, lineHeight: 1.3 }}>
          {project.name}
        </h3>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#6B6860' }}>
            <MapPin size={13} color="#A8A59E" />
            {project.location || 'Locație nespecificată'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#6B6860' }}>
            <Calendar size={13} color="#A8A59E" />
            Creat la {new Date(project.created_at).toLocaleDateString('ro-RO')}
          </div>
        </div>

        {/* Footer card */}
        <div style={{ paddingTop: 16, borderTop: '1px solid #F3F2EF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#A8A59E',
            textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Deschide Devizul
          </span>
          <ArrowRight size={15} color="#E8500A" />
        </div>
      </Link>
    </div>
  )
}
