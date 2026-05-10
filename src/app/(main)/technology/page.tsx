"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, Clock, Tag, User } from "lucide-react";

// ── Types ────────────────────────────────────────────────────

interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  featuredImage: string;
  tags: string[];
  readingTime: number;
  seoKeywords: string[];
  content?: string;
  imageUrl?: string;
}

interface Manifest {
  updatedAt: string;
  posts: Post[];
  categories: { slug: string; name: string }[];
  authors: { slug: string; name: string; avatar: string }[];
}

// ── GitHub Raw base ──────────────────────────────────────────

const RAW_BASE =
  "https://raw.githubusercontent.com/cpu152650311-coder/huaxingrobot/main";

// ── Simple markdown → HTML (no extra deps) ───────────────────

function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold mt-5 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    // Bold, italic, strikethrough
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    // Ordered lists (simple — lines starting with "1. ", "2. ", etc.)
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1">$2</li>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li class="ml-5 list-disc mb-1">$2</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-3 border-primary/30 pl-4 italic text-muted-foreground my-3">$1</blockquote>')
    // Paragraphs: double newline → close + open paragraph
    .replace(/\n\n/g, "</p><p class=\"mb-4 leading-relaxed text-foreground/85\">")
    // Single newline → <br />
    .replace(/\n/g, "<br />");

  return '<p class="mb-4 leading-relaxed text-foreground/85">' + html + "</p>";
}

// ── Component ─────────────────────────────────────────────────

export default function TechnologyPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [postHtml, setPostHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState("");

  const posts: Post[] = manifest?.posts ?? [];

  // ── Fetch manifest on mount ────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${RAW_BASE}/content/blog/manifest.json`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Manifest = await res.json();
        if (cancelled) return;
        setManifest(data);
        if (data.posts?.length > 0) {
          setSelectedSlug(data.posts[0].slug);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Load post content when slug changes ────────────────────

  const loadPost = useCallback(async (slug: string) => {
    setContentLoading(true);
    setPostHtml("");

    // Try inline content first (old format)
    const meta = posts.find((p) => p.slug === slug);
    if (meta?.content) {
      setPostHtml(meta.content);
      setContentLoading(false);
      return;
    }

    // Fetch markdown from GitHub Raw (new format)
    try {
      const res = await fetch(
        `${RAW_BASE}/content/blog/${slug}/content.md`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const md = await res.text();
        setPostHtml(markdownToHtml(md));
      } else if (res.status === 404) {
        setPostHtml(
          '<p class="text-muted-foreground italic">This post is being generated. Content will appear shortly after the next scheduled pipeline run.</p>'
        );
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      setPostHtml(
        '<p class="text-red-500">Failed to load post content. Please try again later.</p>'
      );
    } finally {
      setContentLoading(false);
    }
  }, [posts]);

  useEffect(() => {
    if (selectedSlug) loadPost(selectedSlug);
  }, [selectedSlug, loadPost]);

  // ── Handle slug from URL hash ──────────────────────────────

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && posts.some((p) => p.slug === hash)) {
      setSelectedSlug(hash);
    }
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (h && posts.some((p) => p.slug === h)) setSelectedSlug(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [posts]);

  // ── Derive selected post ───────────────────────────────────

  const selected = posts.find((p) => p.slug === selectedSlug) ?? null;

  // ── Render helpers ─────────────────────────────────────────

  const categoryLabel =
    manifest?.categories?.find((c) => c.slug === selected?.category)?.name ??
    selected?.category ??
    "";

  // ── Loading state ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Failed to load blog</p>
          <p className="text-muted-foreground text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Posts Yet</h1>
        <p className="text-muted-foreground">
          Blog posts will appear here once the automated pipeline generates them.
        </p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="container max-w-6xl mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Technology Blog
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Insights on service robotics, autonomous cleaning, and commercial
            automation. Data-driven analysis for industry professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* ── Sidebar: post list ─────────────────────────── */}
          <aside>
            <nav className="space-y-1" aria-label="Blog posts">
              {posts.map((post) => {
                const isActive = post.slug === selectedSlug;
                return (
                  <button
                    key={post.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(post.slug);
                      window.location.hash = post.slug;
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      {manifest?.categories?.find((c) => c.slug === post.category)?.name ??
                        post.category}
                    </div>
                    <div className="font-medium leading-snug">{post.title}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTime} min</span>
                      <span className="opacity-40">·</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Main: post content ─────────────────────────── */}
          <main>
            {selected ? (
              <article>
                {/* Meta header */}
                <div className="mb-8 pb-6 border-b border-border">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {categoryLabel}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold mt-2 mb-3">
                    {selected.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {selected.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {selected.author}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {selected.readingTime} min read
                    </span>
                    <span>
                      {new Date(selected.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                {contentLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div
                    className="prose-custom"
                    dangerouslySetInnerHTML={{ __html: postHtml }}
                  />
                )}
              </article>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
