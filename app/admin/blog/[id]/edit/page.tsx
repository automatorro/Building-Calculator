'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { slugify } from '@/utils/blog'
import { ChevronLeft, Save, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'
import BlogEditor from '@/components/admin/BlogEditor'
import ImageUploader from '@/components/admin/ImageUploader'

export default function EditBlogPost() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    published: false
  })
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Articolul nu a fost găsit')
        router.push('/admin/blog')
      } else {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          featured_image: data.featured_image || '',
          published: data.published
        })
        setLoading(false)
      }
    }

    if (id) fetchPost()
  }, [id, supabase, router])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      // Only sync slug if it was previously synced (optional logic, usually better to keep it manual after creation)
      // slug: slugify(title) 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error('Titlul și conținutul sunt obligatorii')
      return
    }

    setSaving(true)
    const { error } = await supabase
      .from('blog_posts')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
        published_at: formData.published ? (formData.published ? new Date().toISOString() : null) : null
        // Note: published_at logic could be more complex (don't overwrite if already published), 
        // but for now let's keep it simple.
      })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') {
        toast.error('Acest slug (URL) există deja.')
      } else {
        toast.error('Eroare la salvarea articolului')
        console.error(error)
      }
    } else {
      toast.success('Articol actualizat cu succes')
      router.push('/admin/blog')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8500A]" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blog"
            className="p-2 hover:bg-[#E5E3DE] rounded-full transition-colors text-[#6B6860]"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-3xl font-serif text-[#1E2329]">Editează Articol</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFormData(p => ({ ...p, published: !p.published }))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              formData.published 
                ? 'bg-green-100 text-[#2A7D4F]' 
                : 'bg-gray-100 text-[#6B6860]'
            }`}
          >
            {formData.published ? 'Publicat' : 'Salvat ca draft'}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>Salvează modificările</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6B6860]">Titlu Articol</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={handleTitleChange}
                className="input text-lg font-medium mt-1"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6B6860]">Sumar (Excerpt)</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                className="input mt-1 h-20 resize-none"
              />
            </div>
          </div>

          <BlogEditor 
            value={formData.content}
            onChange={(content) => setFormData(p => ({ ...p, content }))}
          />
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <ImageUploader 
            value={formData.featured_image}
            onChange={(url) => setFormData(p => ({ ...p, featured_image: url }))}
          />

          <div className="card space-y-4 p-5">
            <h3 className="text-sm font-semibold text-[#1E2329]">Setări SEO</h3>
            
            <div>
              <label className="text-xs font-medium text-[#6B6860]">Slug (URL)</label>
              <div className="mt-1 flex items-center gap-1 text-xs text-[#A8A59E] bg-[#F9F9F8] p-2 rounded border border-[#E5E3DE]">
                <span>santier.app/blog/</span>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                  className="bg-transparent border-none outline-none text-[#1E2329] font-medium p-0 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
