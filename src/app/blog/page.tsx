import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts, getManifest, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | AOMAN FUTURE — AI & Robotics Insights',
  description: 'Explore the latest insights, product updates, and technology deep-dives from AOMAN FUTURE — covering AI robotics, automation, and industry applications.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | AOMAN FUTURE — AI & Robotics Insights',
    description: 'Explore the latest insights, product updates, and technology deep-dives from AOMAN FUTURE.',
    url: '/blog',
    type: 'website',
    siteName: 'AOMAN FUTURE',
    images: [{ url: 'https://aomanbot.com/images/home/hero-robot.webp', width: 1280, height: 720 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | AOMAN FUTURE — AI & Robotics Insights',
    description: 'Explore the latest insights, product updates, and technology deep-dives from AOMAN FUTURE.',
    images: ['https://aomanbot.com/images/home/hero-robot.webp'],
  },
}

export default function BlogListPage() {
  const posts = getAllPosts()
  const { categories } = getManifest()

  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'AOMAN FUTURE Blog',
        url: 'https://aomanbot.com/blog',
        description: 'AI & robotics insights from AOMAN FUTURE',
        publisher: {
          '@type': 'Organization',
          name: 'AOMAN FUTURE',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aomanbot.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://aomanbot.com/blog' },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#F8FAFB] text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-white border-b border-black/[0.06]">
        <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AOMAN FUTURE Blog
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Insights on AI robotics, industry automation, and the future of intelligent machines.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full text-sm font-medium bg-[#0066FF] text-white"
            >
              All Posts
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-[#0066FF]/10 hover:text-[#0066FF] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Posts Yet</h2>
            <p className="text-gray-400">Check back soon for the latest robotics insights from AOMAN FUTURE.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-black/[0.06] hover:border-[#0066FF]/20 hover:shadow-lg transition-all"
              >
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={600}
                    height={340}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0066FF]/10 text-[#0066FF]">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.readingTime} min read</span>
                    <span>{post.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
