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
  author_name?: string | null
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
                {post.author_name || post.profiles?.full_name || 'Echipa Șantier.app'}
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
              <div className="text-sm font-semibold">{post.author_name || post.profiles?.full_name || 'Echipa Șantier.app'}</div>
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
        /* ── Bază ── */
        .blog-content-renderer h1 { font-family: var(--font-dm-serif, serif); font-size: 2.5rem; margin-top: 3rem; margin-bottom: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
        .blog-content-renderer h2 { font-family: var(--font-dm-serif, serif); font-size: 1.85rem; margin-top: 3rem; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: -0.02em; color: #1E2329; line-height: 1.25; }
        .blog-content-renderer h3 { font-size: 1.15rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: #1E2329; }
        .blog-content-renderer h4 { font-size: 1rem; font-weight: 600; color: #1E2329; margin-bottom: 0.4rem; }
        .blog-content-renderer p { margin-bottom: 1.5rem; line-height: 1.8; color: #374151; font-size: 1.0625rem; }
        .blog-content-renderer ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content-renderer ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content-renderer li { margin-bottom: 0.5rem; color: #374151; }
        .blog-content-renderer img { border-radius: 1rem; max-width: 100%; height: auto; margin: 2.5rem auto; display: block; }
        .blog-content-renderer a { color: #E8500A; text-decoration: underline; text-underline-offset: 4px; font-weight: 500; }
        .blog-content-renderer a:hover { color: #C43F06; }
        .blog-content-renderer pre { background: #1E2329; color: #FAFAF8; padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 2rem 0; }
        .blog-content-renderer strong { color: #1E2329; font-weight: 600; }
        .blog-content-renderer em { font-style: italic; }

        /* ── Blockquote ── */
        .blog-content-renderer blockquote {
          font-family: var(--font-dm-serif, Georgia, serif);
          font-size: 1.25rem;
          font-style: italic;
          color: #1E2329;
          border-left: 4px solid #E8500A;
          padding: 0.5rem 0 0.5rem 1.75rem;
          margin: 2.5rem 0;
          line-height: 1.55;
        }
        .blog-content-renderer blockquote p { margin: 0; color: #1E2329; }

        /* ── Callout boxes ── */
        .blog-content-renderer .callout {
          border-radius: 10px;
          padding: 18px 22px;
          margin: 28px 0;
          font-size: 0.95rem;
          line-height: 1.65;
        }
        .blog-content-renderer .callout-title {
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .blog-content-renderer .callout p { margin: 0; font-size: 0.95rem; }
        .blog-content-renderer .callout.tip {
          background: #EAF3EE;
          border-left: 3px solid #2D6A3F;
          color: #1D4A2B;
        }
        .blog-content-renderer .callout.tip .callout-title { color: #2D6A3F; }
        .blog-content-renderer .callout.warning {
          background: #FFF8E6;
          border-left: 3px solid #9A6200;
          color: #5A3A00;
        }
        .blog-content-renderer .callout.warning .callout-title { color: #9A6200; }
        .blog-content-renderer .callout.danger {
          background: #FFF0ED;
          border-left: 3px solid #C03B1F;
          color: #6E2010;
        }
        .blog-content-renderer .callout.danger .callout-title { color: #C03B1F; }

        /* ── Step cards ── */
        .blog-content-renderer .steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 20px 0 32px;
        }
        .blog-content-renderer .step-card {
          display: flex;
          gap: 16px;
          background: #FFFFFF;
          border: 1px solid #E5E3DE;
          border-radius: 10px;
          padding: 16px 20px;
          align-items: flex-start;
        }
        .blog-content-renderer .step-number {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #E8500A;
          color: white;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }
        .blog-content-renderer .step-content h4 { font-size: 0.95rem; font-weight: 600; color: #1E2329; margin-bottom: 4px; }
        .blog-content-renderer .step-content p { font-size: 0.875rem; color: #6B6860; margin: 0; }

        /* ── Mistakes list ── */
        .blog-content-renderer .mistakes-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .blog-content-renderer .mistakes-list li {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          font-size: 0.9375rem;
          color: #374151;
          background: #FFFFFF;
          border: 1px solid #E5E3DE;
          border-radius: 8px;
          padding: 14px 18px;
          margin: 0;
        }
        .blog-content-renderer .mistake-icon {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFF0ED;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          position: relative;
        }
        .blog-content-renderer .mistake-icon::after {
          content: '✕';
          font-size: 10px;
          color: #C03B1F;
          font-weight: 700;
        }

        /* ── Tabel comparativ ── */
        .blog-content-renderer .tool-compare {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0 32px;
          font-size: 0.875rem;
        }
        .blog-content-renderer .tool-compare th {
          text-align: left;
          padding: 10px 14px;
          background: #F3F2EF;
          color: #6B6860;
          font-weight: 600;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #E5E3DE;
        }
        .blog-content-renderer .tool-compare td {
          padding: 12px 14px;
          border-bottom: 1px solid #E5E3DE;
          color: #374151;
          vertical-align: top;
        }
        .blog-content-renderer .tool-compare tr:last-child td { border-bottom: none; }
        .blog-content-renderer .badge-green {
          background: #EAF3EE;
          color: #2D6A3F;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 100px;
          display: inline-block;
        }
        .blog-content-renderer .badge-amber {
          background: #FFF8E6;
          color: #9A6200;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 100px;
          display: inline-block;
        }

        /* ── CTA banner ── */
        .blog-content-renderer .cta-banner {
          background: #1E2329;
          color: white;
          border-radius: 12px;
          padding: 32px 36px;
          margin: 40px 0;
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }
        .blog-content-renderer .cta-banner-text { flex: 1; }
        .blog-content-renderer .cta-banner-text h3 {
          font-family: var(--font-dm-serif, Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 6px;
          margin-top: 0;
        }
        .blog-content-renderer .cta-banner-text p {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
          margin: 0;
        }
        .blog-content-renderer .cta-btn {
          flex-shrink: 0;
          background: #E8500A;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          display: inline-block;
        }
        .blog-content-renderer .cta-btn:hover { background: #C43F06; color: white; }

        /* ── Category pill & tags ── */
        .blog-content-renderer .category-pill {
          display: inline-block;
          background: #FEF0E8;
          color: #C04E10;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 16px;
        }
        .blog-content-renderer .tag-list { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
        .blog-content-renderer .tag {
          background: #F3F2EF;
          border: 1px solid #E5E3DE;
          color: #6B6860;
          font-size: 0.7rem;
          padding: 4px 12px;
          border-radius: 100px;
          text-decoration: none;
        }

        /* ── Image suggestion box (ascuns în render public) ── */
        .blog-content-renderer .image-suggestion { display: none; }
        .blog-content-renderer .hero-image { display: none; }
        .blog-content-renderer .inline-image { display: none; }
        .blog-content-renderer .site-header { display: none; }
        .blog-content-renderer .hero { display: none; }
        .blog-content-renderer .image-caption { font-size: 0.8rem; color: #6B6860; text-align: center; margin-top: -1rem; margin-bottom: 1.5rem; font-style: italic; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .blog-content-renderer .cta-banner { padding: 20px; flex-direction: column; }
          .blog-content-renderer .step-card { flex-direction: column; gap: 10px; }
          .blog-content-renderer h2 { font-size: 1.5rem; }
          .blog-content-renderer .tool-compare { font-size: 0.8rem; }
        }
      `}</style>
    </article>
  )
}
