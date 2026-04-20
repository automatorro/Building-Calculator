'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { 
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Calendar, 
  ChevronRight, FileText, Loader2, MoreVertical 
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Eroare la încărcarea articolelor')
      console.error(error)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  async function deletePost(id: string) {
    if (!confirm('Ești sigur că vrei să ștergi acest articol?')) return

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Nu s-a putut șterge articolul')
    } else {
      toast.success('Articol șters cu succes')
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  async function togglePublish(post: any) {
    const newStatus = !post.published
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null
      })
      .eq('id', post.id)

    if (error) {
      toast.error('Eroare la actualizarea statusului')
    } else {
      setPosts(posts.map(p => p.id === post.id ? { ...p, published: newStatus } : p))
      toast.success(newStatus ? 'Articol publicat' : 'Articol trecut ca draft')
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#E8500A] font-medium mb-1">
            <Link href="/admin" className="hover:underline">Admin</Link>
            <ChevronRight size={14} className="text-[#A8A59E]" />
            <span>Blog</span>
          </div>
          <h1 className="text-4xl font-serif text-[#1E2329]">Gestionare Blog</h1>
          <p className="text-[#6B6860] mt-2">Adaugă, editează și publică noutățile de pe șantier.</p>
        </div>
        
        <Link 
          href="/admin/blog/new"
          className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-[#E8500A]/20"
        >
          <Plus size={18} />
          <span>Articol nou</span>
        </Link>
      </div>

      {/* Stats/Quick Actions (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-[#E8500A]">
          <div className="p-3 bg-[#FFF0E8] rounded-xl text-[#E8500A]">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-2xl font-serif">{posts.length}</div>
            <div className="text-sm text-[#6B6860]">Articole totale</div>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-[#2A7D4F]">
          <div className="p-3 bg-green-50 rounded-xl text-[#2A7D4F]">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-2xl font-serif">{posts.filter(p => p.published).length}</div>
            <div className="text-sm text-[#6B6860]">Publicate live</div>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-[#A8A59E]">
          <div className="p-3 bg-gray-50 rounded-xl text-[#6B6860]">
            <EyeOff size={24} />
          </div>
          <div>
            <div className="text-2xl font-serif">{posts.filter(p => !p.published).length}</div>
            <div className="text-sm text-[#6B6860]">În lucru (Draft)</div>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-[#E5E3DE] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A59E]" size={18} />
            <input 
              type="text" 
              placeholder="Caută în articole..." 
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F9F8] text-[#6B6860] text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Articol</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data creării</th>
                <th className="px-6 py-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-[#E8500A] mx-auto mb-2" />
                    <span className="text-[#6B6860]">Se încarcă articolele...</span>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[#6B6860]">
                    Nu am găsit niciun articol.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-[#E5E3DE] bg-[#F3F2EF]">
                          {post.featured_image ? (
                            <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FileText className="text-[#A8A59E]" size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#1E2329] group-hover:text-[#E8500A] transition-colors">
                            {post.title}
                          </div>
                          <div className="text-xs text-[#A8A59E] mt-1 line-clamp-1 max-w-xs">
                            /{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.published ? (
                        <span className="badge badge-success">Publicat</span>
                      ) : (
                        <span className="badge badge-neutral">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#6B6860]">
                        <Calendar size={14} />
                        {new Date(post.created_at).toLocaleDateString('ro-RO')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => togglePublish(post)}
                          className={`p-2 rounded-lg transition-colors ${post.published ? 'text-[#6B6860] hover:bg-gray-100' : 'text-[#2A7D4F] hover:bg-green-50'}`}
                          title={post.published ? 'Ascunde (Draft)' : 'Publică'}
                        >
                          {post.published ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <Link 
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-[#E8500A] hover:bg-[#FFF0E8] rounded-lg transition-colors"
                          title="Editează"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-[#C0392B] hover:bg-red-50 rounded-lg transition-colors"
                          title="Șterge"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="group-hover:hidden text-[#A8A59E]">
                        <MoreVertical size={18} className="ml-auto" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
