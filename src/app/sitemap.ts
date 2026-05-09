import type { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/blog'

const staticRoutes = [
  { path: '', priority: 1, changeFreq: 'monthly' as const },
  { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/solutions', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/technology', priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/products/cadebot-l100', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/products/cleinbot-m79', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/products/cleinbot-cc201', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/products/cleinbot-c2pro', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/products/cruzr', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/products/aoman-double', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/blog', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/welcome', priority: 0.5, changeFreq: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries = staticRoutes.map(({ path, priority, changeFreq }) => ({
    url: `https://aomanbot.com${path}`,
    lastModified,
    changeFrequency: changeFreq,
    priority,
  }))

  const blogSlugs = getAllPostSlugs()
  const blogEntries = blogSlugs.map((slug) => ({
    url: `https://aomanbot.com/blog/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // /thanks intentionally excluded (noindex)

  return [...staticEntries, ...blogEntries]
}
