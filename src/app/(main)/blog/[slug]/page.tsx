import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPost } from '@/lib/blog';
import { marked } from 'marked';
import type { Metadata } from 'next';
import OpenInquiryButton from '@/components/OpenInquiryButton';

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const siteUrl = 'https://aomanbot.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.coverImage ? `${siteUrl}${post.coverImage}` : `${siteUrl}/images/home/hero-robot.webp`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: 'AOMAN FUTURE',
      type: 'article',
      images: [{ url: ogImage, width: 1280, height: 720, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const htmlContent = marked(post.content);
  const siteUrl = 'https://aomanbot.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.coverImage ? `${siteUrl}${post.coverImage}` : `${siteUrl}/images/home/hero-robot.webp`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: ogImage,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'AOMAN FUTURE' },
    publisher: { '@type': 'Organization', name: 'AOMAN FUTURE', logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.webp` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0066FF 0%, #0044AA 100%)',
        }}
        className="pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <div className="container mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors"
          >
            ← Back to Blog
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs text-white/60 mb-4">
              <span
                className="px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                {post.category}
              </span>
              <span>{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-gray prose-lg max-w-none">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-xl mb-8"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            {post.diagramImage && (
              <img
                src={post.diagramImage}
                alt={`${post.title} diagram`}
                className="w-full rounded-xl my-8"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section
        className="py-16"
        style={{
          background: 'linear-gradient(135deg, #0066FF 0%, #0044AA 100%)',
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Automate?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Get a free consultation on the right robot solution for your business.
          </p>
          <OpenInquiryButton
            className="inline-flex items-center gap-2 bg-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            style={{ color: '#0066FF' }}
          >
            Contact Us →
          </OpenInquiryButton>
        </div>
      </section>
    </main>
  );
}
