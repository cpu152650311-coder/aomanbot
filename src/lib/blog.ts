export interface BlogAuthor {
  slug: string
  name: string
  avatar: string
}

export interface BlogCategory {
  slug: string
  name: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  modifiedAt: string
  author: string
  category: string
  tags: string[]
  featuredImage: string
  readingTime: number
  seoKeywords: string[]
}

export interface BlogManifest {
  updatedAt: string
  posts: BlogPost[]
  categories: BlogCategory[]
  authors: BlogAuthor[]
}

export interface BlogPostContent extends BlogPost {
  content: string
  authorInfo: BlogAuthor
  categoryInfo: BlogCategory
}

let _manifest: BlogManifest | null = null

export function getManifest(): BlogManifest {
  if (_manifest) return _manifest
  // In production, this is a static import. For dynamic loading at runtime:
  const fs = typeof window === 'undefined' ? require('fs') : null
  const path = typeof window === 'undefined' ? require('path') : null
  if (fs && path) {
    const manifestPath = path.join(process.cwd(), 'content/blog/manifest.json')
    _manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  }
  return _manifest ?? { updatedAt: '', posts: [], categories: [], authors: [] }
}

export function getAllPosts(): BlogPost[] {
  const manifest = getManifest()
  return manifest.posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}

export function getPostBySlug(slug: string): BlogPostContent | null {
  const manifest = getManifest()
  const post = manifest.posts.find((p) => p.slug === slug)
  if (!post) return null

  const authorInfo = manifest.authors.find((a) => a.slug === post.author) ?? {
    slug: post.author,
    name: post.author,
    avatar: '',
  }
  const categoryInfo = manifest.categories.find((c) => c.slug === post.category) ?? {
    slug: post.category,
    name: post.category,
  }

  // Load post content from content/blog/{slug}/content.md
  const fs = typeof window === 'undefined' ? require('fs') : null
  const path = typeof window === 'undefined' ? require('path') : null
  let content = ''
  if (fs && path) {
    const contentPath = path.join(process.cwd(), `content/blog/${slug}/content.md`)
    try {
      content = fs.readFileSync(contentPath, 'utf-8')
    } catch {
      content = ''
    }
  }

  return { ...post, content, authorInfo, categoryInfo }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const all = getAllPosts()
  const current = all.find((p) => p.slug === currentSlug)
  if (!current) return all.slice(0, limit)

  return all
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aScore = a.tags.filter((t) => current.tags.includes(t)).length
      const bScore = b.tags.filter((t) => current.tags.includes(t)).length
      return bScore - aScore
    })
    .slice(0, limit)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
