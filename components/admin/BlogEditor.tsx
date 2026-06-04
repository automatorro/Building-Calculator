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
  Trash2, RefreshCw, FileCode2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
}

// ─── NodeView custom pentru imagini ───────────────────────────────────────────

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
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        className="rounded-xl max-w-full h-auto mx-auto block"
      />
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={replacing}
          title="Înlocuiește imaginea"
          className="p-1.5 rounded-lg bg-white/90 backdrop-blur text-[#6B6860] hover:text-[#E8500A] hover:bg-white shadow border border-[#E5E3DE] transition-colors"
        >
          {replacing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
        <button
          type="button"
          onClick={deleteNode}
          title="Șterge imaginea"
          className="p-1.5 rounded-lg bg-white/90 backdrop-blur text-[#6B6860] hover:text-red-500 hover:bg-white shadow border border-[#E5E3DE] transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleReplace}
      />
    </NodeViewWrapper>
  )
}

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})

// ─── MenuBar ──────────────────────────────────────────────────────────────────

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [htmlModalOpen, setHtmlModalOpen] = useState(false)
  const [htmlInput, setHtmlInput] = useState('')
  const supabase = createClient()

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Introduceți URL-ul:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
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

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      editor.chain().focus().setImage({ src: publicUrl }).run()
      toast.success('Imagine optimizată și inserată')
    } catch (error: any) {
      console.error('Editor upload error:', error)
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
    <div className="flex flex-wrap items-center gap-1 border-b border-[#E5E3DE] bg-[#F9F9F8] p-2 rounded-t-xl">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {buttons.map((btn, i) => (
        <button
          key={i}
          disabled={btn.loading}
          onClick={(e) => { e.preventDefault(); btn.action(); }}
          className={`p-2 rounded-md transition-colors relative ${
            editor.isActive(btn.active, btn.props || {})
              ? 'bg-[#E8500A] text-white'
              : 'text-[#6B6860] hover:bg-[#E5E3DE]'
          } ${btn.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {btn.loading ? (
             <Loader2 className="animate-spin" size={18} />
          ) : (
            <btn.icon size={18} />
          )}
        </button>
      ))}
      <div className="mx-2 h-6 w-px bg-[#E5E3DE]" />
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        className="p-2 text-[#6B6860] hover:bg-[#E5E3DE] rounded-md disabled:opacity-30"
        disabled={!editor.can().undo()}
      >
        <Undo size={18} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        className="p-2 text-[#6B6860] hover:bg-[#E5E3DE] rounded-md disabled:opacity-30"
        disabled={!editor.can().redo()}
      >
        <Redo size={18} />
      </button>
      <div className="mx-2 h-6 w-px bg-[#E5E3DE]" />
      {/* Import HTML */}
      <button
        onClick={(e) => { e.preventDefault(); setHtmlModalOpen(true); }}
        title="Importă HTML brut"
        className="p-2 text-[#6B6860] hover:bg-[#E5E3DE] rounded-md flex items-center gap-1.5 text-xs font-medium"
      >
        <FileCode2 size={18} />
        <span className="hidden sm:inline">Import HTML</span>
      </button>

      {/* Modal import HTML */}
      {htmlModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setHtmlModalOpen(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E3DE] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1E2329]">Importă HTML</h3>
                <p className="text-xs text-[#6B6860] mt-0.5">
                  Lipește HTML-ul complet al articolului. Conținutul curent va fi înlocuit.
                </p>
              </div>
              <button
                onClick={() => setHtmlModalOpen(false)}
                className="p-2 text-[#A8A59E] hover:text-[#1E2329] hover:bg-[#F3F2EF] rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <textarea
                autoFocus
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<h1>Titlul articolului</h1>\n<p>Paragraful tău...</p>"
                className="w-full h-64 font-mono text-sm border border-[#E5E3DE] rounded-xl p-4 resize-none focus:outline-none focus:border-[#E8500A] bg-[#F9F9F8] text-[#1E2329]"
              />
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <button
                onClick={() => { setHtmlModalOpen(false); setHtmlInput('') }}
                className="px-4 py-2 text-sm font-medium text-[#6B6860] hover:bg-[#F3F2EF] rounded-lg transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={() => {
                  if (htmlInput.trim()) {
                    editor.commands.setContent(htmlInput, true)
                    editor.commands.focus()
                  }
                  setHtmlModalOpen(false)
                  setHtmlInput('')
                }}
                className="px-5 py-2 text-sm font-semibold bg-[#E8500A] text-white rounded-lg hover:bg-[#C43F06] transition-colors"
              >
                Aplică în editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── BlogEditor ───────────────────────────────────────────────────────────────

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      CustomImage,
      Placeholder.configure({
        placeholder: 'Începe să scrii povestea de pe șantier...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-orange max-w-none min-h-[400px] p-6 focus:outline-none focus:ring-0 text-[#1E2329] font-sans',
      },
    },
  })

  return (
    <div className="w-full border border-[#E5E3DE] rounded-xl bg-white shadow-sm overflow-hidden focus-within:border-[#E8500A]/30 transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #A8A59E;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none;
        }
        .prose h1 { font-family: var(--font-dm-serif, serif); font-weight: 400; font-size: 2rem; margin-bottom: 1rem; }
        .prose h2 { font-family: var(--font-dm-serif, serif); font-weight: 400; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose p { margin-bottom: 1rem; line-height: 1.6; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose blockquote { border-left: 4px solid #E8500A; padding-left: 1.25rem; font-style: italic; margin: 1.5rem 0; color: #6B6860; }
        .prose img { border-radius: 0.75rem; max-width: 100%; height: auto; margin: 2rem 0; }
      `}</style>
    </div>
  )
}
