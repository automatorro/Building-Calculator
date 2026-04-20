'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, FileText, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function BlogIndex() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles(full_name)')
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (!error) {
        setPosts(data || [])
      }
      setLoading(false)
    }

    fetchPosts()
  }, [supabase])

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E8500A]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E8500A]/3 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow mb-4 block">Noutăți de pe șantier</span>
            <h1 className="page-title text-5xl md:text-6xl mb-6 max-w-3xl mx-auto">
              Povestiri, sfaturi și <span className="text-[#E8500A]">expertiză</span> în construcții.
            </h1>
            <p className="text-[#6B6860] text-lg max-w-2xl mx-auto">
              Află cum să gestionezi mai eficient proiectele tale, noutăți legislative și studii de caz direct de pe teren.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="container mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#E8500A] mb-4" />
            <p className="text-[#6B6860]">Se încarcă noutățile...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E3DE]">
            <FileText className="mx-auto text-[#A8A59E] mb-4" size={48} />
            <h3 className="text-xl font-serif mb-2">Momentan nu avem articole noi</h3>
            <p className="text-[#6B6860]">Revin-o curând pentru noutăți proaspete de pe șantier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col bg-white rounded-2xl border border-[#E5E3DE] overflow-hidden hover:border-[#E8500A]/30 transition-all hover:shadow-xl hover:shadow-[#E8500A]/5"
              >
                <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                  {post.featured_image ? (
                    <Image 
                      src={post.featured_image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F3F2EF] flex items-center justify-center text-[#A8A59E]">
                      <FileText size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-[#A8A59E] mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.published_at || post.created_at).toLocaleDateString('ro-RO')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {post.profiles?.full_name || 'Echipa Șantier.app'}
                    </span>
                  </div>

                  <h2 className="text-xl font-serif text-[#1E2329] mb-3 group-hover:text-[#E8500A] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-[#6B6860] text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt || 'Citește noul articol postat de echipa noastră pentru a afla cele mai recente noutăți din domeniu.'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#F3F2EF]">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-[#E8500A] font-semibold text-sm hover:gap-3 transition-all"
                    >
                      Citește tot articolul
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
