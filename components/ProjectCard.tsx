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
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDeleting) return
    setShowConfirm(true)
  }

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowConfirm(false)
  }

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowConfirm(false)
    setIsDeleting(true)
    try {
      await onDelete(project)
    } catch (err) {
      console.error('Eroare la ștergere:', err)
      alert('A apărut o eroare la ștergere. Detalii în consolă.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div 
      className="project-card-container" 
      style={{
        position: 'relative',
        background: '#FAFAF8',
        border: showConfirm ? '1px solid #C0392B' : '1px solid #E5E3DE',
        borderRadius: 14,
        padding: 24,
        transition: 'all .2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!showConfirm) {
          e.currentTarget.style.borderColor = 'rgba(232, 80, 10, 0.4)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(232, 80, 10, 0.08)'
        }
      }}
      onMouseLeave={(e) => {
        if (!showConfirm) {
          e.currentTarget.style.borderColor = '#E5E3DE'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Overlay Confirmare Ștergere UI */}
      {showConfirm && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(252, 236, 234, 0.98)',
          borderRadius: 14, zIndex: 1500, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, textAlign: 'center'
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#C0392B' }}>
            Ștergi proiectul "{project.name || 'fără nume'}"?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={confirmDelete} style={{
              padding: '8px 16px', borderRadius: 8, background: '#C0392B',
              color: 'white', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer'
            }}>
              DA, Șterge
            </button>
            <button onClick={cancelDelete} style={{
              padding: '8px 16px', borderRadius: 8, background: 'white',
              color: '#6B6860', border: '1px solid #E5E3DE', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>
              Nu
            </button>
          </div>
        </div>
      )}

      <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
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

        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1E2329',
          marginBottom: 12, lineHeight: 1.3 }}>
          {project.name}
        </h3>

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

        <div style={{ paddingTop: 16, borderTop: '1px solid #F3F2EF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#A8A59E',
            textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Deschide Devizul
          </span>
          <ArrowRight size={15} color="#E8500A" />
        </div>
      </Link>

      {!showConfirm && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Șterge proiect"
          style={{
            position: 'absolute', top: 12, right: 12, width: 34, height: 34,
            borderRadius: 10, border: '1px solid #E5E3DE',
            background: isDeleting ? '#F3F2EF' : '#FAFAF8',
            color: '#C0392B', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: isDeleting ? 'not-allowed' : 'pointer',
            zIndex: 1000, transition: 'all .15s', opacity: 0.8
          }}
        >
          {isDeleting ? (
            <div style={{ width: 14, height: 14, border: '2px solid #C0392B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Trash2 size={16} pointerEvents="none" />
          )}
        </button>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
