'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Download, Lightbulb, FileSearch, ClipboardList, Store, LayoutTemplate, Share2, ChevronDown, Settings } from 'lucide-react'
import Link from 'next/link'
import SmartCalculator from './SmartCalculator'
import ProjectStagesManager from './ProjectStagesManager'
import ShopManager from './ShopManager'
import OcrPreviewModal from './OcrPreviewModal'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { processReinforcementTable } from '@/utils/ocr'
import { toast } from 'sonner'

interface ProjectActionsProps {
  projectId: string
  initialDimensions: any
  initialStages: string[]
}

export default function ProjectActions({ projectId, initialDimensions, initialStages }: ProjectActionsProps) {
  const [showSmartCalc, setShowSmartCalc]   = useState(false)
  const [showStages,    setShowStages]      = useState(false)
  const [showShops,     setShowShops]       = useState(false)
  const [showDropdown,  setShowDropdown]    = useState(false)
  const [showOcrModal,  setShowOcrModal]    = useState(false)
  const [ocrResults,    setOcrResults]      = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router   = useRouter()
  const supabase = createClient()

  /* Închide dropdown la click în afara lui */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSaveDimensions = async (dimensions: any) => {
    const { error } = await supabase
      .from('projects')
      .update({ dimensions })
      .eq('id', projectId)
    if (error) alert('Eroare la salvarea dimensiunilor: ' + error.message)
    else router.refresh()
  }

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      toast.loading('Analizez extrasul...', { id: 'ocr-loading' })
      const results = await processReinforcementTable(file)
      toast.dismiss('ocr-loading')
      setOcrResults(results)
      setShowOcrModal(true)
    } catch {
      toast.dismiss('ocr-loading')
      toast.error('Eroare la procesarea OCR')
    }
    e.target.value = ''
  }

  const handleShare = async () => {
    const { data, error } = await supabase
      .from('projects')
      .update({ public_share_enabled: true })
      .eq('id', projectId)
      .select('public_token')
      .single()

    if (error || !data?.public_token) {
      alert('Eroare la generarea link-ului. Rulează mai întâi migrarea 003_public_share.sql în Supabase.')
      return
    }

    const shareUrl = `${window.location.origin}/share/${data.public_token}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert(`✅ Link copiat!\n\n${shareUrl}\n\nTrimite-l beneficiarului — nu necesită cont.`)
    } catch {
      prompt('Copiază link-ul:', shareUrl)
    }
  }

  const handleSaveAsTemplate = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Te rugăm să te autentifici!')

    const { data: lines, error: linesError } = await supabase
      .from('estimate_lines')
      .select('*, items(*, normatives(code))')
      .eq('project_id', projectId)

    if (linesError || !lines) return alert('Eroare la preluarea datelor proiectului')

    const templateName = prompt('Nume Șablon:', `Șablon Modificat - ${new Date().toLocaleDateString()}`)
    if (!templateName) return

    const { error } = await supabase
      .from('project_templates')
      .insert([{
        user_id: user.id,
        name: templateName,
        stages: initialStages,
        lines_snapshot: lines.map(l => ({
          manual_name: l.manual_name || l.items?.name,
          manual_um:   l.manual_um   || l.items?.um,
          quantity:    l.quantity,
          stage_name:  l.stage_name,
          resources:   (l.resources_override && l.resources_override.length > 0) ? l.resources_override : (l.items?.resources || []),
          category_id:   l.items?.category_id,
          normative_id:  l.items?.normative_id,
        })),
      }])

    if (error) alert('Eroare: ' + error.message)
    else alert('✅ Proiect salvat ca șablon cu succes!')
  }

  /* ─── Stiluri comune ─────────────────────────────────────────────────── */
  const dropdownItemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 7, width: '100%',
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 400, color: '#6B6860',
    fontFamily: 'inherit', textAlign: 'left', transition: 'background .12s',
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* ── Dropdown "Operații ▾" ─────────────────────────────────────── */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 14px', background: 'white',
              border: '1px solid #E5E3DE', borderRadius: 8,
              fontSize: 13, fontWeight: 500, color: '#6B6860',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#A8A59E')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E3DE')}
          >
            Operații <ChevronDown size={13} style={{ marginTop: 1 }} />
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: 'white', border: '1px solid #E5E3DE',
              borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
              minWidth: 230, zIndex: 50, padding: '6px',
            }}>

              <DropdownBtn
                icon={<ClipboardList size={15} />} label="Etape Proiect"
                style={dropdownItemStyle}
                onClick={() => { setShowStages(true); setShowDropdown(false) }}
              />
              <DropdownBtn
                icon={<Store size={15} />} label="Furnizori"
                style={dropdownItemStyle}
                onClick={() => { setShowShops(true); setShowDropdown(false) }}
              />

              {/* File input item */}
              <label style={{ ...dropdownItemStyle, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F3F2EF')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <FileSearch size={15} style={{ flexShrink: 0 }} />
                Importă Extras (OCR)
                <input type="file" className="hidden" accept="image/*"
                  onChange={e => { handleOcrUpload(e); setShowDropdown(false) }} />
              </label>

              <DropdownBtn
                icon={<LayoutTemplate size={15} />} label="Salvează ca Șablon"
                style={dropdownItemStyle}
                onClick={() => { handleSaveAsTemplate(); setShowDropdown(false) }}
              />
              <DropdownBtn
                icon={<Share2 size={15} />} label="Partajează deviz"
                style={dropdownItemStyle}
                onClick={() => { handleShare(); setShowDropdown(false) }}
              />

              <div style={{ height: 1, background: '#E5E3DE', margin: '4px 0' }} />

              <DropdownBtn
                icon={<Download size={15} />} label="Descarcă PDF"
                style={dropdownItemStyle}
                onClick={() => { window.open(`/projects/${projectId}/print`, '_blank'); setShowDropdown(false) }}
              />
              <DropdownBtn
                icon={<Settings size={15} />} label="Setări Proiect"
                style={dropdownItemStyle}
                onClick={() => setShowDropdown(false)}
              />
            </div>
          )}
        </div>

        {/* ── Buton Smart Calc Promovat ─────────────────────────────────────── */}
        <button
          onClick={() => setShowSmartCalc(true)}
          className="hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: 'white', textDecoration: 'none',
            padding: '9px 16px', borderRadius: 8,
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all .15s',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Lightbulb size={16} className="text-amber-400" />
          <span>Smart Calc</span>
        </button>

        {/* ── Acțiune primară — portocaliu ─────────────────────────────── */}
        <Link
          href={`/catalog?projectId=${projectId}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#E8500A', color: 'white', textDecoration: 'none',
            padding: '9px 16px', borderRadius: 8,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(232,80,10,0.25)',
            transition: 'background .15s, box-shadow .15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#C43F06'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(232,80,10,0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#E8500A'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(232,80,10,0.25)'
          }}
        >
          <Plus size={15} />
          <span>Catalog</span>
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
        <ShopManager onClose={() => setShowShops(false)} />
      )}
      {showOcrModal && (
        <OcrPreviewModal
          projectId={projectId}
          initialData={ocrResults}
          onClose={() => setShowOcrModal(false)}
        />
      )}
    </>
  )
}

/* ─── Helper: buton item dropdown ───────────────────────────────────────── */
function DropdownBtn({
  icon, label, onClick, style,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  style: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      onMouseEnter={e => (e.currentTarget.style.background = '#F3F2EF')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ color: '#A8A59E', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  )
}
