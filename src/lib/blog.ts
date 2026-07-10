import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
  coverImage?: string;
  diagramImage?: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  return files
    .map(f => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.(md|mdx)$/, ''),
        title: data.title || '',
        date: data.date || '',
        category: data.category || 'General',
        description: data.description || '',
        content,
        coverImage: data.coverImage,
        diagramImage: data.diagramImage,
      } as BlogPost;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | null {
  return getAllPosts().find(p => p.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map(p => p.slug);
}
