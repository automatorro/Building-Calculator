import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import BlogPostClient from '@/components/BlogPostClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, featured_image, published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    return { title: 'Articol negăsit' }
  }

  return {
    title: post.title,
    description: post.excerpt || `${post.title} — articol pe Șantier.app`,
    alternates: {
      canonical: `https://santier.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `https://santier.app/blog/${slug}`,
      type: 'article',
      publishedTime: post.published_at,
      ...(post.featured_image && {
        images: [{ url: post.featured_image, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name), author_name, faq_schema')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    notFound()
  }

  const authorName = post.author_name || post.profiles?.full_name || 'Echipa Șantier.app'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://santier.app/despre',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Șantier.app',
      url: 'https://santier.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://santier.app/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://santier.app/blog/${slug}`,
    },
    inLanguage: 'ro-RO',
    ...(post.featured_image && { image: post.featured_image }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {post.faq_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.faq_schema }}
        />
      )}
      <BlogPostClient post={post} />
    </>
  )
}
