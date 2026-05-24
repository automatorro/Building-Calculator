'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutTemplate, FileSpreadsheet, PenLine, ScanLine, X } from 'lucide-react'

const sans  = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

interface Props {
  projectId: string
  onChooseTemplate: () => void
  onChooseImport:   () => void
  onChooseOCR:      () => void
  onChooseManual:   () => void
  onDismiss:        () => void
}

const OPTIONS = [
  {
    key: 'template',
    icon: <LayoutTemplate size={28} strokeWidth={1.5} />,
    title: 'Pornește de la un Șablon',
    desc: 'Devizul vine pre-completat cu etapele și articolele tipice pentru tipologia aleasă.',
    accent: '#E8500A',
    bg: '#FFF0E8',
    border: '#E8500A33',
  },
  {
    key: 'import',
    icon: <FileSpreadsheet size={28} strokeWidth={1.5} />,
    title: 'Import Excel / CSV',
    desc: 'Ai deja un deviz sau un extras de materiale? Importă-l direct și curăță-l în editor.',
    accent: '#2A7D4F',
    bg: '#F0FAF4',
    border: '#2A7D4F33',
  },
  {
    key: 'ocr',
    icon: <ScanLine size={28} strokeWidth={1.5} />,
    title: 'Scanează plan arhitectural',
    desc: 'Încarcă un plan PDF sau imagine și extrage automat cantitățile din el.',
    accent: '#5B3FF8',
    bg: '#F3F0FF',
    border: '#5B3FF833',
  },
  {
    key: 'manual',
    icon: <PenLine size={28} strokeWidth={1.5} />,
    title: 'Introduc manual',
    desc: 'Știu ce fac. Mă duc direct în editor și adaug articolele rând cu rând.',
    accent: '#6B6860',
    bg: '#F3F2EF',
    border: '#E5E3DE',
  },
]

export default function ProjectOnboardingModal({
  projectId,
  onChooseTemplate,
  onChooseImport,
  onChooseOCR,
  onChooseManual,
  onDismiss,
}: Props) {

  // Blochează scroll-ul body cât e vizibil modalul
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const STORAGE_KEY = `onboarding_shown_${projectId}`

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    onDismiss()
  }

  const handle = (key: string) => {
    localStorage.setItem(STORAGE_KEY, '1')
    if (key === 'template') onChooseTemplate()
    if (key === 'import')   onChooseImport()
    if (key === 'ocr')      onChooseOCR()
    if (key === 'manual')   onChooseManual()
  }

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(30,35,41,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px 16px',
        }}
        onClick={dismiss}
      >
        <motion.div
          key="onboarding-panel"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '36px 32px 28px',
            maxWidth: 640,
            width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
            fontFamily: sans,
            position: 'relative',
          }}
        >
          {/* Buton închidere */}
          <button
            onClick={dismiss}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid #E5E3DE', background: '#F3F2EF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#A8A59E',
            }}
          >
            <X size={14} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#E8500A', marginBottom: 8,
            }}>
              Proiect creat cu succes
            </p>
            <h2 style={{
              fontFamily: serif, fontSize: 28, color: '#1E2329',
              lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: 8,
            }}>
              Cum vrei să începi?
            </h2>
            <p style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.5 }}>
              Alege modalitatea cu care vrei să continui —
              poți combina oricând toate variantele mai târziu.
            </p>
          </div>

          {/* Carduri opțiuni */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 20,
          }}>
            {OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => handle(opt.key)}
                style={{
                  background: opt.bg,
                  border: `1.5px solid ${opt.border}`,
                  borderRadius: 14,
                  padding: '18px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: sans,
                  transition: 'transform .12s, box-shadow .12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${opt.border}`
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = opt.accent
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = ''
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = ''
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = opt.border
                }}
              >
                <div style={{ color: opt.accent, marginBottom: 10 }}>{opt.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E2329', marginBottom: 5 }}>
                  {opt.title}
                </div>
                <div style={{ fontSize: 12, color: '#6B6860', lineHeight: 1.5 }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Dismiss discret */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={dismiss}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#A8A59E', fontFamily: sans,
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              Voi decide mai târziu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
