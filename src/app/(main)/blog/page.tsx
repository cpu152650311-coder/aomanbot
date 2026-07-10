import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on service robots, automation technology, and industry trends from AOMAN FUTURE.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | AOMAN FUTURE',
    description: 'Insights on service robots, automation technology, and industry trends.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066FF 0%, #0044AA 100%)',
        }}
        className="pt-32 pb-20 md:pt-40 md:pb-28"
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Insights on service robots, automation technology, and industry trends.
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Coming Soon</h3>
              <p className="text-gray-400">Check back soon for new articles.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl overflow-hidden border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span
                        className="px-2.5 py-1 rounded-full font-medium"
                        style={{ background: '#EFF6FF', color: '#0066FF' }}
                      >
                        {post.category}
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-4 text-sm font-semibold" style={{ color: '#0066FF' }}>
                      Read more →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
