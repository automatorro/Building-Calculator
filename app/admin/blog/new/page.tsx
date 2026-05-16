'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { slugify } from '@/utils/blog'
import { ChevronLeft, Save, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'
import BlogEditor from '@/components/admin/BlogEditor'
import ImageUploader from '@/components/admin/ImageUploader'

export default function NewBlogPost() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author_name: '',
    published: false
  })
  
  const supabase = createClient()
  const router = useRouter()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: slugify(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error('Titlul și conținutul sunt obligatorii')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('blog_posts')
      .insert([{
        ...formData,
        author_id: user?.id,
        published_at: formData.published ? new Date().toISOString() : null
      }])

    if (error) {
      if (error.code === '23505') {
        toast.error('Acest slug (URL) există deja. Modifică titlul.')
      } else {
        toast.error('Eroare la salvarea articolului')
        console.error(error)
      }
    } else {
      toast.success('Articol creat cu succes')
      router.push('/admin/blog')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blog"
            className="p-2 hover:bg-[#E5E3DE] rounded-full transition-colors text-[#6B6860]"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-3xl font-serif text-[#1E2329]">Articol Nou</h1>
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
            {formData.published ? 'Publică la salvare' : 'Salvează ca draft'}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>Salvează</span>
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
                placeholder="Ex: Cum am redus costurile la casa lui Ion"
                className="input text-lg font-medium mt-1"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6B6860]">Autor</label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData(p => ({ ...p, author_name: e.target.value }))}
                placeholder="Ex: Lucian Popescu"
                className="input mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6B6860]">Sumar (Excerpt)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="O scurtă descriere care apare în listă..."
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

            <div className="flex gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs">
              <Info size={16} className="shrink-0" />
              <p>Slug-ul se generează automat din titlu, dar îl poți modifica manual.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
