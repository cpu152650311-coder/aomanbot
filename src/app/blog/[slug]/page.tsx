import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts, getAllPostSlugs, getPostBySlug, getRelatedPosts, formatDate } from '@/lib/blog'
import type { BlogPostContent } from '@/lib/blog'

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug: [slug] }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const awaitedParams = await params
  const slug = awaitedParams.slug.join('/')
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found | AOMAN FUTURE',
      description: 'The blog post you are looking for does not exist.',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${post.title} | AOMAN FUTURE Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      type: 'article',
      siteName: 'AOMAN FUTURE',
      images: post.featuredImage ? [{ url: post.featuredImage, width: 1280, height: 720 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const awaitedParams = await params
  const slug = awaitedParams.slug.join('/')
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-[#0066FF] hover:underline">Back to Blog</Link>
        </div>
      </main>
    )
  }

  const related = getRelatedPosts(slug, 3)

  const blogPostJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: post.featuredImage ? `https://aomanbot.com${post.featuredImage}` : undefined,
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        author: {
          '@type': 'Person',
          name: post.authorInfo.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'AOMAN FUTURE',
          logo: { '@type': 'ImageObject', url: 'https://aomanbot.com/logo.png' },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://aomanbot.com/blog/${slug}` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aomanbot.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://aomanbot.com/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: `https://aomanbot.com/blog/${slug}` },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#F8FAFB] text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-white border-b border-black/[0.06]">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#0066FF] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600">{post.categoryInfo.name}</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#0066FF]/10 text-[#0066FF] mb-4">
            {post.categoryInfo.name}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <span>{post.authorInfo.name}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container mx-auto px-6 max-w-4xl -mt-8 relative z-10">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={1280}
            height={720}
            className="w-full rounded-2xl shadow-lg object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-6 py-12 max-w-3xl">
        <div
          className="prose prose-lg prose-slate max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-a:text-[#0066FF] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-[#0066FF] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4
            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-strong:text-gray-900
            prose-li:marker:text-[#0066FF]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags footer */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-[#0066FF]/10 hover:text-[#0066FF] transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-white border-t border-black/[0.06] py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block bg-[#F8FAFB] rounded-xl overflow-hidden border border-black/[0.04] hover:border-[#0066FF]/20 hover:shadow-md transition-all"
                >
                  {rp.featuredImage && (
                    <Image
                      src={rp.featuredImage}
                      alt={rp.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#0066FF]">{rp.category}</span>
                    <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{rp.description}</p>
                    <span className="mt-3 inline-block text-xs text-gray-400">{formatDate(rp.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
