'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Download, Lightbulb, FileSearch, ClipboardList, Store, LayoutTemplate, Share2, ChevronDown, Settings } from 'lucide-react'
import Link from 'next/link'
import SmartCalculator from './SmartCalculator'
import ProjectStagesManager from './ProjectStagesManager'
import ShopManager from './ShopManager'
import OcrPreviewModal from './OcrPreviewModal'
import { createClient } from '@/utils/supabase/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateSaving, setTemplateSaving] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [ocrResults,    setOcrResults]      = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null)
  const dropdownMenuRef = useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number } | null>(null)
  const router   = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('openSmartCalc') === '1') {
      setShowSmartCalc(true)
      const next = new URLSearchParams(searchParams.toString())
      next.delete('openSmartCalc')
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    }
  }, [pathname, router, searchParams])

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

  useEffect(() => {
    if (!showDropdown) {
      setDropdownPos(null)
      return
    }

    const update = () => {
      const trigger = dropdownTriggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()

      const menu = dropdownMenuRef.current
      const menuWidth = menu?.offsetWidth ?? 230
      const minLeft = 8
      const maxLeft = Math.max(minLeft, window.innerWidth - menuWidth - 8)
      const preferredLeft = rect.right - menuWidth
      const left = Math.min(Math.max(preferredLeft, minLeft), maxLeft)
      const top = rect.bottom + 6

      setDropdownPos(prev => {
        if (prev && prev.left === left && prev.top === top) return prev
        return { left, top }
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [showDropdown])

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
      toast.success('✅ Link copiat în clipboard!')
    } catch {
      setShareUrl(shareUrl)
      setShowShareModal(true)
    }
  }

  const handleSaveAsTemplate = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Te rugăm să te autentifici!')

    setTemplateName(`Șablon Modificat - ${new Date().toLocaleDateString()}`)
    setShowTemplateModal(true)
  }

  const confirmSaveAsTemplate = async () => {
    const name = templateName.trim()
    if (!name) return

    setTemplateSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setTemplateSaving(false)
      alert('Te rugăm să te autentifici!')
      return
    }

    const { data: lines, error: linesError } = await supabase
      .from('estimate_lines')
      .select('*, items(*, normatives(code))')
      .eq('project_id', projectId)

    if (linesError || !lines) {
      setTemplateSaving(false)
      alert('Eroare la preluarea datelor proiectului')
      return
    }

    const { error } = await supabase
      .from('project_templates')
      .insert([{
        user_id: user.id,
        name,
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

    setTemplateSaving(false)
    if (error) alert('Eroare: ' + error.message)
    else {
      setShowTemplateModal(false)
      toast.success('✅ Proiect salvat ca șablon cu succes!')
    }
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
            ref={dropdownTriggerRef}
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
            <div
              ref={dropdownMenuRef}
              style={{
              position: 'fixed',
              left: dropdownPos?.left ?? 8,
              top: dropdownPos?.top ?? 0,
              background: 'white', border: '1px solid #E5E3DE',
              borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
              minWidth: 230, zIndex: 50, padding: '6px',
            }}
            >

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
          <span>Adaugă norme</span>
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

      {showTemplateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => { if (!templateSaving) setShowTemplateModal(false) }}
        >
          <div
            style={{
              width: 'min(520px, 100%)',
              background: 'white',
              borderRadius: 14,
              border: '1px solid #E5E3DE',
              boxShadow: '0 18px 60px rgba(0,0,0,0.25)',
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E2329', marginBottom: 10 }}>
              Salvează ca Șablon
            </div>

            <div style={{ fontSize: 12, color: '#6B6860', marginBottom: 10, lineHeight: 1.5 }}>
              Alege un nume pentru șablonul proiectului.
            </div>

            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Nume șablon"
              autoFocus
              style={{
                width: '100%',
                border: '1px solid #E5E3DE',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 13,
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                disabled={templateSaving}
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E3DE',
                  background: '#FAFAF8',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#6B6860',
                  cursor: templateSaving ? 'not-allowed' : 'pointer',
                }}
              >
                Anulează
              </button>
              <button
                type="button"
                onClick={confirmSaveAsTemplate}
                disabled={templateSaving || !templateName.trim()}
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E3DE',
                  background: '#E8500A',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'white',
                  cursor: (templateSaving || !templateName.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (templateSaving || !templateName.trim()) ? 0.7 : 1,
                }}
              >
                {templateSaving ? 'Se salvează…' : 'Salvează'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            style={{
              width: 'min(520px, 100%)',
              background: 'white',
              borderRadius: 14,
              border: '1px solid #E5E3DE',
              boxShadow: '0 18px 60px rgba(0,0,0,0.25)',
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E2329', marginBottom: 10 }}>
              Link de partajare
            </div>

            <div style={{ fontSize: 12, color: '#6B6860', marginBottom: 10, lineHeight: 1.5 }}>
              Copiază link-ul de mai jos și trimite-l beneficiarului — nu necesită cont.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={shareUrl}
                readOnly
                style={{
                  flex: 1,
                  border: '1px solid #E5E3DE',
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl)
                    toast.success('✅ Link copiat în clipboard!')
                    setShowShareModal(false)
                  } catch {
                    toast.error('Nu pot copia automat. Selectează și copiază manual.')
                  }
                }}
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E3DE',
                  background: '#E8500A',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Copiază
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E3DE',
                  background: '#FAFAF8',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#6B6860',
                  cursor: 'pointer',
                }}
              >
                Închide
              </button>
            </div>
          </div>
        </div>
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
