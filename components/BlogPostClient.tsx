'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ChevronLeft, Share2 } from 'lucide-react'
import { toast } from 'sonner'

type BlogPost = {
  title: string
  excerpt?: string
  content: string
  published_at?: string
  created_at: string
  featured_image?: string
  profiles?: { full_name?: string } | null
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiat în clipboard')
    }
  }

  return (
    <article className="min-h-screen bg-[#FAFAF8] pb-24">
      <header className="relative pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#6B6860] hover:text-[#E8500A] transition-colors mb-8 group"
            >
              <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Înapoi la blog
            </Link>

            <div className="flex items-center gap-4 text-xs text-[#A8A59E] mb-6 font-medium uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#E8500A]" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('ro-RO')}
              </span>
              <span className="w-1 h-1 bg-[#E5E3DE] rounded-full" />
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-[#E8500A]" />
                {post.profiles?.full_name || 'Echipa Șantier.app'}
              </span>
            </div>

            <h1 className="page-title text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-[#6B6860] text-xl leading-relaxed mb-8 font-light italic border-l-4 border-[#E8500A] pl-6">
                {post.excerpt}
              </p>
            )}
          </motion.div>
        </div>
      </header>

      {post.featured_image && (
        <section className="container mx-auto px-6 max-w-6xl mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-[#E8500A]/5 border border-[#E5E3DE]"
          >
            <Image src={post.featured_image} alt={post.title} fill priority className="object-cover" />
          </motion.div>
        </section>
      )}

      <section className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="prose prose-orange prose-lg max-w-none text-[#1E2329]"
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-content-renderer" />
        </motion.div>

        <div className="mt-16 pt-8 border-t border-[#E5E3DE] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E8500A]">
              <User size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold">{post.profiles?.full_name || 'Echipa Șantier.app'}</div>
              <div className="text-xs text-[#6B6860]">Autor, Șantier.app</div>
            </div>
          </div>

          <button onClick={handleShare} className="btn-ghost flex items-center gap-2 group">
            <Share2 size={18} className="group-hover:scale-110 transition-transform" />
            Distribuie articolul
          </button>
        </div>
      </section>

      <style jsx global>{`
        .blog-content-renderer h1 { font-family: var(--font-dm-serif, serif); font-size: 2.5rem; margin-top: 3rem; margin-bottom: 1.5rem; }
        .blog-content-renderer h2 { font-family: var(--font-dm-serif, serif); font-size: 2rem; margin-top: 2.5rem; margin-bottom: 1.25rem; font-weight: 400; }
        .blog-content-renderer h3 { font-family: var(--font-dm-serif, serif); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 400; }
        .blog-content-renderer p { margin-bottom: 1.5rem; line-height: 1.8; color: #374151; }
        .blog-content-renderer ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content-renderer ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content-renderer li { margin-bottom: 0.5rem; }
        .blog-content-renderer blockquote { border-left: 4px solid #E8500A; padding: 1.5rem 2rem; font-style: italic; margin: 2.5rem 0; color: #4B5563; border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
        .blog-content-renderer img { border-radius: 1rem; max-width: 100%; height: auto; margin: 2.5rem auto; display: block; }
        .blog-content-renderer a { color: #E8500A; text-decoration: underline; text-underline-offset: 4px; font-weight: 500; }
        .blog-content-renderer a:hover { color: #C43F06; }
        .blog-content-renderer pre { background: #1E2329; color: #FAFAF8; padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 2rem 0; }
      `}</style>
    </article>
  )
}
