'use client'

import { useRef, useState } from 'react'
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code, Loader2,
  Trash2, RefreshCw, FileCode2, Eye, Edit3, AlertTriangle
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
}

// ─── NodeView imagini ──────────────────────────────────────────────────────────

const ImageNodeView = ({ node, deleteNode, updateAttributes }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [replacing, setReplacing] = useState(false)
  const supabase = createClient()

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReplacing(true)
    try {
      const { optimizeImage } = await import('@/utils/image-optimizer')
      const optimized = await optimizeImage(file)
      const fileExt = optimized.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `post-content/${fileName}`
      const { error } = await supabase.storage.from('blog-images').upload(filePath, optimized)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath)
      updateAttributes({ src: publicUrl })
      toast.success('Imagine înlocuită')
    } catch {
      toast.error('Eroare la înlocuire imagine')
    } finally {
      setReplacing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <NodeViewWrapper className="relative group my-8 w-full">
      <img src={node.attrs.src} alt={node.attrs.alt || ''} className="rounded-xl max-w-full h-auto mx-auto block" />
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={replacing}
          className="p-1.5 rounded-lg bg-white/90 backdrop-blur text-[#6B6860] hover:text-[#E8500A] hover:bg-white shadow border border-[#E5E3DE] transition-colors">
          {replacing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
        <button type="button" onClick={deleteNode}
          className="p-1.5 rounded-lg bg-white/90 backdrop-blur text-[#6B6860] hover:text-red-500 hover:bg-white shadow border border-[#E5E3DE] transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleReplace} />
    </NodeViewWrapper>
  )
}

const CustomImage = Image.extend({
  addNodeView() { return ReactNodeViewRenderer(ImageNodeView) },
})

// ─── MenuBar Tiptap ────────────────────────────────────────────────────────────

const MenuBar = ({ editor, onImportHtml }: { editor: any; onImportHtml: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Introduceți URL-ul:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      let file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      const { optimizeImage } = await import('@/utils/image-optimizer')
      file = await optimizeImage(file)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `post-content/${fileName}`
      const { error: uploadError } = await supabase.storage.from('blog-images').upload(filePath, file)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath)
      editor.chain().focus().setImage({ src: publicUrl }).run()
      toast.success('Imagine optimizată și inserată')
    } catch {
      toast.error('Eroare la încărcare imagine')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const buttons = [
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: 'heading', props: { level: 1 } },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: 'heading', props: { level: 2 } },
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
    { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: 'codeBlock' },
    { icon: LinkIcon, action: addLink, active: 'link' },
    { icon: ImageIcon, action: () => fileInputRef.current?.click(), active: 'image', loading: uploading },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[#E5E3DE] bg-[#F9F9F8] p-2">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      {buttons.map((btn, i) => (
        <button key={i} disabled={btn.loading}
          onClick={(e) => { e.preventDefault(); btn.action() }}
          className={`p-2 rounded-md transition-colors ${editor.isActive(btn.active, btn.props || {}) ? 'bg-[#E8500A] text-white' : 'text-[#6B6860] hover:bg-[#E5E3DE]'} ${btn.loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {btn.loading ? <Loader2 className="animate-spin" size={18} /> : <btn.icon size={18} />}
        </button>
      ))}
      <div className="mx-2 h-6 w-px bg-[#E5E3DE]" />
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
        className="p-2 text-[#6B6860] hover:bg-[#E5E3DE] rounded-md disabled:opacity-30" disabled={!editor.can().undo()}>
        <Undo size={18} />
      </button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
        className="p-2 text-[#6B6860] hover:bg-[#E5E3DE] rounded-md disabled:opacity-30" disabled={!editor.can().redo()}>
        <Redo size={18} />
      </button>
      <div className="mx-2 h-6 w-px bg-[#E5E3DE]" />
      <button onClick={(e) => { e.preventDefault(); onImportHtml() }}
        className="p-2 text-[#6B6860] hover:bg-[#E5E3DE] rounded-md flex items-center gap-1.5 text-xs font-medium">
        <FileCode2 size={18} />
        <span className="hidden sm:inline">Import HTML</span>
      </button>
    </div>
  )
}

// ─── BlogEditor principal ──────────────────────────────────────────────────────

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [htmlModalOpen, setHtmlModalOpen] = useState(false)
  const [htmlInput, setHtmlInput] = useState('')
  const [rawHtmlMode, setRawHtmlMode] = useState(false)
  const [showSwitchWarning, setShowSwitchWarning] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      CustomImage,
      Placeholder.configure({ placeholder: 'Începe să scrii povestea de pe șantier...' }),
    ],
    content: rawHtmlMode ? '' : value,
    onUpdate: ({ editor }) => {
      if (!rawHtmlMode) onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-orange max-w-none min-h-[400px] p-6 focus:outline-none focus:ring-0 text-[#1E2329] font-sans',
      },
    },
  })

  // ── Import HTML: extrage <article> sau <body>, bypass Tiptap complet ──────
  const handleImport = () => {
    if (!htmlInput.trim()) { setHtmlModalOpen(false); return }
    let html = htmlInput.trim()
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      doc.querySelectorAll('style, script, link, meta').forEach(el => el.remove())
      const article = doc.querySelector('article')
      if (article) {
        html = article.innerHTML
      } else {
        const body = doc.body
        body.querySelectorAll('header, footer, nav').forEach(el => el.remove())
        html = body.innerHTML
      }
    } catch { /* fallback: HTML brut */ }

    onChange(html)          // stocat direct, fără să treacă prin Tiptap
    setRawHtmlMode(true)
    setHtmlModalOpen(false)
    setHtmlInput('')
  }

  // ── Revenire la Tiptap (pierde clasele CSS) ──────────────────────────────
  const switchToEditor = () => {
    editor?.commands.setContent(value, false)
    setRawHtmlMode(false)
    setShowSwitchWarning(false)
  }

  return (
    <div className="w-full border border-[#E5E3DE] rounded-xl bg-white shadow-sm overflow-hidden focus-within:border-[#E8500A]/30 transition-colors">

      {/* ── Tab-uri mod ── */}
      <div className="flex items-center justify-between border-b border-[#E5E3DE] bg-[#F9F9F8] px-3 py-1.5">
        <div className="flex items-center gap-1">
          <button type="button"
            onClick={() => rawHtmlMode ? setShowSwitchWarning(true) : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!rawHtmlMode ? 'bg-white border border-[#E5E3DE] text-[#1E2329] shadow-sm' : 'text-[#6B6860] hover:bg-[#E5E3DE]'}`}>
            <Edit3 size={13} /> Editor
          </button>
          <button type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${rawHtmlMode ? 'bg-white border border-[#E5E3DE] text-[#1E2329] shadow-sm' : 'text-[#6B6860] hover:bg-[#E5E3DE]'}`}>
            <Eye size={13} /> Preview HTML
            {rawHtmlMode && <span className="ml-1 bg-[#E8500A] text-white text-[10px] px-1.5 py-0.5 rounded-full">activ</span>}
          </button>
        </div>
        <button type="button" onClick={() => setHtmlModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B6860] hover:bg-[#E5E3DE] rounded-md transition-colors">
          <FileCode2 size={13} /> Import HTML
        </button>
      </div>

      {/* ── Warning revenire la Tiptap ── */}
      {showSwitchWarning && (
        <div className="flex items-start gap-3 bg-amber-50 border-b border-amber-200 px-4 py-3">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1 text-sm text-amber-800">
            <strong>Atenție:</strong> Revenirea la editor va elimina formatările avansate (callout-uri, step cards, tabel). Textul rămâne intact.
          </div>
          <div className="flex gap-2 shrink-0">
            <button type="button" onClick={() => setShowSwitchWarning(false)}
              className="text-xs px-2 py-1 text-amber-700 hover:bg-amber-100 rounded">Anulează</button>
            <button type="button" onClick={switchToEditor}
              className="text-xs px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700">Continuă</button>
          </div>
        </div>
      )}

      {/* ── Conținut: Raw HTML preview (bypass Tiptap) ── */}
      {rawHtmlMode ? (
        <div className="min-h-[400px] p-6">
          <div className="blog-content-renderer" dangerouslySetInnerHTML={{ __html: value }} />

          <style jsx global>{`
            .blog-content-renderer h2{font-size:1.5rem;font-weight:700;margin:2rem 0 1rem;color:#1E2329;line-height:1.25;}
            .blog-content-renderer h3{font-size:1.1rem;font-weight:600;margin:1.5rem 0 .75rem;color:#1E2329;}
            .blog-content-renderer h4{font-size:1rem;font-weight:600;color:#1E2329;margin-bottom:.3rem;}
            .blog-content-renderer p{margin-bottom:1rem;line-height:1.7;color:#374151;font-size:.9375rem;}
            .blog-content-renderer strong{font-weight:600;color:#1E2329;}
            .blog-content-renderer em{font-style:italic;}
            .blog-content-renderer ul{list-style:disc;padding-left:1.5rem;margin-bottom:1rem;}
            .blog-content-renderer ol{list-style:decimal;padding-left:1.5rem;margin-bottom:1rem;}
            .blog-content-renderer li{margin-bottom:.4rem;color:#374151;font-size:.9375rem;}
            .blog-content-renderer blockquote{font-style:italic;border-left:4px solid #E8500A;padding:.5rem 0 .5rem 1.5rem;margin:1.5rem 0;color:#1E2329;font-size:1.1rem;}
            .blog-content-renderer blockquote p{margin:0;}
            /* Callout */
            .blog-content-renderer .callout{border-radius:8px;padding:16px 20px;margin:20px 0;font-size:.9rem;line-height:1.6;}
            .blog-content-renderer .callout-title{font-weight:700;font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
            .blog-content-renderer .callout p{margin:0;font-size:.9rem;}
            .blog-content-renderer .callout.tip{background:#EAF3EE;border-left:3px solid #2D6A3F;color:#1D4A2B;}
            .blog-content-renderer .callout.tip .callout-title{color:#2D6A3F;}
            .blog-content-renderer .callout.warning{background:#FFF8E6;border-left:3px solid #9A6200;color:#5A3A00;}
            .blog-content-renderer .callout.warning .callout-title{color:#9A6200;}
            .blog-content-renderer .callout.danger{background:#FFF0ED;border-left:3px solid #C03B1F;color:#6E2010;}
            .blog-content-renderer .callout.danger .callout-title{color:#C03B1F;}
            /* Steps */
            .blog-content-renderer .steps{display:flex;flex-direction:column;gap:10px;margin:16px 0 24px;}
            .blog-content-renderer .step-card{display:flex;gap:14px;background:#F9F9F8;border:1px solid #E5E3DE;border-radius:8px;padding:14px 18px;align-items:flex-start;}
            .blog-content-renderer .step-number{flex-shrink:0;width:30px;height:30px;border-radius:50%;background:#E8500A;color:white;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;margin-top:1px;}
            .blog-content-renderer .step-content h4{font-size:.875rem;font-weight:600;color:#1E2329;margin-bottom:3px;}
            .blog-content-renderer .step-content p{font-size:.8125rem;color:#6B6860;margin:0;}
            /* Mistakes list */
            .blog-content-renderer .mistakes-list{list-style:none;padding:0;margin:16px 0 24px;display:flex;flex-direction:column;gap:8px;}
            .blog-content-renderer .mistakes-list li{display:flex;gap:12px;align-items:flex-start;font-size:.875rem;color:#374151;background:#FAFAF8;border:1px solid #E5E3DE;border-radius:7px;padding:12px 16px;margin:0;}
            .blog-content-renderer .mistake-icon{flex-shrink:0;width:20px;height:20px;border-radius:50%;background:#FFF0ED;display:flex;align-items:center;justify-content:center;margin-top:1px;position:relative;}
            .blog-content-renderer .mistake-icon::after{content:'✕';font-size:9px;color:#C03B1F;font-weight:700;}
            /* Table */
            .blog-content-renderer .tool-compare{width:100%;border-collapse:collapse;margin:16px 0 24px;font-size:.8125rem;}
            .blog-content-renderer .tool-compare th{text-align:left;padding:8px 12px;background:#F3F2EF;color:#6B6860;font-weight:600;font-size:.65rem;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E3DE;}
            .blog-content-renderer .tool-compare td{padding:10px 12px;border-bottom:1px solid #E5E3DE;color:#374151;vertical-align:top;}
            .blog-content-renderer .tool-compare tr:last-child td{border-bottom:none;}
            .blog-content-renderer .badge-green{background:#EAF3EE;color:#2D6A3F;font-size:.65rem;font-weight:600;padding:2px 8px;border-radius:100px;display:inline-block;}
            .blog-content-renderer .badge-amber{background:#FFF8E6;color:#9A6200;font-size:.65rem;font-weight:600;padding:2px 8px;border-radius:100px;display:inline-block;}
            /* CTA */
            .blog-content-renderer .cta-banner{background:#1E2329;color:white;border-radius:10px;padding:24px 28px;margin:32px 0;display:flex;gap:20px;align-items:center;flex-wrap:wrap;}
            .blog-content-renderer .cta-banner-text{flex:1;}
            .blog-content-renderer .cta-banner-text h3{font-size:1.1rem;font-weight:700;color:white;margin-bottom:4px;margin-top:0;}
            .blog-content-renderer .cta-banner-text p{font-size:.8125rem;color:rgba(255,255,255,.65);margin:0;}
            .blog-content-renderer .cta-btn{background:#E8500A;color:white;border:none;border-radius:7px;padding:10px 20px;font-size:.875rem;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap;display:inline-block;}
            /* Ascunde elemente de infrastructură */
            .blog-content-renderer .image-suggestion,.blog-content-renderer .hero-image,.blog-content-renderer .inline-image,.blog-content-renderer .site-header,.blog-content-renderer .hero{display:none;}
            /* Misc */
            .blog-content-renderer .category-pill{display:inline-block;background:#FEF0E8;color:#C04E10;font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:100px;margin-bottom:12px;}
            .blog-content-renderer .image-caption{font-size:.75rem;color:#6B6860;text-align:center;margin-top:-.5rem;margin-bottom:1rem;font-style:italic;}
            .blog-content-renderer .tag-list{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;}
            .blog-content-renderer .tag{background:#F3F2EF;border:1px solid #E5E3DE;color:#6B6860;font-size:.65rem;padding:3px 10px;border-radius:100px;text-decoration:none;}
          `}</style>
        </div>
      ) : (
        /* ── Tiptap editor ── */
        <>
          <MenuBar editor={editor} onImportHtml={() => setHtmlModalOpen(true)} />
          <EditorContent editor={editor} />
          <style jsx global>{`
            .ProseMirror p.is-editor-empty:first-child::before{content:attr(data-placeholder);float:left;color:#A8A59E;pointer-events:none;height:0;}
            .ProseMirror{outline:none;}
            .prose h1{font-family:var(--font-dm-serif,serif);font-weight:400;font-size:2rem;margin-bottom:1rem;}
            .prose h2{font-family:var(--font-dm-serif,serif);font-weight:400;font-size:1.5rem;margin-top:2rem;margin-bottom:.75rem;}
            .prose p{margin-bottom:1rem;line-height:1.6;}
            .prose ul{list-style-type:disc;padding-left:1.5rem;margin-bottom:1rem;}
            .prose ol{list-style-type:decimal;padding-left:1.5rem;margin-bottom:1rem;}
            .prose blockquote{border-left:4px solid #E8500A;padding-left:1.25rem;font-style:italic;margin:1.5rem 0;color:#6B6860;}
            .prose img{border-radius:.75rem;max-width:100%;height:auto;margin:2rem 0;}
          `}</style>
        </>
      )}

      {/* ── Modal import HTML ── */}
      {htmlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setHtmlModalOpen(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E3DE] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1E2329]">Importă HTML</h3>
                <p className="text-xs text-[#6B6860] mt-0.5">Lipește HTML-ul complet. Clasele CSS (.callout, .step-card etc.) sunt păstrate intacte.</p>
              </div>
              <button onClick={() => setHtmlModalOpen(false)}
                className="p-2 text-[#A8A59E] hover:text-[#1E2329] hover:bg-[#F3F2EF] rounded-lg transition-colors">✕</button>
            </div>
            <div className="p-6">
              <textarea autoFocus value={htmlInput} onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<!DOCTYPE html>..."
                className="w-full h-64 font-mono text-sm border border-[#E5E3DE] rounded-xl p-4 resize-none focus:outline-none focus:border-[#E8500A] bg-[#F9F9F8] text-[#1E2329]" />
              <p className="text-xs text-[#A8A59E] mt-2 flex items-center gap-1.5">
                <Eye size={12} />
                Conținutul va fi afișat în modul Preview HTML — formatările avansate sunt complet păstrate.
              </p>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <button onClick={() => { setHtmlModalOpen(false); setHtmlInput('') }}
                className="px-4 py-2 text-sm font-medium text-[#6B6860] hover:bg-[#F3F2EF] rounded-lg transition-colors">Anulează</button>
              <button onClick={handleImport}
                className="px-5 py-2 text-sm font-semibold bg-[#E8500A] text-white rounded-lg hover:bg-[#C43F06] transition-colors">
                Importă și previzualizează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
